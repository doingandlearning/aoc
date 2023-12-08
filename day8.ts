import fs from "node:fs/promises";
import { lcm } from "./utils/math";

async function run() {
  const data = (await fs.readFile("./day8.input", "utf8")).split("\n\n");

  const turns = data[0].split("");
  const instructions = data[1].split("\n").map((line) => {
    const [from, left, right] = line.match(/[A-Z]+/g);
    return [from, [left, right]];
  });

  const points = Object.fromEntries(instructions);
  const starts = instructions.filter((i) => i[0][2] === "A").map((el) => el[0]);
  function solve(position = "AAA") {
    let steps = 0;

    while (true) {
      const turn = turns[steps++ % turns.length];
      position = points[position][turn === "L" ? 0 : 1];
      if (position[2] === "Z") {
        break;
      }
    }
    return steps;
  }

  console.log("Part 1", solve());
  console.log(
    "Part 2",
    starts.map(solve).reduce((a, b) => lcm(a, b), 1)
  );
  console.timeEnd();
}
console.time();
run();
