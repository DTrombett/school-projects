import { isSymbolNode, parse } from "mathjs";
import { exit, stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";

const fractionDigits = 15;
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
if (x[0] === x[1]) throw new Error("L'intervallo è vuoto", { cause: x });
const y0 = code.evaluate({ x: x[0] });

if (isNaN(y0))
	throw new Error("La funzione o l'intervallo inseriti non sono validi!", {
		cause: y0,
	});
if (y0 === 0) {
	console.log(x[0]);
	exit();
}
const y1 = code.evaluate({ x: x[1] });

if (isNaN(y1))
	throw new Error("La funzione o l'intervallo inseriti non sono validi!", {
		cause: y1,
	});
if (y1 === 0) {
	console.log(x[1]);
	exit();
}
if (y0 * y1 > 0)
	throw new Error("Non è presente alcun zero nell'intervallo specificato!", {
		cause: y0 * y1,
	});
let y: number;
let newX: number;
const increasing = y0 < y1;
const now = performance.now();

do {
	newX = (x[0] + x[1]) / 2;
	y = code.evaluate({ x: newX });
	x[Number(increasing ? y > 0 : y < 0)] = newX;
} while (
	y === 0 ||
	x[0].toFixed(fractionDigits) !== x[1].toFixed(fractionDigits)
);
console.log(
	`Trovato lo 0 con precisione di ${fractionDigits} cifre decimali in ${
		performance.now() - now
	}ms:`,
	Number(newX.toFixed(fractionDigits))
);
exit();
