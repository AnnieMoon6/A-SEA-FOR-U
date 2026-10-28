document.addEventListener("DOMContentLoaded", () => {
    const get = (id) => document.getElementById(id);

    // ESCENAS
    const intro = get("intro");
    const cakeSection = get("cakeSection");
    const underwater = get("underwater");
    const reef = get("reef");
    const letterSection = get("letterSection");
    const finalSection = get("finalSection");

    // BOTONES
    const startButton = get("startButton");
    const blowCandleButton = get("blowCandleButton");
    const cakeContinueButton = get("cakeContinueButton");
    const continueButton = get("continueButton");
    const reefContinue = get("reefContinue");
    const letterContinue = get("letterContinue");
    const letterBody = document.querySelector(".letter-body");

    // PASTEL
    const cakeImage = get("cakeImage");
    const cakePrompt = get("cakePrompt");
    const cakeMessage = get("cakeMessage");

    // RECUERDOS
    const memoryOverlay = get("memoryOverlay");
    const closeMemory = get("closeMemory");
    const memoryIcon = get("memoryIcon");
    const memoryLabel = get("memoryLabel");
    const memoryTitle = get("memoryTitle");
    const memoryText = get("memoryText");
    const memoryDate = get("memoryDate");
    const memoryMedia = get("memoryMedia");

    // MÚSICA GLOBAL
    const backgroundMusic = get("backgroundMusic");
    const musicToggle = get("musicToggle");

    // FOTO FINAL
    const finalPhoto = get("finalPhoto");
    const photoError = get("photoError");

    // CAMBIAR DE ESCENA
    function changeScene(current, next, delay = 1150) {
        if (!current || !next) {
            console.error("Falta una escena. Revisa los IDs del HTML.");
            return;
        }

        next.style.display = "flex";
        requestAnimationFrame(() => next.classList.add("show"));

        window.setTimeout(() => {
            current.classList.remove("show");
            current.style.display = "none";
        }, delay);
    }

    // INTRO → PASTEL
    startButton?.addEventListener("click", () => {
        changeScene(intro, cakeSection);
        // Intentar reproducir desde una interacción real del usuario.
        playBackgroundMusic();
    });

    // APAGAR LA VELA
    blowCandleButton?.addEventListener("click", () => {
        if (!cakeImage || !cakePrompt || !cakeMessage) return;

        cakeImage.src = "images/cakeout.png";
        cakeImage.alt = "Pastel de cumpleaños con la vela apagada";
        cakePrompt.textContent = "¡Deseo concedido! Feliz cumpleaños, mi amor. 🩵";
        cakeMessage.hidden = false;
        blowCandleButton.hidden = true;
        if (cakeContinueButton) cakeContinueButton.hidden = false;
    });

    // PASTEL → OCÉANO
    cakeContinueButton?.addEventListener("click", () => {
        changeScene(cakeSection, underwater);
    });

    // OCÉANO → ARRECIFE
    continueButton?.addEventListener("click", () => {
        changeScene(underwater, reef);
    });

    // RECUERDOS
    const memories = {
        memory1: {
            icon: "⛏️",
            label: "Nuestro comienzo",
            title: "Nuestra primera foto en Minecraft",
            text: "Un pequeño recuerdo de cuando empezamos a compartir aventuras juntos. Me encanta tener pedacitos de nuestra historia que puedo volver a mirar.",
            date: "Nuestro comienzo 🩵",
            type: "image",
            src: "images/minecraft.jpg",
            alt: "Nuestra primera foto juntos en Minecraft"
        },
        memory2: {
            icon: "🩵",
            label: "Dos palabras especiales",
            title: "Nuestro primer «Te amo» en Sky",
            text: "Un momento que hizo todavía más especial nuestra pequeña historia. Hay palabras que se quedan guardadas en el corazón.",
            date: "Un recuerdo de Sky",
            type: "image",
            src: "images/sky-te-amo.jpg",
            alt: "Nuestra primera foto en Sky con un Te amo"
        },
        memory3: {
            icon: "🪽",
            label: "Dos skykids",
            title: "Nuestras pequeñas aventuras",
            text: "Dos skykids compartiendo aventuras, creando recuerdos y encontrándose una y otra vez, incluso cuando hay distancia de por medio.",
            date: "Juntos, incluso en la distancia",
            type: "video",
            src: "videos/skykids.mp4"
        },
        memory4: {
            icon: "🌊",
            label: "Más allá de la pantalla",
            title: "Nosotros en la vida real",
            text: "Un recuerdo de esos momentos en los que la distancia deja de sentirse tan grande. Ojalá nos queden muchísimos más por vivir.",
            date: "Un momento nuestro 🩵",
            type: "image",
            src: "images/nosotros.jpg",
            alt: "Annie y Glahd juntos"
        }
    };

    function openMemory(key) {
        const memory = memories[key];
        if (!memory || !memoryOverlay || !memoryMedia) return;

        if (memoryIcon) memoryIcon.textContent = memory.icon;
        if (memoryLabel) memoryLabel.textContent = memory.label;
        if (memoryTitle) memoryTitle.textContent = memory.title;
        if (memoryText) memoryText.textContent = memory.text;
        if (memoryDate) memoryDate.textContent = memory.date;

        memoryMedia.replaceChildren();

        if (memory.type === "video") {
            const video = document.createElement("video");
            video.src = memory.src;
            video.controls = true;
            video.playsInline = true;
            video.preload = "metadata";
            video.setAttribute("aria-label", "Video de nuestros Skykids");
            memoryMedia.appendChild(video);
        } else {
            const image = document.createElement("img");
            image.src = memory.src;
            image.alt = memory.alt;
            image.addEventListener("error", () => {
                console.error("No se encontró la imagen:", memory.src);
                image.alt = "No se pudo cargar " + memory.src;
            });
            memoryMedia.appendChild(image);
        }

        memoryOverlay.classList.add("active");
        memoryOverlay.setAttribute("aria-hidden", "false");
        closeMemory?.focus();
    }

    document.querySelectorAll("[data-memory]").forEach((card) => {
        card.addEventListener("click", () => openMemory(card.dataset.memory));
    });

    // CERRAR RECUERDOS
    function closeMemoryPopup() {
        if (!memoryOverlay) return;
        memoryOverlay.classList.remove("active");
        memoryOverlay.setAttribute("aria-hidden", "true");

        const video = memoryMedia?.querySelector("video");
        if (video) {
            video.pause();
            video.removeAttribute("src");
            video.load();
        }
    }

    closeMemory?.addEventListener("click", closeMemoryPopup);
    memoryOverlay?.addEventListener("click", (event) => {
        if (event.target === memoryOverlay) closeMemoryPopup();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMemoryPopup();
    });

    // MÚSICA GLOBAL: SUENA DURANTE TODAS LAS ESCENAS
    function updateMusicButton() {
        if (!backgroundMusic || !musicToggle) return;
        const playing = !backgroundMusic.paused;
        musicToggle.textContent = playing ? "🎵 Pausar música" : "🎵 Reproducir música";
        musicToggle.setAttribute("aria-label", playing ? "Pausar música" : "Reproducir música");
        musicToggle.setAttribute("aria-pressed", String(playing));
    }

    async function playBackgroundMusic() {
        if (!backgroundMusic) return;
        try {
            await backgroundMusic.play();
        } catch (error) {
            // El navegador puede bloquear el autoplay; el botón permite iniciarlo.
            console.info("La música necesita una interacción del usuario para empezar.");
        }
        updateMusicButton();
    }

    musicToggle?.addEventListener("click", async () => {
        if (!backgroundMusic) return;
        if (backgroundMusic.paused) {
            await playBackgroundMusic();
        } else {
            backgroundMusic.pause();
            updateMusicButton();
        }
    });

    backgroundMusic?.addEventListener("play", updateMusicButton);
    backgroundMusic?.addEventListener("pause", updateMusicButton);
    backgroundMusic?.addEventListener("error", () => {
        if (musicToggle) musicToggle.textContent = "⚠️ Música no disponible";
        console.error("No se pudo cargar audio/cancion.mp3. Revisa la ruta.");
    });
    updateMusicButton();

    // EFECTO MÁQUINA DE ESCRIBIR PARA LA CARTA
    let typingRun = 0;

    async function typeLetter() {
        if (!letterBody) return;

        const thisRun = ++typingRun;
        const paragraphs = Array.from(letterBody.querySelectorAll("p"));
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        // Guardar el texto original y preparar la carta vacía.
        const lines = paragraphs.map((paragraph) => {
            // innerText puede devolver una cadena vacía si la escena aún está oculta.
            // Leer una copia con textContent permite recuperar la carta siempre.
            const copy = paragraph.cloneNode(true);
            copy.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
            return copy.textContent.replace(/\u00a0/g, " ").replace(/[ \t]+\n/g, "\n").trim();
        });
        paragraphs.forEach((paragraph) => {
            paragraph.textContent = "";
            paragraph.classList.remove("is-typing");
        });
        if (letterContinue) letterContinue.hidden = true;

        for (let i = 0; i < paragraphs.length; i++) {
            if (thisRun !== typingRun) return;
            const paragraph = paragraphs[i];
            const characters = Array.from(lines[i]);

            if (prefersReducedMotion) {
                paragraph.textContent = lines[i];
                continue;
            }

            paragraph.classList.add("is-typing");
            for (const character of characters) {
                if (thisRun !== typingRun) return;
                paragraph.textContent += character;
                // Mantener visible la línea que se está escribiendo en móvil.
                paragraph.scrollIntoView({ block: "nearest", behavior: "auto" });
                await new Promise((resolve) => window.setTimeout(resolve, 27));
            }
            paragraph.classList.remove("is-typing");
            await new Promise((resolve) => window.setTimeout(resolve, 220));
        }

        if (thisRun === typingRun && letterContinue) {
            letterContinue.hidden = false;
        }
    }

    // ARRECIFE → CARTA: aparece y empieza a escribirse poco a poco.
    reefContinue?.addEventListener("click", () => {
        closeMemoryPopup();
        changeScene(reef, letterSection);
        typeLetter();
    });

    // CARTA → ESCENA FINAL (la música sigue sonando)
    letterContinue?.addEventListener("click", () => {
        changeScene(letterSection, finalSection);
    });

    // COMPROBAR LA FOTO DIFERENTE DE LA ESCENA FINAL
    if (finalPhoto && photoError) {
        finalPhoto.addEventListener("load", () => {
            photoError.hidden = true;
        });
        finalPhoto.addEventListener("error", () => {
            photoError.hidden = false;
            console.error("No se encontró images/foto-final.jpg. Revisa el nombre y la ruta.");
        });
        if (finalPhoto.complete && finalPhoto.naturalWidth === 0) {
            photoError.hidden = false;
        }
    }
});
