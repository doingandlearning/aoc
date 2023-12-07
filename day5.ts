import fs from "node:fs/promises";

async function runA() {
  const data = (await fs.readFile("./day5.input", "utf8")).split("\n\n");
  const seeds = data.shift()?.split(" ");
  seeds?.splice(0, 1);

  const maps = createMaps(data);
  const results = processSeeds(seeds, maps);
  console.log("part1: ", Math.min(...results));

  let resultB = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < seeds.length / 2; i++) {
    const start = parseInt(seeds[2 * i]);
    const range = parseInt(seeds[2 * i + 1]);
    for (let j = 0; j < range; j++) {
      const seedValue = start + j;
      const result = processSeed(seedValue, maps);
      if (result < resultB) {
        resultB = result; // Update resultB if the current result is smaller
      }
    }
  }
  console.log("part2: ", resultB);
}

function createMaps(data) {
  return data.reduce((acc, mapping) => {
    const [nameString, ...rows] = mapping.split("\n");
    const ranges = rows.map((row) => {
      const [destination, source, range] = row.split(" ").map(Number);
      return {
        start: source,
        end: source + range,
        transformation: destination - source,
      };
    });
    const name = nameString.split(" ")[0];
    acc[name] = ranges;
    return acc;
  }, {});
}

function processSeed(seed, maps) {
  const transformationSteps = [
    "seed-to-soil",
    "soil-to-fertilizer",
    "fertilizer-to-water",
    "water-to-light",
    "light-to-temperature",
    "temperature-to-humidity",
    "humidity-to-location",
  ];

  return transformationSteps.reduce((currentValue, step) => {
    if (!maps[step]) {
      console.error(`No mapping found for step: ${step}`);
      return currentValue;
    }

    for (let { start, end, transformation } of maps[step]) {
      if (currentValue >= start && currentValue <= end) {
        return currentValue + transformation;
      }
    }

    return currentValue;
  }, seed);
}

function processSeeds(seeds, maps) {
  return (
    seeds?.map((seed) => {
      return transformSeed(parseInt(seed), maps);
    }) || []
  );
}

function transformSeed(seed, maps) {
  const steps = [
    "seed-to-soil",
    "soil-to-fertilizer",
    "fertilizer-to-water",
    "water-to-light",
    "light-to-temperature",
    "temperature-to-humidity",
    "humidity-to-location",
  ];

  return steps.reduce((currentValue, step) => {
    if (!maps[step]) {
      console.error(`No mapping found for step: ${step}`);
      return currentValue;
    }

    for (let { start, end, transformation } of maps[step]) {
      if (currentValue >= start && currentValue <= end) {
        return currentValue + transformation;
      }
    }

    return currentValue;
  }, seed);
}

function expandSeeds(seeds) {
  const newSeeds = [];
  for (let i = 0; i < seeds.length / 2; i++) {
    const start = parseInt(seeds[2 * i]);
    const range = parseInt(seeds[2 * i + 1]);
    for (let j = 0; j < range; j++) {
      newSeeds.push(start + j);
    }
  }
  return newSeeds;
}

runA().catch((e) => console.error(e));

// async function run() {
//   const data = (await fs.readFile("./day5-test.input", "utf8")).split("\n\n");
//   const seeds = data.shift()?.split(" ");
//   seeds?.splice(0, 1);

//   const results = seedMapper(data, seeds);
//   console.log("part1: ", Math.min(...results));

//   const newSeeds = [];
//   for (let i = 0; i < seeds.length / 2; i++) {
//     const start = parseInt(seeds[2 * i]);
//     const range = parseInt(seeds[2 * i + 1]);
//     for (let j = 0; j < range; j++) {
//       newSeeds.push(start + j);
//     }
//   }
//   const resultsB = seedMapper(data, newSeeds);
//   console.log("part2: ", Math.min(...resultsB));
// }

// run();
// function seedMapper(data: string[], seeds: string[] | undefined) {
//   const maps = data.reduce((a, mapping) => {
//     const [nameString, ...rows] = mapping.split("\n");
//     const name = nameString.split(" ")[0];

//     const ranges = [] || a[name].ranges;
//     rows.forEach((row) => {
//       const [destination, source, range] = row
//         .split(" ")
//         .map((n) => parseInt(n));
//       ranges.push({
//         start: source,
//         end: source + range,
//         transformation: destination - source,
//       });
//     });

//     function get(input) {
//       const value = parseInt(input);
//       for (let i = 0; i < ranges.length; i++) {
//         if (value >= ranges[i].start && value <= ranges[i].end) {
//           return value + ranges[i].transformation;
//         }
//       }
//       return value;
//     }

//     a[name] = { get, ranges };
//     return a;
//   }, {});

//   const results = [];

//   seeds?.forEach((seed) => {
//     //seed-to-soil
//     const soil = maps["seed-to-soil"].get(seed);
//     // soil-to-fertilizer
//     const fertilizer = maps["soil-to-fertilizer"].get(soil);
//     // fertilizer-to-water
//     const water = maps["fertilizer-to-water"].get(fertilizer);
//     // water-to-light
//     const light = maps["water-to-light"].get(water);
//     // light-to-temperature
//     const temperature = maps["light-to-temperature"].get(light);
//     // temperature-to-humidity
//     const humidity = maps["temperature-to-humidity"].get(temperature);
//     // humidity-to-location
//     const location = maps["humidity-to-location"].get(humidity);

//     results.push(location);
//   });
//   return results;
// }
