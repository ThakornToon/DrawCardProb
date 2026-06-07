/* ============================================
   Card Draw Probability Calculator
   Multivariate Hypergeometric Distribution
   v2.0 – Bilingual (TH/EN) + Operator Selection
   ============================================ */

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
        thresholdLabel: 'เกณฑ์',
        removeTitle: 'ลบชนิดนี้',
        namePlaceholder: 'ชื่อการ์ด',
        noName: '(ไม่มีชื่อ)',
        resultsTitle: 'ผลลัพธ์',
        resultPlaceholder: 'กดปุ่ม "คำนวณ" เพื่อดูผลลัพธ์',
        probability: 'ความน่าจะเป็น',
        totalCardsResult: 'การ์ดทั้งหมด',
        drawResult: 'จั่ว',
        conditionLabel: 'เงื่อนไข',
        oddsLabel: 'อัตราส่วน',
        impossible: 'ไม่มีทาง',
        graphTitle: 'กราฟ',
        xAxisVarLabel: 'ตัวแปรแกน X',
        xAxisPlaceholder: '— เลือกตัวแปร —',
        xMinLabel: 'ค่าเริ่มต้น',
        xMaxLabel: 'ค่าสิ้นสุด',
        generateGraphBtn: 'สร้างกราฟ',
        chartYLabel: 'ความน่าจะเป็น (%)',
        chartXLabelTotalCards: 'จำนวนการ์ดทั้งหมด (N)',
        chartXLabelDrawCount: 'จำนวนการ์ดที่จั่ว (n)',
        xOptTotalCards: 'จำนวนการ์ดทั้งหมดในกอง (N)',
        xOptDrawCount: 'จำนวนการ์ดที่จั่ว (n)',
        xOptCount: (name) => `จำนวน "${name}" ในกอง (K)`,
        xOptMin: (name) => `เกณฑ์ "${name}" (k)`,
        chartXLabelCount: (name) => `จำนวน "${name}" ในกอง (K)`,
        chartXLabelMin: (name) => `เกณฑ์ "${name}" (k)`,
        chartTooltipTitle: (xLabel, val) => `${xLabel}: ${val}`,
        chartTooltipProb: (val) => val !== null && val !== undefined
            ? `ความน่าจะเป็น: ${val.toFixed(4)}%`
            : 'ไม่สามารถคำนวณ',
        conditionFormat: (name, opSym, val, count) =>
            `"${name}" ${opSym} ${val} ใบ (มี ${count} ใบในกอง)`,
        defaultCardNames: [
            'การ์ด A', 'การ์ด B', 'การ์ด C', 'การ์ด D',
            'การ์ด E', 'การ์ด F', 'การ์ด G', 'การ์ด H',
            'การ์ด I', 'การ์ด J', 'การ์ด K', 'การ์ด L',
        ],
        defaultNewCardPrefix: 'การ์ด',
        opLabels: { '>=': 'อย่างน้อย', '>': 'มากกว่า', '<=': 'อย่างมาก', '<': 'น้อยกว่า' },
        opSymbols: { '>=': '≥', '>': '>', '<=': '≤', '<': '<' },
        footer: 'คำนวณด้วย Multivariate Hypergeometric Distribution \u00b7 สูตร: P = Σ [∏ C(Kᵢ, xᵢ) · C(R, n−Σxᵢ)] / C(N, n)',
        // Errors
        errTotalCards: 'จำนวนการ์ดทั้งหมดต้องมากกว่า 0',
        errDrawCount: 'จำนวนการ์ดที่จั่วต้องมากกว่า 0',
        errDrawGtTotal: 'จำนวนการ์ดที่จั่วมากกว่าจำนวนการ์ดในกอง',
        errSumK: (sumK, total) =>
            `จำนวนรวมของการ์ดแต่ละชนิด (${sumK}) มากกว่าจำนวนการ์ดทั้งหมด (${total})`,
        errNegCount: (name) => `จำนวนในกองของ "${name}" ต้องไม่ติดลบ`,
        errNegThreshold: (name) => `เกณฑ์ของ "${name}" ต้องไม่ติดลบ`,
        errGteThreshold: (name, min, count) =>
            `ต้องการ "${name}" ≥ ${min} ใบ แต่มีในกองเพียง ${count} ใบ`,
        errGtThreshold: (name, min, count) =>
            `ต้องการ "${name}" > ${min} ใบ แต่มีในกองเพียง ${count} ใบ`,
        errLtThresholdZero: (name) =>
            `เกณฑ์ "<" ของ "${name}" ต้องมีค่าอย่างน้อย 1`,
        errSumMin: (sumMin, draw) =>
            `จำนวนขั้นต่ำรวม (${sumMin}) มากกว่าจำนวนที่จั่ว (${draw})`,
        errCalc: 'ไม่สามารถคำนวณได้: ข้อมูลไม่ถูกต้อง',
        alertSelectVar: 'กรุณาเลือกตัวแปรสำหรับแกน X',
        alertInvalidRange: 'กรุณาระบุช่วงค่าที่ถูกต้อง (เริ่มต้น ≤ สิ้นสุด)',
        alertRangeTooWide: 'ช่วงค่ากว้างเกินไป (สูงสุด 200 จุด) กรุณาลดช่วงลง',
    },
    en: {
        appSubtitle: 'Multivariate Hypergeometric Distribution Calculator',
        langToggleLabel: 'ไทย',
        themeToggleTitle: 'Toggle light / dark mode',
        deckSetup: 'Deck Setup',
        totalCardsLabel: 'Total Cards in Deck',
        unit: 'cards',
        drawCountLabel: 'Cards to Draw',
        cardTypesTitle: 'Desired Card Types',
        addType: 'Add Type',
        calculateBtn: 'Calculate Probability',
        nameLabel: 'Name',
        countLabel: 'In Deck',
        thresholdLabel: 'Threshold',
        removeTitle: 'Remove this type',
        namePlaceholder: 'Card name',
        noName: '(unnamed)',
        resultsTitle: 'Results',
        resultPlaceholder: 'Click "Calculate" to see results',
        probability: 'Probability',
        totalCardsResult: 'Total Cards',
        drawResult: 'Draw',
        conditionLabel: 'Condition',
        oddsLabel: 'Odds',
        impossible: 'Impossible',
        graphTitle: 'Graph',
        xAxisVarLabel: 'X-Axis Variable',
        xAxisPlaceholder: '— Select variable —',
        xMinLabel: 'From',
        xMaxLabel: 'To',
        generateGraphBtn: 'Generate Graph',
        chartYLabel: 'Probability (%)',
        chartXLabelTotalCards: 'Total Cards (N)',
        chartXLabelDrawCount: 'Cards Drawn (n)',
        xOptTotalCards: 'Total Cards in Deck (N)',
        xOptDrawCount: 'Cards to Draw (n)',
        xOptCount: (name) => `Count of "${name}" in Deck (K)`,
        xOptMin: (name) => `Threshold of "${name}" (k)`,
        chartXLabelCount: (name) => `Count of "${name}" in Deck (K)`,
        chartXLabelMin: (name) => `Threshold of "${name}" (k)`,
        chartTooltipTitle: (xLabel, val) => `${xLabel}: ${val}`,
        chartTooltipProb: (val) => val !== null && val !== undefined
            ? `Probability: ${val.toFixed(4)}%`
            : 'Cannot calculate',
        conditionFormat: (name, opSym, val, count) =>
            `"${name}" ${opSym} ${val} (${count} in deck)`,
        defaultCardNames: [
            'Card A', 'Card B', 'Card C', 'Card D',
            'Card E', 'Card F', 'Card G', 'Card H',
            'Card I', 'Card J', 'Card K', 'Card L',
        ],
        defaultNewCardPrefix: 'Card',
        opLabels: { '>=': 'At least', '>': 'More than', '<=': 'At most', '<': 'Less than' },
        opSymbols: { '>=': '≥', '>': '>', '<=': '≤', '<': '<' },
        footer: 'Powered by Multivariate Hypergeometric Distribution \u00b7 Formula: P = Σ [∏ C(Kᵢ, xᵢ) · C(R, n−Σxᵢ)] / C(N, n)',
        // Errors
        errTotalCards: 'Total cards must be greater than 0',
        errDrawCount: 'Cards to draw must be greater than 0',
        errDrawGtTotal: 'Cards to draw cannot exceed total cards in deck',
        errSumK: (sumK, total) =>
            `Sum of card type counts (${sumK}) exceeds total cards (${total})`,
        errNegCount: (name) => `Count of "${name}" must not be negative`,
        errNegThreshold: (name) => `Threshold of "${name}" must not be negative`,
        errGteThreshold: (name, min, count) =>
            `"${name}" requires ≥ ${min} but only ${count} are in deck`,
        errGtThreshold: (name, min, count) =>
            `"${name}" requires > ${min} but only ${count} are in deck`,
        errLtThresholdZero: (name) =>
            `"<" threshold for "${name}" must be at least 1`,
        errSumMin: (sumMin, draw) =>
            `Combined minimum (${sumMin}) exceeds cards to draw (${draw})`,
        errCalc: 'Cannot calculate: invalid configuration',
        alertSelectVar: 'Please select an X-axis variable',
        alertInvalidRange: 'Please enter a valid range (From ≤ To)',
        alertRangeTooWide: 'Range too wide (max 200 points), please narrow it down',
    },
};

