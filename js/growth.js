/* ==========================================
   js/growth.js - 성장 계산기 (스킬, 장비, 테크) 로직
========================================== */

window.showGrowthTab = function(tabId) {
    document.querySelectorAll('.growth-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.growth-section').forEach(s => s.classList.remove('active'));
    
    document.getElementById('tab-' + tabId).classList.add('active');
    document.getElementById('growth-' + tabId).classList.add('active');
    
    if(tabId === 'skill') window.renderSkillRows();
    if(tabId === 'gear') window.renderGearUI();
    if(tabId === 'valor') window.renderValorUI();
};


// =====================================
// 1. SKILL MEDAL CALCULATOR (스킬 훈장)
// =====================================
window.currentSkillTier = 'UR';
const SKILL_CUMULATIVE = {
    UR: [0, 0, 200, 400, 800, 1200, 1800, 2400, 3200, 4000, 5200, 6800, 9200, 12400, 16400, 21200, 26800, 33200, 40400, 48400, 57600, 68000, 79600, 92400, 106400, 121600, 138000, 156000, 176000, 198000, 222000],
    SSR: [0, 0, 180, 360, 720, 1080, 1620, 2160, 2880, 3600, 4680, 6120, 8280, 11160, 14760, 19080, 24120, 29880, 36360, 43560, 51840, 61200, 71640, 83160, 95760, 109440, 124200, 140400, 158400, 178200, 199800]
};

window.setSkillTier = function(tier) {
    window.currentSkillTier = tier;
    window.renderSkillRows();
};

window.changeHeroBg = function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas'); let w = img.width, h = img.height; const maxSize = 800; 
                if (w > h) { if (w > maxSize) { h *= maxSize / w; w = maxSize; } } else { if (h > maxSize) { w *= maxSize / h; h = maxSize; } }
                canvas.width = w; canvas.height = h; canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                document.getElementById('hero-bg-img').style.backgroundImage = `url('${compressedDataUrl}')`;
                try { localStorage.setItem('lastwar_hero_bg', compressedDataUrl); } catch(err) { window.customAlert("이미지 용량이 너무 큽니다."); }
            }; img.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
};

window.resetHeroBg = function() { localStorage.removeItem('lastwar_hero_bg'); window.renderSkillRows(); };

window.skillStepInterval = null;
window.stepSkillVal = function(id, delta) {
    const el = document.getElementById(id);
    if(el) {
        let val = parseInt(el.value) || 1;
        val = Math.max(1, Math.min(30, val + delta));
        
        if (id.includes('cur')) {
            const tgtEl = document.getElementById(id.replace('cur', 'tgt'));
            if (tgtEl && val > parseInt(tgtEl.value)) tgtEl.value = val;
        } else if (id.includes('tgt')) {
            const curEl = document.getElementById(id.replace('tgt', 'cur'));
            if (curEl && val < parseInt(curEl.value)) curEl.value = val;
        }
        
        el.value = val;
        window.calcSkillCost();
    }
};

window.startSkillStep = function(e, id, delta) {
    if (e) { if (e.cancelable) e.preventDefault(); if (e.stopPropagation) e.stopPropagation(); }
    window.stepSkillVal(id, delta);
    let speed = 150; let count = 0;
    if(window.skillStepInterval) clearTimeout(window.skillStepInterval);
    const run = () => {
        window.stepSkillVal(id, delta);
        count++;
        if(count > 5) speed = 50;
        if(count > 15) speed = 15;
        window.skillStepInterval = setTimeout(run, speed);
    };
    window.skillStepInterval = setTimeout(run, speed);
};

window.stopSkillStep = function() {
    if(window.skillStepInterval) clearTimeout(window.skillStepInterval);
};

if (!window.skillStepListenersAdded) {
    window.addEventListener('mouseup', window.stopSkillStep);
    window.addEventListener('touchend', window.stopSkillStep);
    window.skillStepListenersAdded = true;
}

