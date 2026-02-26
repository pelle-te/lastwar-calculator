/* ==========================================
   js/vs.js - 최적화 및 햅틱 피드백 적용 완료
========================================== */

window.currentDay = 'mon';
window.targetScore = 7200000;
window.activeSpdId = '';
window.customRatio = 50;

const BASE = { 
    radar: 10000, truck: 100000, secret: 75000, surv: 1500, spd_min: 50, pow_pt: 10, 
    h_gather: 9523.5, drone_part: 2500, drone_data: 3, honor_medal: 300, recruit: 1500, 
    ur_shard: 10000, ssr_shard: 3500, sr_shard: 1000, skill_medal: 10, exp_unit: 1.0/660, 
    boxes: [0, 1100, 3300, 10000, 30000, 90000, 270000, 810000], 
    trp: [0, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110], 
    kil_spec: [0, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55], 
    kil_gen: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] 
};

const fixF = v => Math.round((v || 0) * 10) / 10;

function getMedalsFromScore(score) { 
    if (score >= 7200000) return 1200; 
    if (score >= 3600000) return 800; 
    if (score >= 2300000) return 400; 
    return 0; 
}

function getVal(cid) { 
    const data = window.safeJSONParse(localStorage.getItem('lastwar_data')); 
    return data[cid] !== undefined ? data[cid] : (cid.includes('squads') ? "1" : (cid.includes('lvl') ? "8" : "0")); 
}

function val(id) { 
    if (['m5','m15','h1','h3','h8'].includes(id)) return parseFloat(document.getElementById(id)?.value) || 0; 
    return parseFloat(document.getElementById(id)?.value) || 0; 
}

/* --- 💡 UI 렌더링 헬퍼 함수 --- */
window.createStepper = function(id, value) {
    return `<div class="stepper-container"><button class="stepper-btn" onmousedown="window.startStep(event, '${id}', -1)" ontouchstart="window.startStep(event, '${id}', -1)">-</button><input type="number" id="${id}" class="compact-input" min="0" value="${value}" onchange="window.debouncedUpdateAll()"><button class="stepper-btn" onmousedown="window.startStep(event, '${id}', 1)" ontouchstart="window.startStep(event, '${id}', 1)">+</button></div>`;
};

window.createQuickStepper = function(id, value) {
    return `<div class="stepper-container"><button class="stepper-btn" onmousedown="window.startQuickStep(event, '${id}', -1)" ontouchstart="window.startQuickStep(event, '${id}', -1)">-</button><input type="number" id="${id}" class="compact-input quick-input-val" min="0" value="${value}"><button class="stepper-btn" onmousedown="window.startQuickStep(event, '${id}', 1)" ontouchstart="window.startQuickStep(event, '${id}', 1)">+</button></div>`;
};

window.createCustomSelectBtn = function(id, min, max, prefix, suffix, currentVal) {
    return `<button id="${id}-btn" class="custom-select-btn" onclick="window.openCustomSelect('${id}', ${min}, ${max}, '${prefix}', '${suffix}')"><span>${prefix}${currentVal}${suffix}</span><svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button><input type="hidden" id="${id}" value="${currentVal}">`;
};

/* --- 안전한 모달 호출 함수 (Blurry 에러 완벽 차단) --- */
window.openCustomSelect = function(id, min, max, prefix, suffix) {
    try {
        if(navigator.vibrate) navigator.vibrate(15);
        let optionsHtml = '';
        const el = document.getElementById(id); // 요소가 있는지 먼저 확인!
        let currentVal = el ? (parseInt(el.value) || min) : min;
        
        for(let i=min; i<=max; i++) {
            optionsHtml += `<div class="sheet-option ${i==currentVal?'active':''}" onclick="window.selectCustomValue('${id}', ${i}, '${prefix}', '${suffix}')">${prefix}${i}${suffix}</div>`;
        }
        document.getElementById('sheetTitle').innerText = window.currentLang === 'ko' ? "선택" : "Select";
        document.getElementById('sheetOptions').innerHTML = optionsHtml;
        document.getElementById('customSelectModal').classList.add('active');
    } catch(e) {
        console.error("Select Modal Error:", e);
        document.getElementById('customSelectModal').classList.remove('active'); // 에러 시 블러 해제
    }
};

window.closeSelectModal = function() { document.getElementById('customSelectModal').classList.remove('active'); };

window.selectCustomValue = function(id, val, prefix, suffix) {
    if(navigator.vibrate) navigator.vibrate(10);
    document.getElementById(id).value = val;
    const btnSpan = document.getElementById(id+'-btn');
    if(btnSpan) btnSpan.querySelector('span').innerText = prefix + val + suffix;
    window.closeSelectModal();
    window.debouncedUpdateAll();
};

