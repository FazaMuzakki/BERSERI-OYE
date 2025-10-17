// Helper functions to render different table types
function renderTableLokasi(item) {
    let html = '<div class="mb-6">';
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
    item.columns.forEach(function(col) {
        html += '<th class="border px-3 py-2 bg-gray-50" style="width: ' + col.width + '">' + 
                col.label + '</th>';
    });
    html += '</tr></thead>';
    
    // Body
    html += '<tbody>';
    item.rows.forEach(function(row) {
        html += '<tr>';
        html += '<td class="border px-3 py-2 h-[42px]">' + row.label + '</td>';
        html += '<td class="border px-3 py-2 h-[42px]">';
        html += '<input type="number" name="' + item.no + '_' + row.id + 
                '" class="w-full input !p-2" min="0">';
        html += '</td>';
        html += '</tr>';
    });
    html += '</tbody>';
    html += '</table>';
    html += '</div></div>';
    return html;
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
    item.columns.forEach(function(col) {
        html += '<th class="border px-4 py-2 bg-gray-50" style="width: ' + col.width + '">' + 
                col.label + '</th>';
    });
    html += '</tr></thead>';
    
    // Body
    html += '<tbody>';
    const numRows = item.rows || 3;
    for (let i = 1; i <= numRows; i++) {
        html += '<tr>';
        if (item.hasLeftLabels && item.rowLabels) {
            html += '<td class="border px-4 py-2 font-medium">' + 
                    (item.rowLabels[i-1] || '') + '</td>';
        }
        item.columns.forEach(function(col, j) {
            html += '<td class="border px-4 py-2">';
            html += '<input type="' + col.type + '" name="' + item.no + '_row' + i + '_col' + (j+1) + 
                    '" class="w-full p-2 text-center border rounded focus:outline-none focus:border-blue-500" ' +
                    (col.type === 'number' ? 'min="0" placeholder="0"' : 'placeholder="Masukkan teks"') + 
                    ' style="min-width: 100px; width: 100%;"' +
                    (item.required ? ' required' : '') + '>';
            html += '</td>';
        });
        html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';
    html += '</div></div>';
    return html;
}

function renderTableInput2Col(item) {
    let html = '<div class="mb-6">';
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
        html += '<th class="border px-4 py-2 bg-gray-50" style="width: 250px"></th>';
    }
    html += '<th class="border px-4 py-2 bg-gray-50" style="width: 150px">Kapasitas (Kg/bulan)</th>';
    html += '</tr></thead>';
    
    // Body
    html += '<tbody>';
    const numRows = item.rows || 3;
    for (let i = 1; i <= numRows; i++) {
        html += '<tr>';
        if (item.hasLeftLabels && item.rowLabels) {
            html += '<td class="border px-4 py-2 font-medium">' + 
                    (item.rowLabels[i-1] || '') + '</td>';
        }
        html += '<td class="border px-4 py-2">';
        html += '<input type="number" name="' + item.no + '_row' + i + '_capacity" ' +
                'class="w-full p-2 text-center border rounded focus:outline-none focus:border-blue-500" ' +
                'min="0" placeholder="0" style="min-width: 100px; width: 100%;"' +
                (item.required ? ' required' : '') + '>';
        html += '</td>';
        html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';
    html += '</div></div>';
    return html;
}

function renderTableInput5Col(item) {
    let html = '<div class="mb-6">';
    if (item.label) {
        html += '<p class="font-medium mb-2">' + item.label + '</p>';
    }
    if (item.note) {
        html += '<p class="text-sm text-gray-500 mb-2">'+ item.note +'</p>';
    }
    html += '<div class="overflow-x-auto">';
    html += '<table class="min-w-[800px] border border-collapse">';
    
    // Header
    html += '<thead><tr>';
    if (item.hasLeftLabels) {
        html += '<th class="border px-4 py-2 bg-gray-50" style="width: 200px"></th>';
    }
    item.columns.forEach(function(col) {
        html += '<th class="border px-4 py-2 bg-gray-50" style="width: ' + col.width + '">' + 
                col.label + '</th>';
    });
    html += '</tr></thead>';
    
    // Body
    html += '<tbody>';
    const numRows = item.rows || 3;
    for (let i = 1; i <= numRows; i++) {
        html += '<tr>';
        if (item.hasLeftLabels && item.rowLabels) {
            html += '<td class="border px-4 py-2 font-medium">' + 
                    (item.rowLabels[i-1] || '') + '</td>';
        }
        for (let j = 1; j <= 4; j++) {
            html += '<td class="border px-4 py-2" style="width: 120px">';
            if (i === 2) {
                html += '<select name="' + item.no + '_row' + i + '_col' + j + 
                        '" class="w-full p-2 text-center border rounded focus:outline-none focus:border-blue-500" ' +
                        'style="min-width: 100px; width: 100%;" onchange="calculatePercentage(' + j + ')">';
                html += '<option value="0.4">Kota Kecil </option>';
                html += '<option value="0.5">Kota Sedang </option>';
                html += '<option value="0.6">Kota Besar </option>';
                html += '<option value="0.7">Kota Metropolitan </option>';
                html += '</select>';
            } 
            else if (i === 4) {
                html += '<input type="number" name="' + item.no + '_row' + i + '_col' + j + 
                        '" class="w-full p-2 text-center border rounded focus:outline-none focus:border-blue-500" ' +
                        'readonly style="min-width: 100px; width: 100%;" placeholder="0">';
            }
            else {
                html += '<input type="number" name="' + item.no + '_row' + i + '_col' + j + 
                        '" class="w-full p-2 text-center border rounded focus:outline-none focus:border-blue-500" ' +
                        'min="0" placeholder="0" style="min-width: 100px; width: 100%;" ' +
                        'oninput="calculatePercentage(' + j + ')">';
            }
            html += '</td>';
        }
        html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';
    
    // Info box
    html += '<div class="mt-4 p-4 rounded-xl border bg-[var(--bg-soft)]">';
    html += '<p class="text-emerald-800 font-semibold mt-3">';
    html += 'Estimasi Timbulan Sampah berdasarkan Peraturan Menteri LHK No.6 Tahun 2022 tentang SIPSN, sebagai berikut:';
    html += '</p>';
    html += '<ul class="list-disc pl-6 text-gray-600 mt-2">';
    html += '<li>Kota Kecil ≈ <strong>0,4</strong> kg/org/hari</li>';
    html += '<li>Kota Sedang ≈ <strong>0,5</strong> kg/org/hari</li>';
    html += '<li>Kota Besar ≈ <strong>0,6</strong> kg/org/hari</li>';
    html += '<li>Kota Metropolitan ≈ <strong>0,7</strong> kg/org/hari</li>';
    html += '</ul>';
    html += '</div>';
    html += '</div></div>';
    return html;
}

function calculatePercentage(rwIndex) {
    // Get the population, waste estimation and reduction values
    const populationInput = document.querySelector(`input[name="c6-table-5col_row1_col${rwIndex}"]`);
    const wasteEstimationSelect = document.querySelector(`select[name="c6-table-5col_row2_col${rwIndex}"]`);
    const reductionInput = document.querySelector(`input[name="c6-table-5col_row3_col${rwIndex}"]`);
    const percentageInput = document.querySelector(`input[name="c6-table-5col_row4_col${rwIndex}"]`);
    
    if (populationInput && wasteEstimationSelect && reductionInput && percentageInput) {
        const population = parseFloat(populationInput.value) || 0;
        const wastePerPerson = parseFloat(wasteEstimationSelect.value) || 0;
        const reduction = parseFloat(reductionInput.value) || 0;
        
        // Calculate total waste per month (population × waste per person × 30 days)
        const totalWaste = population * wastePerPerson * 30;
        
        // Calculate percentage if total waste is not zero
        let percentage = 0;
        if (totalWaste > 0) {
            percentage = (reduction / totalWaste) * 100;
        }
        
        // Update the percentage field with 2 decimal places
        percentageInput.value = percentage.toFixed(2);
    }
}

// Export the functions
window.calculatePercentage = calculatePercentage;
window.renderTableLokasi = renderTableLokasi;
window.renderTableInput = renderTableInput;
window.renderTableInput2Col = renderTableInput2Col;
window.renderTableInput5Col = renderTableInput5Col;