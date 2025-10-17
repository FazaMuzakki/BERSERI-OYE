/* Fungsi validasi untuk form penilaian provinsi */
(function() {
    // Maximum allowed score deviation (in percentage)
    const MAX_SCORE_DEVIATION = 10; // 10% deviation allowed

    // Category score thresholds
    const CATEGORY_THRESHOLDS = {
        MANDIRI: 232.5,
        MADYA: 167.5,
        PRATAMA: 110.5
    };

    // Validate if provincial score is within acceptable deviation from self-assessment score
    function validateScoreDeviation(mandiriScore, provScore) {
        if (!mandiriScore || !provScore) return false;
        
        const maxDeviation = MAX_SCORE_DEVIATION / 100;
        const lowerBound = mandiriScore * (1 - maxDeviation);
        const upperBound = mandiriScore * (1 + maxDeviation);
        
        // Provincial score must be within ±10% of self-assessment score
        const isValid = provScore >= lowerBound && provScore <= upperBound;
        
        console.log('Score validation:', {
            kabScore,
            provScore,
            lowerBound,
            upperBound,
            maxDeviation,
            isValid
        });
        
        return isValid;
    }

    // Validate section scores against minimum requirements
    function validateSectionScores(sections, formConfig = window.FORM_CONFIG) {
        if (!formConfig) {
            console.error('Form configuration not available');
            return false;
        }

        let isValid = true;
        let sectionResults = [];

        sections.forEach((section, idx) => {
            const config = formConfig[idx];
            if (!config) return;

            let sectionScore = 0;
            let maxSectionScore = 0;

            // Calculate actual and max possible scores
            config.items.forEach(item => {
                const weight = item.weight || 0;
                maxSectionScore += weight;

                const value = getValue(item.no);
                sectionScore += calculateScore(item, value);
            });

            // Section must achieve at least 60% of its maximum possible score
            const minRequired = maxSectionScore * 0.6;
            const sectionValid = sectionScore >= minRequired;

            sectionResults.push({
                title: config.title,
                score: sectionScore,
                maxScore: maxSectionScore,
                minRequired,
                isValid: sectionValid
            });

            if (!sectionValid) isValid = false;
        });

        console.log('Section validation results:', sectionResults);
        return { isValid, sections: sectionResults };
    }

    // Get field value helper
    function getValue(fieldName) {
        const form = document.getElementById('formProvinsi');
        if (!form) return null;

        const elements = form.querySelectorAll(`[name="${fieldName}"]`);
        if (!elements.length) return null;

        const element = elements[0];
        if (element.type === 'radio') {
            const checked = form.querySelector(`[name="${fieldName}"]:checked`);
            return checked ? checked.value : null;
        }
        if (element.type === 'checkbox') {
            return Array.from(elements)
                .filter(el => el.checked)
                .map(el => el.value);
        }
        return element.value;
    }

    // Calculate score for a form item
    function calculateScore(item, value) {
        if (!value) return 0;
        
        const weight = item.weight || 0;
        let score = 0;

        if (item.type === 'radio') {
            const option = item.options?.find(opt => opt.value === value);
            score = (option?.score || 0) * weight;
        }
        else if (item.type === 'checkbox' && Array.isArray(value)) {
            // Special scoring rules for checkbox questions
            const selectedCount = value.length;
            let multiplier = 0;

            switch(item.no) {
                case 'B2': // Upaya pengelolaan lingkungan
                    if (selectedCount === 1) multiplier = 0.25;
                    else if (selectedCount <= 3) multiplier = 0.50;
                    else if (selectedCount <= 5) multiplier = 0.75;
                    else multiplier = 1.0;
                    break;
                    
                case 'B3': // Kegiatan pembinaan
                    if (selectedCount === 1) multiplier = 0.25;
                    else if (selectedCount === 2) multiplier = 0.50;
                    else if (selectedCount === 3) multiplier = 0.75;
                    else multiplier = 1.0;
                    break;
                    
                default: // Default checkbox scoring
                    if (selectedCount === 1) multiplier = 0.25;
                    else if (selectedCount === 2) multiplier = 0.50;
                    else if (selectedCount === 3) multiplier = 0.75;
                    else multiplier = 1.0;
            }
            
            score = multiplier * weight;
        }
        else if (item.type === 'rwChoice4') {
            // Calculate RW score - average of selected values
            let sum = 0, count = 0;
            for (let i = 1; i <= 4; i++) {
                const val = parseFloat(getValue(`${item.no}_${i}`));
                if (!isNaN(val)) {
                    sum += val;
                    count++;
                }
            }
            score = count > 0 ? (sum / count) * weight : 0;
        }

        return score;
    }

    // Validate if all required fields are filled
    function validateRequiredFields(form) {
        if (!form) return false;

        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        let emptyFields = [];

        requiredFields.forEach(field => {
            const fieldContainer = field.closest('.form-group') || field.parentElement;
            
            if (field.type === 'radio') {
                const radioGroup = form.querySelectorAll(`[name="${field.name}"]`);
                const isChecked = Array.from(radioGroup).some(r => r.checked);
                if (!isChecked) {
                    isValid = false;
                    emptyFields.push(field.name);
                    fieldContainer?.classList.add('error');
                } else {
                    fieldContainer?.classList.remove('error');
                }
            }
            else if (field.type === 'checkbox') {
                const checkboxGroup = form.querySelectorAll(`[name="${field.name}"]`);
                const isChecked = Array.from(checkboxGroup).some(c => c.checked);
                if (!isChecked) {
                    isValid = false;
                    emptyFields.push(field.name);
                    fieldContainer?.classList.add('error');
                } else {
                    fieldContainer?.classList.remove('error');
                }
            }
            else if (!field.value.trim()) {
                isValid = false;
                emptyFields.push(field.name);
                fieldContainer?.classList.add('error');
            } else {
                fieldContainer?.classList.remove('error');
            }
        });

        if (!isValid) {
            console.warn('Empty required fields:', emptyFields);
        }

        return isValid;
    }

    // Add validation results to the form
    function displayValidationResults(isValid, mandiriScore, provScore) {
        const statusEl = document.getElementById('provStatus');
        const deviationEl = document.getElementById('scoreDeviation');
        if (!statusEl) return;

        const status = isValid ? 'VALID' : 'TIDAK VALID';
        const color = isValid ? 'text-emerald-600' : 'text-red-600';
        
        statusEl.textContent = status;
        statusEl.className = `text-lg font-bold ${color}`;

        // Show score deviation if both scores are available
        if (deviationEl && mandiriScore && provScore) {
            const deviation = Math.abs(((provScore - mandiriScore) / mandiriScore) * 100).toFixed(1);
            deviationEl.textContent = `Deviasi: ${deviation}%`;
            deviationEl.className = `text-sm ${deviation <= MAX_SCORE_DEVIATION ? 'text-emerald-600' : 'text-red-600'}`;
        }
    }

    // Validate category based on total score
    function validateCategory(score) {
        if (score >= CATEGORY_THRESHOLDS.MANDIRI) return 'MANDIRI';
        if (score >= CATEGORY_THRESHOLDS.MADYA) return 'MADYA';
        if (score >= CATEGORY_THRESHOLDS.PRATAMA) return 'PRATAMA';
        return 'BELUM MEMENUHI';
    }

    // Export functions to window object
    window.provinsiValidation = {
        validateScoreDeviation,
        validateSectionScores,
        validateRequiredFields,
        displayValidationResults,
        validateCategory,
        CATEGORY_THRESHOLDS,
        MAX_SCORE_DEVIATION
    };
})();