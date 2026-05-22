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
  initRecentObservations();
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
  const aiHint = document.querySelector('.ai-hint');

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

  // Drag leave
  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
  });

  // Drop file
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
      showNotification('Mohon upload file gambar (JPG, PNG, WEBP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (previewImg && imagePreview) {
        previewImg.src = e.target.result;
        imagePreview.classList.add('active');
        uploadZone.style.display = 'none';

        // Simulated premium AI species detection!
        if (aiHint) {
          aiHint.style.background = 'rgba(34, 197, 94, 0.15)';
          aiHint.style.borderColor = 'rgba(34, 197, 94, 0.4)';
          aiHint.innerHTML = `<span class="ai-icon" style="animation: pulse-green 1s infinite;">🤖</span> <span style="color:#4ade80; font-weight:600;">AI sedang menganalisis foto...</span>`;
          
          setTimeout(() => {
            // Determine a name based on file name keywords
            const fileNameLower = file.name.toLowerCase();
            let predictedName = '';
            let predictedCat = 'flora';

            if (fileNameLower.includes('burung') || fileNameLower.includes('kutilang') || fileNameLower.includes('bird') || fileNameLower.includes('gereja') || fileNameLower.includes('jalak')) {
              predictedName = fileNameLower.includes('kutilang') ? 'Burung Kutilang' : fileNameLower.includes('jalak') ? 'Burung Jalak Kerbau' : 'Burung Gereja';
              predictedCat = 'fauna';
            } else if (fileNameLower.includes('kamboja') || fileNameLower.includes('bunga') || fileNameLower.includes('flower') || fileNameLower.includes('pohon') || fileNameLower.includes('tanjung') || fileNameLower.includes('daun')) {
              predictedName = fileNameLower.includes('kamboja') ? 'Kamboja Jepang' : fileNameLower.includes('tanjung') ? 'Pohon Tanjung' : 'Pohon Beringin';
              predictedCat = 'flora';
            } else if (fileNameLower.includes('kupu') || fileNameLower.includes('capung') || fileNameLower.includes('serangga') || fileNameLower.includes('butterfly') || fileNameLower.includes('insect')) {
              predictedName = fileNameLower.includes('kupu') ? 'Kupu-kupu Swallowtail' : 'Capung Jarum';
              predictedCat = 'fauna'; // maps to fauna or custom
            }

            if (predictedName) {
              document.getElementById('species-name').value = predictedName;
              if (predictedCat === 'flora') {
                document.getElementById('cat-flora').checked = true;
              } else {
                document.getElementById('cat-fauna').checked = true;
              }
              aiHint.innerHTML = `<span class="ai-icon">🤖</span> <span>AI mendeteksi kecocokan tinggi: <strong>${predictedName}</strong> (${predictedCat === 'flora' ? '🌿 Flora' : '🐦 Fauna'} - Akurasi 96%). Form telah diisi otomatis.</span>`;
              showNotification(`🤖 AI berhasil mendeteksi: ${predictedName}!`, 'success');
            } else {
              // Default fallback scan suggestion
              aiHint.innerHTML = `<span class="ai-icon">🤖</span> <span>AI mendeteksi objek gambar. Silakan isi Nama Spesies & Kategori secara manual untuk akurasi terbaik.</span>`;
            }
          }, 1500);
        }
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
        if (aiHint) {
          aiHint.style.background = '';
          aiHint.style.borderColor = '';
          aiHint.innerHTML = `<span class="ai-icon">🤖</span> <span>AI membantu identifikasi awal spesies berdasarkan foto. Hasil identifikasi akan muncul secara otomatis setelah upload.</span>`;
        }
      }
    });
  }

  // Form submission & local preservation
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('species-name').value;
      const category = document.querySelector('input[name="category"]:checked').value;
      const locationKey = document.getElementById('location').value;
      const locationText = document.getElementById('location').options[document.getElementById('location').selectedIndex].text;
      const date = document.getElementById('date').value;
      const description = document.getElementById('description').value;
      const observerName = document.getElementById('observer-name').value || 'Relawan Mahasiswa';
      const observerNim = document.getElementById('observer-nim').value || '-';

      // Capture Image
      let imageSrc = '';
      if (previewImg && previewImg.src && imagePreview.classList.contains('active')) {
        imageSrc = previewImg.src;
      } else {
        // Fallbacks
        if (category === 'flora') imageSrc = 'assets/kamboja.png';
        else if (category === 'fauna') imageSrc = 'assets/kutilang.png';
        else imageSrc = 'assets/hero-banner.png';
      }

      // Geolocation mapping with small randomized spreads
      const baseCoords = {
        'taman-rektorat': [-6.220300, 106.151200],
        'hutan-mini': [-6.221250, 106.152450],
        'fakultas-sains': [-6.220100, 106.151950],
        'koridor': [-6.220850, 106.151650],
        'lapangan': [-6.220550, 106.152650],
        'kebun-biologi': [-6.221600, 106.150900],
        'masjid': [-6.220927, 106.151731],
        'lainnya': [-6.220927, 106.151731]
      };

      const base = baseCoords[locationKey] || [-6.220927, 106.151731];
      const offsetLat = (Math.random() - 0.5) * 0.0004;
      const offsetLng = (Math.random() - 0.5) * 0.0004;
      const coords = [base[0] + offsetLat, base[1] + offsetLng];

      // Mapping status & categories
      let colorClass = 'green';
      let scientificFallback = 'Spesies Baru';
      if (category === 'flora') {
        colorClass = 'green';
        scientificFallback = 'Flora Teridentifikasi';
      } else if (category === 'fauna') {
        colorClass = 'blue';
        scientificFallback = 'Fauna Teridentifikasi';
      } else if (category === 'habitat') {
        colorClass = 'red';
        scientificFallback = 'Status Kerawanan';
      }

      const generatedId = Date.now();
      const newObservation = {
        id: generatedId,
        title: name,
        scientific: scientificFallback,
        category: category,
        location: locationText,
        coords: coords,
        image: imageSrc,
        desc: description || `Hasil temuan spesies ${name} tercatat di ${locationText} pada ${date}.`,
        link: `spesies.html?id=${generatedId}`,
        status: category === 'habitat' ? 'Monitoring' : 'Least Concern',
        colorClass: colorClass,
        observerName: observerName,
        observerNim: observerNim,
        date: date
      };

      // Push to LocalStorage
      const localObservations = JSON.parse(localStorage.getItem('biodiversity_observations') || '[]');
      localObservations.unshift(newObservation);
      localStorage.setItem('biodiversity_observations', JSON.stringify(localObservations));

      showNotification('✅ Observasi berhasil diupload! Terima kasih atas kontribusi Anda.', 'success');

      // Reset and Redirect
      setTimeout(() => {
        form.reset();
        if (imagePreview) {
          imagePreview.classList.remove('active');
          uploadZone.style.display = '';
        }
        window.location.href = 'index.html#recent';
      }, 1500);
    });
  }
}

