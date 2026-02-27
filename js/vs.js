/* ==========================================
   js/vs.js - 프리미엄 리스트 UI & 계산 모듈 (ES Modules)
========================================== */
import { Store, debounce } from './store.js';
import { i18n } from './i18n.js';
import { customConfirm } from './main.js';

export const GAME_CONSTANTS = { 
    RADAR: 10000, TRUCK: 100000, SECRET: 75000, SURV: 1500, SPD_MIN: 50, POW_PT: 10, 
    H_GATHER: 9523.5, DRONE_PART: 2500, DRONE_DATA: 3, HONOR_MEDAL: 300, RECRUIT: 1500, 
    UR_SHARD: 10000, SSR_SHARD: 3500, SR_SHARD: 1000, SKILL_MEDAL: 10, EXP_UNIT: 1.0/660, 
    BOXES: [0, 1100, 3300, 10000, 30000, 90000, 270000, 810000], 
    TRP: [0, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110], 
    KIL_SPEC: [0, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55], 
    KIL_GEN: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] 
};

const fixF = v => Math.round((v || 0) * 10) / 10; 
const GC = GAME_CONSTANTS;

function getMedalsFromScore(score) { 
    if (score >= 7200000) return 1200; if (score >= 3600000) return 800; if (score >= 2300000) return 400; return 0; 
}

function getVal(cid) { 
    const val = Store.get(cid, undefined);
    if (val !== undefined) return val;
    return cid.includes('squads') ? "1" : (cid.includes('lvl') ? "8" : "0"); 
}
function val(id) { return parseFloat(document.getElementById(id)?.value) || 0; }

/* 💡 세계적 디테일: Number Ticker (도파민을 위한 카운팅 모션) */
let currentDisplayedScore = 0;
let currentDisplayedMedals = 0;
let animationFrameId = null;

export function animateNumber(el, start, end, duration = 400, isFloat = false) {
    if (!el) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // 극적인 속도감을 위한 Quartic ease-out 물리 엔진 적용
        const ease = 1 - Math.pow(1 - progress, 4); 
        const currentVal = start + (end - start) * ease;
        
        el.innerText = isFloat 
            ? currentVal.toLocaleString('ko-KR', { maximumFractionDigits: 1 }) 
            : Math.round(currentVal).toLocaleString('ko-KR');
            
        if (progress < 1) animationFrameId = window.requestAnimationFrame(step);
        else el.innerText = isFloat 
            ? end.toLocaleString('ko-KR', { maximumFractionDigits: 1 }) 
            : Math.round(end).toLocaleString('ko-KR');
    };
    if(animationFrameId) window.cancelAnimationFrame(animationFrameId);
    animationFrameId = window.requestAnimationFrame(step);
}

/* --- 프리미엄 UI 헬퍼 함수 --- */
export function createStepper(id, value) {
    return `<div class="stepper-container"><button class="stepper-btn" data-action="startStep" data-id="${id}" data-delta="-1">-</button><input type="number" id="${id}" class="compact-input" min="0" value="${value}" data-action="updateAll"><button class="stepper-btn" data-action="startStep" data-id="${id}" data-delta="1">+</button></div>`;
}
export function createQuickStepper(id, value) {
    return `<div class="stepper-container"><button class="stepper-btn" data-action="startQuickStep" data-id="${id}" data-delta="-1">-</button><input type="number" id="${id}" class="compact-input quick-input-val" min="0" value="${value}"><button class="stepper-btn" data-action="startQuickStep" data-id="${id}" data-delta="1">+</button></div>`;
}
export function createCustomSelectBtn(id, min, max, prefix, suffix, currentVal) {
    return `<button id="${id}-btn" class="custom-select-btn" data-action="openCustomSelect" data-id="${id}" data-min="${min}" data-max="${max}" data-prefix="${prefix}" data-suffix="${suffix}"><span>${prefix}${currentVal}${suffix}</span><svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button><input type="hidden" id="${id}" value="${currentVal}">`;
}

export function openCustomSelect(id, min, max, prefix, suffix) {
    try {
        if(navigator.vibrate) navigator.vibrate(15);
        let optionsHtml = ''; const el = document.getElementById(id); let currentVal = el ? (parseInt(el.value) || min) : min;
        for(let i=min; i<=max; i++) { optionsHtml += `<div class="sheet-option ${i==currentVal?'active':''}" data-action="selectCustomValue" data-id="${id}" data-val="${i}" data-prefix="${prefix}" data-suffix="${suffix}">${prefix}${i}${suffix}</div>`; }
        document.getElementById('sheetTitle').innerText = Store.getState('lang') === 'ko' ? "선택" : "Select"; 
        document.getElementById('sheetOptions').innerHTML = optionsHtml; 
        document.getElementById('customSelectModal').classList.add('active');
    } catch(e) {}
}

export function selectCustomValue(id, val, prefix, suffix) {
    if(navigator.vibrate) navigator.vibrate(10);
    const el = document.getElementById(id);
    if (el) el.value = val;
    
    const btnSpan = document.getElementById(id+'-btn'); 
    if(btnSpan) btnSpan.querySelector('span').innerText = prefix + val + suffix;
    
    document.getElementById('customSelectModal').classList.remove('active'); 
    
    // 💡 핵심 수정: 레벨 변경 시 즉시 저장 및 전체 점수 갱신 실행
    Store.set(id, val.toString(), false);
    executeHeavyUpdate(); 
}

