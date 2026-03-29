/* ============================================
   ASTROPHAGE COMMAND — Immersive Engine
   Deep Space Atmosphere & Interactions
   ============================================ */

// ─── Multi-Layer Starfield + Nebula + Astrophage Particles ───
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let stars = [];
  let astrophageParticles = [];
  let shootingStars = [];
  let mouseX = 0, mouseY = 0;
  let time = 0;

  const STAR_COUNT = 350;
  const ASTROPHAGE_COUNT = 45;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const depth = Math.random(); // 0=far, 1=near
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseX: Math.random() * canvas.width,
        baseY: Math.random() * canvas.height,
        radius: depth * 1.8 + 0.2,
        alpha: depth * 0.6 + 0.2,
        depth: depth,
        twinkleSpeed: Math.random() * 0.03 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.88
          ? [173, 198, 255] // nebula blue
          : Math.random() > 0.92
            ? [110, 255, 192] // astrophage green
            : [249, 250, 251],
      });
    }
  }

  function createAstrophage() {
    astrophageParticles = [];
    for (let i = 0; i < ASTROPHAGE_COUNT; i++) {
      astrophageParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1.5,
        alpha: Math.random() * 0.4 + 0.1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.15 - 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        glowSize: Math.random() * 20 + 10,
      });
    }
  }

  function createShootingStar() {
    shootingStars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      length: Math.random() * 120 + 60,
      speed: Math.random() * 10 + 6,
      angle: (Math.random() * 25 + 15) * (Math.PI / 180),
      alpha: 1,
      decay: Math.random() * 0.015 + 0.008,
      width: Math.random() * 1.5 + 0.8,
    });
  }

  // Mouse parallax tracking
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function drawNebulaLayers() {
    // Deep nebula cloud 1 - green
    const n1x = canvas.width * 0.3 + mouseX * 5;
    const n1y = canvas.height * 0.4 + mouseY * 5;
    const nebula1 = ctx.createRadialGradient(n1x, n1y, 0, n1x, n1y, canvas.width * 0.55);
    nebula1.addColorStop(0, 'rgba(0, 229, 160, 0.035)');
    nebula1.addColorStop(0.3, 'rgba(0, 229, 160, 0.015)');
    nebula1.addColorStop(0.6, 'rgba(59, 130, 246, 0.01)');
    nebula1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebula1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Deep nebula cloud 2 - blue
    const n2x = canvas.width * 0.75 + mouseX * 8;
    const n2y = canvas.height * 0.25 + mouseY * 8;
    const nebula2 = ctx.createRadialGradient(n2x, n2y, 0, n2x, n2y, canvas.width * 0.45);
    nebula2.addColorStop(0, 'rgba(59, 130, 246, 0.03)');
    nebula2.addColorStop(0.5, 'rgba(110, 50, 200, 0.015)');
    nebula2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebula2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle warm glow - represents distant Tau Ceti star
    const tauX = canvas.width * 0.85 + mouseX * 3;
    const tauY = canvas.height * 0.15 + mouseY * 3;
    const tauGlow = ctx.createRadialGradient(tauX, tauY, 0, tauX, tauY, 200);
    tauGlow.addColorStop(0, 'rgba(255, 200, 100, 0.06)');
    tauGlow.addColorStop(0.5, 'rgba(255, 150, 50, 0.02)');
    tauGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = tauGlow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 1;

    // Base gradient
    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, '#040610');
    bg.addColorStop(0.3, '#060A16');
    bg.addColorStop(0.7, '#0A0E1A');
    bg.addColorStop(1, '#0F131F');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Nebula layers with parallax
    drawNebulaLayers();

    // Stars with parallax depth
    stars.forEach(star => {
      const parallaxX = mouseX * star.depth * 15;
      const parallaxY = mouseY * star.depth * 15;
      const x = star.baseX + parallaxX;
      const y = star.baseY + parallaxY;

      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
      const alpha = star.alpha * (0.5 + 0.5 * twinkle);

      ctx.beginPath();
      ctx.arc(x, y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${star.color[0]}, ${star.color[1]}, ${star.color[2]}, ${alpha.toFixed(3)})`;
      ctx.fill();

      // Bright stars get a soft glow
      if (star.radius > 1.4 && alpha > 0.5) {
        ctx.beginPath();
        ctx.arc(x, y, star.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color[0]}, ${star.color[1]}, ${star.color[2]}, ${(alpha * 0.1).toFixed(3)})`;
        ctx.fill();
      }
    });

    // Astrophage particles — floating, glowing, alien organisms
    astrophageParticles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += p.pulseSpeed;

      // Wrap around
      if (p.x < -20) p.x = canvas.width + 20;
      if (p.x > canvas.width + 20) p.x = -20;
      if (p.y < -20) p.y = canvas.height + 20;
      if (p.y > canvas.height + 20) p.y = -20;

      const pulseScale = 0.7 + 0.3 * Math.sin(p.pulse);
      const currentAlpha = p.alpha * pulseScale;
      const currentRadius = p.radius * (0.8 + 0.2 * Math.sin(p.pulse));

      // Outer glow
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glowSize * pulseScale);
      glow.addColorStop(0, `rgba(0, 229, 160, ${(currentAlpha * 0.3).toFixed(3)})`);
      glow.addColorStop(0.4, `rgba(0, 229, 160, ${(currentAlpha * 0.08).toFixed(3)})`);
      glow.addColorStop(1, 'rgba(0, 229, 160, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(p.x - p.glowSize, p.y - p.glowSize, p.glowSize * 2, p.glowSize * 2);

      // Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(110, 255, 192, ${(currentAlpha * 0.9).toFixed(3)})`;
      ctx.fill();

      // Inner bright core
      ctx.beginPath();
      ctx.arc(p.x, p.y, currentRadius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 255, 230, ${(currentAlpha * 0.7).toFixed(3)})`;
      ctx.fill();
    });

    // Shooting stars
    shootingStars = shootingStars.filter(s => s.alpha > 0.01);
    shootingStars.forEach(s => {
      const tailX = s.x - Math.cos(s.angle) * s.length;
      const tailY = s.y - Math.sin(s.angle) * s.length;
      const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      grad.addColorStop(0, `rgba(110, 255, 192, 0)`);
      grad.addColorStop(0.7, `rgba(110, 255, 192, ${(s.alpha * 0.5).toFixed(3)})`);
      grad.addColorStop(1, `rgba(200, 255, 240, ${s.alpha.toFixed(3)})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = s.width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();

      // Bright head
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${(s.alpha * 0.8).toFixed(3)})`;
      ctx.fill();

      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.alpha -= s.decay;
    });

    requestAnimationFrame(draw);
  }

  resize();
  createStars();
  createAstrophage();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createStars();
    createAstrophage();
  });

  // Shooting stars at random intervals
  setInterval(createShootingStar, 3500);
  setTimeout(createShootingStar, 600);
  setTimeout(createShootingStar, 1800);
})();

// ─── Floating Astrophage Particles (for section backgrounds) ───
(function initSectionParticles() {
  document.querySelectorAll('.particles-bg').forEach(container => {
    const canvas = document.createElement('canvas');
    canvas.className = 'section-particles';
    container.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let particles = [];
    const COUNT = 25;

    function resize() {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    }

    function create() {
      particles = [];
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 2 + 0.5,
          sx: (Math.random() - 0.5) * 0.2,
          sy: (Math.random() - 0.5) * 0.15,
          alpha: Math.random() * 0.3 + 0.05,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t++;
      particles.forEach(p => {
        p.x += p.sx;
        p.y += p.sy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const a = p.alpha * (0.6 + 0.4 * Math.sin(t * 0.02 + p.pulse));

        // Glow
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
        g.addColorStop(0, `rgba(0, 229, 160, ${(a * 0.2).toFixed(3)})`);
        g.addColorStop(1, `rgba(0, 229, 160, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(p.x - p.r * 8, p.y - p.r * 8, p.r * 16, p.r * 16);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(110, 255, 192, ${a.toFixed(3)})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    resize();
    create();
    draw();
    window.addEventListener('resize', () => { resize(); create(); });
  });
})();

