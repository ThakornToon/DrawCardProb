/* ========================================================================
   Card Draw Probability Calculator (With Compound Ranges & Performance Fixes)
   ======================================================================== */

// ==================== I18N ====================
const I18N = {
    th: {
        appSubtitle: 'Multivariate Hypergeometric Distribution Calculator',
        langToggleLabel: 'EN',
        themeToggleTitle: 'สลับโหมดสว่าง/มืด',
        deckSetup: 'ตั้งค่ากองการ์ด',
        totalCardsLabel: 'จำนวนการ์ดทั้งหมดในกอง',
        unit: 'ใบ',
        drawCountLabel: 'จำนวนการ์ดที่จั่ว',
        cardTypesTitle: 'ชนิดการ์ดที่ต้องการ',
        addType: 'เพิ่มชนิด',
        calculateBtn: 'คำนวณความน่าจะเป็น',
        nameLabel: 'ชื่อ',
        countLabel: 'จำนวนในกอง',
        conditionLabel: 'เงื่อนไข (ช่วง)',
        removeTitle: 'ลบชนิดนี้',
        namePlaceholder: 'ชื่อการ์ด',
        noName: '(ไม่มีชื่อ)',
        resultsTitle: 'ผลลัพธ์',
        resultPlaceholder: 'กดปุ่ม "คำนวณ" เพื่อดูผลลัพธ์',
        probability: 'ความน่าจะเป็น',
        totalCardsResult: 'การ์ดทั้งหมด',
        drawResult: 'จั่ว',
        oddsLabel: 'อัตราส่วน',
        impossible: 'ไม่มีทาง (0%)',
        graphTitle: 'กราฟ',
        xAxisVarLabel: 'ตัวแปรแกน X',
        xAxisPlaceholder: '— เลือกตัวแปร —',
        xMinLabel: 'ค่าเริ่มต้น',
        xMaxLabel: 'ค่าสิ้นสุด',
        generateGraphBtn: 'สร้างกราฟ',
        defaultNewCardPrefix: 'การ์ด',
        defaultCardNames: ['การ์ด A', 'การ์ด B', 'การ์ด C', 'การ์ด D'],
        conditionAnd: 'และ',
        noCondition: 'ไม่มีเงื่อนไข',
        invalidDeck: 'ข้อผิดพลาด: ข้อมูลจำนวนการ์ดขัดแย้งกันหรือไม่ถูกต้อง',
        invalidRange: 'ข้อผิดพลาด: ค่าเริ่มต้นต้องไม่เกินค่าสิ้นสุด',
        opSymbols: { '>=': '≥', '>': '>', '=': '=', '<=': '≤', '<': '<', 'none': 'ไม่ระบุ' },
        chartXLabelTotalCards: 'จำนวนการ์ดทั้งหมด (N)',
        chartXLabelDrawCount: 'จำนวนการ์ดที่จั่ว (n)',
        chartYLabel: 'ความน่าจะเป็น (%)',
        rangeEqualWarning: 'ค่าเริ่มต้นและค่าสิ้นสุดเท่ากัน ( = {val} ) ปรับค่าสิ้นสุดเป็น {newMax} เพื่อให้เห็นแนวโน้ม'
    },
    en: {
        appSubtitle: 'Multivariate Hypergeometric Distribution Calculator',
        langToggleLabel: 'TH',
        themeToggleTitle: 'Toggle light / dark mode',
        deckSetup: 'Deck Setup',
        totalCardsLabel: 'Total Cards in Deck',
        unit: 'cards',
        drawCountLabel: 'Cards to Draw',
        cardTypesTitle: 'Target Card Types',
        addType: 'Add Type',
        calculateBtn: 'Calculate Probability',
        nameLabel: 'Name',
        countLabel: 'In Deck',
        conditionLabel: 'Conditions (Range)',
        removeTitle: 'Remove this type',
        namePlaceholder: 'Card name',
        noName: '(unnamed)',
        resultsTitle: 'Results',
        resultPlaceholder: 'Click "Calculate" to see results',
        probability: 'Probability',
        totalCardsResult: 'Total Cards',
        drawResult: 'Draw',
        oddsLabel: 'Odds',
        impossible: 'Impossible (0%)',
        graphTitle: 'Graph',
        xAxisVarLabel: 'X-Axis Variable',
        xAxisPlaceholder: '— Select variable —',
        xMinLabel: 'From',
        xMaxLabel: 'To',
        generateGraphBtn: 'Generate Graph',
        defaultNewCardPrefix: 'Card',
        defaultCardNames: ['Card A', 'Card B', 'Card C', 'Card D'],
        conditionAnd: 'and',
        noCondition: 'No constraints',
        invalidDeck: 'Error: Invalid deck configuration or draws.',
        invalidRange: 'Error: Min value cannot exceed Max value.',
        opSymbols: { '>=': '≥', '>': '>', '=': '=', '<=': '≤', '<': '<', 'none': 'None' },
        chartXLabelTotalCards: 'Total Cards in Deck (N)',
        chartXLabelDrawCount: 'Cards to Draw (n)',
        chartYLabel: 'Probability (%)',
        rangeEqualWarning: 'Min and Max values are equal (= {val}). Adjusted Max to {newMax} to show trend.'
    }
};

