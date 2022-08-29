import { Point, Rect } from 'openseadragon';
import { uid } from '../utils';

export interface DrawingOptions {
  color: string;
  lineWidth: number;
  fill: string;
}

export abstract class BaseShape {
  protected disposed = false;

  id: string = uid();
  hidden = false;

  get isDisposed() {
    return this.disposed;
  }

  abstract readonly rect: Rect;

  constructor(
    protected drawingOptions: DrawingOptions,
    protected viewer: OpenSeadragon.Viewer
  ) {}

  dispose() {
    this.disposed = true;
  }

  updateDrawingOptions(options: Partial<DrawingOptions>) {
    Object.assign(this.drawingOptions, options);
  }

  draw(context2d: CanvasRenderingContext2D): void {
    this.setDrawOptions(context2d);
    const svg = this.createSvgShape();

    context2d.stroke(svg);
    context2d.fill(svg);
    context2d.save();
  }

  protected toViewerCoords(point: Point) {
    return this.viewer.viewport.imageToViewerElementCoordinates(point.clone());
  }

  protected setDrawOptions(context2d: CanvasRenderingContext2D) {
    context2d.strokeStyle = this.drawingOptions.color;
    context2d.fillStyle = this.drawingOptions.fill;
    context2d.lineWidth = this.drawingOptions.lineWidth;
  }

  abstract createSvgShape(): Path2D;

  abstract startDrawing(point: Point): void;
  abstract updateDrawing(point: Point): void;
  abstract endDrawing(point?: Point): void;
}
