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
		const svg = new Path2D();
		const localPoint = this.toViewerCoords(this.point);
		svg.moveTo(0, 0);
		svg.arc(
			localPoint.x,
			localPoint.y,
			PointShape.pointDisplaySize,
			0,
			2 * Math.PI,
		);
		svg.closePath();
		return svg;
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
