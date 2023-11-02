import { displayButton } from "./openMenu.js";

const CLASS_NUMBER_STEP = 256 / 6;
const FIRST_CHAR_CODE = "A".charCodeAt(0);
const CLASS_NAME_STEP = 256 / ("I".charCodeAt(0) - FIRST_CHAR_CODE + 2);
const CLASS_COURSE_STEP = 256 / 3;

/** @type {Record<string, (string[] | undefined)[] | undefined>} */
const orarioDocenti = await fetch("_data/orarioDocentiScientifico.json").then(
	(b) => b.json()
);
/** I nomi dei docenti */
const names = Object.keys(orarioDocenti);
const table = /** @type {HTMLTableElement} */ (
	document.getElementById("table")
);
const classList = /** @type {HTMLDivElement} */ (
	document.getElementById("classList")
);
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

classList.addEventListener("click", (event) => {
	// Se l'utente ha cliccato una lettera, spostiamo tale lettera in alto
	if (event.target instanceof HTMLAnchorElement) {
		scrollTo(/** @type {string} */ (event.target.getAttribute("href")));
		event.preventDefault();
		return;
	}
	// Se l'utente ha cliccato su un docente, mostriamo il suo orario
	if (event.target instanceof HTMLLIElement) {
		const { textContent } = event.target;

		if (!textContent) return;
		/** L'orario del docente selezionato */
		const array = orarioDocenti[textContent];

		if (!array) return alert("L'orario per questo docente non è disponibile!");
		table.caption ??= table.createCaption();
		table.caption.textContent = `Orario ${textContent}`;
		for (let i = 1; i < table.rows.length; i++) {
			/** Le classi del docente in quest'ora */
			const hour = array[i - 1];

			// Se non c'è alcuna classe in tale orario, nascondiamo la riga
			table.rows[i].style.display = hour ? "table-row" : "none";
			for (let j = 1; j < table.rows[i].cells.length; j++) {
				/** La classe nella determinata ora e giorno */
				let className = hour?.[j - 1];

				// Se il docente non ha alcuna classe, svuotiamo la cella
				if (!className) {
					table.rows[i].cells[j].textContent = null;
					table.rows[i].cells[j].style.backgroundColor = "";
					continue;
				}
				const sa = className[1] === "S";

				// Trasformiamo il nome della classe in un formato migliore per l'utente
				className = `${className[0]}${sa ? className[2] : className[1]}${
					sa ? " S.A." : className[1] === "I" ? "" : " N.O."
				}`;
				// Calcoliamo il colore del background in base classe, ordinamento e sezione
				table.rows[i].cells[j].style.backgroundColor = `rgba(${
					className === "Ricevimenti"
						? "0, 255, 0"
						: `${CLASS_NUMBER_STEP * +className[0]}, ${
								CLASS_COURSE_STEP * (sa ? 2 : 1)
						  }, ${
								CLASS_NAME_STEP *
								(className.charCodeAt(1) - FIRST_CHAR_CODE + 1)
						  }`
				}, 0.75)`;
				table.rows[i].cells[j].textContent = className;
			}
		}
		scrollTo(`#${textContent[0]}`);
		table.style.display = "table";
		displayButton();
	}
});
// Creiamo la lista dei professori
for (let i = 0; i < names.length; i++) {
	/** L'iniziale del professore */
	const startLetter = names[i][0];

	// Se è il primo professore con tale iniziale, creiamo la lista
	if (!classList.children.namedItem(startLetter)) {
		const h3 = document.createElement("h3"),
			a = document.createElement("a");

		h3.id = startLetter;
		a.href = `#${startLetter}`;
		a.append(startLetter);
		h3.append(a);
		classList.append(h3, document.createElement("ul"));
	}
	const ul = classList.children[classList.children.length - 1],
		li = document.createElement("li");

	li.append(names[i]);
	ul.append(li);
}

export {};
