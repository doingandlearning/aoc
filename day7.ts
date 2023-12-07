import fs from "node:fs/promises";

const LABELS = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];
const LABELS_PART2 = [
  "A",
  "K",
  "Q",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "J",
];

async function run() {
  const data = (await fs.readFile("./day7.input", "utf8")).split("\n");

  const parsed = data
    .map((line) => line.split(" "))
    .map((line) => line.map((col, i) => (i === 1 ? parseInt(col) : col)));

  const splits = Array(7)
    .fill(0)
    .map((_) => []);
  const splitsPart2 = Array(7)
    .fill(0)
    .map((_) => []);

  parsed.forEach((hand) => {
    const index = getType(hand[0]);
    const bestIndex = getBestType(hand[0]);
    splits[index].push(hand);
    splitsPart2[bestIndex].push(hand);
  });

  for (let i = 0; i < 7; i++) {
    if (splits[i].length !== 0)
      splits[i] = splits[i].toSorted((a, b) => compar(a, b, LABELS));
    if (splitsPart2[i].length !== 0)
      splitsPart2[i] = splitsPart2[i].toSorted((a, b) =>
        compar(a, b, LABELS_PART2)
      );
  }

  const getResult = (inputArr: number[][]) => {
    return inputArr
      .reduce((acc, arr) => [...arr, ...acc], [])
      .reduce((acc, hand, index) => acc + hand[1] * (index + 1), 0);
  };

  console.log("Part 1: ", getResult(splits));
  console.log("Part 2: ", getResult(splitsPart2));

  console.timeEnd();
}

function compar(hand1: string, hand2: string, labels: string[]) {
  const cards1 = hand1[0];
  const cards2 = hand2[0];
  for (let i = 0; i < cards1.length; i++) {
    if (cards1[i] !== cards2[i]) {
      return labels.indexOf(cards2[i]) - labels.indexOf(cards1[i]);
    }
  }
  return 0;
}

function getType(cards: string) {
  const map = new Map<string, number>();
  const unique = new Set(cards.split(""));
  cards.split("").forEach((ch) => {
    map.set(ch, (map.get(ch) || 0) + 1);
  });

  const counts: number[] = [...map.values()];

  if (unique.size === 1) return 0;
  if (unique.size === 2 && counts.find((n) => n === 4)) return 1;
  if (unique.size === 2 && counts.find((n) => n === 3)) return 2;
  if (unique.size === 3 && counts.find((n) => n === 3)) return 3;
  if (unique.size === 3 && counts.find((n) => n === 2)) return 4;
  if (unique.size === 4 && counts.find((n) => n === 2)) return 5;
  return 6;
}

function getBestType(cards: string) {
  let min = Infinity;
  let stack = [cards];
  let visited = new Set();
  while (stack.length > 0) {
    const current = stack.pop();
    if (visited.has(current)) continue;
    visited.add(current);
    const type = getType(current);
    if (min > type) min = type;
    if (current.indexOf("J") === -1 || type === 0) continue;
    const jokerPosition = current.indexOf("J");
    let newCards = current.split("");
    for (let j = 0; j < LABELS_PART2.length; j++) {
      newCards[jokerPosition] = LABELS_PART2[j];
      stack = [...stack, newCards.join("")];
    }
  }

  return min;
}
// Five of a kind, where all five cards have the same label: AAAAA
// Four of a kind, where four cards have the same label and one card has a different label: AA8AA
// Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
// Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
// Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
// One pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
// High card, where all cards' labels are distinct: 23456

console.time();
run();
