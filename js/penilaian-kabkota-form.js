(function(){
    // Shared state
    let currentSection = 0;
    let assessmentData = null;

    const PASSING_CRITERIA = {
        'pratama': 110.5,
        'madya': 167.5,
        'mandiri': 232.5
    };

    function initializeFormElements() {
        return {
            form: document.getElementById('formKabKota'),
            dotsWrap: document.getElementById('stepDots'),
            totalScoreEl: document.getElementById('kabTotalScore'),
            sectionScoreEl: document.getElementById('kabSectionScore'),
            statusEl: document.getElementById('kabStatus'),
            pmTotalScore: document.getElementById('pmTotalScore'),
            pmCategory: document.getElementById('pmCategory'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn')
        };
    }

    function validateSelectedAssessment() {
        // Get selected assessment from localStorage
        const storedData = localStorage.getItem('selected_assessment');
        if (!storedData) {
            console.error('No assessment selected');
            alert('Silakan pilih penilaian terlebih dahulu');
            window.location.href = 'penilaian-kabupaten-kota.html';
            return null;
        }

        try {
            const data = JSON.parse(storedData);
            console.log('Using stored assessment data:', data);
            return {
                id: data.id,
                desa: data.nama_wilayah,
                kecamatan: data.kecamatan,
                kabkota: data.kabkota,
                pmAnswers: data.answers,
                pmScore: data.totalScore,
                pmCategory: `Menuju ${data.menuju_kategori.charAt(0).toUpperCase() + data.menuju_kategori.slice(1)}`,
                status: data.status,
                submittedAt: data.submitted_at
            };
        } catch (error) {
            console.error('Failed to parse stored assessment:', error);
            alert('Terjadi kesalahan saat memuat data penilaian');
            window.location.href = 'penilaian-kabupaten-kota.html';
            return null;
        }
    }

    function updatePMSummary(elements, data) {
        if (data.pmScore) {
            elements.pmTotalScore.textContent = parseFloat(data.pmScore).toFixed(2);
            elements.pmCategory.textContent = data.pmCategory || '-';
        } else {
            elements.pmTotalScore.textContent = '0';
            elements.pmCategory.textContent = '-';
        }
    }

    function setupGlobalVariables(elements) {
        window.form = elements.form;
        window.dotsWrap = elements.dotsWrap;
        window.totalSkorEl = elements.totalScoreEl;
        window.sectionSkorEl = elements.sectionScoreEl;
        window.kategoriOutEl = elements.statusEl;
        window.prevBtn = elements.prevBtn;
        window.nextBtn = elements.nextBtn;
    }

    function displayPMAnswers(pmAnswers) {
        // Create info panel for each question to show PM answer
        for (let questionId in pmAnswers) {
            const answer = pmAnswers[questionId];
            const questionEl = document.querySelector(`[name="${questionId}"]`);
            if (questionEl) {
                const pmAnswerInfo = document.createElement('div');
                pmAnswerInfo.className = 'mt-2 p-2 bg-emerald-50 rounded text-sm';
                pmAnswerInfo.innerHTML = `<span class="font-medium">Jawaban Penilaian Mandiri:</span> ${formatAnswer(answer)}`;
                
                const questionContainer = questionEl.closest('.form-group') || questionEl.parentElement;
                questionContainer.appendChild(pmAnswerInfo);
            }
        }
    }

    // Data dummy untuk jawaban penilaian mandiri
    const DUMMY_PM_ANSWERS = {
        'A1': 'a',  // Presentasi Kepala Desa
        'A2': 'a',  // Presentasi Ketua Kader
        'B1': 'd',  // Kebijakan dan Peraturan
        'B2': ['a', 'b', 'c'],  // Upaya pengelolaan lingkungan
        'B3': ['a', 'b'],  // Kegiatan pembinaan
        'B4': 'c',  // Organisasi Kelembagaan
        'B5': ['a', 'b', 'c'],  // Program Kerja Kader
        // Bagian C
        'C1': 'b',
        'C2': 'c',
        'C3': 'd',
        'C4': 'c',
        'C5': 'b',
        'C6': 'c',
        'C7': 'b',
        'C8': 'c',
        // Bagian D
        'D1': 'c',
        'D2': 'b',
        'D3': 'c',
        'D4': 'b',
        'D5': 'c',
        'D6': 'b',
        // Bagian E
        'E1': 'c',
        'E2': 'b',
        // Bagian F
        'F1': 'c',
        'F2': 'b'
    };

    function formatAnswer(answer) {
        if (Array.isArray(answer)) {
            return answer.join(', ');
        }
        return answer;
    }

    function createSections() {
        if (!window.FORM_CONFIG) {
            console.error('FORM_CONFIG not available');
            return [];
        }

        // Display PM answers if available
        if (assessmentData && assessmentData.pmAnswers) {
            displayPMAnswers(assessmentData.pmAnswers);
        }
        return window.FORM_CONFIG.map((sectionConfig, index) => {
            const div = document.createElement('section');
            div.id = `section-${sectionConfig.title.charAt(0)}`;
            div.className = 'space-y-8';
            div.style.display = index === 0 ? 'block' : 'none';

            // Add section title
            const titleEl = document.createElement('h2');
            titleEl.className = 'text-xl font-bold text-emerald-800 mb-4';
            titleEl.textContent = sectionConfig.title;
            div.appendChild(titleEl);

            // Create items container
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'space-y-6';

            // Create form fields for each item
            sectionConfig.items.forEach(item => {
                const fieldHtml = window.fieldHTML(item);
                const temp = document.createElement('div');
                temp.innerHTML = fieldHtml;
                while (temp.firstChild) {
                    itemsContainer.appendChild(temp.firstChild);
                }
            });

            div.appendChild(itemsContainer);
            return div;
        });
    }

    function setupNavigation(elements, sections) {
        if (!elements.prevBtn || !elements.nextBtn || !sections.length) {
            console.error('Navigation setup failed: Missing required elements');
            return;
        }

        elements.prevBtn.addEventListener('click', () => {
            if (currentSection > 0) {
                // Hide current section
                sections[currentSection].style.display = 'none';
                
                // Show previous section
                currentSection--;
                sections[currentSection].style.display = 'block';
                
                // Update button states
                elements.nextBtn.textContent = 'Selanjutnya →';
                elements.prevBtn.classList.toggle('hidden', currentSection === 0);
                elements.nextBtn.classList.remove('hidden');

                // Update section indicators if they exist
                updateStepIndicator(currentSection, sections.length);
            }
        });

        elements.nextBtn.addEventListener('click', () => {
            const isValid = validateCurrentSection(sections[currentSection]);
            
            if (!isValid) {
                alert('Silakan lengkapi semua isian yang wajib diisi pada bagian ini.');
                return;
            }

            if (currentSection < sections.length - 1) {
                // Hide current section
                sections[currentSection].style.display = 'none';
                
                // Show next section
                currentSection++;
                sections[currentSection].style.display = 'block';
                
                // Update button states
                elements.prevBtn.classList.remove('hidden');
                elements.nextBtn.textContent = currentSection === sections.length - 1 ? 'Selesai' : 'Selanjutnya →';

                // Update section indicators
                updateStepIndicator(currentSection, sections.length);
            } else {
                handleFormSubmission();
            }
        });

        // Initially hide all sections except first
        sections.forEach((section, index) => {
            section.style.display = index === 0 ? 'block' : 'none';
        });

        // Create step indicator if not exists
        createStepIndicator(sections.length);
        updateStepIndicator(0, sections.length);
    }

    function validateCurrentSection(section) {
        if (!section) return false;
        
        const requiredInputs = section.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            if (input.type === 'radio') {
                const radioGroup = section.querySelectorAll(`input[name="${input.name}"]`);
                const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                if (!isChecked) {
                    isValid = false;
                    input.closest('div').classList.add('error');
                }
            } else if (input.type === 'checkbox') {
                const checkboxGroup = section.querySelectorAll(`input[name="${input.name}"]`);
                const isChecked = Array.from(checkboxGroup).some(checkbox => checkbox.checked);
                if (!isChecked) {
                    isValid = false;
                    input.closest('div').classList.add('error');
                }
            } else if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            }
        });

        return isValid;
    }

    function createStepIndicator(totalSteps) {
        const dotsContainer = document.getElementById('stepDots');
        if (!dotsContainer) return;

        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSteps; i++) {
            const step = document.createElement('span');
            step.className = 'step-label';
            step.textContent = String.fromCharCode(65 + i); // A, B, C, ...
            dotsContainer.appendChild(step);
        }
    }

    function updateStepIndicator(currentStep, totalSteps) {
        const dots = document.querySelectorAll('.step-label');
        dots.forEach((dot, index) => {
            if (index === currentStep) {
                dot.setAttribute('aria-current', 'step');
            } else {
                dot.removeAttribute('aria-current');
            }
        });
    }

    function calculateCheckboxScore(item, selectedValue) {
        const selectedCount = selectedValue.length;
        let percentage = 0;
        
        // Logika penilaian sesuai nomor
        if (item.no === '2') { // Soal B2
            if (selectedCount === 1) percentage = 0.25;
            else if (selectedCount >= 2 && selectedCount <= 3) percentage = 0.50;
            else if (selectedCount >= 4 && selectedCount <= 5) percentage = 0.75;
            else if (selectedCount >= 6) percentage = 1.0;
            return percentage * 2;
        }
        
        if (item.no === '3') { // Soal B3
            if (selectedCount === 1) percentage = 0.25;
            else if (selectedCount === 2) percentage = 0.50;
            else if (selectedCount === 3) percentage = 0.75;
            else if (selectedCount >= 4) percentage = 1.00;
            return percentage * (item.maxPoints || 1);
        }
        
        // Default checkbox scoring
        if (selectedCount === 1) percentage = 0.25;
        else if (selectedCount === 2) percentage = 0.50;
        else if (selectedCount === 3) percentage = 0.75;
        else if (selectedCount >= 4) percentage = 1.0;
        
        return percentage;
    }

    function calculateCategory(score) {
        if (score >= PASSING_CRITERIA.mandiri) return 'Mandiri';
        if (score >= PASSING_CRITERIA.madya) return 'Madya';
        if (score >= PASSING_CRITERIA.pratama) return 'Pratama';
        return 'Belum Memenuhi';
    }

    function findQuestionConfig(questionId) {
        for (let section of window.FORM_CONFIG) {
            for (let item of section.items) {
                if (item.no === questionId) {
                    return item;
                }
            }
        }
        return null;
    }

    function calculateQuestionScore(question, value) {
        if (!question || !question.weight) return 0;
        let score = 0;

        switch (question.type) {
            case 'radio':
                const option = question.options?.find(opt => opt.value === value);
                score = (option?.score || 0) * question.weight;
                break;

            case 'checkbox':
                score = calculateCheckboxScore(question, value) * question.weight;
                break;

            case 'rwChoice4':
                const rwValue = parseFloat(value) || 0;
                score = rwValue * question.weight;
                break;

            default:
                // For other types, calculate based on whether there's a value
                score = value ? question.weight : 0;
        }

        return score;
    }

    function handleFormSubmission() {
        console.log('Form completed');
        const formData = new FormData(window.form);
        const answers = {};
        let totalScore = 0;
        
        // Collect answers and calculate score
        for (let pair of formData.entries()) {
            answers[pair[0]] = pair[1];
            
            // Find matching question in FORM_CONFIG
            for (let section of window.FORM_CONFIG) {
                for (let item of section.items) {
                    if (item.no === pair[0]) {
                        const weight = item.weight || 0;
                        let score = 0;
                        
                        if (item.type === 'radio') {
                            const selected = item.options.find(opt => opt.value === pair[1]);
                            if (selected) score = selected.score * weight;
                        } else if (item.type === 'checkbox') {
                            // Existing checkbox scoring logic
                            score = calculateCheckboxScore(item, pair[1]) * weight;
                        }
                        
                        totalScore += score;
                    }
                }
            }
        }
        
        // Update assessment data
        assessmentData.answers = answers;
        assessmentData.score = totalScore;
        assessmentData.category = calculateCategory(totalScore);
        assessmentData.status = totalScore >= (assessmentData.pmScore || 0) ? 'VALID' : 'TIDAK VALID';
        assessmentData.completedAt = new Date().toISOString();
            
        // Save completed assessment
        const completedAssessments = JSON.parse(localStorage.getItem('completed_kabkota') || '[]');
        completedAssessments.push(assessmentData);
        localStorage.setItem('completed_kabkota', JSON.stringify(completedAssessments));

        // Clear selected assessment
        localStorage.removeItem('selected_assessment');

        // Redirect to list page
        window.location.href = 'penilaian-kabupaten-kota.html';
    }

    document.addEventListener('DOMContentLoaded', function() {
        console.log('Initializing Kab/Kota form...');
        
        // Wait for FORM_CONFIG to be loaded
        if (!window.FORM_CONFIG) {
            console.error('FORM_CONFIG not loaded. Ensure penilaian-kabkota-static.js is loaded first');
            return;
        }

        // Render form first
        if (typeof render === 'function') {
            render();
            console.log('Initial form render complete');
        } else {
            console.error('render function not found in penilaian-kabkota-static.js');
            return;
        }

        // Add form change handler for real-time score calculation
        document.addEventListener('change', function(e) {
            if (e.target.matches('input, select, textarea')) {
                calculateAndUpdateScore();
            }
        });

        // Function to calculate and update scores
        function calculateAndUpdateScore() {
            let totalScore = 0;
            const formData = new FormData(elements.form);
            
            for (let [name, value] of formData.entries()) {
                const questionConfig = findQuestionConfig(name);
                if (questionConfig) {
                    const score = calculateQuestionScore(questionConfig, value);
                    totalScore += score;
                }
            }
            
            // Update score displays
            if (elements.totalScoreEl) {
                elements.totalScoreEl.textContent = totalScore.toFixed(2);
            }
            
            // Update status based on comparison with PM score
            if (elements.statusEl && assessmentData.pmScore) {
                const status = totalScore >= assessmentData.pmScore ? 'VALID' : 'TIDAK VALID';
                elements.statusEl.textContent = status;
                elements.statusEl.className = `text-lg font-bold ${status === 'VALID' ? 'text-emerald-600' : 'text-red-600'}`;
            }
        }


        // Initialize and validate
        const elements = initializeFormElements();
        assessmentData = validateSelectedAssessment();
        if (!assessmentData) return;

        // Set up form
        updatePMSummary(elements, assessmentData);
        setupGlobalVariables(elements);

        // Create sections from FORM_CONFIG
        const sections = createSections();
        elements.form.innerHTML = '';
        sections.forEach(section => elements.form.appendChild(section));

        // Render form
        if (typeof window.render === 'function') {
            window.render();
            console.log('Form rendered successfully');
            if (sections[0]) {
                sections[0].classList.remove('hidden');
            }
        } else {
            console.error('render function not found');
            return;
        }

        // Add navigation
        if (sections.length > 0) {
            // Create navigation buttons
            const navButtons = document.createElement('div');
            navButtons.className = 'flex flex-wrap items-center justify-between gap-3 mt-6';
            navButtons.innerHTML = `
                <button type="button" class="btn btn-secondary hidden" id="prevBtn">‹ Sebelumnya</button>
                <button type="button" class="btn btn-primary" id="nextBtn">Berikutnya ›</button>
            `;
            elements.form.appendChild(navButtons);
            
            // Update elements with newly created buttons
            elements.prevBtn = document.getElementById('prevBtn');
            elements.nextBtn = document.getElementById('nextBtn');

            // Set up navigation
            setupNavigation(elements, sections);
        }
    });
})();