const [pages] = document.getElementsByClassName("pages");
const { children } = pages;

const resolveX = () => {
	const { height } = pages.getBoundingClientRect();

	for (const el of /** @type {HTMLCollectionOf<HTMLUListElement>} */ (
		document.getElementsByClassName("hiddenList")
	))
		el.style.top = `${height}px`;
};

window.addEventListener("resize", () => resolveX());
document.body.addEventListener("click", ({ target }) => {
	for (const item of children) {
		const el = /** @type {HTMLUListElement | null} */ (item.children[1]);

		if (!el) continue;
		if (target === item || item.contains(/** @type {HTMLElement} */ (target)))
			el.style.display = "block";
		else el.style.display = "none";
	}
});
resolveX();

export {};
