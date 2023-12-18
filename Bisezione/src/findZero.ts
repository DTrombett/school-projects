import type { EvalFunction } from "mathjs";

const findZero = (
	fn: EvalFunction,
	x: [a: number, b: number],
	fractionDigits = 0
) => {
	const y0 = fn.evaluate({ x: x[0] });

	if (y0 === 0) return x[0];
	const y1 = fn.evaluate({ x: x[1] });

	if (y1 === 0) return x[1];
	if (y0 * y1 > 0)
		throw new Error("Non è presente alcun zero nell'intervallo specificato!", {
			cause: y0 * y1,
		});
	const increasing = y0 < y1;
	const diff = Number(`1e${-fractionDigits - 1}`);
	let y: number;
	let newX: number;

	do {
		newX = (x[0] + x[1]) / 2;
		y = fn.evaluate({ x: newX });
		if (y === 0) break;
		x[Number(increasing ? y > 0 : y < 0)] = newX;
	} while (x[1] - x[0] > diff);
	return newX;
};

export default findZero;