let currentLang = 'th';

/** Translate a key; if the value is a function, call it with extra args */
function tr(key, ...args) {
    const lang = I18N[currentLang];
    if (!lang) return key;
    const val = lang[key];
    if (val === undefined) return key;
    if (typeof val === 'function') return val(...args);
    return val;
}

// ==================== MATH UTILITIES ====================
const logFactorialCache = [0, 0]; // logFactorial(0)=0, logFactorial(1)=0

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

/**
 * Calculate probability with per-type operator support.
 *
 * @param {number} totalCards  - N: total cards in deck
 * @param {number} drawCount   - n: cards drawn
 * @param {Array}  cardTypes   - [{count: Ki, minDesired: ki, operator: '<'|'<='|'>='|'>'}]
 * @returns {number} probability 0..1
 */
function calculateProbability(totalCards, drawCount, cardTypes) {
    const sumK = cardTypes.reduce((s, t) => s + t.count, 0);
    const otherCards = totalCards - sumK;
    const logDenom = logCombination(totalCards, drawCount);
    if (logDenom === -Infinity) return 0;
    if (otherCards < 0) return NaN;
    if (drawCount > totalCards) return 0;
    if (drawCount < 0) return 0;

    let totalProb = 0;

    function getRange(type, remainingDraw) {
        const { count, minDesired, operator = '>=' } = type;
        const maxPossible = Math.min(count, remainingDraw);
        switch (operator) {
            case '>=': return [minDesired,         maxPossible];
            case '>':  return [minDesired + 1,     maxPossible];
            case '<=': return [0,                   Math.min(minDesired, maxPossible)];
            case '<':  return [0,                   Math.min(minDesired - 1, maxPossible)];
            default:   return [minDesired,         maxPossible];
        }
    }

    function enumerate(typeIdx, remainingDraw, logNumerator) {
        if (typeIdx === cardTypes.length) {
            if (remainingDraw < 0 || remainingDraw > otherCards) return;
            const logTerm = logNumerator + logCombination(otherCards, remainingDraw) - logDenom;
            totalProb += Math.exp(logTerm);
            return;
        }
        const [xiMin, xiMax] = getRange(cardTypes[typeIdx], remainingDraw);
        if (xiMin < 0 || xiMin > xiMax) return;
        for (let xi = xiMin; xi <= xiMax; xi++) {
            enumerate(
                typeIdx + 1,
                remainingDraw - xi,
                logNumerator + logCombination(cardTypes[typeIdx].count, xi)
            );
        }
    }

    enumerate(0, drawCount, 0);
    return Math.min(Math.max(totalProb, 0), 1);
}

