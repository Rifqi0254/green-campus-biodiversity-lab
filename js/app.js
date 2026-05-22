/* ============================================
   GREEN CAMPUS BIODIVERSITY LAB
   Main Application JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initCounterAnimations();
  initParticles();
  initMobileNav();
  initUploadForm();
});

/* --- Navbar Scroll Effect --- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --- Mobile Navigation --- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* --- Scroll Animations (Intersection Observer) --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* --- Counter Animations --- */
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'));
  const suffix = element.getAttribute('data-suffix') || '';
  const prefix = element.getAttribute('data-prefix') || '';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    element.textContent = prefix + current.toLocaleString('id-ID') + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* --- Floating Particles --- */
function initParticles() {
  const container = document.querySelector('.particles');
  if (!container) return;

  const particleCount = 20;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = (Math.random() * 3 + 2) + 'px';
    particle.style.height = particle.style.width;
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (Math.random() * 6 + 6) + 's';
    particle.style.opacity = Math.random() * 0.4 + 0.1;

    // Random green/emerald shades
    const hue = 120 + Math.random() * 40;
    particle.style.background = `hsl(${hue}, 70%, 60%)`;

    container.appendChild(particle);
  }
}

/* --- Upload Form Interactions --- */
function initUploadForm() {
  const uploadZone = document.querySelector('.upload-zone');
  const fileInput = document.getElementById('photo-upload');
  const imagePreview = document.querySelector('.image-preview');
  const previewImg = document.querySelector('.image-preview img');
  const removeBtn = document.querySelector('.remove-image');
  const form = document.getElementById('observation-form');

  if (!uploadZone || !fileInput) return;

  // Click to upload
  uploadZone.addEventListener('click', () => {
    fileInput.click();
  });

  // Drag & Drop
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  });

  // File input change
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  });

  function handleFileSelect(file) {
    if (!file.type.startsWith('image/')) {
      showNotification('Mohon upload file gambar (JPG, PNG, dll)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (previewImg && imagePreview) {
        previewImg.src = e.target.result;
        imagePreview.classList.add('active');
        uploadZone.style.display = 'none';
      }
    };
    reader.readAsDataURL(file);
  }

  // Remove image
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      if (imagePreview) {
        imagePreview.classList.remove('active');
        uploadZone.style.display = '';
        fileInput.value = '';
      }
    });
  }

  // Form submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showNotification('✅ Observasi berhasil dikirim! Terima kasih atas kontribusi Anda.', 'success');

      // Reset form after delay
      setTimeout(() => {
        form.reset();
        if (imagePreview) {
          imagePreview.classList.remove('active');
          uploadZone.style.display = '';
        }
      }, 2000);
    });
  }
}

/* --- Notification System --- */
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;font-size:1.2rem;padding:0 0 0 12px;">×</button>
  `;

  // Styles
  Object.assign(notification.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    padding: '16px 24px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.95rem',
    fontFamily: 'Inter, sans-serif',
    fontWeight: '500',
    zIndex: '9999',
    animation: 'fadeInUp 0.4s ease',
    maxWidth: '400px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  });

  if (type === 'success') {
    notification.style.background = 'rgba(22, 101, 52, 0.9)';
    notification.style.color = '#bbf7d0';
    notification.style.border = '1px solid rgba(34, 197, 94, 0.3)';
  } else if (type === 'error') {
    notification.style.background = 'rgba(127, 29, 29, 0.9)';
    notification.style.color = '#fecaca';
    notification.style.border = '1px solid rgba(239, 68, 68, 0.3)';
  } else {
    notification.style.background = 'rgba(30, 58, 138, 0.9)';
    notification.style.color = '#bfdbfe';
    notification.style.border = '1px solid rgba(59, 130, 246, 0.3)';
  }

  document.body.appendChild(notification);

  // Auto remove
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(10px)';
    notification.style.transition = 'all 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

/* --- Smooth Scroll for anchor links --- */
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (anchor) {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});
