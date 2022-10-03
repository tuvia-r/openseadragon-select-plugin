import {
	DrawEndCallback,
	FrontCanvas,
} from '../canvases/front-canvas';
import { BaseShape } from '../shapes/base-shape';
import { Rect } from '../utils/rect';
import { SelectionBase } from './selection-base';

export class ShapeSelection extends SelectionBase<BaseShape> {
	private unsubscribe?: () => void;
	constructor(
		private frontCanvas: FrontCanvas,
		onSelection: (rect: Rect, shape: BaseShape) => void,
	) {
		super(onSelection);
	}

	enable() {
		super.enable();
		this.unsubscribe = this.frontCanvas.onDrawEnd(
			this.onDrawDone.bind(this) as DrawEndCallback,
		);
		this.frontCanvas.activate();
	}
	disable() {
		if (this.unsubscribe) {
			this.unsubscribe();
		}
		super.disable();
		this.frontCanvas.deactivate();
	}

	onDrawDone(shape: BaseShape) {
		this.disable();
		if (this.onSelection) {
			this.onSelection(shape.boundingBox, shape);
		}
	}
}
