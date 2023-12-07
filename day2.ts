// In the example above, games 1, 2, and 5 would have been possible
// if the bag had been loaded with that configuration. However, game 3
// would have been impossible because at one point the Elf showed you 20
// red cubes at once; similarly, game 4 would also have been impossible
// because the Elf showed you 15 blue cubes at once. If you add up the IDs
// of the games that would have been possible, you get 8.
import fs from "node:fs/promises";

async function getData() {
  const data = await fs.readFile("./day2.input", "utf8");

  const object = data.split("\n").map((row) => {
    const [id, attempts] = row.split(":");
    const max = { red: 0, blue: 0, green: 0 };
    type numberKey = keyof typeof max;
    attempts
      .split(";")
      .filter((v) => v)
      .forEach((attempt) => {
        const rounds = attempt.split(",");
        rounds.forEach((round) => {
          const [numberString, color] = round.trim().split(" ");
          max[color as numberKey] = Math.max(
            max[color as numberKey],
            parseInt(numberString)
          );
        });
      });

    return { name: id, max };
  });

  return object;
}

async function solution1() {
  const data = await getData();
  console.log(
    data
      .filter(
        (game) =>
          game.max.red <= 12 && game.max.blue <= 14 && game.max.green <= 13
      )
      .map((game) => game.name.split(" ")[1])
      .reduce((a, c) => a + parseInt(c), 0)
  );
}

async function solution2() {
  const data = await getData();

  console.log(
    data
      .map(({ max: { red, blue, green } }) => red * blue * green)
      .reduce((a, c) => a + c, 0)
  );
}

solution1();
solution2();
