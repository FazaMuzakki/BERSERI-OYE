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
            id: '002', 
            jenis_wilayah: 'Kelurahan',
            nama_wilayah: 'KAUMAN',
            kecamatan: 'KLOJEN',
            kabkota: 'MALANG',
            tanggal: '2023-10-02',
            status: 'Selesai',
            totalScore: 185.5,
            menuju_kategori: 'madya',
            answers: {}
        },
        {
            id: '003',
            jenis_wilayah: 'Desa',
            nama_wilayah: 'SUMBERAGUNG',
            kecamatan: 'DANDER',
            kabkota: 'BOJONEGORO',
            tanggal: '2023-10-03',
            status: 'Selesai',
            totalScore: 155.5,
            menuju_kategori: 'pratama',
            answers: {}
        }
    ];

    // State management
    let selectedAssessment = null;

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

    function renderList(assessments) {
        const listEl = document.getElementById('listPenilaian');
        const emptyEl = document.getElementById('emptyState');
        
        if (!assessments || assessments.length === 0) {
            listEl.innerHTML = '';
            emptyEl.classList.remove('hidden');
            return;
        }

        emptyEl.classList.add('hidden');
        listEl.innerHTML = assessments.map(item => {
            const passed = getPassingStatus(item.totalScore, item.menuju_kategori);
            const statusBadge = getStatusBadgeHTML(passed, item.totalScore, item.menuju_kategori);
            
            return `
                <div class="card p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedAssessment?.id === item.id ? 'ring-2 ring-emerald-500' : ''}" 
                     data-id="${item.id}">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <h4 class="font-semibold text-lg">
                                ${item.jenis_wilayah} ${item.nama_wilayah}
                            </h4>
                            <p class="text-sm text-gray-600">
                                Kec. ${item.kecamatan}, Kab. ${item.kabkota}
                            </p>
                            <div class="flex items-center gap-2 mt-1">
                                <p class="text-sm text-gray-500">
                                    Menuju ${item.menuju_kategori.charAt(0).toUpperCase() + item.menuju_kategori.slice(1)}
                                </p>
                                <p class="text-sm font-medium ${passed ? 'text-emerald-600' : 'text-red-600'}">
                                    ${item.totalScore.toFixed(1)} Poin
                                </p>
                            </div>
                        </div>
                        <div class="flex flex-col items-end justify-between">
                            ${statusBadge}
                            <p class="text-sm text-gray-500 mt-2">
                                ${item.tanggal}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add click handlers
        listEl.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', () => selectAssessment(card.dataset.id));
        });
    }

    function selectAssessment(id) {
        const assessment = DUMMY_DATA.find(a => a.id === id);
        if (!assessment) return;

        selectedAssessment = assessment;
        
        // Update UI state
        document.querySelectorAll('#listPenilaian .card').forEach(card => {
            if (card.dataset.id === id) {
                card.classList.add('ring-2', 'ring-emerald-500');
            } else {
                card.classList.remove('ring-2', 'ring-emerald-500');
            }
        });

        // Enable continue button
        const btnLanjut = document.getElementById('lanjutBtn');
        btnLanjut.classList.remove('opacity-50', 'cursor-not-allowed');
        btnLanjut.style.cursor = 'pointer';

        // Prepare data for form
        const assessmentData = {
            id: assessment.id,
            nama_wilayah: assessment.jenis_wilayah + ' ' + assessment.nama_wilayah,
            kecamatan: assessment.kecamatan,
            kabkota: assessment.kabkota,
            answers: assessment.answers || {},
            totalScore: assessment.totalScore,
            menuju_kategori: assessment.menuju_kategori,
            status: assessment.status || 'Belum Dinilai',
            submitted_at: assessment.tanggal,
            jenis_wilayah: assessment.jenis_wilayah
        };

        // Store selection
        localStorage.setItem('selected_assessment', JSON.stringify(assessmentData));
    }

    function setupSearch() {
        const searchInput = document.getElementById('searchWilayah');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = DUMMY_DATA.filter(item => 
                item.nama_wilayah.toLowerCase().includes(query) ||
                item.kecamatan.toLowerCase().includes(query) ||
                item.kabkota.toLowerCase().includes(query)
            );
            renderList(filtered);
        });
    }

    function setupRefresh() {
        const refreshBtn = document.getElementById('refreshList');
        if (!refreshBtn) return;

        refreshBtn.addEventListener('click', () => {
            selectedAssessment = null;
            localStorage.removeItem('selected_assessment');
            renderList(DUMMY_DATA);
            
            const btnLanjut = document.getElementById('lanjutBtn');
            btnLanjut.classList.add('opacity-50', 'cursor-not-allowed');
            btnLanjut.style.cursor = 'not-allowed';
        });
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', () => {
        renderList(DUMMY_DATA);
        setupSearch();
        setupRefresh();
    });

})();