/* --- 최적화된 코어 로직 --- */
window.executeHeavyUpdate = function() {
    const d = window.currentDay; const t = window.i18n[window.currentLang]; let totalScore = 0;
    
    ['mon','tue','wed','thu','fri','sat'].forEach(day => { 
        const btn = document.getElementById(`btn-${day}`); 
        if(btn) btn.classList.toggle('completed', calculateDayScore(day) >= window.targetScore);
    });
    
    let m = { rad: getM('t-radar'), spd: getM('t-spd'), rec: getM('t-rec'), con: getM('t-con'), tec: getM('t-tec'), trn: getM('t-trn'), kil: getM('t-kil'), exp: getM('t-expert') };
    function setPt(id, pt) { const rpt = fixF(pt); const el = document.getElementById('pts-' + id); if(el) el.innerText = '+' + rpt.toLocaleString('ko-KR', { maximumFractionDigits: 1 }) + ' pt'; totalScore += rpt; }

    setPt('dia', val(d+'-dia') * 30);
    switch(d) {
        case 'mon': setPt('radar', val('mon-radar')*BASE.radar*m.rad.sub); setPt('stam', val('mon-stam')*150*m.exp.all); setPt('exp', val('mon-exp')*1000000*BASE.exp_unit*m.exp.all); setPt('part', val('mon-part')*BASE.drone_part*m.exp.all); setPt('data', val('mon-data')*1000*BASE.drone_data*m.exp.all); setPt('gather', val('mon-gather') * parseFloat(getVal('mon-squads')||1) * BASE.h_gather * m.exp.all); break;
        case 'tue': setPt('truck', val('tue-truck')*BASE.truck*m.exp.all); setPt('sec', val('tue-sec')*BASE.secret*m.exp.all); setPt('surv', val('tue-surv')*BASE.surv*m.exp.all); setPt('spd', val('tue-spd')*60*BASE.spd_min*m.spd.sub); setPt('pow', val('tue-pow')*1000*BASE.pow_pt*m.con.sub); break;
        case 'wed': setPt('radar', val('wed-radar')*BASE.radar*m.rad.sub); setPt('spd', val('wed-spd')*60*BASE.spd_min*m.spd.sub); setPt('pow', val('wed-pow')*1000*BASE.pow_pt*m.tec.sub); setPt('mdl', val('wed-mdl')*BASE.honor_medal*m.exp.all); let dTot = 0; for(let i=1; i<=7; i++) dTot += val('drone-b'+i) * BASE.boxes[i]; setPt('drone-box', dTot * m.exp.all); break;
        case 'thu': setPt('tkt', val('thu-tkt')*BASE.recruit*m.rec.sub); setPt('hero-shard', (val('hero-ur')*BASE.ur_shard + val('hero-ssr')*BASE.ssr_shard + val('hero-sr')*BASE.sr_shard) * m.exp.all); setPt('sk', val('thu-sk')*BASE.skill_medal*m.exp.all); setPt('exp', val('thu-exp')*1000000*BASE.exp_unit*m.exp.all); break;
        case 'fri': setPt('radar', val('fri-radar')*BASE.radar*m.rad.sub); setPt('spd-con', val('fri-spd-con')*60*BASE.spd_min*m.spd.sub); setPt('spd-tec', val('fri-spd-tec')*60*BASE.spd_min*m.spd.sub); setPt('spd-trn', val('fri-spd-trn')*60*BASE.spd_min*m.spd.sub); setPt('pow-con', val('fri-pow-con')*1000*BASE.pow_pt*m.con.sub); setPt('pow-tec', val('fri-pow-tec')*1000*BASE.pow_pt*m.tec.sub); setPt('count', val('fri-count')*BASE.trp[parseInt(getVal('fri-lvl'))||8]*m.trn.sub); break;
        case 'sat': setPt('truck', val('sat-truck')*BASE.truck*m.exp.all); setPt('sec', val('sat-sec')*BASE.secret*m.exp.all); setPt('spd-all', val('sat-spd-all')*60*BASE.spd_min*m.spd.sub); let kS = getVal('sat-target') === 'general' ? BASE.kil_gen[parseInt(getVal('sat-elvl'))||8] : BASE.kil_spec[parseInt(getVal('sat-elvl'))||8]; setPt('kill', val('sat-kill')*kS*m.kil.sub); setPt('dth', val('sat-dth')*BASE.kil_gen[parseInt(getVal('sat-alvl'))||8]*m.exp.all); break;
    }

    window.saveAllData(); 
    if(window.triggerAutoSave) window.triggerAutoSave(); 
    
    totalScore = fixF(totalScore); 
    const pct = Math.min(100, (totalScore / window.targetScore) * 100);
    
    document.getElementById('score').innerText = totalScore.toLocaleString('ko-KR', { maximumFractionDigits: 1 });
    const earnedMedals = getMedalsFromScore(totalScore); const medalEl = document.getElementById('medal-status');
    if(medalEl) { medalEl.innerText = earnedMedals.toLocaleString(); medalEl.style.color = earnedMedals >= 1200 ? '#FF9500' : (earnedMedals >= 800 ? 'var(--primary)' : 'var(--success)'); }

    const barEl = document.getElementById('bar');
    if(barEl) { barEl.style.width = pct + '%'; barEl.classList.toggle('completed', pct >= 100); }
    if(document.getElementById('pct-text')) document.getElementById('pct-text').innerText = Math.floor(pct) + '%';
    if(document.getElementById('box-status')) document.getElementById('box-status').innerText = `${Math.min(9, Math.floor(totalScore / (window.targetScore / 9)))} / 9`;
    
    const rem = fixF(window.targetScore - totalScore);
    if(document.getElementById('diff')) document.getElementById('diff').innerText = rem > 0 ? `${t.result.remain}: ${rem.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}` : t.success;
    
    if(window.updateRecommendBox) window.updateRecommendBox(rem, t, window.currentDay);
};

window.debouncedUpdateAll = typeof window.debounce === 'function' ? window.debounce(window.executeHeavyUpdate, 150) : window.executeHeavyUpdate;
window.updateAll = window.debouncedUpdateAll; 

window.stepVal = function(id, delta) { 
    if(navigator.vibrate) navigator.vibrate(10); // 💡 조작 손맛 (햅틱)
    const el = document.getElementById(id); 
    if(el) { el.value = Math.max(0, (parseFloat(el.value) || 0) + delta); window.debouncedUpdateAll(); } 
};
window.quickStepVal = function(id, delta) {
    if(navigator.vibrate) navigator.vibrate(10);
    const el = document.getElementById(id);
    if(el) { el.value = Math.max(0, (parseFloat(el.value) || 0) + delta); }
};

let stepSpeed = 150;
window.startStep = function(e, id, delta) { 
    if (e) { e.preventDefault(); e.stopPropagation(); } 
    window.stepVal(id, delta); stepSpeed = 150; let count = 0; 
    if(window.stepInterval) clearTimeout(window.stepInterval); 
    const run = () => { window.stepVal(id, delta); count++; if(count > 5) stepSpeed = 50; if(count > 15) stepSpeed = 15; window.stepInterval = setTimeout(run, stepSpeed); }; 
    window.stepInterval = setTimeout(run, stepSpeed); 
};
window.stopStep = function() { if(window.stepInterval) clearTimeout(window.stepInterval); };
window.addEventListener('mouseup', window.stopStep); window.addEventListener('touchend', window.stopStep);

