function checkOrientation() {
	var rotateBanner = document.querySelector(".rotate-banner");

	if (window.innerHeight > window.innerWidth) {
		// Dispositivo in modalità verticale
		// @ts-ignore
		rotateBanner.style.display = "flex";
	} else {
		// Dispositivo in modalità orizzontale
		// @ts-ignore
		rotateBanner.style.display = "none";
	}
}

// Aggiorna la visualizzazione del banner quando la finestra cambia dimensioni
window.addEventListener("resize", checkOrientation);

// Controlla l'orientazione iniziale della finestra al caricamento della pagina
window.addEventListener("load", function () {
	checkOrientation();
});

// Aggiorna la visualizzazione del banner quando l'utente ruota il dispositivo
window.addEventListener("orientationchange", checkOrientation);