/* --- 업데이트 및 계산 로직 --- */
export function executeHeavyUpdate() {
    const d = Store.getState('currentDay'); 
    const lang = Store.getState('lang');
    const t = i18n[lang]; 
    const targetScore = Store.getState('targetScore');
    let totalScore = 0;

    ['mon','tue','wed','thu','fri','sat'].forEach(day => { const btn = document.getElementById(`btn-${day}`); if(btn) btn.classList.toggle('completed', calculateDayScore(day) >= targetScore); });
    
    let m = { rad: getM('t-radar'), spd: getM('t-spd'), rec: getM('t-rec'), con: getM('t-con'), tec: getM('t-tec'), trn: getM('t-trn'), kil: getM('t-kil'), exp: getM('t-expert') };
    function setPt(id, pt) { const rpt = fixF(pt); const el = document.getElementById('pts-' + id); if(el) el.innerText = '+' + rpt.toLocaleString('ko-KR', { maximumFractionDigits: 1 }) + ' pt'; totalScore += rpt; }

    setPt('dia', val(d+'-dia') * 30);
    switch(d) {
        case 'mon': setPt('radar', val('mon-radar')*GC.RADAR*m.rad.sub); setPt('stam', val('mon-stam')*150*m.exp.all); setPt('exp', val('mon-exp')*1000000*GC.EXP_UNIT*m.exp.all); setPt('part', val('mon-part')*GC.DRONE_PART*m.exp.all); setPt('data', val('mon-data')*1000*GC.DRONE_DATA*m.exp.all); setPt('gather', val('mon-gather') * parseFloat(getVal('mon-squads')||1) * GC.H_GATHER * m.exp.all); break;
        case 'tue': setPt('truck', val('tue-truck')*GC.TRUCK*m.exp.all); setPt('sec', val('tue-sec')*GC.SECRET*m.exp.all); setPt('surv', val('tue-surv')*GC.SURV*m.exp.all); setPt('spd', val('tue-spd')*60*GC.SPD_MIN*m.spd.sub); setPt('pow', val('tue-pow')*1000*GC.POW_PT*m.con.sub); break;
        case 'wed': setPt('radar', val('wed-radar')*GC.RADAR*m.rad.sub); setPt('spd', val('wed-spd')*60*GC.SPD_MIN*m.spd.sub); setPt('pow', val('wed-pow')*1000*GC.POW_PT*m.tec.sub); setPt('mdl', val('wed-mdl')*GC.HONOR_MEDAL*m.exp.all); let dTot = 0; for(let i=1; i<=7; i++) dTot += val('drone-b'+i) * GC.BOXES[i]; setPt('drone-box', dTot * m.exp.all); break;
        case 'thu': setPt('tkt', val('thu-tkt')*GC.RECRUIT*m.rec.sub); setPt('hero-shard', (val('hero-ur')*GC.UR_SHARD + val('hero-ssr')*GC.SSR_SHARD + val('hero-sr')*GC.SR_SHARD) * m.exp.all); setPt('sk', val('thu-sk')*GC.SKILL_MEDAL*m.exp.all); setPt('exp', val('thu-exp')*1000000*GC.EXP_UNIT*m.exp.all); break;
        case 'fri': setPt('radar', val('fri-radar')*GC.RADAR*m.rad.sub); setPt('spd-con', val('fri-spd-con')*60*GC.SPD_MIN*m.spd.sub); setPt('spd-tec', val('fri-spd-tec')*60*GC.SPD_MIN*m.spd.sub); setPt('spd-trn', val('fri-spd-trn')*60*GC.SPD_MIN*m.spd.sub); setPt('pow-con', val('fri-pow-con')*1000*GC.POW_PT*m.con.sub); setPt('pow-tec', val('fri-pow-tec')*1000*GC.POW_PT*m.tec.sub); setPt('count', val('fri-count')*GC.TRP[parseInt(getVal('fri-lvl'))||8]*m.trn.sub); break;
        case 'sat': setPt('truck', val('sat-truck')*GC.TRUCK*m.exp.all); setPt('sec', val('sat-sec')*GC.SECRET*m.exp.all); setPt('spd-all', val('sat-spd-all')*60*GC.SPD_MIN*m.spd.sub); let kS = getVal('sat-target') === 'general' ? GC.KIL_GEN[parseInt(getVal('sat-elvl'))||8] : GC.KIL_SPEC[parseInt(getVal('sat-elvl'))||8]; setPt('kill', val('sat-kill')*kS*m.kil.sub); setPt('dth', val('sat-dth')*GC.KIL_GEN[parseInt(getVal('sat-alvl'))||8]*m.exp.all); break;
    }

    saveAllData(); 
    totalScore = fixF(totalScore); const pct = Math.min(100, (totalScore / targetScore) * 100);
    
    // 💡 번호 애니메이션 실행
    const scoreEl = document.getElementById('score');
    if(scoreEl && currentDisplayedScore !== totalScore) {
        animateNumber(scoreEl, currentDisplayedScore, totalScore, 500, true);
        currentDisplayedScore = totalScore;
    }

    const earnedMedals = getMedalsFromScore(totalScore); 
    const medalEl = document.getElementById('medal-status');
    if(medalEl) { 
        if (currentDisplayedMedals !== earnedMedals) {
            animateNumber(medalEl, currentDisplayedMedals, earnedMedals, 400, false);
            currentDisplayedMedals = earnedMedals;
        }
        medalEl.style.color = earnedMedals >= 1200 ? '#FF9500' : (earnedMedals >= 800 ? 'var(--primary)' : 'var(--success)'); 
    }

    const barEl = document.getElementById('bar');
    if(barEl) { barEl.style.width = pct + '%'; barEl.classList.toggle('completed', pct >= 100); }
    if(document.getElementById('pct-text')) document.getElementById('pct-text').innerText = Math.floor(pct) + '%';
    if(document.getElementById('box-status')) document.getElementById('box-status').innerText = `${Math.min(9, Math.floor(totalScore / (targetScore / 9)))} / 9`;
    
    const rem = fixF(targetScore - totalScore);
    if(document.getElementById('diff')) document.getElementById('diff').innerText = rem > 0 ? `${t.result.remain}: ${rem.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}` : t.success;
    updateRecommendBox(rem, t, d);
}

export const debouncedUpdateAll = debounce(executeHeavyUpdate, 150);