window.startQuickStep = function(e, id, delta) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    window.quickStepVal(id, delta); let speed = 150; let count = 0;
    if(window.quickStepInterval) clearTimeout(window.quickStepInterval);
    const run = () => { window.quickStepVal(id, delta); count++; if(count > 5) speed = 50; if(count > 15) speed = 15; window.quickStepInterval = setTimeout(run, speed); };
    window.quickStepInterval = setTimeout(run, speed);
};
window.stopQuickStep = function() { if(window.quickStepInterval) clearTimeout(window.quickStepInterval); };
window.addEventListener('mouseup', window.stopQuickStep); window.addEventListener('touchend', window.stopQuickStep);

/* --- Modals & Inputs rendering --- */
window.renderDroneInputs = function() { const c = document.getElementById('drone-inputs-container'); if(!c) return; let h = ''; for(let i=1; i<=7; i++) { h += `<div class="tech-item"><label>Lv.${i}</label>${createStepper('drone-b'+i, getVal('drone-b'+i))}</div>`; } c.innerHTML = h; }
window.renderHeroInputs = function() { const c = document.getElementById('hero-inputs-container'); if(!c) return; const t = window.i18n[window.currentLang].labels; c.innerHTML = `<div class="tech-item"><label>${t.ur}</label>${createStepper('hero-ur', getVal('hero-ur'))}</div><div class="tech-item"><label>${t.ssr}</label>${createStepper('hero-ssr', getVal('hero-ssr'))}</div><div class="tech-item"><label>${t.sr}</label>${createStepper('hero-sr', getVal('hero-sr'))}</div>`; }

window.renderTechInputs = function() {
    try {
        const techGrid = document.getElementById('tech-inputs'); if(!techGrid) return;
        const t = window.i18n[window.currentLang]; 
        const techs = [ {id:'t-expert', l:t.expert, def: 20, max: 20}, {id:'t-radar', l:t.radar, def: 6, max: 10}, {id:'t-spd', l:t.spd, def: 6, max: 10}, {id:'t-rec', l:t.tech_rec, def: 6, max: 10}, {id:'t-con', l:t.con, def: 1, max: 10}, {id:'t-tec', l:t.tec, def: 1, max: 10}, {id:'t-trn', l:t.trn, def: 6, max: 10}, {id:'t-kil', l:t.kil, def: 6, max: 10} ]; 
        
        const savedData = window.safeJSONParse(localStorage.getItem('lastwar_data')); 
        techGrid.innerHTML = techs.map(item => { 
            let currentVal = savedData[item.id] !== undefined ? parseInt(savedData[item.id]) : item.def; 
            if(currentVal > item.max) currentVal = item.max; 
            return `<div class="tech-item"><label>${item.l}</label>${createCustomSelectBtn(item.id, 0, item.max, 'Lv ', '', currentVal)}</div>`; 
        }).join('');
    } catch(e) { console.error("renderTechInputs Error:", e); }
};

window.renderSpdStepper = function() { const c = document.getElementById('spd-stepper-container'); if(!c) return; const t = window.i18n[window.currentLang].labels; const ids = ['m5','m15','h1','h3','h8']; const labels = [t.m5, t.m15, t.h1, t.h3, t.h8]; const savedSpd = window.getSpdData(window.activeSpdId); let h = ''; ids.forEach((id, idx) => { h += `<div class="tech-item"><label>${labels[idx]}</label>${createStepper(id, savedSpd[id] || 0)}</div>`; }); c.innerHTML = h; }

