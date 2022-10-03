export const positiveModulo = (
	number: number,
	modulo: number,
) => {
	let result = number % modulo;
	if (result < 0) {
		result += modulo;
	}
	return result;
};
