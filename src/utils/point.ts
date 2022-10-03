import { positiveModulo } from './positiveModulo';
import { Point as OsdPoint } from 'openseadragon';

class PointImplementation {
	constructor(
		public x: number = 0,
		public y: number = 0,
	) {}
	apply(
		func: (v: number) => number,
	): PointImplementation {
		return new PointImplementation(
			func(this.x),
			func(this.y),
		);
	}
	clone(): PointImplementation {
		return new PointImplementation(this.x, this.y);
	}
	distanceTo(point: PointImplementation): number {
		return Math.sqrt(
			Math.pow(this.x - point.x, 2) +
				Math.pow(this.y - point.y, 2),
		);
	}
	divide(factor: number): PointImplementation {
		return new PointImplementation(
			this.x / factor,
			this.y / factor,
		);
	}
	equals(point: PointImplementation): boolean {
		return (
			point instanceof PointImplementation &&
			this.x === point.x &&
			this.y === point.y
		);
	}
	minus(point: PointImplementation): PointImplementation {
		return new PointImplementation(
			this.x - point.x,
			this.y - point.y,
		);
	}
	negate(): PointImplementation {
		return new PointImplementation(-this.x, -this.y);
	}
	plus(point: PointImplementation): PointImplementation {
		return new PointImplementation(
			this.x + point.x,
			this.y + point.y,
		);
	}
	rotate(
		degrees: number,
		pivot?: PointImplementation,
	): PointImplementation {
		pivot = pivot || new PointImplementation(0, 0);
		let cos: number;
		let sin: number;
		// Avoid float computations when possible
		if (degrees % 90 === 0) {
			const d = positiveModulo(degrees, 360);
			switch (d) {
				case 0:
					cos = 1;
					sin = 0;
					break;
				case 90:
					cos = 0;
					sin = 1;
					break;
				case 180:
					cos = -1;
					sin = 0;
					break;
				case 270:
					cos = 0;
					sin = -1;
					break;
			}
		} else {
			const angle = (degrees * Math.PI) / 180.0;
			cos = Math.cos(angle);
			sin = Math.sin(angle);
		}
		const x =
			cos * (this.x - pivot.x) -
			sin * (this.y - pivot.y) +
			pivot.x;
		const y =
			sin * (this.x - pivot.x) +
			cos * (this.y - pivot.y) +
			pivot.y;
		return new PointImplementation(x, y);
	}
	squaredDistanceTo(point: PointImplementation): number {
		return (
			Math.pow(this.x - point.x, 2) +
			Math.pow(this.y - point.y, 2)
		);
	}
	times(factor: number): PointImplementation {
		return new PointImplementation(
			this.x * factor,
			this.y * factor,
		);
	}
	toString(): string {
		return (
			'(' +
			Math.round(this.x * 100) / 100 +
			',' +
			Math.round(this.y * 100) / 100 +
			')'
		);
	}
}

let point: typeof OsdPoint =
	PointImplementation as unknown as typeof OsdPoint;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
point = window?.OpenSeadragon?.Point ?? PointImplementation;

export type Point = OsdPoint;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Point = point;