// ==================== APP STATE ====================
const TYPE_COLORS = [
    '#818cf8', '#22d3ee', '#34d399', '#fbbf24',
    '#fb7185', '#a78bfa', '#f97316', '#14b8a6',
    '#e879f9', '#60a5fa', '#facc15', '#4ade80',
];

let cardTypes = [
    { id: 1, name: 'การ์ด A', count: 4, minDesired: 1, operator: '>=' },
];
let nextId = 2;
let chartInstance = null;

// ==================== DOM REFERENCES ====================
const $totalCards    = document.getElementById('totalCards');
const $drawCount     = document.getElementById('drawCount');
const $cardTypesList = document.getElementById('cardTypesList');
const $addCardType   = document.getElementById('addCardType');
const $calculateBtn  = document.getElementById('calculateBtn');
const $resultArea    = document.getElementById('resultArea');
const $xAxisVar      = document.getElementById('xAxisVar');
const $xMin          = document.getElementById('xMin');
const $xMax          = document.getElementById('xMax');
const $generateGraph = document.getElementById('generateGraph');
const $chartContainer = document.getElementById('chartContainer');
const $probChart     = document.getElementById('probChart');
const $themeToggle   = document.getElementById('themeToggle');
const $langToggle    = document.getElementById('langToggle');
const $langLabel     = document.getElementById('langToggleLabel');

