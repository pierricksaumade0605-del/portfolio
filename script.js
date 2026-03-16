/* =============================================
   PORTFOLIO SCRIPT — Technicien Supérieur Réseaux
   ============================================= */

/* ==============================
   1. NETWORK CANVAS ANIMATION
   ============================== */
(function () {
  const canvas = document.getElementById('networkCanvas');
  const ctx = canvas.getContext('2d');

  let W, H, nodes = [], mouse = { x: -9999, y: -9999 };
  const NODE_COUNT = 70;
  const MAX_DIST = 140;
  const NODE_COLOR = '0, 229, 255';
  const NODE_SECONDARY = '41, 121, 255';

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2.5 + 1,
        pulse: Math.random() * Math.PI * 2,
        color: Math.random() > 0.5 ? NODE_COLOR : NODE_SECONDARY,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update & draw nodes
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      n.pulse += 0.02;

      // Bounce
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      // Mouse attraction
      const dx = mouse.x - n.x;
      const dy = mouse.y - n.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        n.x += dx * 0.008;
        n.y += dy * 0.008;
      }

      const alpha = 0.5 + 0.3 * Math.sin(n.pulse);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${n.color}, ${alpha})`;
      ctx.shadowColor = `rgba(${n.color}, 0.5)`;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createNodes(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  resize();
  createNodes();
  draw();
})();


/* ==============================
   2. TYPEWRITER EFFECT
   ============================== */
(function () {
  const phrases = [
    'Technicien Supérieur Systèmes & Réseaux',
    'Administrateur Réseau',
    'Administrateur Linux & Windows Server',
    'Spécialiste Virtualisation',
  ];
  let pi = 0, ci = 0, deleting = false;
  const el = document.getElementById('typedText');
  if (!el) return;

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ci + 1);
      ci++;
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 45 : 75);
  }
  setTimeout(type, 800);
})();


/* ==============================
   3. SCROLL REVEAL
   ============================== */
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ==============================
   4. SKILL BAR ANIMATION
   ============================== */
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          const w = bar.getAttribute('data-width') || '0';
          bar.style.width = w + '%';
        });
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-card').forEach(card => observer.observe(card));
})();


/* ==============================
   5. STAT COUNTER ANIMATION
   ============================== */
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.stat-value[data-target]').forEach(el => {
          const target = parseInt(el.getAttribute('data-target'));
          let current = 0;
          const step = Math.ceil(target / 40);
          const interval = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current + (target > 10 ? '' : '+');
            if (current >= target) {
              el.textContent = target + '+';
              clearInterval(interval);
            }
          }, 40);
        });
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) observer.observe(heroStats);
})();


/* ==============================
   6. TIMELINE REVEAL
   ============================== */
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(el);
  });
})();


/* ==============================
   7. TAB SWITCHING (Parcours)
   ============================== */
function switchTab(tabId) {
  // Deactivate all
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  // Activate selected
  const content = document.getElementById(tabId);
  if (content) {
    content.classList.add('active');
    // Re-trigger timeline animations
    content.querySelectorAll('.timeline-item').forEach((el, i) => {
      el.classList.remove('visible');
      el.style.transitionDelay = `${i * 0.1}s`;
      setTimeout(() => el.classList.add('visible'), 50);
    });
  }

  // Activate button
  const btn = [...document.querySelectorAll('.tab-btn')]
    .find(b => b.getAttribute('onclick')?.includes(tabId));
  if (btn) btn.classList.add('active');
}


/* ==============================
   8. NAVBAR SCROLL + ACTIVE LINK
   ============================== */
(function () {
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    // Navbar shadow
    if (window.scrollY > 20) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Active nav link
    if (links.length > 0) {
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
      });

      // Only remove active from hash links
      links.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + current) a.classList.add('active');
      });
    }
  });
})();


/* ==============================
   9. MOBILE MENU
   ============================== */
function toggleMenu() {
  const nav = document.getElementById('navLinks');
  const ham = document.getElementById('hamburger');
  nav.classList.toggle('open');
  ham.classList.toggle('open');
}

// Close menu on link click
document.querySelectorAll('#navLinks a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
  });
});


/* ==============================
   10. CONTACT FORM
   ============================== */
function sendMessage(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const txt = document.getElementById('btnText');

  const fname = document.getElementById('fname').value;
  const lname = document.getElementById('lname').value;
  const email = document.getElementById('email').value;
  const sujet = document.getElementById('sujet').value;
  const message = document.getElementById('message').value;

  btn.disabled = true;
  txt.textContent = '⏳ Envoi en cours...';

  // Use FormData to avoid CORS preflight (no OPTIONS request needed)
  const formData = new FormData();
  formData.append('Prenom', fname);
  formData.append('Nom', lname);
  formData.append('Email', email);
  formData.append('Sujet', sujet);
  formData.append('Message', message);

  fetch("https://formsubmit.co/ajax/pierrick.saumade0605@gmail.com", {
    method: "POST",
    headers: {
      'Accept': 'application/json'
    },
    body: formData
  })
    .then(response => {
      console.log('FormSubmit status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('FormSubmit response:', data);
      if (data.success === "true" || data.success === true) {
        txt.textContent = '✅ Message envoyé !';
        btn.style.background = 'linear-gradient(135deg, #00e676, #00b0ff)';
        setTimeout(() => {
          document.getElementById('contactForm').reset();
          txt.textContent = '✉ Envoyer le message';
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      } else {
        // FormSubmit may ask for email activation on first use
        txt.textContent = '⚠️ Vérifiez votre boîte mail pour activer FormSubmit';
        console.warn('FormSubmit réponse inattendue:', data);
        setTimeout(() => {
          txt.textContent = '✉ Envoyer le message';
          btn.disabled = false;
        }, 5000);
      }
    })
    .catch(error => {
      console.error('Erreur formulaire:', error);
      txt.textContent = '❌ Erreur d\'envoi';
      setTimeout(() => {
        txt.textContent = '✉ Envoyer le message';
        btn.disabled = false;
      }, 3000);
    });
}


/* ==============================
   11. SMOOTH HOVER GLOW on cards
   ============================== */
document.querySelectorAll('.project-card, .skill-card, .timeline-card').forEach(card => {
  card.addEventListener('mousemove', function (e) {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    this.style.setProperty('--mouse-x', x + '%');
    this.style.setProperty('--mouse-y', y + '%');
  });
});


/* ==============================
   12. INIT LOG
   ============================== */
console.log(
  '%c AM/SYS Portfolio 🌐 ',
  'background:#00e5ff;color:#050d1a;font-size:14px;font-weight:bold;padding:6px 12px;border-radius:4px;'
);
