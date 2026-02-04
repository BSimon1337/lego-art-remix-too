// IMPORTANT: Run rebuild steps when making logic changes
const fs = require("fs");
const versionFile = fs.readFileSync("app/js/version.js", "utf8");
const VERSION_NUMBER = versionFile.match(/VERSION_NUMBER\s*=\s*"([^"]+)"/)[1];

// Rebuild steps
// TODO: add a package.json and script to run all deployment steps
// 1. Update VERSION_NUMBER in `app/js/version.js`
// 2. Run `npm install workbox-build` if it hasn't been run
// 3. Run `node build-service-worker.js`
// 4. Copy files from `app` into the static deployment thingy

const workboxBuild = require("workbox-build");
const buildSW = () => {
    return workboxBuild.generateSW({
        globDirectory: "app",
        globPatterns: ["**/*.{html,json,js,css,pdf,png,onnx}"],
        swDest: "app/service-worker.js",
        sourcemap: false,
        cacheId: VERSION_NUMBER,
        cleanupOutdatedCaches: true,
    });
};

buildSW();
