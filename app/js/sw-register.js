// Service worker registration with update notification
if ("serviceWorker" in navigator && !window.location.href.match(/disableServiceWorker/gi)) {
    navigator.serviceWorker
        .register("service-worker.js")
        .then(function (registration) {
            console.log("Service worker registration successful, scope is:", registration.scope);
            registration.addEventListener("updatefound", function () {
                var newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener("statechange", function () {
                        if (newWorker.state === "activated" && navigator.serviceWorker.controller) {
                            var banner = document.createElement("div");
                            banner.style.cssText =
                                "position:fixed;bottom:0;left:0;right:0;background:#17a2b8;color:#fff;padding:12px;text-align:center;z-index:9999;font-size:14px;";
                            banner.innerHTML =
                                'A new version is available. <button onclick="window.location.reload()" style="margin-left:8px;padding:4px 12px;border:1px solid #fff;background:transparent;color:#fff;border-radius:4px;cursor:pointer;">Refresh</button>';
                            document.body.appendChild(banner);
                        }
                    });
                }
            });
        })
        .catch(function (error) {
            console.error("Service worker registration failed, error:", error);
        });
}