// ==================== THEME ====================
function getEffectiveTheme() {
    const explicit = document.documentElement.getAttribute('data-theme');
    if (explicit) return explicit;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function isDark() { return getEffectiveTheme() === 'dark'; }

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (_) { }
}

function toggleTheme() {
    applyTheme(isDark() ? 'light' : 'dark');
    if (chartInstance && chartInstance._lastRenderData) {
        const { labels, data, xLabel } = chartInstance._lastRenderData;
        const variable = chartInstance._lastVariable;
        renderChart(labels, data, xLabel, variable);
    }
}

(function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (_) { }
    if (saved === 'light' || saved === 'dark') applyTheme(saved);
})();

if ($themeToggle) $themeToggle.addEventListener('click', toggleTheme);

// ==================== LANGUAGE ====================
function applyLanguage(lang) {
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang === 'th' ? 'th' : 'en');
    try { localStorage.setItem('lang', lang); } catch (_) { }

    // Update static data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const val = I18N[lang][key];
        if (val && typeof val === 'string') el.textContent = val;
    });

    // Update controls
    if ($langLabel) $langLabel.textContent = tr('langToggleLabel');
    if ($themeToggle) $themeToggle.title = tr('themeToggleTitle');
    document.title = lang === 'th'
        ? 'เครื่องคำนวณความน่าจะเป็น — Card Draw Probability Calculator'
        : 'Card Draw Probability Calculator';

    // Re-render dynamic UI
    renderCardTypes();
    updateXAxisOptions();

    // Update result placeholder if still showing
    const $ph = $resultArea.querySelector('.result__placeholder p');
    if ($ph) $ph.textContent = tr('resultPlaceholder');

    // Re-render chart with updated labels
    if (chartInstance && chartInstance._lastRenderData) {
        const { labels, data } = chartInstance._lastRenderData;
        const variable = chartInstance._lastVariable;
        const newXLabel = variable ? getXLabelForVariable(variable) : chartInstance._lastRenderData.xLabel;
        renderChart(labels, data, newXLabel, variable);
    }
}

function toggleLanguage() {
    applyLanguage(currentLang === 'th' ? 'en' : 'th');
}

(function initLanguage() {
    let saved = null;
    try { saved = localStorage.getItem('lang'); } catch (_) { }
    if (saved === 'th' || saved === 'en') applyLanguage(saved);
})();

if ($langToggle) $langToggle.addEventListener('click', toggleLanguage);

// ==================== CHART THEME COLORS ====================
function getChartColors() {
    const dark = isDark();
    return {
        lineColor:         dark ? '#818cf8' : '#6366f1',
        fillTop:           dark ? 'rgba(129,140,248,0.35)' : 'rgba(99,102,241,0.18)',
        fillBottom:        dark ? 'rgba(129,140,248,0.02)' : 'rgba(99,102,241,0.01)',
        pointBorder:       dark ? '#171923' : '#ffffff',
        pointHoverBg:      dark ? '#a78bfa' : '#818cf8',
        pointHoverBorder:  dark ? '#ffffff' : '#2d2b3a',
        tooltipBg:         dark ? 'rgba(23,25,35,0.95)' : 'rgba(255,255,255,0.95)',
        tooltipTitle:      dark ? '#e2e0f0' : '#2d2b3a',
        tooltipBody:       dark ? '#8f8da5' : '#6b6880',
        tooltipBorder:     dark ? 'rgba(139,92,246,0.3)' : 'rgba(99,102,241,0.15)',
        axisTitle:         dark ? '#8f8da5' : '#6b6880',
        axisTick:          dark ? '#5a586e' : '#9e9bae',
        gridColor:         dark ? 'rgba(139,92,246,0.06)' : 'rgba(99,102,241,0.06)',
        borderColor:       dark ? 'rgba(139,92,246,0.15)' : 'rgba(99,102,241,0.10)',
    };
}

