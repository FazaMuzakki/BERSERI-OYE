(function(){
    'use strict';
    
    // Allow init to be called when config is ready
    let initialized = false;

    // Global state
    let selectedAssessment = null;
    let totalSkor = 0;
    let komponenScores = {
        'A': 0, // Kepemimpinan
        'B': 0, // Kelembagaan
        'C': 0, // Pengelolaan Sampah
        'D': 0, // RTH
        'E': 0, // Konservasi Energi
        'F': 0  // Konservasi Air
    };
    let answeredQuestions = 0;
    let totalQuestions = 0;
    
    // Expose initialization function
    window.initPenilaianLapangan = function() {
        if (initialized) {
            console.log('Penilaian Lapangan form already initialized');
            return;
        }

        console.log('Initializing Penilaian Lapangan form...');

        try {
            // Check for form configs and proper loading
            if (typeof window.LAPANGAN_CONFIG === 'undefined' || !window.LAPANGAN_CONFIG || !window.LAPANGAN_CONFIG.sections) {
                throw new Error('LAPANGAN_CONFIG tidak ditemukan! Pastikan penilaian-lapangan-form-config.js dimuat terlebih dahulu');
            }

            console.log('Config loaded with sections:', window.LAPANGAN_CONFIG.sections.length);
            window.LAPANGAN_CONFIG.sections.forEach((section, index) => {
                console.log(`Section ${index + 1}: ${section.title} with ${section.items?.length || 0} items`);
            });

            // Use LAPANGAN_CONFIG instead of FORM_CONFIG
            window.FORM_CONFIG = window.LAPANGAN_CONFIG.sections;

            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeFormOnLoad);
            } else {
                initializeFormOnLoad();
            }

            initialized = true;
            console.log('Form setup complete');

        } catch (error) {
            console.error('Error initializing form:', error);
            alert('Terjadi kesalahan saat memuat form: ' + error.message);
        }
    };

    function initializeFormOnLoad() {
        console.log('DOM loaded, starting form initialization');
        
        try {
            if (validateSelectedAssessment()) {
                console.log('Assessment data validated, rendering form...');
                
                // Initialize DOM elements first
                let formContainer = document.getElementById('formLapangan');
                let summaryElements = document.getElementById('penilaianSummary');
                
                if (!formContainer) {
                    throw new Error('Form container element not found!');
                }
                
                // Clear existing content
                formContainer.innerHTML = '';
                
                // Render form and setup event handlers
                renderForm();
                
                console.log('Updating summaries...');
                updatePMSummary();
                loadSkorFromStorage();
                
                // Set up event listeners after DOM is populated
                setupFormEventListeners();
                
                console.log('Form initialization complete');
            } else {
                console.warn('Assessment validation failed');
                window.location.href = 'penilaian-lapangan.html';
                return;
            }
        } catch (error) {
            console.error('Error during form initialization:', error);
            alert('Terjadi kesalahan saat memuat form. Silakan muat ulang halaman.');
        }
    }

    function setupTableVisibilityControls() {
    // Table configuration
    const tableConfig = {
        'C4-table': {
            optionSelector: 'input[name="C4"]',
            showOnValues: ['b', 'c', 'd']
        },
        'C5-table': {
            optionSelector: 'input[name="C5"]',
            showOnValues: ['c', 'd']  // Changed from 'a' to ['c', 'd'] per requirements
        },
        'C7-table': {
            optionSelector: 'input[name="C7"]',
            showOnValues: ['b', 'c', 'd']
        }
    };

    // Handle each table
    Object.entries(tableConfig).forEach(([tableId, config]) => {
        const table = document.getElementById(tableId);
        const options = document.querySelectorAll(config.optionSelector);
        
        if (table && options.length > 0) {
            // Check initial state
            const selectedOption = document.querySelector(`${config.optionSelector}:checked`);
            table.classList.toggle('hidden', !(selectedOption && config.showOnValues.includes(selectedOption.value)));
            
            // Set up event listeners for options
            options.forEach(option => {
                option.addEventListener('change', () => {
                    const shouldShow = config.showOnValues.includes(option.value);
                    table.classList.toggle('hidden', !shouldShow);
                    
                    // If table has required inputs, update their required status
                    const inputs = table.querySelectorAll('input, select, textarea');
                    inputs.forEach(input => {
                        input.required = shouldShow;
                    });
                });
            });
        } else {
            console.warn(`Table ${tableId} or its options not found`);
        }
    });
}

    // Setup form event listeners
    function setupFormEventListeners() {
        // Set up event listeners for navigation buttons
        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.addEventListener('click', function() {
                window.location.href = 'penilaian-lapangan.html';
            });
        }

        const saveButton = document.getElementById('saveButton');
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                try {
                    saveSkorToStorage();
                    
                    if (selectedAssessment) {
                        selectedAssessment.status = 'Sudah Dinilai';
                        selectedAssessment.skor_lapangan = totalSkor;
                        localStorage.setItem('penilaian_lapangan_selected', JSON.stringify(selectedAssessment));
                    }
                    
                    alert('Data penilaian berhasil disimpan!');
                } catch (error) {
                    console.error('Error saving assessment:', error);
                    alert('Terjadi kesalahan saat menyimpan data.');
                }
            });
        }
    }

    // Track current step
    let currentStep = 1;
    const totalSteps = 6; // A to F

    // Function to show specific step
    function showStep(step) {
        if (!window.LAPANGAN_CONFIG || !window.LAPANGAN_CONFIG.sections) {
            console.error('LAPANGAN_CONFIG is not properly loaded!');
            return;
        }
        
        document.querySelectorAll('[data-step]').forEach(section => {
            section.style.display = section.getAttribute('data-step') == step ? 'block' : 'none';
        });

        // Update buttons
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        
        if (prevBtn) {
            prevBtn.style.display = step > 1 ? 'block' : 'none';
        }
        if (nextBtn) {
            nextBtn.innerHTML = step === totalSteps ? 'Selesai ›' : 'Berikutnya ›';
        }

        // Update step indicators
        document.querySelectorAll('.step-label').forEach(label => {
            const labelStep = Array.from(label.parentElement.children).indexOf(label) + 1;
            if (labelStep === step) {
                label.setAttribute('aria-current', 'step');
            } else {
                label.removeAttribute('aria-current');
            }
        });

        currentStep = step;
    }

    // Fungsi untuk merender form berdasarkan config
    function renderForm() {
        console.log('Starting form render');
        const formContainer = document.getElementById('formLapangan');
        if (!formContainer) {
            console.error('Form container not found');
            return;
        }

        try {
            if (!window.LAPANGAN_CONFIG || !window.LAPANGAN_CONFIG.sections) {
                throw new Error('Form configuration not found');
            }

            console.log('Rendering sections:', window.LAPANGAN_CONFIG.sections.length);
            
            // Clear existing content
            formContainer.innerHTML = '';

            // Create form sections
            window.LAPANGAN_CONFIG.sections.forEach((section, sectionIndex) => {
                const sectionEl = document.createElement('section');
                sectionEl.className = 'card p-6 mb-6';
                sectionEl.setAttribute('data-step', String(sectionIndex + 1));
                sectionEl.style.display = sectionIndex === 0 ? 'block' : 'none';
                
                console.log('Rendering section:', section.title, 'with', section.items?.length || 0, 'items');
                
                let html = `<h2 class="text-xl font-bold text-emerald-800 mb-4">${section.title}</h2>
                           <div class="space-y-6">`;

                // Render each question/item in the section
                if (Array.isArray(section.items)) {
                    section.items.forEach(item => {
                        html += renderFormItem(item, section.title.charAt(0));
                    });
                }

                html += '</div>';
                sectionEl.innerHTML = html;
                formContainer.appendChild(sectionEl);
            });

            // Add navigation section
            const nav = document.createElement('div');
            nav.className = 'flex justify-between mt-6';
            nav.innerHTML = `
                <button type="button" id="prevStep" class="btn btn-secondary hidden">‹ Sebelumnya</button>
                <button type="button" id="nextStep" class="btn btn-secondary">Berikutnya ›</button>
            `;
            formContainer.appendChild(nav);

            // Set up navigation buttons
            const prevBtn = document.getElementById('prevStep');
            const nextBtn = document.getElementById('nextStep');

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    if (currentStep > 1) {
                        showStep(currentStep - 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    if (currentStep < totalSteps) {
                        showStep(currentStep + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                });
            }

            // Set up step label clicks
            document.querySelectorAll('.step-label').forEach((label, index) => {
                label.addEventListener('click', () => {
                    showStep(index + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            });

            // Setup event listeners
            setupEventListeners();

            // Update total questions count
            totalQuestions = document.querySelectorAll('.question-item').length;
            console.log('Form rendered successfully. Total questions:', totalQuestions);

            // Show first step
            showStep(1);

            // Recalculate scores after rendering
            recalcAll();

        } catch (error) {
            console.error('Error rendering form:', error);
            formContainer.innerHTML = `
                <div class="p-4 bg-red-100 text-red-700 rounded-lg">
                    Terjadi kesalahan saat memuat form. Silakan muat ulang halaman.
                    <br>Error: ${error.message}
                </div>`;
        }
    }

    function renderTableInput(item) {
        let html = '<div class="mb-6 ' + (item.className || '') + '" id="' + (item.id || item.no) + '">';
        if (item.label) {
            html += '<p class="font-medium mb-2">' + item.label + '</p>';
        }
        if (item.note) {
            html += '<p class="text-sm text-gray-500 mb-2">'+ item.note +'</p>';
        }
        html += '<div class="overflow-x-auto">';
        html += '<table class="min-w-[400px] border border-collapse">';
        
        // Header
        html += '<thead><tr>';
        if (item.hasLeftLabels) {
            html += '<th class="border px-4 py-2 bg-gray-50" style="width: 250px">' + 
                    (item.headerLeftLabel ? item.headerLeftLabel : '') + '</th>';
        }
        (item.columns || []).forEach(col => {
            html += '<th class="border px-4 py-2 bg-gray-50" style="width: ' + (col.width || 'auto') + '">' + 
                    col.label + '</th>';
        });
        html += '</tr></thead>';
        
        // Body
        html += '<tbody>';
        const numRows = item.rows || 3;
        for (let i = 1; i <= numRows; i++) {
            html += '<tr>';
            if (item.hasLeftLabels && item.rowLabels) {
                html += '<td class="border px-4 py-2 font-medium" style="width: ' + 
                        (item.leftLabelWidth || '250px') + '">' + 
                        (item.rowLabels[i-1] || '') + '</td>';
            }
            (item.columns || []).forEach((col, j) => {
                html += '<td class="border px-4 py-2">';
                html += '<input type="' + (col.type || 'text') + '" ' +
                        'name="' + item.no + '_row' + i + '_col' + (j+1) + '" ' +
                        'class="w-full p-2 text-center border rounded" ' +
                        (col.type === 'number' ? 'min="0" placeholder="0"' : 'placeholder="Masukkan teks"') +
                        (item.required ? ' required' : '') + '>';
                html += '</td>';
            });
            html += '</tr>';
        }
        html += '</tbody></table>';
        html += '</div></div>';
        return html;
    }

    function renderConditionalTable(item) {
        let html = '<div class="hidden mt-4" id="' + item.no + '">';
        html += '<div class="overflow-x-auto">';
        html += '<table class="border-collapse border w-full">';
        
        // Header row
        html += '<tr>';
        item.columns.forEach(col => {
            html += '<td ' + (col.rowspan ? 'rowspan="' + col.rowspan + '"' : '') + 
                    ' class="border px-4 py-2 bg-gray-50" style="width: ' + (col.width || 'auto') + '">' + 
                    col.label + '</td>';
        });
        html += '</tr>';
        
        // Input row
        html += '<tr>';
        item.columns.forEach(col => {
            if (col.input) {
                html += '<td class="border px-4 py-2">';
                html += '<div class="flex items-center gap-2">';
                html += '<input type="' + col.input.type + '" ' +
                        'name="' + col.input.name + '" ' +
                        'class="w-full p-2 text-center border rounded" ' +
                        (col.input.type === 'number' ? 'min="0" placeholder="0"' : '') +
                        (col.input.required ? ' required' : '') + '>';
                if (col.input.unit) {
                    html += '<span class="text-sm text-gray-500">' + col.input.unit + '</span>';
                }
                html += '</div></td>';
            }
        });
        html += '</tr>';
        html += '</table>';
        
        if (item.note) {
            html += '<p class="text-sm mt-2" style="color:#FF0000"><i>' + item.note + '</i></p>';
        }
        html += '</div></div>';
        return html;
    }

    // Helper function to render individual form items
    function renderFormItem(item, sectionId) {
        if (!item) {
            console.error('Undefined item in section', sectionId);
            return '';
        }

        if (!item.type || !item.no) {
            console.error('Invalid item structure:', { item, sectionId });
            return '';
        }

        let html = '';
        const itemId = item.no || '';
        console.log(`Rendering item ${itemId} in section ${sectionId}`, item);
        
        // Special handling for section C tables
        if (sectionId === 'C') {
            switch(item.type) {
                case 'table-lokasi':
                    return renderTableInput({...item, id: item.no}); // Use item.no as ID
                case 'table-input':
                    if (item.no === 'C4-table' || item.no === 'C7-table') {
                        return `<div id="${item.no}" class="hidden">${renderTableInput(item)}</div>`;
                    } else {
                        return renderTableInput(item);
                    }
                case 'conditional-table':
                    if (item.no === 'C5-table') {
                        return renderConditionalTable(item);
                    }
                    return '';
                case 'table-input-2col':
                    return renderTableInput(item);
                case 'table-input-5col':
                    return renderTableInput(item);
                case 'table-wrapper':
                    let html = '<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">';
                    item.items?.forEach(subItem => {
                        if (subItem.type === 'table-lokasi' || subItem.type === 'table-input') {
                            html += renderTableInput({...subItem, id: subItem.no});
                        }
                    });
                    html += '</div>';
                    return html;
            }
        }
        
        switch(item.type) {
            case 'table-wrapper':
                html += '<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">';
                (item.items || []).forEach(subItem => {
                    if (subItem.type === 'table-lokasi') {
                        html += renderTableInput({
                            id: subItem.no,
                            label: subItem.label,
                            note: subItem.note,
                            required: subItem.required,
                            columns: subItem.columns || [],
                            rows: subItem.rows || [],
                            hasLeftLabels: true,
                            rowLabels: subItem.rows?.map(r => r.label) || []
                        });
                    } else if (subItem.type === 'table-input') {
                        // Special handlers for specific table IDs
                    } else if (subItem.type === 'table-input') {
                        const tableId = subItem.no;
                        if (tableId === 'C-table3' || tableId === 'C-table2' || tableId === 'C-table1') {
                            // These tables visible by default
                            html += renderTableInput(subItem);
                        } else if (tableId === 'C4-table') {
                            // C4-table hidden by default, shown when C4 has options b/c/d selected
                            html += `<div id="C4-table" class="hidden">${renderTableInput(subItem)}</div>`;
                        } else if (tableId === 'C5-table') {
                            // C5-table shown only when C5 option a selected
                            html += `<div id="C5-table" class="hidden">${renderTableInput(subItem)}</div>`;
                        } else if (tableId === 'C6-table' || tableId === 'C6-table-5col') {
                            // C6 tables visible by default
                            html += renderTableInput(subItem);
                        } else if (tableId === 'C7-table') {
                            // C7-table shown when options b/c/d selected
                            html += `<div id="C7-table" class="hidden">${renderTableInput(subItem)}</div>`;
                        } else {
                            html += renderTableInput(subItem);
                        }
                    }
                });
                html += '</div>';
                break;

            case 'radio':
                html += `
                    <div class="question-item" data-question-id="${itemId}">
                        <p class="font-medium mb-3">${item.displayNo || itemId.replace(/[A-Z]/g, '')}. ${item.label}
                           ${item.required ? '<span class="text-red-600">*</span>' : ''}</p>
                        ${item.note ? `<p class="text-sm text-gray-500 mb-2">${item.note}</p>` : ''}
                        <div class="space-y-2">
                            ${(item.options || []).map((opt, idx) => `
                                <label class="flex items-start gap-3">
                                    <input type="radio" 
                                           name="${itemId}"
                                           value="${opt.value}"
                                           class="mt-1"
                                           data-section="${sectionId}"
                                           data-weight="${item.weight || 0}"
                                           data-score="${opt.score || 0}"
                                           ${opt.showTable ? 'data-show-table="true"' : ''}
                                           ${item.required ? 'required' : ''}>
                                    <span>${opt.label}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>`;

                // If this is question C5, add the conditional table
                if (itemId === 'C5') {
                    html += renderConditionalTable({
                        no: 'C5-table',
                        note: '*Catatan wajib diisi apabila memilih poin c dan d',
                        columns: [
                            { 
                                label: 'Jumlah sampah yang dikelola di TPS/TPS3R',
                                rowspan: 2,
                                width: '250px'
                            },
                            { 
                                label: 'Organik',
                                input: { name: 'C5_organik', type: 'number', unit: 'kg/bulan', required: true }
                            },
                            { 
                                label: 'Anorganik',
                                input: { name: 'C5_anorganik', type: 'number', unit: 'kg/bulan', required: true }
                            }
                        ]
                    });
                }
                break;
            
            case 'rwChoice4':
                const rws = item.rws || ['RW A', 'RW B', 'RW C', 'RW D'];
                const scores = item.scores || {a: 0.25, b: 0.50, c: 0.75, d: 1.00};

                html += `<div class="question-item">
                    <p class="font-medium mb-3">${item.displayNo || itemId.replace(/[A-Z]/g, '')}. ${item.label}
                        ${item.required ? '<span class="text-red-600">*</span>' : ''}</p>
                    ${item.note ? `<p class="text-sm text-gray-500 mb-2">${item.note}</p>` : ''}
                    <div class="overflow-x-auto">
                        <table class="min-w-[600px] border border-collapse">
                            <thead><tr>
                                <th class="border px-4 py-2 bg-gray-50 text-left">Pertanyaan</th>
                                <th class="border px-4 py-2 bg-gray-50 text-center">RW A</th>
                                <th class="border px-4 py-2 bg-gray-50 text-center">RW B</th>
                                <th class="border px-4 py-2 bg-gray-50 text-center">RW C</th>
                                <th class="border px-4 py-2 bg-gray-50 text-center">RW D</th>
                            </tr></thead>
                            <tbody>
                                ${['a', 'b', 'c', 'd'].map((value, optIdx) => `
                                    <tr>
                                        <td class="border px-4 py-2">${rws[optIdx] || ''}</td>
                                        ${[1, 2, 3, 4].map(rwNum => `
                                            <td class="border px-4 py-2 text-center">
                                                <input type="radio" 
                                                    name="${itemId}_${rwNum}"
                                                    value="${value}"
                                                    data-score="${scores[value] || 0}"
                                                    data-section="${sectionId}"
                                                    ${item.required && rwNum === 1 ? 'required' : ''}
                                                    class="cursor-pointer">
                                            </td>
                                        `).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>`;
                break;

            case 'table-wrapper':
                html += '<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">';
                (item.items || []).forEach(subItem => {
                    if (subItem.type === 'table-lokasi') {
                        html += renderTableInput({
                            no: subItem.no,
                            label: subItem.label,
                            note: subItem.note,
                            required: subItem.required,
                            columns: subItem.columns,
                            rows: subItem.rows,
                            hasLeftLabels: true,
                            rowLabels: subItem.rows.map(r => r.label)
                        });
                    } else if (subItem.type === 'table-input') {
                        html += renderTableInput(subItem);
                    }
                });
                html += '</div>';
                break;

            case 'checkbox':
                html += `<div class="question-item" data-question-id="${itemId}">
                    <p class="font-medium mb-3">${itemId.replace(/[A-Z]/g, '')}. ${item.label}
                        ${item.required ? '<span class="text-red-600">*</span>' : ''}</p>
                    ${item.note ? `<p class="text-sm text-gray-500 mb-2">${item.note}</p>` : ''}
                    <div class="space-y-2">
                        ${(item.options || []).map((opt, idx) => `
                            <label class="flex items-start gap-3">
                                <input type="checkbox" 
                                       name="${itemId}"
                                       value="${opt.value}"
                                       class="mt-1"
                                       data-section="${sectionId}"
                                       data-weight="${item.weight || 0}"
                                       data-score="${opt.score || 0}"
                                       ${item.required && idx === 0 ? 'required' : ''}
                                       ${item.required ? 'data-required-group="1"' : ''}
                                       ${opt.hasDetail ? 'data-has-detail="true"' : ''}>
                                <span>${opt.label}</span>
                            </label>
                            ${opt.hasDetail ? `
                                <div class="ml-8 mt-2 hidden detail-input" id="detail-${itemId}-${opt.value}">
                                    <input type="text" class="input w-full" 
                                           name="${itemId}_detail_${opt.value}" 
                                           placeholder="Sebutkan lainnya...">
                                </div>
                            ` : ''}
                        `).join('')}
                    </div>
                </div>`;

                // Set up event listeners for detail inputs after rendering
                setTimeout(() => {
                    const checkboxes = document.querySelectorAll(`input[name="${itemId}"][data-has-detail="true"]`);
                    checkboxes.forEach(checkbox => {
                        checkbox.addEventListener('change', function() {
                            const detailId = `detail-${itemId}-${this.value}`;
                            const detailDiv = document.getElementById(detailId);
                            if (detailDiv) {
                                detailDiv.classList.toggle('hidden', !this.checked);
                                const detailInput = detailDiv.querySelector('input');
                                if (detailInput) {
                                    detailInput.required = this.checked;
                                }
                            }
                        });
                    });
                }, 0);
                break;

            case 'kader10':
                html += `<div class="question-item" data-question-id="${itemId}">
                    <p class="font-medium mb-3">${itemId.replace(/[A-Z]/g, '')}. ${item.label}
                        ${item.required ? '<span class="text-red-600">*</span>' : ''}</p>
                    ${item.note ? `<p class="text-sm text-gray-500 mb-2">${item.note}</p>` : ''}
                    <div class="overflow-auto">
                        <table class="min-w-[560px] w-full border border-[var(--border)] rounded-xl">
                            <thead><tr>
                                <th class="px-3 py-2 border bg-[var(--bg-soft)] text-left">No</th>
                                <th class="px-3 py-2 border bg-[var(--bg-soft)] text-left">Nama/Uraian Kader Aktif</th>
                            </tr></thead>
                            <tbody>
                                ${[...Array(10)].map((_, k) => `
                                    <tr>
                                        <td class="px-3 py-2 border">${k + 1}</td>
                                        <td class="px-3 py-2 border">
                                            <input type="text" 
                                                   name="${itemId}_${k + 1}"
                                                   class="input w-full" 
                                                   placeholder="Kader ${k + 1}">
                                        </td>
                                    </tr>
                                `).join('')}
                                <tr>
                                    <td class="px-3 py-2 border align-top">11</td>
                                    <td class="px-3 py-2 border">
                                        <textarea name="${itemId}_11_plus" 
                                                  rows="3" 
                                                  class="input w-full" 
                                                  placeholder="Masukkan kader ke-11 dan seterusnya. Pisahkan dengan enter atau koma."></textarea>
                                        <p class="text-sm text-gray-500 mt-1 italic">dan seterusnya untuk kader aktif lebih dari 10</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-sm text-gray-500 mt-2">
                        Skor otomatis: &lt;4 kader = 25%, 5–7 = 50%, 8–10 = 75%, &gt;10 = 100% (bobot ${item.weight || 2})
                    </p>
                </div>`;
                break;

            case 'rwchoice4':
                html += `
                    <div class="question-item" data-question-id="${itemId}">
                        <p class="font-medium mb-3">${item.displayNo || itemId.replace(/[A-Z]/g, '')}. ${item.label}
                           ${item.required ? '<span class="text-red-600">*</span>' : ''}</p>
                        ${item.note ? `<p class="text-sm text-gray-500 mb-2">${item.note}</p>` : ''}
                        <div class="space-y-2">
                            ${(item.options || []).map((opt, idx) => `
                                <label class="flex items-start gap-3">
                                    <input type="radio" 
                                           name="${itemId}"
                                           value="${opt.value}"
                                           class="mt-1"
                                           data-section="${sectionId}"
                                           data-weight="${item.weight || 0}"
                                           data-score="${opt.score || 0}"
                                           ${item.required ? 'required' : ''}>
                                    <span>${opt.label}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>`;
                break;

            case 'kader10':
                html += `
                    <div class="question-item" data-question-id="${itemId}">
                        <p class="font-medium mb-3">${item.displayNo || itemId.replace(/[A-Z]/g, '')}. ${item.label}
                           ${item.required ? '<span class="text-red-600">*</span>' : ''}</p>
                        ${item.note ? `<p class="text-sm text-gray-500 mb-2">${item.note}</p>` : ''}
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${[...Array(10)].map((_, idx) => `
                                <div class="border p-4 rounded">
                                    <p class="font-medium mb-2">Kader ${idx + 1}</p>
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-sm mb-1">Nama Kader</label>
                                            <input type="text" 
                                                   name="${itemId}_name_${idx + 1}"
                                                   class="form-input w-full"
                                                   data-section="${sectionId}"
                                                   ${item.required ? 'required' : ''}>
                                        </div>
                                        <div>
                                            <label class="block text-sm mb-1">NIK</label>
                                            <input type="text" 
                                                   name="${itemId}_nik_${idx + 1}"
                                                   class="form-input w-full"
                                                   maxlength="16"
                                                   pattern="[0-9]{16}"
                                                   data-section="${sectionId}"
                                                   ${item.required ? 'required' : ''}>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>`;
                break;

            case 'checkbox':
                html += `
                    <div class="question-item" data-question-id="${itemId}">
                        <p class="font-medium mb-3">${item.displayNo || itemId.replace(/[A-Z]/g, '')}. ${item.label}
                           ${item.required ? '<span class="text-red-600">*</span>' : ''}</p>
                        ${item.note ? `<p class="text-sm text-gray-500 mb-2">${item.note}</p>` : ''}
                        <div class="space-y-2">
                            ${(item.options || []).map((opt, idx) => `
                                <label class="flex items-start gap-3">
                                    <input type="checkbox" 
                                           name="${itemId}[]"
                                           value="${opt.value}"
                                           class="mt-1"
                                           data-section="${sectionId}"
                                           data-weight="${item.weight || 0}"
                                           data-score="${opt.score || 0}">
                                    <span>${opt.label}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>`;
                break;
        }

        return html;
    }

    function setupEventListeners() {
        const form = document.getElementById('formLapangan');
        if (!form) return;

        // Table visibility controls 
        setupTableVisibilityControls();

        // Add input/change listeners
        form.addEventListener('input', e => {
            if (e.target.matches('input, select, textarea')) {
                recalcAll();
            }
        });

        form.addEventListener('change', e => {
            if (e.target.matches('input, select, textarea')) {
                recalcAll();
            }
        });
    }

    // Fungsi untuk memvalidasi data terpilih
    function validateSelectedAssessment() {
        console.log('Validating selected assessment');
        const storedData = localStorage.getItem('penilaian_lapangan_selected');
        
        if (!storedData) {
            console.error('No assessment data found in localStorage');
            window.location.href = 'penilaian-lapangan.html';
            return false;
        }

        try {
            selectedAssessment = JSON.parse(storedData);
            console.log('Loaded assessment data:', selectedAssessment);
            return true;
        } catch (error) {
            console.error('Error parsing assessment data:', error);
            window.location.href = 'penilaian-lapangan.html';
            return false;
        }
    }

    // Fungsi untuk mengupdate summary penilaian mandiri
    function updatePMSummary() {
        console.log('Updating summary with data:', selectedAssessment);
        if (!selectedAssessment) {
            console.warn('No selected assessment data');
            return;
        }

        try {
            // Reset ringkasan sebelum update
            const elements = {
                namaWilayah: document.getElementById('namaWilayah'),
                lokasiWilayah: document.getElementById('lokasiWilayah'),
                kategoriDituju: document.getElementById('kategoriDituju'),
                statusPenilaianMandiri: document.getElementById('statusPenilaianMandiri'),
                skorMandiri: document.getElementById('skorMandiri'),
                badgeMandiri: document.getElementById('badgeMandiri')
            };

            // Update elements if they exist
            if (elements.namaWilayah) elements.namaWilayah.textContent = selectedAssessment.desa || '-';
            if (elements.lokasiWilayah) elements.lokasiWilayah.textContent = 
                `${selectedAssessment.kecamatan || ''}, ${selectedAssessment.kabupaten || ''}`.replace(/^, |, $/g, '') || '-';
            if (elements.kategoriDituju) elements.kategoriDituju.textContent = 
                selectedAssessment.menuju_kategori ? `Menuju ${selectedAssessment.menuju_kategori}` : '-';
            if (elements.statusPenilaianMandiri) elements.statusPenilaianMandiri.textContent = selectedAssessment.status || '-';
            if (elements.skorMandiri) elements.skorMandiri.textContent = 
                selectedAssessment.skor !== undefined ? `Skor: ${selectedAssessment.skor}` : 'Skor: 0';

            // Update badge
            if (elements.badgeMandiri) {
                elements.badgeMandiri.className = 'px-2 py-0.5 text-xs font-medium rounded-full';
                if (selectedAssessment.status === 'Belum Dinilai') {
                    elements.badgeMandiri.classList.add('bg-yellow-100', 'text-yellow-800');
                    elements.badgeMandiri.textContent = 'Belum Dinilai';
                } else {
                    elements.badgeMandiri.classList.add('bg-green-100', 'text-green-800');
                    elements.badgeMandiri.textContent = 'Sudah Dinilai';
                }
            }

            console.log('Summary updated successfully');
        } catch (error) {
            console.error('Error updating summary:', error);
        }
    }

    // Fungsi untuk mengupdate tampilan skor
    function updateSkorDisplay() {
        console.log('Updating score display:', { totalSkor, komponenScores, answeredQuestions, totalQuestions });

        try {
            const elements = {
                totalSkorEl: document.getElementById('totalSkorLapangan'),
                komponenScoresEl: document.getElementById('komponenScores'),
                progressBar: document.getElementById('progressBar'),
                progressText: document.getElementById('progressText'),
                statusBadgeEl: document.getElementById('statusLapanganBadge')
            };

            // Update total skor
            if (elements.totalSkorEl) {
                elements.totalSkorEl.textContent = totalSkor.toString();
            }

            // Update skor per komponen
            if (elements.komponenScoresEl) {
                elements.komponenScoresEl.innerHTML = Object.entries(komponenScores)
                    .map(([key, value]) => `
                        <div class="flex justify-between">
                            <span>Komponen ${key}:</span>
                            <span class="font-medium">${value}</span>
                        </div>
                    `).join('');
            }

            // Update progress
            const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
            
            if (elements.progressBar) {
                elements.progressBar.style.width = `${progress}%`;
            }
            
            if (elements.progressText) {
                elements.progressText.textContent = `${answeredQuestions} dari ${totalQuestions} Komponen`;
            }

            // Update status badge
            if (elements.statusBadgeEl) {
                let status = 'Belum Selesai';
                let colorClass = 'bg-gray-100 text-gray-800';
                
                if (progress === 100) {
                    if (totalSkor >= 150) {
                        status = 'Menuju Mandiri';
                        colorClass = 'bg-emerald-100 text-emerald-800';
                    } else if (totalSkor >= 100) {
                        status = 'Menuju Madya';
                        colorClass = 'bg-blue-100 text-blue-800';
                    } else {
                        status = 'Menuju Pratama';
                        colorClass = 'bg-yellow-100 text-yellow-800';
                    }
                }

                elements.statusBadgeEl.innerHTML = `
                    <span class="px-2 py-1 rounded-full text-xs font-medium ${colorClass}">
                        ${status}
                    </span>
                `;
            }
        } catch (error) {
            console.error('Error updating score display:', error);
        }

        // Simpan skor ke localStorage
        saveSkorToStorage();
    }

    // Fungsi untuk menyimpan skor ke localStorage
    function saveSkorToStorage() {
        const skorData = {
            totalSkor,
            komponenScores,
            answeredQuestions,
            totalQuestions,
            lastUpdate: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('penilaian_lapangan_skor', JSON.stringify(skorData));
            console.log('Skor saved to localStorage:', skorData);
        } catch (error) {
            console.error('Error saving skor to localStorage:', error);
        }
    }

    // Fungsi untuk memuat skor dari localStorage
    function loadSkorFromStorage() {
        try {
            const stored = localStorage.getItem('penilaian_lapangan_skor');
            if (stored) {
                const data = JSON.parse(stored);
                totalSkor = data.totalSkor || 0;
                komponenScores = data.komponenScores || { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
                answeredQuestions = data.answeredQuestions || 0;
                totalQuestions = data.totalQuestions || 0;
                
                // Restore saved values to form
                Object.entries(komponenScores).forEach(([sectionId, score]) => {
                    const inputs = document.querySelectorAll(`input[data-section-id="${sectionId}"]`);
                    if (inputs.length > 0) {
                        inputs.forEach(input => {
                            if (input.type === 'radio' && parseInt(input.value) === score) {
                                input.checked = true;
                            }
                        });
                    }
                });

                updateSkorDisplay();
                console.log('Skor loaded from localStorage:', data);
            }
        } catch (error) {
            console.error('Error loading skor from localStorage:', error);
        }
    }

    // Fungsi untuk menangani perubahan jawaban
    function handleAnswerChange(event) {
        const input = event.target;
        const questionId = input.getAttribute('data-question-id');
        const sectionId = input.getAttribute('data-section');
        const maxSkor = parseInt(input.getAttribute('data-max-skor'));
        
        console.log('Answer changed:', { questionId, sectionId, maxSkor, inputType: input.type });
        
        try {
            // Reset skor untuk komponen ini
            if (sectionId) {
                komponenScores[sectionId] = 0;
            }
            
            // Get question config
            let questionConfig = null;
            for (const section of window.LAPANGAN_CONFIG.sections) {
                const found = section.items.find(item => item.no === questionId);
                if (found) {
                    questionConfig = found;
                    break;
                }
            }

            if (!questionConfig) {
                console.log('No question config found for:', questionId);
                return;
            }

            // Calculate score based on question type
            let score = 0;
            const weight = questionConfig.weight || 0;

            if (questionConfig.type === 'checkbox') {
                // Get all checked checkboxes for this question
                const checked = document.querySelectorAll(`input[name="${questionId}"]:checked`);
                const selectedCount = checked.length;

                // Calculate percentage based on rules
                let percentage = 0;
                if (questionConfig.no === '2') { // Soal B2
                    if (selectedCount === 1) percentage = 0.25;
                    else if (selectedCount >= 2 && selectedCount <= 3) percentage = 0.50;
                    else if (selectedCount >= 4 && selectedCount <= 5) percentage = 0.75;
                    else if (selectedCount >= 6) percentage = 1.0;
                } else if (questionConfig.no === '3') { // Soal B3
                    if (selectedCount === 1) percentage = 0.25;
                    else if (selectedCount === 2) percentage = 0.50;
                    else if (selectedCount === 3) percentage = 0.75;
                    else if (selectedCount >= 4) percentage = 1.00;
                } else {
                    if (selectedCount === 1) percentage = 0.25;
                    else if (selectedCount === 2) percentage = 0.50;
                    else if (selectedCount === 3) percentage = 0.75;
                    else if (selectedCount >= 4) percentage = 1.0;
                }
                score = percentage * weight;

            } else if (questionConfig.type === 'radio') {
                const selectedOption = document.querySelector(`input[name="${questionId}"]:checked`);
                if (selectedOption) {
                    score = (parseFloat(selectedOption.getAttribute('data-score')) || 0) * weight;
                }

            } else if (questionConfig.type === 'rwChoice4') {
                // Calculate average score from all RW answers
                let totalScore = 0;
                let answeredCount = 0;
                for (let i = 1; i <= 4; i++) {
                    const rwAnswer = document.querySelector(`input[name="${questionId}_${i}"]:checked`);
                    if (rwAnswer) {
                        totalScore += parseFloat(rwAnswer.getAttribute('data-score')) || 0;
                        answeredCount++;
                    }
                }
                if (answeredCount > 0) {
                    score = (totalScore / answeredCount) * weight;
                }

            } else if (questionConfig.type === 'kader10') {
                let filledKaders = 0;

                // Count filled kader entries
                for (let i = 1; i <= 10; i++) {
                    const field = document.querySelector(`input[name="${questionId}_${i}"]`);
                    if (field?.value.trim()) {
                        filledKaders++;
                    }
                }

                // Check additional kaders
                const extraField = document.querySelector(`textarea[name="${questionId}_11_plus"]`);
                if (extraField?.value.trim()) {
                    const extraKaders = extraField.value.trim().split(/[\n,]+/).filter(k => k.trim());
                    filledKaders += extraKaders.length;
                }

                // Calculate percentage based on filled kaders
                let percentage = 0;
                if (filledKaders > 10) percentage = 1.0;
                else if (filledKaders >= 8) percentage = 0.75;
                else if (filledKaders >= 5) percentage = 0.50;
                else if (filledKaders >= 1) percentage = 0.25;

                score = percentage * weight;
            }
            
            // Update component score if we have a valid section ID
            if (sectionId && score !== undefined) {
                komponenScores[sectionId] = (komponenScores[sectionId] || 0) + score;
            }
            
            // Update total skor
            totalSkor = Object.values(komponenScores).reduce((a, b) => a + b, 0);
            
            // Update progress
            updateProgress();

            // Update display
            updateSkorDisplay();
            
            // Save after each change
            saveSkorToStorage();

            console.log('Score updated:', { 
                questionId,
                sectionId,
                questionType: questionConfig?.type,
                questionWeight: weight,
                calculatedScore: score,
                sectionTotal: sectionId ? komponenScores[sectionId] : null,
                totalSkor,
                progress: `${answeredQuestions}/${totalQuestions}`
            });
        } catch (error) {
            console.error('Error handling answer change:', error);
        }
    }

    function updateProgress() {
        // Get all questions that require answers
        const questions = window.LAPANGAN_CONFIG.sections.flatMap(section => 
            section.items.filter(item => 
                item.type === 'radio' || item.type === 'checkbox' || 
                item.type === 'rwChoice4' || item.type === 'kader10'
            )
        );

        totalQuestions = questions.length;
        let answered = 0;

        questions.forEach(question => {
            if (question.type === 'radio') {
                // Check if any radio button in the group is selected
                const anyChecked = document.querySelector(`input[name="${question.no}"]:checked`);
                if (anyChecked) answered++;
            } 
            else if (question.type === 'checkbox' && question.required) {
                // Check if any checkbox in the required group is checked
                const anyChecked = document.querySelector(`input[name="${question.no}"]:checked`);
                if (anyChecked) answered++;
            }
            else if (question.type === 'rwChoice4') {
                // Check if all RWs have an answer
                let rwAnswered = 0;
                for (let i = 1; i <= 4; i++) {
                    if (document.querySelector(`input[name="${question.no}_${i}"]:checked`)) {
                        rwAnswered++;
                    }
                }
                if (rwAnswered === 4) answered++;
            }
            else if (question.type === 'kader10') {
                // Check if at least one kader entry is filled
                for (let i = 1; i <= 10; i++) {
                    const field = document.querySelector(`input[name="${question.no}_${i}"]`);
                    if (field?.value.trim()) {
                        answered++;
                        break;
                    }
                }
            }
        });

        answeredQuestions = answered;
    }

    // Function to handle all form initialization
    function initializeForm() {
        try {
            console.log('Starting form initialization...');
            const elements = {
                formContainer: document.getElementById('formLapangan'),
                backButton: document.getElementById('backButton'),
                saveButton: document.getElementById('saveButton')
            };

            if (!elements.formContainer) {
                throw new Error('Form container element not found!');
            }

            // Render the form only if we have valid assessment data
            if (!validateSelectedAssessment()) {
                throw new Error('Invalid or missing assessment data');
            }

            console.log('Assessment data validated');

            // Clear form container
            elements.formContainer.innerHTML = '';

            // Verify FORM_CONFIG is loaded
            if (!window.FORM_CONFIG || !window.FORM_CONFIG.length) {
                throw new Error('FORM_CONFIG not properly loaded');
            }

            // Verify section C configuration
            const sectionC = window.FORM_CONFIG.find(section => section.title.startsWith('C.'));
            if (!sectionC || !sectionC.items || !sectionC.items.length) {
                throw new Error('Section C configuration missing or invalid');
            }

            console.log('Form config validated, rendering form...');

            // Render the form
            renderForm();
            console.log('Form rendered successfully');

            // Update displays
            updatePMSummary();
            console.log('PM summary updated');

            loadSkorFromStorage();
            console.log('Scores loaded from storage');

            // Set up event handlers
            const setupHandlers = () => {
                // Table visibility controls
                setupTableVisibilityControls();
                
                // Score calculation handlers
                elements.formContainer.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
                    input.addEventListener('change', handleAnswerChange);
                });

                // Section C specific handlers
                document.querySelectorAll('input[name^="C"]').forEach(input => {
                    input.addEventListener('change', () => {
                        // Re-run table visibility check
                        setupTableVisibilityControls();
                        // Update scores
                        handleAnswerChange({ target: input });
                    });
                });
            };

            // Initial setup
            setupHandlers();
            updateSkorDisplay();
            
            console.log('Form initialization completed successfully');
            return true;

        } catch (error) {
            console.error('Error during form initialization:', error);
            alert('Terjadi kesalahan saat memuat form: ' + error.message);
            window.location.href = 'penilaian-lapangan.html';
            return false;
        }
    }
    
    // Add click handler for initialization
    window.addEventListener('load', function() {
        // Attempt to initialize form after a short delay to ensure config is loaded
        setTimeout(function() {
            try {
                if (typeof FORM_CONFIG === 'undefined' || !FORM_CONFIG) {
                    console.error('FORM_CONFIG belum dimuat. Pastikan file config dimuat terlebih dahulu.');
                    alert('Konfigurasi form belum tersedia. Silakan muat ulang halaman.');
                    return;
                }
                
                if (!initializeForm()) {
                    console.error('Form initialization failed');
                }
            } catch (error) {
                console.error('Error during initialization:', error);
                alert('Terjadi kesalahan saat menginisialisasi form. Silakan muat ulang halaman.');
            }
        }, 100);
    });
})();