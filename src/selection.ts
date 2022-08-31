import { Rect, Viewer } from 'openseadragon';
import { OsdSelectionHandler } from './handler';
import { ShapeSelection } from './selection/shape-selection';
import { BaseShape } from './shapes/base-shape';

export interface ViewerSelectionOptions {
	/**
	 * callback that will be called after the drawing is done.
	 * @param rect bounding box of the selected aria
	 * @param shape the shape object used to draw the selection
	 * @required
	 */
	onSelection: (rect: Rect, shape: BaseShape) => void;
	/**
	 * if set to true, the shape will automatically
	 * be added to the canvas after drawing is finished.
	 * @default false
	 */
	keep: boolean;
}

export type ViewerSelectionType = (
	options: ViewerSelectionOptions,
) => ShapeSelection;

export function wrapSelectionCallback(
	viewer: Viewer,
	options: ViewerSelectionOptions,
) {
	if (options.keep) {
		const originalCallback = options.onSelection;
		options.onSelection = (
			rect: Rect,
			shape: BaseShape,
		) => {
			viewer.selectionHandler.addShape(shape);
			return originalCallback(rect, shape);
		};
	}
	return options.onSelection;
}

export function selection(
	this: Viewer,
	options: ViewerSelectionOptions,
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
		wrapSelectionCallback(this, options),
	);
}

export function initSelection(this: Viewer) {
	if (!this.selectionHandler) {
		this.selectionHandler = new OsdSelectionHandler(
			this,
		);
	}
}
