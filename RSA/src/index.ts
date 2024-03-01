import "dotenv/config";
import { argv, exit, stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";

enum Alphabet {
	a = 1,
	b,
	c,
	d,
	e,
	f,
	g,
	h,
	i,
	l,
	m,
	n,
	o,
	p,
	q,
	r,
	s,
	t,
	u,
	v,
	z,
}

const rl = createInterface({ input: stdin, output: stdout });

if (argv[2] === "0") {
	const a = BigInt(await rl.question("Inserisci a: "));
	const b = BigInt(await rl.question("Inserisci b: "));
	const n = a * b;
	const z = (a - 1n) * (b - 1n);
	let pri = 2n;
	let pub = 1n;

	while (z % pri === 0n) pri++;
	while ((pub * pri) % z !== 1n) pub++;
	console.log(`Chiave pubblica: (${pub}, ${n})`);
	console.log(`Chiave privata: (${pri}, ${n})`);
	console.log(
		(await rl.question("Inserisci il testo da cifrare: "))
			.toLowerCase()
			.split("")
			.map((c) => {
				if (c in Alphabet)
					return BigInt(Alphabet[c as keyof typeof Alphabet]) ** pub % n;
				throw new Error("Carattere non supportato!", { cause: c });
			})
			.join()
	);
} else if (argv[2] === "1") {
	const pri = BigInt(await rl.question("Inserisci pri: "));
	const n = BigInt(await rl.question("Inserisci n: "));
	const msg = await rl.question(
		"Inserisci il testo cifrato nel formato a,b,c...: "
	);

	console.log(
		msg
			.toLowerCase()
			.split(/\s*,\s*/g)
			.map((c) => {
				const m = Number(BigInt(c) ** pri % n);

				if (m in Alphabet) return Alphabet[m];
				throw new Error("Impossibile decifrare il testo!", { cause: c });
			})
			.join("")
	);
} else
	throw new Error(
		"Azione invalida! Scrivi 0 per generare una chiave e codificare un messaggio o 1 per decodificare un messaggio",
		{ cause: argv[2] }
	);
exit();