/* --- Stepper Control --- */
export function stepVal(id, delta) { 
    if(navigator.vibrate) navigator.vibrate(10);
    const el = document.getElementById(id); 
    if(el) { el.value = Math.max(0, (parseFloat(el.value) || 0) + delta); debouncedUpdateAll(); if(['m5','m15','h1','h3','h8'].includes(id)) calcSpdTotal(); } 
}
export function quickStepVal(id, delta) { if(navigator.vibrate) navigator.vibrate(10); const el = document.getElementById(id); if(el) el.value = Math.max(0, (parseFloat(el.value) || 0) + delta); }

let stepSpeed = 150; let stepInterval; let quickStepInterval;
export function startStep(e, id, delta) { if (e) e.preventDefault(); stepVal(id, delta); stepSpeed = 150; let count = 0; if(stepInterval) clearTimeout(stepInterval); const run = () => { stepVal(id, delta); count++; if(count > 5) stepSpeed = 50; if(count > 15) stepSpeed = 15; stepInterval = setTimeout(run, stepSpeed); }; stepInterval = setTimeout(run, stepSpeed); }
export function stopStep() { if(stepInterval) clearTimeout(stepInterval); }

export function startQuickStep(e, id, delta) { if (e) e.preventDefault(); quickStepVal(id, delta); let speed = 150; let count = 0; if(quickStepInterval) clearTimeout(quickStepInterval); const run = () => { quickStepVal(id, delta); count++; if(count > 5) speed = 50; if(count > 15) speed = 15; quickStepInterval = setTimeout(run, speed); }; quickStepInterval = setTimeout(run, speed); }
export function stopQuickStep() { if(quickStepInterval) clearTimeout(quickStepInterval); }

/* --- Render Inputs --- */
export function renderDroneInputs() { const c = document.getElementById('drone-inputs-container'); if(!c) return; let h = ''; for(let i=1; i<=7; i++) { h += `<div class="list-item"><div class="item-info"><span class="item-title">Lv.${i}</span></div><div class="item-controls">${createStepper('drone-b'+i, getVal('drone-b'+i))}</div></div>`; } c.innerHTML = h; }
export function renderHeroInputs() { const c = document.getElementById('hero-inputs-container'); if(!c) return; const t = i18n[Store.getState('lang')].labels; c.innerHTML = `<div class="list-item"><div class="item-info"><span class="item-title">${t.ur}</span></div><div class="item-controls">${createStepper('hero-ur', getVal('hero-ur'))}</div></div><div class="list-item"><div class="item-info"><span class="item-title">${t.ssr}</span></div><div class="item-controls">${createStepper('hero-ssr', getVal('hero-ssr'))}</div></div><div class="list-item"><div class="item-info"><span class="item-title">${t.sr}</span></div><div class="item-controls">${createStepper('hero-sr', getVal('hero-sr'))}</div></div>`; }

export function renderTechInputs() {
    try {
        const techGrid = document.getElementById('tech-inputs'); if(!techGrid) return; const t = i18n[Store.getState('lang')]; 
        const techs = [ {id:'t-expert', l:t.expert, def: 20, max: 20}, {id:'t-radar', l:t.radar, def: 6, max: 10}, {id:'t-spd', l:t.spd, def: 6, max: 10}, {id:'t-rec', l:t.tech_rec, def: 6, max: 10}, {id:'t-con', l:t.con, def: 1, max: 10}, {id:'t-tec', l:t.tec, def: 1, max: 10}, {id:'t-trn', l:t.trn, def: 6, max: 10}, {id:'t-kil', l:t.kil, def: 6, max: 10} ]; 
        techGrid.innerHTML = techs.map(item => { 
            let currentVal = Store.get(item.id, item.def); if(currentVal > item.max) currentVal = item.max; 
            return `<div class="list-item"><div class="item-info"><span class="item-title">${item.l}</span></div><div class="item-controls">${createCustomSelectBtn(item.id, 0, item.max, 'Lv ', '', currentVal)}</div></div>`; 
        }).join('');
    } catch(e) {}
}

export function renderSpdStepper() { const c = document.getElementById('spd-stepper-container'); if(!c) return; const t = i18n[Store.getState('lang')].labels; const ids = ['m5','m15','h1','h3','h8']; const labels = [t.m5, t.m15, t.h1, t.h3, t.h8]; const savedSpd = Store.spdData[Store.getState('activeSpdId')] || {}; let h = ''; ids.forEach((id, idx) => { h += `<div class="list-item"><div class="item-info"><span class="item-title">${labels[idx]}</span></div><div class="item-controls">${createStepper(id, savedSpd[id] || 0)}</div></div>`; }); c.innerHTML = h; }

