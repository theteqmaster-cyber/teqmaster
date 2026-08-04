/**
 * mphathisi.com — The Teq-master Identity Hub Engine
 * 1. Interactive Antigravity Mouse Particle Physics
 * 2. Light / Dark Theme Switcher & Persistence
 * 3. Category Filter & Copy-to-Clipboard Helpers
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  // Initialize Theme System
  initThemeSystem();

  // Initialize Antigravity Mouse Particle Animation
  initAntigravityParticles();

  // Category Filtering for Projects Grid
  const tabButtons = document.querySelectorAll('#projectCategoryTabs .tab-btn');
  const projectCards = document.querySelectorAll('#projectsGrid .project-card');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const selectedCategory = button.getAttribute('data-category');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
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
   2. Interactive Antigravity Mouse Particle Canvas Animation
   ========================================================================== */
function initAntigravityParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const mouse = { x: -1000, y: -1000, radius: 160 };

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
      this.size = Math.random() * 2.5 + 1.2;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.density = (Math.random() * 20) + 10;
      this.colorType = Math.random() > 0.5 ? 1 : 2;
    }

    draw() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.colorType === 1
        ? (isLight ? 'rgba(14, 116, 144, 0.7)' : 'rgba(6, 182, 212, 0.7)')
        : (isLight ? 'rgba(109, 40, 217, 0.7)' : 'rgba(167, 139, 250, 0.7)');
      ctx.fill();
    }

    update() {
      // Natural ambient motion
      this.baseX += this.vx;
      this.baseY += this.vy;

      if (this.baseX < 0 || this.baseX > width) this.vx *= -1;
      if (this.baseY < 0 || this.baseY > height) this.vy *= -1;

      // Mouse Antigravity Interactive Physics
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
          this.x -= dx * 0.05;
        }
        if (this.y !== this.baseY) {
          const dy = this.y - this.baseY;
          this.y -= dy * 0.05;
        }
      }
    }
  }

  function createParticles() {
    particles = [];
    const particleCount = Math.floor((width * height) / 18000);
    for (let i = 0; i < Math.min(particleCount, 80); i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const strokeColor = isLight ? 'rgba(14, 116, 144, ' : 'rgba(6, 182, 212, ';

    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          const opacity = (1 - (distance / 120)) * 0.22;
          ctx.strokeStyle = strokeColor + opacity + ')';
          ctx.lineWidth = 0.8;
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
    particles.forEach(particle => {
      particle.update();
      particle.draw();
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
   3. Copy Text to Clipboard Helper
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
    btnEl.style.color = '#34d399';
    btnEl.style.borderColor = '#34d399';

    setTimeout(() => {
      btnEl.textContent = originalText;
      btnEl.style.color = '';
      btnEl.style.borderColor = '';
    }, 2000);
  }
}
