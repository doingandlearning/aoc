"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("node:fs/promises"));
async function run() {
  const day = process.argv[2];
  if (!day) {
    console.log("You need to provide a numeric day.");
    process.exit(1);
  }
  await Promise.all([
    promises_1.default.writeFile(
      `./day${day}.ts`,
      `import fs from "node:fs/promises";

async function run() {
	const data = await fs.readFile("./day${day}-test.input", "utf8");
}
		
run();
		`
    ),
    promises_1.default.writeFile(`./day${day}-test.input`, ""),
    promises_1.default.writeFile(`./day${day}.input`, ""),
  ]);
  console.log("All done");
}
run();
//# sourceMappingURL=start.js.map
