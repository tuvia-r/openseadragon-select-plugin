import * as OpenSeadragon from 'openseadragon';
import 'openseadragon-select-plugin';

function callBack(rect, shape) {
    console.info(rect, shape);
    document.getElementById('selection').innerText = JSON.stringify(rect);
}

const viewer = OpenSeadragon({
    id: "app",
    tileSources: 'https://openseadragon.github.io/example-images/highsmith/highsmith.dzi'
});
const selection = viewer.selection({ onSelection: callBack });
selection.enable();

console.info(123);
