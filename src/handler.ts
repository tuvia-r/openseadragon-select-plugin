import * as OpenSeadragon from 'openseadragon';
import { BackCanvas } from './canvases/back-canvas';
import { FrontCanvas } from './canvases/front-canvas';
import { BaseShape } from './shapes';

export class OsdSelectionHandler {
	/**
	 * used for drawing shapes
	 */
	readonly frontCanvas: FrontCanvas;
	/**
	 * used to display fixed shapes
	 */
	readonly backCanvas: BackCanvas;

	private resizeObserver: ResizeObserver;

	constructor(private viewer: OpenSeadragon.Viewer) {
		this.frontCanvas = new FrontCanvas(viewer);
		this.backCanvas = new BackCanvas();
		this.viewer.addHandler(
			'animation',
			this.requestUpdate.bind(this),
		);
		this.viewer.addHandler(
			'animation-start',
			this.requestUpdate.bind(this),
		);
		this.viewer.addHandler(
			'animation-finish',
			this.requestUpdate.bind(this),
		);
		this.viewer.addHandler(
			'zoom',
			this.updateZoom.bind(this),
		);
		this.viewer.addOnceHandler(
			'open',
			this.init.bind(this),
		);
		this.viewer.addOnceHandler(
			'resize',
			this.onResize.bind(this),
		);
		this.viewer.addOnceHandler(
			'close',
			this.dispose.bind(this),
		);
		this.resizeObserver = new ResizeObserver(
			this.setCanvasSize.bind(this),
		);

		if (this.viewer.isOpen()) {
			this.init();
		}
	}

	private onResize() {
		this.requestUpdate();
	}

	private dispose() {
		this.resizeObserver.unobserve(
			this.viewer.drawer.container,
		);
	}

	private setCanvasSize() {
		const { width, height } =
			this.viewer.drawer.container.getBoundingClientRect();
		this.frontCanvas.resize(width, height);
		this.backCanvas.resize(width, height);
	}

	private init() {
		this.frontCanvas.mount(this.viewer.container);
		this.backCanvas.mount(this.viewer.container);
		this.setCanvasSize();
		this.updateLoop();
		this.resizeObserver.observe(
			this.viewer.drawer.container,
		);
	}

	private updateZoom(zoomData: OpenSeadragon.ZoomEvent) {
		this.frontCanvas.zoom = zoomData.zoom ?? 1;
		this.backCanvas.zoom = zoomData.zoom ?? 1;
	}

	private requestUpdate() {
		this.frontCanvas.requestUpdate();
		this.backCanvas.requestUpdate();
	}

	private updateLoop() {
		this.frontCanvas.update();
		this.backCanvas.update();
		requestAnimationFrame(this.updateLoop.bind(this));
	}

	addShape(shape: BaseShape) {
		this.backCanvas.add(shape);
	}

	removeShape(shape: BaseShape) {
		this.backCanvas.remove(shape);
	}

	clear() {
		this.backCanvas.clear();
	}
}