window.renderSkillRows = function() {
    const t = window.i18n[window.currentLang].skill;
    const container = document.getElementById('growth-skill');
    if(!container) return;
    const saved = JSON.parse(localStorage.getItem('lastwar_skill_data') || '{"s1":{"c":1,"t":10},"s2":{"c":1,"t":10},"s3":{"c":1,"t":10}}');
    const savedBg = localStorage.getItem('lastwar_hero_bg'); 
    let bgStyle = savedBg ? `background-image: url('${savedBg}');` : `background-image: url('./dva.jpg'); background-color: #1c1c1e;`;

    let html = `
    <div style="display:flex; gap:10px; margin-bottom: 15px;">
        <button class="target-btn ${window.currentSkillTier === 'UR' ? 'active' : ''}" style="flex:1; ${window.currentSkillTier === 'UR' ? 'background:var(--primary-soft); color:var(--primary);' : ''}" onclick="window.setSkillTier('UR')">${t.ur}</button>
        <button class="target-btn ${window.currentSkillTier === 'SSR' ? 'active' : ''}" style="flex:1; ${window.currentSkillTier === 'SSR' ? 'background:var(--primary-soft); color:var(--primary);' : ''}" onclick="window.setSkillTier('SSR')">${t.ssr}</button>
    </div>
    <div class="hero-immersive-layout">
        <div id="hero-bg-img" class="hero-bg" style="${bgStyle}"></div>
        <div class="skill-nodes-container">
    `;
    
    const posNames = [t.pos1, t.pos2, t.pos3, t.pos4];
    
    for(let i=1; i<=4; i++) {
        if(i === 4) {
            html += `
            <div class="skill-game-node">
                <div class="node-header">${posNames[i-1]}</div>
                <div style="flex: 1; display: flex; align-items: center; justify-content: center; color: #FFD60A; font-weight: 900; font-size: 1.5rem; text-shadow: 0 2px 5px rgba(0,0,0,0.8); letter-spacing: 2px;">MAX</div>
            </div>`;
        } else {
            let cur = saved[`s${i}`]?.c || 1; let tgt = saved[`s${i}`]?.t || 10;
            html += `
            <div class="skill-game-node">
                <div class="node-header">${posNames[i-1]}</div>
                
                <div class="node-row">
                    <span>${t.cur}</span>
                    <div class="skill-stepper">
                        <button class="skill-step-btn" onmousedown="window.startSkillStep(event, 'skill-cur-${i}', -1)" ontouchstart="window.startSkillStep(event, 'skill-cur-${i}', -1)">-</button>
                        <input type="number" id="skill-cur-${i}" class="node-input" value="${cur}" readonly>
                        <button class="skill-step-btn" onmousedown="window.startSkillStep(event, 'skill-cur-${i}', 1)" ontouchstart="window.startSkillStep(event, 'skill-cur-${i}', 1)">+</button>
                    </div>
                </div>
                
                <div class="node-row">
                    <span>${t.tgt}</span>
                    <div class="skill-stepper">
                        <button class="skill-step-btn" onmousedown="window.startSkillStep(event, 'skill-tgt-${i}', -1)" ontouchstart="window.startSkillStep(event, 'skill-tgt-${i}', -1)">-</button>
                        <input type="number" id="skill-tgt-${i}" class="node-input" value="${tgt}" readonly>
                        <button class="skill-step-btn" onmousedown="window.startSkillStep(event, 'skill-tgt-${i}', 1)" ontouchstart="window.startSkillStep(event, 'skill-tgt-${i}', 1)">+</button>
                    </div>
                </div>
                
                <div class="node-cost" id="skill-cost-${i}">0 🏅</div>
            </div>`;
        }
    }
    
    html += `</div></div>
    <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px;">
        <input type="file" id="hero-bg-upload" accept="image/*" style="display:none;" onchange="window.changeHeroBg(event)">
        <label for="hero-bg-upload" class="btn-secondary" style="padding: 8px 16px; font-size: 0.85rem; border-radius: 10px; margin:0; cursor:pointer;">${t.bg_change}</label>
        <button onclick="window.resetHeroBg()" class="btn-secondary" style="padding: 8px 16px; font-size: 0.85rem; border-radius: 10px; margin:0; color: var(--danger);">${t.bg_reset}</button>
    </div>
    <div class="summary-box" style="margin-top:15px; padding:15px;">
        <div id="skill-total-text" style="text-align: center; color: #d97706; font-weight: 900; font-size: 1.2rem;">${t.total}: 0</div>
    </div>`;
    
    container.innerHTML = html; window.calcSkillCost();
};

