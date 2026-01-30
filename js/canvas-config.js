// ============================================
// CANVAS EFFECTS CONFIG
// Personaliza aquí los efectos visuales
// ============================================

const WEDDING_CANVAS_CONFIG = {
    // ===== PARTÍCULAS FLOTANTES =====
    particles: {
        enabled: true,           // true/false - Activar o desactivar
        count: 30,               // Número de partículas (recomendado: 15-50)
        
        // Emojis que flotan por la pantalla
        // Puedes agregar o quitar los que quieras
        types: [
            '❤️',    // Corazón rojo
            '💍',    // Anillo
            '✨',    // Brillo
            '💕',    // Dos corazones
            '🌸',    // Flor de cerezo
            // Opciones adicionales (descomenta las que quieras):
            // '🦋',    // Mariposa
            // '🌹',    // Rosa
            // '💐',    // Ramo de flores
            // '🎀',    // Moño
            // '🕊️',    // Paloma
            // '💝',    // Regalo corazón
            // '🌺',    // Hibisco
            // '🦢',    // Cisne
        ],
        
        minSize: 15,             // Tamaño mínimo en píxeles
        maxSize: 30,             // Tamaño máximo en píxeles
        speed: 0.5,              // Velocidad de movimiento (0.1=muy lento, 1.0=rápido)
        
        // Opacidad (transparencia)
        minOpacity: 0.3,         // Mínima opacidad (0=invisible, 1=sólido)
        maxOpacity: 0.7,         // Máxima opacidad
    },

    // ===== CONFETTI (PAPEL PICADO) =====
    confetti: {
        enabled: true,           // true/false - Activar o desactivar
        count: 100,              // Cantidad de piezas (recomendado: 50-200)
        
        // Colores del confetti (hexadecimales)
        colors: [
            '#ff6b9d',   // Rosa fuerte
            '#c44569',   // Rosa oscuro
            '#feca57',   // Amarillo
            '#48dbfb',   // Azul cielo
            '#ff9ff3',   // Rosa claro
            '#54a0ff',   // Azul
            // Opciones adicionales:
            // '#ffffff',   // Blanco
            // '#ffd700',   // Dorado
            // '#ff1493',   // Rosa intenso
            // '#00ff00',   // Verde
        ],
        
        // Física del confetti
        gravity: 0.3,            // Gravedad (más alto = cae más rápido)
        minSize: 5,              // Tamaño mínimo en píxeles
        maxSize: 13,             // Tamaño máximo en píxeles
    },

    // ===== DESTELLOS (SPARKLES) =====
    sparkles: {
        enabled: true,           // true/false - Activar o desactivar
        count: 20,               // Cantidad por click (recomendado: 10-30)
        color: '#ffffff',        // Color de los destellos
        minSize: 2,              // Tamaño mínimo
        maxSize: 6,              // Tamaño máximo
    },

    // ===== VISUALIZADOR DE AUDIO =====
    audioVisualizer: {
        enabled: true,           // true/false - Activar o desactivar
        bars: 32,                // Número de barras (recomendado: 16-64)
        color: '#7bb5a8',        // Color de las barras
        opacity: 0.3,            // Opacidad de las barras (0-1)
        maxHeight: 100,          // Altura máxima de las barras
        position: 'bottom',      // 'bottom' o 'top'
    },

    // ===== AJUSTES DE RENDIMIENTO =====
    performance: {
        // FPS (cuadros por segundo) objetivo
        targetFPS: 60,           // 60=suave, 30=ahorrar batería
        
        // Reducir efectos automáticamente en móviles antiguos
        autoReduce: true,        // true/false
        
        // Límites de partículas en móviles
        mobileParticleLimit: 15, // Máximo en móviles (cuando autoReduce=true)
    }
};

// ===== PRESETS PREDEFINIDOS =====
// Descomenta el que quieras usar

// PRESET 1: ELEGANTE (Minimalista)
/*
WEDDING_CANVAS_CONFIG.particles = {
    enabled: true,
    count: 15,
    types: ['✨', '💍', '🤍'],
    minSize: 12,
    maxSize: 20,
    speed: 0.3,
    minOpacity: 0.2,
    maxOpacity: 0.5
};
WEDDING_CANVAS_CONFIG.confetti.colors = ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0'];
*/

