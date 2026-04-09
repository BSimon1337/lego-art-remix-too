const { test, expect } = require("@playwright/test");
const path = require("path");

async function waitForLoadingToFinish(page) {
    await page.waitForFunction(
        () =>
            getComputedStyle(document.getElementById("universal-loading-progress")).display ===
            "none",
        null,
        { timeout: 20_000 }
    );
}

test("loads app shell and key controls", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Lego Art Remix/i);
    await expect(page.locator("#input-image-selector")).toBeVisible();
    await expect(page.locator("#dark-mode-toggle")).toBeVisible();
});

test("reprocesses cleanly after changing resolution", async ({ page }) => {
    await page.goto("/");

    await page.setInputFiles(
        "#input-image-selector-hidden",
        path.resolve(__dirname, "../../app/assets/png/lenna.png")
    );

    await page.waitForSelector("#steps-row:not([hidden])");
    await waitForLoadingToFinish(page);

    await page.locator("#width-slider").evaluate((slider) => {
        slider.value = "64";
        slider.dispatchEvent(new Event("input", { bubbles: true }));
        slider.dispatchEvent(new Event("change", { bubbles: true }));
    });

    await expect(page.locator("#width-text")).toHaveText("64");
    await waitForLoadingToFinish(page);

    await expect
        .poll(async () =>
            page.locator("#step-4-canvas").evaluate((canvas) => ({
                width: canvas.width,
                height: canvas.height
            }))
        )
        .toEqual({ width: 64, height: 48 });

    await expect(page.locator("#loading-status-message")).toBeHidden();
});

test("keeps the latest resolution after rapid consecutive changes", async ({ page }) => {
    await page.goto("/");

    await page.setInputFiles(
        "#input-image-selector-hidden",
        path.resolve(__dirname, "../../app/assets/png/lenna.png")
    );

    await page.waitForSelector("#steps-row:not([hidden])");
    await waitForLoadingToFinish(page);

    await page.locator("#width-slider").evaluate((slider) => {
        slider.value = "64";
        slider.dispatchEvent(new Event("input", { bubbles: true }));
        slider.dispatchEvent(new Event("change", { bubbles: true }));
        slider.value = "96";
        slider.dispatchEvent(new Event("input", { bubbles: true }));
        slider.dispatchEvent(new Event("change", { bubbles: true }));
    });

    await expect(page.locator("#width-text")).toHaveText("96");
    await waitForLoadingToFinish(page);

    await expect
        .poll(async () =>
            page.locator("#step-4-canvas").evaluate((canvas) => ({
                width: canvas.width,
                height: canvas.height
            }))
        )
        .toEqual({ width: 96, height: 48 });

    await expect(page.locator("#loading-status-message")).toBeHidden();
});

test("reprocesses when crop interaction ends", async ({ page }) => {
    await page.goto("/");

    await page.setInputFiles(
        "#input-image-selector-hidden",
        path.resolve(__dirname, "../../app/assets/png/lenna.png")
    );

    await page.waitForSelector("#steps-row:not([hidden])");
    await waitForLoadingToFinish(page);

    const sawLoadingCycle = await page.evaluate(async () => {
        const loadingProgress = document.getElementById("universal-loading-progress");
        const cropCanvas = document.getElementById("step-1-canvas-upscaled");
        if (!loadingProgress || !cropCanvas) {
            return false;
        }

        cropCanvas.dispatchEvent(new Event("cropend", { bubbles: true }));

        const start = performance.now();
        while (performance.now() - start < 3000) {
            if (getComputedStyle(loadingProgress).display !== "none") {
                return true;
            }
            await new Promise((resolve) => requestAnimationFrame(resolve));
        }
        return false;
    });

    expect(sawLoadingCycle).toBeTruthy();
    await waitForLoadingToFinish(page);
    await expect(page.locator("#loading-status-message")).toBeHidden();
});
