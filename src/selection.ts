import { Rect, Viewer } from 'openseadragon';
import { OsdSelectionHandler } from './handler';
import { ShapeSelection } from './selection/shape-selection';
import { BaseShape } from './shapes/base-shape';

export interface ViewerSelectionOptions {
	onSelection: (rect: Rect, shape: BaseShape) => void;
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
