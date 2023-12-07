import fs from "node:fs/promises";

async function run() {
  const data = await fs.readFile("./day7-test.input", "utf8");
  const rank = orderHands(data);
}

function orderHands(data) {
  const hands = data.split("\n").map((line) => line.split(" ")[0]);
  console.log(hands);
  // Five of a kind, where all five cards have the same label: AAAAA
  // Four of a kind, where four cards have the same label and one card has a different label: AA8AA
  // Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
  // Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
  // Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
  // One pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
  // High card, where all cards' labels are distinct: 23456
  const ranks = new Map();

  hands.forEach((hand: string) => {
    const cards = hand.split("").reduce((a, c: string, i, all: string[]) => {
      if (a[c]) {
        return a;
      } else {
        a[c] = hand.split(c).length - 1;
        return a;
      }
    }, {});
    const values = Object.values(cards);
    console.log(values);

    if (values.includes(5)) {
      const current = ranks.get("fiveOfAKind") || [];
      current.push(hand);
      ranks.set("fiveOfAKind", current);
    } else if (values.includes(4)) {
      const current = ranks.get("fourOfAKind") || [];
      current.push(hand);
      ranks.set("fourOfAKind", current);
    } else if (values.includes(3) && values.includes(2)) {
      const current = ranks.get("fullHouse") || [];
      current.push(hand);
      ranks.set("fullHouse", current);
    } else if (values.includes(3)) {
      const current = ranks.get("threeOfAKind") || [];
      current.push(hand);
      ranks.set("threeOfAKind", current);
    } else if (values.join("").split("2").length - 1 === 2) {
      const current = ranks.get("twoPair") || [];
      current.push(hand);
      ranks.set("twoPair", current);
    } else if (values.includes(2)) {
      const current = ranks.get("onePair") || [];
      current.push(hand);
      ranks.set("onePair", current);
    } else {
      const current = ranks.get("highCard") || [];
      current.push(hand);
      ranks.set("highCard", current);
    }
  });

  for (let rank of ranks.keys()) {
    const current: string[] = ranks.get(rank);
    if (!current) return;

    ranks.set(rank, current.toSorted(breakTie));
  }
  return ranks;
}

function breakTie(a, b) {
  const index =
    a[0] !== b[0]
      ? 0
      : a[1] !== b[1]
      ? 1
      : a[2] !== b[2]
      ? 2
      : a[3] !== b[3]
      ? 3
      : 4;
  let left = enumerate(a[index]);
  let right = enumerate(b[index]);

  return right - left;
}

function enumerate(value) {
  if (value === "A") return 14;
  else if (value === "K") return 13;
  else if (value === "Q") return 12;
  else if (value === "J") return 11;
  else if (value === "T") return 10;
  else return parseInt(value);
}

run();
