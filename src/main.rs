//! Calendar app — sidecar with embedded axum server (scheme 3: embedded axum + UDS).
//!
//! Routes are proxied from the main server `/api/apps/calendar/<rest>`.

const MANIFEST: &str = include_str!("../tokimo-app.toml");

mod app_server;
mod assets;
mod handlers;

use std::sync::Arc;

use clap::Parser;
use tokimo_bus_client::{BusClient, ClientConfig};
use tracing::{error, info};

#[derive(Parser, Debug)]
#[command(
    name = "tokimo-app-calendar",
    about = "Calendar — Tokimo sub-app",
    term_width = 100
)]
struct Cli {}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let _ = Cli::parse();

    if std::env::var_os("TOKIMO_BUS_SOCKET").is_some() {
        tracing_subscriber::fmt()
            .with_env_filter(
                tracing_subscriber::EnvFilter::try_from_default_env()
                    .unwrap_or_else(|_| "info,tokimo_bus_client=info,tokimo_app_calendar=debug".into()),
            )
            .init();
        if let Err(e) = run_server().await {
            error!(error = %e, "calendar: fatal");
            std::process::exit(1);
        }
    } else {
        use clap::CommandFactory;
        let mut cmd = Cli::command();
        tokimo_bus_cli::print_help_unified(&mut cmd);
        std::process::exit(0);
    }

    Ok(())
}

async fn run_server() -> anyhow::Result<()> {
    let cfg = ClientConfig::from_env().map_err(|e| anyhow::anyhow!("ClientConfig: {e}"))?;
    info!(endpoint = ?cfg.endpoint, "calendar: connecting to broker");

    let http = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(30))
        .build()?;
    let ctx = Arc::new(handlers::AppCtx { http });

    let app_socket = app_server::spawn("calendar", Arc::clone(&ctx))
        .await
        .map_err(|e| anyhow::anyhow!("app_server spawn: {e}"))?;

    let client = BusClient::builder(cfg)
        .service("calendar", env!("CARGO_PKG_VERSION"))
        .data_plane(app_socket)
        .build()
        .await
        .map_err(|e| anyhow::anyhow!("bus build: {e}"))?;

    info!("calendar: registered with broker");

    let shutdown = {
        let client = Arc::clone(&client);
        tokio::spawn(async move { client.run_until_shutdown().await })
    };

    tokio::select! {
        _ = tokio::signal::ctrl_c() => {
            info!("calendar: SIGINT received");
            client.shutdown();
        }
        _ = shutdown => info!("calendar: broker sent Shutdown"),
    }

    Ok(())
}
