import * as OpenSeadragon from 'openseadragon';
import {
	RectShape,
	PolygonShape,
	BrushShape,
} from 'openseadragon-select-plugin';

const viewer = OpenSeadragon({
	id: 'app',
	tileSources:
		'https://openseadragon.github.io/example-images/highsmith/highsmith.dzi',
});

/**
 * 
 * @param {OpenSeadragon.Rect} rect 
 * @param {*} shape 
 */
function onSelectionCallBack(rect, shape) {
	console.info('onSelectionCallBack', rect, shape);
	const newDiv = document.createElement('div')
	newDiv.innerText = `rect: x: ${rect.x}, y: ${rect.y}, width: ${rect.width}, height: ${rect.height}`

	const selectionEl = document.getElementById('selection')
	selectionEl.prepend(newDiv)
	selectionEl.childNodes.forEach((el, index) => (index > 2) && selectionEl.removeChild(el))
}

window.viewer = viewer;

let selection;


const onSelectStartClick = () => {
	if (selection?.isEnabled) {
		return;
	}
	selection = viewer.selection({
		onSelection: onSelectionCallBack,
        keep: true
	});
	selection.enable();
    console.log(selection)
};

const onRectShape = () => {
	viewer.initSelection();
	viewer.selectionHandler.frontCanvas.drawer.setDrawerShape(
		RectShape.name,
	);
	onSelectStartClick()
};

const onBrushShape = () => {
	viewer.initSelection();
	viewer.selectionHandler.frontCanvas.drawer.setDrawerShape(
		BrushShape.name,
	);
	onSelectStartClick()
};

const onPolygonShape = () => {
	viewer.initSelection();
	viewer.selectionHandler.frontCanvas.drawer.setDrawerShape(
		PolygonShape.name,
	);
	onSelectStartClick()
};

const clearCanvas = () => {
	viewer.initSelection();
	viewer.selectionHandler.backCanvas.clear()
	const selectionEl = document.getElementById('selection')
	selectionEl.childNodes.forEach(el => selectionEl.removeChild(el))
}

document.addEventListener('DOMContentLoaded', () => {
	document
		.getElementById('clearCanvas')
		.addEventListener('click', clearCanvas);
	document
		.getElementById('onPolygonShape')
		.addEventListener('click', onPolygonShape);
	document
		.getElementById('onBrushShape')
		.addEventListener('click', onBrushShape);
	document
		.getElementById('onRectShape')
		.addEventListener('click', onRectShape);
});
