import "./background.js";
import "./core-ui-utils.js";
import "./override-history.js";
import "./bricklink-colors.js";
import "./stud-maps.js";
import { VERSION_NUMBER } from "./version.js";

function loadClassicScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
}

async function bootLegacyApp() {
  await loadClassicScript("vendor/firebase/firebase-app.js");
  await loadClassicScript("vendor/firebase/firebase-database.js");

  firebase.initializeApp({
    apiKey: "AIzaSyDZpG-5SrDxpwV9kmbwNiiKXJhg-qaH1d8",
    authDomain: "lego-art-remix-stats.firebaseapp.com",
    databaseURL: "https://lego-art-remix-stats.firebaseio.com",
    projectId: "lego-art-remix-stats",
    storageBucket: "lego-art-remix-stats.appspot.com",
    messagingSenderId: "622482243553",
    appId: "1:622482243553:web:3ef8ee3f3796190528dca0"
  });

  const orderedLegacyScripts = [
    "vendor/jquery/jquery.slim.min.js",
    "vendor/popper/popper.min.js",
    "vendor/bootstrap/bootstrap.min.js",
    "vendor/jspdf/jspdf.debug.js",
    "vendor/d3/d3.min.js",
    "vendor/d3-color-difference/d3-color-difference.min.js",
    "vendor/cropperjs/cropper.min.js",
    "js/pixi.min.js",
    "js/heap.js",
    "js/algo.js",
    "js/index.js"
  ];

  for (const src of orderedLegacyScripts) {
    await loadClassicScript(src);
  }

  await import("./ux-sharing.js");
  await import("./metrics.js");
  await import("./sw-register.js");
}

bootLegacyApp().catch((error) => {
  console.error("Failed to bootstrap app", error);
});

window.VERSION_NUMBER = VERSION_NUMBER;