window.renderInputs = function() {
    try {
        const t = window.i18n[window.currentLang]; const container = document.getElementById('input-container'); if(!container) return;
        const config = { 
            mon:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'stam',l:t.inputs.stam},{id:'exp',l:t.inputs.exp},{id:'part',l:t.inputs.part},{id:'data',l:t.inputs.data}], 
            tue:[{id:'dia',l:t.inputs.dia},{id:'truck',l:t.inputs.truck},{id:'sec',l:t.inputs.sec},{id:'surv',l:t.inputs.surv},{id:'spd',l:t.inputs.build_spd,isSpd:true},{id:'pow',l:t.inputs.pow_con}], 
            wed:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'spd',l:t.inputs.tec_spd,isSpd:true},{id:'pow',l:t.inputs.pow_tec},{id:'mdl',l:t.inputs.medal}], 
            thu:[{id:'dia',l:t.inputs.dia},{id:'tkt',l:t.inputs.tkt},{id:'exp',l:t.inputs.exp},{id:'sk',l:t.inputs.sk}], 
            fri:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'spd-con',l:t.inputs.build_spd,isSpd:true},{id:'spd-tec',l:t.inputs.tec_spd,isSpd:true},{id:'spd-trn',l:t.inputs.trn_spd,isSpd:true},{id:'pow-con',l:t.inputs.pow_con},{id:'pow-tec',l:t.inputs.pow_tec}], 
            sat:[{id:'dia',l:t.inputs.dia},{id:'truck',l:t.inputs.truck},{id:'sec',l:t.inputs.sec},{id:'spd-all',l:t.inputs.kill_spd,isSpd:true}] 
        };
        
        let html = `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; flex-wrap:wrap; gap:10px;"><div class="section-title" style="margin:0;">📝 ${window.currentDay.toUpperCase()} INPUT</div><div style="display:flex; gap:8px;"><button onclick="window.openQuickInputModal()" class="btn-primary-small" style="background:var(--warning); color:#fff; box-shadow: 0 4px 10px rgba(255,149,0,0.3);">⚡ ${t.btn.quick}</button><button onclick="window.setFixedValues()" class="btn-primary-small">${t.fixed}</button><button onclick="window.resetDayData()" class="btn-primary-small" style="background:var(--input-bg); color:var(--danger); box-shadow:none;">${t.reset}</button></div></div><div class="input-grid">`;

        if(window.currentDay === 'mon') { 
            html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.squads}</span></div>${createCustomSelectBtn('mon-squads', 1, 5, '', t.inputs.squads_unit, getVal('mon-squads')||1)}</div>
                    <div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.gather}</span><span class="item-score-tag" id="pts-gather">0</span></div>${createStepper('mon-gather', getVal('mon-gather'))}</div>`; 
        }
        if(window.currentDay === 'wed') { html += `<div class="input-group-compact full-mobile-item"><div class="input-header"><span class="input-label-small">📦 ${t.modal.drone}</span><span class="item-score-tag" id="pts-drone-box">0</span></div><button class="spd-btn-mini" onclick="window.openDroneModal()">${t.modal.btn_open}</button></div>`; }
        if(window.currentDay === 'thu') { html += `<div class="input-group-compact full-mobile-item"><div class="input-header"><span class="input-label-small">🧩 ${t.modal.hero}</span><span class="item-score-tag" id="pts-hero-shard">0</span></div><button class="spd-btn-mini" onclick="window.openHeroModal()">${t.modal.btn_open}</button></div>`; }

        (config[window.currentDay] || []).forEach(i => { 
            const cid = `${window.currentDay}-${i.id}`; 
            let extraBtn = i.isSpd ? `<button class="spd-btn-mini" onclick="window.openSpdModal('${i.id}','${i.l}')">${t.modal.btn_open}</button>` : '';
            html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">${i.l}</span><span class="item-score-tag" id="pts-${i.id}">0</span></div>${createStepper(cid, getVal(cid))}${extraBtn}</div>`; 
        });

        if(window.currentDay === 'fri') { 
            html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.trn_lvl}</span></div>${createCustomSelectBtn('fri-lvl', 1, 10, 'Lv ', '', getVal('fri-lvl')||8)}</div>
                    <div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.trn_cnt}</span><span class="item-score-tag" id="pts-count">0</span></div>${createStepper('fri-count', getVal('fri-count'))}</div>`; 
        }
        if(window.currentDay === 'sat') { 
            const target = getVal('sat-target') || "special"; 
            html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.kill_target}</span></div>
                        <div class="target-selector two-cols"><button class="target-btn ${target=='special'?'active':''}" onclick="window.setSatTarget('special')">${t.inputs.target_spec}</button><button class="target-btn ${target=='general'?'active':''}" onclick="window.setSatTarget('general')">${t.inputs.target_gen}</button></div>
                    </div>
                    <div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.kill_lvl}</span></div>${createCustomSelectBtn('sat-elvl', 1, 10, 'Lv ', '', getVal('sat-elvl')||8)}</div>
                    <div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.kill_cnt}</span><span class="item-score-tag" id="pts-kill">0</span></div>${createStepper('sat-kill', getVal('sat-kill'))}</div>
                    <div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.dth_lvl}</span></div>${createCustomSelectBtn('sat-alvl', 1, 10, 'Lv ', '', getVal('sat-alvl')||8)}</div>
                    <div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.dth_cnt}</span><span class="item-score-tag" id="pts-dth">0</span></div>${createStepper('sat-dth', getVal('sat-dth'))}</div>`; 
        }
        html += `</div>`; container.innerHTML = html;
    } catch(e) { console.error("renderInputs Error:", e); }
}

