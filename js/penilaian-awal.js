// js/penilaian-awal.js
(function(){
    var form = document.getElementById('pmAwalForm');
    var btnSave = document.getElementById('simpanAwal');
    var lanjutBtn = document.getElementById('lanjutBtn');

    // Define form storage keys
    var FORM_KEY = 'usulan_form_data'; // Key for main form data
    var PM_AWAL_KEY = 'pm_awal_v1';
    var PM_CTX_KEY = 'pm_context';

    // Map form values to penilaian mandiri fields
    function mapFormData(formData) {
        if (!formData) return null;
        
        // Debug log untuk melihat data yang masuk
        console.log('Form data received:', formData);
        
        return {
            // Sesuaikan dengan nama field di form.html yang sebenarnya
            jenis_wilayah: formData.tipe_wilayah || 'Kelurahan',
            nama_wilayah: (formData.nama_wilayah || formData.nama_desa || '').toUpperCase(),
            kecamatan: (formData.kecamatan || '').toUpperCase(),
            kabkota: (formData.kabkota || '').toUpperCase(),
            menuju_kategori: (formData.kategori || formData.menuju_kategori || '').toLowerCase(),
            total_rw: formData.total_rw || '',
            total_rt: formData.total_rt || '',
            kelola_rw: formData.kelola_rw || '',
            kelola_rt: formData.kelola_rt || ''
        };
    }

    // Read data from localStorage
    function readLS(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch(e) {
            console.error('Error reading from localStorage:', e);
            return null;
        }
    }

    // Fill form with data
    function fillForm(data) {
        if (!data) return;

        // Debug log
        console.log('Filling form with data:', data);

        // Fill dropdown field jenis_wilayah
        const jenisWilayahSelect = form.querySelector('select[name="jenis_wilayah"]');
        if (jenisWilayahSelect && data.jenis_wilayah) {
            const formattedValue = data.jenis_wilayah.charAt(0).toUpperCase() + 
                                 data.jenis_wilayah.slice(1).toLowerCase();
            jenisWilayahSelect.value = formattedValue;
        }

        // Fill text inputs
        if (data.nama_wilayah) setVal('nama_wilayah', data.nama_wilayah);
        if (data.kecamatan) setVal('kecamatan', data.kecamatan);
        if (data.kabkota) setVal('kabkota', data.kabkota);
        if (data.total_rw) setVal('total_rw', data.total_rw);
        if (data.total_rt) setVal('total_rt', data.total_rt);
        if (data.kelola_rw) setVal('kelola_rw', data.kelola_rw);
        if (data.kelola_rt) setVal('kelola_rt', data.kelola_rt);

        // Handle radio buttons for menuju_kategori
        if (data.menuju_kategori) {
            const radioValue = data.menuju_kategori.toLowerCase();
            const radio = form.querySelector(`input[name="menuju_kategori"][value="${radioValue}"]`);
            if (radio) {
                radio.checked = true;
                console.log('Setting radio button:', radioValue);
            }
        }
    }

    // Helper to set form values
    function setVal(name, value) {
        const el = form.querySelector(`[name="${name}"]`);
        if (el) el.value = value;
    }

    // Initialize form
    function initializeForm() {
        // Get data from all possible sources
        const formData = readLS(FORM_KEY);
        const pmData = readLS(PM_AWAL_KEY);
        const ctxData = readLS(PM_CTX_KEY);
        
        // Debug log
        console.log('Form data:', formData);
        console.log('PM data:', pmData);
        console.log('Context data:', ctxData);

        // Merge data with priority
        const mergedData = {
            ...mapFormData(formData),  // Base data from form
            ...pmData,                 // Override with saved PM data
            ...ctxData                 // Finally override with context data
        };

        // Fill form with merged data
        fillForm(mergedData);

        // Enable/disable lanjut button based on category selection
        if (lanjutBtn) {
            lanjutBtn.disabled = !mergedData.menuju_kategori;
        }
    }

    // Helper functions
    function getVal(name) {
        const el = form.querySelector(`[name="${name}"]`);
        return el ? el.value : '';
    }

    function getRadio(name) {
        const radio = form.querySelector(`input[name="${name}"]:checked`);
        return radio ? radio.value : '';
    }

    function writeLS(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`Data saved to ${key}:`, data); // Debug log
            return true;
        } catch(e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    }

    // Save button handler with form key
    if (btnSave) {
        btnSave.addEventListener('click', function() {
            const data = {
                tipe_wilayah: getVal('jenis_wilayah'),
                nama_desa: getVal('nama_wilayah'),
                kecamatan: getVal('kecamatan'),
                kabkota: getVal('kabkota'),
                kategori: getRadio('menuju_kategori'),
                total_rw: getVal('total_rw'),
                total_rt: getVal('total_rt'),
                kelola_rw: getVal('kelola_rw'),
                kelola_rt: getVal('kelola_rt')
            };

            // Save to both original form format and PM format
            const pmData = {
                jenis_wilayah: getVal('jenis_wilayah'),
                nama_wilayah: getVal('nama_wilayah'),
                kecamatan: getVal('kecamatan'),
                kabkota: getVal('kabkota'),
                menuju_kategori: getRadio('menuju_kategori'),
                total_rw: getVal('total_rw'),
                total_rt: getVal('total_rt'),
                kelola_rw: getVal('kelola_rw'),
                kelola_rt: getVal('kelola_rt')
            };

            // Save to all storage locations
            if (writeLS(FORM_KEY, data) && 
                writeLS(PM_AWAL_KEY, pmData) && 
                writeLS(PM_CTX_KEY, pmData)) {
                alert('Data berhasil disimpan');
                if (lanjutBtn) lanjutBtn.disabled = false;
            } else {
                alert('Gagal menyimpan data');
            }
        });
    }

    // Tambahkan fungsi untuk menyimpan data form
    function saveDraftForm(formData) {
        try {
            localStorage.setItem(FORM_KEY, JSON.stringify({
                tipe_wilayah: formData.tipe_wilayah,
                nama_desa: formData.nama_desa,
                kecamatan: formData.kecamatan,
                kabkota: formData.kabkota,
                kategori: formData.kategori
            }));
            console.log('Form data saved:', formData);
        } catch (e) {
            console.error('Error saving form data:', e);
        }
    }

    // Initialize the form when page loads
    initializeForm();
})();
