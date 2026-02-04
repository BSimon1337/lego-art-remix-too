// Background stud pattern generation and dark mode initialization
// This runs early (before other scripts) to set up the background and dark mode state

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function isDarkModeActive() {
    // Manual override from localStorage takes priority
    try {
        var stored = localStorage.getItem("darkMode");
        if (stored === "on") return true;
        if (stored === "off") return false;
    } catch (e) {}
    // Fall back to OS preference
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function regenerateBackground() {
    var darkMode = isDarkModeActive();

    // Sync the body class
    if (darkMode) {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }

    var canvas = document.getElementById("background-image-cache-canvas");
    var ctx = canvas.getContext("2d");

    var CIRCLE_RADIUS = 10;
    var WIDTH_COUNT = 40;
    var HEIGHT_COUNT = 20;
    var MIN_CIRCLE_BRIGHTNESS = 245;

    canvas.width = CIRCLE_RADIUS * WIDTH_COUNT;
    canvas.height = CIRCLE_RADIUS * HEIGHT_COUNT;

    for (var i = 0; i < HEIGHT_COUNT; i++) {
        for (var j = 0; j < WIDTH_COUNT; j++) {
            ctx.beginPath();
            ctx.arc(
                CIRCLE_RADIUS + 2 * i * CIRCLE_RADIUS,
                CIRCLE_RADIUS + 2 * j * CIRCLE_RADIUS,
                CIRCLE_RADIUS,
                0,
                2 * Math.PI
            );
            var brightness = MIN_CIRCLE_BRIGHTNESS + Math.floor(Math.random() * (255 - MIN_CIRCLE_BRIGHTNESS));
            if (darkMode) {
                brightness = 255 - brightness;
            }
            ctx.fillStyle = rgbToHex(brightness, brightness, brightness);
            ctx.fill();
        }
    }

    var dataURL = canvas.toDataURL("image/png", 1.0);
    document.body.style.backgroundImage = "url('" + dataURL + "')";
}

// Initialize on load
regenerateBackground();

// Re-generate if OS preference changes (only if no manual override is stored)
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    try {
        var stored = localStorage.getItem("darkMode");
        if (stored === "on" || stored === "off") return; // manual override active, ignore OS change
    } catch (e) {}
    regenerateBackground();
});
