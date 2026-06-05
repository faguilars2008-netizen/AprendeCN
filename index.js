let avatarSeleccionado = "";

// Función del botón Ver Contenidos (Muestra ejemplos explicados)
function toggleContenidos() {
    const panel = document.getElementById("panel-contenidos");
    panel.classList.toggle("hidden");
    
    if (!panel.classList.contains("hidden")) {
        reproducirVoz("¡Atención científicos! Hoy conoceremos cómo se traspasa la energía a través de los productores, consumidores y descomponedores en los ecosistemas de Chile.", false);
    }
}

// Función encargada de marcar cuál imagen de avatar presionó el estudiante
function seleccionarAvatar(elementoImg, nombreAvatar) {
    // Quitamos la clase 'selected' de todas las imágenes de avatares
    const avatares = document.querySelectorAll('.avatar-img');
    avatares.forEach(img => img.classList.remove('selected'));
    
    // Añadimos el borde verde de selección a la imagen que recibió el clic
    elementoImg.classList.add('selected');
    avatarSeleccionado = nombreAvatar;

    // Respuestas personalizadas por voz al tocar sus imágenes
    if (nombreAvatar === 'avatar1') reproducirVoz("¡Héroe uno seleccionado! Listo para la acción.", false);
    if (nombreAvatar === 'avatar2') reproducirVoz("¡Héroe dos seleccionado! Tu fuerza científica es enorme.", false);
    if (nombreAvatar === 'avatar3') reproducirVoz("¡Héroe tres seleccionado! Tu mente es tu superpoder.", false);
    if (nombreAvatar === 'avatar4') reproducirVoz("¡Héroe cuatro seleccionado! Vamos a salvar el ecosistema.", false);
}

// Validación y Redirección a bienvenida.html
function iniciarAventura() {
    const nombre = document.getElementById("username").value.trim();

    // VOZ DE MUJER en caso de faltar el nombre o el avatar
    if (nombre === "") {
        reproducirVoz("¡Hola! Recuerda que debes ingresar sus datos y escribir su nombre antes de continuar.", true);
        alert("¡Por favor, escribe tu nombre para iniciar!");
        return;
    }

    if (avatarSeleccionado === "") {
        reproducirVoz("¡Hola! Falta un dato importante. Debes elegir tu avatar para empezar.", true);
        alert("¡Por favor, selecciona tu avatar de superhéroe!");
        return;
    }

    // Guardar datos temporalmente en el navegador
    localStorage.setItem("nombreEstudiante", nombre);
    localStorage.setItem("avatarEstudiante", avatarSeleccionado);
    localStorage.setItem("puntajeTotal", "0");

    reproducirVoz(`¡Fabuloso ${nombre}! Entrando a la base de operaciones de la liga de la ciencia.`, false);
    
    // REDIRECCIÓN A BIENVENIDA.HTML
    setTimeout(() => {
        window.location.href = "bienvenida.html";
    }, 1800);
}

// Motor de síntesis de voz con filtro de voz de mujer incorporado
function reproducirVoz(mensaje, forzarFemenina) {
    window.speechSynthesis.cancel(); 
    const discurso = new SpeechSynthesisUtterance(mensaje);
    discurso.lang = 'es-CL'; 
    discurso.rate = 1.05; 

    const voces = window.speechSynthesis.getVoices();

    if (forzarFemenina) {
        // Filtro para capturar perfiles de voz de mujer en los navegadores del laboratorio
        const vozFemenina = voces.find(voz => 
            voz.lang.includes('es') && 
            (voz.name.toLowerCase().includes('female') || 
            voz.name.toLowerCase().includes('helena') || 
            voz.name.toLowerCase().includes('paulina') || 
            voz.name.toLowerCase().includes('laura') || 
            voz.name.toLowerCase().includes('sabina') ||
            voz.name.toLowerCase().includes('google spanish'))
        );

        if (vozFemenina) {
            discurso.voice = vozFemenina;
        }
    }

    window.speechSynthesis.speak(discurso);
}

// Precarga de voces para Google Chrome / Edge en salas de computación
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = speechSynthesis.getVoices;
}