/* ─── main.js ─── */

// ── Year ──
document.getElementById('year').textContent = new Date().getFullYear();

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Hamburger ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navbar.classList.toggle('menu-open', isOpen);
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navbar.classList.remove('menu-open');
  });
});

// ── Active nav link on scroll ──
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');
const observerNav = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navItems.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => observerNav.observe(s));

// ── Reveal on scroll ──
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      setTimeout(() => {
        e.target.classList.add('revealed');
      }, 1000);
      observer.unobserve(e.target);
    }
  });
}, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// ── Typed text ──
const phrases = [
  'Applied AI Engineer',
  'LLM & RAG Architect',
  'AI Backend Developer',
  'Intelligent Systems Builder'
];
let pi = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
  if (!typedEl) return;
  const word = phrases[pi];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typedEl.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 50 : 80);
}
type();

// ── Particle canvas ──
(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  let mouse = { x: -1000, y: -1000 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    // Update CSS variables for the grid background spotlight
    document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
    document.documentElement.style.setProperty('--my', `${e.clientY + window.scrollY}px`);
  });
  window.addEventListener('mouseout', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  const COLORS = ['#14b8a6', '#10b981', '#f59e0b', '#0ea5e9']; // Teal, Emerald, Amber, Sky

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      baseVx: (Math.random() - 0.5) * 0.8,
      baseVy: (Math.random() - 0.5) * 0.8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      // Mouse repel & interact logic
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 180) {
        const force = (180 - dist) / 180;
        p.vx = p.baseVx + (dx / dist) * force * 1.5;
        p.vy = p.baseVy + (dy / dist) * force * 1.5;
      } else {
        p.vx = p.vx * 0.95 + p.baseVx * 0.05;
        p.vy = p.vy * 0.95 + p.baseVy * 0.05;
      }

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.rect(p.x, p.y, p.r * 2, p.r * 2); // squares instead of circles
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      // Constellation line to mouse
      if (dist < 200) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(20, 184, 166, ${0.4 * (1 - dist / 200)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Draw connecting lines between particles
    ctx.globalAlpha = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(20, 184, 166, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── Project filter ──
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const cats = (card.dataset.category || '').split(' ');
      const show = filter === 'all' || cats.includes(filter);
      card.classList.toggle('hidden', !show);
    });
  });
});

// ── Touch / tap support for project card overlay on mobile ──
// On touch devices hover doesn't fire, so we toggle a CSS class on tap.
if (window.matchMedia('(pointer: coarse)').matches) {
  projectCards.forEach(card => {
    card.addEventListener('click', e => {
      // If the user tapped a link/button inside the overlay, let it do its thing
      if (e.target.closest('a, button')) return;

      const isOpen = card.classList.contains('touch-hover');
      // Close all others first
      projectCards.forEach(c => c.classList.remove('touch-hover'));
      if (!isOpen) card.classList.add('touch-hover');
    });
  });

  // Tap outside to close
  document.addEventListener('click', e => {
    if (!e.target.closest('.project-card')) {
      projectCards.forEach(c => c.classList.remove('touch-hover'));
    }
  });
}

// ── Contact form ──
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

form && form.addEventListener('submit', async e => {
  e.preventDefault();
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  // Use fetch to post the form data without refreshing the page
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      submitBtn.textContent = '✓ Message Sent!';
      submitBtn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
      form.reset();
    } else {
      submitBtn.textContent = 'Error Sending';
      submitBtn.style.background = 'red';
    }
  } catch (error) {
    submitBtn.textContent = 'Error Sending';
    submitBtn.style.background = 'red';
  }

  setTimeout(() => {
    submitBtn.innerHTML = 'Send Message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    submitBtn.style.background = '';
    submitBtn.disabled = false;
  }, 4000);
});

// ── Smooth scroll ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Tilt effect on glass cards ──
if (window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll('.glass-card:not(#contact-form):not(.project-card)').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-3px) perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
