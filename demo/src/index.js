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


function onSelectionCallBack(rect, shape) {
	console.info(rect, shape);
	document.getElementById('selection').innerText =
		JSON.stringify(rect);
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
};

const onBrushShape = () => {
	viewer.initSelection();
	viewer.selectionHandler.frontCanvas.drawer.setDrawerShape(
		BrushShape.name,
	);
};

const onPolygonShape = () => {
	viewer.initSelection();
	viewer.selectionHandler.frontCanvas.drawer.setDrawerShape(
		PolygonShape.name,
	);
};

document.addEventListener('DOMContentLoaded', () => {
	document
		.getElementById('onSelectStartClick')
		.addEventListener('click', onSelectStartClick);
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
