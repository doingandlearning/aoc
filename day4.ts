import fs from "node:fs/promises";
import { sumAll } from "./utils/math";

async function run() {
  const data = await fs
    .readFile("./day4.input", "utf8")
    .then((data) => data.split("\n"));

  console.log("part1: ", sumAll(data.map((game) => calculateScore(game))));

  console.log("part2:", sumAll(calculatePart2(data)));
}

function calculateScore(game: string) {
  const score = getNumberOfWinningNumbers(game);
  if (score.length === 0) {
    return 0;
  }
  return 2 ** (score.length - 1);
}

function getNumberOfWinningNumbers(game: string) {
  const [gameAndWinning, scoreData] = game.split("|");
  const winningNumbers = gameAndWinning
    .split(":")[1]
    .trim()
    .split(" ")
    .filter((v) => v !== "");
  const actualRound = scoreData.trim().split(" ");

  const score = actualRound.filter((num) => winningNumbers.includes(num));
  return score;
}

function calculatePart2(data: string[]) {
  const scoreArray = data.map((game) => getNumberOfWinningNumbers(game).length);
  const currentScore = Array(data.length).fill(0);

  scoreArray.forEach((score, idx) => {
    if (score === 0 || idx === data.length) return;

    for (let i = 0; i < score; i++) {
      currentScore[idx + i + 1] +=
        currentScore[idx] > 0 ? currentScore[idx] + 1 : 1;
      // currentScore[i + 1]++;
    }
  });
  return currentScore.map((el) => el + 1);
}

run();
