// Constants
const CONDITIONAL_TABLES = {
    'C4': 'C4-table',
    'C7': 'C7-table', 
    'F1': 'F1-table'
};

// Helper functions
function getForm() {
    return document.getElementById('formProvinsi');
}

function getElements() {
    return {
        form: getForm(),
        totalScoreEl: document.getElementById('provTotalScore'),
        componentScoreEl: document.getElementById('provComponentScore'),
        statusEl: document.getElementById('provStatus'),
        kabTotalScore: document.getElementById('kabTotalScore'),
        kabCategory: document.getElementById('kabCategory'),
        deviationEl: document.getElementById('scoreDeviation'),
        dotsContainer: document.getElementById('stepDots')
    };
}

// Form rendering and initialization
window.render = function() {
    console.log('Initializing provinsi form...');

    const elements = getElements();
    if (!elements.form) {
        console.error('Form element not found!');
        return;
    }

    // Ensure form config is loaded
    if (!window.FORM_CONFIG) {
        console.error('FORM_CONFIG not loaded!');
        return;
    }

    // Create sections
    const sections = createFormSections();
    if (!sections.length) {
        console.error('No sections created!');
        return;
    }

    // Clear and rebuild form
    elements.form.innerHTML = '';
    sections.forEach(section => elements.form.appendChild(section));

    // Add navigation
    appendNavigationButtons(elements.form);

    // Update navigation elements
    elements.prevBtn = document.getElementById('prevBtn');
    elements.nextBtn = document.getElementById('nextBtn');

    // Setup handlers
    setupFormHandlers(elements, sections);

    console.log('Form initialization completed');
}

function createFormSections() {
    return window.FORM_CONFIG.map((sectionConfig, index) => {
        // Create section container
        const section = document.createElement('section');
        section.id = `section-${sectionConfig.title.charAt(0)}`;
        section.className = 'space-y-8';
        section.style.display = index === 0 ? 'block' : 'none';
        
        // Add section title
        appendSectionTitle(section, sectionConfig.title);
        
        // Create form fields
        const fieldsContainer = document.createElement('div');
        fieldsContainer.className = 'space-y-6';
        appendFormFields(fieldsContainer, sectionConfig.items);
        section.appendChild(fieldsContainer);

        return section;
    });
}

function appendSectionTitle(section, title) {
    const titleEl = document.createElement('h2');
    titleEl.className = 'text-xl font-bold text-emerald-800 mb-4';
    titleEl.textContent = title;
    section.appendChild(titleEl);
}

function appendFormFields(container, items) {
    items.forEach(item => {
        if (typeof window.fieldHTML !== 'function') {
            console.error('fieldHTML function not found!');
            return;
        }
        
        const fieldHtml = window.fieldHTML(item);
        const temp = document.createElement('div');
        temp.innerHTML = fieldHtml;
        
        while (temp.firstChild) {
            container.appendChild(temp.firstChild);
        }
    });
}

function appendNavigationButtons(form) {
    const navButtons = document.createElement('div');
    navButtons.className = 'flex flex-wrap items-center justify-between gap-3 mt-6';
    navButtons.innerHTML = `
        <button type="button" class="btn btn-secondary hidden" id="prevBtn">‹ Sebelumnya</button>
        <button type="button" class="btn btn-primary" id="nextBtn">Berikutnya ›</button>
    `;
    form.appendChild(navButtons);
}

function setupFormHandlers(elements, sections) {
    // Set up navigation
    if (typeof window.setupNavigation === 'function') {
        window.setupNavigation(sections, elements.prevBtn, elements.nextBtn);
    }

    // Set up form change handlers
    setupChangeHandlers(elements);

    // Set up conditional field visibility
    setupConditionalFields();

    // Set up initial score calculation
    calculateAndUpdateScores(elements);
}

function setupChangeHandlers(elements) {
    if (!elements.form) return;

    elements.form.addEventListener('change', (e) => {
        if (e.target.matches('input, select, textarea')) {
            calculateAndUpdateScores(elements);
        }
    });

    elements.form.addEventListener('input', (e) => {
        if (e.target.matches('input[type="number"]')) {
            calculateAndUpdateScores(elements);
        }
    });
}

