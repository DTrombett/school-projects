const menuButton = document.getElementById("openMenu");
const chooser = /** @type {HTMLDivElement | null} */ (
	document.getElementById("chooser")
);
const table = /** @type {HTMLTableElement | null} */ (
	document.getElementById("table")
);

export const displayButton = () => {
	if (!(chooser && menuButton && table)) return;
	const resolveX = () => {
		menuButton.style.left = `calc(${
			table.rows[0].cells[1].getBoundingClientRect().x
		}px - 2rem - 1vw)`;
	};

	if (window.innerWidth < 800) chooser.style.display = "none";
	menuButton.addEventListener("click", () => {
		chooser.style.display = chooser.style.display === "none" ? "flex" : "none";
		resolveX();
	});
	resolveX();
	menuButton.style.display = "flex";
};
