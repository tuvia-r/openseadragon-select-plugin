import { RectShape } from '../shapes/rect';
import { Rect } from '../utils/rect';

export class SelectionBase<
	Shape = RectShape,
	Result = Rect,
> {
	selection: Shape;
	isEnabled = false;
	constructor(
		public onSelection?: (
			rect: Result,
			shape: Shape,
		) => void,
	) {}
	enable() {
		this.isEnabled = true;
	}
	disable() {
		this.isEnabled = false;
	}
	toggleState() {
		this.isEnabled ? this.disable() : this.enable();
	}
}
