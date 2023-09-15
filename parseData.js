const pdfjs = require("pdfjs-dist");
const { createWriteStream } = require("node:fs");

const parseData = async () => {
	const doc = await pdfjs.getDocument(
		"https://www.iisbafile.edu.it/wp-content/uploads/provvisorio-scientifico-18sett-docenti-1.pdf"
	).promise;
	const stream = createWriteStream("./Orario Scuola/orario-prof.json");
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
				.filter(l => l[0].transform[5] < 50)
				.map(t => [
					t
						.map(text => text.str)
						.join("")
						.split(/\s+|(?<=\.)/g)
						.map(text => text[0].toUpperCase() + text.slice(1).toLowerCase())
						.join(" "),
					pageLines
						.find(l => l[0].transform[4] === t[0].transform[4] && t[0] !== l[0])
						?.reduce((result, el) => {
							const offset = el.transform[5] / 18 - 4,
								hour = Math.round(offset % 6),
								day = Math.floor(offset / 6);

							result[hour][day] = el.str;
							return result;
						}, /** @type {string[][]} */ (new Array(6).fill(undefined).map(() => new Array(6).fill("")))),
				])
		);
		page.cleanup(true);
	}
	const result = Object.fromEntries(teachers);

	console.log(result);
	stream.write(JSON.stringify(result));
	stream.end().close();
	doc.cleanup();
};

parseData();
