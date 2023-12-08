import fs from "node:fs/promises";

async function run() {
  const [instructions, coords] = (
    await fs.readFile("./day8.input", "utf8")
  ).split("\n\n");

  const map = new Map();
  coords.split("\n").forEach((line) => {
    const [key, value] = line.split(" = ");
    const [left, right] = value.replace("(", "").replace(")", "").split(", ");
    map.set(key, [left, right]);
  });

  // let part1Count = part1(instructions, map);
  // console.log("Part 1: ", part1Count);

  let part2Count = part2(instructions, map);
}

run();
function part1(instructions: string, map: Map<any, any>) {
  let count = 0;
  let currentPosition = "AAA";

  while (currentPosition !== "ZZZ") {
    const nextInstruction = instructions[count % instructions.length];
    const currentArray = map.get(currentPosition);
    currentPosition =
      nextInstruction === "L" ? currentArray[0] : currentArray[1];
    count++;
  }
  return count;
}

function part2(instructions: string, map: Map<any, any>) {
  let positions = [...map.keys()].filter((val: string) => val.endsWith("A"));
  console.log(positions.length, positions);
  let count = 0;
  let finished = false;

  while (!finished) {
    const step = instructions[count % instructions.length];
    positions = positions.map((current) => {
      return cachedValue(map, current, step);
    });
    count++;

    if (count % 10000000 === 0) {
      console.log(count, positions);
    }

    finished =
      positions.filter((position) => position.endsWith("Z")).length ===
      positions.length;
  }

  console.log(count, positions);
}
const cache = new Map();
function cachedValue(map: Map<any, any>, current: any, step: string) {
  const key = `${current}-${step}`;
  let result;
  if (cache.has(key)) {
    return cache.get(key);
  } else {
    const currentArray = map.get(current);
    result = step === "L" ? currentArray[0] : currentArray[1];
    cache.set(key, result);
    return result;
  }
}

const memoize = <T = any>(fn: Func<T>) => {
  const cache = new Map();
  const cached = function (this: any, val: T) {
    return cache.has(val)
      ? cache.get(val)
      : cache.set(val, fn.call(this, val)) && cache.get(val);
  };
  cached.cache = cache;
  return cached;
};
