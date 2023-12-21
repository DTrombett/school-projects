import type { EvalFunction } from "mathjs";

const findZero = (
	fn: EvalFunction,
	x: [a: number, b: number],
	fractionDigits = 0
): [zero: number, count: number] => {
	const y0 = fn.evaluate({ x: x[0] });
	const y1 = fn.evaluate({ x: x[1] });

	if (y0 * y1 > 0)
		throw new Error("Non è presente alcun zero nell'intervallo specificato!", {
			cause: y0 * y1,
		});
	const diff = Number(`1e${-fractionDigits - 1}`);
	const getIndex: (y: number) => number =
		y0 < y1 ? (y) => Number(y > 0) : (y) => Number(y < 0);
	let count = 0;
	let newX: number;
	let y: number;

	do {
		count++;
		newX = (x[0] + x[1]) / 2;
		y = fn.evaluate({ x: newX });
		if (y === 0) break;
		const i = getIndex(y);

		if (x[i] === newX) break;
		x[i] = newX;
	} while (x[1] - x[0] > diff);
	return [newX, count];
};

export default findZero;
