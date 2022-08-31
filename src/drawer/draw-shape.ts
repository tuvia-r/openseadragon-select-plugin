import { Point } from 'openseadragon';
import { BrushShape } from '../shapes';
import {
	BaseShape,
	DrawingOptions,
	ShapeConstructor,
} from '../shapes/base-shape';
import { PolygonShape } from '../shapes/polygon';
import { RectShape } from '../shapes/rect';

const predefinedShapes = [
	RectShape,
	PolygonShape,
	BrushShape,
];
const defaultDrawingOptions = {
	color: 'rgb(200, 0, 0)',
	lineWidth: 2,
	fill: 'rgba(220,220,220,0.2)',
};

export class Drawer {
	readonly shapes: Map<string, ShapeConstructor> =
		new Map();
	private drawerActiveShape: string;
	private activeShape?: BaseShape;
	drawOptions: DrawingOptions = defaultDrawingOptions;
	constructor(private viewer: OpenSeadragon.Viewer) {
		predefinedShapes.map((shape) => {
			this.addShapes(shape);
		});
		this.setDrawerShape(RectShape.name);
	}

	get drawing() {
		return (
			this.activeShape && this.activeShape.isDrawing
		);
	}

	addShapes(...shapeConstructors: ShapeConstructor[]) {
		shapeConstructors.map((shape) =>
			this.shapes.set(shape.type, shape),
		);
	}

	setDrawerShape(name: string) {
		if (this.shapes.has(name)) {
			this.drawerActiveShape = name;
		} else {
			throw new Error(
				`no shape found with name ${name}`,
			);
		}
	}

	private getNewShape() {
		const shapeConstructor = this.shapes.get(
			this.drawerActiveShape,
		);
		if (!shapeConstructor) {
			throw new Error(
				`no constructor found for ${this.drawerActiveShape}`,
			);
		}
		return new shapeConstructor(
			this.drawOptions,
			this.viewer,
		);
	}

	onMouseDown(point: Point) {
		if (
			this.activeShape &&
			!this.activeShape.isDrawing
		) {
			this.activeShape = undefined;
		}
		if (!this.activeShape) {
			this.activeShape = this.getNewShape();
			this.activeShape.startDrawing(point);
		}
		this.activeShape.onMouseDown(point);
		return this.activeShape;
	}

	onMouseMove(point: Point) {
		if (
			!this.activeShape ||
			!this.activeShape.isDrawing
		) {
			return;
		}
		this.activeShape.onMouseMove(point);
		return this.activeShape;
	}

	onMouseUp(point: Point) {
		if (
			!this.activeShape ||
			!this.activeShape.isDrawing
		) {
			return;
		}
		this.activeShape.onMouseUp(point);
		const drawnShape = this.activeShape;

		return drawnShape;
	}
}
