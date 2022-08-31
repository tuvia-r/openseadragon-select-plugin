import { Point, Rect } from 'openseadragon';
import { BaseShape } from './base-shape';

export class PointShape extends BaseShape {
	static pointDisplaySize = 3;
	point: Point = new Point();

	get rect() {
		const { x, y } = this.point;
		return new Rect(x, y, 0, 0);
	}

	toPath2D() {
		const path2d = new Path2D();
		const localPoint = this.toViewerCoords(this.point);
		path2d.moveTo(0, 0);
		path2d.arc(
			localPoint.x,
			localPoint.y,
			PointShape.pointDisplaySize,
			0,
			2 * Math.PI,
		);
		path2d.closePath();
		return path2d;
	}

	onMouseDown(point: Point): void {
		if (!this.isDrawing) {
			return;
		}
		this.point = point.clone();
		this.finishDrawing();
	}
	onMouseMove(): void {
		return;
	}
	onMouseUp(): void {
		return;
	}
}
