import type { EvalFunction } from "mathjs";

const findZero = (
	code: EvalFunction,
	x: [a: number, b: number],
	fractionDigits?: number
) => {
	const y0 = code.evaluate({ x: x[0] });

	if (y0 === 0) return x[0];
	const y1 = code.evaluate({ x: x[1] });

	if (y1 === 0) return x[1];
	if (y0 * y1 > 0)
		throw new Error("Non è presente alcun zero nell'intervallo specificato!", {
			cause: y0 * y1,
		});
	const increasing = y0 < y1;
	let y: number;
	let newX: number;

	do {
		newX = (x[0] + x[1]) / 2;
		y = code.evaluate({ x: newX });
		if (y === 0) break;
		x[Number(increasing ? y > 0 : y < 0)] = newX;
	} while (x[0].toFixed(fractionDigits) !== x[1].toFixed(fractionDigits));
	return newX;
};

export default findZero;
