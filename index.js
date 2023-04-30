const express = require("express");
const { readdirSync } = require("node:fs");
const { join } = require("node:path");
const app = express();
const dirs = readdirSync(".", {
	withFileTypes: true,
})
	.filter((e) => e.isDirectory() && !["node_modules", ".git"].includes(e.name))
	.map((e) => e.name);

app.get("/", (_req, res) => {
	res.send(
		`<html><body><ul>${dirs
			.map((d) => `<li><a href="${d}/index.html">${d}</a></li>`)
			.join("")}</ul></body></html>`
	);
});
app.use((req, res) => {
	res.sendFile(join(__dirname, decodeURIComponent(req.path)));
});
app.listen(3000, () => console.log("Ready at http://localhost:3000"));
