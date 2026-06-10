document.addEventListener("DOMContentLoaded", () => {
    const nombreGuardado = localStorage.getItem("nombreEstudiante") || "Héroe";
    const avatarGuardado = localStorage.getItem("avatarEstudiante");

    document.getElementById("player-name").textContent = nombreGuardado;

    const imagenAvatar = document.getElementById("chosen-avatar");
    if (avatarGuardado === "avatar1") imagenAvatar.src = "img/avatar1.jpeg";
    if (avatarGuardado === "avatar2") imagenAvatar.src = "img/avatar2.jpeg";
    if (avatarGuardado === "avatar3") imagenAvatar.src = "img/avatar3.jpeg";
    if (avatarGuardado === "avatar4") imagenAvatar.src = "img/avatar4.jpeg";

    setTimeout(() => {
        reproducirVozBienvenida(`¡Excelente! Entraste con éxito. Elige si quieres jugar o aprender la materia de cuarto básico.`);
    }, 500);
});

// Función para el botón superior de juegos
function irAJuegos() {
    reproducirVozBienvenida("¡Preparando misiones y juegos interactivos! ¡A jugar!");
    setTimeout(() => {
        window.location.href = "juegos.html"; 
    }, 1200);
}

function reproducirVozBienvenida(mensaje) {
    window.speechSynthesis.cancel();
    const discurso = new SpeechSynthesisUtterance(mensaje);
    discurso.lang = 'es-CL';
    discurso.rate = 1.05;
    window.speechSynthesis.speak(discurso);
}