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
            form: document.getElementById('formProvinsi'),
            dotsWrap: document.getElementById('stepDots'),
            totalScoreEl: document.getElementById('provTotalScore'),
            sectionScoreEl: document.getElementById('provComponentScore'),
            statusEl: document.getElementById('provStatus'),
            deviationEl: document.getElementById('scoreDeviation'),
            mandiriTotalScore: document.getElementById('mandiriTotalScore'),
            mandiriCategory: document.getElementById('mandiriCategory'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn')
        };
    }

    function validateSelectedAssessment() {
        // Get selected assessment from localStorage
        const storedData = localStorage.getItem('selected_assessment_provinsi');
        if (!storedData) {
            console.error('No assessment selected');
            alert('Silakan pilih penilaian terlebih dahulu');
            window.location.href = 'penilaian-provinsi.html';
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
                answers: data.answers,
                score: data.totalScore,
                category: `Menuju ${data.menuju_kategori.charAt(0).toUpperCase() + data.menuju_kategori.slice(1)}`,
                submittedAt: data.submitted_at
            };
        } catch (error) {
            console.error('Failed to parse stored assessment:', error);
            alert('Terjadi kesalahan saat memuat data penilaian');
            window.location.href = 'penilaian-provinsi.html';
            return null;
        }
    }

    function updateMandiriSummary(elements, data) {
        if (data.score) {
            elements.mandiriTotalScore.textContent = parseFloat(data.score).toFixed(2);
            elements.mandiriCategory.textContent = data.category || '-';
        } else {
            elements.mandiriTotalScore.textContent = '0';
            elements.mandiriCategory.textContent = '-';
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

    function displayMandiriAnswers(answers) {
        console.log('Displaying mandiri answers:', answers);
        // Create info panel for each question to show self-assessment answers
        for (let questionId in answers) {
            console.log('Processing question:', questionId);
            const answer = answers[questionId];
            let questionEl = document.querySelector(`[name="${questionId}"]`);
            
            // If can't find by name, try finding by no attribute
            if (!questionEl) {
                questionEl = document.querySelector(`[data-no="${questionId}"]`);
            }
            
            if (questionEl) {
                console.log('Found element for question:', questionId);
                const answersInfo = document.createElement('div');
                answersInfo.className = 'mandiri-answer-info mt-3';
                
                // Get question config
                const questionConfig = findQuestionConfig(questionId);
                console.log('Question config:', questionConfig);
                
                // Format mandiri answer
                const mandiriAnswer = questionConfig ? formatDetailedAnswer(answer, questionConfig) : formatAnswer(answer);
                
                answersInfo.innerHTML = `
                    <div class="border border-blue-200 rounded-lg p-3 bg-blue-50">
                        <div class="label text-blue-700 text-sm">Jawaban Penilaian Mandiri:</div>
                        <div class="value bg-white">${mandiriAnswer || '-'}</div>
                    </div>
                `;
                
                // Find the appropriate container - first try parent div, then go up to find suitable container
                let container = questionEl;
                while (container && !container.classList.contains('space-y-2') && !container.classList.contains('form-group')) {
                    container = container.parentElement;
                }
                
                if (container) {
                    container.appendChild(answersInfo);
                } else {
                    // Fallback to inserting after the question element
                    questionEl.parentElement.insertBefore(answersInfo, questionEl.nextSibling);
                }
            } else {
                console.warn('Question element not found for:', questionId);
            }
        }
    }

    function formatDetailedAnswer(answer, questionConfig) {
        if (!answer) return '-';
        
        if (questionConfig.type === 'radio') {
            if (typeof answer === 'object') {
                let formattedAnswer = [];
                if (answer.kabkota) {
                    const kabOption = questionConfig.options.find(opt => opt.value === answer.kabkota);
                    if (kabOption) formattedAnswer.push(kabOption.label);
                }
                if (answer.mandiri) {
                    const mandiriOption = questionConfig.options.find(opt => opt.value === answer.mandiri);
                    if (mandiriOption) formattedAnswer.push(mandiriOption.label);
                }
                return formattedAnswer.join(' / ');
            } else {
                const option = questionConfig.options.find(opt => opt.value === answer);
                return option ? option.label : answer;
            }
        } else if (questionConfig.type === 'checkbox') {
            if (typeof answer === 'object') {
                let formattedAnswer = [];
                if (Array.isArray(answer.kabkota)) {
                    const kabLabels = answer.kabkota.map(value => {
                        const option = questionConfig.options.find(opt => opt.value === value);
                        return option ? option.label : value;
                    });
                    formattedAnswer.push(kabLabels.join(', '));
                }
                if (Array.isArray(answer.mandiri)) {
                    const mandiriLabels = answer.mandiri.map(value => {
                        const option = questionConfig.options.find(opt => opt.value === value);
                        return option ? option.label : value;
                    });
                    formattedAnswer.push(mandiriLabels.join(', '));
                }
                return formattedAnswer.join(' / ');
            } else if (Array.isArray(answer)) {
                return answer.map(value => {
                    const option = questionConfig.options.find(opt => opt.value === value);
                    return option ? option.label : value;
                }).join(', ');
            }
        }
        return formatAnswer(answer);
    }

    // Data dummy untuk jawaban penilaian kabupaten/kota
    const DUMMY_KAB_ANSWERS = {
        'A1': {  // Presentasi Kepala Desa
            kabkota: 'a', 
            mandiri: 'b'
        },
        'A2': {  // Presentasi Ketua Kader
            kabkota: 'a',
            mandiri: 'a'
        },
        'B1': {  // Kebijakan dan Peraturan
            kabkota: 'd',
            mandiri: 'c'
        },
        'B2': {  // Upaya pengelolaan lingkungan
            kabkota: ['a', 'b', 'c'],
            mandiri: ['a', 'b', 'd']
        },
        'B3': {  // Kegiatan pembinaan
            kabkota: ['a', 'b'],
            mandiri: ['a', 'c']
        },
        'B4': {  // Organisasi Kelembagaan
            kabkota: 'c',
            mandiri: 'b'
        },
        'B5': {  // Program Kerja Kader
            kabkota: ['a', 'b', 'c'],
            mandiri: ['b', 'c', 'd']
        },
        // Bagian C
        'C1': {
            kabkota: 'b',
            mandiri: 'c'
        },
        'C2': {
            kabkota: 'c',
            mandiri: 'b'
        },
        'C3': {
            kabkota: 'd',
            mandiri: 'c'
        },
        'C4': {
            kabkota: 'c',
            mandiri: 'c'
        },
        'C5': {
            kabkota: 'b',
            mandiri: 'b'
        },
        'C6': {
            kabkota: 'c',
            mandiri: 'd'
        },
        'C7': {
            kabkota: 'b',
            mandiri: 'b'
        },
        'C8': {
            kabkota: 'c',
            mandiri: 'c'
        },
        // Bagian D
        'D1': {
            kabkota: 'c',
            mandiri: 'b'
        },
        'D2': {
            kabkota: 'b',
            mandiri: 'c'
        },
        'D3': {
            kabkota: 'c',
            mandiri: 'c'
        },
        'D4': {
            kabkota: 'b',
            mandiri: 'b'
        },
        'D5': {
            kabkota: 'c',
            mandiri: 'b'
        },
        'D6': {
            kabkota: 'b',
            mandiri: 'c'
        },
        // Bagian E
        'E1': {
            kabkota: 'c',
            mandiri: 'b'
        },
        'E2': {
            kabkota: 'b',
            mandiri: 'c'
        },
        // Bagian F
        'F1': {
            kabkota: 'c',
            mandiri: 'b'
        },
        'F2': {
            kabkota: 'b',
            mandiri: 'c'
        }
    };

    function formatAnswer(answer) {
        if (!answer) return '-';
        
        if (typeof answer === 'object') {
            let formatted = [];
            if (answer.kabkota) formatted.push(Array.isArray(answer.kabkota) ? answer.kabkota.join(', ') : answer.kabkota);
            if (answer.mandiri) formatted.push(Array.isArray(answer.mandiri) ? answer.mandiri.join(', ') : answer.mandiri);
            return formatted.join(' / ');
        } else if (Array.isArray(answer)) {
            return answer.join(', ');
        }
        return String(answer);
    }

    function createSections() {
        if (!window.FORM_CONFIG) {
            console.error('FORM_CONFIG not available');
            return [];
        }

        // Display Kab/Kota answers if available
        if (assessmentData && assessmentData.kabAnswers) {
            displayKabAnswers(assessmentData.kabAnswers);
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
        
        // Collect answers and calculate score using consistent scoring system
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
                            if (Array.isArray(pair[1])) {
                                score = calculateCheckboxScore(item, pair[1]) * weight;
                            } else {
                                // Handle single checkbox value as array
                                score = calculateCheckboxScore(item, [pair[1]]) * weight;
                            }
                        } else if (item.type === 'rwChoice4') {
                            // Calculate RW score - average of selected values
                            const rwValue = parseFloat(pair[1]) || 0;
                            score = rwValue * weight;
                        }
                        
                        totalScore += score;
                    }
                }
            }
        }

        // Calculate deviation from mandiri score using the same scoring system
        const deviation = Math.abs(((totalScore - assessmentData.score) / assessmentData.score) * 100);
        const isValid = deviation <= window.provinsiValidation.MAX_SCORE_DEVIATION;
        
        // Update assessment data
        assessmentData.answers = answers;
        assessmentData.provinsiScore = totalScore;
        assessmentData.category = calculateCategory(totalScore);
        assessmentData.status = isValid ? 'VALID' : 'TIDAK VALID';
        assessmentData.scoreDeviation = deviation;
        assessmentData.completedAt = new Date().toISOString();
            
        // Save completed assessment
        const completedAssessments = JSON.parse(localStorage.getItem('completed_provinsi') || '[]');
        completedAssessments.push(assessmentData);
        localStorage.setItem('completed_provinsi', JSON.stringify(completedAssessments));

        // Clear selected assessment
        localStorage.removeItem('selected_assessment_provinsi');

        // Redirect to list page
        window.location.href = 'penilaian-provinsi.html';
    }

    document.addEventListener('DOMContentLoaded', function() {
        console.log('Initializing Provinsi form...');
        
        // Wait for FORM_CONFIG to be loaded
        if (!window.FORM_CONFIG) {
            console.error('FORM_CONFIG not loaded. Ensure penilaian-provinsi-static.js is loaded first');
            return;
        }

        // Initialize and validate
        const elements = initializeFormElements();
        assessmentData = validateSelectedAssessment();
        if (!assessmentData) return;

        // Set up form
        updateKabSummary(elements, assessmentData);
        setupGlobalVariables(elements);

        // Create sections from FORM_CONFIG
        const sections = createSections();
        elements.form.innerHTML = '';
        sections.forEach(section => elements.form.appendChild(section));

        // Display answers
        if (assessmentData && assessmentData.kabAnswers) {
            displayKabAnswers(assessmentData.kabAnswers);
        }

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
        if (sections.length > 0) {
            setupNavigation(elements, sections);
        }

        // Add form change handler for real-time score calculation
        document.addEventListener('change', function(e) {
            if (e.target.matches('input, select, textarea')) {
                calculateAndUpdateScore();
            }
        });

        // Initial calculation
        calculateAndUpdateScore();
        
        // Set up input handlers
        setupFieldHandlers();

        console.log('Form initialization completed');
    });

    // Utility functions
    function calculateAndUpdateScore() {
        let totalScore = 0;
        let componentScore = 0;

        const formData = new FormData(elements.form);
        
        for (let [name, value] of formData.entries()) {
            const questionConfig = findQuestionConfig(name);
            if (questionConfig) {
                const score = calculateQuestionScore(questionConfig, value);
                totalScore += score;
                componentScore += score;
            }
        }
        
        // Update score displays
        if (elements.totalScoreEl) {
            elements.totalScoreEl.textContent = totalScore.toFixed(2);
        }

        if (elements.componentScoreEl) {
            elements.componentScoreEl.textContent = componentScore.toFixed(2); 
        }
        
        // Update status based on comparison with kabupaten score
        if (elements.statusEl && assessmentData.kabScore) {
            const status = totalScore >= assessmentData.kabScore ? 'VALID' : 'TIDAK VALID';
            elements.statusEl.textContent = status;
            elements.statusEl.className = `text-lg font-bold ${status === 'VALID' ? 'text-emerald-600' : 'text-red-600'}`;
        }
    }

    function setupFieldHandlers() {
        const form = elements.form;

        // Set up table visibility handlers
        const tableConfigs = [
            { trigger: 'C4', table: 'C4-table', showOn: ['b', 'c', 'd'] },
            { trigger: 'C7', table: 'C7-table', showOn: ['b', 'c', 'd'] },
            { trigger: 'F1', table: 'F1-table', showOn: ['b', 'c', 'd'] }
        ];

        tableConfigs.forEach(config => {
            const radioButtons = form.querySelectorAll(`input[name^="${config.trigger}_"]`);
            const table = document.getElementById(config.table);

            if (table && radioButtons.length) {
                radioButtons.forEach(radio => {
                    radio.addEventListener('change', () => {
                        const shouldShow = config.showOn.includes(radio.value);
                        table.classList.toggle('hidden', !shouldShow);

                        const inputs = table.querySelectorAll('input');
                        inputs.forEach(input => {
                            input.required = shouldShow;
                        });
                    });
                });
            }
        });

        // Set up calculation handlers
        const scoreInputs = form.querySelectorAll('input[data-score]');
        scoreInputs.forEach(input => {
            input.addEventListener('change', calculateAndUpdateScore);
        });
    }
})();