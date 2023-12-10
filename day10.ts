const fs = require("fs/promises");

async function processFile() {
  type Grid = {
    [key: string]: string;
  };
  const data = await fs.readFile(process.argv[2], "utf8");
  const lines = data.split("\n");
  const grid: Grid = {};
  let gridRow = 0;

  lines.forEach((line: string) => {
    for (let x = 0; x < line.length; x++) {
      grid[`${x},${gridRow}`] = line[x];
    }
    gridRow++;
  });

  const keys = Object.keys(grid).map((k) => k.split(",").map(Number));

  const xl = Math.min(...keys.map(([x, _]) => x));
  const xh = Math.max(...keys.map(([x, _]) => x));
  const yl = Math.min(...keys.map(([_, y]) => y));
  const yh = Math.max(...keys.map(([_, y]) => y));

  const [sx, sy] = Object.entries(grid)
    .find(([_, v]) => v === "S")
    .map((k) => k.split(",").map(Number))[0];
  let [px, py] = [sx, sy];

  const directions = { N: 0, E: 1, S: 2, W: 3 };
  let d = directions["N"];

  if (
    grid[`${px},${py - 1}`] === "|" ||
    grid[`${px},${py - 1}`] === "7" ||
    grid[`${px},${py - 1}`] === "F"
  )
    d = directions["N"];
  else if (
    grid[`${px - 1},${py}`] === "-" ||
    grid[`${px - 1},${py}`] === "J" ||
    grid[`${px - 1},${py}`] === "7"
  )
    d = directions["E"];
  else if (
    grid[`${px},${py + 1}`] === "|" ||
    grid[`${px},${py + 1}`] === "L" ||
    grid[`${px},${py + 1}`] === "J"
  )
    d = directions["S"];
  else if (
    grid[`${px + 1},${py}`] === "-" ||
    grid[`${px + 1},${py}`] === "L" ||
    grid[`${px + 1},${py}`] === "F"
  )
    d = directions["W"];
  const visited = {};
  let i = 0;

  while (true) {
    visited[`${px},${py}`] = i;
    switch (d) {
      case directions["N"]:
        py -= 1;
        break;
      case directions["E"]:
        px += 1;
        break;
      case directions["S"]:
        py += 1;
        break;
      case directions["W"]:
        px -= 1;
        break;
    }
    i++;
    if (`${px},${py}` === `${sx},${sy}`) {
      break;
    }

    const turnMappings = {
      "N|": "N",
      NF: "E",
      N7: "W",
      "E-": "E",
      EJ: "N",
      E7: "S",
      "S|": "S",
      SJ: "W",
      SL: "E",
      "W-": "W",
      WL: "N",
      WF: "S",
    };

    const turnKey = `${Object.keys(directions).find(
      (key) => directions[key] === d
    )}${grid[`${px},${py}`]}`;
    d = directions[turnMappings[turnKey]];
  }
  console.log(i / 2);

  let t = 0;
  for (let y = yl; y <= yh; y++) {
    let w = 0;
    for (let x = xl; x <= xh; x++) {
      if (
        visited[`${x},${y}`] !== undefined &&
        visited[`${x},${y + 1}`] !== undefined
      ) {
        if (visited[`${x},${y + 1}`] === (visited[`${x},${y}`] + 1) % i) {
          w += 1;
        } else if (
          (visited[`${x},${y + 1}`] + 1) % i ===
          visited[`${x},${y}`]
        ) {
          w -= 1;
        }
      }
      t += !visited[`${x},${y}`] && w !== 0 ? 1 : 0;
    }
  }
  console.log(t);
}

processFile();
