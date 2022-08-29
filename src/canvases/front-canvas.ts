import { Point } from 'openseadragon';
import { Drawer } from '../drawer/draw-shape';
import { BaseShape } from '../shapes/base-shape';
import { CanvasBase } from './canvas-base';

export type DrawEndCallback = (shape: BaseShape) => void | Promise<void>;

export class FrontCanvas extends CanvasBase {
  drawer: Drawer;

  private onDrawEndCallbacks: DrawEndCallback[] = [];

  constructor(private viewer: OpenSeadragon.Viewer) {
    super();
    this.drawer = new Drawer(viewer);
  }

  onDrawEnd(callback: DrawEndCallback) {
    this.onDrawEndCallbacks.push(callback);
    return () => this.offDrawEnd.apply(this, [callback]);
  }

  offDrawEnd(callback: DrawEndCallback) {
    this.onDrawEndCallbacks = this.onDrawEndCallbacks.filter((cb) => cb !== callback);
  }

  private executeDrawEndCallback(shape: BaseShape) {
    this.onDrawEndCallbacks.map((cb) => cb(shape));
  }

  activate() {
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    super.activate();
  }

  deactivate() {
    this.canvas.removeEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.removeEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.removeEventListener('mouseup', this.onMouseUp.bind(this));
    super.deactivate();
  }

  private onMouseDown(event: MouseEvent) {
    this.clear();
    const point = this.getCoordsFromMouseEvent(event);

    const boundPoint = this.keepInBounds(point.clone());
    if (point.x !== boundPoint.x || point.y !== boundPoint.y) {
      console.log('out of bounds', { point, boundPoint });
      return;
    }

    const drawingShape = this.drawer.start(point);
    this.add(drawingShape as BaseShape);
  }

  private onMouseUp(event: MouseEvent) {
    const point = this.getCoordsFromMouseEvent(event);
    this.keepInBounds(point);
    const drawnShape = this.drawer.end(point) as BaseShape;

    if (drawnShape) {
      this.remove(drawnShape);
      this.executeDrawEndCallback(drawnShape);
    }
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.drawer.drawing) {
      return;
    }
    const point = this.getCoordsFromMouseEvent(event);
    this.keepInBounds(point);
    this.drawer.update(point);
    this.requestUpdate();
  }

  private keepInBounds(point: Point) {
    const { x: width, y: height } = this.viewer.world.getItemAt(0).getContentSize();
    point.x = Math.max(0, Math.min(point.x, width ?? 0));
    point.y = Math.max(0, Math.min(point.y, height ?? 0));
    return point;
  }

  getCoordsFromMouseEvent(event: MouseEvent) {
    const point = new Point(event.pageX, event.pageY);
    return this.viewer?.viewport.windowToImageCoordinates(point);
  }
}
