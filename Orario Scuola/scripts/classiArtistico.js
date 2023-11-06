import { displayButton } from "./buttons.js";

/** @type {Record<string, ((string | null)[] | null)[]>} */
const orarioClassi = await fetch("_data/orarioArtistico.json").then((b) =>
	b.json()
);
const table = /** @type {HTMLTableElement} */ (
	document.getElementById("table")
);
/** @type {Record<string, number[] | undefined>} */
const colors = {
	Arte: [128, 192, 255],
	"Educazione Fisica": [165, 136, 71],
	Filosofia: [130, 218, 242],
	Fisica: [252, 173, 190],
	Geostoria: [426, 457, 34],
	Inglese: [70, 79, 245],
	Italiano: [37, 216, 180],
	Matematica: [210, 54, 57],
	Religione: [104, 29, 97],
	Scienze: [124, 240, 86],
	Storia: [241, 232, 126],
	Plastico: [255, 140, 0],
	"Discipline Plastiche": [255, 20, 147],
	"Discipline Pittoriche": [250, 128, 114],
	"Discipline Geometriche": [128, 128, 128],
	"Laboratorio Artistico": [75, 0, 130],
	"Laboratorio Architettura": [224, 255, 255],
	"Progettazione Architettura": [32, 178, 170],
	"Disegno Geometrico": [128, 128, 128],
	Chimica: [200, 32, 200],
};
/** @type {Record<string, string>} */
const classes = {
	PLAST: "Plastico",
	"DISC.GEOM": "Disegno Geometrico",
	DPLAST: "Discipline Plastiche",
	"DISC.PITT": "Discipline Pittoriche",
	"DISC.GEO": "Discipline Geometriche",
	"ITA,STO": "Italiano\nStoria",
	"ITA.STO": "Italiano\nStoria",
	ITALIANO: "Italiano",
	INGLESE: "Inglese",
	MATEMATICA: "Matematica",
	"MAT.FIS": "Matematica\nFisica",
	MOTORIE: "Educazione Fisica",
	MOTORIEC: "Educazione Fisica",
	"LAB.ART": "Laboratorio Artistico",
	"LAB.ARK": "Laboratorio Architettura",
	RELIGIONE: "Religione",
	FILOSOFIA: "Filosofia",
	CHIMICA: "Chimica",
	GEOSTORIA: "Geostoria",
	"PROG.ARK": "Progettazione Architettura",
	STORIA: "Storia",
	"STO.ART": "Arte",
	SCIENZE: "Scienze",
};
/**
 * Scorri fino all'hashish specificata
 * @param {string} hash
 */
const scrollTo = (hash) => {
	document.querySelector(hash)?.scrollIntoView({
		behavior: "smooth",
	});
	history.pushState(null, "", hash);
};

document.getElementById("classList")?.addEventListener("click", (event) => {
	// Se l'utente ha cliccato una lettera, spostiamo tale lettera in alto
	if (event.target instanceof HTMLAnchorElement) {
		scrollTo(/** @type {string} */ (event.target.getAttribute("href")));
		event.preventDefault();
		return;
	}
	// Se l'utente ha cliccato su una classe, mostriamo il suo orario
	if (event.target instanceof HTMLLIElement) {
		const { textContent } = event.target;

		if (!textContent) return;
		/** L'orario della classe selezionata */
		const array = orarioClassi[textContent];

		if (!array) return alert("L'orario di questa classe non è disponibile!");
		table.caption ??= table.createCaption();
		table.caption.textContent = `Orario ${textContent}`;
		for (let i = 1; i < table.rows.length; i++) {
			/** Le materie della classe in quest'ora */
			const hour = array[i - 1];

			// Se non c'è alcuna materia in tale orario, nascondiamo la riga
			table.rows[i].style.display = hour ? "table-row" : "none";
			for (let j = 1; j < table.rows[i].cells.length; j++) {
				/** La materia nella determinata ora e giorno */
				let subject = hour?.[j - 1];

				// Se non c'è alcuna materia, svuotiamo la cella
				if (!subject) {
					table.rows[i].cells[j].textContent = null;
					table.rows[i].cells[j].style.backgroundColor = "";
					continue;
				}
				// Trasformiamo il nome della materia in un formato migliore per l'utente
				subject = classes[subject] ?? subject;
				let count = 1;
				// Se nella stessa ora potrebbero esserci più materie (es. professori che insegnano due materie nella stessa classe), uniamo i loro colori
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
					)}, 0.75)`;
			}
		}
		scrollTo(`#${textContent[1]}`);
		table.style.display = "table";
		displayButton();
	}
});

export {};
