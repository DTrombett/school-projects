const pdfjs = require("pdfjs-dist");
const { createWriteStream } = require("node:fs");

const parseData = async () => {
	const doc = await pdfjs.getDocument(
		"https://www.iisbafile.edu.it/wp-content/uploads/provvisorio-scientifico-18sett-docenti-1.pdf"
	).promise;
	const stream = createWriteStream("file.json", { flags: "a" });
	const lines = [],
		teachers = [];

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
		lines.push(...pageLines);
		teachers.push(
			...pageLines
				.filter(l => l[0].transform[5] < 50)
				.map(t => [
					t.map(text => text.str).join(""),
					pageLines.find(
						l => l[0].transform[4] === t[0].transform[4] && t[0] !== l[0]
					),
				])
		);
		page.cleanup(true);
	}
	console.log(teachers, teachers.length);
	stream.write(JSON.stringify(Object.fromEntries(teachers)));
	stream.end().close();
	doc.cleanup();
};

parseData();