// ─── HUD Scan Line Animation ───
(function initHUDScanline() {
  const scanline = document.querySelector('.hud-scanline');
  if (!scanline) return;

  function animate() {
    scanline.style.top = '0%';
    scanline.style.opacity = '0.3';
    scanline.animate([
      { top: '0%', opacity: 0.3 },
      { top: '100%', opacity: 0 },
    ], {
      duration: 4000,
      iterations: Infinity,
    });
  }
  animate();
})();

// ─── Parallax Scroll for Sections ───
(function initParallaxScroll() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
      el.style.transform = `translateY(${-offset}px)`;
    });
  }, { passive: true });
})();

// ─── Scroll Animations (Intersection Observer) ───
(function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
})();

// ─── Active Nav Link ───
(function initActiveNav() {
  const sections = document.querySelectorAll('section, header');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateActive() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();

// ─── Nav Background Intensity on Scroll ───
(function initNavScroll() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    const opacity = Math.min(0.95, 0.6 + window.scrollY / 500);
    nav.style.background = `rgba(10, 14, 26, ${opacity})`;
    nav.style.borderBottomColor = window.scrollY > 60
      ? 'rgba(0, 229, 160, 0.1)'
      : 'rgba(59, 74, 65, 0.25)';
  }, { passive: true });
})();

