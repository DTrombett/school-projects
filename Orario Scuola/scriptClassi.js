/** @type {Record<string, ((string | null)[] | null)[]>} */
const orarioClassi = await fetch("./orarioClassi.json").then((b) => b.json());
const table = /** @type {HTMLTableElement} */ (
	document.getElementById("table")
);
/** @type {Record<string, number[] | undefined>} */
const colors = {
	Arte: [128, 192, 255],
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
/** @type {Record<string, string>} */
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
/**
 * Scorri fino all'hash specificata
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
		/** Il nome della classe senza il numero */
		const classType = textContent.slice(1);
		/** L'orario della classe selezionata */
		const array =
			orarioClassi[
				`${textContent[0]}${
					classType.startsWith("I")
						? classType
						: `${classType.endsWith("S.A.") ? "S" : ""}${classType[0]}`
				}`
			];

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
	}
});

export {};
