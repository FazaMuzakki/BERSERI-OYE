/* Fungsi validasi untuk form penilaian kabupaten/kota */
(function() {
    // Validate if kab/kota score is within acceptable deviation from mandiri score
    function validateScoreDeviation(pmScore, kabScore) {
        const maxDeviation = window.VALIDATION_RULES.maxDeviation / 100;
        const lowerBound = pmScore * (1 - maxDeviation);
        const upperBound = pmScore * (1 + maxDeviation);
        return kabScore >= lowerBound && kabScore <= upperBound;
    }

    // Validate section scores against minimum requirements
    function validateSectionScores(sections) {
        for (let section of sections) {
            const maxScore = window.SECTION_MAX_SCORES[section.title];
            const minRequired = maxScore * window.VALIDATION_RULES.minSectionScore;
            if (section.score < minRequired) {
                return false;
            }
        }
        return true;
    }

    // Validate if all required fields are filled
    function validateRequiredFields(form) {
        const requiredFields = form.querySelectorAll('[required]');
        for (let field of requiredFields) {
            if (!field.value) {
                return false;
            }
        }
        return true;
    }

    // Add validation results to the form
    function displayValidationResults(isValid, pmScore, kabScore) {
        const statusEl = document.getElementById('kabStatus');
        if (!statusEl) return;

        const status = isValid ? 'VALID' : 'TIDAK VALID';
        const color = isValid ? 'text-emerald-600' : 'text-red-600';
        
        statusEl.textContent = status;
        statusEl.className = `text-lg font-bold ${color}`;
    }

    // Export functions to window object
    window.kabkotaValidation = {
        validateScoreDeviation,
        validateSectionScores,
        validateRequiredFields,
        displayValidationResults
    };
})();