// ─── Evaluation Bar Animation ───
(function initEvalBars() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.eval-fill').forEach((fill, i) => {
            const width = fill.getAttribute('data-width');
            setTimeout(() => { fill.style.width = width + '%'; }, 200 + i * 150);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  const evalPanel = document.querySelector('.eval-panel');
  if (evalPanel) observer.observe(evalPanel);
})();

// ─── Copy Code ───
function copyCode() {
  const block = document.getElementById('codeBlock');
  const text = block.innerText.replace('Copy', '').trim();
  navigator.clipboard.writeText(text).then(() => {
    const btn = block.querySelector('.copy-btn');
    btn.textContent = '✓ Copied';
    setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
  });
}

function copyInference() {
  const block = document.getElementById('inferenceCode');
  const text = block.innerText.replace('Copy', '').trim();
  navigator.clipboard.writeText(text).then(() => {
    const btn = block.querySelector('.copy-btn');
    btn.textContent = '✓ Copied';
    setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
  });
}

// ─── Smooth Scroll ───
document.querySelectorAll('.nav-links a, .btn-primary[href^="#"], .btn-ghost[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── Typed Text Effect for Hero ───
(function initTypedText() {
  const el = document.querySelector('.typed-text');
  if (!el) return;

  const phrases = [
    'Calm reasoning under uncertainty.',
    'Science-literate. Honest. Supportive.',
    'Trained on original instruction data.',
    'Inspired by Project Hail Mary.',
    '3 billion parameters. One clear mission.',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let timer;

  function type() {
    const current = phrases[phraseIdx];

    if (!isDeleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        timer = setTimeout(type, 2500);
        return;
      }
      timer = setTimeout(type, 50 + Math.random() * 30);
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        timer = setTimeout(type, 500);
        return;
      }
      timer = setTimeout(type, 25);
    }
  }

  setTimeout(type, 1500);
})();

