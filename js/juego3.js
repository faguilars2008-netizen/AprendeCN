const consignaVozRonda1 = "¡Súper misión de arrastre! Ronda uno. Clasifica este primer grupo de seres vivos chilenos en sus cajas correspondientes.";
const consignaVozRonda2 = "¡Excelente! Llegamos a la Ronda dos. Aquí tienes nuevos organismos chilenos. ¡A clasificar!";

// Base de datos de 12 organismos chilenos (6 por cada ronda)
const baseOrganismos = [
    { id: "org1", nombre: "🌲 Alerce", correcto: "productor", ronda: 1 },
    { id: "org2", nombre: "🌾 Pasto", correcto: "productor", ronda: 1 },
    { id: "org3", nombre: "🦌 Huemul", correcto: "consumidor", ronda: 1 },
    { id: "org4", nombre: "🐆 Puma", correcto: "consumidor", ronda: 1 },
    { id: "org5", nombre: "🍄 Hongo", correcto: "descomponedor", ronda: 1 },
    { id: "org6", nombre: "🧫 Bacteria", correcto: "descomponedor", ronda: 1 },
    { id: "org7", nombre: "🌺 Copihue", correcto: "productor", ronda: 2 },
    { id: "org8", nombre: "🌵 Cactus", correcto: "productor", ronda: 2 },
    { id: "org9", nombre: "🦉 Lechuza", correcto: "consumidor", ronda: 2 },
    { id: "org10", nombre: "🐭 Monito Monte", correcto: "consumidor", ronda: 2 },
    { id: "org11", nombre: "🪱 Lombriz", correcto: "descomponedor", ronda: 2 },
    { id: "org12", nombre: "🍄 Levadura", correcto: "descomponedor", ronda: 2 }
];

let rondaActual = 1;
let logradosEnRonda = 0;
let puntaje = 0;
let spansPalabras = [];
let idElementoArrastrándose = null;

document.addEventListener("DOMContentLoaded", () => {
    const avatar = localStorage.getItem("avatarEstudiante") || "avatar1";
    const imgHero = document.getElementById("player-hero-avatar");
    if (imgHero) {
        if (avatar === "avatar1") imgHero.src = "img/avatar1.jpeg";
        else if (avatar === "avatar2") imgHero.src = "img/avatar2.jpeg";
        else if (avatar === "avatar3") imgHero.src = "img/avatar3.jpeg";
        else if (avatar === "avatar4") imgHero.src = "img/avatar4.jpeg";
    }
    cargarRonda();
});

function cargarRonda() {
    logradosEnRonda = 0;
    const currentRound = document.getElementById("current-round");
    const scoreNode = document.getElementById("score-node");
    if (currentRound) currentRound.textContent = `${rondaActual}/2`;
    if (scoreNode) scoreNode.textContent = puntaje;

    const cajaIns = document.getElementById("instruction-bubble");
    const textoVoz = (rondaActual === 1) ? consignaVozRonda1 : consignaVozRonda2;
    if (cajaIns) {
        cajaIns.innerHTML = textoVoz.split(' ').map(w => `<span class="word-span">${w}</span>`).join(' ');
        spansPalabras = cajaIns.querySelectorAll('.word-span');
    }

    const tarjetasRonda = baseOrganismos.filter(item => item.ronda === rondaActual);
    const listaMezclada = tarjetasRonda.sort(() => Math.random() - 0.5);
    const pool = document.getElementById("items-pool");
    if (pool) {
        pool.innerHTML = listaMezclada.map(org => `
            <div class="drag-item" id="${org.id}" draggable="true" ondragstart="handleDragStart(event)" ondragend="handleDragEnd(event)">
                ${org.nombre}
            </div>
        `).join('');
    }

    reproducirConSubrayado(textoVoz);
}

