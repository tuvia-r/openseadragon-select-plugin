import { Point, Rect } from 'openseadragon';
import { BaseShape } from './base-shape';

export class RectShape extends BaseShape {
	topLeft: Point = new Point();
	bottomLeft: Point;

	get boundingBox() {
		const x = Math.min(
			this.topLeft.x,
			this.bottomLeft.x,
		);
		const y = Math.min(
			this.topLeft.y,
			this.bottomLeft.y,
		);
		const x1 = Math.max(
			this.topLeft.x,
			this.bottomLeft.x,
		);
		const y1 = Math.max(
			this.topLeft.y,
			this.bottomLeft.y,
		);
		return new Rect(x, y, x1 - x, y1 - y);
	}

	toPath2D() {
		if (!this.bottomLeft) {
			return new Path2D();
		}
		const { x, y } = this.toViewerCoords(this.topLeft);
		const { x: x1, y: y1 } = this.toViewerCoords(
			this.bottomLeft,
		);
		const path2d = new Path2D();
		path2d.moveTo(0, 0);
		path2d.rect(x, y, x1 - x, y1 - y);
		return path2d;
	}

	onMouseDown(point: Point): void {
		if (!this.isDrawing) {
			return;
		}
		this.topLeft = point.clone();
	}
	onMouseMove(point: Point): void {
		if (!this.isDrawing) {
			return;
		}
		this.bottomLeft = point.clone();
	}
	onMouseUp(point?: Point): void {
		if (!this.isDrawing) {
			return;
		}
		this.finishDrawing();
		if (point) {
			this.onMouseMove(point);
		}
	}
}
