import { BrushShape } from '../shapes';
import {
	BaseShape,
	DrawingOptions,
	ShapeConstructor,
} from '../shapes/base-shape';
import { PolygonShape } from '../shapes/polygon';
import { RectShape } from '../shapes/rect';
import { Point } from '../utils/point';

export enum ShapeNames {
	RectShape = 'RectShape',
	PolygonShape = 'PolygonShape',
	BrushShape = 'BrushShape',
}

const predefinedShapes = [
	{ name: ShapeNames.RectShape, value: RectShape },
	{ name: ShapeNames.PolygonShape, value: PolygonShape },
	{ name: ShapeNames.BrushShape, value: BrushShape },
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
			this.addShape(shape.name, shape.value);
		});
		this.setDrawerShape(ShapeNames.RectShape);
	}

	get drawing() {
		return (
			this.activeShape && this.activeShape.isDrawing
		);
	}

	addShape(
		name: ShapeNames | string,
		shapeConstructor: ShapeConstructor,
	) {
		this.shapes.set(name, shapeConstructor);
	}

	setDrawerShape(name: ShapeNames | string) {
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
			this.activeShape.startDrawing();
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

	reset() {
		this.activeShape = undefined;
	}
}