window.calcSkillCost = function() {
    const t = window.i18n[window.currentLang].skill; let grandTotal = 0; const dataToSave = {}; const table = SKILL_CUMULATIVE[window.currentSkillTier];
    const formatK = (val) => val >= 1000 ? (val/1000).toLocaleString('en-US', {maximumFractionDigits: 1}) + 'k' : val.toString();
    
    for(let i=1; i<=3; i++) {
        let curEl = document.getElementById(`skill-cur-${i}`); let tgtEl = document.getElementById(`skill-tgt-${i}`);
        if(!curEl || !tgtEl) continue;
        let cur = parseInt(curEl.value) || 1; let tgt = parseInt(tgtEl.value) || 1;
        if(tgt < cur) { tgt = cur; tgtEl.value = cur; }
        dataToSave[`s${i}`] = { c: cur, t: tgt };
        let cost = table[tgt] - table[cur];
        
        document.getElementById(`skill-cost-${i}`).innerText = formatK(cost) + ' 🏅'; 
        grandTotal += cost;
    }
    
    const totEl = document.getElementById('skill-total-text');
    if(totEl) totEl.innerText = `${t.total}: ${formatK(grandTotal)}`;
    localStorage.setItem('lastwar_skill_data', JSON.stringify(dataToSave));
};


// =====================================
// 2. GEAR UPGRADE CALCULATOR (장비 강화)
// =====================================
const GEAR_LEVELS = ['Lv 0', 'Lv 10', 'Lv 20', 'Lv 30', 'Lv 40', '1 Star', '2 Star', '3 Star', '4 Star', '5 Star'];
const GEAR_COSTS = [
    { gold: 0, ore: 0, cer: 0, bp: 0, mbp: 0 },
    { gold: 3.2, ore: 20.8, cer: 0, bp: 0, mbp: 0 },
    { gold: 5.9, ore: 38.8, cer: 0, bp: 0, mbp: 0 },
    { gold: 8.8, ore: 58.8, cer: 0, bp: 0, mbp: 0 },
    { gold: 11.2, ore: 76.2, cer: 0, bp: 0, mbp: 0 },
    { gold: 93.6, ore: 62.5, cer: 750, bp: 5, mbp: 0 },
    { gold: 121.6, ore: 81.0, cer: 975, bp: 10, mbp: 0 },
    { gold: 150.0, ore: 100.0, cer: 1200, bp: 15, mbp: 0 },
    { gold: 178.0, ore: 118.5, cer: 1425, bp: 20, mbp: 0 },
    { gold: 206.0, ore: 138.0, cer: 1650, bp: 0, mbp: 10 }
];

window.renderGearUI = function() {
    const container = document.getElementById('growth-gear');
    if(!container) return;
    const t = window.i18n[window.currentLang].growth;
    
    let html = '<div class="gear-grid">';
    
    const parts = [
        { id: 'gun', name: t.gear_gun },
        { id: 'armor', name: t.gear_armor },
        { id: 'chip', name: t.gear_chip },
        { id: 'radar', name: t.gear_radar }
    ];
    
    parts.forEach(p => {
        html += `
        <div class="gear-card">
            <div class="gear-header">${p.name}</div>
            <div class="gear-row">
                <span>${t.cur_tier}</span>
                <select id="gear-cur-${p.id}" class="modern-select" onchange="window.calcGearCost()">
                    ${GEAR_LEVELS.map((l, i) => `<option value="${i}">${l}</option>`).join('')}
                </select>
            </div>
            <div class="gear-row">
                <span>${t.tgt_tier}</span>
                <select id="gear-tgt-${p.id}" class="modern-select" onchange="window.calcGearCost()">
                    ${GEAR_LEVELS.map((l, i) => `<option value="${i}">${l}</option>`).join('')}
                </select>
            </div>
            <div class="gear-item-cost-box" id="gear-cost-${p.id}">
                <div style="font-size:0.8rem; color:var(--text-muted); text-align:center;">업그레이드 불필요</div>
            </div>
        </div>`;
    });
    html += '</div>';
    
    html += `
    <div class="summary-box">
        <div class="summary-title">${t.tot_res}</div>
        <div class="summary-grid">
            <div class="res-item" title="Gold (M)">
                <span class="res-label">${t.res_gold}</span>
                <div class="res-value"><span class="res-icon">🟡</span> <span id="gear-tot-gold">0</span>M</div>
            </div>
            <div class="res-item" title="Ore (k)">
                <span class="res-label">${t.res_ore}</span>
                <div class="res-value"><span class="res-icon">🔷</span> <span id="gear-tot-ore">0</span>k</div>
            </div>
            <div class="res-item" title="Ceramic">
                <span class="res-label">${t.res_cer}</span>
                <div class="res-value"><span class="res-icon">🟧</span> <span id="gear-tot-cer">0</span></div>
            </div>
            <div class="res-item" title="Blueprints">
                <span class="res-label">${t.res_bp}</span>
                <div class="res-value"><span class="res-icon">📜</span> <span id="gear-tot-bp">0</span></div>
            </div>
            <div class="res-item" title="Mythic Blueprints">
                <span class="res-label">${t.res_mbp}</span>
                <div class="res-value"><span class="res-icon">📕</span> <span id="gear-tot-mbp">0</span></div>
            </div>
        </div>
    </div>`;
    container.innerHTML = html;
    window.calcGearCost(); // 💡 초기 렌더링 시 계산 함수 실행
};