function setupConditionalFields() {
    // Set up visibility rules for conditional tables
    Object.entries(CONDITIONAL_TABLES).forEach(([questionId, tableId]) => {
        const radioButtons = document.querySelectorAll(`input[name^="${questionId}_"]`);
        const tableDiv = document.getElementById(tableId);
        
        if (!tableDiv || !radioButtons.length) return;

        // Initial hide
        tableDiv.classList.add('hidden');
        
        // Add change listeners
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => {
                const shouldShow = ['b', 'c', 'd'].includes(radio.value);
                tableDiv.classList.toggle('hidden', !shouldShow);
                
                // Toggle required state of inputs
                const inputs = tableDiv.querySelectorAll('input');
                inputs.forEach(input => input.required = shouldShow);
            });
        });
    });
}

function calculateAndUpdateScores(elements) {
    if (!elements.form) return;
    
    let totalScore = 0;
    let componentScore = 0;
    
    const formData = new FormData(elements.form);
    formData.forEach((value, name) => {
        for (const section of window.FORM_CONFIG) {
            const item = section.items.find(item => item.no === name);
            if (item) {
                const score = calculateItemScore(item, value);
                totalScore += score;
                componentScore += score;
            }
        }
    });

    // Update score displays
    updateScoreDisplays(elements, totalScore, componentScore);
}

function calculateItemScore(item, value) {
    if (!item || !item.weight) return 0;

    switch (item.type) {
        case 'radio':
            const option = item.options?.find(opt => opt.value === value);
            return (option?.score || 0) * item.weight;
            
        case 'checkbox':
            return calculateCheckboxScore(item, value);
            
        case 'rwChoice4':
            return calculateRWScore(item);
            
        default:
            return value ? item.weight : 0;
    }
}

function calculateCheckboxScore(item, selectedValues) {
    if (!Array.isArray(selectedValues)) return 0;
    
    const count = selectedValues.length;
    const weight = item.weight || 0;
    let multiplier = 0;

    // Special scoring rules
    switch(item.no) {
        case 'B2': // Upaya pengelolaan lingkungan
            if (count === 1) multiplier = 0.25;
            else if (count <= 3) multiplier = 0.50;
            else if (count <= 5) multiplier = 0.75;
            else multiplier = 1.0;
            break;
            
        case 'B3': // Kegiatan pembinaan
            if (count === 1) multiplier = 0.25;
            else if (count === 2) multiplier = 0.50;
            else if (count === 3) multiplier = 0.75;
            else multiplier = 1.0;
            break;
            
        default:
            multiplier = Math.min(count / 4, 1); // 25% per item up to 100%
    }

    return multiplier * weight;
}

function calculateRWScore(item) {
    let sum = 0, count = 0;
    const form = getForm();
    if (!form) return 0;

    // Calculate average of all RW values
    for (let i = 1; i <= 4; i++) {
        const input = form.querySelector(`[name="${item.no}_${i}"]`);
        if (input && input.value) {
            const val = parseFloat(input.value);
            if (!isNaN(val)) {
                sum += val;
                count++;
            }
        }
    }

    return count > 0 ? (sum / count) * (item.weight || 0) : 0;
}

function updateScoreDisplays(elements, totalScore, componentScore) {
    // Update total score
    if (elements.totalScoreEl) {
        elements.totalScoreEl.textContent = totalScore.toFixed(2);
    }

    // Update component score
    if (elements.componentScoreEl) {
        elements.componentScoreEl.textContent = componentScore.toFixed(2);
    }

    // Update validation status
    if (elements.statusEl && elements.kabTotalScore) {
        const kabScore = parseFloat(elements.kabTotalScore.textContent || '0');
        const isValid = window.provinsiValidation.validateScoreDeviation(kabScore, totalScore);
        window.provinsiValidation.displayValidationResults(isValid, kabScore, totalScore);
    }
}