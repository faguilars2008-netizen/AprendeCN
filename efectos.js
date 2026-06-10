/**
 * AprendeCN - Sistema de Sonidos y Efectos (Web Audio API & Confetti)
 * Estilo DC Comics - Ciencias Naturales
 */

// Sonido de Acierto (Tono de campana ascendente alegre)
function reproducirAcierto() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const now = ctx.currentTime;
        
        // Nota 1: E5 (659.25 Hz)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(659.25, now);
        gain1.gain.setValueAtTime(0.08, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.15);
        
        // Nota 2: C6 (1046.50 Hz) después de un leve retraso
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1046.50, now + 0.08);
        gain2.gain.setValueAtTime(0.1, now + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.08);
        osc2.stop(now + 0.35);
    } catch (e) {
        console.warn("AudioContext no es soportado o fue bloqueado:", e);
    }
}

// Sonido de Error (Zumbido descendente dramático de cómic)
function reproducirError() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth'; // Onda tipo diente de sierra para efecto retro/cómics
        
        // Frecuencia descendente de 140Hz a 80Hz
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.25);
        
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.25);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
    } catch (e) {
        console.warn("AudioContext no es soportado o fue bloqueado:", e);
    }
}

// Sonido de Serpentinas / Celebración (Fanfarria arpegiada de superhéroes y pops)
function reproducirConfetti() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const now = ctx.currentTime;
        
        // Fanfarria arpegiada: Do5, Mi5, Sol5, Do6
        const notas = [523.25, 659.25, 783.99, 1046.50];
        notas.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle'; // Onda más cálida e instrumental
            osc.frequency.setValueAtTime(freq, now + i * 0.08);
            gain.gain.setValueAtTime(0.06, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.45);
        });
        
        // Pequeños efectos de "pop" de serpentinas/burbujas
        for (let i = 0; i < 8; i++) {
            const popTime = now + 0.3 + i * 0.12;
            const popFreq = 700 + Math.random() * 500;
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(popFreq, popTime);
            osc.frequency.exponentialRampToValueAtTime(150, popTime + 0.08);
            
            gain.gain.setValueAtTime(0.04, popTime);
            gain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.08);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(popTime);
            osc.stop(popTime + 0.08);
        }
    } catch (e) {
        console.warn("AudioContext no es soportado o fue bloqueado:", e);
    }
}

// Disparar serpentinas visuales (Confetti) y sonido
function lanzarSerpentinas() {
    // 1. Sonido de celebración de serpentinas
    reproducirConfetti();
    
    // 2. Confetti en pantalla
    if (typeof confetti === 'function') {
        ejecutarAnimacionConfetti();
    } else {
        // Cargar script de forma dinámica si no está presente en la página
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
        script.onload = () => {
            ejecutarAnimacionConfetti();
        };
        document.head.appendChild(script);
    }
}

function ejecutarAnimacionConfetti() {
    const duration = 4.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 35, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        
        const particleCount = 45 * (timeLeft / duration);
        // Lanzamientos alternados desde los costados inferiores (efecto serpentina)
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
        }));
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
        }));
    }, 220);
}
