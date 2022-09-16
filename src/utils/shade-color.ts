// https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors

export const linearShade = (
	percentage: number,
	rgbColorString: string,
) => {
	const [a, b, c, d] = rgbColorString.split(',');
	const isNegativePercentage = percentage < 0;
	const t = isNegativePercentage ? 0 : 255 * percentage;
	const P = isNegativePercentage
		? 1 + percentage
		: 1 - percentage;
	return (
		'rgb' +
		(d ? 'a(' : '(') +
		Math.round(
			parseInt(
				a[3] == 'a' ? a.slice(5) : a.slice(4),
			) *
				P +
				t,
		) +
		',' +
		Math.round(parseInt(b) * P + t) +
		',' +
		Math.round(parseInt(c) * P + t) +
		(d ? ',' + d : ')')
	);
};