// ==================== HELPERS ====================
function getTypeColor(index) {
    return TYPE_COLORS[index % TYPE_COLORS.length];
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function getXLabelForVariable(variable) {
    if (variable === 'totalCards') return tr('chartXLabelTotalCards');
    if (variable === 'drawCount')  return tr('chartXLabelDrawCount');
    if (variable.startsWith('count_')) {
        const id = parseInt(variable.split('_')[1]);
        const type = cardTypes.find(t => t.id === id);
        return type ? tr('chartXLabelCount', type.name) : '';
    }
    if (variable.startsWith('min_')) {
        const id = parseInt(variable.split('_')[1]);
        const type = cardTypes.find(t => t.id === id);
        return type ? tr('chartXLabelMin', type.name) : '';
    }
    return '';
}

// ==================== RENDER CARD TYPES ====================
function renderCardTypes() {
    $cardTypesList.innerHTML = '';
    cardTypes.forEach((type, idx) => {
        const color = getTypeColor(idx);
        const op = type.operator || '>=';
        const item = document.createElement('div');
        item.className = 'card-type-item';
        item.dataset.id = type.id;
        item.innerHTML = `
            <div class="card-type-item__header">
                <span class="card-type-item__color" style="background:${color};box-shadow:0 0 8px ${color}55"></span>
                <span class="card-type-item__title">${escapeHtml(type.name)}</span>
                ${cardTypes.length > 1
                    ? `<button type="button" class="card-type-item__remove" data-id="${type.id}"
                         title="${tr('removeTitle')}">&times;</button>`
                    : ''}
            </div>
            <div class="card-type-item__fields">
                <div class="field">
                    <label class="field__label">${tr('nameLabel')}</label>
                    <input type="text" class="field__input ct-name" data-id="${type.id}"
                        value="${escapeHtml(type.name)}" placeholder="${tr('namePlaceholder')}">
                </div>
                <div class="field">
                    <label class="field__label">${tr('countLabel')}</label>
                    <input type="number" class="field__input ct-count" data-id="${type.id}"
                        value="${type.count}" min="0" max="1000">
                </div>
                <div class="field">
                    <label class="field__label">${tr('thresholdLabel')}</label>
                    <div class="field__op-wrap">
                        <div class="operator-group" data-id="${type.id}">
                            <button type="button" class="op-btn${op === '<'  ? ' op-btn--active' : ''}" data-op="<">&lt;</button>
                            <button type="button" class="op-btn${op === '<=' ? ' op-btn--active' : ''}" data-op="<=">&le;</button>
                            <button type="button" class="op-btn${op === '>=' ? ' op-btn--active' : ''}" data-op=">=">&ge;</button>
                            <button type="button" class="op-btn${op === '>'  ? ' op-btn--active' : ''}" data-op=">">&gt;</button>
                        </div>
                        <input type="number" class="field__input ct-min" data-id="${type.id}"
                            value="${type.minDesired}" min="0" max="1000">
                    </div>
                </div>
            </div>
        `;
        $cardTypesList.appendChild(item);
    });

    // Remove buttons
    $cardTypesList.querySelectorAll('.card-type-item__remove').forEach(btn => {
        btn.addEventListener('click', () => removeCardType(parseInt(btn.dataset.id)));
    });
    // Name input
    $cardTypesList.querySelectorAll('.ct-name').forEach(input => {
        input.addEventListener('input', (e) =>
            updateCardType(parseInt(e.target.dataset.id), 'name', e.target.value));
    });
    // Count input
    $cardTypesList.querySelectorAll('.ct-count').forEach(input => {
        input.addEventListener('input', (e) =>
            updateCardType(parseInt(e.target.dataset.id), 'count', parseInt(e.target.value) || 0));
    });
    // Threshold input
    $cardTypesList.querySelectorAll('.ct-min').forEach(input => {
        input.addEventListener('input', (e) =>
            updateCardType(parseInt(e.target.dataset.id), 'minDesired', parseInt(e.target.value) || 0));
    });
    // Operator buttons
    $cardTypesList.querySelectorAll('.operator-group').forEach(group => {
        const id = parseInt(group.dataset.id);
        group.querySelectorAll('.op-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const newOp = btn.dataset.op;
                updateCardType(id, 'operator', newOp);
                // Update active state immediately (no full re-render needed)
                group.querySelectorAll('.op-btn').forEach(b => {
                    b.classList.toggle('op-btn--active', b.dataset.op === newOp);
                });
            });
        });
    });

    updateXAxisOptions();
}

