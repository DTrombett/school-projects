const checkOrientation = () => {
	const rotateBanner = /** @type {HTMLDivElement | null} */ (
		document.querySelector(".rotate-banner")
	);

	if (!rotateBanner) return;
	if (window.innerHeight > window.innerWidth) {
		// Dispositivo in modalità verticale
		rotateBanner.style.display = "flex";
	} else {
		// Dispositivo in modalità orizzontale
		rotateBanner.style.display = "none";
	}
};

// Aggiorna la visualizzazione del banner quando la finestra cambia dimensioni
window.addEventListener("resize", checkOrientation);
// Controlla l'orientazione iniziale della finestra al caricamento della pagina
window.addEventListener("load", checkOrientation);
// Aggiorna la visualizzazione del banner quando l'utente ruota il dispositivo
window.addEventListener("orientationchange", checkOrientation);