export function renderInputs() {
    try {
        const lang = Store.getState('lang');
        const day = Store.getState('currentDay');
        const t = i18n[lang]; 
        const container = document.getElementById('input-container'); if(!container) return;
        
        let html = `<div class="section-header-row"><div class="section-title" style="margin:0;">📝 ${day.toUpperCase()} INPUT</div><div class="section-actions"><button data-action="openQuickInputModal" class="btn-flashy">⚡ ${t.btn.quick}</button><button data-action="setFixedValues" class="btn-ghost">${t.fixed}</button><button data-action="resetDayData" class="btn-ghost danger">${t.reset}</button></div></div>`;
        
        const makeItem = (i) => {
            const cid = `${day}-${i.id}`; 
            let titleHtml = i.isSpd ? `<div class="item-title-group"><span class="item-title">${i.l}</span><button class="btn-calc-pill" data-action="openSpdModal" data-id="${i.id}" data-label="${i.l}">계산기</button></div>` : `<span class="item-title">${i.l}</span>`;
            return `<div class="list-item"><div class="item-info">${titleHtml}<span class="item-pts" id="pts-${i.id}">0</span></div><div class="item-controls">${createStepper(cid, getVal(cid))}</div></div>`; 
        };

        let reqHtml = ''; let mainHtml = ''; let optHtml = '';

        // 💡 3단 분리 로직 (필수 / 메인 / 선택)
        if(day === 'mon') { 
            reqHtml += `<div class="list-item"><div class="item-info"><span class="item-title">${t.inputs.squads}</span></div><div class="item-controls">${createCustomSelectBtn('mon-squads', 1, 5, '', t.inputs.squads_unit, getVal('mon-squads')||1)}</div></div>
                        <div class="list-item"><div class="item-info"><span class="item-title">${t.inputs.gather}</span><span class="item-pts" id="pts-gather">0</span></div><div class="item-controls">${createStepper('mon-gather', getVal('mon-gather'))}</div></div>`; 
            reqHtml += makeItem({id:'radar', l:t.inputs.radar_task});
            reqHtml += makeItem({id:'stam', l:t.inputs.stam});
            mainHtml += makeItem({id:'part', l:t.inputs.part});
            mainHtml += makeItem({id:'data', l:t.inputs.data});
            optHtml += makeItem({id:'dia', l:t.inputs.dia});
            optHtml += makeItem({id:'exp', l:t.inputs.exp});
        }
        else if(day === 'tue') { 
            reqHtml += makeItem({id:'truck', l:t.inputs.truck});
            reqHtml += makeItem({id:'sec', l:t.inputs.sec});
            mainHtml += makeItem({id:'surv', l:t.inputs.surv});
            mainHtml += makeItem({id:'spd', l:t.inputs.build_spd, isSpd:true});
            mainHtml += makeItem({id:'pow', l:t.inputs.pow_con});
            optHtml += makeItem({id:'dia', l:t.inputs.dia});
        }
        else if(day === 'wed') { 
            reqHtml += makeItem({id:'radar', l:t.inputs.radar_task});
            mainHtml += `<div class="list-item"><div class="item-info"><div class="item-title-group"><span class="item-title">📦 ${t.modal.drone}</span><button class="btn-calc-pill" data-action="openDroneModal">입력</button></div><span class="item-pts" id="pts-drone-box">0</span></div></div>`;
            mainHtml += makeItem({id:'spd', l:t.inputs.tec_spd, isSpd:true});
            mainHtml += makeItem({id:'pow', l:t.inputs.pow_tec});
            mainHtml += makeItem({id:'mdl', l:t.inputs.medal});
            optHtml += makeItem({id:'dia', l:t.inputs.dia});
        }
        else if(day === 'thu') { 
            mainHtml += `<div class="list-item"><div class="item-info"><div class="item-title-group"><span class="item-title">🧩 ${t.modal.hero}</span><button class="btn-calc-pill" data-action="openHeroModal">입력</button></div><span class="item-pts" id="pts-hero-shard">0</span></div></div>`;
            mainHtml += makeItem({id:'tkt', l:t.inputs.tkt});
            mainHtml += makeItem({id:'exp', l:t.inputs.exp});
            mainHtml += makeItem({id:'sk', l:t.inputs.sk});
            optHtml += makeItem({id:'dia', l:t.inputs.dia});
        }
        else if(day === 'fri') { 
            reqHtml += makeItem({id:'radar', l:t.inputs.radar_task});
            mainHtml += makeItem({id:'spd-trn', l:t.inputs.trn_spd, isSpd:true});
            mainHtml += `<div class="list-item"><div class="item-info"><span class="item-title">${t.inputs.trn_lvl}</span></div><div class="item-controls">${createCustomSelectBtn('fri-lvl', 1, 10, 'Lv ', '', getVal('fri-lvl')||8)}</div></div>
                         <div class="list-item"><div class="item-info"><span class="item-title">${t.inputs.trn_cnt}</span><span class=\"item-pts\" id=\"pts-count\">0</span></div><div class=\"item-controls\">${createStepper('fri-count', getVal('fri-count'))}</div></div>`; 
            optHtml += makeItem({id:'dia', l:t.inputs.dia});
            optHtml += makeItem({id:'spd-con', l:t.inputs.build_spd, isSpd:true});
            optHtml += makeItem({id:'spd-tec', l:t.inputs.tec_spd, isSpd:true});
            optHtml += makeItem({id:'pow-con', l:t.inputs.pow_con});
            optHtml += makeItem({id:'pow-tec', l:t.inputs.pow_tec});
        }
        else if(day === 'sat') { 
            reqHtml += makeItem({id:'truck', l:t.inputs.truck});
            reqHtml += makeItem({id:'sec', l:t.inputs.sec});
            const target = getVal('sat-target') || "special"; 
            mainHtml += `<div class="list-item" style="flex-direction:column; align-items:flex-start;"><div class="item-info" style="margin-bottom:12px;"><span class="item-title">${t.inputs.kill_target}</span></div>
                            <div class="target-selector two-cols" style="width:100%; margin-bottom:0;"><button class="target-btn ${target=='special'?'active':''}" data-action="setSatTarget" data-target="special">${t.inputs.target_spec}</button><button class="target-btn ${target=='general'?'active':''}" data-action="setSatTarget" data-target="general">${t.inputs.target_gen}</button></div>
                        </div>
                        <div class="list-item"><div class="item-info"><span class="item-title">${t.inputs.kill_lvl}</span></div><div class="item-controls">${createCustomSelectBtn('sat-elvl', 1, 10, 'Lv ', '', getVal('sat-elvl')||8)}</div></div>
                        <div class="list-item"><div class="item-info"><span class="item-title">${t.inputs.kill_cnt}</span><span class="item-pts" id="pts-kill">0</span></div><div class="item-controls">${createStepper('sat-kill', getVal('sat-kill'))}</div></div>
                        <div class="list-item"><div class="item-info"><span class="item-title">${t.inputs.dth_lvl}</span></div><div class="item-controls">${createCustomSelectBtn('sat-alvl', 1, 10, 'Lv ', '', getVal('sat-alvl')||8)}</div></div>
                        <div class="list-item"><div class="item-info"><span class="item-title">${t.inputs.dth_cnt}</span><span class="item-pts" id="pts-dth">0</span></div><div class="item-controls">${createStepper('sat-dth', getVal('sat-dth'))}</div></div>`; 
            optHtml += makeItem({id:'dia', l:t.inputs.dia});
            optHtml += makeItem({id:'spd-all', l:t.inputs.kill_spd, isSpd:true});
        }

        if (reqHtml) html += `<details class="modern-accordion"><summary>📌 기본 획득 항목 (필수)</summary><div class="accordion-content">${reqHtml}</div></details>`;
        if (mainHtml) html += `<div class="mobile-list-group" style="margin-top: 15px;">${mainHtml}</div>`;
        if (optHtml) html += `<details class="modern-accordion" style="margin-top: 15px;"><summary>⚙️ 항목 선택</summary><div class="accordion-content">${optHtml}</div></details>`;

        container.innerHTML = html;
    } catch(e) {}
}