window.calcGearCost = function() {
    let grandTotals = { gold: 0, ore: 0, cer: 0, bp: 0, mbp: 0 };
    
    ['gun', 'armor', 'radar', 'chip'].forEach(id => {
        let curEl = document.getElementById(`gear-cur-${id}`);
        let tgtEl = document.getElementById(`gear-tgt-${id}`);
        if(!curEl || !tgtEl) return;
        
        let cur = parseInt(curEl.value);
        let tgt = parseInt(tgtEl.value);
        if(tgt < cur) { tgt = cur; tgtEl.value = cur; }
        
        // 💡 개별 장비 자원 계산 로직
        let localTotal = { gold: 0, ore: 0, cer: 0, bp: 0, mbp: 0 };
        for(let i = cur + 1; i <= tgt; i++) {
            localTotal.gold += GEAR_COSTS[i].gold; localTotal.ore += GEAR_COSTS[i].ore;
            localTotal.cer += GEAR_COSTS[i].cer; localTotal.bp += GEAR_COSTS[i].bp; localTotal.mbp += GEAR_COSTS[i].mbp;
            
            grandTotals.gold += GEAR_COSTS[i].gold; grandTotals.ore += GEAR_COSTS[i].ore;
            grandTotals.cer += GEAR_COSTS[i].cer; grandTotals.bp += GEAR_COSTS[i].bp; grandTotals.mbp += GEAR_COSTS[i].mbp;
        }
        
        // 💡 개별 장비 UI 렌더링 반영
        const costBox = document.getElementById(`gear-cost-${id}`);
        if(costBox) {
            if (localTotal.gold === 0 && localTotal.ore === 0) {
                costBox.innerHTML = `<div style="font-size:0.8rem; color:var(--text-muted); text-align:center;">업그레이드 불필요</div>`;
            } else {
                let costHtml = `<div class="mini-res-grid">`;
                if(localTotal.gold > 0) costHtml += `<div><span class="res-icon">🟡</span> ${(Math.round(localTotal.gold*10)/10).toLocaleString()}M</div>`;
                if(localTotal.ore > 0) costHtml += `<div><span class="res-icon">🔷</span> ${(Math.round(localTotal.ore*10)/10).toLocaleString()}k</div>`;
                if(localTotal.cer > 0) costHtml += `<div><span class="res-icon">🟧</span> ${localTotal.cer.toLocaleString()}</div>`;
                if(localTotal.bp > 0) costHtml += `<div><span class="res-icon">📜</span> ${localTotal.bp.toLocaleString()}</div>`;
                if(localTotal.mbp > 0) costHtml += `<div><span class="res-icon">📕</span> ${localTotal.mbp.toLocaleString()}</div>`;
                costHtml += `</div>`;
                costBox.innerHTML = costHtml;
            }
        }
    });
    
    // 전체 총합 UI 업데이트
    document.getElementById('gear-tot-gold').innerText = (Math.round(grandTotals.gold * 10) / 10).toLocaleString();
    document.getElementById('gear-tot-ore').innerText = (Math.round(grandTotals.ore * 10) / 10).toLocaleString();
    document.getElementById('gear-tot-cer').innerText = grandTotals.cer.toLocaleString();
    document.getElementById('gear-tot-bp').innerText = grandTotals.bp.toLocaleString();
    document.getElementById('gear-tot-mbp').innerText = grandTotals.mbp.toLocaleString();
};


