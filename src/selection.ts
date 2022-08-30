import { Rect, Viewer } from 'openseadragon';
import { OsdSelectionHandler } from './handler';
import { ShapeSelection } from './selection/shape-selection';
import { BaseShape } from './shapes/base-shape';

export type ViewerSelectionType = (options: {
	onSelection: (rect: Rect, shape: BaseShape) => void;
}) => ShapeSelection;

export function selection(
	this: Viewer,
	options: {
		onSelection: (rect: Rect, shape: BaseShape) => void;
		keep: boolean;
	},
) {
	this.initSelection();
	if (options.keep) {
		const originalCallback = options.onSelection;
		options.onSelection = (
			rect: Rect,
			shape: BaseShape,
		) => {
			this.selectionHandler.addShape(shape);
			return originalCallback(rect, shape);
		};
	}
	return new ShapeSelection(
		this.selectionHandler.frontCanvas,
		options.onSelection,
	);
}

export function initSelection(this: Viewer) {
	if (!this.selectionHandler) {
		this.selectionHandler = new OsdSelectionHandler(
			this,
		);
	}
}
