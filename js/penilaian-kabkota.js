(function(){
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Script started');
        
        // Initialize elements
        const elements = {
            searchInput: document.getElementById('searchDesa'),
            listPenilaian: document.getElementById('listPenilaian'),
            emptyState: document.getElementById('emptyState'),
            lanjutBtn: document.getElementById('lanjutBtn'),
            refreshBtn: document.getElementById('refreshList')
        };

        let selectedAssessment = null;

        // Initialize dummy data
        function initializeDummyData() {
            // Include answers data for each submission
            const dummySubmissions = [
                {
                    id: '001',
                    jenis_wilayah: 'Desa',
                    nama_wilayah: 'SUDIMORO',
                    kecamatan: 'MEGALUH',
                    kabkota: 'JOMBANG',
                    menuju_kategori: 'mandiri',
                    totalScore: 245.5,
                    submitted_at: '2023-10-01',
                    status: 'submitted',
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
                    menuju_kategori: 'madya',
                    totalScore: 180.75,
                    submitted_at: '2023-10-05',
                    status: 'submitted',
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
                    menuju_kategori: 'pratama',
                    totalScore: 125.25,
                    submitted_at: '2023-10-08',
                    status: 'submitted',
                    answers: {
                        'A1': { value: 'b', score: 3.75 },
                        'A2': { value: 'b', score: 3.75 },
                        'B1': { value: 'a', score: 0.5 },
                        'B2': { values: ['a'], score: 0.5 },
                        'B3': { values: ['a'], score: 0.5 },
                        'B4': { value: 'a', score: 0.5 }
                    }
                },
                {
                    id: '004',
                    jenis_wilayah: 'Desa',
                    nama_wilayah: 'ARGOYUWONO',
                    kecamatan: 'AMPELGADING',
                    kabkota: 'MALANG',
                    menuju_kategori: 'pratama',
                    totalScore: 145.25,
                    submitted_at: '2023-10-09',
                    status: 'submitted',
                    answers: {
                        'A1': { value: 'b', score: 3.75 },
                        'A2': { value: 'a', score: 5 },
                        'B1': { value: 'b', score: 1 },
                        'B2': { values: ['a', 'b'], score: 1 },
                        'B3': { values: ['a', 'b'], score: 1 },
                        'B4': { value: 'b', score: 1 }
                    }
                }
            ];
            
            console.log('Initializing dummy data:', dummySubmissions);
            localStorage.setItem('submissions', JSON.stringify(dummySubmissions));
            return dummySubmissions;
        }

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

        // Render assessment cards
        function renderAssessments(assessments) {
            console.log('Rendering assessments:', assessments);
            const listPenilaian = elements.listPenilaian;
            const emptyState = elements.emptyState;

            if (!listPenilaian) {
                console.error('List penilaian element not found');
                return;
            }

            if (!assessments || !assessments.length) {
                listPenilaian.innerHTML = '';
                emptyState?.classList.remove('hidden');
                return;
            }

            emptyState?.classList.add('hidden');
            
            listPenilaian.innerHTML = assessments.map(assessment => `
                <div class="assessment-card p-4 border rounded-xl hover:bg-emerald-50 cursor-pointer ${
                    selectedAssessment?.id === assessment.id ? 'bg-emerald-50 border-emerald-500' : ''
                }" data-id="${assessment.id}">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-semibold text-emerald-800">
                                ${assessment.jenis_wilayah} ${assessment.nama_wilayah}
                            </h4>
                            <p class="text-sm text-gray-600">Kecamatan ${assessment.kecamatan}</p>
                            <p class="text-sm text-gray-600">${assessment.kabkota}</p>
                        </div>
                        <div class="text-right">
                            <span class="inline-block px-3 py-1 rounded-full text-sm font-medium 
                                   ${getCategoryClass(assessment.menuju_kategori)}">
                                Menuju ${assessment.menuju_kategori.charAt(0).toUpperCase() + 
                                assessment.menuju_kategori.slice(1)}
                            </span>
                            <p class="text-sm text-gray-500 mt-1">
                                Skor: ${assessment.totalScore.toFixed(2)}
                            </p>
                            <p class="text-sm text-gray-500">
                                Disubmit: ${new Date(assessment.submitted_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            `).join('');

            // Add click handlers
            document.querySelectorAll('.assessment-card').forEach(card => {
                card.addEventListener('click', () => {
                    const id = card.dataset.id;
                    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
                    selectedAssessment = submissions.find(s => s.id === id);

                    // Update visual selection
                    document.querySelectorAll('.assessment-card').forEach(c => {
                        c.classList.remove('bg-emerald-50', 'border-emerald-500');
                    });
                    card.classList.add('bg-emerald-50', 'border-emerald-500');

                    // Enable lanjut button
                    if (elements.lanjutBtn) {
                        elements.lanjutBtn.disabled = false;
                    }
                });
            });
        }

        // Initialize
        console.log('Initializing...');
        const submissions = initializeDummyData();
        renderAssessments(submissions);

        // Add event listeners
        if (elements.refreshBtn) {
            elements.refreshBtn.addEventListener('click', () => {
                console.log('Refresh clicked');
                const submissions = initializeDummyData();
                renderAssessments(submissions);
            });
        }

        if (elements.lanjutBtn) {
            elements.lanjutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (!selectedAssessment) {
                    alert('Silakan pilih penilaian terlebih dahulu');
                    return;
                }

                localStorage.setItem('selected_assessment', JSON.stringify({
                    ...selectedAssessment,
                    formattedScore: selectedAssessment.totalScore.toFixed(2),
                    formattedCategory: `Menuju ${selectedAssessment.menuju_kategori.charAt(0).toUpperCase() + 
                                     selectedAssessment.menuju_kategori.slice(1)}`
                }));

                window.location.href = 'penilaian-kabkota-form.html';
            });
        }

        // Update the search event listener section
        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', (e) => {
                console.log('Search input:', e.target.value);
                const query = e.target.value.toLowerCase().trim();
                const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
                
                const filtered = submissions.filter(sub => 
                    sub.nama_wilayah.toLowerCase().includes(query) ||
                    sub.kecamatan.toLowerCase().includes(query) ||
                    sub.kabkota.toLowerCase().includes(query) ||
                    sub.jenis_wilayah.toLowerCase().includes(query)
                );
                
                console.log('Filtered results:', filtered);
                renderAssessments(filtered);
            });
        }
    });
})();