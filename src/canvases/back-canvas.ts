import { Point } from 'openseadragon';
import { CanvasBase } from './canvas-base';

export class BackCanvas extends CanvasBase {
	private highlightOnMouseOverValue = false;

	get highlightOnMouseOver() {
		return this.highlightOnMouseOverValue;
	}

	set highlightOnMouseOver(val) {
		if (this.highlightOnMouseOverValue !== val) {
			this.highlightOnMouseOverValue = val;
			if (val) {
				this.initEvents();
			} else {
				this.disposeEvents();
			}
		}
	}

	constructor() {
		super();
	}

	initEvents() {
		this.canvas.addEventListener(
			'mousemove',
			this.onMouseMove.bind(this),
			false,
		);
	}

	disposeEvents() {
		this.canvas.removeEventListener(
			'mousemove',
			this.onMouseMove.bind(this),
		);
	}

	private onMouseMove(event: MouseEvent) {
		if (this.highlightOnMouseOver) {
			const mousePoint = new Point(
				event.clientX,
				event.clientY,
			);
			for (const shape of this.shapes.values()) {
				shape.isHighlighted = shape.isPointOver(
					mousePoint,
					this.context2d,
				);
			}
		}
	}
}
