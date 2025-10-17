/* ===========================
   Counter (animasi angka)
   =========================== */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var animateCounter = function (element, start, end, duration) {
    if (reduceMotion) { element.textContent = end; return; }
    var startTime = null;

    var step = function (ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      element.textContent = Math.floor(p * (end - start) + start);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  var counters = document.querySelectorAll('.counter');
  if (counters.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var end = parseInt(el.getAttribute('data-target'), 10);
          animateCounter(el, 0, end, 1200);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { io.observe(c); });
  }
})();

/* ===========================
   Dropdown (titik tiga)
   =========================== */
(function () {
  var closeAllDropdowns = function (exceptId) {
    document.querySelectorAll('[data-menu-panel]').forEach(function (p) {
      if (!exceptId || p.id !== exceptId) {
        p.classList.add('hidden');
        var b = document.querySelector('[aria-controls="' + p.id + '"]');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
  };

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-menu-button]');
    if (b) {
      var id = b.getAttribute('aria-controls');
      var panel = document.getElementById(id);
      if (panel) {
        var willOpen = panel.classList.contains('hidden');
        closeAllDropdowns(id);
        panel.classList.toggle('hidden', !willOpen);
        b.setAttribute('aria-expanded', String(willOpen));
        if (willOpen) panel.focus();
      }
      return;
    }
    var inside = e.target.closest('[data-menu-panel]');
    if (!inside) closeAllDropdowns();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllDropdowns();
    var active = document.activeElement;
    if ((e.key === 'Enter' || e.key === ' ') && active && active.matches('[data-menu-button]')) {
      e.preventDefault();
      var id = active.getAttribute('aria-controls');
      var panel = document.getElementById(id);
      if (panel) {
        var willOpen = panel.classList.contains('hidden');
        closeAllDropdowns(id);
        panel.classList.toggle('hidden', !willOpen);
        active.setAttribute('aria-expanded', String(willOpen));
        if (willOpen) panel.focus();
      }
    }
  });
})();

/* ===========================
   Peta Jatim (dengan "scroll guard")
   =========================== */
(function initJatimMap() {
  var mapEl = document.getElementById('map-jatim');
  if (!mapEl) return;

  // Jika Leaflet belum dimuat, tampilkan fallback
  if (typeof L === 'undefined') {
    var fb = document.getElementById('map-fallback');
    if (fb) fb.classList.remove('hidden');
    return;
  }

  // Definisikan batas-batas Jawa Timur
  var jatimBounds = L.latLngBounds(
    [-8.8, 111.0], // Batas Selatan-Barat
    [-6.8, 114.7]  // Batas Utara-Timur
  );

  // Koordinat pusat Jawa Timur
  var jatimCenter = [-7.5407, 112.7113];

  // Data GeoJSON untuk batas Jawa Timur (polygon yang lebih akurat)
  var jatimBorder = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [111.00, -8.73], // Mulai dari barat daya
        [111.40, -8.20],
        [111.70, -7.85],
        [112.00, -7.50],
        [112.45, -7.20],
        [112.80, -7.10],
        [113.20, -7.15],
        [113.65, -7.30],
        [114.00, -7.50],
        [114.40, -7.85],
        [114.60, -8.20],
        [114.50, -8.50],
        [114.20, -8.70],
        [113.80, -8.80],
        [113.20, -8.75],
        [112.60, -8.70],
        [112.00, -8.65],
        [111.50, -8.70],
        [111.00, -8.73]
      ]]
    }
  };

  var map = L.map('map-jatim', {
    center: jatimCenter,
    zoom: 8,  // Sesuaikan zoom untuk tampilan penuh Jawa Timur
    zoomControl: true,
    scrollWheelZoom: false,
    dragging: false,
    touchZoom: false,
    keyboard: false,
    maxBounds: jatimBounds,
    maxBoundsViscosity: 0.8,
    minZoom: 7,
    maxZoom: 13
  });

  // Tile layer standar
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 13,
    minZoom: 7,
    attribution: '&copy; OSM'
  }).addTo(map);

  // Ikon marker sederhana
  var svgIcon = function (fill) {
    return L.divIcon({
      html: '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="' + fill + '" stroke="white" stroke-width="2"/></svg>',
      className: '', iconSize: [22, 22], iconAnchor: [11, 11]
    });
  };

  // Placeholder data
  var points = [
    { name: 'Desa A (Pratama)', lat: -7.25, lng: 112.74, color: '#60A5FA' },
    { name: 'Desa B (Madya)', lat: -7.98, lng: 112.63, color: '#F59E0B' },
    { name: 'Desa C (Mandiri)', lat: -8.10, lng: 113.22, color: '#10B981' }
  ];
  points.forEach(function (p) {
    L
      .marker([p.lat, p.lng], { icon: svgIcon(p.color) })
      .addTo(map)
      .bindPopup('<strong>' + p.name + '</strong>');
  });

  // Guard & tombol
  var guard = document.getElementById('map-guard');
  var btnEnable = document.getElementById('enable-map');
  var btnDisable = document.getElementById('disable-map');

  // Fungsi untuk reset view ke Jawa Timur
  function resetView() {
    map.setView(jatimCenter, 8, {
      animate: true,
      duration: 0.5
    });
  }

  // Aktifkan peta secara default
  map.scrollWheelZoom.enable();
  map.dragging.enable();
  map.touchZoom.enable();
  map.keyboard.enable();
  
  // Hilangkan guard panel sepenuhnya
  if (guard) guard.style.display = 'none';

  // Event listener yang lebih longgar
  map.on('dragend', function() {
    var center = map.getCenter();
    var bounds = map.getBounds();
    
    // Hanya reset jika benar-benar keluar jauh dari batas
    if (!jatimBounds.contains(bounds) && !jatimBounds.contains(center)) {
      map.panTo(jatimCenter, {
        animate: true,
        duration: 0.5
      });
    }
  });
})();

