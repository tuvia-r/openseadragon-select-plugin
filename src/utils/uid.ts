export const randomNumber = () =>
	Math.random().toString().slice(-1);

export const UID_LENGTH = 7;

export const uid = () => {
	let res = '';
	for (let i = 0; i < UID_LENGTH; i++) {
		res += randomNumber();
	}
	return res;
};
