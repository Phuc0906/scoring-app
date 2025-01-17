const countSum = (arr: number[]) => {
    return arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
};

export const Utils = {
    countSum,
}