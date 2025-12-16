document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCanvas();
    initGlitchEffect();
    initScrollReveal();
});

// --- 1. Loading Sequence ---
function initLoader() {
    const loader = document.getElementById('loader');
    const fill = document.querySelector('.progress-bar .fill');
    
    // Simulate connection time
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 2200); // Matches CSS animation + a bit
}

// --- 2. Background Canvas Animation (Neural Network) ---
function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = 'rgba(35, 201, 246, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const particleCount = Math.floor(width * height / 15000); // Density
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw connections
        ctx.strokeStyle = 'rgba(35, 201, 246, 0.1)';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });

    resize();
    initParticles();
    animate();
}

// --- 3. Text Glitch Effect ---
function initGlitchEffect() {
    const glitchTexts = document.querySelectorAll('.glitch, .menu a');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>[]';

    glitchTexts.forEach(el => {
        const originalText = el.dataset.text || el.innerText;
        
        el.addEventListener('mouseover', () => {
            let iterations = 0;
            const interval = setInterval(() => {
                el.innerText = originalText.split('')
                    .map((letter, index) => {
                        if (index < iterations) {
                            return originalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');

                if (iterations >= originalText.length) {
                    clearInterval(interval);
                }
                iterations += 1 / 3;
            }, 30);
        });
    });
}

// --- 4. Scroll Reveal ---
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    const targets = document.querySelectorAll('.news-item, .operator-card');
    targets.forEach(t => {
        t.style.opacity = '0';
        t.style.transform = 'translateY(20px)';
        t.style.transition = 'all 0.6s ease-out';
        observer.observe(t);
    });
}

