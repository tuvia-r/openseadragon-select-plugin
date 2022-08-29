import { BaseShape } from '../shapes/base-shape';

export class CanvasBase {
  static BASE_Z_INDEX = 1;

  private needsUpdate = false;
  private zoomVal = 1;

  public readonly canvas: HTMLCanvasElement;
  protected context2d: CanvasRenderingContext2D;

  protected container?: HTMLElement;

  protected readonly shapes: Map<string, BaseShape> = new Map();

  public get zoom() {
    return this.zoomVal;
  }

  set zoom(val: number) {
    this.zoomVal = val;
    this.requestUpdate();
  }

  get isActive() {
    return this.canvas.style.pointerEvents === 'all';
  }

  constructor() {
    this.canvas = document.createElement('canvas');
    this.context2d = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.setCanvasStyle();
  }

  private setCanvasStyle() {
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.position = 'absolute';
    this.canvas.style.pointerEvents = 'none';
    this.deactivate();
    this.show();
  }

  requestUpdate() {
    this.needsUpdate = true;
  }

  update() {
    if (this.needsUpdate) {
      this.render();
      this.needsUpdate = false;
    }
  }

  render() {
    this.clearCtx();
    [...this.shapes.values()].filter((s) => !s.isDisposed && !s.hidden).map((shape) => shape.draw(this.context2d));
  }

  private clearCtx() {
    this.context2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  clear() {
    this.shapes.clear();
    this.requestUpdate();
  }

  add(shape: BaseShape) {
    if (this.shapes.has(shape.id)) {
      return;
    }
    this.shapes.set(shape.id, shape);
    this.requestUpdate();
  }

  remove(shape: BaseShape) {
    if (this.shapes.has(shape.id)) {
      this.shapes.delete(shape.id);
      this.requestUpdate();
    }
  }

  mount(container: HTMLElement) {
    container.appendChild(this.canvas);
    this.container = container;
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  activate() {
    this.canvas.style.pointerEvents = 'all';
    this.canvas.style.zIndex = `${CanvasBase.BASE_Z_INDEX + 1}`;
  }

  deactivate() {
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = `${CanvasBase.BASE_Z_INDEX}`;
  }

  show() {
    this.canvas.style.visibility = 'visible';
  }

  hide() {
    this.canvas.style.visibility = 'hidden';
  }
}
