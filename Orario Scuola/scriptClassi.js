/** @type {Record<string, ((string | null)[] | null)[]>} */
// @ts-expect-error
const orarioClassi = await fetch("./orarioClassi.json").then((b) => b.json());
const table = document.getElementById("table");
/** @type {Record<string, number[] | undefined>} */
const colors = {
	Arte: [244, 107, 24],
	"Educazione Fisica": [165, 136, 71],
	Filosofia: [130, 218, 242],
	Fisica: [252, 173, 190],
	Geografia: [120, 116, 63],
	Geostoria: [426, 457, 34],
	Informatica: [205, 185, 250],
	Inglese: [70, 79, 245],
	Italiano: [37, 216, 180],
	Latino: [244, 0, 161],
	Matematica: [210, 54, 57],
	Religione: [104, 29, 97],
	Scienze: [124, 240, 86],
	Storia: [241, 232, 126],
};
/** @type {Record<string,string>} */
const classes = {
	MATFIS: "Matematica\nFisica",
	INGLESE: "Inglese",
	GEOSTORIA: "Geostoria",
	DISEGNO: "Arte",
	MOTORIE: "Educazione Fisica",
	SCIENZE: "Scienze",
	ITALAT: "Italiano\nLatino",
	MAT: "Matematica",
	RELIGIONE: "Religione",
	LAT: "Latino",
	ITA: "Italiano",
	REL: "Religione",
	LATINO: "Latino",
	ITALIANO: "Italiano",
	LATGEO: "Latino\nGeostoria",
	FISICA: "Fisica",
	MATEMATICA: "Matematica",
	INFORMATICA: "Informatica",
	ITAGEO: "Italiano\nGeostoria",
	STOFIL: "Storia\nFilosofia",
	"ITA.": "Italiano",
	FILOSOFIA: "Filosofia",
	STORIA: "Storia",
};
/** @param {string} hash */
const scrollTo = (hash) => {
	document.querySelector(hash)?.scrollIntoView({
		behavior: "smooth",
	});
	history.pushState(null, "", hash);
};

if (table instanceof HTMLTableElement)
	document.getElementById("classList")?.addEventListener("click", (event) => {
		if (event.target instanceof HTMLAnchorElement) {
			scrollTo(/** @type {string} */ (event.target.getAttribute("href")));
			event.preventDefault();
			return;
		}
		if (event.target instanceof HTMLLIElement) {
			const { textContent } = event.target;

			if (!textContent) return;
			const classType = textContent.slice(1);
			const array =
				orarioClassi[
					`${textContent[0]}${
						classType.startsWith("I")
							? classType
							: `${classType.endsWith("S.A.") ? "S" : ""}${classType[0]}`
					}`
				];

			if (!array)
				return alert("L'orario di questa classe non è ancora disponibile!");
			if (!table.caption) table.caption = table.createCaption();
			table.caption.textContent = `Orario ${textContent}`;
			for (let i = 1; i < table.rows.length; i++) {
				const hour = array[i - 1];

				table.rows[i].style.display = hour ? "table-row" : "none";
				for (let j = 1; j < table.rows[i].cells.length; j++) {
					// const subject = Object.keys(colors)[Math.floor(Math.random() * 12)];
					let subject = hour?.[j - 1];

					if (!subject) {
						table.rows[i].cells[j].textContent = null;
						table.rows[i].cells[j].style.backgroundColor = "";
						continue;
					}
					subject = classes[subject];
					let count = 1;
					const subjects = subject.split("\n");
					const color = subjects
						.reduce((a, s, i) => {
							const color = colors[s];

							if (!color) return a;
							count++;
							if (!a) return color;
							return a.map((n, i) => n + color[i]);
						}, colors[subjects[0]])
						?.map((n) => n / count);

					table.rows[i].cells[j].textContent = subject;
					if (color)
						table.rows[i].cells[j].style.backgroundColor = `rgba(${color.join(
							", "
						)}, 0.5)`;
				}
			}
			scrollTo(`#${textContent[1]}`);
			table.style.display = "table";
		}
	});

export {};
