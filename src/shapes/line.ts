import { Point } from '../utils/point';
import { Rect } from '../utils/rect';
import { BaseShape } from './base-shape';

export class LineShape extends BaseShape {
	from: Point = new Point();
	to: Point = new Point();

	get boundingBox() {
		const x = Math.min(this.from.x, this.to.x);
		const y = Math.min(this.from.y, this.to.y);
		const x1 = Math.max(this.from.x, this.to.x);
		const y1 = Math.max(this.from.y, this.to.y);
		return new Rect(x, y, x1 - x, y1 - y);
	}

	toPath2D() {
		const path2d = new Path2D();
		const localFrom = this.toViewerCoords(this.from);
		const localTo = this.toViewerCoords(this.to);
		path2d.moveTo(0, 0);
		path2d.moveTo(localFrom.x, localFrom.y);
		path2d.lineTo(localTo.x, localTo.y);
		path2d.closePath();
		return path2d;
	}

	onMouseDown(point: Point): void {
		if (!this.isDrawing) {
			return;
		}
		this.from = point.clone();
	}
	onMouseMove(point: Point): void {
		if (!this.isDrawing) {
			return;
		}
		this.to = point.clone();
	}
	onMouseUp(point?: Point): void {
		this.to = point.clone();
		this.finishDrawing();
	}
}
