import assert from "node:assert";
import fs from "node:fs/promises";

async function test() {
  const testData = await fs
    .readFile("./day1.input", "utf-8")
    .then((data) => data.split("\n"));

  const result = processData(testData);
  console.log(result);
}

function processData(data: string[]) {
  const numbers = data
    .map((data) => replaceSpeltNumbers(data))
    .map((data) => {
      return data
        .split("")
        .filter((char: string) => Number.isInteger(parseInt(char)));
    })
    .map((numbers) => parseInt([numbers[0], numbers.at(-1)].join("")));
  // 29, 83, 13, 24, 42, 14, and 76.
  return numbers.reduce((a, c) => a + c, 0);
}

function replaceSpeltNumbers(input: string) {
  const mapping = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };

  type WordNumber = keyof typeof mapping;
  let updatedString = "";
  const wordedNumber = Object.keys(mapping);

  input.split("").forEach((char) => {
    updatedString += char;
    wordedNumber.forEach((number) => {
      let possibleSwapIndex = updatedString.indexOf(number);
      if (possibleSwapIndex !== -1) {
        updatedString = updatedString.replace(
          number,
          String(mapping[number as WordNumber])
        );
      }
    });
  });

  return updatedString;
}

test();

async function solution() {
  const input = await fs.readFile("./day1.input", "utf-8");
  const i = input.split("\n").filter((v) => v);
  const numMap = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];

  let sum = 0;
  for (const line of i) {
    const digits = [
      ...line.matchAll(
        /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g
      )!,
    ].map((v) => v[1]);
    let num = digits[0] + digits.at(-1);

    num = num.replace(/one|two|three|four|five|six|seven|eight|nine/g, (v) =>
      String(numMap.indexOf(v) + 1)
    );
    sum += Number(num);
  }

  console.log(sum);
}

solution();