function addCardType() {
    const names = I18N[currentLang].defaultCardNames;
    const usedNames = new Set(cardTypes.map(t => t.name));
    let newName = `${tr('defaultNewCardPrefix')} ${nextId}`;
    for (const n of names) {
        if (!usedNames.has(n)) { newName = n; break; }
    }
    cardTypes.push({ id: nextId++, name: newName, count: 3, minDesired: 1, operator: '>=' });
    renderCardTypes();
}

function removeCardType(id) {
    cardTypes = cardTypes.filter(t => t.id !== id);
    renderCardTypes();
}

function updateCardType(id, field, value) {
    const type = cardTypes.find(t => t.id === id);
    if (type) {
        type[field] = value;
        if (field === 'name') {
            const item = $cardTypesList.querySelector(`[data-id="${id}"]`);
            if (item) {
                item.querySelector('.card-type-item__title').textContent = value || tr('noName');
            }
        }
        updateXAxisOptions();
    }
}

// ==================== VALIDATION ====================
function validate() {
    const totalCards = parseInt($totalCards.value);
    const drawCount  = parseInt($drawCount.value);

    if (isNaN(totalCards) || totalCards < 1)
        return { valid: false, error: tr('errTotalCards') };
    if (isNaN(drawCount) || drawCount < 1)
        return { valid: false, error: tr('errDrawCount') };
    if (drawCount > totalCards)
        return { valid: false, error: tr('errDrawGtTotal') };

    const sumK = cardTypes.reduce((s, t) => s + t.count, 0);
    if (sumK > totalCards)
        return { valid: false, error: tr('errSumK', sumK, totalCards) };

    for (const type of cardTypes) {
        if (type.count < 0)
            return { valid: false, error: tr('errNegCount', type.name) };
        if (type.minDesired < 0)
            return { valid: false, error: tr('errNegThreshold', type.name) };

        if (type.operator === '>=' && type.minDesired > type.count)
            return { valid: false, error: tr('errGteThreshold', type.name, type.minDesired, type.count) };
        if (type.operator === '>' && type.minDesired >= type.count)
            return { valid: false, error: tr('errGtThreshold', type.name, type.minDesired, type.count) };
        if (type.operator === '<' && type.minDesired < 1)
            return { valid: false, error: tr('errLtThresholdZero', type.name) };
    }

    // Effective minimum draw requirement (only >= and > impose a minimum)
    const sumMin = cardTypes.reduce((s, t) => {
        if (t.operator === '>=') return s + t.minDesired;
        if (t.operator === '>')  return s + t.minDesired + 1;
        return s;
    }, 0);
    if (sumMin > drawCount)
        return { valid: false, error: tr('errSumMin', sumMin, drawCount) };

    return { valid: true, totalCards, drawCount };
}

// ==================== DISPLAY RESULT ====================
function displayResult(probability, totalCards, drawCount) {
    const percent = probability * 100;
    const percentStr = percent < 0.01 && percent > 0
        ? '< 0.01%'
        : percent > 99.99 && percent < 100
            ? '> 99.99%'
            : percent.toFixed(2) + '%';
    const oddsStr = probability > 0 && probability < 1
        ? `1 : ${(1 / probability).toFixed(2)}`
        : probability >= 1
            ? '1 : 1'
            : tr('impossible');

    const opSymbols = I18N[currentLang].opSymbols;
    const typeSummary = cardTypes.map(t => {
        const opSym = opSymbols[t.operator] || '≥';
        return tr('conditionFormat', t.name, opSym, t.minDesired, t.count);
    }).join(', ');

    $resultArea.innerHTML = `
        <div class="result__content">
            <div class="result__value-wrap">
                <div class="result__percent">${percentStr}</div>
                <div class="result__fraction">${tr('probability')}: ${probability.toFixed(8)}</div>
            </div>
            <div class="result__bar-container">
                <div class="result__bar" style="width: 0%"></div>
            </div>
            <div class="result__details">
                <div class="result__detail-row">
                    <span class="result__detail-label">${tr('totalCardsResult')}</span>
                    <span class="result__detail-value">${totalCards} ${tr('unit')}</span>
                </div>
                <div class="result__detail-row">
                    <span class="result__detail-label">${tr('drawResult')}</span>
                    <span class="result__detail-value">${drawCount} ${tr('unit')}</span>
                </div>
                <div class="result__detail-row">
                    <span class="result__detail-label">${tr('conditionLabel')}</span>
                    <span class="result__detail-value">${escapeHtml(typeSummary)}</span>
                </div>
                <div class="result__detail-row">
                    <span class="result__detail-label">${tr('oddsLabel')}</span>
                    <span class="result__detail-value">${oddsStr}</span>
                </div>
            </div>
        </div>
    `;
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const bar = $resultArea.querySelector('.result__bar');
            if (bar) bar.style.width = Math.min(percent, 100) + '%';
        });
    });
}

