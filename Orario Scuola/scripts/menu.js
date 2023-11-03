const list = document.getElementsByClassName("pages")[0].children;

document.body.addEventListener("click", ({ target }) => {
	for (const item of list) {
		const el = /** @type {HTMLUListElement | null} */ (item.children[1]);

		if (!el) continue;
		if (target === item || item.contains(/** @type {HTMLElement} */ (target)))
			el.style.display = "block";
		else el.style.display = "none";
	}
});

export {};
