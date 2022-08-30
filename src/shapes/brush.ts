import { Point, Rect } from 'openseadragon';
import { BaseShape } from './base-shape';

export class BrushShape extends BaseShape {
	points: Point[] = [];

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
			svg.addPath(this.createLine(point1, point2));
		});
		svg.closePath();
		return svg;
	}

	private get arcs() {
		const res = [];
		if (this.points.length < 2) {
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

	private addPoint(point: Point) {
		const [lastPoint] = this.points.slice(-1);
		if (lastPoint && lastPoint.equals(point)) {
			return;
		}

		this.points.push(point);
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
		this.addPoint(point.clone());
	}
	onMouseUp(point?: Point): void {
		this.addPoint(point.clone());
		this.finishDrawing();
	}
}