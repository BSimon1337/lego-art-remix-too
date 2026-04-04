const TS_ROUND_GRANULARITY = 1000;
const DAY_ROUND_MS = 8.64e7;

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

window.LARMetrics = {
    recordRecommendationMetric,
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