// =====================================
// 3. VALOR TECH CALCULATOR (테크 발러 연구)
// =====================================
window.VALOR_DATA = {
    'vs': [ { name: 'VS Tech 1', max: 10, cost: [0, 10, 20, 30, 40, 50, 60, 70, 80, 100] } ],
    'truck': [ { name: 'Intercity Tech 1', max: 10, cost: [0, 20, 40, 60, 80, 100, 120, 140, 160, 200] } ],
    'sf': [ { name: 'Special Forces HP', max: 10, cost: [0, 520, 640, 800, 960, 1280, 1440, 1800, 2000, 2500] } ]
};

window.renderValorUI = function() {
    const container = document.getElementById('growth-valor');
    if(!container) return;
    const t = window.i18n[window.currentLang].growth;
    
    const VALOR_CATEGORIES = [
        { id: 'vs', name: t.cat_vs },
        { id: 'truck', name: t.cat_truck },
        { id: 'sf', name: t.cat_sf }
    ];

    let html = `
    <div class="card" style="margin-bottom: 20px;">
        <select id="valor-category" class="modern-select w-100" onchange="window.changeValorCategory()">
            ${VALOR_CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
        <p class="text-muted" style="font-size: 0.85rem; margin-top: 10px; line-height: 1.5;">
            ${t.valor_notice}<br>
            <span style="color:var(--danger)">${t.valor_warn}</span>
        </p>
    </div>
    <div id="valor-nodes-container" class="gear-grid"></div>
    <div class="summary-box">
        <div class="summary-title">${t.tot_valor}</div>
        <div class="summary-grid" style="grid-template-columns: 1fr;">
            <div class="res-item" style="font-size: 1.5rem; justify-content: center; flex-direction:row;"><span class="res-icon">💠</span> <span id="valor-tot" style="color:var(--primary);">0</span></div>
        </div>
    </div>`;
    container.innerHTML = html;
    window.changeValorCategory();
};

window.changeValorCategory = function() {
    const catEl = document.getElementById('valor-category');
    if(!catEl) return;
    const cat = catEl.value;
    const nodes = window.VALOR_DATA[cat] || [];
    const t = window.i18n[window.currentLang].growth;

    let html = '';
    nodes.forEach((n, idx) => {
        html += `
        <div class="gear-card" style="display: flex; flex-direction: column; gap: 10px;">
            <div style="font-weight: 900; font-size: 1rem; color: var(--text-main);">${n.name}</div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size:0.85rem; color:var(--text-muted); font-weight:700;">${t.cur_tier}</span>
                <select id="val-cur-${cat}-${idx}" class="modern-select" onchange="window.calcValorCost('${cat}')">
                    ${Array.from({length: n.max+1}, (_, i) => `<option value="${i}">${i}</option>`).join('')}
                </select>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size:0.85rem; color:var(--text-muted); font-weight:700;">${t.tgt_tier}</span>
                <select id="val-tgt-${cat}-${idx}" class="modern-select" onchange="window.calcValorCost('${cat}')">
                    ${Array.from({length: n.max+1}, (_, i) => `<option value="${i}">${i}</option>`).join('')}
                </select>
            </div>
        </div>`;
    });
    document.getElementById('valor-nodes-container').innerHTML = html;
    window.calcValorCost(cat);
};

window.calcValorCost = function(cat) {
    const nodes = window.VALOR_DATA[cat] || []; let total = 0;
    nodes.forEach((n, idx) => {
        let curEl = document.getElementById(`val-cur-${cat}-${idx}`);
        let tgtEl = document.getElementById(`val-tgt-${cat}-${idx}`);
        if(!curEl || !tgtEl) return;
        
        let cur = parseInt(curEl.value);
        let tgt = parseInt(tgtEl.value);
        if(tgt < cur) { tgt = cur; tgtEl.value = cur; }
        for(let i=cur+1; i<=tgt; i++) { total += n.cost[i] || 0; }
    });
    document.getElementById('valor-tot').innerText = total.toLocaleString();
};