import { Point, Rect } from 'openseadragon';
import { BaseShape } from './base-shape';

export class RectShape extends BaseShape {
  topLeft: Point = new Point();
  bottomLeft: Point;

  get rect() {
    const x = Math.min(this.topLeft.x, this.bottomLeft.x);
    const y = Math.min(this.topLeft.y, this.bottomLeft.y);
    const x1 = Math.max(this.topLeft.x, this.bottomLeft.x);
    const y1 = Math.max(this.topLeft.y, this.bottomLeft.y);
    return new Rect(x, y, x1 - x, y1 - y);
  }

  createSvgRect() {
    if (!this.bottomLeft) {
      return new Path2D();
    }
    const { x, y } = this.toViewerCoords(this.topLeft);
    const { x: x1, y: y1 } = this.toViewerCoords(this.bottomLeft);
    const svg = new Path2D();
    svg.moveTo(0, 0);
    svg.rect(x, y, x1 - x, y1 - y);
    return svg;
  }

  startDrawing(point: Point): void {
    this.topLeft = point.clone();
  }
  updateDrawing(point: Point): void {
    this.bottomLeft = point.clone();
  }
  endDrawing(point?: Point): void {
    if (point) {
      this.updateDrawing(point);
    }
  }
}
