const CLASS_NUMBER_STEP = 256 / 6;
const FIRST_CHAR_CODE = "A".charCodeAt(0);
const CLASS_NAME_STEP = 256 / ("I".charCodeAt(0) - FIRST_CHAR_CODE + 2);
const CLASS_COURSE_STEP = 256 / 3;
const orario = await fetch("./orarioProf.json").then(b => b.json());
const table = document.getElementById("table");
/** @param {string} hash */
const scrollTo = hash => {
	document.querySelector(hash)?.scrollIntoView({
		behavior: "smooth",
	});
	history.pushState(null, "", hash);
};

if (table instanceof HTMLTableElement)
	document.getElementById("classList")?.addEventListener("click", event => {
		if (event.target instanceof HTMLAnchorElement) {
			scrollTo(/** @type {string} */ (event.target.getAttribute("href")));
			event.preventDefault();
			return;
		}
		if (event.target instanceof HTMLLIElement) {
			const { textContent } = event.target;

			if (!textContent) return;
			/** @type {string[][]} */
			const array = orario[textContent];

			if (!array)
				return alert(
					"L'orario per questo professore non è ancora disponibile!"
				);
			table.caption ??= table.createCaption();
			table.caption.textContent = `Orario ${textContent}`;
			for (let i = 1; i < table.rows.length; i++) {
				const hour = array[i - 1];

				table.rows[i].style.display = hour ? "table-row" : "none";
				for (let j = 1; j < table.rows[i].cells.length; j++) {
					const className = hour?.[j - 1];

					if (!className) {
						table.rows[i].cells[j].textContent = null;
						table.rows[i].cells[j].style.backgroundColor = "";
						continue;
					}
					table.rows[i].cells[j].style.backgroundColor = `rgba(${
						className === "Ricevimenti"
							? "0, 255, 0"
							: `${CLASS_NUMBER_STEP * +className[0]}, ${
									CLASS_NAME_STEP *
									(className[1].charCodeAt(0) - FIRST_CHAR_CODE + 1)
							  }, ${CLASS_COURSE_STEP * (className[3] === "S" ? 2 : 1)}`
					}, 0.5)`;
					table.rows[i].cells[j].textContent = className;
				}
			}
			scrollTo(`#${textContent[0]}`);
			table.style.display = "table";
		}
	});

export {};
