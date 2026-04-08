use axum::{Router, routing::get};
use std::sync::Arc;

use crate::AppState;
use crate::apps::calendar::handlers::holiday;

pub fn build_calendar_app_routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/api/holidays", get(holiday::get_holidays))
        .route("/api/holidays/long-weekends", get(holiday::get_long_weekends))
        .route("/api/holidays/countries", get(holiday::get_available_countries))
        .route("/api/holidays/next", get(holiday::get_next_holidays))
}
