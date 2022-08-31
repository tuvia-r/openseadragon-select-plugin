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
	showNavigationControl: false, // zoom, etc.
	homeFillsViewer: true, // ensure image fills space horizontally
	visibilityRatio: 1, // prevent moving image outside viewport
});

let isSelecting = false;

let selectionObj = null;

const btn = document.getElementById('toggle-button');

function onSelect(rect, shape) {
	console.info(rect, shape);
	document.getElementById(
		'selection',
	).innerText = `x: ${Math.round(
		rect.x,
	)} | y: ${Math.round(rect.y)} | width: ${Math.round(
		rect.width,
	)} | height: ${Math.round(rect.height)}`;
	isSelecting = false;
	btn.innerText = 'Enable Selection';
	btn.classList.toggle('btn-danger');
	viewer.selectionHandler.frontCanvas.canvas.classList.toggle(
		'is-selecting',
	);
}

window.viewer = viewer;

function onSelectStartClick() {
	if (selectionObj?.isEnabled) {
		return;
	}
	selectionObj = viewer.selection({
		onSelection: onSelect,
		keep: true,
	});
	selectionObj.enable();
	isSelecting = true;
	btn.innerText = 'Disable Selection';
	btn.classList.toggle('btn-danger');
	viewer.selectionHandler.frontCanvas.canvas.classList.toggle(
		'is-selecting',
	);
};

function toggleSelection(){
	if (isSelecting) {
		document.getElementById(
			'btn-dropdown',
		).hidden = true;

		selectionObj?.disable();
		isSelecting = false;
		btn.innerText = 'Enable Selection';
		btn.classList.toggle('btn-danger');
		viewer.selectionHandler.frontCanvas.canvas.classList.toggle(
			'is-selecting',
		);
		btn.click();
	} else {
		document.getElementById(
			'btn-dropdown',
		).hidden = false;
	}
};

function onRectShape(){
	viewer.initSelection();
	viewer.selectionHandler.frontCanvas.drawer.setDrawerShape(
		RectShape.name,
	);
	onSelectStartClick();
};

function onBrushShape(){
	viewer.initSelection();
	viewer.selectionHandler.frontCanvas.drawer.setDrawerShape(
		BrushShape.name,
	);
	onSelectStartClick();
};

function onPolygonShape(){
	viewer.initSelection();
	viewer.selectionHandler.frontCanvas.drawer.setDrawerShape(
		PolygonShape.name,
	);
	onSelectStartClick();
};

const clearCanvas = () => {
	viewer.initSelection();
	viewer.selectionHandler.backCanvas.clear();
};

document.addEventListener('DOMContentLoaded', () => {
	btn.addEventListener('click', toggleSelection);
	// document
	// 	.getElementById('clearCanvas')
	// 	.addEventListener('click', clearCanvas);
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
