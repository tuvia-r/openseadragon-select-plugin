import { Drawer } from '../drawer/draw-shape';
import { BaseShape } from '../shapes/base-shape';
import { Point } from '../utils/point';
import { CanvasBase } from './canvas-base';

export type DrawEndCallback = (
	shape: BaseShape,
) => void | Promise<void>;

export class FrontCanvas extends CanvasBase {
	private isActivated = false;
	drawer: Drawer;

	private onDrawEndCallbacks: DrawEndCallback[] = [];

	constructor(private viewer: OpenSeadragon.Viewer) {
		super();
		this.drawer = new Drawer(viewer);
		this.init();
	}

	private executeDrawEndCallback(shape: BaseShape) {
		this.onDrawEndCallbacks.map((cb) => cb(shape));
	}

	private init() {
		this.canvas.addEventListener(
			'mousedown',
			this.onMouseDown.bind(this),
			false,
		);
		this.canvas.addEventListener(
			'mousemove',
			this.onMouseMove.bind(this),
			false,
		);
		this.canvas.addEventListener(
			'mouseup',
			this.onMouseUp.bind(this),
			false,
		);
	}

	dispose() {
		this.canvas.removeEventListener(
			'mousedown',
			this.onMouseDown.bind(this),
		);
		this.canvas.removeEventListener(
			'mousemove',
			this.onMouseMove.bind(this),
		);
		this.canvas.removeEventListener(
			'mouseup',
			this.onMouseUp.bind(this),
		);
	}

	private onMouseDown(event: MouseEvent) {
		this.clear();
		const point = this.getCoordsFromMouseEvent(event);

		const boundPoint = this.keepInBounds(point.clone());
		if (
			point.x !== boundPoint.x ||
			point.y !== boundPoint.y
		) {
			console.log('out of bounds', {
				point,
				boundPoint,
			});
			return;
		}

		const drawingShape = this.drawer.onMouseDown(point);
		this.add(drawingShape as BaseShape);

		this.checkIfDrawingFinished(drawingShape);
		this.requestUpdate();
	}

	private onMouseUp(event: MouseEvent) {
		const point = this.getCoordsFromMouseEvent(event);
		this.keepInBounds(point);
		const drawnShape = this.drawer.onMouseUp(
			point,
		) as BaseShape;

		this.checkIfDrawingFinished(drawnShape);
		this.requestUpdate();
	}

	private onMouseMove(event: MouseEvent) {
		if (!this.drawer.drawing) {
			return;
		}
		const point = this.getCoordsFromMouseEvent(event);
		this.keepInBounds(point);
		const shape = this.drawer.onMouseMove(point);
		this.checkIfDrawingFinished(shape);
		this.requestUpdate();
	}

	private keepInBounds(point: Point) {
		const { x: width, y: height } = this.viewer.world
			.getItemAt(0)
			.getContentSize();
		point.x = Math.max(
			0,
			Math.min(point.x, width ?? 0),
		);
		point.y = Math.max(
			0,
			Math.min(point.y, height ?? 0),
		);
		return point;
	}

	deactivate(): void {
		this.drawer?.reset();
		this.clear();
		return super.deactivate();
	}

	onDrawEnd(callback: DrawEndCallback) {
		this.onDrawEndCallbacks.push(callback);
		return () =>
			this.offDrawEnd.apply(this, [callback]);
	}

	offDrawEnd(callback: DrawEndCallback) {
		this.onDrawEndCallbacks =
			this.onDrawEndCallbacks.filter(
				(cb) => cb !== callback,
			);
	}

	getCoordsFromMouseEvent(event: MouseEvent) {
		const point = new Point(event.pageX, event.pageY);
		return this.viewer?.viewport.windowToImageCoordinates(
			point,
		);
	}

	checkIfDrawingFinished(drawnShape: BaseShape) {
		if (!this.drawer.drawing) {
			this.remove(drawnShape);
			this.executeDrawEndCallback(drawnShape);
		}
	}
}
