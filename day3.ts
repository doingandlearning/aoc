import fs from "node:fs/promises";

interface NumberWithCoord {
  [key: string]: Array<Coord>;
}

interface Coord {
  x: number;
  y: number;
}

async function run() {
  const data = await getData();
  const { symbols, ...numbersWithCoords } = getNumbersWithCoords(data);
  const validNumbers = Object.keys(numbersWithCoords).filter((number) => {
    return coordInArray(numbersWithCoords[number], symbols);
  });
  console.log(validNumbers.reduce((a, c) => a + parseInt(c), 0));

  // Max: 354315

  // Answer: 318173 ??
}

function coordInArray(numberArray: Coord[], symbolArray: Coord[]) {
  return (
    numberArray
      .map((coord) => {
        for (let i = 0; i < symbolArray.length; i++) {
          if (isWithinRange(coord, symbolArray[i])) {
            return true;
          }
        }
        return false;
      })
      .filter((target) => target).length > 0
  );
}

function isWithinRange(coordA: Coord, coordB: Coord) {
  const { x, y } = coordA;

  const possibleX = [x - 1, x, x + 1];
  const possibleY = [y - 1, y, y + 1];

  const possibleCoords: Coord[] = [];
  possibleX.forEach((x) => {
    possibleY.forEach((y) => {
      possibleCoords.push({ x, y });
    });
  });

  const { x: targetX, y: targetY } = coordB;

  return (
    possibleCoords.filter((coord) => coord.x === targetX && coord.y === targetY)
      .length > 0
  );
}

async function getData() {
  const data = await fs.readFile("day3.input", "utf8");
  return data.split("\n");
}

function getNumbersWithCoords(data: string[]) {
  const result: NumberWithCoord = { symbols: [] };
  let currentCoords: Array<Coord> = [];
  let currentNumber: string = "";
  for (let x = 0; x < data[0].length; x++) {
    for (let y = 0; y < data.length; y++) {
      const char = data[x][y];
      if (char === ".") {
        result[currentNumber] = currentCoords;
        currentCoords = [];
        currentNumber = "";
      } else if (Number.isNaN(parseInt(char))) {
        result[currentNumber] = currentCoords;
        currentCoords = [];
        currentNumber = "";
        result["symbols"].push({ x, y });
      } else {
        currentCoords.push({ x, y });
        currentNumber += data[x][y];
      }
    }
  }

  delete result[""];

  return result;
}

run();

import { multiplyAll } from "./utils/math";

type Point = [x: number, y: number];

type Line = [start: Point, end: Point];

type Parts = Map<number, Line[]>;

type Symbols = Map<string, Point[]>;

type Schematic = [parts: Parts, symbols: Symbols];

async function getInput() {
  const text = await fs.readFile("./day3.input", "utf8");

  const parts: Parts = new Map();

  const symbols: Symbols = new Map();

  for (const [y, line] of text.split("\n").entries()) {
    for (const match of line.matchAll(/\d+/g)) {
      const number = String(match);
      const x = match.index!;
      parts.set(+number, [
        ...(parts.get(+number) || []),
        [
          [x, y],
          [x + (number.length - 1), y],
        ],
      ]);
    }

    for (const match of line.matchAll(/[^\.\d]/g)) {
      if (match.index === undefined) continue;
      const symbol = String(match);
      symbols.set(symbol, [...(symbols.get(symbol) || []), [match.index, y]]);
    }
  }
  return [parts, symbols] as Schematic;
}

async function runb() {
  const schematic = await getInput();
  const sumOfPartNumbers = getSumOfPartNumbers(schematic);
  console.log("Sum of part numbers:", sumOfPartNumbers, "(Part 1)");
  const sumOfGearRatios = getSumOfGearRatios(schematic);
  console.log(`Sum of gear ratios: ${sumOfGearRatios} (Part 2)`);
}

runb();

export function getSumOfPartNumbers([parts, symbols]: Schematic) {
  let sum = 0;

  const symbolPoints = [...symbols.values()].flat();

  for (const [number, instances] of parts.entries()) {
    for (const [[x1, y], [x2]] of instances) {
      const isPartNumber = symbolPoints.some(([xs, ys]) => {
        const xRange = xs >= x1 - 1 && xs <= x2 + 1;
        const yRange = ys >= y - 1 && ys <= y + 1;
        return xRange && yRange;
      });

      if (!isPartNumber) continue;

      sum += number;
    }
  }

  return sum;
}

function getSumOfGearRatios([parts, symbols]: Schematic) {
  let sum = 0;

  const gears = symbols.get("*")!;

  const partEntries = [...parts.entries()];

  for (const [xg, yg] of gears) {
    const adjacentParts: number[] = [];

    for (const [number, instances] of partEntries) {
      for (const [[x1, y], [x2]] of instances) {
        const xRange = xg >= x1 - 1 && xg <= x2 + 1;
        const yRange = yg >= y - 1 && yg <= y + 1;
        if (xRange && yRange) adjacentParts.push(number);
      }
    }

    if (adjacentParts.length !== 2) continue;

    sum += multiplyAll(adjacentParts);
  }

  return sum;
}
