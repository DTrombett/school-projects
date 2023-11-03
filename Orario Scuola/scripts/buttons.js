const fullScreenButton = /** @type {HTMLImageElement | null} */ (
	document.getElementById("fullScreen")
);
let buttonReady = false;

export const displayButton = () => {
	if (buttonReady) return;
	const chooser = /** @type {HTMLDivElement | null} */ (
		document.getElementById("chooser")
	);
	const menuButton = document.getElementById("openMenu");
	const table = /** @type {HTMLTableElement | null} */ (
		document.getElementById("table")
	);

	if (!(chooser && menuButton && table)) return;
	buttonReady ||= true;
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

fullScreenButton?.addEventListener("click", () => {
	if (document.fullscreenElement) {
		document.exitFullscreen();
		fullScreenButton.src =
			"images/up-right-and-down-left-from-center-solid.svg";
	} else {
		document.documentElement.requestFullscreen();
		fullScreenButton.src = "images/down-left-and-up-right-to-center-solid.svg";
	}
});