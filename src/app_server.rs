//! Embedded axum HTTP server listening on a local UDS socket.

use std::sync::Arc;

use axum::{Router, routing::get};
use tokimo_bus_protocol::{BusListener, DataPlaneSocket};
use tracing::{error, info};

use crate::{assets, handlers};

pub async fn spawn(service: &str, ctx: Arc<handlers::AppCtx>) -> anyhow::Result<DataPlaneSocket> {
    let (listener, socket) = BusListener::bind_for_app(service)?;
    info!(?socket, "calendar: app server listening");

    let router = build_router(ctx);

    tokio::spawn(async move {
        if let Err(e) = axum::serve(listener, router).await {
            error!(error = %e, "calendar: app server stopped");
        }
    });

    Ok(socket)
}

fn build_router(ctx: Arc<handlers::AppCtx>) -> Router {
    Router::new()
        .route("/countries", get(handlers::get_available_countries))
        .route("/holidays", get(handlers::get_holidays))
        .route("/long-weekends", get(handlers::get_long_weekends))
        .route("/next-holidays", get(handlers::get_next_holidays))
        .route("/assets/{*path}", get(assets::serve))
        .with_state(ctx)
}
