/* ===== Theme Toggle ===== */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.documentElement;

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

/* ===== Mobile Navigation ===== */
const hamburger = document.getElementById('nav-hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

/* ===== Navbar Scroll Effect ===== */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== Active Nav Link on Scroll ===== */
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

window.addEventListener('scroll', highlightNav);

/* ===== Typing Animation ===== */
const typedEl = document.getElementById('typed-text');
const roles = [
  'DWH/BI Developer',
  'Data Engineer',
  'Automation Builder',
  'Problem Solver'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const current = roles[roleIndex];

  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === current.length) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 500;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();

/* ===== Scroll Reveal ===== */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

/* ===== Counter Animation ===== */
const statNumbers = document.querySelectorAll('.stat-number');
let countersStarted = false;

function animateCounters() {
  if (countersStarted) return;
  const heroStats = document.querySelector('.hero-stats');
  if (!heroStats) return;

  const rect = heroStats.getBoundingClientRect();
  if (rect.top >= window.innerHeight) return;

  countersStarted = true;
  statNumbers.forEach(stat => {
    const target = parseFloat(stat.dataset.target);
    const isDecimal = target % 1 !== 0;
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      stat.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);
      if (progress < 1) requestAnimationFrame(update);
      else stat.textContent = isDecimal ? target.toFixed(2) : target;
    }

    requestAnimationFrame(update);
  });
}

window.addEventListener('scroll', animateCounters);
animateCounters();

/* ===== Contact Form ===== */
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  const mailtoLink = `mailto:tamal3801das@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\n${message}`
  )}`;

  window.location.href = mailtoLink;
  contactForm.reset();
});

/* ===== Geometric Canvas Background ===== */
(function initGeoCanvas() {
  const canvas = document.getElementById('geo-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(Math.floor(window.innerWidth / 15), 80);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        sides: Math.floor(Math.random() * 3) + 3
      });
    }
  }

  function drawPolygon(x, y, size, sides) {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
      const px = x + size * Math.cos(angle);
      const py = y + size * Math.sin(angle);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }

  function getAccentColor() {
    const theme = html.getAttribute('data-theme');
    return theme === 'dark' ? '99, 102, 241' : '79, 70, 229';
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rgb = getAccentColor();

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.strokeStyle = `rgba(${rgb}, 0.3)`;
      ctx.lineWidth = 0.8;
      drawPolygon(p.x, p.y, p.size * 4, p.sides);

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${rgb}, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    });

    animationId = requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  themeToggle.addEventListener('click', () => {
    /* color updates automatically via getAccentColor */
  });
})();

/* ===== Smooth anchor offset fix ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
