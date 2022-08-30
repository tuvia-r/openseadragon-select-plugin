import './install';
import { OsdSelectionHandler } from './handler';
import { ViewerSelectionType } from './selection';
export * from './shapes';

declare module 'openseadragon' {
	interface Viewer {
		selectionHandler: OsdSelectionHandler;
		selection: ViewerSelectionType;
		initSelection: () => void;
	}
}
