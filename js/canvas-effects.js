// ============================================
// CANVAS EFFECTS - WEDDING INVITATION
// Efectos visuales híbridos con Canvas
// ============================================

(function() {
    'use strict';

    // ===== CONFIGURACIÓN GLOBAL =====
    // Si existe WEDDING_CANVAS_CONFIG (desde canvas-config.js), usarlo
    // Si no, usar configuración por defecto
    const CONFIG = window.WEDDING_CANVAS_CONFIG || {
        particles: {
            enabled: true,
            count: 30,
            types: ['❤️', '💍', '✨', '💕', '🌸'],
            minSize: 15,
            maxSize: 30,
            speed: 0.5,
            minOpacity: 0.3,
            maxOpacity: 0.7
        },
        confetti: {
            enabled: true,
            count: 100,
            colors: ['#ff6b9d', '#c44569', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'],
            gravity: 0.3,
            minSize: 5,
            maxSize: 13
        },
        sparkles: {
            enabled: true,
            count: 20,
            color: '#ffffff',
            minSize: 2,
            maxSize: 6
        },
        audioVisualizer: {
            enabled: true,
            bars: 32,
            color: '#7bb5a8',
            opacity: 0.3,
            maxHeight: 100,
            position: 'bottom'
        },
        performance: {
            targetFPS: 60,
            autoReduce: true,
            mobileParticleLimit: 15
        }
    };

    // Auto-reducir efectos en móviles si está habilitado
    if (CONFIG.performance.autoReduce && window.innerWidth < 768) {
        CONFIG.particles.count = Math.min(
            CONFIG.particles.count, 
            CONFIG.performance.mobileParticleLimit
        );
        CONFIG.confetti.count = Math.floor(CONFIG.confetti.count * 0.5);
        console.log('📱 Modo móvil: Efectos reducidos para mejor rendimiento');
    }

    // ===== CANVAS SETUP =====
    let canvas, ctx;
    let particles = [];
    let sparkles = [];
    let confettiParticles = [];
    let audioVisualizerActive = false;

    function initCanvas() {
        // Crear canvas de fondo
        canvas = document.createElement('canvas');
        canvas.id = 'wedding-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        document.body.insertBefore(canvas, document.body.firstChild);

        ctx = canvas.getContext('2d');
        resizeCanvas();

        window.addEventListener('resize', resizeCanvas);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // ===== PARTÍCULAS FLOTANTES =====
    class FloatingParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = CONFIG.particles.minSize + Math.random() * (CONFIG.particles.maxSize - CONFIG.particles.minSize);
            this.speedX = (Math.random() - 0.5) * CONFIG.particles.speed;
            this.speedY = (Math.random() - 0.5) * CONFIG.particles.speed;
            this.emoji = CONFIG.particles.types[Math.floor(Math.random() * CONFIG.particles.types.length)];
            this.opacity = CONFIG.particles.minOpacity + Math.random() * (CONFIG.particles.maxOpacity - CONFIG.particles.minOpacity);
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;

            // Wrap around screen
            if (this.x < -this.size) this.x = canvas.width + this.size;
            if (this.x > canvas.width + this.size) this.x = -this.size;
            if (this.y < -this.size) this.y = canvas.height + this.size;
            if (this.y > canvas.height + this.size) this.y = -this.size;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.font = `${this.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.emoji, 0, 0);
            ctx.restore();
        }
    }

    function initParticles() {
        if (!CONFIG.particles.enabled) return;
        
        particles = [];
        for (let i = 0; i < CONFIG.particles.count; i++) {
            particles.push(new FloatingParticle());
        }
    }

    // ===== CONFETTI =====
    class ConfettiPiece {
        constructor(x, y) {
            this.x = x || Math.random() * canvas.width;
            this.y = y || -20;
            this.size = CONFIG.confetti.minSize + Math.random() * (CONFIG.confetti.maxSize - CONFIG.confetti.minSize);
            this.speedX = (Math.random() - 0.5) * 5;
            this.speedY = Math.random() * 5 + 3;
            this.color = CONFIG.confetti.colors[Math.floor(Math.random() * CONFIG.confetti.colors.length)];
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.3;
            this.gravity = CONFIG.confetti.gravity || 0.3;
            this.opacity = 1;
            this.life = 0;
            this.maxLife = 200;
        }

        update() {
            this.speedY += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            this.life++;

            // Fade out at the end
            if (this.life > this.maxLife * 0.8) {
                this.opacity = 1 - (this.life - this.maxLife * 0.8) / (this.maxLife * 0.2);
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }

        isDead() {
            return this.life >= this.maxLife || this.y > canvas.height + 50;
        }
    }

    function createConfettiEffect(x, y, count) {
        if (!CONFIG.confetti.enabled) return;

        const centerX = x !== undefined ? x : canvas.width / 2;
        const centerY = y !== undefined ? y : canvas.height / 3;

        for (let i = 0; i < count; i++) {
            confettiParticles.push(new ConfettiPiece(centerX, centerY));
        }
    }

    // ===== SPARKLES (DESTELLOS) =====
    class Sparkle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = CONFIG.sparkles.minSize + Math.random() * (CONFIG.sparkles.maxSize - CONFIG.sparkles.minSize);
            this.maxSize = this.size;
            this.growing = true;
            this.opacity = 1;
            this.color = CONFIG.sparkles.color || '#ffffff';
        }

        update() {
            if (this.growing) {
                this.size += 0.5;
                if (this.size >= this.maxSize * 2) {
                    this.growing = false;
                }
            } else {
                this.size -= 0.5;
                this.opacity -= 0.05;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            
            // Dibujar estrella de 4 puntas
            ctx.fillStyle = this.color;
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI) / 2;
                const x = this.x + Math.cos(angle) * this.size;
                const y = this.y + Math.sin(angle) * this.size;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            
            // Dibujar estrella rotada 45 grados
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI) / 2 + Math.PI / 4;
                const x = this.x + Math.cos(angle) * (this.size * 0.7);
                const y = this.y + Math.sin(angle) * (this.size * 0.7);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            
            ctx.restore();
        }

        isDead() {
            return this.opacity <= 0;
        }
    }

    function createSparkleEffect(x, y) {
        if (!CONFIG.sparkles.enabled) return;
        
        for (let i = 0; i < CONFIG.sparkles.count; i++) {
            const offsetX = (Math.random() - 0.5) * 50;
            const offsetY = (Math.random() - 0.5) * 50;
            sparkles.push(new Sparkle(x + offsetX, y + offsetY));
        }
    }

    // ===== AUDIO VISUALIZER =====
    let audioContext, analyser, dataArray;
    
    function initAudioVisualizer() {
        if (!CONFIG.audioVisualizer.enabled) return;

        const audioElement = document.getElementById('weddingMusic');
        if (!audioElement) return;

        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaElementSource(audioElement);
            
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            
            analyser.fftSize = CONFIG.audioVisualizer.bars * 2;
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
            
            audioVisualizerActive = true;
            
            console.log('✅ Visualizador de audio inicializado');
        } catch (error) {
            console.warn('⚠️ No se pudo inicializar el visualizador de audio:', error);
        }
    }

    function drawAudioVisualizer() {
        if (!audioVisualizerActive || !analyser) return;

        analyser.getByteFrequencyData(dataArray);

        const barWidth = canvas.width / CONFIG.audioVisualizer.bars;
        const maxBarHeight = CONFIG.audioVisualizer.maxHeight || 100;
        const position = CONFIG.audioVisualizer.position || 'bottom';

        for (let i = 0; i < CONFIG.audioVisualizer.bars; i++) {
            const barHeight = (dataArray[i] / 255) * maxBarHeight;
            const x = i * barWidth;
            const y = position === 'bottom' ? canvas.height - barHeight : 0;

            ctx.fillStyle = CONFIG.audioVisualizer.color;
            ctx.globalAlpha = CONFIG.audioVisualizer.opacity || 0.3;
            ctx.fillRect(x, y, barWidth - 2, barHeight);
        }

        ctx.globalAlpha = 1;
    }

    // ===== ANIMATION LOOP =====
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw audio visualizer (si está activo)
        const audioElement = document.getElementById('weddingMusic');
        if (audioElement && !audioElement.paused) {
            drawAudioVisualizer();
        }

        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Update and draw confetti
        confettiParticles = confettiParticles.filter(confetti => {
            confetti.update();
            confetti.draw();
            return !confetti.isDead();
        });

        // Update and draw sparkles
        sparkles = sparkles.filter(sparkle => {
            sparkle.update();
            sparkle.draw();
            return !sparkle.isDead();
        });

        requestAnimationFrame(animate);
    }

    // ===== EVENTOS Y TRIGGERS =====
    function setupEventListeners() {
        // Confetti al confirmar asistencia
        const originalSubmit = window.handleWeddingFormSubmit;
        if (originalSubmit) {
            window.handleWeddingFormSubmit = async function(...args) {
                const result = await originalSubmit.apply(this, args);
                if (result && result.success) {
                    createConfettiEffect(undefined, undefined, CONFIG.confetti.count);
                }
                return result;
            };
        }

        // Sparkles en botones importantes
        document.addEventListener('click', function(e) {
            const button = e.target.closest('.btn, .main-btn');
            if (button && !button.disabled) {
                const rect = button.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                createSparkleEffect(x, y);
            }
        });

        // Activar visualizador de audio cuando empiece la música
        const audioElement = document.getElementById('weddingMusic');
        if (audioElement) {
            audioElement.addEventListener('play', function() {
                if (!audioVisualizerActive) {
                    initAudioVisualizer();
                }
            });
        }
    }

    // ===== FUNCIONES PÚBLICAS =====
    window.weddingCanvas = {
        createConfetti: function(count = CONFIG.confetti.count) {
            createConfettiEffect(undefined, undefined, count);
        },
        createSparkles: function(x, y) {
            createSparkleEffect(x, y);
        },
        toggleParticles: function(enabled) {
            CONFIG.particles.enabled = enabled;
            if (enabled && particles.length === 0) {
                initParticles();
            }
        },
        toggleAudioVisualizer: function(enabled) {
            CONFIG.audioVisualizer.enabled = enabled;
            if (enabled && !audioVisualizerActive) {
                initAudioVisualizer();
            }
        }
    };

    // ===== INICIALIZACIÓN =====
    function init() {
        console.log('🎨 Inicializando efectos Canvas...');
        
        initCanvas();
        initParticles();
        setupEventListeners();
        animate();
        
        console.log('✅ Canvas effects ready!');
    }

    // Iniciar cuando el DOM esté listo y después del splash screen
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(init, 3000); // Después del splash screen
        });
    } else {
        setTimeout(init, 3000);
    }

})();