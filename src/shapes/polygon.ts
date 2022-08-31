import { Point, Rect } from 'openseadragon';
import { GroupShape } from './group';
import { LineShape } from './line';
import { PointShape } from './point';

const KEYCODE_ESC = 'Escape';

export class PolygonShape extends GroupShape<
	LineShape | PointShape
> {
	static closingDistance = 5;

	pointShapes: PointShape[] = [];
	lineShapes: LineShape[] = [];

	get shapes() {
		return [...this.pointShapes, ...this.lineShapes];
	}

	get points() {
		return this.pointShapes.map((point) => point.point);
	}

	get lastLine() {
		const [lastLine] = this.lineShapes.slice(-1);
		return lastLine;
	}

	get lastPoint() {
		const [lastPoint] = this.pointShapes.slice(-1);
		return lastPoint;
	}

	get closingDistance() {
		return PolygonShape.closingDistance;
	}

	get rect() {
		const x = Math.min(...this.points.map((p) => p.x));
		const y = Math.min(...this.points.map((p) => p.y));
		const x1 = Math.max(...this.points.map((p) => p.x));
		const y1 = Math.max(...this.points.map((p) => p.y));
		return new Rect(x, y, x1 - x, y1 - y);
	}

	private createLine(point: Point) {
		const newline = new LineShape(
			this.drawingOptions,
			this.viewer,
		);
		newline.from = point;
		this.lineShapes.push(newline);
	}

	private createPoint(point: Point) {
		const newPoint = new PointShape(
			this.drawingOptions,
			this.viewer,
		);
		newPoint.point = point;
		this.pointShapes.push(newPoint);
	}

	private addPoint(point: Point) {
		// if (this.arcs.slice(0, -1)) {
		// 	const [lastPoint] = this.points.slice(-1);
		// 	const currentArc: [Point, Point] = [
		// 		lastPoint,
		// 		point,
		// 	];
		// 	for (const arc of this.arcs) {
		// 		if (areLinesIntersecting(arc, currentArc)) {
		// 			return;
		// 		}
		// 	}
		// }
		if (this.lastLine) {
			this.lastLine.to = point;
		}
		this.createPoint(point);
		this.createLine(point);
		this.lastLine.to = point.clone();
	}

	private checkIfClosingNeeded() {
		if (this.points.length < 3) {
			return;
		}
		const [firstPoint] = this.points;
		const [lastPoint] = this.points.slice(-1);

		if (
			this.toViewerCoords(firstPoint).distanceTo(
				this.toViewerCoords(lastPoint),
			) < this.closingDistance
		) {
			this.finishDrawing();
		}
	}

	private onKey(event: KeyboardEvent) {
		if (event.code === KEYCODE_ESC) {
			this.onKeyEsc();
		}
	}

	private onKeyEsc() {
		this.finishDrawing();
	}

	private initKeyListener() {
		document.addEventListener(
			'keyup',
			this.onKey.bind(this),
			false,
		);
	}

	private disposeKeyListener() {
		document.removeEventListener(
			'keyup',
			this.onKey.bind(this),
		);
	}

	startDrawing(point: Point) {
		this.initKeyListener();
		super.startDrawing(point);
	}

	protected finishDrawing(): void {
		this.disposeKeyListener();
		super.finishDrawing();
		this.viewer.selectionHandler.frontCanvas.checkIfDrawingFinished(
			this,
		);
	}

	onMouseDown(point: Point): void {
		if (!this.isDrawing) {
			return;
		}
		this.addPoint(point.clone());
	}
	onMouseMove(point: Point): void {
		if (!this.isDrawing) {
			return;
		}
		if (this.lastLine) {
			this.lastLine.to = point.clone();
		}
	}
	onMouseUp(): void {
		if (this.points.length > 3) {
			this.checkIfClosingNeeded();
		}
	}
}