/* --- State Modifiers --- */
export function setTarget(s) { Store.setState('targetScore', s); document.querySelectorAll('.target-btn').forEach(b => b.classList.remove('active')); document.getElementById('target-' + s)?.classList.add('active'); debouncedUpdateAll(); }
export function switchTab(day) { Store.setState('currentDay', day); document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active')); document.getElementById('btn-' + day)?.classList.add('active'); renderInputs(); debouncedUpdateAll(); }
export function setSatTarget(val) { Store.set('sat-target', val); renderInputs(); debouncedUpdateAll(); }
export function updateRatioText(val) { Store.setState('customRatio', parseInt(val)); debouncedUpdateAll(); }

export function setFixedValues() {
    const lang = Store.getState('lang');
    const msg = lang === 'ko' ? "매일 기본적으로 얻는 고정 획득량을 일괄 적용하시겠습니까?" : "Apply daily fixed settings?";
    customConfirm(msg, () => {
        Store.set('mon-squads', "2", false); Store.set('mon-gather', "24", false);
        ['mon','tue','wed','thu','fri','sat'].forEach(d => { Store.set(`${d}-radar`, "82", false); if(d === 'tue' || d === 'sat') { Store.set(`${d}-truck`, "4", false); Store.set(`${d}-sec`, "7", false); } });
        Store.debouncedSave(); renderInputs(); debouncedUpdateAll();
    });
}

export function resetDayData() {
    const lang = Store.getState('lang');
    const day = Store.getState('currentDay');
    const msg = lang === 'ko' ? "현재 요일의 입력값을 0으로 초기화하시겠습니까?" : "Reset data for this day?";
    customConfirm(msg, () => {
        const prefix = day + '-';
        Object.keys(Store.data).forEach(key => { if(key.startsWith(prefix)) Store.data[key] = key.includes('squads') ? "1" : "0"; });
        Object.keys(Store.spdData).forEach(key => { if(key.startsWith(prefix)) delete Store.spdData[key]; });
        if(day === 'wed') { for(let i=1; i<=7; i++) { const el = document.getElementById('drone-b'+i); if(el) el.value = 0; } }
        if(day === 'thu') { ['hero-ur','hero-ssr','hero-sr'].forEach(id => { const el = document.getElementById(id); if (el) el.value = 0; }); }
        Store.debouncedSave(); Store.debouncedSpdSave(); renderInputs(); debouncedUpdateAll();
    });
}

/* --- Modals Open/Close --- */
export function openSpdModal(cid, label) { 
    try {
        Store.setState('activeSpdId', `${Store.getState('currentDay')}-${cid}`); 
        const titleEl = document.getElementById('spd-title'); 
        if(titleEl) titleEl.innerText = label; 
        renderSpdStepper(); calcSpdTotal(); 
        document.getElementById('spdModal')?.classList.add('active'); 
    } catch (e) {}
}

export function showWeeklyReport() {
    const days = ['mon','tue','wed','thu','fri','sat']; const currentT = i18n[Store.getState('lang')]; let html = `<div class="weekly-container">`; let totalWeeklyScore = 0; let totalWeeklyMedals = 0;
    days.forEach((d, idx) => {
        const dayScore = fixF(calculateDayScore(d)); totalWeeklyScore += dayScore; const medals = getMedalsFromScore(dayScore); totalWeeklyMedals += medals;
        let badgeHTML = '';
        if (dayScore >= 7200000) badgeHTML = `<span class="weekly-badge badge-9">9상 🎁</span>`; else if (dayScore >= 3600000) badgeHTML = `<span class="weekly-badge badge-8">8상 📦</span>`; else if (dayScore >= 2300000) badgeHTML = `<span class="weekly-badge badge-6">6상 📦</span>`; else badgeHTML = `<span class="weekly-badge badge-fail">미달</span>`;
        html += `<div class="weekly-row"><div class="weekly-row-top"><div class="weekly-day-group"><span class="weekly-day" style="color: var(--${d});">${currentT.days[idx]}</span>${badgeHTML}</div><span class="weekly-score">${dayScore.toLocaleString('ko-KR', { maximumFractionDigits: 1 })} <span>pt</span></span></div>${medals > 0 ? `<div class="weekly-row-bottom"><span>획득 훈장</span><span style="color:var(--warning);">+${medals}개</span></div>` : ''}</div>`;
    });
    html += `<div class="weekly-total"><div class="weekly-total-row"><span>총 점수</span><span style="font-size:1.4rem;">${fixF(totalWeeklyScore).toLocaleString('ko-KR', { maximumFractionDigits: 1 })} pt</span></div><div class="weekly-total-row" style="color:var(--warning); margin-top:5px; padding-top:15px; border-top:1px dashed var(--border-light);"><span>총 획득 훈장</span><span style="font-size:1.4rem;">🏅 ${totalWeeklyMedals.toLocaleString()}개</span></div></div></div>`;
    document.getElementById('weekly-report-content').innerHTML = html; document.getElementById('weeklyModal').classList.add('active');
}

export function calcSpdTotal() {
    const t = i18n[Store.getState('lang')];
    const m5 = parseFloat(document.getElementById('m5')?.value) || 0; const m15 = parseFloat(document.getElementById('m15')?.value) || 0; const h1 = parseFloat(document.getElementById('h1')?.value) || 0; const h3 = parseFloat(document.getElementById('h3')?.value) || 0; const h8 = parseFloat(document.getElementById('h8')?.value) || 0;
    const totalMin = (m5 * 5) + (m15 * 15) + (h1 * 60) + (h3 * 180) + (h8 * 480);
    const d = Math.floor(totalMin / 1440); const h = Math.floor((totalMin % 1440) / 60); const m = Math.round(totalMin % 60);
    const resText = document.getElementById('spd-result-text'); if(resText) { resText.innerText = `${t.modal.total}: ${d}${t.units.day} ${h}${t.units.hour} ${m}${t.units.min}`; } return totalMin;
}
export function applySpd() {
    const totalMin = calcSpdTotal(); const activeSpdId = Store.getState('activeSpdId'); const targetInput = document.getElementById(activeSpdId); 
    if(targetInput) { 
        targetInput.value = (totalMin / 60).toFixed(2); 
        Store.spdData[activeSpdId] = { m5: document.getElementById('m5').value, m15: document.getElementById('m15').value, h1: document.getElementById('h1').value, h3: document.getElementById('h3').value, h8: document.getElementById('h8').value }; 
        Store.debouncedSpdSave(); debouncedUpdateAll(); 
    }
    document.getElementById('spdModal').classList.remove('active');
}

export function openQuickInputModal() {
    const t = i18n[Store.getState('lang')]; 
    const container = document.getElementById('quick-input-container'); 
    const day = Store.getState('currentDay'); 
    let html = '';

    // 💡 쾌속 입력창에는 '메인 핵심 항목'만 노출하도록 구성 (필수/선택 제외)
    const config = { 
        mon:[{id:'part',l:t.inputs.part},{id:'data',l:t.inputs.data}], 
        tue:[{id:'surv',l:t.inputs.surv},{id:'spd',l:t.inputs.build_spd},{id:'pow',l:t.inputs.pow_con}], 
        wed:[{id:'spd',l:t.inputs.tec_spd},{id:'pow',l:t.inputs.pow_tec},{id:'mdl',l:t.inputs.medal}], 
        thu:[{id:'tkt',l:t.inputs.tkt},{id:'exp',l:t.inputs.exp},{id:'sk',l:t.inputs.sk}], 
        fri:[{id:'spd-trn',l:t.inputs.trn_spd},{id:'count',l:t.inputs.trn_cnt, isLvl:true, lvlId:'fri-lvl'}], 
        sat:[{id:'kill',l:t.inputs.kill_cnt, isLvl:true, lvlId:'sat-elvl'},{id:'dth',l:t.inputs.dth_cnt, isLvl:true, lvlId:'sat-alvl'}] 
    };

    let items = [...(config[day] || [])];

    // 수요일 드론 상자, 목요일 영웅 조각은 메인이므로 추가
    if(day === 'wed') { 
        for(let i=1; i<=7; i++) items.push({id: `drone-b${i}`, l: Store.getState('lang') === 'ko' ? `드론 상자 Lv.${i}` : `Drone Box Lv.${i}`, isDirect: true}); 
    }
    if(day === 'thu') { 
        items.push({id: 'hero-ur', l: t.labels.ur, isDirect: true}, {id: 'hero-ssr', l: t.labels.ssr, isDirect: true}, {id: 'hero-sr', l: t.labels.sr, isDirect: true}); 
    }

    items.forEach(item => {
        const cid = item.isDirect ? item.id : `${day}-${item.id}`; 
        const val = getVal(cid);
        const cleanLabel = item.l.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim();
        
        html += `<div class="list-item" style="flex-direction:column; align-items:stretch; gap:10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="item-title">${cleanLabel}</span>
                        ${createQuickStepper('qi-'+cid, val)}
                    </div>`;
        
        if(item.isLvl) {
            const currentLvl = getVal(item.lvlId);
            html += `<div style="display:flex; justify-content:space-between; align-items:center; background:var(--input-bg); padding:8px 12px; border-radius:12px;">
                        <span style="font-size:0.85rem; font-weight:700; color:var(--text-muted);">적용 레벨</span>
                        ${createCustomSelectBtn(item.lvlId, 1, 10, 'Lv ', '', currentLvl)}
                     </div>`;
        }
        html += `</div>`;
    });
    
    container.innerHTML = html; 
    document.getElementById('quickInputModal').classList.add('active');
}
export function previewQuickScreenshot(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) { document.getElementById('quick-img-tag').src = e.target.result; document.getElementById('quick-image-preview').style.display = 'block'; }
        reader.readAsDataURL(file);
    }
}

