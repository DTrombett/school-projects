import "dotenv/config";
import { isSymbolNode, parse } from "mathjs";
import { exit, stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import findZero from "./findZero";

const rl = createInterface({ input: stdin, output: stdout });
const node = parse(await rl.question("Inserisci la funzione (es. x^3-2): "));
const invalidNodes = node.filter((n) => isSymbolNode(n) && n.name !== "x");

if (invalidNodes.length)
	throw new Error("Espressione non valida!", { cause: invalidNodes });
const code = node.compile();
const x: [a: number, b: number] = [
	Number(await rl.question("Inserisci a (es. 0): ")),
	NaN,
];

if (Number.isNaN(x[0])) throw new Error("Valore non valido!", { cause: x[0] });
x[1] = Number(await rl.question("Inserisci b (es. 2): "));
if (Number.isNaN(x[1])) throw new Error("Valore non valido!", { cause: x[1] });
if (x[0] === x[1]) throw new Error("L'intervallo è vuoto!", { cause: x });
const fractionDigits = Number(
	await rl.question(
		"Inserisci il numero di cifre decimali da trovare (es. 15): "
	)
);

if (Number.isNaN(fractionDigits) || fractionDigits < 0)
	throw new Error("Hai inserito una precisione non valida!", {
		cause: fractionDigits,
	});
const now = performance.now();
const zero = findZero(code, x, fractionDigits);

console.log(
	`Trovato lo 0 con precisione di ${fractionDigits} cifre decimali in ${
		performance.now() - now
	}ms:`,
	zero.toFixed(fractionDigits)
);
exit();
