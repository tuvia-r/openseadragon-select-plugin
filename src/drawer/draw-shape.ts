import { Point } from 'openseadragon';
import { BaseShape, DrawingOptions } from '../shapes/base-shape';
import { RectShape } from '../shapes/rect';

const predefinedShapes = [RectShape];
const defaultDrawingOptions = {
  color: 'rgb(200, 0, 0)',
  lineWidth: 2,
  fill: 'rgba(220,220,220,0.2)',
}

export class Drawer {
  readonly shapes: Map<string, new (drawOptions: DrawingOptions, viewer: OpenSeadragon.Viewer) => BaseShape> = new Map();
  private drawerShape: string;
  private activeShape?: BaseShape;
  drawOptions: DrawingOptions = defaultDrawingOptions;
  constructor(private viewer: OpenSeadragon.Viewer) {

    predefinedShapes.map(shape => {
      this.addShapes(shape);
      this.setDrawerShape(shape.name);
    })
  }

  get drawing() {
    return !!this.activeShape;
  }

  addShapes(...shapeConstructors: (new (drawOptions: DrawingOptions, viewer: OpenSeadragon.Viewer) => BaseShape)[]) {
    shapeConstructors.map((shape) => this.shapes.set(shape.name, shape));
  }

  setDrawerShape(name: string) {
    if (this.shapes.has(name)) {
      this.drawerShape = name;
    } else {
      throw new Error(`no shape found with name ${name}`);
    }
  }

  start(point: Point) {
    if (this.activeShape) {
      this.activeShape.dispose();
    }
    const shapeConstructor = this.shapes.get(this.drawerShape);
    if (!shapeConstructor) {
      return;
    }
    this.activeShape = new shapeConstructor(this.drawOptions, this.viewer);
    this.activeShape.startDrawing(point);
    return this.activeShape;
  }

  update(point: Point) {
    if (!this.activeShape) {
      return;
    }
    this.activeShape.updateDrawing(point);
  }

  end(point: Point) {
    if (!this.activeShape) {
      return;
    }
    this.activeShape.endDrawing(point);
    const drawnShape = this.activeShape;
    this.activeShape = undefined;
    return drawnShape;
  }
}
