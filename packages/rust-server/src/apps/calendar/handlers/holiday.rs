use axum::{
    extract::{Query, State},
    response::IntoResponse,
};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, OnceLock};
use ts_rs::TS;

use crate::AppState;
use crate::handlers::ok;

/// Shared `NagerDate` client to persist the in-memory cache across requests.
static NAGER_CLIENT: OnceLock<rust_client_api::metadata_providers::nager_date::NagerDateClient> = OnceLock::new();

fn get_nager_client(
    http: reqwest::Client,
) -> &'static rust_client_api::metadata_providers::nager_date::NagerDateClient {
    NAGER_CLIENT.get_or_init(|| rust_client_api::metadata_providers::nager_date::NagerDateClient::new(http))
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

/// DTO returned to the frontend.
#[derive(Debug, Serialize, Clone, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct PublicHolidayOutput {
    /// ISO date string, e.g. "2026-01-01"
    pub date: String,
    /// Localized name, e.g. "元旦"
    pub local_name: String,
    /// English name, e.g. "New Year's Day"
    pub name: String,
    /// Whether this is a nationwide holiday
    pub global: bool,
    /// Holiday types (Public, Bank, School, etc.)
    pub types: Vec<String>,
}

/// DTO for long weekend entries.
#[derive(Debug, Serialize, Clone, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct LongWeekendOutput {
    pub start_date: String,
    pub end_date: String,
    #[ts(type = "number")]
    pub day_count: u8,
    pub need_bridge_day: bool,
}

/// DTO for available country entries.
#[derive(Debug, Serialize, Clone, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct AvailableCountryOutput {
    pub country_code: String,
    pub name: String,
}

pub async fn get_holidays(State(state): State<Arc<AppState>>, Query(params): Query<HolidayQuery>) -> impl IntoResponse {
    let client = get_nager_client(state.http_client.clone());

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
            ok(output).into_response()
        }
        Err(e) => crate::error::AppError::BadRequest(e.to_string()).into_response(),
    }
}

pub async fn get_long_weekends(
    State(state): State<Arc<AppState>>,
    Query(params): Query<HolidayQuery>,
) -> impl IntoResponse {
    let client = get_nager_client(state.http_client.clone());

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
            ok(output).into_response()
        }
        Err(e) => crate::error::AppError::BadRequest(e.to_string()).into_response(),
    }
}

pub async fn get_available_countries(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let client = get_nager_client(state.http_client.clone());

    match client.get_available_countries().await {
        Ok(countries) => {
            let output: Vec<AvailableCountryOutput> = countries
                .into_iter()
                .map(|c| AvailableCountryOutput {
                    country_code: c.country_code,
                    name: c.name,
                })
                .collect();
            ok(output).into_response()
        }
        Err(e) => crate::error::AppError::BadRequest(e.to_string()).into_response(),
    }
}

pub async fn get_next_holidays(
    State(state): State<Arc<AppState>>,
    Query(params): Query<CountryQuery>,
) -> impl IntoResponse {
    let client = get_nager_client(state.http_client.clone());

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
            ok(output).into_response()
        }
        Err(e) => crate::error::AppError::BadRequest(e.to_string()).into_response(),
    }
}
