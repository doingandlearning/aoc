import fs from "node:fs/promises";
import { sumAll } from "./utils/math";

async function run() {
  const data = (await fs.readFile("./day9.input", "utf8")).split("\n");
  const part1Results = data.map((sequence) => predictNextValue(sequence));
  console.log("Part 1:", sumAll(part1Results));
  const part2Results = data.map((sequence) => predictPreviousValue(sequence));
  console.log("Part 2:", sumAll(part2Results));
}

function predictNextValue(valueString: string) {
  const values = valueString.split(" ").map((el) => parseInt(el));

  let nextValue = lastValue(values);
  let currentValues = values;
  let finished = false;

  while (!finished) {
    currentValues = getDiffs(currentValues);
    nextValue += lastValue(currentValues);

    if (currentValues.filter((n) => n === 0).length === currentValues.length) {
      finished = true;
    }
  }

  return nextValue;
}

function predictPreviousValue(valueString: string) {
  const values = valueString.split(" ").map((el) => parseInt(el));
  let predictedValues = [values];
  let currentValues = values;
  let finished = false;

  while (!finished) {
    currentValues = getDiffs(currentValues);
    predictedValues.push(currentValues);

    if (currentValues.filter((n) => n === 0).length === currentValues.length) {
      finished = true;
    }
  }

  return predictedValues
    .reverse()
    .reduce((a, c) => lastValue(c.toReversed()) - a, 0);
}

function lastValue(arr: number[]) {
  return arr[arr.length - 1];
}

function getDiffs(nums: number[]) {
  return nums
    .map((val, ind, arr) => arr[ind + 1] - val)
    .filter((n: number) => !Number.isNaN(n));
}

run();
