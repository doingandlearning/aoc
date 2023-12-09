import fs from "node:fs/promises";

async function run() {
  const day = process.argv[2];
  if (!day) {
    console.log("You need to provide a numeric day.");
    process.exit(1);
  }
  await Promise.all([
    fs.writeFile(
      `./day${day}.ts`,
      `import fs from "node:fs/promises";

async function run() {
	const data = await fs.readFile("./day${day}-test.input");
}
		
run();
		`
    ),
    fs.writeFile(`./day${day}-test.input`, ""),
    fs.writeFile(`./day${day}.input`, ""),
  ]);
  console.log("All done");
}

run();
