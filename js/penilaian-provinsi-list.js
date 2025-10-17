(function(){
    let selectedAssessment = null;

    // Dummy data untuk list penilaian mandiri
    const DUMMY_PENILAIAN = [
        {
            id: '001',
            jenis_wilayah: 'Desa',
            nama_wilayah: 'SUDIMORO',
            kecamatan: 'MEGALUH',
            kabkota: 'JOMBANG',
            tanggal: '2023-10-01',
            status: 'Selesai',
            skor: 245.5,
            kategori: 'Mandiri',
            answers: {
                'A1': { value: 'a', score: 5 },
                'A2': { value: 'a', score: 5 },
                'B1': { value: 'd', score: 2 },
                'B2': { values: ['a', 'b', 'c'], score: 1.5 },
                'B3': { values: ['a', 'b'], score: 1 },
                'B4': { value: 'd', score: 2 }
            }
        },
        {
            id: '002',
            jenis_wilayah: 'Kelurahan',
            nama_wilayah: 'KAUMAN',
            kecamatan: 'KLOJEN',
            kabkota: 'MALANG',
            tanggal: '2023-10-05',
            status: 'Selesai',
            skor: 180.75,
            kategori: 'Madya',
            answers: {
                'A1': { value: 'b', score: 3.75 },
                'A2': { value: 'b', score: 3.75 },
                'B1': { value: 'c', score: 1.5 },
                'B2': { values: ['a', 'b'], score: 1 },
                'B3': { values: ['a'], score: 0.5 },
                'B4': { value: 'c', score: 1.5 }
            }
        },
        {
            id: '003',
            jenis_wilayah: 'Desa',
            nama_wilayah: 'SUMBERAGUNG',
            kecamatan: 'DANDER',
            kabkota: 'BOJONEGORO',
            tanggal: '2023-10-08',
            status: 'Selesai',
            skor: 125.25,
            kategori: 'Pratama',
            answers: {
                'A1': { value: 'b', score: 3.75 },
                'A2': { value: 'b', score: 3.75 },
                'B1': { value: 'a', score: 0.5 },
                'B2': { values: ['a'], score: 0.5 },
                'B3': { values: ['a'], score: 0.5 },
                'B4': { value: 'a', score: 0.5 }
            }
        }
    ];

    // Get category class for badge
    function getCategoryClass(category) {
        switch(category.toLowerCase()) {
            case 'mandiri':
                return 'bg-emerald-100 text-emerald-800';
            case 'madya':
                return 'bg-blue-100 text-blue-800';
            case 'pratama':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    function renderPenilaianCards(data, elements) {
        console.log('Rendering cards with data:', data);
        
        if (!elements.listPenilaian || !elements.emptyState) {
            console.error('Required elements not found');
            return;
        }

        if (!data || !data.length) {
            elements.listPenilaian.innerHTML = '';
            elements.emptyState.classList.remove('hidden');
            return;
        }

        elements.emptyState.classList.add('hidden');
        elements.listPenilaian.innerHTML = data.map(item => {
            const isSelected = selectedAssessment?.id === item.id;
            
            return `
                <div class="assessment-card p-4 rounded-xl border hover:bg-emerald-50 cursor-pointer ${isSelected ? 'bg-emerald-50 border-emerald-500' : ''}" 
                    data-id="${item.id}">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <h4 class="font-semibold text-emerald-800">${item.jenis_wilayah} ${item.nama_wilayah}</h4>
                            <p class="text-sm text-gray-600 mt-1">Kecamatan ${item.kecamatan}</p>
                            <p class="text-sm text-gray-600">${item.kabkota}</p>
                        </div>
                        <div class="text-right">
                            <span class="px-3 py-1 rounded-full text-sm font-medium ${getCategoryClass(item.kategori)}">
                                Menuju ${item.kategori}
                            </span>
                            <p class="text-sm text-gray-500 mt-1">Skor: ${item.skor.toFixed(2)}</p>
                            <p class="text-sm text-gray-500">Tanggal: ${new Date(item.tanggal).toLocaleDateString('id-ID')}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add click handlers
        document.querySelectorAll('.assessment-card').forEach(card => {
            card.addEventListener('click', () => handleCardSelection(card, elements));
        });
    }

    function handleCardSelection(card, elements) {
        const id = card.dataset.id;
        selectedAssessment = DUMMY_PENILAIAN.find(item => item.id === id);

        // Update visual selection
        document.querySelectorAll('.assessment-card').forEach(c => {
            c.classList.remove('bg-emerald-50', 'border-emerald-500');
        });
        card.classList.add('bg-emerald-50', 'border-emerald-500');

        // Enable lanjut button
        if (elements.lanjutBtn) {
            elements.lanjutBtn.disabled = false;
            elements.lanjutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            elements.lanjutBtn.style.backgroundColor = '#059669';
            elements.lanjutBtn.style.cursor = 'pointer';
        }
    }

    function setupEventListeners(elements) {
        // Search functionality
        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                const filtered = !query ? DUMMY_PENILAIAN : DUMMY_PENILAIAN.filter(item => 
                    item.nama_wilayah.toLowerCase().includes(query) ||
                    item.kecamatan.toLowerCase().includes(query) ||
                    item.kabkota.toLowerCase().includes(query) ||
                    item.jenis_wilayah.toLowerCase().includes(query)
                );
                renderPenilaianCards(filtered, elements);
            });
        }

        // Refresh button
        if (elements.refreshBtn) {
            elements.refreshBtn.addEventListener('click', () => {
                selectedAssessment = null;
                if (elements.lanjutBtn) {
                    elements.lanjutBtn.disabled = true;
                    elements.lanjutBtn.classList.add('opacity-50', 'cursor-not-allowed');
                    elements.lanjutBtn.style.backgroundColor = '#9CA3AF';
                    elements.lanjutBtn.style.cursor = 'not-allowed';
                    elements.lanjutBtn.style.opacity = '0.5';
                }
                renderPenilaianCards(DUMMY_PENILAIAN, elements);
                if (elements.searchInput) elements.searchInput.value = '';
            });
        }

        // Next button
        if (elements.lanjutBtn) {
            elements.lanjutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (!selectedAssessment) {
                    alert('Silakan pilih penilaian terlebih dahulu');
                    return;
                }

                // Store selected data with mandiri assessment format
                localStorage.setItem('selected_assessment_provinsi', JSON.stringify({
                    id: selectedAssessment.id,
                    nama_wilayah: selectedAssessment.nama_wilayah,
                    kecamatan: selectedAssessment.kecamatan,
                    kabkota: selectedAssessment.kabkota,
                    answers: selectedAssessment.answers,
                    totalScore: selectedAssessment.skor,
                    menuju_kategori: selectedAssessment.kategori.toLowerCase(),
                    submitted_at: selectedAssessment.tanggal
                }));

                // Navigate to form
                window.location.href = 'penilaian-provinsi-form.html';
            });
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        // Initialize elements
        const elements = {
            searchInput: document.getElementById('searchDesa'),
            listPenilaian: document.getElementById('listPenilaian'),
            emptyState: document.getElementById('emptyState'),
            lanjutBtn: document.getElementById('lanjutBtn'),
            refreshBtn: document.getElementById('refreshList')
        };

        // Clear previous selection
        selectedAssessment = null;
        localStorage.removeItem('selected_assessment_provinsi');

        // Disable lanjut button initially
        if (elements.lanjutBtn) {
            elements.lanjutBtn.disabled = true;
            elements.lanjutBtn.classList.add('opacity-50', 'cursor-not-allowed');
            elements.lanjutBtn.style.backgroundColor = '#9CA3AF';
            elements.lanjutBtn.style.cursor = 'not-allowed';
            elements.lanjutBtn.style.opacity = '0.5';
        }

        // Initial render
        renderPenilaianCards(DUMMY_PENILAIAN, elements);

        // Setup event listeners
        setupEventListeners(elements);
    });

})();