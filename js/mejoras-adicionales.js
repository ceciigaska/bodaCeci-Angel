// ============================================
// ARCHIVO: mejoras-adicionales.js
// AGREGAR DESPUÉS de tus scripts actuales
// ============================================

(function() {
    'use strict';

    // ===== 1️⃣ ANIMACIONES AL SCROLL =====
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up', 'visible');
                    // Dejar de observar una vez que apareció
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observar todas las tarjetas
        document.querySelectorAll('.invitation-card').forEach(card => {
            card.classList.add('fade-in-up');
            observer.observe(card);
        });
    }

    // ===== 2️⃣ EFECTO RIPPLE EN BOTONES =====
    function addRippleEffect() {
        document.querySelectorAll('.btn, .main-btn, .secondary-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple-effect');

                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Agregar CSS para el efecto ripple
        const style = document.createElement('style');
        style.textContent = `
            .ripple-effect {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ===== 3️⃣ NOTIFICACIÓN DE COPIA MEJORADA =====
    function showCopyNotification(message = '✓ Copiado al portapapeles') {
        // Remover notificación existente si hay
        const existing = document.querySelector('.copy-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.innerHTML = `
            <span style="font-size: 1.2rem;">✓</span>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }

    // Mejorar la función copyAddress existente
    window.copyAddressImproved = function() {
        const address = "Av Centenario 1100, Colinas de Tarango, Álvaro Obregón, 01620 Ciudad de México, CDMX";
        
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(address)
                .then(() => showCopyNotification('📍 Dirección copiada'))
                .catch(() => fallbackCopy(address));
        } else {
            fallbackCopy(address);
        }
    };

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showCopyNotification('📍 Dirección copiada');
        } catch (err) {
            showCopyNotification('❌ Error al copiar');
        }
        document.body.removeChild(textarea);
    }

    // ===== 4️⃣ CONTADOR CON ANIMACIÓN DE NÚMEROS =====
    function animateCountdownNumbers() {
        const numberElements = document.querySelectorAll('.time-number');
        
        numberElements.forEach(element => {
            element.addEventListener('transitionend', function() {
                this.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            });
        });
    }

    // ===== 5️⃣ EFECTO PARALLAX LIGERO =====
    function initParallax() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const parallaxElements = document.querySelectorAll('.invitation-card');
                    
                    parallaxElements.forEach((element, index) => {
                        const speed = 0.05 * (index + 1);
                        const yPos = -(scrolled * speed);
                        element.style.transform = `translateY(${yPos}px)`;
                    });
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ===== 6️⃣ SMOOTH SCROLL PARA NAVEGACIÓN =====
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ===== 7️⃣ DESTACAR SECCIÓN ACTIVA AL SCROLL =====
    function highlightActiveSection() {
        const sections = document.querySelectorAll('.invitation-card');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '-20% 0px -20% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remover clase active de todas las secciones
                    sections.forEach(s => s.classList.remove('section-active'));
                    // Agregar clase active a la sección visible
                    entry.target.classList.add('section-active');
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));

        // Agregar estilos para sección activa
        const style = document.createElement('style');
        style.textContent = `
            .section-active {
                border-color: #3c72b3 !important;
                border-width: 2px;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== 8️⃣ TYPING EFFECT PARA TÍTULOS =====
    function addTypingEffect() {
        const titleElement = document.querySelector('.couple-names');
        if (!titleElement) return;

        const originalText = titleElement.textContent;
        titleElement.textContent = '';
        titleElement.style.opacity = '1';

        let index = 0;
        function type() {
            if (index < originalText.length) {
                titleElement.textContent += originalText.charAt(index);
                index++;
                setTimeout(type, 100);
            }
        }

        // Iniciar después del splash
        setTimeout(type, 3500);
    }

    // ===== 9️⃣ CONFETTI AL ENVIAR FORMULARIO =====
    function createConfetti() {
        const colors = ['#3c72b3', '#7bb5a8', '#d4764f', '#c19a6b'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -20px;
                opacity: 0;
                transform: rotate(${Math.random() * 360}deg);
                animation: confetti-fall ${2 + Math.random() * 3}s ease-out forwards;
                z-index: 10000;
            `;
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 5000);
        }

        // Agregar animación de confetti
        if (!document.getElementById('confetti-animation')) {
            const style = document.createElement('style');
            style.id = 'confetti-animation';
            style.textContent = `
                @keyframes confetti-fall {
                    0% {
                        top: -20px;
                        opacity: 1;
                    }
                    100% {
                        top: 100vh;
                        opacity: 0;
                        transform: translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 720}deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Agregar confetti cuando se confirma asistencia
    window.showConfettiOnSuccess = function() {
        createConfetti();
    };

    // ===== 🔟 MEJORAR ACCORDION =====
    function enhanceAccordion() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        
        accordionHeaders.forEach(header => {
            header.addEventListener('click', function() {
                this.classList.toggle('active');
                const content = this.nextElementSibling;
                
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });
    }

    // ===== 1️⃣1️⃣ LAZY LOADING PARA IMÁGENES =====
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // ===== 1️⃣2️⃣ CONTADOR DE CARACTERES EN TEXTAREA =====
    function addCharacterCounter() {
        const textareas = document.querySelectorAll('textarea');
        
        textareas.forEach(textarea => {
            const maxLength = 500;
            const counter = document.createElement('div');
            counter.style.cssText = `
                text-align: right;
                font-size: 0.85rem;
                color: #7bb5a8;
                margin-top: 5px;
            `;
            counter.textContent = `0 / ${maxLength}`;
            
            textarea.setAttribute('maxlength', maxLength);
            textarea.parentNode.appendChild(counter);
            
            textarea.addEventListener('input', function() {
                const length = this.value.length;
                counter.textContent = `${length} / ${maxLength}`;
                counter.style.color = length > maxLength * 0.9 ? '#d4764f' : '#7bb5a8';
            });
        });
    }

    // ===== 1️⃣3️⃣ VALIDACIÓN VISUAL DE FORMULARIOS =====
    function enhanceFormValidation() {
        const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.style.borderColor = '#d4764f';
                    this.style.animation = 'shake 0.5s ease';
                } else {
                    this.style.borderColor = '#7bb5a8';
                }
            });

            input.addEventListener('focus', function() {
                this.style.animation = '';
            });
        });

        // Agregar animación shake
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(style);
    }

    // ===== 1️⃣4️⃣ SCROLL TO TOP BUTTON =====
    function addScrollToTop() {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.style.cssText = `
            position: fixed;
            bottom: 90px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3c72b3, #7bb5a8);
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;

        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        document.body.appendChild(button);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.style.opacity = '1';
                button.style.pointerEvents = 'all';
            } else {
                button.style.opacity = '0';
                button.style.pointerEvents = 'none';
            }
        });
    }

    // ===== INICIALIZACIÓN =====
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🎨 Inicializando mejoras visuales...');

        // Esperar a que el contenido principal sea visible
        setTimeout(() => {
            initScrollAnimations();
            addRippleEffect();
            animateCountdownNumbers();
            // initParallax(); // Descomentar si quieres parallax (puede afectar rendimiento)
            initSmoothScroll();
            highlightActiveSection();
            // addTypingEffect(); // Descomentar si quieres efecto typing en nombres
            enhanceAccordion();
            initLazyLoading();
            addCharacterCounter();
            enhanceFormValidation();
            addScrollToTop();

            // Reemplazar función copyAddress del HTML
            const copyButtons = document.querySelectorAll('button[onclick*="copyAddress"]');
            copyButtons.forEach(btn => {
                btn.removeAttribute('onclick');
                btn.addEventListener('click', window.copyAddressImproved);
            });

            console.log('✅ Mejoras visuales activadas!');
        }, 3500); // Después del splash screen
    });

    // Exportar funciones para uso global
    window.weddingEnhancements = {
        showCopyNotification,
        createConfetti,
        showConfettiOnSuccess
    };

})();