// PRESET 2: ROMÁNTICO (Tonos rosas)
/*
WEDDING_CANVAS_CONFIG.particles = {
    enabled: true,
    count: 35,
    types: ['💗', '🌸', '🦋', '💝', '🌺'],
    minSize: 15,
    maxSize: 28,
    speed: 0.4,
    minOpacity: 0.3,
    maxOpacity: 0.7
};
WEDDING_CANVAS_CONFIG.confetti.colors = ['#ff69b4', '#ffb6c1', '#ffc0cb', '#ff1493', '#db7093', '#fff0f5'];
*/

// PRESET 3: FESTIVO (Colorido)
/*
WEDDING_CANVAS_CONFIG.particles = {
    enabled: true,
    count: 50,
    types: ['🎉', '🎊', '🎈', '🎁', '🥳', '✨'],
    minSize: 18,
    maxSize: 35,
    speed: 0.8,
    minOpacity: 0.4,
    maxOpacity: 0.8
};
WEDDING_CANVAS_CONFIG.confetti.count = 200;
*/

// PRESET 4: JARDÍN (Naturaleza)
/*
WEDDING_CANVAS_CONFIG.particles = {
    enabled: true,
    count: 40,
    types: ['🌸', '🌺', '🌹', '🌼', '🦋', '🌿'],
    minSize: 14,
    maxSize: 26,
    speed: 0.3,
    minOpacity: 0.3,
    maxOpacity: 0.6
};
WEDDING_CANVAS_CONFIG.confetti.colors = ['#ff69b4', '#98d8c8', '#ffd700', '#ff7f50', '#dda0dd'];
*/

// PRESET 5: NOCTURNO (Elegante oscuro)
/*
WEDDING_CANVAS_CONFIG.particles = {
    enabled: true,
    count: 25,
    types: ['✨', '⭐', '💫', '🌟'],
    minSize: 10,
    maxSize: 22,
    speed: 0.2,
    minOpacity: 0.4,
    maxOpacity: 0.8
};
WEDDING_CANVAS_CONFIG.confetti.colors = ['#ffd700', '#silver', '#ffffff', '#ffff00'];
WEDDING_CANVAS_CONFIG.audioVisualizer.color = '#ffd700';
*/

// ===== FUNCIONES DE UTILIDAD =====

// Función para activar/desactivar efectos fácilmente
function toggleEffect(effectName, enabled) {
    if (WEDDING_CANVAS_CONFIG[effectName]) {
        WEDDING_CANVAS_CONFIG[effectName].enabled = enabled;
        console.log(`${effectName} ${enabled ? 'activado' : 'desactivado'}`);
    }
}

// Función para cambiar colores del confetti
function setConfettiColors(...colors) {
    WEDDING_CANVAS_CONFIG.confetti.colors = colors;
    console.log('Colores de confetti actualizados:', colors);
}

// Función para cambiar emojis de partículas
function setParticleEmojis(...emojis) {
    WEDDING_CANVAS_CONFIG.particles.types = emojis;
    console.log('Emojis de partículas actualizados:', emojis);
}

// ===== EJEMPLOS DE USO =====
/*
// Desactivar partículas flotantes:
toggleEffect('particles', false);

// Cambiar colores del confetti:
setConfettiColors('#ff0000', '#00ff00', '#0000ff');

// Cambiar emojis:
setParticleEmojis('💕', '💗', '💝', '💖');

// Activar solo en desktop (no en móviles):
if (window.innerWidth > 768) {
    WEDDING_CANVAS_CONFIG.particles.enabled = true;
} else {
    WEDDING_CANVAS_CONFIG.particles.count = 10;
}
*/

// ===== COLORES SUGERIDOS =====
/*
BODAS CLÁSICAS:
- Blanco y dorado: '#ffffff', '#ffd700', '#f0e68c'
- Rosa pastel: '#ffc0cb', '#ffb6c1', '#fff0f5'
- Azul cielo: '#87ceeb', '#b0e0e6', '#add8e6'

BODAS MODERNAS:
- Coral y turquesa: '#ff7f50', '#40e0d0', '#ffd700'
- Lavanda: '#e6e6fa', '#dda0dd', '#d8bfd8'
- Mint: '#98d8c8', '#7bb5a8', '#a8e6cf'

BODAS TEMÁTICAS:
- Vintage: '#d2b48c', '#bc8f8f', '#f5deb3'
- Tropical: '#ff6b9d', '#feca57', '#48dbfb'
- Otoño: '#ff7f50', '#d2691e', '#cd853f'
*/

// ===== EXPORTAR CONFIGURACIÓN =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WEDDING_CANVAS_CONFIG;
}