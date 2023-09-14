const pdfjs = require("pdfjs-dist");

const parseData = async () => {
	const doc = await pdfjs.getDocument(
		"https://www.iisbafile.edu.it/wp-content/uploads/provvisorio-scientifico-11-settembre.pdf"
	).promise;
	const page = await doc.getPage(1);
	const content = await page.getTextContent();
	const strings = content.items
		.filter(item => "str" in item && item.str.trim())
		.map(item => ("str" in item ? item.str : ""));

	console.log(strings.join(" "));
	page.cleanup(true);
};

parseData();
