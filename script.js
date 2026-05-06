document.addEventListener("DOMContentLoaded", () => {
  /* === 1. Efek Particles & Lines === */
  function makeParticles(id) {
    const c = document.getElementById(id);
    if (!c) return;
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 5 + 2;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random()*100}%;
        top:${Math.random()*100}%;
        animation-duration:${Math.random()*7+5}s;
        animation-delay:${Math.random()*6}s;
        opacity:${Math.random()*0.5+0.15};
      `;
      c.appendChild(p);
    }
  }

  function makeLines(id, dur1, dur2, dur3) {
    const c = document.getElementById(id);
    if (!c) return;
    [[18, dur1], [50, dur2], [78, dur3]].forEach(([top, dur]) => {
      const s = document.createElement('span');
      s.style.cssText = `top:${top}%; animation-duration:${dur}s; animation-delay:${Math.random()*2}s;`;
      c.appendChild(s);
    });
  }

  makeParticles('darkParticles');
  makeParticles('lightParticles');
  makeLines('darkLines', 3, 4.5, 3.8);
  makeLines('lightLines', 4, 3.2, 5);

  /* === 2. Efek Blur Text === */
  const targets = document.querySelectorAll('.blur-target');
  targets.forEach(target => {
    const words = target.textContent.trim().split(/\s+/);
    target.innerHTML = ""; 
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.classList.add('word');
      span.innerHTML = word + "&nbsp;";
      span.style.transitionDelay = `${i * 100}ms`;
      target.appendChild(span);
    });
  });

  /* === 3. Observer untuk Animasi Reveal === */
  const reveals = document.querySelectorAll('.reveal, .blur-target');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        if (e.target.classList.contains('blur-target')) {
          const words = e.target.querySelectorAll('.word');
          words.forEach(word => word.classList.add('animate'));
        }
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => revealObserver.observe(el));

  /* === 4. Navbar Active Link === */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');
  
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  });

  /* === 5. Typing Animation === */
  const typingElement = document.getElementById('typing-text');
  const phrases = ["Mahasiswa Teknik Informatika"];
  let phraseIndex = 0, charIndex = 0, isDeleting = false, typeSpeed = 100;

  function type() {
    if (!typingElement) return;
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50; 
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }
    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typeSpeed = 2000; 
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500;
    }
    setTimeout(type, typeSpeed);
  }
  type();

  /* === 6. Dark/Light Mode (Logic Gabungan) === */
  const thumb = document.getElementById('toggleThumb');
  const toggleInput = document.getElementById('modeToggle');

  function updateVisuals(theme) {
    const isDark = theme === 'dark';
    if (thumb) thumb.textContent = isDark ? '🌑' : '☀️';
    if (toggleInput) toggleInput.checked = !isDark;
  }

  // Ambil tema awal
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateVisuals(currentTheme);

  // Fungsi toggle global (bisa dipanggil dari HTML)
  window.toggleTheme = function() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateVisuals(next);
  };

  // Support klik pada checkbox jika ada
  if (toggleInput) {
    toggleInput.addEventListener('change', window.toggleTheme);
  }

  /* === 7. Welcome Preloader === */
  const loader = document.getElementById('loader');
  if (loader) {
    document.body.classList.add('loading'); 
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('fade-out'); 
        document.body.classList.remove('loading'); 
      }, 2000); 
    });
  }
});

/* === Tambahan Fungsi Luar untuk UI === */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}

function toggleDrop(id) {
  const el = document.getElementById(id);
  el.classList.toggle('open');
  document.addEventListener('click', function close(e) {
    if (!el.contains(e.target)) {
      el.classList.remove('open');
      document.removeEventListener('click', close);
    }
  });
}
