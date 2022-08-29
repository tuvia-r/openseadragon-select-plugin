import { Rect, Viewer } from 'openseadragon';
import { OsdSelectionHandler } from './handler';
import { ShapeSelection } from './selection/shape-selection';
import { BaseShape } from './shapes/base-shape';

export type ViewerSelectionType = (options: { onSelection: (rect: Rect, shape: BaseShape) => void }) => ShapeSelection;

export function selection(this: Viewer, options: { onSelection: (rect: Rect) => void }) {
  if (!this.selectionHandler) {
    this.selectionHandler = new OsdSelectionHandler(this);
  }
  return new ShapeSelection(this.selectionHandler.frontCanvas, options.onSelection);
}
