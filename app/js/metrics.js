const TS_ROUND_GRANULARITY = 1000;
const DAY_ROUND_MS = 8.64e7;
const LOW_RES_RECOMMENDATION_EVENTS = Object.freeze({
    GENERATE_START: "lowres_generate_start",
    GENERATE_SUCCESS: "lowres_generate_success",
    GENERATE_FAILED: "lowres_generate_failed",
    OPTION_PREVIEW: "lowres_option_preview",
    APPLY_SUCCESS: "lowres_apply_success",
    APPLY_FAILED: "lowres_apply_failed",
    PROFILE_SAVE_SUCCESS: "lowres_profile_save_success",
    PROFILE_SAVE_FAILED: "lowres_profile_save_failed",
    PROFILE_APPLY_SUCCESS: "lowres_profile_apply_success",
    PROFILE_APPLY_FAILED: "lowres_profile_apply_failed",
});

function getMetricsDatabase() {
    return window.firebase?.database?.() || null;
}

function recordRecommendationMetric(eventName, metadata = {}) {
    const metricsDatabase = getMetricsDatabase();
    if (!metricsDatabase) {
        return;
    }
    const safeName = String(eventName || "unknown").replace(/[^a-z0-9_-]/gi, "_");
    const loggingTimestamp = Math.floor((Date.now() - (Date.now() % DAY_ROUND_MS)) / 1000);
    try {
        metricsDatabase.ref(`/recommendation-events/${safeName}/total`).transaction((count) => (count || 0) + 1);
        metricsDatabase
            .ref(`/recommendation-events/${safeName}/per-day/${loggingTimestamp}`)
            .transaction((count) => (count || 0) + 1);
        if (Object.keys(metadata).length > 0) {
            metricsDatabase.ref(`/recommendation-events/${safeName}/last-metadata`).set(metadata);
        }
    } catch (_e) {
        // fail silently for optional metrics
    }
}

function recordLowResRecommendationMetric(eventName, metadata = {}) {
    recordRecommendationMetric(eventName, {
        ...metadata,
        mode: "lowres",
    });
}

window.LARMetrics = {
    recordRecommendationMetric,
    recordLowResRecommendationMetric,
    LOW_RES_RECOMMENDATION_EVENTS,
};

try {
    if (window.location.href.match("metric")) {
        const metricsDatabase = getMetricsDatabase();
        if (!metricsDatabase) {
            throw new Error("Firebase database is not available");
        }
        metricsDatabase
            .ref("/input-image-count/per-day")
            .once("value")
            .then((snapshot) => {
                document.getElementById("metrics-card").hidden = false;
                const val = snapshot.val();
                if (val != null) {
                    const mergedTSMap = {};
                    Object.keys(val).forEach((rawTS) => {
                        const roundedTS = Math.round(rawTS / TS_ROUND_GRANULARITY) * TS_ROUND_GRANULARITY;
                        mergedTSMap[roundedTS] = (mergedTSMap[roundedTS] || 0) + Number(val[rawTS]);
                    });
                    const dataPoints = Object.keys(mergedTSMap).map((ts) => {
                        return { ts: ts, count: mergedTSMap[ts] };
                    });
                    dataPoints.sort((d1, d2) => d2.ts - d1.ts);
                    dataPoints.forEach((point) => {
                        const row = document.createElement("tr");
                        const cell1 = document.createElement("td");
                        cell1.innerHTML = new Date(
                            point.ts * 1000
                            // use year.month.day.
                        ).toLocaleDateString("ko-KR");
                        const cell2 = document.createElement("td");
                        cell2.innerHTML = point.count;
                        row.appendChild(cell1);
                        row.appendChild(cell2);
                        document.getElementById("input-image-count-table").appendChild(row);
                    });
                }
            });
    }
} catch (_e) {
    // we don't care if this fails
}

export {};
