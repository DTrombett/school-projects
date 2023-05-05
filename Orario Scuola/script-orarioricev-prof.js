import orarioClassi from "./orarioricev-prof.json" assert { type: "json" };

const table = document.getElementById("table");
const daysOfWeek = new Array(6).fill("").map((_, i) => {
	const day = new Date(Date.UTC(2018, 0, i + 1)).toLocaleDateString(navigator.language, {
		weekday: "long",
	});

	return day[0].toUpperCase() + day.slice(1);
});
const hours = ["8:10", "9:10", "10:10", "11:10", "12:10", "13:10"];

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
		if (!table.rows[0]) {
			const row = table.insertRow();

			row.insertCell();
			for (const day of daysOfWeek) {
				const th = document.createElement("th");

				th.textContent = day;
				row.appendChild(th);
			}
		}
		for (let i = 0; i < array.length; i++) {
			const index = i + 1;

			if (!table.rows[index]) table.insertRow();
			if (!table.rows[index].cells[0]) table.rows[index].insertCell();
			table.rows[index].cells[0].textContent = hours[i];
			for (let j = 0; j < array[i].length; j++) {
				if (!table.rows[index].cells[j + 1]) table.rows[index].insertCell();
				table.rows[index].cells[j + 1].textContent = array[i][j];
			}
		}
	});