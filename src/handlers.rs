//! Calendar app handlers — holiday data via Nager.Date API.

use std::sync::OnceLock;

use axum::{
    extract::{Query, State},
    response::IntoResponse,
    Json,
    http::StatusCode,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

pub struct AppCtx {
    pub http: reqwest::Client,
}

static NAGER_CLIENT: OnceLock<tokimo_package_client_api::metadata_providers::nager_date::NagerDateClient> =
    OnceLock::new();

fn get_nager_client(
    http: reqwest::Client,
) -> &'static tokimo_package_client_api::metadata_providers::nager_date::NagerDateClient {
    NAGER_CLIENT.get_or_init(|| {
        tokimo_package_client_api::metadata_providers::nager_date::NagerDateClient::new(http)
    })
}

#[derive(Deserialize)]
pub struct HolidayQuery {
    pub year: u16,
    #[serde(default = "default_country")]
    pub country: String,
}

#[derive(Deserialize)]
pub struct CountryQuery {
    #[serde(default = "default_country")]
    pub country: String,
}

fn default_country() -> String {
    "CN".to_string()
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PublicHolidayOutput {
    pub date: String,
    pub local_name: String,
    pub name: String,
    pub global: bool,
    pub types: Vec<String>,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct LongWeekendOutput {
    pub start_date: String,
    pub end_date: String,
    pub day_count: u8,
    pub need_bridge_day: bool,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AvailableCountryOutput {
    pub country_code: String,
    pub name: String,
}

fn app_error(msg: String) -> impl IntoResponse {
    (StatusCode::BAD_REQUEST, Json(serde_json::json!({ "error": msg })))
}

pub async fn get_holidays(
    State(ctx): State<Arc<AppCtx>>,
    Query(params): Query<HolidayQuery>,
) -> impl IntoResponse {
    let client = get_nager_client(ctx.http.clone());
    match client.get_public_holidays(params.year, &params.country).await {
        Ok(holidays) => {
            let output: Vec<PublicHolidayOutput> = holidays
                .into_iter()
                .map(|h| PublicHolidayOutput {
                    date: h.date,
                    local_name: h.local_name,
                    name: h.name,
                    global: h.global,
                    types: h.types,
                })
                .collect();
            Json(output).into_response()
        }
        Err(e) => app_error(e.to_string()).into_response(),
    }
}

pub async fn get_long_weekends(
    State(ctx): State<Arc<AppCtx>>,
    Query(params): Query<HolidayQuery>,
) -> impl IntoResponse {
    let client = get_nager_client(ctx.http.clone());
    match client.get_long_weekends(params.year, &params.country).await {
        Ok(weekends) => {
            let output: Vec<LongWeekendOutput> = weekends
                .into_iter()
                .map(|w| LongWeekendOutput {
                    start_date: w.start_date,
                    end_date: w.end_date,
                    day_count: w.day_count,
                    need_bridge_day: w.need_bridge_day,
                })
                .collect();
            Json(output).into_response()
        }
        Err(e) => app_error(e.to_string()).into_response(),
    }
}

pub async fn get_available_countries(State(ctx): State<Arc<AppCtx>>) -> impl IntoResponse {
    let client = get_nager_client(ctx.http.clone());
    match client.get_available_countries().await {
        Ok(countries) => {
            let output: Vec<AvailableCountryOutput> = countries
                .into_iter()
                .map(|c| AvailableCountryOutput {
                    country_code: c.country_code,
                    name: c.name,
                })
                .collect();
            Json(output).into_response()
        }
        Err(e) => app_error(e.to_string()).into_response(),
    }
}

pub async fn get_next_holidays(
    State(ctx): State<Arc<AppCtx>>,
    Query(params): Query<CountryQuery>,
) -> impl IntoResponse {
    let client = get_nager_client(ctx.http.clone());
    match client.get_next_public_holidays(&params.country).await {
        Ok(holidays) => {
            let output: Vec<PublicHolidayOutput> = holidays
                .into_iter()
                .map(|h| PublicHolidayOutput {
                    date: h.date,
                    local_name: h.local_name,
                    name: h.name,
                    global: h.global,
                    types: h.types,
                })
                .collect();
            Json(output).into_response()
        }
        Err(e) => app_error(e.to_string()).into_response(),
    }
}