export function applyQuickInput() {
    const inputs = document.querySelectorAll('.quick-input-val');
    inputs.forEach(input => { 
        const cid = input.id.replace('qi-', ''); 
        Store.set(cid, input.value || "0", false); 
        // 메인 화면의 입력창 값도 동기화
        const mainInput = document.getElementById(cid); 
        if(mainInput) mainInput.value = input.value; 
    });
    Store.debouncedSave(); 
    executeHeavyUpdate(); // 💡 적용 후 즉시 점수 갱신
    document.getElementById('quickInputModal').classList.remove('active');
}
/* --- Core Calculation --- */
function getM(subId) { 
    const expertLv = parseInt(getVal('t-expert')) || 0; const subLv = parseInt(getVal(subId)) || 0; const eBonus = expertLv * 0.05; let sBonus = 0;
    if (subId === 't-radar') { const radarCurve = [0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.35, 0.45, 0.60, 0.80, 1.00]; sBonus = radarCurve[subLv] || (subLv * 0.05); } else if (subId !== 't-expert') { sBonus = subLv * 0.05; }
    return { all: 1 + eBonus, sub: 1 + eBonus + sBonus }; 
}

function getRecommendMap(t) { 
    const lang = Store.getState('lang');
    const targetType = getVal('sat-target') || "special"; const targetLvl = parseInt(getVal('sat-elvl')) || 8;
    const targetName = targetType === 'special' ? t.inputs.target_spec : t.inputs.target_gen; const satLabel = `🔥 ${targetName} (Lv.${targetLvl})`;
    const ea = lang === 'ko' ? '개' : ''; const k = 'k'; const p = lang === 'ko' ? '명' : '';

    return { 
        mon: [{ label: t.inputs.part, unit: (m) => GC.DRONE_PART * m.exp.all, suffix: ea }, { label: t.inputs.data, unit: (m) => 1000 * GC.DRONE_DATA * m.exp.all, suffix: k }], 
        tue: [{ label: t.inputs.build_spd, unit: (m) => 60 * GC.SPD_MIN * m.spd.sub, suffix: 'h' }, { label: t.inputs.pow_con, unit: (m) => 1000 * GC.POW_PT * m.con.sub, suffix: k }], 
        wed: [{ label: t.inputs.tec_spd, unit: (m) => 60 * GC.SPD_MIN * m.spd.sub, suffix: 'h' }, { label: t.inputs.pow_tec, unit: (m) => 1000 * GC.POW_PT * m.tec.sub, suffix: k }], 
        thu: [{ label: "🧩 " + t.labels.ur, unit: (m) => GC.UR_SHARD * m.exp.all, suffix: ea }, { label: t.inputs.sk, unit: (m) => GC.SKILL_MEDAL * m.exp.all, suffix: ea }], 
        fri: [{ label: t.inputs.trn_spd, unit: (m) => 60 * GC.SPD_MIN * m.spd.sub, suffix: 'h' }, { label: t.inputs.trn_cnt, unit: (m) => GC.TRP[parseInt(getVal('fri-lvl'))||8] * m.trn.sub, suffix: p }], 
        sat: [{ label: satLabel, unit: (m) => (targetType === 'general' ? GC.KIL_GEN[targetLvl] : GC.KIL_SPEC[targetLvl]) * m.kil.sub, suffix: p }] 
    }; 
}

