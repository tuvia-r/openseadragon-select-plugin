
export const randomNumber = () => (Math.random() * 10).toFixed(0);

export const UID_LENGTH = 7;

export const uid = () => {
    let res = '';
    for(let i = 0; i < UID_LENGTH; i++){
        res += randomNumber();
    }
    return res;
}