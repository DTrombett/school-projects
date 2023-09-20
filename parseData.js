const pdfjs = require("pdfjs-dist");
const { writeFile } = require("node:fs/promises");

const parseTeacherData = async () => {
	const doc = await pdfjs.getDocument(
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
		}, /** @type {import("pdfjs-dist/types/src/display/api").TextItem[][]} */ ([[]]));

		pageLines.splice(0, 14);
		pageLines.splice(-1, 1);

		teachers.push(
			...pageLines
				.filter((l) => l[0].transform[5] < 50)
				.map((t) => {
					const classes = pageLines
						.find(
							(l) => l[0].transform[4] === t[0].transform[4] && t[0] !== l[0]
						)
						?.reduce((result, el) => {
							const offset = el.transform[5] / 18 - 4;

							result[Math.round(offset % 6)][Math.floor(offset / 6)] = el.str;
							return result;
						}, /** @type {string[][]} */ (new Array(6).fill(undefined).map(() => new Array(6).fill(""))));

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
								(text) => text[0].toUpperCase() + text.slice(1).toLowerCase()
							)
							.join(" "),
						classes,
					];
				})
		);
		page.cleanup(true);
	}
	await writeFile(
		"./Orario Scuola/orarioProf.json",
		JSON.stringify(Object.fromEntries(teachers))
	);
	doc.cleanup();
};

Promise.all([parseTeacherData()]);
