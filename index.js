import express from "express";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

const app = express();
const dirs = readdirSync(".", {
	withFileTypes: true,
})
	.filter(
		(e) =>
			e.isDirectory() && e.name !== "node_modules" && !e.name.startsWith(".")
	)
	.map((e) => e.name);

app.get("/", (_req, res) => {
	res.send(
		`<html><body><ul>${dirs
			.map((d) => `<li><a href="${d}/index.html">${d}</a></li>`)
			.join("")}</ul></body></html>`
	);
});
app.use((req, res) => {
	res.sendFile(resolve("./", decodeURIComponent(req.path).slice(1)));
});
app.listen(3000, () => console.log("Ready at http://localhost:3000"));