/* --- State Modifiers --- */
window.setTarget = function(s) { window.targetScore = s; document.querySelectorAll('.target-btn').forEach(b => b.classList.remove('active')); document.getElementById('target-' + s)?.classList.add('active'); window.updateAll(); };
window.switchTab = function(day) { window.currentDay = day; document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active')); document.getElementById('btn-' + day)?.classList.add('active'); window.renderInputs(); window.updateAll(); };
window.setSatTarget = function(val) { const data = window.safeJSONParse(localStorage.getItem('lastwar_data')); data['sat-target'] = val; window.safeStorageSet('lastwar_data', data); window.renderInputs(); window.updateAll(); };
window.updateRatioText = function(val) { window.customRatio = parseInt(val); window.updateAll(); };

window.setFixedValues = function() {
    const msg = window.currentLang === 'ko' ? "매일 기본적으로 얻는 고정 획득량을 일괄 적용하시겠습니까?" : "Apply daily fixed settings?";
    window.customConfirm(msg, () => {
        const data = window.safeJSONParse(localStorage.getItem('lastwar_data'));
        data['mon-squads'] = "2"; data['mon-gather'] = "24";
        ['mon','tue','wed','thu','fri','sat'].forEach(d => { data[`${d}-radar`] = "82"; if(d === 'tue' || d === 'sat') { data[`${d}-truck`] = "4"; data[`${d}-sec`] = "7"; } });
        window.safeStorageSet('lastwar_data', data); window.renderInputs(); window.updateAll();
    });
};

window.resetDayData = function() {
    const msg = window.currentLang === 'ko' ? "현재 요일의 입력값을 0으로 초기화하시겠습니까?" : "Reset data for this day?";
    window.customConfirm(msg, () => {
        const data = window.safeJSONParse(localStorage.getItem('lastwar_data')); const spdData = window.safeJSONParse(localStorage.getItem('lastwar_spd_data')); const prefix = window.currentDay + '-';
        Object.keys(data).forEach(key => { if(key.startsWith(prefix)) data[key] = key.includes('squads') ? "1" : "0"; });
        Object.keys(spdData).forEach(key => { if(key.startsWith(prefix)) delete spdData[key]; });
        if(window.currentDay === 'wed') { for(let i=1; i<=7; i++) { const el = document.getElementById('drone-b'+i); if(el) el.value = 0; } }
        if(window.currentDay === 'thu') { ['hero-ur','hero-ssr','hero-sr'].forEach(id => { const el = document.getElementById(id); if (el) el.value = 0; }); }
        window.safeStorageSet('lastwar_data', data); window.safeStorageSet('lastwar_spd_data', spdData); window.renderInputs(); window.updateAll();
    });
};

/* --- Modals Open/Close --- */
window.openTechModal = () => document.getElementById('techModal').classList.add('active');
window.closeTechModal = () => { document.getElementById('techModal').classList.remove('active'); window.updateAll(); };
window.openSpdModal = function(cid, label) { 
    try {
        window.activeSpdId = `${window.currentDay}-${cid}`; 
        const titleEl = document.getElementById('spd-title'); 
        if(titleEl) titleEl.innerText = label; 
        
        // 렌더링 및 계산이 성공했을 때만 모달 띄우기
        if(window.renderSpdStepper) window.renderSpdStepper(); 
        if(window.calcSpdTotal) window.calcSpdTotal(); 
        
        document.getElementById('spdModal')?.classList.add('active'); 
    } catch (e) {
        console.error("Spd Modal Error:", e);
        document.getElementById('spdModal')?.classList.remove('active'); // 에러 시 블러 해제
    }
};
window.closeSpdModal = () => document.getElementById('spdModal').classList.remove('active');
window.openDroneModal = function() { 
    try { document.getElementById('droneModal').classList.add('active'); } 
    catch(e) { document.getElementById('droneModal')?.classList.remove('active'); }
};
window.closeDroneModal = () => document.getElementById('droneModal').classList.remove('active');
window.openHeroModal = function() { 
    try { document.getElementById('heroModal').classList.add('active'); } 
    catch(e) { document.getElementById('heroModal')?.classList.remove('active'); }
};
window.closeHeroModal = () => document.getElementById('heroModal').classList.remove('active');
window.showWeeklyReport = function() {
    const days = ['mon','tue','wed','thu','fri','sat']; const currentT = window.i18n[window.currentLang]; let html = `<div class="weekly-container">`; 
    let totalWeeklyScore = 0; let totalWeeklyMedals = 0;
    days.forEach((d, idx) => {
        const dayScore = fixF(calculateDayScore(d)); totalWeeklyScore += dayScore;
        const medals = getMedalsFromScore(dayScore); totalWeeklyMedals += medals;
        let badgeHTML = '';
        if (dayScore >= 7200000) badgeHTML = `<span class="weekly-badge badge-9">9상 🎁</span>`;
        else if (dayScore >= 3600000) badgeHTML = `<span class="weekly-badge badge-8">8상 📦</span>`;
        else if (dayScore >= 2300000) badgeHTML = `<span class="weekly-badge badge-6">6상 📦</span>`;
        else badgeHTML = `<span class="weekly-badge badge-fail">미달</span>`;
        html += `<div class="weekly-row"><div class="weekly-row-top"><div class="weekly-day-group"><span class="weekly-day" style="color: var(--${d});">${currentT.days[idx]}</span>${badgeHTML}</div><span class="weekly-score">${dayScore.toLocaleString('ko-KR', { maximumFractionDigits: 1 })} <span>pt</span></span></div>${medals > 0 ? `<div class="weekly-row-bottom"><span>획득 훈장</span><span style="color:var(--warning);">+${medals}개</span></div>` : ''}</div>`;
    });
    html += `<div class="weekly-total"><div class="weekly-total-row"><span>총 점수</span><span style="font-size:1.4rem;">${fixF(totalWeeklyScore).toLocaleString('ko-KR', { maximumFractionDigits: 1 })} pt</span></div><div class="weekly-total-row" style="color:var(--warning); margin-top:5px; padding-top:15px; border-top:1px dashed var(--border-light);"><span>총 획득 훈장</span><span style="font-size:1.4rem;">🏅 ${totalWeeklyMedals.toLocaleString()}개</span></div></div></div>`;
    document.getElementById('weekly-report-content').innerHTML = html; document.getElementById('weeklyModal').classList.add('active');
};
window.closeWeeklyModal = function() { document.getElementById('weeklyModal').classList.remove('active'); };

/* --- Speedup & Quick Input --- */
window.getSpdData = function(fullId) { const data = window.safeJSONParse(localStorage.getItem('lastwar_spd_data')); return data[fullId] || { m5:0, m15:0, h1:0, h3:0, h8:0 }; };
window.calcSpdTotal = function() {
    const t = window.i18n[window.currentLang];
    const m5 = parseFloat(document.getElementById('m5')?.value) || 0; const m15 = parseFloat(document.getElementById('m15')?.value) || 0; const h1 = parseFloat(document.getElementById('h1')?.value) || 0; const h3 = parseFloat(document.getElementById('h3')?.value) || 0; const h8 = parseFloat(document.getElementById('h8')?.value) || 0;
    const totalMin = (m5 * 5) + (m15 * 15) + (h1 * 60) + (h3 * 180) + (h8 * 480);
    const d = Math.floor(totalMin / 1440); const h = Math.floor((totalMin % 1440) / 60); const m = Math.round(totalMin % 60);
    const resText = document.getElementById('spd-result-text');
    if(resText) { resText.innerText = `${t.modal.total}: ${d}${t.units.day} ${h}${t.units.hour} ${m}${t.units.min}`; } return totalMin;
};
window.applySpd = function() {
    const totalMin = window.calcSpdTotal(); const targetInput = document.getElementById(window.activeSpdId); 
    if(targetInput) { targetInput.value = (totalMin / 60).toFixed(2); const spdData = window.safeJSONParse(localStorage.getItem('lastwar_spd_data')); spdData[window.activeSpdId] = { m5: document.getElementById('m5').value, m15: document.getElementById('m15').value, h1: document.getElementById('h1').value, h3: document.getElementById('h3').value, h8: document.getElementById('h8').value }; window.safeStorageSet('lastwar_spd_data', spdData); window.updateAll(); }
    window.closeSpdModal();
};

window.openQuickInputModal = function() {
    const t = window.i18n[window.currentLang]; const container = document.getElementById('quick-input-container'); const day = window.currentDay; let html = '';
    const config = { mon:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'stam',l:t.inputs.stam},{id:'exp',l:t.inputs.exp},{id:'part',l:t.inputs.part},{id:'data',l:t.inputs.data},{id:'gather',l:t.inputs.gather}], tue:[{id:'dia',l:t.inputs.dia},{id:'truck',l:t.inputs.truck},{id:'sec',l:t.inputs.sec},{id:'surv',l:t.inputs.surv},{id:'spd',l:t.inputs.build_spd},{id:'pow',l:t.inputs.pow_con}], wed:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'spd',l:t.inputs.tec_spd},{id:'pow',l:t.inputs.pow_tec},{id:'mdl',l:t.inputs.medal}], thu:[{id:'dia',l:t.inputs.dia},{id:'tkt',l:t.inputs.tkt},{id:'exp',l:t.inputs.exp},{id:'sk',l:t.inputs.sk}], fri:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'spd-con',l:t.inputs.build_spd},{id:'spd-tec',l:t.inputs.tec_spd},{id:'spd-trn',l:t.inputs.trn_spd},{id:'pow-con',l:t.inputs.pow_con},{id:'pow-tec',l:t.inputs.pow_tec},{id:'count',l:t.inputs.trn_cnt}], sat:[{id:'dia',l:t.inputs.dia},{id:'truck',l:t.inputs.truck},{id:'sec',l:t.inputs.sec},{id:'spd-all',l:t.inputs.kill_spd},{id:'kill',l:t.inputs.kill_cnt},{id:'dth',l:t.inputs.dth_cnt}] };
    let items = [...(config[day] || [])];
    if(day === 'wed') { for(let i=1; i<=7; i++) items.push({id: `drone-b${i}`, l: window.currentLang === 'ko' ? `드론 상자 Lv.${i}` : `Drone Box Lv.${i}`, isDirect: true}); }
    if(day === 'thu') { items.push({id: 'hero-ur', l: t.labels.ur, isDirect: true}); items.push({id: 'hero-ssr', l: t.labels.ssr, isDirect: true}); items.push({id: 'hero-sr', l: t.labels.sr, isDirect: true}); }

    items.forEach(item => {
        const cid = item.isDirect ? item.id : `${day}-${item.id}`; const val = getVal(cid);
        const cleanLabel = item.l.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim();
        html += `<div class="quick-item"><label>${cleanLabel}</label>${createQuickStepper('qi-'+cid, val)}</div>`;
    });
    container.innerHTML = html; document.getElementById('quickInputModal').classList.add('active');
};

