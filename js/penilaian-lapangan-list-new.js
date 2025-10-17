(function(){
    // Data dummy untuk testing
    const DUMMY_DATA = [
        {
            id: 1,
            desa: 'Desa Sumbersari',
            kecamatan: 'Kec. Sumbersari',
            kabupaten: 'Kab. Jember',
            tanggal: '2024-10-01',
            status: 'Belum Dinilai',
            skor: 85,
            menuju_kategori: 'Pratama',
            answers: {}
        },
        {
            id: 2,
            desa: 'Kelurahan Tlogomas',
            kecamatan: 'Kec. Lowokwaru',
            kabupaten: 'Kota Malang',
            tanggal: '2024-10-02',
            status: 'Belum Dinilai',
            skor: 120,
            menuju_kategori: 'Madya',
            answers: {}
        },
        {
            id: 3,
            desa: 'Desa Sukamaju',
            kecamatan: 'Kec. Megaluh',
            kabupaten: 'Kab. Jombang',
            tanggal: '2024-10-03',
            status: 'Belum Dinilai',
            skor: 150,
            menuju_kategori: 'Mandiri',
            answers: {}
        }
    ];

    let selectedItem = null;
    
    // Fungsi untuk merender list penilaian
    function renderList(data) {
        console.log('Rendering list with data:', data);
        const listContainer = document.getElementById('listPenilaian');
        const emptyState = document.getElementById('emptyState');
        const lanjutBtn = document.getElementById('lanjutBtn');
        
        if (!data || data.length === 0) {
            listContainer.innerHTML = '';
            emptyState.classList.remove('hidden');
            lanjutBtn.classList.add('opacity-50', 'cursor-not-allowed');
            return;
        }

        emptyState.classList.add('hidden');
        listContainer.innerHTML = data.map(item => `
            <div class="penilaian-item border rounded-lg p-4 hover:bg-gray-50 cursor-pointer ${selectedItem?.id === item.id ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''}" 
                data-id="${item.id}">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-semibold">${item.desa}</h4>
                        <p class="text-sm text-gray-600">${item.kecamatan}</p>
                        <p class="text-sm text-gray-600">${item.kabupaten}</p>
                    </div>
                    <div class="text-right">
                        <div class="mb-1">
                            <span class="inline-block px-3 py-1 rounded-full text-sm font-medium
                                ${item.status === 'Belum Dinilai' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}">
                                ${item.status}
                            </span>
                        </div>
                        <div class="text-sm text-gray-600">Menuju ${item.menuju_kategori}</div>
                        <div class="text-sm font-semibold text-emerald-600 mt-1">
                            ${item.skor} Poin
                        </div>
                        <div class="text-xs text-gray-500 mt-1">
                            ${item.tanggal}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Add click handlers
        listContainer.querySelectorAll('.penilaian-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                selectItem(id);
            });
        });
    }

    // Fungsi untuk memilih item
    function selectItem(id) {
        console.log('Selecting item:', id);
        const item = DUMMY_DATA.find(d => d.id === id);
        if (!item) return;

        selectedItem = item;

        // Update UI untuk seleksi
        document.querySelectorAll('.penilaian-item').forEach(el => {
            if (parseInt(el.dataset.id) === id) {
                el.classList.add('ring-2', 'ring-emerald-500', 'bg-emerald-50');
            } else {
                el.classList.remove('ring-2', 'ring-emerald-500', 'bg-emerald-50');
            }
        });

        // Enable tombol lanjut
        const lanjutBtn = document.getElementById('lanjutBtn');
        lanjutBtn.classList.remove('opacity-50', 'cursor-not-allowed');

        // Simpan data ke localStorage
        const dataToStore = {
            id: item.id,
            desa: item.desa,
            kecamatan: item.kecamatan,
            kabupaten: item.kabupaten,
            skor: item.skor,
            status: item.status,
            menuju_kategori: item.menuju_kategori,
            tanggal: item.tanggal,
            answers: item.answers
        };
        
        localStorage.setItem('penilaian_lapangan_selected', JSON.stringify(dataToStore));
        console.log('Data stored in localStorage:', dataToStore);
    }

    // Event listener untuk search
    document.getElementById('searchWilayah')?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredData = DUMMY_DATA.filter(item => 
            item.desa.toLowerCase().includes(searchTerm) ||
            item.kecamatan.toLowerCase().includes(searchTerm) ||
            item.kabupaten.toLowerCase().includes(searchTerm)
        );
        renderList(filteredData);
    });

    // Event listener untuk tombol refresh
    document.getElementById('refreshList')?.addEventListener('click', () => {
        selectedItem = null;
        localStorage.removeItem('penilaian_lapangan_selected');
        renderList(DUMMY_DATA);
    });

    // Event listener untuk tombol lanjut
    document.getElementById('lanjutBtn')?.addEventListener('click', (e) => {
        if (!selectedItem) {
            e.preventDefault();
            alert('Silakan pilih penilaian terlebih dahulu');
        }
    });

    // Inisialisasi list saat halaman dimuat
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Page loaded, initializing list');
        renderList(DUMMY_DATA);

        // Check if there's a stored selection
        const storedData = localStorage.getItem('penilaian_lapangan_selected');
        if (storedData) {
            try {
                const data = JSON.parse(storedData);
                selectedItem = DUMMY_DATA.find(item => item.id === data.id);
                if (selectedItem) {
                    selectItem(selectedItem.id);
                }
            } catch (error) {
                console.error('Error loading stored selection:', error);
            }
        }
    });
})();