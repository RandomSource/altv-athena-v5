export const nearestValue = (arr: any[], val: number) =>
    arr.reduce((p, n) => (Math.abs(p) > Math.abs(n - val) ? n - val : p), Infinity) + val;
