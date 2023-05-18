// const orarioClassi = await fetch("./orario.json").then((b) => b.json());
const table = document.getElementById("table");
const colors = {
  Arte: [244, 107, 24],
  "Educazione Fisica": [165, 136, 71],
  Filosofia: [130, 218, 242],
  Fisica: [252, 173, 190],
  Informatica: [205, 185, 250],
  Inglese: [70, 79, 245],
  Italiano: [37, 216, 180],
  Latino: [244, 0, 161],
  Matematica: [210, 54, 57],
  Religione: [104, 29, 97],
  Scienze: [124, 240, 86],
  Storia: [241, 232, 126],
};

if (table instanceof HTMLTableElement)
  document.getElementById("classList")?.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLLIElement)) return;
    const { textContent } = event.target;

    if (!textContent) return;
    // 		/** @type {string[][] | undefined} */
    // 		const array = orarioClassi[textContent];
    //
    // 		if (!array) return;
    if (!table.caption) table.caption = table.createCaption();
    table.caption.textContent = `Orario ${textContent}`;
    for (let i = 1; i < table.rows.length; i++)
      for (let j = 1; j < table.rows[i].cells.length; j++) {
        const subject = Object.keys(colors)[Math.floor(Math.random() * 12)];

        table.rows[i].cells[j].textContent = subject;
        table.rows[i].cells[j].style.backgroundColor =
          colors[subject] && `rgba(${colors[subject].join(", ")}, 0.5)`;
      }
    table.style.display = "table";
  });
