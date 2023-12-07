import fs from "node:fs/promises";
import { multiplyAll } from "./utils/math";

async function run() {
  const data = await fs.readFile("./day6.input", "utf8");
  const [times, scores] = data.split("\n").map((row) =>
    row
      .split(":")[1]
      .split(" ")
      .filter((v) => v)
  );
  const possibleScores = getPossibleScores(times, scores);
  console.log("part1: ", multiplyAll(possibleScores));
  console.timeEnd("part1");
}

async function runB() {
  const data = await fs.readFile("./day6.input", "utf8");
  const [times, scores] = data.split("\n").map((row) =>
    row
      .split(":")[1]
      .split(" ")
      .filter((v) => v)
      .join("")
  );
  const possibleScores = getPossibleScore(times, scores);
  console.log("part2: ", possibleScores);
  console.timeEnd("part2");
}

function getPossibleScores(times: string[], scores: string[]) {
  return times.map((time, index) => {
    const maxTime = parseInt(time);
    const distanceToBeat = parseInt(scores[index]);
    let results = 0;
    for (let i = 0; i <= maxTime; i++) {
      const result = i * (maxTime - i);
      if (result > distanceToBeat) {
        results++;
      }
    }
    return results;
  });
}
function getPossibleScore(time: string, score: string) {
  const maxTime = parseInt(time);
  const distanceToBeat = parseInt(score);
  let results = 0;
  for (let i = 0; i <= maxTime; i++) {
    const result = i * (maxTime - i);
    if (result > distanceToBeat) {
      results++;
    }
  }
  return results;
}

console.time("part1");
run();
console.time("part2");
runB();
