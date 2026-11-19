/**
 * MPHATHISI — Minimalist Fast Portal Engine
 * 1. Theme Switcher & Persistence (Dark / Light)
 * 2. Lightweight Ambient Particle Canvas (Auto-pauses when hidden)
 * 3. Crisp Page Transitions
 * 4. Copy-to-Clipboard Helper
 * 5. Kinetic Title Convergence Animation
 */

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  initThemeSystem();
  initAmbientParticles();
  initKineticTitleAnimation();
  initPageTransitions();
});

window.addEventListener('pageshow', () => {
  document.body.classList.remove('page-exiting');
});

/* ==========================================================================
   1. Theme System (Light / Dark Mode Switcher)
   ========================================================================== */
function initThemeSystem() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const html = document.documentElement;

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
   2. Lightweight Ambient Particle Canvas (Low-CPU, Pauses When Hidden)
   ========================================================================== */
function initAmbientParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let particles = [];
  let rafId = null;
  let isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const mouse = { x: -1000, y: -1000, radius: 120, radiusSq: 14400 };
  const connectDistSq = 12100; // 110^2

  const themeObserver = new MutationObserver(() => {
    isLight = document.documentElement.getAttribute('data-theme') === 'light';
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

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
      this.size = Math.random() * 1.6 + 0.9;
      this.vx = (Math.random() - 0.5) * 0.28;
      this.vy = (Math.random() - 0.5) * 0.28;
      this.density = (Math.random() * 10) + 6;
      this.isEmerald = Math.random() > 0.4;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.isEmerald
        ? (isLight ? 'rgba(5, 150, 105, 0.35)' : 'rgba(16, 185, 129, 0.32)')
        : (isLight ? 'rgba(2, 132, 199, 0.3)' : 'rgba(6, 182, 212, 0.28)');
      ctx.fill();
    }

    update() {
      this.baseX += this.vx;
      this.baseY += this.vy;

      if (this.baseX < 0 || this.baseX > width) this.vx *= -1;
      if (this.baseY < 0 || this.baseY > height) this.vy *= -1;

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < mouse.radiusSq && distSq > 0.01) {
        const distance = Math.sqrt(distSq);
        const force = (mouse.radius - distance) / mouse.radius;
        this.x -= (dx / distance) * force * this.density;
        this.y -= (dy / distance) * force * this.density;
      } else {
        this.x -= (this.x - this.baseX) * 0.04;
        this.y -= (this.y - this.baseY) * 0.04;
      }
    }
  }

  function createParticles() {
    particles = [];
    const maxCount = width < 768 ? 16 : 30;
    const count = Math.min(Math.floor((width * height) / 38000), maxCount);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const strokePrefix = isLight ? 'rgba(5, 150, 105, ' : 'rgba(16, 185, 129, ';
    ctx.lineWidth = 0.6;

    for (let a = 0; a < particles.length; a++) {
      const pa = particles[a];
      for (let b = a + 1; b < particles.length; b++) {
        const pb = particles[b];
        const dx = pa.x - pb.x;
        const dy = pa.y - pb.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < connectDistSq) {
          const opacity = (1 - Math.sqrt(distSq) / 110) * 0.12;
          ctx.strokeStyle = strokePrefix + opacity.toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    if (document.hidden) {
      rafId = null;
      return;
    }
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connectParticles();
    rafId = requestAnimationFrame(animate);
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !rafId) {
      animate();
    }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  resize();
  animate();
}

/* ==========================================================================
   3. Crisp Page Transitions (Ultra-Snappy)
   ========================================================================== */
function initPageTransitions() {
  const internalLinks = document.querySelectorAll('a[href]');

  internalLinks.forEach(link => {
    const href = link.getAttribute('href');

    if (
      href &&
      !href.startsWith('http') &&
      !href.startsWith('#') &&
      !href.startsWith('mailto:') &&
      !link.hasAttribute('target') &&
      !link.hasAttribute('download') &&
      (href.endsWith('.html') || href === '/' || !href.includes('.'))
    ) {
      link.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        document.body.classList.add('page-exiting');
        setTimeout(() => {
          window.location.href = href;
        }, 90);
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
    btnEl.textContent = 'Copied ✓';
    btnEl.style.backgroundColor = '#10b981';
    btnEl.style.borderColor = '#10b981';
    btnEl.style.color = '#030611';

    setTimeout(() => {
      btnEl.textContent = originalText;
      btnEl.style.backgroundColor = '';
      btnEl.style.borderColor = '';
      btnEl.style.color = '';
    }, 1800);
  }
}

/* ==========================================================================
   5. Kinetic Letter Convergence Animation
   ========================================================================== */
function initKineticTitleAnimation() {
  const title = document.getElementById('kineticHeroTitle');
  if (!title) return;

  const letters = title.querySelectorAll('.kinetic-letter');
  if (!letters.length) return;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let isAnimating = false;

  function runEntropySequence() {
    if (isAnimating) return;
    isAnimating = true;

    letters.forEach((letter, index) => {
      const dirX = index % 2 === 0 ? -1 : 1;
      const dirY = index % 3 === 0 ? -1 : 1;
      const xOffset = dirX * (32 + Math.random() * 58);
      const yOffset = dirY * (34 + Math.random() * 56);
      const rotateDeg = (Math.random() - 0.5) * 42;
      const scaleVal = 0.72 + Math.random() * 0.48;

      letter.style.transition = 'none';
      letter.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0) rotate(${rotateDeg}deg) scale(${scaleVal})`;
      letter.style.opacity = '0.45';
      letter.style.filter = 'blur(4px)';
      letter.style.color = '#38bdf8';
      letter.classList.remove('locked-in');
    });

    void title.offsetWidth;

    setTimeout(() => {
      letters.forEach((letter, index) => {
        const delay = index * 65;
        setTimeout(() => {
          letter.style.transition = 'transform 0.9s cubic-bezier(0.16, 1.18, 0.35, 1), opacity 0.75s ease, filter 0.75s ease, color 0.4s ease';
          letter.style.transform = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
          letter.style.opacity = '1';
          letter.style.filter = 'blur(0)';
          letter.style.color = '';
        }, delay);
      });

      const totalArrivalDuration = (letters.length * 65) + 820;
      setTimeout(() => {
        letters.forEach((letter, index) => {
          setTimeout(() => {
            letter.classList.add('locked-in');
            setTimeout(() => {
              letter.classList.remove('locked-in');
            }, 450);
          }, index * 45);
        });

        setTimeout(() => {
          isAnimating = false;
        }, letters.length * 45 + 500);
      }, totalArrivalDuration);
    }, 120);
  }

  runEntropySequence();

  title.addEventListener('click', () => {
    runEntropySequence();
  });

  letters.forEach(letter => {
    letter.addEventListener('mouseenter', () => {
      if (!isAnimating) {
        letter.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease, text-shadow 0.2s ease';
        letter.style.transform = 'translateY(-10px) scale(1.14)';
        letter.style.color = '#10b981';
        letter.style.textShadow = '0 0 14px rgba(16, 185, 129, 0.65)';
      }
    });

    letter.addEventListener('mouseleave', () => {
      if (!isAnimating) {
        letter.style.transition = 'transform 0.3s cubic-bezier(0.18, 1, 0.35, 1), color 0.25s ease, text-shadow 0.25s ease';
        letter.style.transform = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
        letter.style.color = '';
        letter.style.textShadow = '';
      }
    });
  });
}
