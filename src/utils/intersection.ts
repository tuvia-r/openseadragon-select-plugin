import { Point } from './point';

export const areLinesIntersecting = (
	line1: [Point, Point],
	line2: [Point, Point],
) => {
	const [from1, to1] = line1;
	const [from2, to2] = line2;

	const dX: number = to1.x - from1.x;
	const dY: number = to1.y - from1.y;

	const determinant: number =
		dX * (to2.y - from2.y) - (to2.x - from2.x) * dY;
	if (determinant === 0) return false; // parallel lines

	const lambda: number =
		((to2.y - from2.y) * (to2.x - from1.x) +
			(from2.x - to2.x) * (to2.y - from1.y)) /
		determinant;
	const gamma: number =
		((from1.y - to1.y) * (to2.x - from1.x) +
			dX * (to2.y - from1.y)) /
		determinant;

	const hasIntersection =
		0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;

	return hasIntersection;
};
