/**
 * M.P.A.S — Multi-Page Cyber-Portal Engine
 * 1. Theme Switcher & Persistence (Dark / Light)
 * 2. Subtle Antigravity Ambient Particle Physics
 * 3. Cinematic Page Fade Transitions
 * 4. Copy-to-Clipboard Direct Handshake
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  // Initialize Theme System
  initThemeSystem();

  // Initialize Ambient Particle Animation
  initAmbientParticles();

  // Initialize Kinetic Entropy-to-Order Title Animation
  initKineticTitleAnimation();

  // Initialize Smooth Page Transitions
  initPageTransitions();
});

// Remove exiting class on bfcache restore
window.addEventListener('pageshow', () => {
  document.body.classList.remove('page-exiting');
});

/* ==========================================================================
   1. Theme System (Light / Dark Mode Switcher)
   ========================================================================== */
function initThemeSystem() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const html = document.documentElement;

  // Retrieve saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    html.setAttribute('data-theme', 'light');
  } else {
    html.setAttribute('data-theme', 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
}

/* ==========================================================================
   2. Subtle Ambient Antigravity Particle Canvas Animation
   ========================================================================== */
function initAmbientParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const mouse = { x: -1000, y: -1000, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.baseX = this.x;
      this.baseY = this.y;
      this.size = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.density = (Math.random() * 15) + 8;
      this.isEmerald = Math.random() > 0.4;
    }

    draw() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.isEmerald
        ? (isLight ? 'rgba(5, 150, 105, 0.45)' : 'rgba(16, 185, 129, 0.4)')
        : (isLight ? 'rgba(2, 132, 199, 0.4)' : 'rgba(6, 182, 212, 0.35)');
      ctx.fill();
    }

    update() {
      // Gentle ambient drift
      this.baseX += this.vx;
      this.baseY += this.vy;

      if (this.baseX < 0 || this.baseX > width) this.vx *= -1;
      if (this.baseY < 0 || this.baseY > height) this.vy *= -1;

      // Mouse Antigravity Interactivity
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const maxDistance = mouse.radius;
        const force = (maxDistance - distance) / maxDistance;
        const directionX = forceDirectionX * force * this.density;
        const directionY = forceDirectionY * force * this.density;

        this.x -= directionX;
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX) {
          const dx = this.x - this.baseX;
          this.x -= dx * 0.04;
        }
        if (this.y !== this.baseY) {
          const dy = this.y - this.baseY;
          this.y -= dy * 0.04;
        }
      }
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 22000), 55);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const strokeColor = isLight ? 'rgba(5, 150, 105, ' : 'rgba(16, 185, 129, ';

    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          const opacity = (1 - (distance / 110)) * 0.15;
          ctx.strokeStyle = strokeColor + opacity + ')';
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  resize();
  animate();
}

/* ==========================================================================
   3. Cinematic Page Transitions
   ========================================================================== */
function initPageTransitions() {
  const internalLinks = document.querySelectorAll('a[href]');

  internalLinks.forEach(link => {
    const href = link.getAttribute('href');

    // Only apply transition to internal relative pages (.html)
    if (
      href &&
      !href.startsWith('http') &&
      !href.startsWith('#') &&
      !href.startsWith('mailto:') &&
      !link.hasAttribute('target') &&
      (href.endsWith('.html') || href === '/' || !href.includes('.'))
    ) {
      link.addEventListener('click', (e) => {
        // Allow ctrl/cmd + click to open in new tab
        if (e.metaKey || e.ctrlKey) return;

        e.preventDefault();
        document.body.classList.add('page-exiting');

        setTimeout(() => {
          window.location.href = href;
        }, 180);
      });
    }
  });
}

/* ==========================================================================
   4. Copy Text to Clipboard Helper
   ========================================================================== */