// ─── Mouse Glow Follow (subtle ambient) ───
(function initMouseGlow() {
  const glow = document.querySelector('.mouse-glow');
  if (!glow) return;

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();

console.log(`
  ☆ HAIL MARY DISTILLED — Mission Control
  ════════════════════════════════════════
  "I am going to figure this out."
  — Dr. Ryland Grace
  ════════════════════════════════════════
  github.com/Chandan062311/Hail-Mary
`);

// ═══════════════════════════════════════
// ROCKY — ERIDIAN COMPANION GUIDE
// "Good good good!" 
// ═══════════════════════════════════════
(function initRocky() {
  const rocky = document.getElementById('rocky');
  const speech = document.getElementById('rockySpeech');
  const text = document.getElementById('rockyText');
  const body = document.getElementById('rockyBody');
  if (!rocky || !speech || !text || !body) return;

  // Rocky's contextual dialogue for each section
  // He speaks in his characteristic enthusiastic, broken English
  const sectionDialogue = {
    hero: [
      '♪♫ Welcome, friend! I am Rocky. I guide you through this mission!',
      '♪♫ Amaze! Beautiful project. Human Grace would be proud!',
      '♪♫ This is spacecraft mission control. So much to explore!',
      '♪♫ Good good good! You found our project. Click me for more!',
    ],
    overview: [
      '♪♫ Amaze! Three mission components. Very organized, friend!',
      '♪♫ Custom dataset! Like collecting Astrophage samples. Very careful work!',
      '♪♫ LoRA adapter is like... small modification, big improvement! Smart!',
      '♪♫ Good good good! All parts work together. Like Eridian engineering!',
    ],
    pipeline: [
      '♪♫ Data pipeline! Reminds me of Astrophage energy flow. Beautiful!',
      '♪♫ Five stages! From seed data to deployed model. Very thorough!',
      '♪♫ Synthetic expansion! Using teacher model to make more data. Clever clever!',
      '♪♫ This pipeline is like building a ship. Step by step. Careful!',
    ],
    training: [
      '♪♫ AMAZE! This is the brain of the project! LoRA fine-tuning!',
      '♪♫ QLoRA! Only 0.5% parameters trainable. Efficient like Eridian tech!',
      '♪♫ Seven attention layers modified. q_proj, k_proj... good choices, friend!',
      '♪♫ Rank 16, Alpha 16. I study these numbers. Very balanced!',
      '♪♫ Training on free Colab GPU! Maximum science, minimum resources!',
    ],
    repo: [
      '♪♫ Ship computer! All files organized. I approve! Good good good!',
      '♪♫ Eight automation scripts! Like having eight robot helpers!',
      '♪♫ validate_dataset.py — checking data integrity. Very responsible!',
      '♪♫ So many Python scripts! Each one has purpose. Impressive!',
    ],
    assets: [
      '♪♫ Four live assets! All green status! Mission successful!',
      '♪♫ Published on HuggingFace! The whole galaxy can use this model!',
      '♪♫ GitHub, HuggingFace, Dataset, Model — all systems operational!',
      '♪♫ Quick start code ready! Any human can use this. Amaze!',
    ],
  };

  // Extra click responses (random fun reactions)
  const clickResponses = [
    '♪♫ You click Rocky! I am happy! Good good good!',
    '♪♫ Question question! What you curious about, friend?',
    '♪♫ I am Eridian. We build things. Like this model. Amaze!',
    '♪♫ Want to know secret? Keep scrolling. More amaze below!',
    '♪♫ Rocky fact: Eridians have five hands. Good for typing code!',
    '♪♫ I help Grace. Grace help me. We help you. Teamwork!',
    '♪♫ ♪♫♪♫♪♫ *happy musical notes*',
    '♪♫ Xenonite is strong. But this codebase is stronger!',
    '♪♫ 3 billion parameters! In Eridian numbers that is... still very big!',
    '♪♫ Scroll more, friend! Every section has new data to discover!',
  ];

  let currentSection = 'hero';
  let lastSectionChange = 0;
  let speechTimeout = null;
  let isVisible = false;
  let dialogueIndex = {};

  // Initialize dialogue counters
  Object.keys(sectionDialogue).forEach(key => { dialogueIndex[key] = 0; });

  // Show speech bubble
  function showSpeech(msg, duration = 5000) {
    text.textContent = msg;
    speech.classList.add('visible');
    isVisible = true;

    // Musical note particles
    spawnNotes();

    // Excited animation
    body.classList.remove('excited');
    void body.offsetWidth; // trigger reflow
    body.classList.add('excited');
    setTimeout(() => body.classList.remove('excited'), 700);

    clearTimeout(speechTimeout);
    speechTimeout = setTimeout(() => {
      speech.classList.remove('visible');
      isVisible = false;
    }, duration);
  }

  // Spawn musical notes around Rocky
  function spawnNotes() {
    const notes = ['♪', '♫', '♬', '♩'];
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const note = document.createElement('span');
        note.className = 'rocky-note';
        note.textContent = notes[Math.floor(Math.random() * notes.length)];
        note.style.left = (Math.random() * 40 + 15) + 'px';
        note.style.top = (Math.random() * 20) + 'px';
        body.appendChild(note);
        setTimeout(() => note.remove(), 1600);
      }, i * 200);
    }
  }

  // Get contextual dialogue for current section
  function getSectionDialogue(section) {
    const pool = sectionDialogue[section];
    if (!pool) return sectionDialogue.hero[0];
    const idx = dialogueIndex[section] || 0;
    dialogueIndex[section] = (idx + 1) % pool.length;
    return pool[idx];
  }

  // Detect current section based on scroll position
  function detectSection() {
    const sections = ['hero', 'overview', 'pipeline', 'training', 'repo', 'assets'];
    let detected = 'hero';

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.5 && rect.bottom > 0) {
          detected = id;
        }
      }
    });

    return detected;
  }

  // Section change handler
  function onSectionChange(newSection) {
    if (newSection === currentSection) return;
    
    const now = Date.now();
    if (now - lastSectionChange < 2000) return; // Debounce
    
    currentSection = newSection;
    lastSectionChange = now;
    
    // Show contextual dialogue after a short delay
    setTimeout(() => {
      showSpeech(getSectionDialogue(newSection), 5500);
    }, 800);
  }

  // Scroll listener for section detection
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        const section = detectSection();
        onSectionChange(section);
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // Click handler — random Rocky reactions
  rocky.addEventListener('click', (e) => {
    e.stopPropagation();
    const responses = [...clickResponses, ...sectionDialogue[currentSection] || []];
    const randomMsg = responses[Math.floor(Math.random() * responses.length)];
    showSpeech(randomMsg, 4500);
  });

  // Initial greeting after page load
  setTimeout(() => {
    showSpeech('♪♫ Welcome, friend! I am Rocky. I guide you through this mission! Click me anytime!', 6000);
  }, 2500);

  // Periodic idle remarks if user hasn't scrolled
  let lastInteraction = Date.now();
  
  window.addEventListener('scroll', () => { lastInteraction = Date.now(); }, { passive: true });
  
  setInterval(() => {
    const idle = Date.now() - lastInteraction;
    if (idle > 25000 && !isVisible) {
      const idleMessages = [
        '♪♫ Still here, friend? Scroll down! More to see!',
        '♪♫ *taps legs impatiently* So much science to explore!',
        '♪♫ Fun fact: Eridians live underground. But we love surface projects!',
        '♪♫ Try clicking the pipeline nodes! Or the architecture blocks!',
        '♪♫ I wait for you, friend. No rush. But also... scroll maybe?',
      ];
      showSpeech(idleMessages[Math.floor(Math.random() * idleMessages.length)], 5000);
      lastInteraction = Date.now();
    }
  }, 30000);

})();
