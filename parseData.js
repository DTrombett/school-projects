import { writeFile } from "node:fs/promises";
import { getDocument } from "pdfjs-dist";

const parseTeacherData = async () => {
	const doc = await getDocument(
		"https://www.iisbafile.edu.it/wp-content/uploads/provvisorio-scientifico-18sett-docenti-1.pdf"
	).promise;
	const teachers = [];

	for (let i = 1; i <= doc.numPages; i++) {
		const page = await doc.getPage(i);
		const content = await page.getTextContent();
		const strings = content.items;
		const pageLines = strings.reduce((array, el) => {
			if ("str" in el) {
				if (el.str.trim()) array.at(-1)?.push(el);
				if (el.hasEOL) array.push([]);
			}
			return array;
		}, /** @type {import("pdfjs-dist/types/src/display/api.js").TextItem[][]} */ ([[]]));

		pageLines.splice(0, 14);
		pageLines.splice(-1, 1);

		teachers.push(
			...pageLines
				.filter((l) => l[0].transform[5] < 50)
				.map(
					/** @return {[string, string[][] | undefined]} */ (t) => {
						const classes = pageLines
							.find(
								(l) => l[0].transform[4] === t[0].transform[4] && t[0] !== l[0]
							)
							?.reduce((result, el) => {
								const offset = el.transform[5] / 18 - 4;

								result[Math.round(offset % 6)][Math.floor(offset / 6)] = el.str;
								return result;
							}, /** @type {string[][]} */ (new Array(6).fill(undefined).map(() => new Array(6).fill(""))));
						let found = false;

						if (classes) {
							for (let i = classes.length - 1; i >= 0; i--)
								if (classes[i].every((c) => c === "")) classes.splice(-1);
								else break;
							for (const c of classes) {
								for (let i = c.length - 1; i >= 0; i--)
									if (c[i] === "") c.splice(-1);
									else break;
							}
						}
						return [
							t
								.map((text) => text.str)
								.join("")
								.split(/\s+|(?<=\.)/g)
								.map(
									(text) =>
										text[0].toUpperCase() +
										text
											.slice(1)
											.toLowerCase()
											.split("")
											.map((c) => {
												if (found) c = c.toUpperCase();
												found = c === "'";
												return c;
											})
											.join("")
								)
								.join(" "),
							classes,
						];
					}
				)
		);
		page.cleanup(true);
	}
	await writeFile(
		"./Orario Scuola/orarioProf.json",
		JSON.stringify(
			Object.fromEntries(
				teachers.sort(([name1], [name2]) => name1.localeCompare(name2))
			)
		)
	);
	doc.cleanup();
};
const parseClassesData = async () => {
	const doc = await getDocument(
		"https://www.iisbafile.edu.it/wp-content/uploads/provvisorio-scientifico-18sett-classi.pdf"
	).promise;
	/** @type {Record<string, string[][]>} */
	const data = {};

	for (let i = 1; i <= doc.numPages; i++) {
		const page = await doc.getPage(i);
		const content = await page.getTextContent();
		const strings = content.items;
		const pageLines = strings.reduce((array, el) => {
			if ("str" in el) {
				if (el.str.trim()) array.at(-1)?.push(el);
				if (el.hasEOL) array.push([]);
			}
			return array;
		}, /** @type {import("pdfjs-dist/types/src/display/api.js").TextItem[][]} */ ([[]]));

		pageLines.splice(0, 1);
		pageLines.splice(1, 36);
		pageLines.splice(-1);
		const [classes, ...rawSubjects] = pageLines;
		const subjects = rawSubjects.flat();
		/** @type {number} */
		const columnWidth = classes[1].transform[4] - classes[0].transform[4];

		for (let i = 0; i < classes.length; i++) {
			const classSubjects = subjects.filter(
				(v) =>
					Math.floor((v.transform[4] + columnWidth / 2) / columnWidth) === i + 1
			);

			data[classes[i].str] = [];
			for (const subject of classSubjects) {
				const offset = Math.round((subject.transform[5] - 340) / 12);

				(data[classes[i].str][5 - (offset % 6)] ??= [])[
					5 - Math.floor(offset / 6)
				] = subject.str;
			}
		}
		page.cleanup(true);
	}
	await writeFile("./Orario Scuola/orarioClassi.json", JSON.stringify(data));
	doc.cleanup();
};

const start = performance.now();

Promise.all([parseTeacherData(), parseClassesData()]).then(() => {
	console.log(
		`Data successfully loaded in ${(performance.now() - start).toFixed(3)}ms`
	);
});