let currentLang = localStorage.getItem('calc_lang') || 'th';
let cardTypes = [];
let chartInstance = null;

function tr(key) { return I18N[currentLang][key] || key; }
function escapeHtml(str) { return (str||'').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// ==================== Precomputed Math Cache (Fix 6) ====================
const logFactorialCache = [0, 0];
function logFactorial(n) {
    if (n < 0) return -Infinity;
    if (n < logFactorialCache.length) return logFactorialCache[n];
    let result = logFactorialCache[logFactorialCache.length - 1];
    for (let i = logFactorialCache.length; i <= n; i++) {
        result += Math.log(i);
        logFactorialCache.push(result);
    }
    return result;
}

function logCombination(n, r) {
    if (r < 0 || r > n) return -Infinity;
    if (r === 0 || r === n) return 0;
    if (r > n - r) r = n - r;
    return logFactorial(n) - logFactorial(r) - logFactorial(n - r);
}

// ==================== Logic ====================
function getRangeForType(type, drawCount) {
    let tMin = 0;
    let tMax = Math.min(type.count, drawCount);

    const apply = (op, val) => {
        if (!op || op === 'none') return;
        switch (op) {
            case '>=': tMin = Math.max(tMin, val); break;
            case '>':  tMin = Math.max(tMin, val + 1); break;
            case '<=': tMax = Math.min(tMax, val); break;
            case '<':  tMax = Math.min(tMax, val - 1); break;
            case '=':  tMin = Math.max(tMin, val); tMax = Math.min(tMax, val); break;
        }
    };

    apply(type.cond1.op, type.cond1.val);
    apply(type.cond2.op, type.cond2.val);

    if (tMin > tMax) return [1, 0];
    return [tMin, tMax];
}

function calculateProbability(N, n, types) {
    let sumK = types.reduce((sum, t) => sum + t.count, 0);
    let R = N - sumK;
    if (R < 0 || n > N || n < 0) return 0;

    let totalWaysLn = logCombination(N, n);
    if (totalWaysLn === -Infinity) return 0;

    let totalProb = 0;

    function recurse(index, currentSumX, currentLnWays) {
        if (index === types.length) {
            let xRem = n - currentSumX;
            if (xRem >= 0 && xRem <= R) {
                let remLn = logCombination(R, xRem);
                totalProb += Math.exp(currentLnWays + remLn - totalWaysLn);
            }
            return;
        }
        let t = types[index];
        for (let x = t.tMin; x <= t.tMax; x++) {
            if (currentSumX + x > n) break; 
            let chooseLn = logCombination(t.count, x);
            if (chooseLn === -Infinity) continue;
            recurse(index + 1, currentSumX + x, currentLnWays + chooseLn);
        }
    }

    recurse(0, 0, 0);
    return Math.min(1, Math.max(0, totalProb));
}

// ==================== UI & Rendering ====================
const TYPE_COLORS = ['#818cf8', '#22d3ee', '#34d399', '#fbbf24', '#fb7185', '#a78bfa'];

function renderCardTypes() {
    const $list = document.getElementById('cardTypesList');
    $list.innerHTML = '';

    cardTypes.forEach((type, idx) => {
        const color = TYPE_COLORS[idx % TYPE_COLORS.length];
        const item = document.createElement('div');
        item.className = 'card-type-item';
        item.dataset.id = type.id;
        
        item.innerHTML = `
            <div class="card-type-item__header">
                <span class="card-type-item__color" style="background:${color};box-shadow:0 0 8px ${color}55"></span>
                <span class="card-type-item__title">${escapeHtml(type.name || tr('noName'))}</span>
                <button type="button" class="card-type-item__remove" data-id="${type.id}" title="${tr('removeTitle')}">&times;</button>
            </div>
            <div class="card-type-item__fields">
                <div class="field">
                    <label class="field__label">${tr('nameLabel')}</label>
                    <input type="text" class="field__input ct-name" data-id="${type.id}" value="${escapeHtml(type.name)}" placeholder="${tr('namePlaceholder')}">
                </div>
                <div class="field">
                    <label class="field__label">${tr('countLabel')}</label>
                    <input type="number" class="field__input ct-count" data-id="${type.id}" value="${type.count}" min="0">
                </div>
                <div class="field">
                    <label class="field__label">${tr('conditionLabel')}</label>
                    <div class="field__op-wrap">
                        <div style="display:flex; gap:0.25rem;">
                            <select class="field__select ct-op" data-id="${type.id}" data-cond="cond1" style="flex:1; padding-right:1rem;">
                                <option value=">=" ${type.cond1.op === '>=' ? 'selected' : ''}>&ge;</option>
                                <option value=">" ${type.cond1.op === '>' ? 'selected' : ''}>&gt;</option>
                                <option value="=" ${type.cond1.op === '=' ? 'selected' : ''}>=</option>
                                <option value="<=" ${type.cond1.op === '<=' ? 'selected' : ''}>&le;</option>
                                <option value="<" ${type.cond1.op === '<' ? 'selected' : ''}>&lt;</option>
                            </select>
                            <input type="number" class="field__input ct-val" data-id="${type.id}" data-cond="cond1" value="${type.cond1.val}" min="0" style="flex:1;">
                        </div>
                        <div style="display:flex; gap:0.25rem; margin-top:0.25rem;">
                            <select class="field__select ct-op" data-id="${type.id}" data-cond="cond2" style="flex:1; padding-right:1rem;">
                                <option value="none" ${type.cond2.op === 'none' ? 'selected' : ''}>-- ${tr('opSymbols').none} --</option>
                                <option value=">=" ${type.cond2.op === '>=' ? 'selected' : ''}>&ge;</option>
                                <option value=">" ${type.cond2.op === '>' ? 'selected' : ''}>&gt;</option>
                                <option value="=" ${type.cond2.op === '=' ? 'selected' : ''}>=</option>
                                <option value="<=" ${type.cond2.op === '<=' ? 'selected' : ''}>&le;</option>
                                <option value="<" ${type.cond2.op === '<' ? 'selected' : ''}>&lt;</option>
                            </select>
                            <input type="number" class="field__input ct-val" data-id="${type.id}" data-cond="cond2" value="${type.cond2.val}" min="0" style="flex:1; ${type.cond2.op === 'none' ? 'opacity:0.4;' : ''}" ${type.cond2.op === 'none' ? 'disabled' : ''}>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $list.appendChild(item);
    });

    attachCardEventListeners();
    updateXAxisOptions();
}

function attachCardEventListeners() {
    const $list = document.getElementById('cardTypesList');

    $list.querySelectorAll('.card-type-item__remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            cardTypes = cardTypes.filter(t => t.id !== id);
            renderCardTypes();
        });
    });

    $list.querySelectorAll('.ct-name').forEach(input => {
        input.addEventListener('input', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            const type = cardTypes.find(t => t.id === id);
            if (type) {
                type.name = e.target.value;
                const headerTitle = e.currentTarget.closest('.card-type-item').querySelector('.card-type-item__title');
                if (headerTitle) headerTitle.textContent = e.target.value || tr('noName');
                updateXAxisOptions();
            }
        });
    });

    $list.querySelectorAll('.ct-count').forEach(input => {
        input.addEventListener('input', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            const type = cardTypes.find(t => t.id === id);
            if (type) type.count = parseInt(e.target.value) || 0;
        });
    });

    $list.querySelectorAll('.ct-op').forEach(select => {
        select.addEventListener('change', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            const condKey = e.currentTarget.dataset.cond;
            const type = cardTypes.find(t => t.id === id);
            if (type) {
                type[condKey].op = e.target.value;
                const parentDiv = e.target.parentElement;
                const valInput = parentDiv.querySelector('.ct-val');
                if (valInput && condKey === 'cond2') {
                    if (e.target.value === 'none') {
                        valInput.disabled = true;
                        valInput.style.opacity = '0.4';
                    } else {
                        valInput.disabled = false;
                        valInput.style.opacity = '1';
                    }
                }
            }
        });
    });

    $list.querySelectorAll('.ct-val').forEach(input => {
        input.addEventListener('input', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            const condKey = e.currentTarget.dataset.cond;
            const type = cardTypes.find(t => t.id === id);
            if (type) type[condKey].val = parseInt(e.target.value) || 0;
        });
    });
}

function updateXAxisOptions() {
    const $select = document.getElementById('xAxisVar');
    const currentVal = $select.value;

    $select.innerHTML = `
        <option value="">${tr('xAxisPlaceholder')}</option>
        <option value="totalCards">${tr('chartXLabelTotalCards')}</option>
        <option value="drawCount">${tr('chartXLabelDrawCount')}</option>
    `;

    cardTypes.forEach(t => {
        const name = t.name.trim() || tr('noName');
        const opt = document.createElement('option');
        opt.value = `cardType_${t.id}`;
        opt.textContent = `${name} (Count in Deck)`;
        $select.appendChild(opt);
    });

    $select.value = currentVal;
}

// ==================== Display Results ====================
function runCalculation() {
    const N = parseInt(document.getElementById('totalCards').value) || 0;
    const n = parseInt(document.getElementById('drawCount').value) || 0;
    const sumK = cardTypes.reduce((sum, t) => sum + t.count, 0);

    if (N <= 0 || n < 0 || n > N || sumK > N) {
        displayError(tr('invalidDeck'));
        return;
    }

    const typesForCalc = cardTypes.map(t => {
        let [tMin, tMax] = getRangeForType(t, n);
        return { count: t.count, tMin, tMax };
    });

    const prob = calculateProbability(N, n, typesForCalc);
    
    const percent = prob * 100;
    const percentStr = percent < 0.01 && percent > 0 ? '< 0.01%' : percent > 99.99 && percent < 100 ? '> 99.99%' : percent.toFixed(2) + '%';
    
    let oddsStr = prob <= 0 ? tr('impossible') : prob >= 1 ? '1 : 1' : `1 : ${( (1 - prob) / prob ).toFixed(2)}`;

    const symbols = tr('opSymbols');
    const typeSummary = cardTypes.map(t => {
        const getCond = (c) => c.op === 'none' ? '' : `${symbols[c.op]} ${c.val}`;
        let condText = getCond(t.cond1);
        if (getCond(t.cond2)) condText += ` ${tr('conditionAnd')} ${getCond(t.cond2)}`;
        if (!condText) condText = tr('noCondition');
        return `"${escapeHtml(t.name)}" ${condText} (${t.count} ${tr('unit')})`;
    }).join('<br>');

    document.getElementById('resultArea').innerHTML = `
        <div class="result__content">
            <div class="result__value-wrap">
                <div class="result__percent">${percentStr}</div>
                <div class="result__fraction">${tr('probability')}: ${prob.toFixed(8)}</div>
            </div>
            <div class="result__bar-container">
                <div class="result__bar" style="width: 0%"></div>
            </div>
            <div class="result__details">
                <div class="result__detail-row">
                    <span class="result__detail-label">${tr('totalCardsResult')}</span>
                    <span class="result__detail-value">${N} ${tr('unit')}</span>
                </div>
                <div class="result__detail-row">
                    <span class="result__detail-label">${tr('drawResult')}</span>
                    <span class="result__detail-value">${n} ${tr('unit')}</span>
                </div>
                <div class="result__detail-row" style="flex-direction:column; align-items:flex-start; gap:0.5rem;">
                    <span class="result__detail-label">${tr('conditionLabel')}</span>
                    <span class="result__detail-value" style="font-weight:normal; font-size:0.8rem;">${typeSummary}</span>
                </div>
                <div class="result__detail-row">
                    <span class="result__detail-label">${tr('oddsLabel')}</span>
                    <span class="result__detail-value">${oddsStr}</span>
                </div>
            </div>
        </div>
    `;

    // FIX 1: Use requestAnimationFrame instead of setTimeout for reliable bar animation
    requestAnimationFrame(() => {
        const bar = document.querySelector('.result__bar');
        if (bar) bar.style.width = Math.min(percent, 100) + '%';
    });
}

function displayError(msg) {
    document.getElementById('resultArea').innerHTML = `
        <div class="result__error">
            <span class="result__error-icon">⚠️</span>
            <p class="result__error-msg">${escapeHtml(msg)}</p>
        </div>
    `;
}

// ==================== Chart ====================
function generateGraph() {
    const variable = document.getElementById('xAxisVar').value;
    if (!variable) return alert(tr('xAxisPlaceholder'));

    let xMin = parseInt(document.getElementById('xMin').value) || 0;
    let xMax = parseInt(document.getElementById('xMax').value) || 0;
    
    // FIX 2: Handle case when min equals max
    if (xMin === xMax) {
        const newMax = xMin + 1;
        const warningMsg = tr('rangeEqualWarning')
            .replace('{val}', xMin)
            .replace('{newMax}', newMax);
        alert(warningMsg);
        xMax = newMax;
        document.getElementById('xMax').value = newMax;
    }
    
    if (xMin > xMax) return alert(tr('invalidRange'));

    const baseN = parseInt(document.getElementById('totalCards').value) || 0;
    const basen = parseInt(document.getElementById('drawCount').value) || 0;

    let labels = [];
    let dataPoints = [];
    let xLabel = '';

    for (let x = xMin; x <= xMax; x++) {
        labels.push(x);
        let currentN = baseN;
        let currentn = basen;
        let cTypes = JSON.parse(JSON.stringify(cardTypes));

        if (variable === 'totalCards') {
            currentN = x;
            xLabel = tr('chartXLabelTotalCards');
        } else if (variable === 'drawCount') {
            currentn = x;
            xLabel = tr('chartXLabelDrawCount');
        } else if (variable.startsWith('cardType_')) {
            const id = parseInt(variable.split('_')[1]);
            const tgt = cTypes.find(t => t.id === id);
            if (tgt) {
                tgt.count = x;
                xLabel = tgt.name;
            }
        }

        let sumK = cTypes.reduce((sum, t) => sum + t.count, 0);
        if (currentN <= 0 || currentn < 0 || currentn > currentN || sumK > currentN) {
            dataPoints.push(null);
            continue;
        }

        const typesForCalc = cTypes.map(t => {
            let [tMin, tMax] = getRangeForType(t, currentn);
            return { count: t.count, tMin, tMax };
        });

        const p = calculateProbability(currentN, currentn, typesForCalc);
        dataPoints.push(p * 100);
    }

    document.getElementById('chartContainer').style.display = 'block';
    if (chartInstance) chartInstance.destroy();

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const cLine = isDark ? '#818cf8' : '#6366f1';
    const cGrid = isDark ? 'rgba(139,92,246,0.06)' : 'rgba(99,102,241,0.06)';
    const cText = isDark ? '#8f8da5' : '#6b6880';

    const ctx = document.getElementById('probChart').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: tr('chartYLabel'),
                data: dataPoints,
                borderColor: cLine,
                backgroundColor: isDark ? 'rgba(129,140,248,0.1)' : 'rgba(99,102,241,0.1)',
                borderWidth: 2.5,
                fill: true,
                spanGaps: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { title: { display: true, text: xLabel, color: cText }, grid: { color: cGrid }, ticks: { color: cText } },
                y: { title: { display: true, text: tr('chartYLabel'), color: cText }, min: 0, max: 100, grid: { color: cGrid }, ticks: { color: cText, callback: v => v + '%' } }
            }
        }
    });
}

// ==================== Initialize System ====================
function updateUILang() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        if (I18N[currentLang][el.dataset.i18n]) el.textContent = I18N[currentLang][el.dataset.i18n];
    });
    document.getElementById('langToggleLabel').textContent = currentLang === 'th' ? 'EN' : 'TH';
    renderCardTypes();
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('calc_theme', theme);
    if (chartInstance) generateGraph();
}

document.addEventListener('DOMContentLoaded', () => {
    const getNextId = () => {
        return cardTypes.length === 0 ? 1 : Math.max(...cardTypes.map(c => c.id)) + 1;
    };

    cardTypes = [{
        id: getNextId(),
        name: currentLang === 'th' ? 'การ์ด A' : 'Card A',
        count: 4,
        cond1: { op: '>=', val: 2 },
        cond2: { op: '<', val: 4 }
    }];

    applyTheme(localStorage.getItem('calc_theme') || 'dark');
    updateUILang();

    document.getElementById('themeToggle').addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    document.getElementById('langToggle').addEventListener('click', () => {
        currentLang = currentLang === 'th' ? 'en' : 'th';
        localStorage.setItem('calc_lang', currentLang);
        updateUILang();
    });

    document.getElementById('addCardType').addEventListener('click', () => {
        cardTypes.push({
            id: getNextId(),
            name: `${tr('defaultNewCardPrefix')} ${getNextId()}`,
            count: 3,
            cond1: { op: '>=', val: 1 },
            cond2: { op: 'none', val: 0 }
        });
        renderCardTypes();
    });

    document.getElementById('calculateBtn').addEventListener('click', runCalculation);
    document.getElementById('generateGraph').addEventListener('click', generateGraph);
});