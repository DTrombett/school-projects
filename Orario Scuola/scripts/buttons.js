import "./menu.js";

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

fullScreenButton?.addEventListener("click", async () => {
	if (
		document.fullscreenElement ||
		("webkitFullscreenElement" in document && document.webkitFullscreenElement)
	) {
		// @ts-ignore
		await (document.exitFullscreen ?? document.webkitExitFullscreen)();
		fullScreenButton.src =
			"images/up-right-and-down-left-from-center-solid.svg";
	} else
		await (
			document.documentElement.requestFullscreen ??
			// @ts-ignore
			document.documentElement.webkitRequestFullscreen
		)();
});