function calculateDayScore(day) {
    let score = 0; const m = { exp: getM('t-expert'), rad: getM('t-radar'), spd: getM('t-spd'), rec: getM('t-rec'), con: getM('t-con'), tec: getM('t-tec'), trn: getM('t-trn'), kil: getM('t-kil') };
    score += fixF(parseFloat(getVal(day + '-dia')) * 30); 
    if(day === 'mon') { score += fixF(parseFloat(getVal('mon-radar'))*GC.RADAR*m.rad.sub); score += fixF((parseFloat(getVal('mon-stam'))*150 + parseFloat(getVal('mon-exp'))*1000000*GC.EXP_UNIT + parseFloat(getVal('mon-part'))*GC.DRONE_PART + parseFloat(getVal('mon-data'))*1000*GC.DRONE_DATA + parseFloat(getVal('mon-gather')) * parseFloat(getVal('mon-squads')||1) * GC.H_GATHER) * m.exp.all);
    } else if(day === 'tue') { score += fixF((parseFloat(getVal('tue-truck'))*GC.TRUCK + parseFloat(getVal('tue-sec'))*GC.SECRET + parseFloat(getVal('tue-surv'))*GC.SURV) * m.exp.all); score += fixF(parseFloat(getVal('tue-spd'))*60*GC.SPD_MIN*m.spd.sub); score += fixF(parseFloat(getVal('tue-pow'))*1000*GC.POW_PT*m.con.sub);
    } else if(day === 'wed') { score += fixF(parseFloat(getVal('wed-radar'))*GC.RADAR*m.rad.sub); score += fixF(parseFloat(getVal('wed-spd'))*60*GC.SPD_MIN*m.spd.sub); score += fixF(parseFloat(getVal('wed-pow'))*1000*GC.POW_PT*m.tec.sub); let droneTotal = 0; for(let i=1; i<=7; i++) droneTotal += (parseFloat(getVal('drone-b'+i)) || 0) * GC.BOXES[i]; score += fixF((parseFloat(getVal('wed-mdl'))*GC.HONOR_MEDAL + droneTotal) * m.exp.all);
    } else if(day === 'thu') { score += fixF(parseFloat(getVal('thu-tkt'))*GC.RECRUIT*m.rec.sub); score += fixF((parseFloat(getVal('hero-ur'))*GC.UR_SHARD + parseFloat(getVal('hero-ssr'))*GC.SSR_SHARD + parseFloat(getVal('hero-sr'))*GC.SR_SHARD) * m.exp.all); score += fixF((parseFloat(getVal('thu-sk'))*GC.SKILL_MEDAL + parseFloat(getVal('thu-exp'))*1000000*GC.EXP_UNIT) * m.exp.all);
    } else if(day === 'fri') { score += fixF(parseFloat(getVal('fri-radar'))*GC.RADAR*m.rad.sub); score += fixF((parseFloat(getVal('fri-spd-con')) + parseFloat(getVal('fri-spd-tec')) + parseFloat(getVal('fri-spd-trn'))) * 60 * GC.SPD_MIN * m.spd.sub); score += fixF(parseFloat(getVal('fri-pow-con'))*1000*GC.POW_PT*m.con.sub); score += fixF(parseFloat(getVal('fri-pow-tec'))*1000*GC.POW_PT*m.tec.sub); score += fixF(parseFloat(getVal('fri-count'))*GC.TRP[parseInt(getVal('fri-lvl'))||8]*m.trn.sub);
    } else if(day === 'sat') { score += fixF((parseFloat(getVal('sat-truck'))*GC.TRUCK + parseFloat(getVal('sat-sec'))*GC.SECRET + parseFloat(getVal('sat-dth'))*GC.KIL_GEN[parseInt(getVal('sat-alvl'))||8]) * m.exp.all); score += fixF(parseFloat(getVal('sat-spd-all'))*60*GC.SPD_MIN*m.spd.sub); let kScore = getVal('sat-target') === 'general' ? GC.KIL_GEN[parseInt(getVal('sat-elvl'))||8] : GC.KIL_SPEC[parseInt(getVal('sat-elvl'))||8]; score += fixF(parseFloat(getVal('sat-kill'))*kScore*m.kil.sub); }
    return score;
}