function reproducirConSubrayado(textoAEscuchar) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const ut = new SpeechSynthesisUtterance(textoAEscuchar);
    ut.lang = 'es-CL';
    ut.rate = 0.85;
    let idxW = 0;

    ut.onboundary = (e) => {
        if (e.name === 'word') {
            spansPalabras.forEach(s => s.classList.remove('word-highlight'));
            if (idxW < spansPalabras.length) {
                spansPalabras[idxW].classList.add('word-highlight');
                idxW++;
            }
        }
    };
    ut.onend = () => spansPalabras.forEach(s => s.classList.remove('word-highlight'));
    window.speechSynthesis.speak(ut);
}

function volverAEscuchar() {
    const textoVoz = (rondaActual === 1) ? consignaVozRonda1 : consignaVozRonda2;
    reproducirConSubrayado(textoVoz);
}

function handleDragStart(e) {
    idElementoArrastrándose = e.target.id;
    e.target.classList.add("dragging");
    e.dataTransfer.setData("text/plain", e.target.id);
}

function handleDragEnd(e) {
    e.target.classList.remove("dragging");
}

function allowDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
}

function dragLeave(e) {
    e.currentTarget.classList.remove("drag-over");
}

function handleDrop(e) {
    e.preventDefault();
    const contenedorDestino = e.currentTarget;
    contenedorDestino.classList.remove("drag-over");

    const idTarjeta = idElementoArrastrándose || e.dataTransfer.getData("text");
    const tarjetaElemento = document.getElementById(idTarjeta);
    if (!tarjetaElemento) return;

    const datosObjeto = baseOrganismos.find(item => item.id === idTarjeta);
    if (!datosObjeto) return;
    const rolCajaDestino = contenedorDestino.getAttribute("data-role");

    if (datosObjeto.correcto === rolCajaDestino) {
        tarjetaElemento.setAttribute("draggable", "false");
        contenedorDestino.appendChild(tarjetaElemento);
        puntaje += 100;
        logradosEnRonda++;
        const scoreNode = document.getElementById("score-node");
        if (scoreNode) scoreNode.textContent = puntaje;
        reproducirAudioCorto("¡Excelente!");

        if (logradosEnRonda === 6) {
            if (rondaActual === 1) {
                setTimeout(() => {
                    rondaActual = 2;
                    limpiarCajasVisuales();
                    cargarRonda();
                }, 1200);
            } else {
                setTimeout(finalizarJuego, 1200);
            }
        }
    } else {
        reproducirAudioCorto("¡Prueba otra caja!");
        puntaje = Math.max(0, puntaje - 20);
        const scoreNode = document.getElementById("score-node");
        if (scoreNode) scoreNode.textContent = puntaje;
    }
    idElementoArrastrándose = null;
}

function reproducirAudioCorto(mensaje) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const discurso = new SpeechSynthesisUtterance(mensaje);
        discurso.lang = 'es-CL';
        window.speechSynthesis.speak(discurso);
    }
}

function limpiarCajasVisuales() {
    const cajas = document.querySelectorAll(".zone-box");
    cajas.forEach(caja => {
        const tarjetas = caja.querySelectorAll(".drag-item");
        tarjetas.forEach(t => t.remove());
    });
}

function finalizarJuego() {
    const screenGame = document.getElementById("screen-game");
    const screenResults = document.getElementById("screen-results");
    const resultsScoreText = document.getElementById("results-score-text");
    if (screenGame) screenGame.classList.add("screen-hidden");
    if (screenResults) screenResults.classList.remove("screen-hidden");
    if (resultsScoreText) resultsScoreText.textContent = `CONSEGUISTE ${puntaje} PUNTOS`;
    reproducirAudioCorto(`¡Misión cumplida! Conseguiste ${puntaje} puntos.`);
}

function reiniciarJuego() {
    rondaActual = 1;
    puntaje = 0;
    limpiarCajasVisuales();
    const screenResults = document.getElementById("screen-results");
    const screenGame = document.getElementById("screen-game");
    if (screenResults) screenResults.classList.add("screen-hidden");
    if (screenGame) screenGame.classList.remove("screen-hidden");
    cargarRonda();
}
