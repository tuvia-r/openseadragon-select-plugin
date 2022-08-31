import { BaseShape } from './base-shape';

export abstract class GroupShape<
	T extends BaseShape = BaseShape,
> extends BaseShape {
	abstract readonly shapes: T[];

	toPath2D() {
		const path2D = new Path2D();
		for (const shape of this.shapes) {
			path2D.addPath(shape.toPath2D());
		}
		path2D.closePath();
		return path2D;
	}
}
