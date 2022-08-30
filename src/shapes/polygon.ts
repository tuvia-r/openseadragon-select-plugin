import { Point, Rect } from 'openseadragon';
import { BaseShape } from './base-shape';

const KEYCODE_ESC = 'Escape';

export class PolygonShape extends BaseShape {
	static closingDistance = 5;
	points: Point[] = [];

	private floatingPoint: Point;

	get closingDistance() {
		const point = new Point(
			PolygonShape.closingDistance,
			PolygonShape.closingDistance,
		);
		return this.toViewerCoords(point).x;
	}

	get rect() {
		const x = Math.min(...this.points.map((p) => p.x));
		const y = Math.min(...this.points.map((p) => p.y));
		const x1 = Math.max(...this.points.map((p) => p.x));
		const y1 = Math.max(...this.points.map((p) => p.y));
		return new Rect(x, y, x1 - x, y1 - y);
	}

	createSvgShape() {
		if (this.points.length === 0) {
			return new Path2D();
		}
		const svg = new Path2D();
		svg.moveTo(0, 0);
		this.arcs.map(([point1, point2]) => {
			svg.addPath(this.createPoint(point1));
			svg.addPath(this.createLine(point1, point2));
		});
		if (this.isDrawing && this.points.length !== 0) {
			const [lastPoint] = this.points.slice(-1);
			svg.addPath(
				this.createLine(
					lastPoint,
					this.floatingPoint,
				),
			);
		}
		svg.closePath();
		return svg;
	}

	private get arcs() {
		const res = [];
		if (this.points.length < 3) {
			return res;
		}
		for (let i = 0; i < this.points.length - 1; i++) {
			res.push([this.points[i], this.points[i + 1]]);
		}
		return res;
	}

	private createLine(point1: Point, point2: Point) {
		const newSvg = new Path2D();
		const point1Local = this.toViewerCoords(point1);
		const point2Local = this.toViewerCoords(point2);
		newSvg.moveTo(point1Local.x, point1Local.y);
		newSvg.lineTo(point2Local.x, point2Local.y);
		newSvg.closePath();
		return newSvg;
	}

	private createPoint(point: Point) {
		const newSvg = new Path2D();
		const localPoint = this.toViewerCoords(point);
		newSvg.arc(
			localPoint.x,
			localPoint.y,
			5,
			0,
			2 * Math.PI,
		);
		newSvg.closePath();
		return newSvg;
	}

	private addPoint(point: Point) {
		const [lastPoint] = this.points.slice(-1);
		if (lastPoint && lastPoint.equals(point)) {
			return;
		}

		if (this.arcs) {
			const [lastPoint] = this.points.slice(-1);
			const currentArc: [Point, Point] = [
				lastPoint,
				point,
			];
			for (const arc of this.arcs) {
				if (
					this.areLinesIntersecting(
						arc,
						currentArc,
					)
				) {
					return;
				}
			}
		}
		this.points.push(point);
	}

	private checkIfClosingNeeded() {
		if (this.points.length < 3) {
			return;
		}
		const [firstPoint] = this.points;
		const [lastPoint] = this.points.slice(-1);

		if (
			firstPoint.distanceTo(lastPoint) <
			this.closingDistance
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

	areLinesIntersecting(
		line1: [Point, Point],
		line2: [Point, Point],
	) {
		const [from1, to1] = line1;
		const [from2, to2] = line2;

		const dX: number = to1.x - from1.x;
		const dY: number = to1.y - from1.y;

		const determinant: number =
			dX * (to2.y - from2.y) - (to2.x - from2.x) * dY;
		if (determinant === 0) return undefined; // parallel lines

		const lambda: number =
			((to2.y - from2.y) * (to2.x - from1.x) +
				(from2.x - to2.x) * (to2.y - from1.y)) /
			determinant;
		const gamma: number =
			((from1.y - to1.y) * (to2.x - from1.x) +
				dX * (to2.y - from1.y)) /
			determinant;

		const hasIntersection =
			(0 <= lambda && lambda <= 1) ||
			!(0 <= gamma && gamma <= 1);

		return hasIntersection;
	}

	startDrawing(point: Point) {
		this.initKeyListener();
		super.startDrawing(point);
	}

	protected finishDrawing(): void {
		this.disposeKeyListener();
		super.finishDrawing();
        this.viewer.selectionHandler.frontCanvas.checkIfDrawingFinished(this)
	}

	onMouseDown(point: Point): void {
		if (!this.isDrawing) {
			return;
		}
		this.addPoint(point.clone());

		if (!this.floatingPoint) {
			this.floatingPoint = point.clone();
		}
	}
	onMouseMove(point: Point): void {
		if (!this.isDrawing) {
			return;
		}
		this.floatingPoint = point.clone();
	}
	onMouseUp(point?: Point): void {
		if (this.points.length > 3) {
			this.checkIfClosingNeeded();
		}
	}
}