window.previewQuickScreenshot = function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) { document.getElementById('quick-img-tag').src = e.target.result; document.getElementById('quick-image-preview').style.display = 'block'; }
        reader.readAsDataURL(file);
    }
};
window.closeQuickInputModal = function() { 
    document.getElementById('quickInputModal').classList.remove('active'); 
    const fileInput = document.getElementById('quick-screenshot'); if(fileInput) fileInput.value = "";
    const previewDiv = document.getElementById('quick-image-preview'); if(previewDiv) previewDiv.style.display = 'none';
    const imgTag = document.getElementById('quick-img-tag'); if(imgTag) imgTag.src = "";
};

window.applyQuickInput = function() {
    const inputs = document.querySelectorAll('.quick-input-val');
    const data = window.safeJSONParse(localStorage.getItem('lastwar_data'));
    inputs.forEach(input => { const cid = input.id.replace('qi-', ''); data[cid] = input.value || "0"; const mainInput = document.getElementById(cid); if(mainInput) mainInput.value = data[cid]; });
    window.safeStorageSet('lastwar_data', data); window.updateAll(); window.closeQuickInputModal();
};

/* --- Core Logic (Score Calculation & Recommend) --- */
function getM(subId) { 
    const expertLv = parseInt(getVal('t-expert')) || 0;
    const subLv = parseInt(getVal(subId)) || 0;
    const eBonus = expertLv * 0.05; 
    let sBonus = 0;
    if (subId === 't-radar') {
        const radarCurve = [0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.35, 0.45, 0.60, 0.80, 1.00];
        sBonus = radarCurve[subLv] || (subLv * 0.05);
    } else if (subId !== 't-expert') { sBonus = subLv * 0.05; }
    return { all: 1 + eBonus, sub: 1 + eBonus + sBonus }; 
}

function getRecommendMap(t) { 
    const targetType = getVal('sat-target') || "special"; 
    const targetLvl = parseInt(getVal('sat-elvl')) || 8;
    const targetName = targetType === 'special' ? t.inputs.target_spec : t.inputs.target_gen;
    const satLabel = `🔥 ${targetName} (Lv.${targetLvl})`;

    const h = window.currentLang === 'ko' ? '시간' : 'h';
    const ea = window.currentLang === 'ko' ? '개' : '';
    const k = 'k';
    const p = window.currentLang === 'ko' ? '명' : '';

    return { 
        mon: [{ label: t.inputs.part, unit: (m) => BASE.drone_part * m.exp.all, suffix: ea }, { label: t.inputs.data, unit: (m) => 1000 * BASE.drone_data * m.exp.all, suffix: k }], 
        tue: [{ label: t.inputs.build_spd, unit: (m) => 60 * BASE.spd_min * m.spd.sub, suffix: h }, { label: t.inputs.pow_con, unit: (m) => 1000 * BASE.pow_pt * m.con.sub, suffix: k }], 
        wed: [{ label: t.inputs.tec_spd, unit: (m) => 60 * BASE.spd_min * m.spd.sub, suffix: h }, { label: t.inputs.pow_tec, unit: (m) => 1000 * BASE.pow_pt * m.tec.sub, suffix: k }], 
        thu: [{ label: "🧩 " + t.labels.ur, unit: (m) => BASE.ur_shard * m.exp.all, suffix: ea }, { label: t.inputs.sk, unit: (m) => BASE.skill_medal * m.exp.all, suffix: ea }], 
        fri: [{ label: t.inputs.trn_spd, unit: (m) => 60 * BASE.spd_min * m.spd.sub, suffix: h }, { label: t.inputs.trn_cnt, unit: (m) => BASE.trp[parseInt(getVal('fri-lvl'))||8] * m.trn.sub, suffix: p }], 
        sat: [{ label: satLabel, unit: (m) => (targetType === 'general' ? BASE.kil_gen[targetLvl] : BASE.kil_spec[targetLvl]) * m.kil.sub, suffix: p }] 
    }; 
}

