const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const vendorDir = path.join(root, "app", "vendor");

const filesToCopy = [
  {
    src: "node_modules/bootstrap/dist/css/bootstrap.min.css",
    dest: "bootstrap/bootstrap.min.css"
  },
  {
    src: "node_modules/bootstrap/dist/css/bootstrap.min.css.map",
    dest: "bootstrap/bootstrap.min.css.map"
  },
  {
    src: "node_modules/jquery/dist/jquery.slim.min.js",
    dest: "jquery/jquery.slim.min.js"
  },
  {
    src: "node_modules/popper.js/dist/umd/popper.min.js",
    dest: "popper/popper.min.js"
  },
  {
    src: "node_modules/popper.js/dist/umd/popper.min.js.map",
    dest: "popper/popper.min.js.map"
  },
  {
    src: "node_modules/bootstrap/dist/js/bootstrap.min.js",
    dest: "bootstrap/bootstrap.min.js"
  },
  {
    src: "node_modules/bootstrap/dist/js/bootstrap.min.js.map",
    dest: "bootstrap/bootstrap.min.js.map"
  },
  {
    src: "node_modules/jspdf/dist/jspdf.debug.js",
    dest: "jspdf/jspdf.debug.js"
  },
  {
    src: "node_modules/d3/dist/d3.min.js",
    dest: "d3/d3.min.js"
  },
  {
    src: "node_modules/d3-color-difference/build/d3-color-difference.min.js",
    dest: "d3-color-difference/d3-color-difference.min.js"
  },
  {
    src: "node_modules/cropperjs/dist/cropper.min.css",
    dest: "cropperjs/cropper.min.css"
  },
  {
    src: "node_modules/cropperjs/dist/cropper.min.js",
    dest: "cropperjs/cropper.min.js"
  },
  {
    src: "node_modules/firebase/firebase-app.js",
    dest: "firebase/firebase-app.js"
  },
  {
    src: "node_modules/firebase/firebase-app.js.map",
    dest: "firebase/firebase-app.js.map"
  },
  {
    src: "node_modules/firebase/firebase-database.js",
    dest: "firebase/firebase-database.js"
  },
  {
    src: "node_modules/firebase/firebase-database.js.map",
    dest: "firebase/firebase-database.js.map"
  }
];

function ensureDirectory(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function copyFile(relativeSrc, relativeDest) {
  const src = path.join(root, relativeSrc);
  const dest = path.join(vendorDir, relativeDest);
  if (!fs.existsSync(src)) {
    throw new Error(`Missing source file: ${relativeSrc}`);
  }
  ensureDirectory(dest);
  fs.copyFileSync(src, dest);
}

filesToCopy.forEach(({ src, dest }) => copyFile(src, dest));
console.log(`Synced ${filesToCopy.length} vendor files to app/vendor`);
