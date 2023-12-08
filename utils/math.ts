export function sum(first: number, second: number) {
  return first + second;
}

export function sumAll(numbers: number[]) {
  return numbers.reduce(sum);
}

export function subtract(first: number, second: number) {
  return first - second;
}

export function subtractAll(numbers: number[]) {
  return numbers.reduce(subtract);
}

export function multiply(first: number, second: number) {
  return first * second;
}

export function multiplyAll(numbers: number[]) {
  return numbers.reduce(multiply);
}

export function divide(first: number, second: number) {
  return first / second;
}

export function divideAll(numbers: number[]) {
  return numbers.reduce(divide);
}

const lcmOverTwo = (x?: number, y?: number): number =>
  !x || !y ? 0 : Math.abs((x * y) / gcd(x, y));

export const lcm = (x?: number | number[], y?: number): number =>
  Array.isArray(x) ? x.reduce((a, n) => lcmOverTwo(a, n), 1) : lcmOverTwo(x, y);

export function gcd(a: number, b: number) {
  if (b === 0) return a;
  return gcd(b, a % b);
}
