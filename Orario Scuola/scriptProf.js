const CLASS_NUMBER_STEP = 256 / 6;
const FIRST_CHAR_CODE = "A".charCodeAt(0);
const CLASS_NAME_STEP = 256 / ("I".charCodeAt(0) - FIRST_CHAR_CODE + 2);
const CLASS_COURSE_STEP = 256 / 3;
/** @type {Record<string, string[][] | undefined>} */
// @ts-expect-error
const orario = await fetch("./orarioProf.json").then((b) => b.json());
const names = Object.keys(orario);
const table = document.getElementById("table");
const classList = document.getElementById("classList");
/** @param {string} hash */
const scrollTo = (hash) => {
	document.querySelector(hash)?.scrollIntoView({
		behavior: "smooth",
	});
	history.pushState(null, "", hash);
};

if (classList) {
	if (table instanceof HTMLTableElement)
		classList.addEventListener("click", (event) => {
			if (event.target instanceof HTMLAnchorElement) {
				scrollTo(/** @type {string} */ (event.target.getAttribute("href")));
				event.preventDefault();
				return;
			}
			if (event.target instanceof HTMLLIElement) {
				const { textContent } = event.target;

				if (!textContent) return;
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
						let className = hour?.[j - 1];

						if (!className) {
							table.rows[i].cells[j].textContent = null;
							table.rows[i].cells[j].style.backgroundColor = "";
							continue;
						}
						const sa = className[1] === "S";

						className = `${className[0]}${sa ? className[2] : className[1]} ${
							sa ? "S.A." : "N.O."
						}`;
						table.rows[i].cells[j].style.backgroundColor = `rgba(${
							className === "Ricevimenti"
								? "0, 255, 0"
								: `${CLASS_NUMBER_STEP * +className[0]}, ${
										CLASS_COURSE_STEP * (sa ? 2 : 1)
								  }, ${
										CLASS_NAME_STEP *
										(className.charCodeAt(1) - FIRST_CHAR_CODE + 1)
								  }`
						}, 0.5)`;
						table.rows[i].cells[j].textContent = className;
					}
				}
				scrollTo(`#${textContent[0]}`);
				table.style.display = "table";
			}
		});
	for (let i = 0; i < names.length; i++) {
		const startLetter = names[i][0];

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
}

export {};