function calculateDayScore(day) {
    let score = 0; const m = { exp: getM('t-expert'), rad: getM('t-radar'), spd: getM('t-spd'), rec: getM('t-rec'), con: getM('t-con'), tec: getM('t-tec'), trn: getM('t-trn'), kil: getM('t-kil') };
    score += fixF(parseFloat(getVal(day + '-dia')) * 30); 
    if(day === 'mon') { score += fixF(parseFloat(getVal('mon-radar'))*BASE.radar*m.rad.sub); score += fixF((parseFloat(getVal('mon-stam'))*150 + parseFloat(getVal('mon-exp'))*1000000*BASE.exp_unit + parseFloat(getVal('mon-part'))*BASE.drone_part + parseFloat(getVal('mon-data'))*1000*BASE.drone_data + parseFloat(getVal('mon-gather')) * parseFloat(getVal('mon-squads')||1) * BASE.h_gather) * m.exp.all);
    } else if(day === 'tue') { score += fixF((parseFloat(getVal('tue-truck'))*BASE.truck + parseFloat(getVal('tue-sec'))*BASE.secret + parseFloat(getVal('tue-surv'))*BASE.surv) * m.exp.all); score += fixF(parseFloat(getVal('tue-spd'))*60*BASE.spd_min*m.spd.sub); score += fixF(parseFloat(getVal('tue-pow'))*1000*BASE.pow_pt*m.con.sub);
    } else if(day === 'wed') { score += fixF(parseFloat(getVal('wed-radar'))*BASE.radar*m.rad.sub); score += fixF(parseFloat(getVal('wed-spd'))*60*BASE.spd_min*m.spd.sub); score += fixF(parseFloat(getVal('wed-pow'))*1000*BASE.pow_pt*m.tec.sub); let droneTotal = 0; for(let i=1; i<=7; i++) droneTotal += (parseFloat(getVal('drone-b'+i)) || 0) * BASE.boxes[i]; score += fixF((parseFloat(getVal('wed-mdl'))*BASE.honor_medal + droneTotal) * m.exp.all);
    } else if(day === 'thu') { score += fixF(parseFloat(getVal('thu-tkt'))*BASE.recruit*m.rec.sub); score += fixF((parseFloat(getVal('hero-ur'))*BASE.ur_shard + parseFloat(getVal('hero-ssr'))*BASE.ssr_shard + parseFloat(getVal('hero-sr'))*BASE.sr_shard) * m.exp.all); score += fixF((parseFloat(getVal('thu-sk'))*BASE.skill_medal + parseFloat(getVal('thu-exp'))*1000000*BASE.exp_unit) * m.exp.all);
    } else if(day === 'fri') { score += fixF(parseFloat(getVal('fri-radar'))*BASE.radar*m.rad.sub); score += fixF((parseFloat(getVal('fri-spd-con')) + parseFloat(getVal('fri-spd-tec')) + parseFloat(getVal('fri-spd-trn'))) * 60 * BASE.spd_min * m.spd.sub); score += fixF(parseFloat(getVal('fri-pow-con'))*1000*BASE.pow_pt*m.con.sub); score += fixF(parseFloat(getVal('fri-pow-tec'))*1000*BASE.pow_pt*m.tec.sub); score += fixF(parseFloat(getVal('fri-count'))*BASE.trp[parseInt(getVal('fri-lvl'))||8]*m.trn.sub);
    } else if(day === 'sat') { score += fixF((parseFloat(getVal('sat-truck'))*BASE.truck + parseFloat(getVal('sat-sec'))*BASE.secret + parseFloat(getVal('sat-dth'))*BASE.kil_gen[parseInt(getVal('sat-alvl'))||8]) * m.exp.all); score += fixF(parseFloat(getVal('sat-spd-all'))*60*BASE.spd_min*m.spd.sub); let kScore = getVal('sat-target') === 'general' ? BASE.kil_gen[parseInt(getVal('sat-elvl'))||8] : BASE.kil_spec[parseInt(getVal('sat-elvl'))||8]; score += fixF(parseFloat(getVal('sat-kill'))*kScore*m.kil.sub); }
    return score;
}

window.saveAllData = function() { 
    const inputs = document.querySelectorAll('input[type="number"]'); 
    const data = window.safeJSONParse(localStorage.getItem('lastwar_data')); 
    inputs.forEach(input => { 
        if(input.id && input.id !== 'inner-ratio' && !input.id.includes('m5') && !input.id.includes('h1') && !input.id.startsWith('qi-') && !input.id.startsWith('skill-')) {
            data[input.id] = input.value; 
        }
    }); 
    window.safeStorageSet('lastwar_data', data); 
};

