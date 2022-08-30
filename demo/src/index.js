import * as OpenSeadragon from 'openseadragon';
import 'openseadragon-select-plugin';

const viewer = OpenSeadragon({
    id: "app",
    tileSources: 'https://openseadragon.github.io/example-images/highsmith/highsmith.dzi',
    showNavigationControl: false, // zoom, etc.
    homeFillsViewer: true, // ensure image fills space horizontally
    visibilityRatio: 1, // prevent moving image outside viewport
});

const selection = viewer.selection({ onSelection: onSelect });

let isSelecting = false;

function toggleSelection() {
    isSelecting = !isSelecting;
    if (isSelecting) {
        selection.enable();
        btn.innerText = 'Disable Selection'
        btn.classList.toggle('btn-danger')
    } else {
        selection.disable();
        btn.innerText = "Enable Selection"
        btn.classList.toggle('btn-danger')
    }
}

const btn = document.getElementById('toggle-button');
btn.addEventListener("click", function () {
    toggleSelection();
});

function onSelect(rect, shape) {
    console.info(rect, shape);
    document.getElementById('selection').innerText = `x: ${Math.round(rect.x)} | y: ${Math.round(rect.y)} | width: ${Math.round(rect.width)} | height: ${Math.round(rect.height)}`
    isSelecting = false;
    btn.innerText = "Enable Selection"
    btn.classList.toggle('btn-danger')
}