/* ===========================
   Mobile menu (hamburger toggle) + overlay
   =========================== */
(function () {
  var btn = document.getElementById('mobile-menu-btn');
  var menu = document.getElementById('mobile-menu');
  var iconMenu = document.getElementById('icon-menu');
  var iconClose = document.getElementById('icon-close');

  if (!btn || !menu) return;

  // Overlay agar konten lain menggelap saat menu terbuka
  var overlay = document.getElementById('nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'nav-overlay';
    overlay.className = 'fixed inset-0 bg-black/40 hidden z-[1500]';
    document.body.appendChild(overlay);
  }

  var toggleMenu = function (force) {
    var willOpen = (typeof force === 'boolean') ? force : menu.classList.contains('hidden');
    menu.classList.toggle('hidden', !willOpen);
    btn.setAttribute('aria-expanded', String(willOpen));
    if (iconMenu) iconMenu.classList.toggle('hidden', willOpen);
    if (iconClose) iconClose.classList.toggle('hidden', !willOpen);
    overlay.classList.toggle('hidden', !willOpen);
    document.body.classList.toggle('overflow-hidden', willOpen); // kunci scroll saat terbuka
  };

  // Klik tombol → toggle
  btn.addEventListener('click', function () { toggleMenu(); });

  // Klik overlay / Escape → tutup
  overlay.addEventListener('click', function () { toggleMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggleMenu(false); });

  // Klik di luar menu & tombol → tutup
  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !btn.contains(e.target)) toggleMenu(false);
  });
})();

/* ===========================
   Tabs di halaman daftar (hash-based)
   =========================== */
(function () {
  var panels = {
    masuk: document.getElementById('panel-masuk'),
    daftar: document.getElementById('panel-daftar')
  };
  var tabs = document.querySelectorAll('.tab[data-tab]');
  if (!tabs.length) return;

  var activate = function (which) {
    Object.keys(panels).forEach(function (k) {
      if (panels[k]) panels[k].classList.toggle('hidden', k !== which);
    });
    tabs.forEach(function (t) {
      t.classList.toggle('btn-primary', t.dataset.tab === which);
      t.classList.toggle('btn-secondary', t.dataset.tab !== which);
    });
  };

  var fromHash = function () {
    var h = (location.hash || '#masuk').replace('#', '');
    activate(h === 'daftar' ? 'daftar' : 'masuk');
  };

  window.addEventListener('hashchange', fromHash);
  fromHash();
})();

/* ==================================================
   Halaman upload-bukti: dukung MULTI PANEL & SINGLE
   ================================================== */
