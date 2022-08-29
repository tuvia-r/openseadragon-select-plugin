import * as OpenSeadragon from 'openseadragon';
import { FrontCanvas } from './canvases/front-canvas';

export class OsdSelectionHandler {
  readonly frontCanvas: FrontCanvas;
  private resizeObserver: ResizeObserver;

  constructor(private viewer: OpenSeadragon.Viewer) {
    this.frontCanvas = new FrontCanvas(viewer);
    this.viewer.addHandler('zoom', this.updateZoom.bind(this));
    this.viewer.addOnceHandler('open', this.init.bind(this));
    this.viewer.addOnceHandler('resize', this.setCanvasSize.bind(this));
    this.viewer.addOnceHandler('close', this.dispose.bind(this));
    this.resizeObserver = new ResizeObserver(this.setCanvasSize.bind(this));
  }

  private dispose() {
    this.resizeObserver.unobserve(this.viewer.drawer.container);
  }

  private setCanvasSize() {
    const { width, height } = this.viewer.drawer.container.getBoundingClientRect();
    this.frontCanvas.resize(width, height);
  }

  private init() {
    this.frontCanvas.mount(this.viewer.container);
    this.setCanvasSize();
    this.updateLoop();
    this.resizeObserver.observe(this.viewer.drawer.container);
  }

  private updateZoom(zoomData: OpenSeadragon.ZoomEvent) {
    this.frontCanvas.zoom = zoomData.zoom ?? 1;
  }

  private updateLoop() {
    this.frontCanvas.update();
    requestAnimationFrame(this.updateLoop.bind(this));
  }
}