function displayError(msg) {
    $resultArea.innerHTML = `
        <div class="result__error">
            <span class="result__error-icon">⚠️</span>
            <p class="result__error-msg">${escapeHtml(msg)}</p>
        </div>
    `;
}

// ==================== CALCULATE ====================
function runCalculation() {
    const validation = validate();
    if (!validation.valid) {
        displayError(validation.error);
        return;
    }
    const { totalCards, drawCount } = validation;
    const types = cardTypes.map(t => ({
        count: t.count,
        minDesired: t.minDesired,
        operator: t.operator || '>=',
    }));
    const prob = calculateProbability(totalCards, drawCount, types);
    if (isNaN(prob)) {
        displayError(tr('errCalc'));
        return;
    }
    displayResult(prob, totalCards, drawCount);
}

// ==================== GRAPH (X-AXIS) OPTIONS ====================
function updateXAxisOptions() {
    const currentVal = $xAxisVar.value;
    $xAxisVar.innerHTML = `<option value="">${tr('xAxisPlaceholder')}</option>`;
    const options = [
        { value: 'totalCards', label: tr('xOptTotalCards') },
        { value: 'drawCount',  label: tr('xOptDrawCount') },
    ];
    cardTypes.forEach(type => {
        options.push({ value: `count_${type.id}`, label: tr('xOptCount', type.name) });
        options.push({ value: `min_${type.id}`,   label: tr('xOptMin', type.name) });
    });
    options.forEach(opt => {
        const el = document.createElement('option');
        el.value = opt.value;
        el.textContent = opt.label;
        $xAxisVar.appendChild(el);
    });
    if ([...($xAxisVar.options)].some(o => o.value === currentVal)) {
        $xAxisVar.value = currentVal;
    }
}

// Auto-fill range when variable is selected
$xAxisVar.addEventListener('change', () => {
    const v = $xAxisVar.value;
    if (!v) return;
    if (v === 'totalCards') {
        const sumK = cardTypes.reduce((s, t) => s + t.count, 0);
        $xMin.value = Math.max(sumK, 1);
        $xMax.value = Math.max(sumK + 30, parseInt($totalCards.value) + 10);
    } else if (v === 'drawCount') {
        $xMin.value = 1;
        $xMax.value = parseInt($totalCards.value) || 40;
    } else if (v.startsWith('count_')) {
        $xMin.value = 0;
        const id = parseInt(v.split('_')[1]);
        const type = cardTypes.find(t => t.id === id);
        $xMax.value = type ? Math.max(type.count + 10, 15) : 15;
    } else if (v.startsWith('min_')) {
        $xMin.value = 0;
        const id = parseInt(v.split('_')[1]);
        const type = cardTypes.find(t => t.id === id);
        $xMax.value = type ? type.count : 10;
    }
});

