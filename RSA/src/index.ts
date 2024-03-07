import { exit, stdin, stdout } from "node:process";
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

switch (
	Number(
		await rl.question(
			`Cosa vuoi fare?\n1 - Crea una nuova coppia di chiavi\n2 - Codifica un messaggio con una chiave\n3 - Decodifica un messaggio con una chiave\n`
		)
	)
) {
	case 1: {
		const a = BigInt(await rl.question("Inserisci a: "));
		const b = BigInt(await rl.question("Inserisci b: "));
		const n = a * b;
		const z = (a - 1n) * (b - 1n);
		let pri = 2n;
		let pub = z + 1n;

		while (z % pri === 0n) pri++;
		while (pub % pri) pub += z;
		pub /= pri;
		console.log(`Chiave pubblica (pub, n): (${pub}, ${n})`);
		console.log(`Chiave privata (pri, n): (${pri}, ${n})`);
		break;
	}
	case 2: {
		const p = BigInt(
			await rl.question("Inserisci il primo membro della chiave: ")
		);
		const n = BigInt(
			await rl.question("Inserisci il secondo membro della chiave: ")
		);

		console.log(
			(await rl.question("Inserisci il testo da cifrare: "))
				.toLowerCase()
				.split("")
				.map((c) => {
					if (c in Alphabet)
						return BigInt(Alphabet[c as keyof typeof Alphabet]) ** p % n;
					throw new Error("Carattere non supportato!", { cause: c });
				})
				.join()
		);
		break;
	}
	case 3: {
		const pri = BigInt(
			await rl.question("Inserisci il primo membro della chiave: ")
		);
		const n = BigInt(
			await rl.question("Inserisci il secondo membro della chiave: ")
		);

		console.log(
			(await rl.question("Inserisci il testo cifrato nel formato a,b,c...: "))
				.split(/\s*,\s*/g)
				.map((c) => {
					const m = Number(BigInt(c) ** pri % n);

					if (m in Alphabet) return Alphabet[m];
					throw new Error("Impossibile decifrare il testo!", { cause: c });
				})
				.join("")
		);
		break;
	}
	default:
		throw new Error(
			"Scelta non valida! Inserisci il numero corrispondente all'azione da compiere e premi invio."
		);
}
exit();
