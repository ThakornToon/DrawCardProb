/* ============================================
   Card Draw Probability Calculator
   Multivariate Hypergeometric Distribution
   ============================================ */
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
    if (r > n - r) r = n - r; // Optimize: C(n,r) = C(n, n-r)
    return logFactorial(n) - logFactorial(r) - logFactorial(n - r);
}
/**
 * Calculate the probability of drawing at least the minimum desired
 * for each card type simultaneously.
 *
 * @param {number} totalCards     - N: total cards in the deck
 * @param {number} drawCount     - n: cards to draw
 * @param {Array}  cardTypes     - [{count: Ki, minDesired: ki}]
 * @returns {number} probability (0 to 1)
 */
function calculateProbability(totalCards, drawCount, cardTypes) {
    const sumK = cardTypes.reduce((s, t) => s + t.count, 0);
    const otherCards = totalCards - sumK;
    const logDenom = logCombination(totalCards, drawCount);
    if (logDenom === -Infinity) return 0;
    if (otherCards < 0) return NaN; // Invalid: more typed cards than total
    if (drawCount > totalCards) return 0;
    if (drawCount < 0) return 0;
    let totalProb = 0;
    function enumerate(typeIdx, remainingDraw, logNumerator) {
        if (typeIdx === cardTypes.length) {
            // Remaining draw comes from "other" cards
            if (remainingDraw < 0 || remainingDraw > otherCards) return;
            const logTerm = logNumerator + logCombination(otherCards, remainingDraw) - logDenom;
            totalProb += Math.exp(logTerm);
            return;
        }
        const { count, minDesired } = cardTypes[typeIdx];
        const maxDraw = Math.min(count, remainingDraw);
        if (minDesired > maxDraw) return; // Impossible for this type
        for (let xi = minDesired; xi <= maxDraw; xi++) {
            enumerate(
                typeIdx + 1,
                remainingDraw - xi,
                logNumerator + logCombination(count, xi)
            );
        }
    }
    enumerate(0, drawCount, 0);
    return Math.min(Math.max(totalProb, 0), 1); // Clamp [0, 1]
}
// ==================== APP STATE ====================
const TYPE_COLORS = [
    '#818cf8', '#22d3ee', '#34d399', '#fbbf24',
    '#fb7185', '#a78bfa', '#f97316', '#14b8a6',
    '#e879f9', '#60a5fa', '#facc15', '#4ade80',
];
let cardTypes = [
    { id: 1, name: 'การ์ด A', count: 4, minDesired: 1 },
];
let nextId = 2;
let chartInstance = null;
// ==================== DOM REFERENCES ====================
const $totalCards = document.getElementById('totalCards');
const $drawCount = document.getElementById('drawCount');
const $cardTypesList = document.getElementById('cardTypesList');
const $addCardType = document.getElementById('addCardType');
const $calculateBtn = document.getElementById('calculateBtn');
const $resultArea = document.getElementById('resultArea');
const $xAxisVar = document.getElementById('xAxisVar');
const $xMin = document.getElementById('xMin');
const $xMax = document.getElementById('xMax');
const $generateGraph = document.getElementById('generateGraph');
const $chartContainer = document.getElementById('chartContainer');
const $probChart = document.getElementById('probChart');
const $themeToggle = document.getElementById('themeToggle');
// ==================== THEME TOGGLE ====================
function getEffectiveTheme() {
    const explicit = document.documentElement.getAttribute('data-theme');
    if (explicit) return explicit;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function isDark() {
    return getEffectiveTheme() === 'dark';
}
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (_) { }
}
function toggleTheme() {
    applyTheme(isDark() ? 'light' : 'dark');
    // Redraw chart if present
    if (chartInstance) {
        const lastGraphData = chartInstance._lastRenderData;
        if (lastGraphData) {
            renderChart(lastGraphData.labels, lastGraphData.data, lastGraphData.xLabel);
        }
    }
}
// Initialize theme
(function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (_) { }
    if (saved === 'light' || saved === 'dark') {
        applyTheme(saved);
    }
    // If no saved preference, let CSS prefers-color-scheme handle it
})();
if ($themeToggle) {
    $themeToggle.addEventListener('click', toggleTheme);
}
// ==================== CHART THEME COLORS ====================
function getChartColors() {
    const dark = isDark();
    return {
        lineColor: dark ? '#818cf8' : '#6366f1',
        fillTop: dark ? 'rgba(129, 140, 248, 0.35)' : 'rgba(99, 102, 241, 0.18)',
        fillBottom: dark ? 'rgba(129, 140, 248, 0.02)' : 'rgba(99, 102, 241, 0.01)',
        pointBorder: dark ? '#171923' : '#ffffff',
        pointHoverBg: dark ? '#a78bfa' : '#818cf8',
        pointHoverBorder: dark ? '#ffffff' : '#2d2b3a',
        tooltipBg: dark ? 'rgba(23, 25, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        tooltipTitle: dark ? '#e2e0f0' : '#2d2b3a',
        tooltipBody: dark ? '#8f8da5' : '#6b6880',
        tooltipBorder: dark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(99, 102, 241, 0.15)',
        axisTitle: dark ? '#8f8da5' : '#6b6880',
        axisTick: dark ? '#5a586e' : '#9e9bae',
        gridColor: dark ? 'rgba(139, 92, 246, 0.06)' : 'rgba(99, 102, 241, 0.06)',
        borderColor: dark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(99, 102, 241, 0.10)',
    };
}
// ==================== RENDER CARD TYPES ====================
function getTypeColor(index) {
    return TYPE_COLORS[index % TYPE_COLORS.length];
}
function renderCardTypes() {
    $cardTypesList.innerHTML = '';
    cardTypes.forEach((type, idx) => {
        const color = getTypeColor(idx);
        const item = document.createElement('div');
        item.className = 'card-type-item';
        item.dataset.id = type.id;
        item.innerHTML = `
            <div class="card-type-item__header">
                <span class="card-type-item__color" style="background:${color};box-shadow:0 0 8px ${color}55"></span>
                <span class="card-type-item__title">${escapeHtml(type.name)}</span>
                ${cardTypes.length > 1 ? `<button type="button" class="card-type-item__remove" data-id="${type.id}" title="ลบชนิดนี้">&times;</button>` : ''}
            </div>
            <div class="card-type-item__fields">
                <div class="field">
                    <label class="field__label">ชื่อ</label>
                    <input type="text" class="field__input ct-name" data-id="${type.id}" value="${escapeHtml(type.name)}" placeholder="ชื่อการ์ด">
                </div>
                <div class="field">
                    <label class="field__label">จำนวนในกอง</label>
                    <input type="number" class="field__input ct-count" data-id="${type.id}" value="${type.count}" min="0" max="1000">
                </div>
                <div class="field">
                    <label class="field__label">ต้องการอย่างน้อย</label>
                    <input type="number" class="field__input ct-min" data-id="${type.id}" value="${type.minDesired}" min="0" max="1000">
                </div>
            </div>
        `;
        $cardTypesList.appendChild(item);
    });
    // Attach listeners
    $cardTypesList.querySelectorAll('.card-type-item__remove').forEach(btn => {
        btn.addEventListener('click', () => removeCardType(parseInt(btn.dataset.id)));
    });
    $cardTypesList.querySelectorAll('.ct-name').forEach(input => {
        input.addEventListener('input', (e) => updateCardType(parseInt(e.target.dataset.id), 'name', e.target.value));
    });
    $cardTypesList.querySelectorAll('.ct-count').forEach(input => {
        input.addEventListener('input', (e) => updateCardType(parseInt(e.target.dataset.id), 'count', parseInt(e.target.value) || 0));
    });
    $cardTypesList.querySelectorAll('.ct-min').forEach(input => {
        input.addEventListener('input', (e) => updateCardType(parseInt(e.target.dataset.id), 'minDesired', parseInt(e.target.value) || 0));
    });
    updateXAxisOptions();
}
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
function addCardType() {
    const names = ['การ์ด A', 'การ์ด B', 'การ์ด C', 'การ์ด D', 'การ์ด E', 'การ์ด F',
        'การ์ด G', 'การ์ด H', 'การ์ด I', 'การ์ด J', 'การ์ด K', 'การ์ด L'];
    const usedNames = new Set(cardTypes.map(t => t.name));
    let newName = `การ์ด ${nextId}`;
    for (const n of names) {
        if (!usedNames.has(n)) { newName = n; break; }
    }
    cardTypes.push({ id: nextId++, name: newName, count: 3, minDesired: 1 });
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
        // Update header title if name changed
        if (field === 'name') {
            const item = $cardTypesList.querySelector(`[data-id="${id}"]`);
            if (item) {
                item.querySelector('.card-type-item__title').textContent = value || '(ไม่มีชื่อ)';
            }
        }
        updateXAxisOptions();
    }
}
// ==================== VALIDATION ====================
function validate() {
    const totalCards = parseInt($totalCards.value);
    const drawCount = parseInt($drawCount.value);
    if (isNaN(totalCards) || totalCards < 1) {
        return { valid: false, error: 'จำนวนการ์ดทั้งหมดต้องมากกว่า 0' };
    }
    if (isNaN(drawCount) || drawCount < 1) {
        return { valid: false, error: 'จำนวนการ์ดที่จั่วต้องมากกว่า 0' };
    }
    if (drawCount > totalCards) {
        return { valid: false, error: 'จำนวนการ์ดที่จั่วมากกว่าจำนวนการ์ดในกอง' };
    }
    const sumK = cardTypes.reduce((s, t) => s + t.count, 0);
    if (sumK > totalCards) {
        return { valid: false, error: `จำนวนรวมของการ์ดแต่ละชนิด (${sumK}) มากกว่าจำนวนการ์ดทั้งหมด (${totalCards})` };
    }
    for (const type of cardTypes) {
        if (type.count < 0) {
            return { valid: false, error: `จำนวนในกองของ "${type.name}" ต้องไม่ติดลบ` };
        }
        if (type.minDesired < 0) {
            return { valid: false, error: `จำนวนขั้นต่ำของ "${type.name}" ต้องไม่ติดลบ` };
        }
        if (type.minDesired > type.count) {
            return { valid: false, error: `ต้องการ "${type.name}" อย่างน้อย ${type.minDesired} ใบ แต่มีในกองเพียง ${type.count} ใบ` };
        }
    }
    const sumMin = cardTypes.reduce((s, t) => s + t.minDesired, 0);
    if (sumMin > drawCount) {
        return { valid: false, error: `จำนวนขั้นต่ำรวม (${sumMin}) มากกว่าจำนวนที่จั่ว (${drawCount})` };
    }
    return { valid: true, totalCards, drawCount };
}
// ==================== DISPLAY RESULT ====================
function displayResult(probability, totalCards, drawCount) {
    const percent = (probability * 100);
    const percentStr = percent < 0.01 && percent > 0
        ? '< 0.01%'
        : percent > 99.99 && percent < 100
            ? '> 99.99%'
            : percent.toFixed(2) + '%';
    const oddsStr = probability > 0 && probability < 1
        ? `1 : ${(1 / probability).toFixed(2)}`
        : probability >= 1
            ? '1 : 1'
            : 'ไม่มีทาง';
    const typeSummary = cardTypes.map(t =>
        `"${t.name}" ≥ ${t.minDesired} ใบ (มี ${t.count} ใบในกอง)`
    ).join(', ');
    $resultArea.innerHTML = `
        <div class="result__content">
            <div class="result__value-wrap">
                <div class="result__percent">${percentStr}</div>
                <div class="result__fraction">ความน่าจะเป็น: ${probability.toFixed(8)}</div>
            </div>
            <div class="result__bar-container">
                <div class="result__bar" style="width: 0%"></div>
            </div>
            <div class="result__details">
                <div class="result__detail-row">
                    <span class="result__detail-label">การ์ดทั้งหมด</span>
                    <span class="result__detail-value">${totalCards} ใบ</span>
                </div>
                <div class="result__detail-row">
                    <span class="result__detail-label">จั่ว</span>
                    <span class="result__detail-value">${drawCount} ใบ</span>
                </div>
                <div class="result__detail-row">
                    <span class="result__detail-label">เงื่อนไข</span>
                    <span class="result__detail-value">${escapeHtml(typeSummary)}</span>
                </div>
                <div class="result__detail-row">
                    <span class="result__detail-label">อัตราส่วน</span>
                    <span class="result__detail-value">${oddsStr}</span>
                </div>
            </div>
        </div>
    `;
    // Animate bar
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
    const types = cardTypes.map(t => ({ count: t.count, minDesired: t.minDesired }));
    const prob = calculateProbability(totalCards, drawCount, types);
    if (isNaN(prob)) {
        displayError('ไม่สามารถคำนวณได้: ข้อมูลไม่ถูกต้อง');
        return;
    }
    displayResult(prob, totalCards, drawCount);
}
// ==================== GRAPH (X-AXIS) OPTIONS ====================
function updateXAxisOptions() {
    const currentVal = $xAxisVar.value;
    $xAxisVar.innerHTML = '<option value="">— เลือกตัวแปร —</option>';
    const options = [
        { value: 'totalCards', label: 'จำนวนการ์ดทั้งหมดในกอง (N)' },
        { value: 'drawCount', label: 'จำนวนการ์ดที่จั่ว (n)' },
    ];
    cardTypes.forEach(type => {
        options.push({
            value: `count_${type.id}`,
            label: `จำนวน "${type.name}" ในกอง (K)`
        });
        options.push({
            value: `min_${type.id}`,
            label: `ขั้นต่ำ "${type.name}" ที่ต้องการ (k)`
        });
    });
    options.forEach(opt => {
        const el = document.createElement('option');
        el.value = opt.value;
        el.textContent = opt.label;
        $xAxisVar.appendChild(el);
    });
    // Restore selection if still valid
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
        alert('กรุณาเลือกตัวแปรสำหรับแกน X');
        return;
    }
    const xMin = parseInt($xMin.value);
    const xMax = parseInt($xMax.value);
    if (isNaN(xMin) || isNaN(xMax) || xMin > xMax) {
        alert('กรุณาระบุช่วงค่าที่ถูกต้อง (เริ่มต้น ≤ สิ้นสุด)');
        return;
    }
    if (xMax - xMin > 200) {
        alert('ช่วงค่ากว้างเกินไป (สูงสุด 200 จุด) กรุณาลดช่วงลง');
        return;
    }
    const baseTotalCards = parseInt($totalCards.value) || 40;
    const baseDrawCount = parseInt($drawCount.value) || 5;
    const baseTypes = cardTypes.map(t => ({ ...t }));
    const xLabels = [];
    const yValues = [];
    let xLabel = '';
    for (let x = xMin; x <= xMax; x++) {
        let totalCards = baseTotalCards;
        let drawCount = baseDrawCount;
        let types = baseTypes.map(t => ({ count: t.count, minDesired: t.minDesired }));
        if (variable === 'totalCards') {
            totalCards = x;
            xLabel = 'จำนวนการ์ดทั้งหมด (N)';
        } else if (variable === 'drawCount') {
            drawCount = x;
            xLabel = 'จำนวนการ์ดที่จั่ว (n)';
        } else if (variable.startsWith('count_')) {
            const id = parseInt(variable.split('_')[1]);
            const typeIdx = baseTypes.findIndex(t => t.id === id);
            if (typeIdx >= 0) {
                types[typeIdx].count = x;
                xLabel = `จำนวน "${baseTypes[typeIdx].name}" ในกอง (K)`;
            }
        } else if (variable.startsWith('min_')) {
            const id = parseInt(variable.split('_')[1]);
            const typeIdx = baseTypes.findIndex(t => t.id === id);
            if (typeIdx >= 0) {
                types[typeIdx].minDesired = x;
                xLabel = `ขั้นต่ำ "${baseTypes[typeIdx].name}" (k)`;
            }
        }
        // Skip invalid configurations
        const sumK = types.reduce((s, t) => s + t.count, 0);
        if (totalCards < 1 || drawCount < 1 || drawCount > totalCards || sumK > totalCards) {
            xLabels.push(x);
            yValues.push(null);
            continue;
        }
        let skip = false;
        for (const t of types) {
            if (t.minDesired > t.count || t.minDesired < 0 || t.count < 0) {
                skip = true;
                break;
            }
        }
        if (skip) {
            xLabels.push(x);
            yValues.push(null);
            continue;
        }
        const prob = calculateProbability(totalCards, drawCount, types);
        xLabels.push(x);
        yValues.push(isNaN(prob) ? null : prob * 100);
    }
    renderChart(xLabels, yValues, xLabel);
}
// ==================== CHART RENDERING ====================
function renderChart(labels, data, xLabel) {
    $chartContainer.style.display = 'block';
    if (chartInstance) {
        chartInstance.destroy();
    }
    const ctx = $probChart.getContext('2d');
    const c = getChartColors();
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, c.fillTop);
    gradient.addColorStop(1, c.fillBottom);
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'ความน่าจะเป็น (%)',
                data: data,
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
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: false,
                },
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
                        title: (items) => `${xLabel}: ${items[0].label}`,
                        label: (item) => {
                            const val = item.parsed.y;
                            return val !== null ? `ความน่าจะเป็น: ${val.toFixed(4)}%` : 'ไม่สามารถคำนวณ';
                        },
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
                    ticks: {
                        color: c.axisTick,
                        font: { family: 'Inter', size: 11 },
                        maxTicksLimit: 20,
                    },
                    grid: { color: c.gridColor },
                    border: { color: c.borderColor },
                },
                y: {
                    title: {
                        display: true,
                        text: 'ความน่าจะเป็น (%)',
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
    // Store data for re-render on theme change
    chartInstance._lastRenderData = { labels, data, xLabel };
}
// ==================== EVENT LISTENERS ====================
$addCardType.addEventListener('click', addCardType);
$calculateBtn.addEventListener('click', runCalculation);
$generateGraph.addEventListener('click', generateGraph);
// Allow Enter key to trigger calculation
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
// Run immediately if DOM already loaded
if (document.readyState !== 'loading') {
    renderCardTypes();
}