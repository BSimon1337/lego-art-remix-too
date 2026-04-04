// Lightweight UX & sharing helpers for Lego Art Remix
// Features (MVP): project save/load (localStorage + export/import), shareable link, before/after toggle,
// export PNG/SVG, simple palette storage, basic cost estimator, batch process scaffold.

(function () {
    function getAppBridge() {
        return window.AppBridge || {};
    }

    function getVersionNumber() {
        const bridge = getAppBridge();
        return bridge.getVersionNumber ? bridge.getVersionNumber() : (window.VERSION_NUMBER || null);
    }

    function getCustomStudTableBody() {
        const bridge = getAppBridge();
        return bridge.getCustomStudTableBody ? bridge.getCustomStudTableBody() : null;
    }

    function getHexToColorNameMap() {
        const bridge = getAppBridge();
        return bridge.getHexToColorNameMap ? bridge.getHexToColorNameMap() : {};
    }

    function getAllBricklinkSolidColors() {
        const bridge = getAppBridge();
        return bridge.getAllBricklinkSolidColors ? bridge.getAllBricklinkSolidColors() : [];
    }

    function createNewCustomStudRow() {
        const bridge = getAppBridge();
        return bridge.getNewCustomStudRow ? bridge.getNewCustomStudRow() : null;
    }

    function runCustomStudMapBridge() {
        const bridge = getAppBridge();
        if (bridge.runCustomStudMap) {
            bridge.runCustomStudMap();
        }
    }

    function handleInputImageBridge(e, dontClearDepth, dontLog) {
        const bridge = getAppBridge();
        if (bridge.handleInputImage) {
            return bridge.handleInputImage(e, dontClearDepth, dontLog);
        }
        return null;
    }

    function log(...args) {
        if (window.console) console.log('[ux-sharing]', ...args);
    }

    function getElement(id) {
        return document.getElementById(id);
    }

    function getCanvasDataURL(canvasEl) {
        try {
            if (!canvasEl) return null;
            return canvasEl.toDataURL();
        } catch (e) {
            return null;
        }
    }

    function getProjectState() {
        const state = {};
        try {
            state.version = getVersionNumber();
            state.width = getElement('width-slider') ? getElement('width-slider').value : null;
            state.height = getElement('height-slider') ? getElement('height-slider').value : null;
            const inputCanvas = getElement('input-canvas');
            state.inputImage = getCanvasDataURL(inputCanvas);
            const finalCanvas = getElement('step-4-canvas-upscaled') || getElement('step-4-canvas');
            state.finalImage = getCanvasDataURL(finalCanvas);
            // Save basic UI settings
            state.quantization = getElement('quantization-algorithm-button') ? getElement('quantization-algorithm-button').innerText : null;
            state.distanceFunction = getElement('distance-function-button') ? getElement('distance-function-button').innerText : null;
            // custom palettes
            try {
                state.palettes = JSON.parse(localStorage.getItem('lar_palettes') || '[]');
            } catch (e) {
                state.palettes = [];
            }
            return state;
        } catch (e) {
            log('getProjectState error', e);
            return {};
        }
    }

    function setProjectState(state) {
        if (!state) return;
        try {
            if (state.width && getElement('width-slider')) getElement('width-slider').value = state.width;
            if (state.height && getElement('height-slider')) getElement('height-slider').value = state.height;
            if (state.quantization && getElement('quantization-algorithm-button')) getElement('quantization-algorithm-button').innerText = state.quantization;
            if (state.distanceFunction && getElement('distance-function-button')) getElement('distance-function-button').innerText = state.distanceFunction;
            if (state.palettes) localStorage.setItem('lar_palettes', JSON.stringify(state.palettes));

            // restore input image visually
            if (state.inputImage) {
                const img = new Image();
                img.onload = function () {
                    const inputCanvas = getElement('input-canvas');
                    if (inputCanvas) {
                        inputCanvas.width = img.width;
                        inputCanvas.height = img.height;
                        const ctx = inputCanvas.getContext('2d');
                        ctx.clearRect(0,0,inputCanvas.width,inputCanvas.height);
                        ctx.drawImage(img, 0, 0);
                    }
                };
                img.src = state.inputImage;
            }

            // restore final image visually
            if (state.finalImage) {
                const img2 = new Image();
                img2.onload = function () {
                    const finalCanvas = getElement('step-4-canvas-upscaled') || getElement('step-4-canvas');
                    if (finalCanvas) {
                        finalCanvas.width = img2.width;
                        finalCanvas.height = img2.height;
                        const ctx2 = finalCanvas.getContext('2d');
                        ctx2.clearRect(0,0,finalCanvas.width,finalCanvas.height);
                        ctx2.drawImage(img2, 0, 0);
                    }
                };
                img2.src = state.finalImage;
            }

            alert('Project loaded visually. Note: this is a snapshot, not a full pipeline restore. Use Export/Import to transfer projects.');
        } catch (e) {
            log('setProjectState error', e);
        }
    }

    function saveProjectToLocal() {
        const state = getProjectState();
        try {
            localStorage.setItem('lar_last_project', JSON.stringify(state));
            alert('Project saved locally.');
        } catch (e) {
            alert('Failed to save project: ' + e.message);
        }
    }

    function loadProjectFromLocal() {
        try {
            const raw = localStorage.getItem('lar_last_project');
            if (!raw) { alert('No saved project found.'); return; }
            const state = JSON.parse(raw);
            setProjectState(state);
        } catch (e) {
            alert('Failed to load project: ' + e.message);
        }
    }

    function exportProjectAsJSON() {
        const state = getProjectState();
        const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lego-art-remix-project.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    function importProjectFromFile(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const state = JSON.parse(e.target.result);
                setProjectState(state);
            } catch (err) {
                alert('Invalid project file');
            }
        };
        reader.readAsText(file);
    }

    function generateShareableLink() {
        const state = getProjectState();
        try {
            const json = JSON.stringify(state);
            const b64 = btoa(unescape(encodeURIComponent(json)));
            const url = window.location.origin + window.location.pathname + '#project=' + b64;
            // try copy to clipboard
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(() => alert('Shareable link copied to clipboard'));
            } else {
                prompt('Shareable link (copy):', url);
            }
        } catch (e) {
            alert('Failed to generate shareable link: ' + e.message);
        }
    }

    function loadProjectFromHash() {
        try {
            const hash = window.location.hash || '';
            if (!hash.startsWith('#project=')) return false;
            const b64 = hash.replace('#project=', '');
            const json = decodeURIComponent(escape(atob(b64)));
            const state = JSON.parse(json);
            setProjectState(state);
            return true;
        } catch (e) {
            log('loadProjectFromHash error', e);
            return false;
        }
    }

    function toggleBeforeAfter() {
        const final = getElement('step-4-canvas-upscaled') || getElement('step-4-canvas');
        const input = getElement('step-1-canvas-upscaled') || getElement('input-canvas');
        if (!final || !input) { alert('Canvases not found'); return; }

        const containerId = 'lar-before-after-container';
        let container = getElement(containerId);
        if (container) {
            container.remove();
            // show original layout
            final.style.display = '';
            return;
        }
        container = document.createElement('div');
        container.id = containerId;
        container.style = 'display:flex; gap:8px; align-items:flex-start; margin-top:8px;';
        const left = document.createElement('div');
        const right = document.createElement('div');
        left.appendChild(input.cloneNode(true));
        right.appendChild(final.cloneNode(true));
        container.appendChild(left);
        container.appendChild(right);
        // hide original final
        final.style.display = 'none';
        const parent = final.parentElement || document.body;
        parent.appendChild(container);
    }

    function downloadDataURL(dataURL, filename) {
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    function exportFinalPNG() {
        const final = getElement('step-4-canvas-upscaled') || getElement('step-4-canvas');
        if (!final) { alert('Final canvas not found'); return; }
        const url = final.toDataURL('image/png');
        downloadDataURL(url, 'lego-art-remix-final.png');
    }

    function exportFinalSVG() {
        const final = getElement('step-4-canvas-upscaled') || getElement('step-4-canvas');
        if (!final) { alert('Final canvas not found'); return; }
        const png = final.toDataURL('image/png');
        const svg = `<?xml version="1.0" standalone="no"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${final.width}" height="${final.height}">\n  <image href="${png}" width="${final.width}" height="${final.height}"/>\n</svg>`;
        const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lego-art-remix-final.svg';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    // Palettes overlay: interactive management and apply-to-custom-studs
    function openPalettesPrompt() {
        // remove existing overlay if present
        const existing = getElement('lar-palettes-overlay');
        if (existing) { existing.remove(); return; }

        const raw = localStorage.getItem('lar_palettes') || '[]';
        let palettes = [];
        try { palettes = JSON.parse(raw); } catch (e) { palettes = []; }

        const overlay = document.createElement('div');
        overlay.id = 'lar-palettes-overlay';
        overlay.style = 'position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); background:#fff; border:1px solid #ccc; padding:12px; z-index:10000; max-width:720px; width:90%; max-height:80vh; overflow:auto; box-shadow:0 10px 30px rgba(0,0,0,0.2);';

        const header = document.createElement('div');
        header.style = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;';
        const title = document.createElement('div');
        title.innerText = 'Palettes';
        title.style.fontWeight = '700';
        header.appendChild(title);
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn btn-sm btn-secondary';
        closeBtn.innerText = 'Close';
        closeBtn.onclick = () => overlay.remove();
        header.appendChild(closeBtn);
        overlay.appendChild(header);

        const list = document.createElement('div');
        list.style = 'display:flex; flex-direction:column; gap:8px;';

        function renderPalettes() {
            list.innerHTML = '';
            if (!palettes || palettes.length === 0) {
                const none = document.createElement('div');
                none.innerText = '(no palettes saved)';
                none.style.color = '#666';
                list.appendChild(none);
                return;
            }
            palettes.forEach((p, idx) => {
                const row = document.createElement('div');
                row.style = 'display:flex; align-items:center; justify-content:space-between; gap:8px; border:1px solid #eee; padding:8px; border-radius:6px;';
                const info = document.createElement('div');
                info.style = 'display:flex; align-items:center; gap:8px;';
                const swatches = document.createElement('div');
                swatches.style = 'display:flex; gap:6px; align-items:center;';
                p.colors.forEach(hex => {
                    const box = document.createElement('div');
                    box.style = `width:28px; height:20px; background:${hex}; border:1px solid rgba(0,0,0,0.15); border-radius:4px;`;
                    swatches.appendChild(box);
                });
                info.appendChild(swatches);
                const name = document.createElement('div');
                name.innerText = p.name;
                name.style.fontWeight = '600';
                info.appendChild(name);
                row.appendChild(info);

                const actions = document.createElement('div');
                actions.style = 'display:flex; gap:8px;';
                const applyBtn = document.createElement('button');
                applyBtn.className = 'btn btn-sm btn-primary';
                applyBtn.innerText = 'Apply Palette';
                applyBtn.onclick = () => {
                    // apply: clear custom table and add rows for each color
                    const customStudTableBody = getCustomStudTableBody();
                    if (!customStudTableBody) {
                        alert('Custom studs table not found');
                        return;
                    }
                    customStudTableBody.innerHTML = '';
                    p.colors.forEach(hex => {
                        const studRow = createNewCustomStudRow();
                        if (!studRow) return;
                        // set color square
                        try {
                            studRow.children[0].children[0].children[0].children[0].style.backgroundColor = hex;
                            const colorNameMap = getHexToColorNameMap();
                            studRow.children[0].children[0].setAttribute('title', colorNameMap[hex] ? colorNameMap[hex] : hex);
                        } catch (e) {}
                        // set default count if number input exists
                        try {
                            const numberInput = studRow.children[1].children[0].children[0];
                            if (numberInput && numberInput.tagName === 'INPUT') numberInput.value = 50;
                        } catch (e) {}
                        customStudTableBody.appendChild(studRow);
                    });
                    runCustomStudMapBridge();
                    overlay.remove();
                };
                const editBtn = document.createElement('button');
                editBtn.className = 'btn btn-sm btn-outline-secondary';
                editBtn.innerText = 'Edit';
                editBtn.onclick = () => {
                    // open quick edit modal for this palette
                    const newName = prompt('Palette name:', p.name);
                    if (!newName) return;
                    const colors = prompt('Comma-separated hex colors:', p.colors.join(','));
                    if (!colors) return;
                    const arr = colors.split(',').map(s=>s.trim()).filter(Boolean);
                    palettes[idx] = { name: newName, colors: arr };
                    localStorage.setItem('lar_palettes', JSON.stringify(palettes));
                    renderPalettes();
                };
                const delBtn = document.createElement('button');
                delBtn.className = 'btn btn-sm btn-danger';
                delBtn.innerText = 'Delete';
                delBtn.onclick = () => {
                    if (!confirm('Delete palette "' + p.name + '"?')) return;
                    palettes.splice(idx,1);
                    localStorage.setItem('lar_palettes', JSON.stringify(palettes));
                    renderPalettes();
                };
                actions.appendChild(applyBtn);
                actions.appendChild(editBtn);
                actions.appendChild(delBtn);
                row.appendChild(actions);
                list.appendChild(row);
            });
        }

        overlay.appendChild(list);

        // create new palette controls
        const creator = document.createElement('div');
        creator.style = 'margin-top:12px; padding-top:12px; border-top:1px solid #eee;';
        const creatorTitle = document.createElement('div');
        creatorTitle.innerText = 'Create New Palette';
        creatorTitle.style = 'font-weight:600; margin-bottom:8px;';
        creator.appendChild(creatorTitle);
        
        const nameInputRow = document.createElement('div');
        nameInputRow.style = 'display:flex; gap:8px; margin-bottom:8px;';
        const nameInput = document.createElement('input');
        nameInput.placeholder = 'Palette name';
        nameInput.className = 'form-control form-control-sm';
        nameInput.style = 'max-width:200px;';
        nameInputRow.appendChild(nameInput);
        creator.appendChild(nameInputRow);

        // color picker section
        const colorPickerLabel = document.createElement('div');
        colorPickerLabel.innerText = 'Select colors:';
        colorPickerLabel.style = 'font-size:12px; font-weight:600; margin-bottom:6px;';
        creator.appendChild(colorPickerLabel);

        // available colors grid
        const colorGrid = document.createElement('div');
        colorGrid.style = 'display:grid; grid-template-columns:repeat(auto-fill, minmax(36px, 1fr)); gap:6px; margin-bottom:8px; max-height:150px; overflow-y:auto; padding:8px; border:1px solid #ddd; border-radius:4px;';
        
        const selectedColors = [];
        const palette = getAllBricklinkSolidColors();
        
        // palette health indicator
        const healthDiv = document.createElement('div');
        healthDiv.style = 'margin-bottom:8px; padding:8px; border-radius:4px; font-size:12px; display:none;';
        const updateHealth = () => {
            const count = selectedColors.length;
            let status = '';
            let bgColor = '';
            if (count === 0) {
                status = '○ Select colors to build a palette';
                bgColor = '#f0f0f0';
            } else if (count < 3) {
                status = '⚠ Too few colors (< 3): Limited detail & color coverage';
                bgColor = '#fff3cd';
            } else if (count <= 12) {
                status = '✓ Ideal palette (' + count + ' colors): Good balance of detail & complexity';
                bgColor = '#d4edda';
            } else if (count <= 15) {
                status = '⚠ Many colors (' + count + '): More detail, but may need more pieces';
                bgColor = '#fff3cd';
            } else {
                status = '✗ Too many colors (' + count + '): Likely to exceed piece budget';
                bgColor = '#f8d7da';
            }
            healthDiv.innerText = status;
            healthDiv.style.backgroundColor = bgColor;
            healthDiv.style.display = 'block';
        };
        creator.appendChild(healthDiv);
        
        palette.forEach(color => {
            const colorBox = document.createElement('div');
            colorBox.style = `width:36px; height:36px; background:${color.hex}; border:2px solid transparent; border-radius:4px; cursor:pointer; transition:all 0.2s;`;
            colorBox.title = color.name || color.hex;
            colorBox.onclick = () => {
                if (selectedColors.includes(color.hex)) {
                    selectedColors.splice(selectedColors.indexOf(color.hex), 1);
                    colorBox.style.border = '2px solid transparent';
                } else {
                    selectedColors.push(color.hex);
                    colorBox.style.border = '2px solid #000';
                }
                previewSwatch.innerHTML = '';
                selectedColors.forEach(hex => {
                    const sw = document.createElement('div');
                    sw.style = `display:inline-block; width:24px; height:24px; background:${hex}; border:1px solid #999; margin-right:4px; border-radius:2px;`;
                    previewSwatch.appendChild(sw);
                });
                updateHealth();
            };
            colorGrid.appendChild(colorBox);
        });
        creator.appendChild(colorGrid);

        // preview of selected colors
        const previewLabel = document.createElement('div');
        previewLabel.innerText = 'Selected:';
        previewLabel.style = 'font-size:12px; font-weight:600; margin-bottom:4px;';
        creator.appendChild(previewLabel);
        const previewSwatch = document.createElement('div');
        previewSwatch.style = 'margin-bottom:8px; padding:4px; border:1px solid #ddd; border-radius:4px; min-height:28px; display:flex; align-items:center;';
        creator.appendChild(previewSwatch);

        // add button
        const addBtn = document.createElement('button');
        addBtn.className = 'btn btn-sm btn-info';
        addBtn.innerText = 'Add Palette';
        addBtn.onclick = () => {
            const nm = nameInput.value.trim();
            if (!nm || selectedColors.length === 0) { alert('Provide palette name and select at least one color'); return; }
            palettes.push({ name: nm, colors: selectedColors.slice() });
            localStorage.setItem('lar_palettes', JSON.stringify(palettes));
            nameInput.value = '';
            selectedColors.length = 0;
            previewSwatch.innerHTML = '';
            colorGrid.querySelectorAll('div').forEach(box => box.style.border = '2px solid transparent');
            renderPalettes();
        };
        creator.appendChild(addBtn);
        overlay.appendChild(creator);

        // render and show
        renderPalettes();
        document.body.appendChild(overlay);
    }

    // Basic cost estimator: reads #studs-used-table-body and multiplies by per-piece default price
    function estimateCost() {
        const tbody = getElement('studs-used-table-body');
        if (!tbody) { alert('Pieces table not available yet'); return; }
        const rows = Array.from(tbody.querySelectorAll('tr'));
        let total = 0;
        const priceDefaults = JSON.parse(localStorage.getItem('lar_piece_price_defaults') || '{}');
        const details = [];
        rows.forEach(row => {
            const tds = row.querySelectorAll('td');
            if (tds.length < 2) return;
            const colorLabel = tds[0].innerText.trim();
            const countText = tds[tds.length-1].innerText.trim();
            const count = parseInt(countText, 10) || 0;
            // try to map label to hex if possible (label may be color name). Fallback to label.
            let price = priceDefaults[colorLabel] || priceDefaults['default'] || 0.12; // default $0.12/piece
            total += price * count;
            details.push(`${colorLabel}: ${count} x $${price.toFixed(2)} = $${(price*count).toFixed(2)}`);
        });
        alert(`Estimated cost:\n${details.join('\n')}\n\nTotal: $${total.toFixed(2)}`);
    }

    // --- Color recommendation ---
    function hexToRgbLocal(hex) {
        if (!hex) return null;
        const h = hex.replace('#','');
        const bigint = parseInt(h, 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    }

    function colorDistanceSq(c1, c2) {
        const dr = c1[0]-c2[0];
        const dg = c1[1]-c2[1];
        const db = c1[2]-c2[2];
        return dr*dr+dg*dg+db*db;
    }

    function recommendColors(k) {
        const inputCanvas = getElement('input-canvas') || getElement('step-1-canvas-upscaled');
        if (!inputCanvas) { alert('Input canvas not found'); return; }
        const ctx = inputCanvas.getContext('2d');
        let w = inputCanvas.width, h = inputCanvas.height;
        if (w === 0 || h === 0) { alert('Input canvas is empty'); return; }
        const maxSamples = 5000;
        const imageData = ctx.getImageData(0,0,w,h).data;
        const totalPixels = w*h;
        const step = Math.max(1, Math.floor(Math.sqrt((totalPixels)/maxSamples)));
        const counts = {};
        // precompute palette rgb
        const palette = getAllBricklinkSolidColors();
        const paletteRgb = palette.map(p=>({hex:p.hex, name:p.name, rgb:hexToRgbLocal(p.hex)}));
        for (let y=0;y<h;y+=step) {
            for (let x=0;x<w;x+=step) {
                const idx = (y*w + x)*4;
                const r = imageData[idx], g = imageData[idx+1], b = imageData[idx+2];
                let best = null, bestDist = Infinity;
                for (let i=0;i<paletteRgb.length;i++) {
                    const p = paletteRgb[i];
                    const d = colorDistanceSq([r,g,b], p.rgb);
                    if (d < bestDist) { bestDist = d; best = p; }
                }
                if (best) counts[best.hex] = (counts[best.hex]||0)+1;
            }
        }
        const colorNameMap = getHexToColorNameMap();
        const entries = Object.keys(counts).map(hex=>({hex, count:counts[hex], name:(colorNameMap[hex]) || (palette.find(p=>p.hex===hex)||{}).name || hex}));
        entries.sort((a,b)=>b.count-a.count);
        const topK = entries.slice(0,k||12);
        showRecommendationOverlay(topK);
    }

    function showRecommendationOverlay(entries) {
        // remove existing overlay
        const existing = getElement('lar-recommend-overlay');
        if (existing) existing.remove();
        const overlay = document.createElement('div');
        overlay.id = 'lar-recommend-overlay';
        overlay.style = 'position:fixed; right:12px; top:60px; background:white; border:1px solid #ccc; padding:12px; z-index:9999; max-width:360px; box-shadow:0 6px 18px rgba(0,0,0,0.12);';
        const title = document.createElement('div');
        title.innerText = 'Recommended Bricklink Colors';
        title.style.fontWeight = '600';
        title.style.marginBottom = '8px';
        overlay.appendChild(title);
        const list = document.createElement('div');
        list.style.display = 'flex';
        list.style.flexWrap = 'wrap';
        list.style.gap = '6px';
        entries.forEach(e=>{
            const sw = document.createElement('div');
            sw.style = 'display:flex; flex-direction:column; align-items:center; width:64px; padding:4px; border-radius:4px; border:1px solid #eee;';
            const box = document.createElement('div');
            box.style = `width:40px; height:24px; background:${e.hex}; border:1px solid #999; margin-bottom:4px;`;
            const label = document.createElement('div');
            label.style = 'font-size:11px; text-align:center;';
            label.innerText = (e.name || e.hex).slice(0,18);
            const count = document.createElement('div');
            count.style = 'font-size:10px; color:#666;';
            count.innerText = `${e.count} px`;
            sw.appendChild(box);
            sw.appendChild(label);
            sw.appendChild(count);
            list.appendChild(sw);
        });
        overlay.appendChild(list);
        const actions = document.createElement('div');
        actions.style = 'margin-top:8px; display:flex; gap:8px;';
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-sm btn-primary';
        saveBtn.innerText = 'Save as Palette';
        saveBtn.onclick = function () {
            const name = prompt('Palette name for recommended colors:');
            if (!name) return;
            const arr = entries.map(e=>e.hex);
            const raw = localStorage.getItem('lar_palettes') || '[]';
            let palettes = [];
            try { palettes = JSON.parse(raw);}catch(e){palettes=[]}
            palettes.push({name:name, colors:arr});
            localStorage.setItem('lar_palettes', JSON.stringify(palettes));
            alert('Palette saved');
        };
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn btn-sm btn-secondary';
        closeBtn.innerText = 'Close';
        closeBtn.onclick = ()=> overlay.remove();
        actions.appendChild(saveBtn);
        actions.appendChild(closeBtn);
        overlay.appendChild(actions);
        document.body.appendChild(overlay);
    }


    // Batch process scaffold: allow user to select multiple images and queues them for manual processing
    function openBatchInput() {
        const input = getElement('batch-images-input');
        if (!input) return;
        input.value = null;
        input.click();
    }

    function handleBatchFiles(files) {
        if (!files || files.length === 0) return;
        alert(`Selected ${files.length} files. This is a scaffold: images will be queued visually in the input canvas. You can export each result manually.`);
        const runNext = (index) => {
            if (index >= files.length) { alert('Batch scaffold finished.'); return; }
            const file = files[index];
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    const inputCanvas = getElement('input-canvas');
                    if (inputCanvas) {
                        inputCanvas.width = img.width;
                        inputCanvas.height = img.height;
                        const ctx = inputCanvas.getContext('2d');
                        ctx.clearRect(0,0,inputCanvas.width,inputCanvas.height);
                        ctx.drawImage(img, 0, 0);
                    }
                    // TODO: automatically run pipeline. For now, pause and ask user to run processing.
                    if (confirm(`Loaded ${file.name}. Run processing now?`)) {
                        // attempt to trigger the same function index.js uses for input selection
                        try {
                            const eFake = { target: { files: [file] } };
                            const maybePromise = handleInputImageBridge(eFake, true, true);
                            if (maybePromise == null) {
                                alert('Processing function not available; please run manually.');
                            } else {
                                Promise.resolve(maybePromise).catch((err) => log('batch process error', err));
                            }
                        } catch (e) {
                            log('batch process error', e);
                        }
                    }
                    // continue to next after user confirmation
                    setTimeout(() => runNext(index+1), 200);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        };
        runNext(0);
    }

    const RECOMMENDATION_PROFILE_STORAGE_KEY = 'lar_recommendation_profiles';

    function getStoredRecommendationProfiles() {
        try {
            return JSON.parse(localStorage.getItem(RECOMMENDATION_PROFILE_STORAGE_KEY) || '[]');
        } catch (_e) {
            return [];
        }
    }

    function serializeRecommendationProfile(profile) {
        if (!profile || !profile.profileId || !profile.paletteId || !profile.pictureSettings) {
            throw new Error('Invalid recommendation profile payload');
        }
        const normalized = {
            profileId: String(profile.profileId),
            name: String(profile.name || 'Untitled Recommendation').slice(0, 80),
            paletteId: String(profile.paletteId),
            pictureSettings: profile.pictureSettings,
            sourceGoal: profile.sourceGoal || null,
            createdAt: profile.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ownerRef: profile.ownerRef || null,
        };
        return JSON.stringify(normalized);
    }

    function deserializeRecommendationProfile(serializedProfile) {
        const parsed = typeof serializedProfile === 'string' ? JSON.parse(serializedProfile) : serializedProfile;
        if (!parsed || !parsed.profileId || !parsed.paletteId || !parsed.pictureSettings) {
            throw new Error('Malformed recommendation profile');
        }
        return {
            profileId: String(parsed.profileId),
            name: String(parsed.name || 'Untitled Recommendation').slice(0, 80),
            paletteId: String(parsed.paletteId),
            pictureSettings: parsed.pictureSettings,
            sourceGoal: parsed.sourceGoal || null,
            createdAt: parsed.createdAt || new Date().toISOString(),
            updatedAt: parsed.updatedAt || new Date().toISOString(),
            ownerRef: parsed.ownerRef || null,
        };
    }

    function saveRecommendationProfile(profile) {
        const serialized = serializeRecommendationProfile(profile);
        const normalized = deserializeRecommendationProfile(serialized);
        const profiles = getStoredRecommendationProfiles().filter((p) => p.profileId !== normalized.profileId);
        profiles.unshift(normalized);
        localStorage.setItem(RECOMMENDATION_PROFILE_STORAGE_KEY, JSON.stringify(profiles.slice(0, 50)));
        return normalized;
    }

    window.LARRecommendationStorage = {
        serializeRecommendationProfile,
        deserializeRecommendationProfile,
        saveRecommendationProfile,
        getStoredRecommendationProfiles,
    };

    // initialize: wire buttons
    function init() {
        // load from hash if present
        loadProjectFromHash();

        const saveBtn = getElement('save-project-button');
        if (saveBtn) saveBtn.addEventListener('click', saveProjectToLocal);
        const loadBtn = getElement('load-project-button');
        if (loadBtn) loadBtn.addEventListener('click', loadProjectFromLocal);
        const exportBtn = getElement('export-project-button');
        if (exportBtn) exportBtn.addEventListener('click', exportProjectAsJSON);
        const importFile = getElement('import-project-input');
        if (importFile) importFile.addEventListener('change', (ev)=>{ if(ev.target.files[0]) importProjectFromFile(ev.target.files[0]); });
        const importBtn = getElement('import-project-button');
        if (importBtn) importBtn.addEventListener('click', ()=> getElement('import-project-input').click());
        const shareBtn = getElement('share-project-button');
        if (shareBtn) shareBtn.addEventListener('click', generateShareableLink);
        const beforeAfter = getElement('before-after-toggle');
        if (beforeAfter) beforeAfter.addEventListener('click', toggleBeforeAfter);
        const pngBtn = getElement('export-png-button');
        if (pngBtn) pngBtn.addEventListener('click', exportFinalPNG);
        const svgBtn = getElement('export-svg-button');
        if (svgBtn) svgBtn.addEventListener('click', exportFinalSVG);
        const palettesBtn = getElement('open-palettes-button');
        if (palettesBtn) palettesBtn.addEventListener('click', openPalettesPrompt);
        const batchBtn = getElement('batch-process-button');
        if (batchBtn) batchBtn.addEventListener('click', openBatchInput);
        const batchInput = getElement('batch-images-input');
        if (batchInput) batchInput.addEventListener('change', (ev)=> handleBatchFiles(ev.target.files));
        const recommendBtn = getElement('recommend-colors-button');
        if (recommendBtn) recommendBtn.addEventListener('click', ()=>{
            let k = parseInt(prompt('How many colors to recommend? (suggest 8-24)', '12'),10);
            if (!k || k<=0) k = 12;
            recommendColors(k);
        });
        const estimateBtn = document.createElement('button');
        estimateBtn.className = 'btn btn-sm btn-outline-secondary';
        estimateBtn.style.marginLeft = '8px';
        estimateBtn.innerText = 'Estimate Cost';
        estimateBtn.title = 'Estimate cost using default per-piece prices';
        estimateBtn.addEventListener('click', estimateCost);
        // append estimate button near the save/load cluster if present
        if (batchBtn && batchBtn.parentElement) {
            batchBtn.parentElement.appendChild(estimateBtn);
        }
    }

    // run init when DOM ready (scripts are loaded at end of body so elements exist)
    try {
        init();
    } catch (e) {
        log('init error', e);
    }
})();

export {};