(function () {
  if (document.body.dataset.page !== 'upload-bukti') return;

  // ----- Ambil ID usulan dari query -----
  var params = new URLSearchParams(location.search);
  var usulanId = params.get('usulan');
  var label = document.getElementById('usulan-label');
  if (label) label.textContent = usulanId ? ('#' + usulanId) : '— (buat usulan dulu)';

  var form = document.getElementById('uploadForm');
  var result = document.getElementById('result');

  /* ===============================
     MODE A: MULTI PANEL PER KATEGORI
     =============================== */
  var panels = Array.prototype.slice.call(document.querySelectorAll('.upload-panel'));
  if (panels.length) {
    // Map kategori -> array File
    var filesByCat = new Map();

    var setFiles = function (cat, arr) { filesByCat.set(cat, arr); };
    var getFiles = function (cat) { return filesByCat.get(cat) || []; };

    var showPanel = function (cat) {
      panels.forEach(function (p) {
        p.classList.toggle('hidden', p.getAttribute('data-cat') !== cat);
      });
    };

    // Radio kategori → tampilkan panel
    var radios = document.querySelectorAll('input[name="kategori_bukti"]');
    Array.prototype.forEach.call(radios, function (r) {
      r.addEventListener('change', function () { showPanel(r.value); });
    });
    var checked = document.querySelector('input[name="kategori_bukti"]:checked') || radios[0];
    if (checked) { checked.checked = true; showPanel(checked.value); }

    // Init setiap panel
    panels.forEach(function (panel) {
      var cat = panel.getAttribute('data-cat');
      var dz = panel.querySelector('.drop');
      var picker = panel.querySelector('.picker');
      var listWrap = panel.querySelector('.file-list');
      var accept = (dz && dz.getAttribute('data-accept') || '').split(',').map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
      var maxMB = parseFloat((dz && dz.getAttribute('data-maxmb')) || '10');

      setFiles(cat, []);

      var extOf = function (name) { var m = /\.([a-z0-9]+)$/i.exec(name || ''); return m ? m[1].toLowerCase() : ''; };

      var render = function () {
        var files = getFiles(cat);
        listWrap.innerHTML = '';
        files.forEach(function (f, idx) {
          var pill = document.createElement('span');
          pill.className = 'file-pill';
          pill.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-700" viewBox="0 0 24 24" fill="currentColor">' +
            '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12V8z"/><path d="M14 2v6h6"/></svg>' +
            '<span class="text-sm">' + f.name + '</span>' +
            '<button type="button" class="text-red-600 text-sm" aria-label="Hapus">&times;</button>';
          pill.querySelector('button').addEventListener('click', function () {
            var cur = getFiles(cat); cur.splice(idx, 1); setFiles(cat, cur); render();
          });
          listWrap.appendChild(pill);
        });
      };

      var add = function (list) {
        var cur = getFiles(cat);
        Array.prototype.forEach.call(list || [], function (f) {
          var dotExt = '.' + extOf(f.name);
          var okExt = !accept.length || accept.indexOf(dotExt) !== -1;
          if (!okExt) { alert('Format tidak didukung untuk ' + cat + ': ' + f.name); return; }
          if (f.size > maxMB * 1024 * 1024) { alert('File > ' + maxMB + ' MB: ' + f.name); return; }
          cur.push(f);
        });
        setFiles(cat, cur);
        render();
      };

      if (dz) {
        dz.addEventListener('dragover', function (e) { e.preventDefault(); dz.classList.add('dragover'); });
        dz.addEventListener('dragleave', function () { dz.classList.remove('dragover'); });
        dz.addEventListener('drop', function (e) { e.preventDefault(); dz.classList.remove('dragover'); add(e.dataTransfer.files); });
        var labelClick = dz.querySelector('label');
        if (labelClick && picker) { labelClick.addEventListener('click', function () { picker.click(); }); }
      }
      if (picker) {
        picker.addEventListener('change', function (e) { add(e.target.files); });
      }
      render();
    });

    // Submit untuk mode multi-panel
    if (form) {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();

        var selected = document.querySelector('input[name="kategori_bukti"]:checked');
        if (!selected) { alert('Pilih kategori bukti terlebih dahulu.'); return; }
        var cat = selected.value;
        var files = filesByCat.get(cat) || [];
        if (!files.length) { alert('Pilih minimal 1 file pada panel kategori yang tampil.'); return; }
        if (!usulanId) { alert('ID usulan tidak ditemukan. Buka dari Dashboard (tombol "Unggah Bukti").'); return; }

        var fd = new FormData();
        fd.append('usulan_id', usulanId);
        fd.append('kategori', cat);
        var catatanEl = document.getElementById('catatan');
        fd.append('catatan', catatanEl ? catatanEl.value : '');
        files.forEach(function (f) { fd.append('files[]', f, f.name); });

        try {
          await new Promise(function (res) { setTimeout(res, 600); }); // demo tanpa backend
          form.classList.add('hidden');
          result.classList.remove('hidden');
          var btnMore = document.getElementById('btn-more');
          if (btnMore) { btnMore.href = location.href; }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
          alert('Terjadi kesalahan saat mengunggah. Coba lagi.');
        }
      });
    }

    return; // selesai mode A
  }

  /* ==========================
     MODE B: SINGLE DROPZONE
     ========================== */
  var dzSingle = document.getElementById('dropzone');
  var pickerSingle = document.getElementById('file-input');
  var listSingle = document.getElementById('file-list');

  var ACCEPT = ['pdf', 'jpg', 'jpeg', 'png', 'docx', 'xlsx'];
  var MAX_MB = 10;
  var filesSingle = [];

  var extOfSingle = function (name) { var m = /\.([a-z0-9]+)$/i.exec(name || ''); return m ? m[1].toLowerCase() : ''; };

  var renderSingle = function () {
    listSingle.innerHTML = '';
    filesSingle.forEach(function (f, idx) {
      var pill = document.createElement('span');
      pill.className = 'file-pill';
      pill.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-700" viewBox="0 0 24 24" fill="currentColor">' +
        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12V8z"/><path d="M14 2v6h6"/></svg>' +
        '<span class="text-sm">' + f.name + '</span>' +
        '<button type="button" class="text-red-600 text-sm" aria-label="Hapus">&times;</button>';
      pill.querySelector('button').addEventListener('click', function () {
        filesSingle.splice(idx, 1); renderSingle();
      });
      listSingle.appendChild(pill);
    });
  };

  var addSingle = function (list) {
    Array.prototype.forEach.call(list || [], function (f) {
      var ext = extOfSingle(f.name);
      if (ACCEPT.indexOf(ext) === -1) { alert('Format tidak didukung: ' + f.name); return; }
      if (f.size > MAX_MB * 1024 * 1024) { alert('File > ' + MAX_MB + ' MB: ' + f.name); return; }
      filesSingle.push(f);
    });
    renderSingle();
  };

  if (dzSingle) {
    dzSingle.addEventListener('dragover', function (e) { e.preventDefault(); dzSingle.classList.add('dragover'); });
    dzSingle.addEventListener('dragleave', function () { dzSingle.classList.remove('dragover'); });
    dzSingle.addEventListener('drop', function (e) { e.preventDefault(); dzSingle.classList.remove('dragover'); addSingle(e.dataTransfer.files); });
    var labelClickSingle = dzSingle.querySelector('label');
    if (labelClickSingle && pickerSingle) {
      labelClickSingle.addEventListener('click', function () { pickerSingle.click(); });
    }
  }
  if (pickerSingle) {
    pickerSingle.addEventListener('change', function (e) { addSingle(e.target.files); });
  }

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      var selected = document.querySelector('input[name="kategori_bukti"]:checked');
      var cat = selected ? selected.value : '';
      if (!cat) { alert('Pilih kategori bukti terlebih dahulu.'); return; }
      if (!filesSingle.length) { alert('Pilih minimal 1 file.'); return; }
      if (!usulanId) { alert('ID usulan tidak ditemukan. Buka dari Dashboard (tombol "Unggah Bukti").'); return; }

      var fd = new FormData();
      fd.append('usulan_id', usulanId);
      fd.append('kategori', cat);
      var catatanEl = document.getElementById('catatan');
      fd.append('catatan', catatanEl ? catatanEl.value : '');
      filesSingle.forEach(function (f) { fd.append('files[]', f, f.name); });

      try {
        await new Promise(function (res) { setTimeout(res, 600); }); // demo
        form.classList.add('hidden');
        result.classList.remove('hidden');
        var btnMore = document.getElementById('btn-more');
        if (btnMore) { btnMore.href = location.href; }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        alert('Terjadi kesalahan saat mengunggah. Coba lagi.');
      }
    });
  }
})();
