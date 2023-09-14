const pdfjs = require("pdfjs-dist");
const { createWriteStream } = require("node:fs");

const parseData = async () => {
	const doc = await pdfjs.getDocument(
		"https://www.iisbafile.edu.it/wp-content/uploads/provvisorio-scientifico-11-settembre.pdf"
	).promise;
	const stream = createWriteStream("file.json", { flags: "a" });
	const lines = [];

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
		}, /** @type {(import("pdfjs-dist/types/src/display/api").TextItem | import("pdfjs-dist/types/src/display/api").TextMarkedContent)[][]} */ ([[]]));

		pageLines.splice(0, 14);
		pageLines.splice(-1, 1);
		lines.push(...pageLines);
		page.cleanup(true);
	}
	stream.write(JSON.stringify(lines));
	stream.end().close();
	doc.cleanup();
};

parseData();
