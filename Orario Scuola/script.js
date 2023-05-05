import orarioClassi from "./orario.json" assert { type: "json" };

const table = document.getElementById("table");
const colors = {
	// "Matematica": [128, 128, 0],
	// "Scienze": [255, 0, 0],
	// "Storia": [255, 255, 0],
	// "Italiano": [128, 0, 0],
	// "Inglese": [255, 0, 255],
	// "Filosofia": [0, 255, 0],
	// "Fisica": [0, 255, 255],
	// "Religione": [0, 0, 255],
	// "Educazione Fisica": [128, 128, 128],
	// "Arte": [128, 0, 128],
	// "Informatica": [0, 128, 0],
};

if (table instanceof HTMLTableElement)
	document.getElementById("classList")?.addEventListener("click", (event) => {
		if (!(event.target instanceof HTMLLIElement)) return;
		const { textContent } = event.target;

		if (!textContent) return;
		/** @type {string[][] | undefined} */
		const array = orarioClassi[textContent];

		if (!array) return;
		if (!table.caption) table.caption = table.createCaption();
		table.caption.textContent = `Orario ${textContent}`;
		for (let i = 1; i < table.rows.length; i++)
			for (let j = 1; j < table.rows[i].cells.length; j++) {
				const subject = array[i - 1]?.[j - 1];

				table.rows[i].cells[j].textContent = subject;
				table.rows[i].cells[j].style.backgroundColor =
					colors[subject] && `rgba(${colors[subject].join(", ")}, 0.5)`;
			}
		table.style.display = "table";
	});