function copyToClipboard(text, btnEl) {
  if (!navigator.clipboard) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  } else {
    navigator.clipboard.writeText(text);
  }

  if (btnEl) {
    const originalText = btnEl.textContent;
    btnEl.textContent = 'Copied! ✓';
    btnEl.style.backgroundColor = '#10b981';
    btnEl.style.borderColor = '#10b981';
    btnEl.style.color = '#030611';

    setTimeout(() => {
      btnEl.textContent = originalText;
      btnEl.style.backgroundColor = '';
      btnEl.style.borderColor = '';
      btnEl.style.color = '';
    }, 2000);
  }
}

/* ==========================================================================
   5. Kinetic "Entropy-to-Order" Letter Rearranging Animation
   ========================================================================== */
function initKineticTitleAnimation() {
  const title = document.getElementById('kineticHeroTitle');
  if (!title) return;

  const letters = title.querySelectorAll('.kinetic-letter');
  if (!letters.length) return;

  let isAnimating = false;

  function runEntropySequence() {
    if (isAnimating) return;
    isAnimating = true;

    // Phase 1: Scatter each letter into chaotic coordinates
    // Visible opacity so the user clearly witnesses the chaotic state before convergence
    letters.forEach((letter, index) => {
      const dirX = index % 2 === 0 ? -1 : 1;
      const dirY = index % 3 === 0 ? -1 : 1;
      const xOffset = dirX * (50 + Math.random() * 90);
      const yOffset = dirY * (55 + Math.random() * 85);
      const rotateDeg = (Math.random() - 0.5) * 65;
      const scaleVal = 0.6 + Math.random() * 0.7;

      letter.style.transition = 'none';
      letter.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0) rotate(${rotateDeg}deg) scale(${scaleVal})`;
      letter.style.opacity = '0.45';
      letter.style.filter = 'blur(6px)';
      letter.style.color = '#38bdf8'; // Soft cyber cyan during entropy
      letter.classList.remove('locked-in');
    });

    // Trigger reflow
    void title.offsetWidth;

    // Phase 2: Hold chaotic state for 220ms, then smoothly converge
    setTimeout(() => {
      letters.forEach((letter, index) => {
        const delay = index * 95; // Slower, rhythmic staggered arrival wave
        setTimeout(() => {
          letter.style.transition = 'transform 1.35s cubic-bezier(0.16, 1.25, 0.35, 1), opacity 1.1s ease, filter 1.1s ease, color 0.5s ease';
          letter.style.transform = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
          letter.style.opacity = '1';
          letter.style.filter = 'blur(0)';
          letter.style.color = '';
        }, delay);
      });

      // Phase 3: Emerald Lock-in Laser Pulse across letters
      const totalArrivalDuration = (letters.length * 95) + 1300;
      setTimeout(() => {
        letters.forEach((letter, index) => {
          setTimeout(() => {
            letter.classList.add('locked-in');
            setTimeout(() => {
              letter.classList.remove('locked-in');
            }, 650);
          }, index * 60);
        });

        setTimeout(() => {
          isAnimating = false;
        }, letters.length * 60 + 700);
      }, totalArrivalDuration);

    }, 220);
  }

  // Trigger on load
  runEntropySequence();

  // Click on title to re-trigger the assembly sequence anytime
  title.addEventListener('click', () => {
    runEntropySequence();
  });

  // Micro-interaction on individual letter hover
  letters.forEach(letter => {
    letter.addEventListener('mouseenter', () => {
      if (!isAnimating) {
        letter.style.transition = 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease, text-shadow 0.2s ease';
        letter.style.transform = 'translateY(-12px) scale(1.18)';
        letter.style.color = '#10b981';
        letter.style.textShadow = '0 0 16px rgba(16, 185, 129, 0.7)';
      }
    });

    letter.addEventListener('mouseleave', () => {
      if (!isAnimating) {
        letter.style.transition = 'transform 0.35s cubic-bezier(0.18, 1, 0.35, 1), color 0.3s ease, text-shadow 0.3s ease';
        letter.style.transform = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
        letter.style.color = '';
        letter.style.textShadow = '';
      }
    });
  });
}
