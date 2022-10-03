import { Point } from './point';
import { positiveModulo } from './positiveModulo';
import { Rect as OsdRect } from 'openseadragon';

class RectImplementation {
	static fromSummits(
		topLeft: Point,
		topRight: Point,
		bottomLeft: Point,
	) {
		const width = topLeft.distanceTo(topRight);
		const height = topLeft.distanceTo(bottomLeft);
		const diff = topRight.minus(topLeft);
		let radians = Math.atan(diff.y / diff.x);
		if (diff.x < 0) {
			radians += Math.PI;
		} else if (diff.y < 0) {
			radians += 2 * Math.PI;
		}
		return new RectImplementation(
			topLeft.x,
			topLeft.y,
			width,
			height,
			(radians / Math.PI) * 180,
		);
	}
	constructor(
		public x: number = 0,
		public y: number = 0,
		public width: number = 0,
		public height: number = 0,
		public degrees: number = 0,
	) {}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	private _getSegments() {
		const topLeft = this.getTopLeft();
		const topRight = this.getTopRight();
		const bottomLeft = this.getBottomLeft();
		const bottomRight = this.getBottomRight();
		return [
			[topLeft, topRight],
			[topRight, bottomRight],
			[bottomRight, bottomLeft],
			[bottomLeft, topLeft],
		];
	}
	clone(): RectImplementation {
		return new RectImplementation(
			this.x,
			this.y,
			this.width,
			this.height,
			this.degrees,
		);
	}
	containsPoint(point: Point, epsilon?: number): boolean {
		epsilon = epsilon || 0;

		// See http://stackoverflow.com/a/2752754/1440403 for explanation
		const topLeft = this.getTopLeft();
		const topRight = this.getTopRight();
		const bottomLeft = this.getBottomLeft();
		const topDiff = topRight.minus(topLeft);
		const leftDiff = bottomLeft.minus(topLeft);

		return (
			(point.x - topLeft.x) * topDiff.x +
				(point.y - topLeft.y) * topDiff.y >=
				-epsilon &&
			(point.x - topRight.x) * topDiff.x +
				(point.y - topRight.y) * topDiff.y <=
				epsilon &&
			(point.x - topLeft.x) * leftDiff.x +
				(point.y - topLeft.y) * leftDiff.y >=
				-epsilon &&
			(point.x - bottomLeft.x) * leftDiff.x +
				(point.y - bottomLeft.y) * leftDiff.y <=
				epsilon
		);
	}
	equals(other: RectImplementation): boolean {
		return (
			other instanceof RectImplementation &&
			this.x === other.x &&
			this.y === other.y &&
			this.width === other.width &&
			this.height === other.height &&
			this.degrees === other.degrees
		);
	}
	getAspectRatio(): number {
		return this.width / this.height;
	}
	getBottomLeft(): Point {
		return new Point(
			this.x,
			this.y + this.height,
		).rotate(this.degrees, this.getTopLeft());
	}
	getBottomRight(): Point {
		return new Point(
			this.x + this.width,
			this.y + this.height,
		).rotate(this.degrees, this.getTopLeft());
	}
	getBoundingBox(): RectImplementation {
		if (this.degrees === 0) {
			return this.clone();
		}
		const topLeft = this.getTopLeft();
		const topRight = this.getTopRight();
		const bottomLeft = this.getBottomLeft();
		const bottomRight = this.getBottomRight();
		const minX = Math.min(
			topLeft.x,
			topRight.x,
			bottomLeft.x,
			bottomRight.x,
		);
		const maxX = Math.max(
			topLeft.x,
			topRight.x,
			bottomLeft.x,
			bottomRight.x,
		);
		const minY = Math.min(
			topLeft.y,
			topRight.y,
			bottomLeft.y,
			bottomRight.y,
		);
		const maxY = Math.max(
			topLeft.y,
			topRight.y,
			bottomLeft.y,
			bottomRight.y,
		);
		return new RectImplementation(
			minX,
			minY,
			maxX - minX,
			maxY - minY,
		);
	}
	getCenter(): Point {
		return new Point(
			this.x + this.width / 2.0,
			this.y + this.height / 2.0,
		).rotate(this.degrees, this.getTopLeft());
	}
	getIntegerBoundingBox(): RectImplementation {
		const boundingBox = this.getBoundingBox();
		const x = Math.floor(boundingBox.x);
		const y = Math.floor(boundingBox.y);
		const width = Math.ceil(
			boundingBox.width + boundingBox.x - x,
		);
		const height = Math.ceil(
			boundingBox.height + boundingBox.y - y,
		);
		return new RectImplementation(x, y, width, height);
	}
	getSize(): Point {
		return new Point(this.width, this.height);
	}
	getTopLeft(): Point {
		return new Point(this.x, this.y);
	}
	getTopRight(): Point {
		return new Point(
			this.x + this.width,
			this.y,
		).rotate(this.degrees, this.getTopLeft());
	}
	intersection(
		rect: RectImplementation,
	): RectImplementation {
		// Simplified version of Weiler Atherton clipping algorithm
		// https://en.wikipedia.org/wiki/Weiler%E2%80%93Atherton_clipping_algorithm
		// Because we just want the bounding box of the intersection,
		// we can just compute the bounding box of:
		// 1. all the summits of this which are inside rect
		// 2. all the summits of rect which are inside this
		// 3. all the intersections of rect and this
		const EPSILON = 0.0000000001;

		const intersectionPoints = [];

		const thisTopLeft = this.getTopLeft();
		if (rect.containsPoint(thisTopLeft, EPSILON)) {
			intersectionPoints.push(thisTopLeft);
		}
		const thisTopRight = this.getTopRight();
		if (rect.containsPoint(thisTopRight, EPSILON)) {
			intersectionPoints.push(thisTopRight);
		}
		const thisBottomLeft = this.getBottomLeft();
		if (rect.containsPoint(thisBottomLeft, EPSILON)) {
			intersectionPoints.push(thisBottomLeft);
		}
		const thisBottomRight = this.getBottomRight();
		if (rect.containsPoint(thisBottomRight, EPSILON)) {
			intersectionPoints.push(thisBottomRight);
		}

		const rectTopLeft = rect.getTopLeft();
		if (this.containsPoint(rectTopLeft, EPSILON)) {
			intersectionPoints.push(rectTopLeft);
		}
		const rectTopRight = rect.getTopRight();
		if (this.containsPoint(rectTopRight, EPSILON)) {
			intersectionPoints.push(rectTopRight);
		}
		const rectBottomLeft = rect.getBottomLeft();
		if (this.containsPoint(rectBottomLeft, EPSILON)) {
			intersectionPoints.push(rectBottomLeft);
		}
		const rectBottomRight = rect.getBottomRight();
		if (this.containsPoint(rectBottomRight, EPSILON)) {
			intersectionPoints.push(rectBottomRight);
		}

		const thisSegments = this._getSegments();
		const rectSegments = rect._getSegments();
		for (let i = 0; i < thisSegments.length; i++) {
			const thisSegment = thisSegments[i];
			for (let j = 0; j < rectSegments.length; j++) {
				const rectSegment = rectSegments[j];
				const intersect = getIntersection(
					thisSegment[0],
					thisSegment[1],
					rectSegment[0],
					rectSegment[1],
				);
				if (intersect) {
					intersectionPoints.push(intersect);
				}
			}
		}

		// Get intersection point of segments [a,b] and [c,d]
		function getIntersection(a, b, c, d) {
			// http://stackoverflow.com/a/1968345/1440403
			const abVector = b.minus(a);
			const cdVector = d.minus(c);

			const denom =
				-cdVector.x * abVector.y +
				abVector.x * cdVector.y;
			if (denom === 0) {
				return null;
			}

			const s =
				(abVector.x * (a.y - c.y) -
					abVector.y * (a.x - c.x)) /
				denom;
			const t =
				(cdVector.x * (a.y - c.y) -
					cdVector.y * (a.x - c.x)) /
				denom;

			if (
				-EPSILON <= s &&
				s <= 1 - EPSILON &&
				-EPSILON <= t &&
				t <= 1 - EPSILON
			) {
				return new Point(
					a.x + t * abVector.x,
					a.y + t * abVector.y,
				);
			}
			return null;
		}

		if (intersectionPoints.length === 0) {
			return null;
		}

		let minX = intersectionPoints[0].x;
		let maxX = intersectionPoints[0].x;
		let minY = intersectionPoints[0].y;
		let maxY = intersectionPoints[0].y;
		for (
			let k = 1;
			k < intersectionPoints.length;
			k++
		) {
			const point = intersectionPoints[k];
			if (point.x < minX) {
				minX = point.x;
			}
			if (point.x > maxX) {
				maxX = point.x;
			}
			if (point.y < minY) {
				minY = point.y;
			}
			if (point.y > maxY) {
				maxY = point.y;
			}
		}
		return new RectImplementation(
			minX,
			minY,
			maxX - minX,
			maxY - minY,
		);
	}
	rotate(
		degrees: number,
		pivot?: Point,
	): RectImplementation {
		degrees = positiveModulo(degrees, 360);
		if (degrees === 0) {
			return this.clone();
		}

		pivot = pivot || this.getCenter();
		const newTopLeft = this.getTopLeft().rotate(
			degrees,
			pivot,
		);
		const newTopRight = this.getTopRight().rotate(
			degrees,
			pivot,
		);

		let diff = newTopRight.minus(newTopLeft);
		// Handle floating point error
		diff = diff.apply(function (x) {
			const EPSILON = 1e-15;
			return Math.abs(x) < EPSILON ? 0 : x;
		});
		let radians = Math.atan(diff.y / diff.x);
		if (diff.x < 0) {
			radians += Math.PI;
		} else if (diff.y < 0) {
			radians += 2 * Math.PI;
		}
		return new RectImplementation(
			newTopLeft.x,
			newTopLeft.y,
			this.width,
			this.height,
			(radians / Math.PI) * 180,
		);
	}
	times(factor: number): RectImplementation {
		return new RectImplementation(
			this.x * factor,
			this.y * factor,
			this.width * factor,
			this.height * factor,
			this.degrees,
		);
	}
	toString(): string {
		return (
			'[' +
			Math.round(this.x * 100) / 100 +
			', ' +
			Math.round(this.y * 100) / 100 +
			', ' +
			Math.round(this.width * 100) / 100 +
			'x' +
			Math.round(this.height * 100) / 100 +
			', ' +
			Math.round(this.degrees * 100) / 100 +
			'deg' +
			']'
		);
	}
	translate(delta: Point): RectImplementation {
		return new RectImplementation(
			this.x + delta.x,
			this.y + delta.y,
			this.width,
			this.height,
			this.degrees,
		);
	}
	union(rect: RectImplementation): RectImplementation {
		const thisBoundingBox = this.getBoundingBox();
		const otherBoundingBox = rect.getBoundingBox();

		const left = Math.min(
			thisBoundingBox.x,
			otherBoundingBox.x,
		);
		const top = Math.min(
			thisBoundingBox.y,
			otherBoundingBox.y,
		);
		const right = Math.max(
			thisBoundingBox.x + thisBoundingBox.width,
			otherBoundingBox.x + otherBoundingBox.width,
		);
		const bottom = Math.max(
			thisBoundingBox.y + thisBoundingBox.height,
			otherBoundingBox.y + otherBoundingBox.height,
		);

		return new RectImplementation(
			left,
			top,
			right - left,
			bottom - top,
		);
	}
}

let rect: typeof OsdRect =
	RectImplementation as unknown as typeof OsdRect;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
let osd = window?.OpenSeadragon;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
if (!osd) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	osd = require('openseadragon');
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
rect = osd?.Rect ?? RectImplementation;

export type Rect = OsdRect;
// eslint-disable-next-line @typescript-eslint/naming-convention
export const Rect = rect;