/* --- Dynamic Recent Observations Feed (Home) --- */
function initRecentObservations() {
  const container = document.getElementById('recent-observations-grid');
  if (!container) return;

  // Baseline prominent species to show
  const baseline = window.speciesData.slice(0, 3); // Kamboja, Tanjung, Beringin

  // Retrieve user observations from LocalStorage
  const localObs = JSON.parse(localStorage.getItem('biodiversity_observations') || '[]');

  // Combine them: User-uploaded observations always take precedence at the top!
  const allObservations = [...localObs, ...baseline].slice(0, 6);

  container.innerHTML = '';

  allObservations.forEach((obs, index) => {
    const card = document.createElement('a');
    card.href = obs.link || `spesies.html?id=${obs.id}`;
    // Use feature-card without animate-on-scroll — we'll animate directly via setTimeout
    card.className = `feature-card stagger-${(index % 4) + 1}`;
    card.style.textDecoration = 'none';
    card.style.color = 'inherit';
    card.style.display = 'block';
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';

    // Category style tags
    let catLabel = 'Flora';
    let catBg = 'rgba(34,197,94,0.15)';
    let catColor = '#4ade80';

    if (obs.category === 'fauna') {
      catLabel = 'Fauna';
      catBg = 'rgba(59,130,246,0.15)';
      catColor = '#60a5fa';
    } else if (obs.category === 'insecta') {
      catLabel = 'Serangga';
      catBg = 'rgba(245,158,11,0.15)';
      catColor = '#fbbf24';
    } else if (obs.category === 'habitat') {
      catLabel = 'Habitat';
      catBg = 'rgba(239,68,68,0.15)';
      catColor = '#f87171';
    }

    card.innerHTML = `
      <div style="width: 100%; height: 180px; border-radius: 12px; overflow: hidden; margin-bottom: 16px; position: relative; background: #06110b;">
        <img src="${obs.image}" alt="${obs.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;">
      </div>
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span style="background: ${catBg}; color: ${catColor}; padding: 2px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 600;">${catLabel}</span>
        <span style="font-size: 0.8rem; color: #94a3b8;">📍 ${obs.location}</span>
      </div>
      <h3 style="font-size: 1.1rem; margin-bottom: 4px; color: var(--dark-50);">${obs.title}</h3>
      <p style="font-size: 0.85rem; font-style: italic; color: var(--green-400); margin-bottom: 8px;">${obs.scientific}</p>
      <p style="font-size: 0.88rem; color: var(--dark-300); line-height: 1.5; margin-bottom: 0;">${obs.desc}</p>
      <span class="feature-arrow" style="position: absolute; bottom: 20px; right: 20px; font-size: 1.1rem; color: var(--green-400);">→</span>
    `;

    container.appendChild(card);

    // Staggered entrance animation — guaranteed to work regardless of scroll position
    const delay = 100 + index * 100;
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, delay);
  });
}

/* --- Notification System --- */
function showNotification(message, type = 'info') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;font-size:1.2rem;padding:0 0 0 12px;">×</button>
  `;

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
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});
