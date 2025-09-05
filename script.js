// Wrap all behavior after DOM loaded
document.addEventListener('DOMContentLoaded', function () {

  /* -----------------------------
     Background images per section
  ------------------------------ */
  const bgMap = [
    { sel: '#home', img: 'assets/bg-hero.jpg' },
    { sel: '#about', img: 'assets/bg-about.jpg' },
    { sel: '#skills', img: 'assets/bg-skills.jpg' },
    { sel: '#projects', img: 'assets/bg-projects.jpg' },
    { sel: '#experience', img: 'assets/bg-experience.jpg' },
    { sel: '#contact', img: 'assets/download.jpeg' }
  ];
  bgMap.forEach(item => {
    const el = document.querySelector(item.sel);
    if (el) {
      el.style.backgroundImage = `url('${item.img}')`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
    }
  });

  /* -----------------------------
     Typing effect for role
  ------------------------------ */
  const typedEl = document.getElementById('typed');
  const roles = ['Cloud & IoT Developer', 'Full-Stack Developer', 'Problem Solver'];
  let rIndex = 0, cIndex = 0, deleting = false;
  function tick() {
    if (!typedEl) return;
    const full = roles[rIndex];
    if (deleting) {
      cIndex--;
      typedEl.textContent = full.slice(0, cIndex);
      if (cIndex <= 0) {
        deleting = false;
        rIndex = (rIndex + 1) % roles.length;
        setTimeout(tick, 200);
        return;
      }
      setTimeout(tick, 60);
    } else {
      cIndex++;
      typedEl.textContent = full.slice(0, cIndex);
      if (cIndex >= full.length) {
        deleting = true;
        setTimeout(tick, 1200);
        return;
      }
      setTimeout(tick, 120);
    }
  }
  tick();

  /* -----------------------------
     Accent color and nav active via IntersectionObserver
  ------------------------------ */
  const sectionColors = {
    home: '#108f73ff',
    about: '#db0808ff',
    skills: '#74b9ff',
    projects: '#55efc4',
    experience: '#ffeaa7',
    contact: '#a29bfe'
  };

  const navLinks = document.querySelectorAll('.main-nav .nav-link');
  function setActiveNav(id) {
    navLinks.forEach(a => {
      if (a.getAttribute('href') === `#${id}`) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  const sections = document.querySelectorAll('.section[id]');
  if ('IntersectionObserver' in window && sections.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          // change accent color if mapping exists
          if (sectionColors[id]) {
            document.documentElement.style.setProperty('--accent', sectionColors[id]);
          }
          setActiveNav(id);
        }
      });
    }, { threshold: 0.55 });

    sections.forEach(s => obs.observe(s));
  } else {
    // fallback: set accent to home
    document.documentElement.style.setProperty('--accent', sectionColors.home);
  }

  /* -----------------------------
     Smooth scrolling for internal links
  ------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = this.getAttribute('href');
      if (target && target.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* -----------------------------
     Certificate modal behavior
  ------------------------------ */
  const modal = document.getElementById('certificateModal');
  const certImg = document.getElementById('certImage');

  window.openCertificate = function (imgSrc) {
    if (!modal || !certImg) return;
    certImg.src = imgSrc;
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
    // focus for accessibility
    modal.focus();
  };
  window.closeCertificate = function () {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    certImg.src = '';
  };

  // close when clicking background
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeCertificate();
    });
  }
  // close with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCertificate();
  });

  /* -----------------------------
     Accessibility: ensure enter key works on .exp elements
  ------------------------------ */
  document.querySelectorAll('.exp').forEach(el => {
    el.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const onclick = el.getAttribute('onclick');
        // fallback: if onclick present with path
        if (onclick) {
          const match = onclick.match(/openCertificate\(['"](.+?)['"]\)/);
          if (match) openCertificate(match[1]);
        }
      }
    });
  });

}); // DOMContentLoaded
