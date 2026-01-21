// ===== COUNTDOWN FUNCTIONALITY =====

// Fecha de la boda (30 de octubre 2026, 6:00 PM)
const WEDDING_DATE = new Date('2026-10-30T18:00:00').getTime();

// Elementos del DOM
let daysElement, hoursElement, minutesElement, secondsElement;

// ===== INICIALIZACIÓN DEL COUNTDOWN =====
function initCountdown() {
    // Obtener elementos del DOM
    daysElement = document.getElementById('days');
    hoursElement = document.getElementById('hours');
    minutesElement = document.getElementById('minutes');
    secondsElement = document.getElementById('seconds');
    
    // Verificar que los elementos existen
    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        console.error('No se encontraron todos los elementos del countdown');
        return;
    }
    
    // Actualizar countdown inmediatamente
    updateCountdown();
    
    // Iniciar el intervalo para actualizar cada segundo
    setInterval(updateCountdown, 1000);
    
    console.log('Countdown inicializado correctamente');
}

// ===== FUNCIÓN PRINCIPAL DE ACTUALIZACIÓN =====
function updateCountdown() {
    const now = new Date().getTime();
    const timeDistance = WEDDING_DATE - now;
    
    // Si la fecha ya pasó
    if (timeDistance < 0) {
        showWeddingDay();
        return;
    }
    
    // Calcular tiempo restante
    const days = Math.floor(timeDistance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDistance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDistance % (1000 * 60)) / 1000);
    
    // Actualizar elementos del DOM
    if (daysElement) daysElement.textContent = String(days).padStart(2, '0');
    if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
    if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, '0');
    if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, '0');
}

// ===== MOSTRAR MENSAJE DEL DÍA DE LA BODA =====
function showWeddingDay() {
    const countdownContainer = document.getElementById('countdown');
    if (countdownContainer) {
        countdownContainer.innerHTML = `
            <div class="wedding-day-message" style="text-align: center; color: white; z-index: 1; position: relative;">
                <h3 style="font-size: 2rem; margin-bottom: 20px; color: white;">🎉 ¡Hoy es nuestro gran día! 🎉</h3>
                <div class="celebration-animation" style="font-size: 3rem; margin: 20px 0; animation: celebration 2s ease-in-out infinite alternate;">
                    <span class="celebration-icon" style="margin: 0 10px; display: inline-block; animation: bounce 1.5s ease-in-out infinite;">💒</span>
                    <span class="celebration-icon" style="margin: 0 10px; display: inline-block; animation: bounce 1.5s ease-in-out infinite 0.2s;">💍</span>
                    <span class="celebration-icon" style="margin: 0 10px; display: inline-block; animation: bounce 1.5s ease-in-out infinite 0.4s;">🎊</span>
                    <span class="celebration-icon" style="margin: 0 10px; display: inline-block; animation: bounce 1.5s ease-in-out infinite 0.6s;">💐</span>
                </div>
                <p style="font-size: 1.5rem; margin-top: 15px; color: white;">¡Nos vemos en la ceremonia!</p>
            </div>
        `;
        
        // Agregar animaciones CSS para la celebración
        if (!document.getElementById('celebration-styles')) {
            const style = document.createElement('style');
            style.id = 'celebration-styles';
            style.textContent = `
                @keyframes celebration {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.1); }
                }
                
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que el contenido principal sea visible antes de inicializar
    const mainContent = document.getElementById('mainContent');
    if (mainContent && mainContent.classList.contains('show')) {
        initCountdown();
    } else {
        // Observar cambios en la clase show del contenido principal
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('show')) {
                    initCountdown();
                    observer.disconnect();
                }
            });
        });
        
        if (mainContent) {
            observer.observe(mainContent, { 
                attributes: true, 
                attributeFilter: ['class'] 
            });
        } else {
            // Fallback: inicializar después de un retraso
            setTimeout(initCountdown, 2000);
        }
    }
});

