import { OsdSelectionHandler } from './handler';
import { ViewerSelectionType } from './selection';
import './install';
export * from './shapes';
export { ShapeNames } from './drawer/draw-shape';

declare module 'openseadragon' {
	interface Viewer {
		selectionHandler: OsdSelectionHandler;
		/**
		 * start a selection instance
		 */
		selection: ViewerSelectionType;
		/**
		 * this has to be called before referencing `Viewer.selectionHandler`
		 * if `Viewer.selection` was not called before.
		 */
		initSelection: () => void;
	}
}
