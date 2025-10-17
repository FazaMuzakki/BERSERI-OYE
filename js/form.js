const steps = document.querySelectorAll('.form-step');
const progressBar = document.getElementById('progressBar')?.firstElementChild;
let currentStep = 0;



function showStep(index) {
    steps.forEach((s, i) => s.classList.toggle('hidden', i !== index));
    if (progressBar) progressBar.style.width = `${((index + 1) / steps.length) * 100}%`;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    if (prevBtn) prevBtn.style.display = index === 0 ? 'none' : 'inline-flex';
    if (nextBtn) nextBtn.style.display = index === steps.length - 1 ? 'none' : 'inline-flex';
    if (submitBtn) submitBtn.classList.toggle('hidden', index !== steps.length - 1);
}

function nextStep() {
  // validasi sederhana: pastikan input required di step ini terisi
  const requiredInputs = steps[currentStep].querySelectorAll('input[required], select[required], textarea[required]');
  for (const el of requiredInputs) {
    if (!el.value) { el.focus(); el.scrollIntoView({behavior:'smooth', block:'center'}); return; }
    if (el.type === 'file' && !el.files.length) { el.focus(); return; }
  }
  if (currentStep < steps.length - 1) { currentStep++; showStep(currentStep); }
}
function prevStep() { if (currentStep > 0) { currentStep--; showStep(currentStep); } }


function submitForm(e) {
  e.preventDefault();

  // Get required file inputs
  const fotoInput = document.getElementById('file_foto');
  const sertifikatInput = document.getElementById('file_sertifikat');

  // validasi required files
  if (!fotoInput?.files.length || !sertifikatInput?.files.length) {
      alert('Silakan upload file Foto Kepala Desa/Lurah dan Sertifikat Studi Banding');
      return;
  }

  try {
      // Get form data untuk penilaian-mandiri-awal
      const formData = {
          tipe_wilayah: document.querySelector('input[name="tipe_wilayah"]:checked')?.value || '',
          nama_desa: document.getElementById('nama-desa')?.value || '',
          kecamatan: document.getElementById('kecamatan')?.value || '',
          kabkota: document.getElementById('kabkota')?.value || '',
          kategori: document.querySelector('input[name="kategori"]:checked')?.value || ''
      };

      // Save ke format original
      localStorage.setItem('usulan_form_data', JSON.stringify(formData));
      
      // Also save in penilaian mandiri format
      const pmData = {
          jenis_wilayah: formData.tipe_wilayah === 'desa' ? 'Desa' : 'Kelurahan',
          nama_wilayah: formData.nama_desa.toUpperCase(),
          kecamatan: formData.kecamatan.toUpperCase(),
          kabkota: formData.kabkota.toUpperCase(),
          menuju_kategori: formData.kategori.toLowerCase()
      };
      
      // Save to both PM storage locations
      localStorage.setItem('pm_awal_v1', JSON.stringify(pmData));
      localStorage.setItem('pm_context', JSON.stringify(pmData));

      // Show success message and redirect to dashboard
      setTimeout(() => {
          alert('Form berhasil dikirim');
          window.location.href = 'dashboard.html';
      }, 1000);
  } catch (error) {
      alert('Form gagal dikirim. Silakan coba lagi.');
  }
}

document.getElementById('nextBtn')?.addEventListener('click', nextStep);
document.getElementById('prevBtn')?.addEventListener('click', prevStep);

document.getElementById('usulanForm')?.addEventListener('submit', submitForm);

if (steps.length) showStep(currentStep);