window.updateRecommendBox = function(rem, t, day) {
    try {
        const recBox = document.getElementById('recommend-box');
        const dayName = t.days[['mon','tue','wed','thu','fri','sat'].indexOf(day)];

        if(recBox) {
            if(rem <= 0) { 
                recBox.innerHTML = `<div class="recommend-card" style="background:var(--success); border-radius:24px; text-align:center; font-weight:800; color:white; border:none; box-shadow:0 10px 30px rgba(52, 199, 89, 0.2);">✅ [${dayName}] ${t.rec.success}</div>`; 
            }
            else {
                const m_calc = { exp: getM('t-expert'), spd: getM('t-spd'), rad: getM('t-radar'), con: getM('t-con'), tec: getM('t-tec'), trn: getM('t-trn'), kil: getM('t-kil') };
                const items = getRecommendMap(t)[day]; 
                
                // 💡 k 단위 변환 포맷터 추가
                const formatRecVal = (v, label) => {
                    if (label.includes('스킬 훈장') || label.includes('Skill Medal')) {
                        return (v / 1000).toLocaleString('ko-KR', { maximumFractionDigits: 1 }) + 'k';
                    }
                    return v.toLocaleString();
                };

                let targetLabel = window.targetScore === 3600000 ? "8상" : (window.targetScore === 7200000 ? "9상" : "6상");
                const targetText = window.currentLang === 'en' ? targetLabel.replace('상', ' Boxes') : targetLabel;

                if (items && items.length === 2) {
                    const v1 = items[0].unit(m_calc); const v2 = items[1].unit(m_calc);
                    const leftRatio = (100 - window.customRatio) / 100; const rightRatio = window.customRatio / 100;
                    
                    const val1 = formatRecVal(Math.ceil((rem * leftRatio)/v1), items[0].label);
                    const val2 = formatRecVal(Math.ceil((rem * rightRatio)/v2), items[1].label);

                    const existingSlider = document.getElementById('inner-ratio');
                    const renderedDay = recBox.getAttribute('data-rendered-day'); const renderedLang = recBox.getAttribute('data-rendered-lang'); 

                    if (existingSlider && renderedDay === day && renderedLang === window.currentLang) {
                        document.getElementById('rec-val-1').innerText = val1 + items[0].suffix; 
                        document.getElementById('rec-val-2').innerText = val2 + items[1].suffix;
                    } else {
                        recBox.setAttribute('data-rendered-day', day); recBox.setAttribute('data-rendered-lang', window.currentLang);
                        recBox.innerHTML = `<div class="recommend-card"><div class="rec-title">💡 [${dayName}] ${targetText} ${t.rec.guide_title}</div><div class="rec-desc">${t.rec.desc}</div><div class="rec-slider-container"><div class="rec-slider-item"><span class="rec-slider-label">${items[0].label}</span><span class="rec-slider-val" id="rec-val-1">${val1}${items[0].suffix}</span></div><input type="range" id="inner-ratio" min="0" max="100" value="${window.customRatio}" step="1" class="modern-slider" oninput="window.updateRatioText(this.value)"><div class="rec-slider-item"><span class="rec-slider-label">${items[1].label}</span><span class="rec-slider-val" id="rec-val-2">${val2}${items[1].suffix}</span></div></div></div>`;
                    }
                } 
                else if (items && items.length === 1) {
                    const v1 = items[0].unit(m_calc);
                    const val1 = formatRecVal(Math.ceil(rem / v1), items[0].label);
                    
                    const renderedDay = recBox.getAttribute('data-rendered-day'); 
                    const renderedLang = recBox.getAttribute('data-rendered-lang'); 
                    const currentLabel = items[0].label;
                    const renderedLabel = recBox.getAttribute('data-rendered-label');

                    if (document.getElementById('rec-val-single') && renderedDay === day && renderedLang === window.currentLang && renderedLabel === currentLabel) {
                        document.getElementById('rec-val-single').innerText = val1 + items[0].suffix;
                    } else {
                        recBox.setAttribute('data-rendered-day', day); 
                        recBox.setAttribute('data-rendered-lang', window.currentLang);
                        recBox.setAttribute('data-rendered-label', currentLabel);
                        
                        // 💡 단일 항목(토요일 등)이 박스로 분리되도록 HTML 구조 변경
                        recBox.innerHTML = `<div class="recommend-card"><div class="rec-title">💡 [${dayName}] ${targetText} ${t.rec.guide_title}</div><div class="rec-desc">${t.rec.single_desc}</div><div class="rec-single-item"><div class="rec-slider-label">${currentLabel}</div><div class="rec-slider-val" id="rec-val-single">${val1}${items[0].suffix}</div></div></div>`;
                    }
                }
            }
        }
    } catch(e) { console.error("Recommend Box Error:", e); }
};

/* --- Initialize Logic --- */
window.initCalc = function() {
    try {
        if (!localStorage.getItem('tech_init_v3')) { const data = window.safeJSONParse(localStorage.getItem('lastwar_data')); data['t-expert'] = 20; data['t-radar'] = 6; data['t-spd'] = 6; data['t-rec'] = 6; data['t-con'] = 1; data['t-tec'] = 1; data['t-trn'] = 6; data['t-kil'] = 6; window.safeStorageSet('lastwar_data', data); localStorage.setItem('tech_init_v3', 'true'); }
        
        if(window.updateUITexts) window.updateUITexts(); 
        
        const savedTheme = localStorage.getItem('theme') || 'dark'; document.body.className = savedTheme + '-theme';
        
        const dayTabs = document.getElementById('day-tabs-container');
        if(dayTabs) { const t = window.i18n[window.currentLang]; dayTabs.innerHTML = ['mon','tue','wed','thu','fri','sat'].map((d, i) => `<button id="btn-${d}" class="day-btn ${d===window.currentDay?'active':''}" onclick="window.switchTab('${d}')">${t.days[i]}</button>`).join(''); }
        
        window.renderDroneInputs(); window.updateAll();

        let touchStartX = 0; let touchEndX = 0;
        const calcPage = document.getElementById('page-vs');
        if(calcPage) {
            calcPage.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
            calcPage.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                const days = ['mon','tue','wed','thu','fri','sat']; const threshold = 60; 
                let idx = days.indexOf(window.currentDay);
                if (touchEndX < touchStartX - threshold && idx < days.length - 1) { window.switchTab(days[idx + 1]); } 
                else if (touchEndX > touchStartX + threshold && idx > 0) { window.switchTab(days[idx - 1]); } 
            }, {passive: true});
        }
    } catch(e) { console.error("Init Error:", e); }
}