export function saveAllData() { 
    const inputs = document.querySelectorAll('input[type="number"]'); 
    inputs.forEach(input => { if(input.id && input.id !== 'inner-ratio' && !input.id.includes('m5') && !input.id.includes('h1') && !input.id.startsWith('qi-') && !input.id.startsWith('skill-')) { Store.set(input.id, input.value, false); } }); 
    Store.debouncedSave(); 
}

export function updateRecommendBox(rem, t, day) {
    try {
        const lang = Store.getState('lang');
        const customRatio = Store.getState('customRatio');
        const targetScore = Store.getState('targetScore');
        const recBox = document.getElementById('recommend-box'); 
        const dayName = t.days[['mon','tue','wed','thu','fri','sat'].indexOf(day)];
        
        if(!recBox) return;

        if(rem <= 0) { 
            recBox.innerHTML = `<div class="recommend-card" style="background:var(--success); border-radius:24px; text-align:center; font-weight:800; color:white; border:none; box-shadow:0 10px 30px rgba(52, 199, 89, 0.2);">✅ [${dayName}] ${t.rec.success}</div>`; 
            return;
        }

        const m_calc = { exp: getM('t-expert'), spd: getM('t-spd'), rad: getM('t-radar'), con: getM('t-con'), tec: getM('t-tec'), trn: getM('t-trn'), kil: getM('t-kil') };
        const items = getRecommendMap(t)[day]; 
        const formatRecVal = (v, label) => { 
            if (label.includes('스킬 훈장') || label.includes('Skill Medal')) return (v / 1000).toLocaleString('ko-KR', { maximumFractionDigits: 1 }) + 'k'; 
            return v.toLocaleString(); 
        };
        let targetLabel = targetScore === 3600000 ? "8상" : (targetScore === 7200000 ? "9상" : "6상");
        const targetText = lang === 'en' ? targetLabel.replace('상', ' Boxes') : targetLabel;

        // 1. 항목이 2개인 경우 (슬라이더 표시)
        if (items && items.length === 2) {
            const v1 = items[0].unit(m_calc); const v2 = items[1].unit(m_calc);
            const leftRatio = (100 - customRatio) / 100; const rightRatio = customRatio / 100;
            const val1 = formatRecVal(Math.ceil((rem * leftRatio)/v1), items[0].label); 
            const val2 = formatRecVal(Math.ceil((rem * rightRatio)/v2), items[1].label);
            
            const existingSlider = document.getElementById('inner-ratio'); 
            const renderedDay = recBox.getAttribute('data-rendered-day'); 
            const renderedLang = recBox.getAttribute('data-rendered-lang'); 

            if (existingSlider && renderedDay === day && renderedLang === lang) { 
                document.getElementById('rec-val-1').innerText = val1 + items[0].suffix; 
                document.getElementById('rec-val-2').innerText = val2 + items[1].suffix; 
            } else {
                recBox.setAttribute('data-rendered-day', day); 
                recBox.setAttribute('data-rendered-lang', lang);
                recBox.removeAttribute('data-rendered-label');
                recBox.innerHTML = `
                    <div class="recommend-card">
                        <div class="rec-title">💡 [${dayName}] ${targetText} ${t.rec.guide_title}</div>
                        <div class="rec-desc">${t.rec.desc}</div>
                        <div class="rec-slider-container">
                            <div class="rec-slider-item">
                                <span class="rec-slider-label">${items[0].label}</span>
                                <span class="rec-slider-val" id="rec-val-1">${val1}${items[0].suffix}</span>
                            </div>
                            <input type="range" id="inner-ratio" min="0" max="100" value="${customRatio}" step="1" class="modern-slider" data-action="updateRatio">
                            <div class="rec-slider-item">
                                <span class="rec-slider-label">${items[1].label}</span>
                                <span class="rec-slider-val" id="rec-val-2">${val2}${items[1].suffix}</span>
                            </div>
                        </div>
                    </div>`;
            }
        } 
        // 2. 항목이 1개인 경우 (중앙 정렬 표시 - 토요일 등)
        else if (items && items.length === 1) {
            const v1 = items[0].unit(m_calc); 
            const val1 = formatRecVal(Math.ceil(rem / v1), items[0].label);
            const currentLabel = items[0].label;
            const renderedDay = recBox.getAttribute('data-rendered-day'); 
            const renderedLang = recBox.getAttribute('data-rendered-lang'); 
            const renderedLabel = recBox.getAttribute('data-rendered-label');

            if (document.getElementById('rec-val-single') && renderedDay === day && renderedLang === lang && renderedLabel === currentLabel) { 
                document.getElementById('rec-val-single').innerText = val1 + items[0].suffix; 
            } else {
                recBox.setAttribute('data-rendered-day', day); 
                recBox.setAttribute('data-rendered-lang', lang); 
                recBox.setAttribute('data-rendered-label', currentLabel);
                recBox.innerHTML = `
                    <div class="recommend-card" style="text-align: center;">
                        <div class="rec-title">💡 [${dayName}] ${targetText} ${t.rec.guide_title}</div>
                        <div class="rec-desc" style="margin-left: auto; margin-right: auto;">${t.rec.single_desc}</div>
                        <div class="rec-single-item" style="display: block; padding: 10px 0;">
                            <div class="rec-slider-label" style="margin-bottom: 8px; font-size: 0.9rem;">${currentLabel}</div>
                            <div class="rec-slider-val" id="rec-val-single" style="font-size: 1.8rem; font-weight: 900; color: var(--primary);">
                                ${val1}${items[0].suffix}
                            </div>
                        </div>
                    </div>`;
            }
        }
    } catch(e) { console.error(e); }
}