// ==================== GENERATE GRAPH ====================
function generateGraph() {
    const variable = $xAxisVar.value;
    if (!variable) {
        alert(tr('alertSelectVar'));
        return;
    }
    const xMin = parseInt($xMin.value);
    const xMax = parseInt($xMax.value);
    if (isNaN(xMin) || isNaN(xMax) || xMin > xMax) {
        alert(tr('alertInvalidRange'));
        return;
    }
    if (xMax - xMin > 200) {
        alert(tr('alertRangeTooWide'));
        return;
    }

    const baseTotalCards = parseInt($totalCards.value) || 40;
    const baseDrawCount  = parseInt($drawCount.value) || 5;
    const baseTypes      = cardTypes.map(t => ({ ...t }));

    const xLabels = [];
    const yValues = [];
    let xLabel = '';

    for (let x = xMin; x <= xMax; x++) {
        let N = baseTotalCards;
        let n = baseDrawCount;
        let types = baseTypes.map(t => ({
            count: t.count,
            minDesired: t.minDesired,
            operator: t.operator || '>=',
        }));

        if (variable === 'totalCards') {
            N = x;
            xLabel = tr('chartXLabelTotalCards');
        } else if (variable === 'drawCount') {
            n = x;
            xLabel = tr('chartXLabelDrawCount');
        } else if (variable.startsWith('count_')) {
            const id = parseInt(variable.split('_')[1]);
            const typeIdx = baseTypes.findIndex(t => t.id === id);
            if (typeIdx >= 0) {
                types[typeIdx].count = x;
                xLabel = tr('chartXLabelCount', baseTypes[typeIdx].name);
            }
        } else if (variable.startsWith('min_')) {
            const id = parseInt(variable.split('_')[1]);
            const typeIdx = baseTypes.findIndex(t => t.id === id);
            if (typeIdx >= 0) {
                types[typeIdx].minDesired = x;
                xLabel = tr('chartXLabelMin', baseTypes[typeIdx].name);
            }
        }

        // Skip clearly invalid configs
        const sumK = types.reduce((s, t) => s + t.count, 0);
        if (N < 1 || n < 1 || n > N || sumK > N) {
            xLabels.push(x); yValues.push(null); continue;
        }
        let skip = false;
        for (const t of types) {
            if (t.count < 0) { skip = true; break; }
            if (t.minDesired < 0) { skip = true; break; }
            // operator-specific quick sanity
            if (t.operator === '>=' && t.minDesired > t.count) { skip = true; break; }
            if (t.operator === '>'  && t.minDesired >= t.count) { skip = true; break; }
            if (t.operator === '<'  && t.minDesired < 1) { skip = true; break; }
        }
        if (skip) { xLabels.push(x); yValues.push(null); continue; }

        const prob = calculateProbability(N, n, types);
        xLabels.push(x);
        yValues.push(isNaN(prob) ? null : prob * 100);
    }

    renderChart(xLabels, yValues, xLabel, variable);
}

// ==================== CHART RENDERING ====================
function renderChart(labels, data, xLabel, variable = null) {
    $chartContainer.style.display = 'block';
    if (chartInstance) chartInstance.destroy();

    const ctx = $probChart.getContext('2d');
    const c = getChartColors();

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, c.fillTop);
    gradient.addColorStop(1, c.fillBottom);

    // Capture current language for tooltip closures
    const snapLang = currentLang;
    const yLabel = tr('chartYLabel');

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: yLabel,
                data,
                borderColor: c.lineColor,
                backgroundColor: gradient,
                borderWidth: 2.5,
                pointBackgroundColor: c.lineColor,
                pointBorderColor: c.pointBorder,
                pointBorderWidth: 2,
                pointRadius: labels.length > 50 ? 0 : 3,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: c.pointHoverBg,
                pointHoverBorderColor: c.pointHoverBorder,
                fill: true,
                tension: 0.3,
                spanGaps: true,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'nearest', axis: 'x', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: c.tooltipBg,
                    titleColor: c.tooltipTitle,
                    bodyColor: c.tooltipBody,
                    borderColor: c.tooltipBorder,
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    titleFont: { family: 'Inter', weight: '600' },
                    bodyFont: { family: 'Inter' },
                    callbacks: {
                        title: (items) => tr('chartTooltipTitle', xLabel, items[0].label),
                        label: (item) => tr('chartTooltipProb', item.parsed.y),
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: xLabel,
                        color: c.axisTitle,
                        font: { family: 'Inter', size: 12, weight: '500' },
                    },
                    ticks: { color: c.axisTick, font: { family: 'Inter', size: 11 }, maxTicksLimit: 20 },
                    grid: { color: c.gridColor },
                    border: { color: c.borderColor },
                },
                y: {
                    title: {
                        display: true,
                        text: yLabel,
                        color: c.axisTitle,
                        font: { family: 'Inter', size: 12, weight: '500' },
                    },
                    min: 0,
                    max: 100,
                    ticks: {
                        color: c.axisTick,
                        font: { family: 'Inter', size: 11 },
                        callback: (val) => val + '%',
                    },
                    grid: { color: c.gridColor },
                    border: { color: c.borderColor },
                },
            },
        },
    });

    chartInstance._lastRenderData = { labels, data, xLabel };
    chartInstance._lastVariable   = variable;
}

// ==================== EVENT LISTENERS ====================
$addCardType.addEventListener('click', addCardType);
$calculateBtn.addEventListener('click', runCalculation);
$generateGraph.addEventListener('click', generateGraph);

// Allow Enter to trigger calculation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'SELECT') {
            e.preventDefault();
            runCalculation();
        }
    }
});

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    renderCardTypes();
});
if (document.readyState !== 'loading') {
    renderCardTypes();
}