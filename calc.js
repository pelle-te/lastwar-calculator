window.currentLang = 'ko';
window.currentDay = 'mon';
window.targetScore = 7200000;
window.activeSpdId = '';
window.customRatio = 50;
window.stepInterval = null; 
window.autoSaveTimer = null;

const i18n = {
    ko: {
        nav: { calc: "📊 계산기", board: "💡 정보 공유" },
        targets: { t6: "6상", t8: "8상", t9: "9상" },
        fixed: "일일 고정 획득량", reset: "초기화",
        result: { score: "SCORE", box: "BOX", remain: "남은 점수" },
        modal: { tech: "연맹 테크 설정", spd: "가속 시간 계산", drone: "드론 파츠 상자", hero: "영웅 조각", btn_close: "닫기", btn_apply: "적용", btn_cancel: "취소", btn_open: "입력하기", btn_confirm: "확인", total: "총", weekly: "이번 주 대결 리포트 📈" },
        units: { day: "일", hour: "시", min: "분" },
        expert: "🏆 대결 전문가", radar: "📡 추당-레이더", spd: "⏱️ 추당-가속", tech_rec: "🎫 추당-모집", con: "🏰 추당-건설", tec: "🔬 추당-테크", trn: "⚔️ 추당-훈련", kil: "🔥 추당-적처치",
        days: ["월", "화", "수", "목", "금", "토"],
        success: "🎉 목표 달성! 완벽합니다!",
        labels: { m5: "5분", m15: "15분", h1: "1시간", h3: "3시간", h8: "8시간", ur: "UR 조각", ssr: "SSR 조각", sr: "SR 조각" },
        inputs: { squads: "🚜 채집 부대 수", squads_unit: "부대", gather: "⏱️ 시간당 채집(h)", dia: "💎 다이아 구매", radar_task: "📡 레이더 임무", stam: "⚡ 체력 소모", exp: "⭐ 영웅 경험치(1M)", part: "⚙️ 드론 부품", data: "💾 드론 데이터(1k)", truck: "🚚 UR 화물차", sec: "🕵️ UR 은밀 임무", surv: "🎫 생존자 모집", build_spd: "⏱️ 건설 가속(h)", pow_con: "🏰 건물 전투력(1k)", tec_spd: "⏱️ 테크 가속(h)", pow_tec: "🔬 테크 전투력(1k)", medal: "🏅 명예 훈장 소모", tkt: "🎫 영웅 모집", sk: "🏅 스킬 훈장", trn_spd: "⏱️ 훈련 가속(h)", trn_cnt: "⚔️ 훈련 수", trn_lvl: "🎯 훈련 레벨", kill_spd: "⏱️ 모든 가속(h)", kill_target: "⚔️ 처치 대상", kill_lvl: "🎯 처치 레벨", kill_cnt: "🔥 처치 수", dth_lvl: "💀 전사 레벨", dth_cnt: "🩸 전사 수", target_spec: "특정 매칭 연맹", target_gen: "일반 적군" },
        rec: { success: "목표를 넉넉하게 달성했습니다! 다음을 위해 자원을 아끼세요.", guide_title: "달성 가이드", desc: "남은 점수를 채우기 위해 두 자원의 비율을 조절해보세요.", count: "개", target_goal: "목표" }
    },
    en: {
        nav: { calc: "📊 Calc", board: "💡 Info Share" },
        targets: { t6: "6 Boxes", t8: "8 Boxes", t9: "9 Boxes" },
        fixed: "Daily Fixed Income", reset: "Reset",
        result: { score: "SCORE", box: "BOX", remain: "Remaining" },
        modal: { tech: "Alliance Tech", spd: "Speedup Calc", drone: "Drone Box", hero: "Hero Shards", btn_close: "Close", btn_apply: "Apply", btn_cancel: "Cancel", btn_open: "Input", btn_confirm: "Confirm", total: "Total", weekly: "Weekly Report 📈" },
        units: { day: "d", hour: "h", min: "m" },
        expert: "🏆 VS Expert", radar: "📡 Radar", spd: "⏱️ Speedup", tech_rec: "🎫 Recruit Bonus", con: "🏰 Build", tec: "🔬 Tech", trn: "⚔️ Train", kil: "🔥 Kill",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        success: "🎉 Target Achieved!",
        labels: { m5: "5m", m15: "15m", h1: "1h", h3: "3h", h8: "8h", ur: "UR Shard", ssr: "SSR Shard", sr: "SR Shard" },
        inputs: { squads: "🚜 Gathering Squads", squads_unit: "", gather: "⏱️ Gather (h)", dia: "💎 Buy Diamonds", radar_task: "📡 Radar Tasks", stam: "⚡ Consume Stamina", exp: "⭐ Hero EXP (1M)", part: "⚙️ Drone Parts", data: "💾 Drone Data (1k)", truck: "🚚 UR Truck", sec: "🕵️ UR Secret Task", surv: "🎫 Recruit Survivors", build_spd: "⏱️ Build Speedup (h)", pow_con: "🏰 Build Power (1k)", tec_spd: "⏱️ Tech Speedup (h)", pow_tec: "🔬 Tech Power (1k)", medal: "🏅 Honor Medal", tkt: "🎫 Hero Ticket", sk: "🏅 Skill Medal", trn_spd: "⏱️ Train Speedup (h)", trn_cnt: "⚔️ Train Troops", trn_lvl: "🎯 Train Level", kill_spd: "⏱️ All Speedups (h)", kill_target: "⚔️ Kill Target", kill_lvl: "🎯 Kill Level", kill_cnt: "🔥 Kill Count", dth_lvl: "💀 Death Level", dth_cnt: "🩸 Death Count", target_spec: "Matched Alliance", target_gen: "General Enemy" },
        rec: { success: "Target achieved! Save your resources.", guide_title: "Guide", desc: "Adjust the slider to distribute resources.", count: "", target_goal: "Target" }
    }
};

const BASE = { 
    radar: 10000, truck: 100000, secret: 75000, surv: 1500, spd_min: 50, pow_pt: 10, h_gather: 9523.5, 
    drone_part: 2500, drone_data: 3, honor_medal: 300, recruit: 1500, 
    ur_shard: 10000, ssr_shard: 3500, sr_shard: 1000, 
    skill_medal: 10, exp_unit: 1.0/660, 
    boxes: [0, 1100, 3300, 10000, 30000, 90000, 270000, 810000], 
    trp: [0, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110], 
    kil_spec: [0, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55], 
    kil_gen: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] 
};

// 소수점 보존 + JS 부동소수점 에러 방지용 헬퍼 함수 (소수점 첫째자리까지만 허용)
const fixF = v => Math.round((v || 0) * 10) / 10;

function getMedalsFromScore(score) {
    if (score >= 7200000) return 1200;
    if (score >= 3600000) return 800;
    if (score >= 2300000) return 400;
    return 0;
}

window.customAlert = function(msg) {
    document.getElementById('dialogTitle').innerText = "알림";
    document.getElementById('dialogMsg').innerText = msg;
    document.getElementById('dialogBtnCancel').style.display = 'none';
    const confirmBtn = document.getElementById('dialogBtnConfirm');
    confirmBtn.innerText = "확인";
    confirmBtn.onclick = () => document.getElementById('customDialog').classList.remove('active');
    document.getElementById('customDialog').classList.add('active');
};
window.customConfirm = function(msg, onConfirm) {
    document.getElementById('dialogTitle').innerText = "확인 필요";
    document.getElementById('dialogMsg').innerText = msg;
    document.getElementById('dialogBtnCancel').style.display = 'block';
    document.getElementById('dialogBtnCancel').onclick = () => document.getElementById('customDialog').classList.remove('active');
    const confirmBtn = document.getElementById('dialogBtnConfirm');
    confirmBtn.innerText = "확인";
    confirmBtn.onclick = () => { document.getElementById('customDialog').classList.remove('active'); onConfirm(); };
    document.getElementById('customDialog').classList.add('active');
};

window.openSelectModal = function(id, min, max, prefix, suffix, currentVal) {
    const titleEl = document.getElementById('sheetTitle');
    const optionsContainer = document.getElementById('sheetOptions');
    titleEl.innerText = "선택해주세요";
    let html = '';
    for(let i=min; i<=max; i++) {
        const label = `${prefix}${i}${suffix}`;
        html += `<button class="sheet-opt-btn" onclick="setSelectVal('${id}', '${i}', '${label}')" style="${i == currentVal ? 'color:var(--primary);' : ''}">${label}</button>`;
    }
    optionsContainer.innerHTML = html;
    document.getElementById('customSelectModal').classList.add('active');
};
window.closeSelectModal = function() { document.getElementById('customSelectModal').classList.remove('active'); };
window.setSelectVal = function(id, val, labelText) {
    const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}');
    data[id] = val;
    localStorage.setItem('lastwar_data', JSON.stringify(data));
    const btn = document.getElementById(`${id}-btn-text`);
    if(btn) btn.innerText = labelText;
    closeSelectModal();
    updateAll();
};
function createCustomSelectBtn(id, min, max, prefix, suffix, currentVal) {
    return `<button class="custom-select-btn" onclick="openSelectModal('${id}', ${min}, ${max}, '${prefix}', '${suffix}', ${currentVal})">
                <span id="${id}-btn-text">${prefix}${currentVal}${suffix}</span>
                <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>`;
}

window.stepVal = function(id, delta) {
    const el = document.getElementById(id);
    if(el) {
        let val = parseFloat(el.value) || 0;
        val = Math.max(0, val + delta); 
        el.value = val;
        updateAll();
    }
};

let stepSpeed = 150;
window.startStep = function(e, id, delta) {
    if (e) { if (e.cancelable) e.preventDefault(); if (e.stopPropagation) e.stopPropagation(); }
    stepVal(id, delta); 
    stepSpeed = 150; let count = 0;
    if(window.stepInterval) clearTimeout(window.stepInterval);
    const run = () => {
        stepVal(id, delta); count++;
        if(count > 5) stepSpeed = 50; if(count > 15) stepSpeed = 15; 
        window.stepInterval = setTimeout(run, stepSpeed);
    };
    window.stepInterval = setTimeout(run, stepSpeed);
};
window.stopStep = function() { if(window.stepInterval) clearTimeout(window.stepInterval); };
window.addEventListener('mouseup', window.stopStep);
window.addEventListener('touchend', window.stopStep);

function createStepper(id, value) {
    return `<div class="stepper-container" style="-webkit-user-select: none; user-select: none; -webkit-touch-callout: none;">
              <button class="stepper-btn" style="-webkit-touch-callout: none;" oncontextmenu="return false;" onselectstart="return false;" onmousedown="startStep(event, '${id}', -1)" ontouchstart="startStep(event, '${id}', -1)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" style="pointer-events: none;"><path d="M5 12h14"/></svg>
              </button>
              <input type="number" id="${id}" class="compact-input" min="0" value="${value}" oninput="updateAll()">
              <button class="stepper-btn" style="-webkit-touch-callout: none;" oncontextmenu="return false;" onselectstart="return false;" onmousedown="startStep(event, '${id}', 1)" ontouchstart="startStep(event, '${id}', 1)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" style="pointer-events: none;"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>`;
}

window.onclick = function(event) { if (event.target.classList.contains('modal')) { event.target.classList.remove('active'); if(event.target.id === 'techModal') updateAll(); } };
document.addEventListener('keydown', function(e) { if (e.target && e.target.type === 'number') { if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === '.') e.preventDefault(); } });
document.addEventListener('input', function(e) { if (e.target && e.target.type === 'number' && e.target.value < 0) e.target.value = 0; });

function getVal(cid) { const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}'); return data[cid] !== undefined ? data[cid] : (cid.includes('squads') ? "1" : (cid.includes('lvl') ? "8" : "0")); }

function renderDroneInputs() { 
    const c = document.getElementById('drone-inputs-container'); if(!c) return; let h = ''; 
    for(let i=1; i<=7; i++) { h += `<div class="tech-item"><label>Lv.${i}</label>${createStepper('drone-b'+i, getVal('drone-b'+i))}</div>`; } 
    c.innerHTML = h; 
}
function renderHeroInputs() {
    const c = document.getElementById('hero-inputs-container'); if(!c) return;
    const t = i18n[window.currentLang].labels;
    c.innerHTML = `<div class="tech-item"><label>${t.ur}</label>${createStepper('hero-ur', getVal('hero-ur'))}</div><div class="tech-item"><label>${t.ssr}</label>${createStepper('hero-ssr', getVal('hero-ssr'))}</div><div class="tech-item"><label>${t.sr}</label>${createStepper('hero-sr', getVal('hero-sr'))}</div>`;
}
function renderSpdStepper() {
    const c = document.getElementById('spd-stepper-container'); if(!c) return;
    const t = i18n[window.currentLang].labels;
    const ids = ['m5','m15','h1','h3','h8']; const labels = [t.m5, t.m15, t.h1, t.h3, t.h8];
    const savedSpd = window.getSpdData(window.activeSpdId); let h = '';
    ids.forEach((id, idx) => { h += `<div class="tech-item"><label>${labels[idx]}</label>${createStepper(id, savedSpd[id] || 0)}</div>`; });
    c.innerHTML = h;
}

window.changeLang = function(lang) { window.currentLang = lang; document.getElementById('lang-ko').classList.toggle('active', lang === 'ko'); document.getElementById('lang-en').classList.toggle('active', lang === 'en'); const recBox = document.getElementById('recommend-box'); if(recBox) { recBox.removeAttribute('data-rendered-day'); recBox.removeAttribute('data-rendered-lang'); } initCalc(); };
window.setTarget = function(s) { window.targetScore = s; document.querySelectorAll('.target-btn').forEach(b => b.classList.remove('active')); document.getElementById('target-' + s)?.classList.add('active'); updateAll(); };
window.switchTab = function(day) { window.currentDay = day; document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active')); document.getElementById('btn-' + day)?.classList.add('active'); renderInputs(); updateAll(); };
window.setSatTarget = function(val) { const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}'); data['sat-target'] = val; localStorage.setItem('lastwar_data', JSON.stringify(data)); renderInputs(); updateAll(); };

window.setFixedValues = function() {
    const msg = window.currentLang === 'ko' ? "매일 기본적으로 얻는 고정 획득량을 일괄 적용하시겠습니까?" : "Apply daily fixed settings?";
    customConfirm(msg, () => {
        const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}');
        data['mon-squads'] = "2"; data['mon-gather'] = "24";
        ['mon','tue','wed','thu','fri','sat'].forEach(d => { data[`${d}-radar`] = "82"; if(d === 'tue' || d === 'sat') { data[`${d}-truck`] = "4"; data[`${d}-sec`] = "7"; } });
        localStorage.setItem('lastwar_data', JSON.stringify(data)); renderInputs(); updateAll();
    });
};

window.resetDayData = function() {
    const msg = window.currentLang === 'ko' ? "현재 요일의 입력값을 0으로 초기화하시겠습니까?" : "Reset data for this day?";
    customConfirm(msg, () => {
        const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}'); const spdData = JSON.parse(localStorage.getItem('lastwar_spd_data') || '{}'); const prefix = window.currentDay + '-';
        Object.keys(data).forEach(key => { if(key.startsWith(prefix)) data[key] = key.includes('squads') ? "1" : "0"; });
        Object.keys(spdData).forEach(key => { if(key.startsWith(prefix)) delete spdData[key]; });
        if(window.currentDay === 'wed') { for(let i=1; i<=7; i++) { const el = document.getElementById('drone-b'+i); if(el) el.value = 0; } }
        if(window.currentDay === 'thu') { ['hero-ur','hero-ssr','hero-sr'].forEach(id => { const el = document.getElementById(id); if (el) el.value = 0; }); }
        localStorage.setItem('lastwar_data', JSON.stringify(data)); localStorage.setItem('lastwar_spd_data', JSON.stringify(spdData)); renderInputs(); updateAll();
    });
};

window.getSpdData = function(fullId) { const data = JSON.parse(localStorage.getItem('lastwar_spd_data') || '{}'); return data[fullId] || { m5:0, m15:0, h1:0, h3:0, h8:0 }; };
window.openSpdModal = (cid, label) => { window.activeSpdId = `${window.currentDay}-${cid}`; const titleEl = document.getElementById('spd-title'); if(titleEl) titleEl.innerText = label; renderSpdStepper(); window.calcSpdTotal(); document.getElementById('spdModal')?.classList.add('active'); };
window.openTechModal = () => document.getElementById('techModal').classList.add('active');
window.closeTechModal = () => { document.getElementById('techModal').classList.remove('active'); updateAll(); };
window.closeSpdModal = () => document.getElementById('spdModal').classList.remove('active');
window.openDroneModal = () => document.getElementById('droneModal').classList.add('active');
window.closeDroneModal = () => document.getElementById('droneModal').classList.remove('active');
window.openHeroModal = () => document.getElementById('heroModal').classList.add('active');
window.closeHeroModal = () => document.getElementById('heroModal').classList.remove('active');

function val(id) { if (['m5','m15','h1','h3','h8'].includes(id)) return parseFloat(document.getElementById(id)?.value) || 0; let el = document.getElementById(id); return el ? parseFloat(el.value) || 0 : 0; }

// ✅ 유저 요청: 다른 테크들은 전부 기존(레벨당 5%)으로 롤백하되, 레이더만 6레벨에 35%가 되도록 개별 역산 적용
function getM(subId) { 
    const expertLv = parseInt(getVal('t-expert')) || 0;
    const subLv = parseInt(getVal(subId)) || 0;
    const eBonus = expertLv * 0.05; 
    let sBonus = 0;

    if (subId === 't-radar') {
        // 레이더 전용 보너스: 6레벨에 35%로 맞춰 23,500점이 떨어지게 함
        const radarCurve = [0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.35, 0.45, 0.60, 0.80, 1.00];
        sBonus = radarCurve[subLv] || (subLv * 0.05);
    } else if (subId !== 't-expert') {
        // 나머지 테크들은 기존의 레벨당 5% 선형 합산으로 완전 롤백
        sBonus = subLv * 0.05; 
    }
    
    return { 
        all: 1 + eBonus,
        sub: 1 + eBonus + sBonus
    }; 
}

window.calcSpdTotal = function() {
    const t = i18n[window.currentLang];
    const m5 = parseFloat(document.getElementById('m5')?.value) || 0; const m15 = parseFloat(document.getElementById('m15')?.value) || 0; const h1 = parseFloat(document.getElementById('h1')?.value) || 0; const h3 = parseFloat(document.getElementById('h3')?.value) || 0; const h8 = parseFloat(document.getElementById('h8')?.value) || 0;
    const totalMin = (m5 * 5) + (m15 * 15) + (h1 * 60) + (h3 * 180) + (h8 * 480);
    const d = Math.floor(totalMin / 1440); const h = Math.floor((totalMin % 1440) / 60); const m = Math.round(totalMin % 60);
    const resText = document.getElementById('spd-result-text');
    if(resText) { resText.innerText = `${t.modal.total}: ${d}${t.units.day} ${h}${t.units.hour} ${m}${t.units.min}`; } return totalMin;
};

window.applySpd = function() {
    const totalMin = window.calcSpdTotal(); const targetInput = document.getElementById(window.activeSpdId); 
    if(targetInput) { targetInput.value = (totalMin / 60).toFixed(2); const spdData = JSON.parse(localStorage.getItem('lastwar_spd_data') || '{}'); spdData[window.activeSpdId] = { m5: document.getElementById('m5').value, m15: document.getElementById('m15').value, h1: document.getElementById('h1').value, h3: document.getElementById('h3').value, h8: document.getElementById('h8').value }; localStorage.setItem('lastwar_spd_data', JSON.stringify(spdData)); updateAll(); }
    window.closeSpdModal();
};

function getRecommendMap(t) { return { mon: [{ label: t.inputs.part, unit: (m) => BASE.drone_part * m.exp.all }, { label: t.inputs.data, unit: (m) => 1000 * BASE.drone_data * m.exp.all }], tue: [{ label: t.inputs.build_spd, unit: (m) => 60 * BASE.spd_min * m.spd.sub }, { label: t.inputs.pow_con, unit: (m) => 1000 * BASE.pow_pt * m.con.sub }], wed: [{ label: t.inputs.tec_spd, unit: (m) => 60 * BASE.spd_min * m.spd.sub }, { label: t.inputs.pow_tec, unit: (m) => 1000 * BASE.pow_pt * m.tec.sub }], thu: [{ label: "🧩 " + t.labels.ur, unit: (m) => BASE.ur_shard * m.exp.all }, { label: t.inputs.sk, unit: (m) => BASE.skill_medal * m.exp.all }], fri: [{ label: t.inputs.trn_spd, unit: (m) => 60 * BASE.spd_min * m.spd.sub }, { label: t.inputs.trn_cnt, unit: (m) => BASE.trp[parseInt(getVal('fri-lvl'))||8] * m.trn.sub }], sat: [{ label: t.inputs.kill_spd, unit: (m) => 60 * BASE.spd_min * m.spd.sub }, { label: t.inputs.kill_cnt, unit: (m) => (getVal('sat-target') === 'general' ? BASE.kil_gen[parseInt(getVal('sat-elvl'))||8] : BASE.kil_spec[parseInt(getVal('sat-elvl'))||8]) * m.kil.sub }] }; }

function calculateDayScore(day) {
    let score = 0; 
    const m = { 
        exp: getM('t-expert'), rad: getM('t-radar'), spd: getM('t-spd'), 
        rec: getM('t-rec'), con: getM('t-con'), tec: getM('t-tec'), 
        trn: getM('t-trn'), kil: getM('t-kil') 
    };

    score += fixF(parseFloat(getVal(day + '-dia')) * 30); 

    if(day === 'mon') { 
        score += fixF(parseFloat(getVal('mon-radar'))*BASE.radar*m.rad.sub); 
        score += fixF((parseFloat(getVal('mon-stam'))*150 + parseFloat(getVal('mon-exp'))*1000000*BASE.exp_unit + parseFloat(getVal('mon-part'))*BASE.drone_part + parseFloat(getVal('mon-data'))*1000*BASE.drone_data + parseFloat(getVal('mon-gather')) * parseFloat(getVal('mon-squads')||1) * BASE.h_gather) * m.exp.all);
    } else if(day === 'tue') { 
        score += fixF((parseFloat(getVal('tue-truck'))*BASE.truck + parseFloat(getVal('tue-sec'))*BASE.secret + parseFloat(getVal('tue-surv'))*BASE.surv) * m.exp.all);
        score += fixF(parseFloat(getVal('tue-spd'))*60*BASE.spd_min*m.spd.sub);
        score += fixF(parseFloat(getVal('tue-pow'))*1000*BASE.pow_pt*m.con.sub);
    } else if(day === 'wed') { 
        score += fixF(parseFloat(getVal('wed-radar'))*BASE.radar*m.rad.sub);
        score += fixF(parseFloat(getVal('wed-spd'))*60*BASE.spd_min*m.spd.sub);
        score += fixF(parseFloat(getVal('wed-pow'))*1000*BASE.pow_pt*m.tec.sub);
        let droneTotal = 0; for(let i=1; i<=7; i++) droneTotal += (parseFloat(getVal('drone-b'+i)) || 0) * BASE.boxes[i];
        score += fixF((parseFloat(getVal('wed-mdl'))*BASE.honor_medal + droneTotal) * m.exp.all);
    } else if(day === 'thu') { 
        score += fixF(parseFloat(getVal('thu-tkt'))*BASE.recruit*m.rec.sub);
        score += fixF((parseFloat(getVal('hero-ur'))*BASE.ur_shard + parseFloat(getVal('hero-ssr'))*BASE.ssr_shard + parseFloat(getVal('hero-sr'))*BASE.sr_shard) * m.exp.all);
        score += fixF((parseFloat(getVal('thu-sk'))*BASE.skill_medal + parseFloat(getVal('thu-exp'))*1000000*BASE.exp_unit) * m.exp.all);
    } else if(day === 'fri') { 
        score += fixF(parseFloat(getVal('fri-radar'))*BASE.radar*m.rad.sub);
        score += fixF((parseFloat(getVal('fri-spd-con')) + parseFloat(getVal('fri-spd-tec')) + parseFloat(getVal('fri-spd-trn'))) * 60 * BASE.spd_min * m.spd.sub);
        score += fixF(parseFloat(getVal('fri-pow-con'))*1000*BASE.pow_pt*m.con.sub);
        score += fixF(parseFloat(getVal('fri-pow-tec'))*1000*BASE.pow_pt*m.tec.sub);
        score += fixF(parseFloat(getVal('fri-count'))*BASE.trp[parseInt(getVal('fri-lvl'))||8]*m.trn.sub);
    } else if(day === 'sat') { 
        // 전사 수(Deaths)에 킬 점수표(kil_gen)를 적용하여 1/10으로 정상 계산
        score += fixF((parseFloat(getVal('sat-truck'))*BASE.truck + parseFloat(getVal('sat-sec'))*BASE.secret + parseFloat(getVal('sat-dth'))*BASE.kil_gen[parseInt(getVal('sat-alvl'))||8]) * m.exp.all);
        score += fixF(parseFloat(getVal('sat-spd-all'))*60*BASE.spd_min*m.spd.sub);
        let kScore = getVal('sat-target') === 'general' ? BASE.kil_gen[parseInt(getVal('sat-elvl'))||8] : BASE.kil_spec[parseInt(getVal('sat-elvl'))||8];
        score += fixF(parseFloat(getVal('sat-kill'))*kScore*m.kil.sub);
    }
    return score;
}

window.updateRatioText = function(val) { window.customRatio = parseInt(val); updateAll(); };

window.triggerAutoSave = function() {
    const statusEl = document.getElementById('auto-save-status');
    if(statusEl) statusEl.innerHTML = `<span class="icon" style="animation: pulse 1s infinite;">🔄</span><span class="label">저장 중</span>`;
    
    if(window.autoSaveTimer) clearTimeout(window.autoSaveTimer);
    window.autoSaveTimer = setTimeout(async () => {
        try {
            const data = localStorage.getItem('lastwar_data'); const spdData = localStorage.getItem('lastwar_spd_data');
            if (typeof db !== 'undefined' && myId) {
                await db.collection('user_sync').doc(myId).set({ basic: JSON.parse(data), speed: JSON.parse(spdData), updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
            }
            if(statusEl) statusEl.innerHTML = `<span class="icon">☁️</span><span class="label">저장됨</span>`;
        } catch(e) { console.error("Auto save failed", e); }
    }, 1500); 
};

window.updateAll = function() {
    const d = window.currentDay; const t = i18n[window.currentLang]; let totalScore = 0;
    ['mon','tue','wed','thu','fri','sat'].forEach(day => { const btn = document.getElementById(`btn-${day}`); if(btn) { if (calculateDayScore(day) >= window.targetScore) btn.classList.add('completed'); else btn.classList.remove('completed'); } });
    
    let m = { 
        rad: getM('t-radar'), spd: getM('t-spd'), rec: getM('t-rec'), 
        con: getM('t-con'), tec: getM('t-tec'), trn: getM('t-trn'), 
        kil: getM('t-kil'), exp: getM('t-expert') 
    };

    function setPt(id, pt) { 
        const rpt = fixF(pt); 
        const el = document.getElementById('pts-' + id); 
        if(el) el.innerText = '+' + rpt.toLocaleString('ko-KR', { maximumFractionDigits: 1 }) + ' pt'; 
        totalScore += rpt; 
    }

    setPt('dia', val(d+'-dia') * 30);

    if(d==='mon') { 
        setPt('radar', val('mon-radar')*BASE.radar*m.rad.sub);
        setPt('stam', val('mon-stam')*150*m.exp.all); setPt('exp', val('mon-exp')*1000000*BASE.exp_unit*m.exp.all);
        setPt('part', val('mon-part')*BASE.drone_part*m.exp.all); setPt('data', val('mon-data')*1000*BASE.drone_data*m.exp.all);
        setPt('gather', val('mon-gather') * parseFloat(getVal('mon-squads')||1) * BASE.h_gather * m.exp.all); 
    }
    else if(d==='tue') { 
        setPt('truck', val('tue-truck')*BASE.truck*m.exp.all); setPt('sec', val('tue-sec')*BASE.secret*m.exp.all);
        setPt('surv', val('tue-surv')*BASE.surv*m.exp.all); setPt('spd', val('tue-spd')*60*BASE.spd_min*m.spd.sub);
        setPt('pow', val('tue-pow')*1000*BASE.pow_pt*m.con.sub); 
    }
    else if(d==='wed') { 
        setPt('radar', val('wed-radar')*BASE.radar*m.rad.sub); setPt('spd', val('wed-spd')*60*BASE.spd_min*m.spd.sub);
        setPt('pow', val('wed-pow')*1000*BASE.pow_pt*m.tec.sub); setPt('mdl', val('wed-mdl')*BASE.honor_medal*m.exp.all);
        let droneTotal = 0; for(let i=1; i<=7; i++) droneTotal += val('drone-b'+i) * BASE.boxes[i]; setPt('drone-box', droneTotal * m.exp.all); 
    }
    else if(d==='thu') { 
        setPt('tkt', val('thu-tkt')*BASE.recruit*m.rec.sub);
        setPt('hero-shard', (val('hero-ur')*BASE.ur_shard + val('hero-ssr')*BASE.ssr_shard + val('hero-sr')*BASE.sr_shard) * m.exp.all);
        setPt('sk', val('thu-sk')*BASE.skill_medal*m.exp.all); setPt('exp', val('thu-exp')*1000000*BASE.exp_unit*m.exp.all); 
    }
    else if(d==='fri') { 
        setPt('radar', val('fri-radar')*BASE.radar*m.rad.sub);
        setPt('spd-con', val('fri-spd-con')*60*BASE.spd_min*m.spd.sub); setPt('spd-tec', val('fri-spd-tec')*60*BASE.spd_min*m.spd.sub);
        setPt('spd-trn', val('fri-spd-trn')*60*BASE.spd_min*m.spd.sub); setPt('pow-con', val('fri-pow-con')*1000*BASE.pow_pt*m.con.sub);
        setPt('pow-tec', val('fri-pow-tec')*1000*BASE.pow_pt*m.tec.sub); setPt('count', val('fri-count')*BASE.trp[parseInt(getVal('fri-lvl'))||8]*m.trn.sub); 
    }
    else if(d==='sat') { 
        setPt('truck', val('sat-truck')*BASE.truck*m.exp.all); setPt('sec', val('sat-sec')*BASE.secret*m.exp.all);
        setPt('spd-all', val('sat-spd-all')*60*BASE.spd_min*m.spd.sub);
        let kScore = getVal('sat-target') === 'general' ? BASE.kil_gen[parseInt(getVal('sat-elvl'))||8] : BASE.kil_spec[parseInt(getVal('sat-elvl'))||8];
        setPt('kill', val('sat-kill')*kScore*m.kil.sub); 
        // 여기서도 전사 수(Deaths)에 킬 점수표(kil_gen)를 적용
        setPt('dth', val('sat-dth')*BASE.kil_gen[parseInt(getVal('sat-alvl'))||8]*m.exp.all); 
    }

    saveAllData(); triggerAutoSave(); 
    
    totalScore = fixF(totalScore);
    const pct = Math.min(100, (totalScore / window.targetScore) * 100);
    document.getElementById('score').innerText = totalScore.toLocaleString('ko-KR', { maximumFractionDigits: 1 });
    
    const earnedMedals = getMedalsFromScore(totalScore);
    const medalEl = document.getElementById('medal-status');
    if(medalEl) { medalEl.innerText = earnedMedals.toLocaleString(); medalEl.style.color = earnedMedals >= 1200 ? '#d97706' : (earnedMedals >= 800 ? 'var(--primary)' : 'var(--success)'); }

    const rem = fixF(window.targetScore - totalScore);
    const recBox = document.getElementById('recommend-box'); const dayName = t.days[['mon','tue','wed','thu','fri','sat'].indexOf(window.currentDay)];

    if(recBox) {
        if(rem <= 0) { recBox.innerHTML = `<div class="recommend-card" style="background:var(--success); border-radius:24px; text-align:center; font-weight:800;">✅ [${dayName}] ${t.rec.success}</div>`; }
        else {
            const m_calc = { exp: getM('t-expert'), spd: getM('t-spd'), rad: getM('t-radar'), con: getM('t-con'), tec: getM('t-tec'), trn: getM('t-trn'), kil: getM('t-kil') };
            const items = getRecommendMap(t)[window.currentDay]; 
            if (items) {
                const v1 = items[0].unit(m_calc); const v2 = items[1].unit(m_calc);
                const leftRatio = (100 - window.customRatio) / 100; const rightRatio = window.customRatio / 100;
                const val1 = Math.ceil((rem * leftRatio)/v1).toLocaleString(); const val2 = Math.ceil((rem * rightRatio)/v2).toLocaleString();
                const existingSlider = document.getElementById('inner-ratio');
                const renderedDay = recBox.getAttribute('data-rendered-day'); const renderedLang = recBox.getAttribute('data-rendered-lang'); 
                let targetLabel = window.targetScore === 3600000 ? "8상" : (window.targetScore === 7200000 ? "9상" : "6상");
                const targetText = window.currentLang === 'en' ? targetLabel.replace('상', ' Boxes') : targetLabel;

                if (existingSlider && renderedDay === window.currentDay && renderedLang === window.currentLang) {
                    document.getElementById('rec-val-1').innerText = val1 + t.rec.count; document.getElementById('rec-val-2').innerText = val2 + t.rec.count;
                } else {
                    recBox.setAttribute('data-rendered-day', window.currentDay); recBox.setAttribute('data-rendered-lang', window.currentLang);
                    recBox.innerHTML = `<div class="recommend-card"><div class="rec-title">💡 [${dayName}] ${targetText} ${t.rec.guide_title}</div><div class="rec-desc">${t.rec.desc}</div><div class="rec-slider-container"><div class="rec-slider-item"><span class="rec-slider-label">${items[0].label}</span><span class="rec-slider-val" id="rec-val-1">${val1}${t.rec.count}</span></div><input type="range" id="inner-ratio" min="0" max="100" value="${window.customRatio}" step="1" class="modern-slider" oninput="window.updateRatioText(this.value)"><div class="rec-slider-item"><span class="rec-slider-label">${items[1].label}</span><span class="rec-slider-val" id="rec-val-2">${val2}${t.rec.count}</span></div></div></div>`;
                }
            }
        }
    }
    
    const barEl = document.getElementById('bar');
    if(barEl) { barEl.style.width = pct + '%'; if (pct >= 100) barEl.classList.add('completed'); else barEl.classList.remove('completed'); }
    if(document.getElementById('pct-text')) document.getElementById('pct-text').innerText = Math.floor(pct) + '%';
    if(document.getElementById('box-status')) document.getElementById('box-status').innerText = `${Math.min(9, Math.floor(totalScore / (window.targetScore / 9)))} / 9`;
    
    if(document.getElementById('diff')) document.getElementById('diff').innerText = rem > 0 ? `${t.result.remain}: ${rem.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}` : t.success;
};

window.showWeeklyReport = function() {
    const days = ['mon','tue','wed','thu','fri','sat']; const currentT = i18n[window.currentLang]; let html = `<div class="weekly-container">`; 
    let totalWeeklyScore = 0; let totalWeeklyMedals = 0;

    days.forEach((d, idx) => {
        const dayScore = fixF(calculateDayScore(d)); 
        totalWeeklyScore += dayScore;
        const medals = getMedalsFromScore(dayScore); totalWeeklyMedals += medals;
        
        let badgeHTML = '';
        if (dayScore >= 7200000) badgeHTML = `<span class="weekly-badge badge-9">9상 🎁</span>`;
        else if (dayScore >= 3600000) badgeHTML = `<span class="weekly-badge badge-8">8상 📦</span>`;
        else if (dayScore >= 2300000) badgeHTML = `<span class="weekly-badge badge-6">6상 📦</span>`;
        else badgeHTML = `<span class="weekly-badge badge-fail">미달</span>`;
        
        html += `<div class="weekly-row"><div class="weekly-row-top"><div class="weekly-day-group"><span class="weekly-day" style="color: var(--${d});">${currentT.days[idx]}</span>${badgeHTML}</div><span class="weekly-score">${dayScore.toLocaleString('ko-KR', { maximumFractionDigits: 1 })} <span>pt</span></span></div>${medals > 0 ? `<div class="weekly-row-bottom"><span>획득 훈장</span><span style="color:#d97706;">+${medals}개</span></div>` : ''}</div>`;
    });
    html += `<div class="weekly-total"><div class="weekly-total-row"><span>총 점수</span><span style="font-size:1.3rem;">${fixF(totalWeeklyScore).toLocaleString('ko-KR', { maximumFractionDigits: 1 })} pt</span></div><div class="weekly-total-row" style="color:#d97706; margin-top:5px; padding-top:10px; border-top:1px dashed rgba(0,0,0,0.1);"><span>총 획득 훈장</span><span style="font-size:1.3rem;">🏅 ${totalWeeklyMedals.toLocaleString()}개</span></div></div></div>`;
    document.getElementById('weekly-report-content').innerHTML = html; document.getElementById('weeklyModal').classList.add('active');
};

window.syncToCloud = async function() { customAlert("현재 클라우드 자동 저장이 켜져 있습니다. 값을 변경하면 1.5초 뒤 자동으로 안전하게 저장됩니다!"); };
window.closeWeeklyModal = function() { document.getElementById('weeklyModal').classList.remove('active'); };
window.toggleDarkMode = function() { const body = document.body; if(body.classList.contains('light-theme')) { body.classList.replace('light-theme', 'dark-theme'); localStorage.setItem('theme', 'dark'); } else { body.classList.replace('dark-theme', 'light-theme'); localStorage.setItem('theme', 'light'); } };

window.openQuickInputModal = function() {
    const t = i18n[window.currentLang] || i18n['ko']; const container = document.getElementById('quick-input-container');
    const day = window.currentDay; let html = '';
    
    const config = { 
        mon:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'stam',l:t.inputs.stam},{id:'exp',l:t.inputs.exp},{id:'part',l:t.inputs.part},{id:'data',l:t.inputs.data},{id:'gather',l:t.inputs.gather}], 
        tue:[{id:'dia',l:t.inputs.dia},{id:'truck',l:t.inputs.truck},{id:'sec',l:t.inputs.sec},{id:'surv',l:t.inputs.surv},{id:'spd',l:t.inputs.build_spd},{id:'pow',l:t.inputs.pow_con}], 
        wed:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'spd',l:t.inputs.tec_spd},{id:'pow',l:t.inputs.pow_tec},{id:'mdl',l:t.inputs.medal}], 
        thu:[{id:'dia',l:t.inputs.dia},{id:'tkt',l:t.inputs.tkt},{id:'exp',l:t.inputs.exp},{id:'sk',l:t.inputs.sk}], 
        fri:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'spd-con',l:t.inputs.build_spd},{id:'spd-tec',l:t.inputs.tec_spd},{id:'spd-trn',l:t.inputs.trn_spd},{id:'pow-con',l:t.inputs.pow_con},{id:'pow-tec',l:t.inputs.pow_tec},{id:'count',l:t.inputs.trn_cnt}], 
        sat:[{id:'dia',l:t.inputs.dia},{id:'truck',l:t.inputs.truck},{id:'sec',l:t.inputs.sec},{id:'spd-all',l:t.inputs.kill_spd},{id:'kill',l:t.inputs.kill_cnt},{id:'dth',l:t.inputs.dth_cnt}] 
    };
    let items = [...(config[day] || [])];
    
    if(day === 'wed') { for(let i=1; i<=7; i++) items.push({id: `drone-b${i}`, l: `드론 상자 Lv.${i}`, isDirect: true}); }
    if(day === 'thu') { items.push({id: 'hero-ur', l: t.labels.ur, isDirect: true}); items.push({id: 'hero-ssr', l: t.labels.ssr, isDirect: true}); items.push({id: 'hero-sr', l: t.labels.sr, isDirect: true}); }

    items.forEach(item => {
        const cid = item.isDirect ? item.id : `${day}-${item.id}`; const val = getVal(cid);
        const cleanLabel = item.l.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim();
        html += `<div class="quick-item"><label>${cleanLabel}</label><input type="number" id="qi-${cid}" class="quick-input-field" min="0" value="${val}" onfocus="this.select()"></div>`;
    });
    container.innerHTML = html; document.getElementById('quickInputModal').classList.add('active');
};

window.previewQuickScreenshot = function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('quick-img-tag').src = e.target.result;
            document.getElementById('quick-image-preview').style.display = 'block'; 
        }
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
    const inputs = document.querySelectorAll('.quick-input-field');
    const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}');
    inputs.forEach(input => {
        const cid = input.id.replace('qi-', ''); data[cid] = input.value || "0";
        const mainInput = document.getElementById(cid); if(mainInput) mainInput.value = data[cid];
    });
    localStorage.setItem('lastwar_data', JSON.stringify(data));
    updateAll(); closeQuickInputModal();
};

function renderInputs() {
    const t = i18n[window.currentLang] || i18n['ko']; const container = document.getElementById('input-container'); if(!container) return;
    const config = { mon:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'stam',l:t.inputs.stam},{id:'exp',l:t.inputs.exp},{id:'part',l:t.inputs.part},{id:'data',l:t.inputs.data}], tue:[{id:'dia',l:t.inputs.dia},{id:'truck',l:t.inputs.truck},{id:'sec',l:t.inputs.sec},{id:'surv',l:t.inputs.surv},{id:'spd',l:t.inputs.build_spd,isSpd:true},{id:'pow',l:t.inputs.pow_con}], wed:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'spd',l:t.inputs.tec_spd,isSpd:true},{id:'pow',l:t.inputs.pow_tec},{id:'mdl',l:t.inputs.medal}], thu:[{id:'dia',l:t.inputs.dia},{id:'tkt',l:t.inputs.tkt},{id:'exp',l:t.inputs.exp},{id:'sk',l:t.inputs.sk}], fri:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'spd-con',l:t.inputs.build_spd,isSpd:true},{id:'spd-tec',l:t.inputs.tec_spd,isSpd:true},{id:'spd-trn',l:t.inputs.trn_spd,isSpd:true},{id:'pow-con',l:t.inputs.pow_con},{id:'pow-tec',l:t.inputs.pow_tec}], sat:[{id:'dia',l:t.inputs.dia},{id:'truck',l:t.inputs.truck},{id:'sec',l:t.inputs.sec},{id:'spd-all',l:t.inputs.kill_spd,isSpd:true}] };
    let html = `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; flex-wrap:wrap; gap:10px;"><div class="section-title" style="margin:0;">📝 ${window.currentDay.toUpperCase()} INPUT</div><div style="display:flex; gap:6px;"><button onclick="openQuickInputModal()" class="btn-primary-small" style="background:#FFD60A; color:#000; box-shadow: 0 4px 10px rgba(255,214,10,0.3);">⚡ 쾌속</button><button onclick="setFixedValues()" class="btn-primary-small">${t.fixed}</button><button onclick="resetDayData()" class="btn-primary-small" style="background:var(--input-bg); color:var(--danger);">${t.reset}</button></div></div><div class="input-grid">`;

    if(window.currentDay === 'mon') { 
        html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.squads}</span></div>${createCustomSelectBtn('mon-squads', 1, 5, '', t.inputs.squads_unit, getVal('mon-squads')||1)}</div>
                 <div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.gather}</span><span class="item-score-tag" id="pts-gather">0</span></div>${createStepper('mon-gather', getVal('mon-gather'))}</div>`; 
    }
    if(window.currentDay === 'wed') { html += `<div class="input-group-compact full-mobile-item"><div class="input-header"><span class="input-label-small">📦 ${t.modal.drone}</span><span class="item-score-tag" id="pts-drone-box">0</span></div><button class="spd-btn-mini" onclick="openDroneModal()">${t.modal.btn_open}</button></div>`; }
    if(window.currentDay === 'thu') { html += `<div class="input-group-compact full-mobile-item"><div class="input-header"><span class="input-label-small">🧩 ${t.modal.hero}</span><span class="item-score-tag" id="pts-hero-shard">0</span></div><button class="spd-btn-mini" onclick="openHeroModal()">${t.modal.btn_open}</button></div>`; }

    (config[window.currentDay] || []).forEach(i => { 
        const cid = `${window.currentDay}-${i.id}`; 
        html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">${i.l}</span><span class="item-score-tag" id="pts-${i.id}">0</span></div>${createStepper(cid, getVal(cid))}${i.isSpd ? `<button class="spd-btn-mini" style="margin-top:10px;" onclick="openSpdModal('${i.id}','${i.l}')">${t.modal.btn_open}</button>` : ''}</div>`; 
    });

    if(window.currentDay === 'fri') { 
        html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.trn_lvl}</span></div>${createCustomSelectBtn('fri-lvl', 1, 10, 'Lv ', '', getVal('fri-lvl')||8)}</div>
                 <div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.trn_cnt}</span><span class="item-score-tag" id="pts-count">0</span></div>${createStepper('fri-count', getVal('fri-count'))}</div>`; 
    }
    if(window.currentDay === 'sat') { 
        const target = getVal('sat-target') || "special"; 
        html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.kill_target}</span></div>
                    <div class="target-selector two-cols"><button class="target-btn ${target=='special'?'active':''}" onclick="setSatTarget('special')">${t.inputs.target_spec}</button><button class="target-btn ${target=='general'?'active':''}" onclick="setSatTarget('general')">${t.inputs.target_gen}</button></div>
                 </div>
                 <div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.kill_lvl}</span></div>${createCustomSelectBtn('sat-elvl', 1, 10, 'Lv ', '', getVal('sat-elvl')||8)}</div>
                 <div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.kill_cnt}</span><span class="item-score-tag" id="pts-kill">0</span></div>${createStepper('sat-kill', getVal('sat-kill'))}</div>
                 <div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.dth_lvl}</span></div>${createCustomSelectBtn('sat-alvl', 1, 10, 'Lv ', '', getVal('sat-alvl')||8)}</div>
                 <div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.dth_cnt}</span><span class="item-score-tag" id="pts-dth">0</span></div>${createStepper('sat-dth', getVal('sat-dth'))}</div>`; 
    }
    html += `</div>`; container.innerHTML = html;
}

window.saveAllData = function() { const inputs = document.querySelectorAll('input[type="number"]'); const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}'); inputs.forEach(input => { if(input.id && input.id !== 'inner-ratio' && !input.id.includes('m5') && !input.id.includes('h1') && !input.id.startsWith('qi-')) data[input.id] = input.value; }); localStorage.setItem('lastwar_data', JSON.stringify(data)); };

function initCalc() {
    if (!localStorage.getItem('tech_init_v3')) { const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}'); data['t-expert'] = 20; data['t-radar'] = 6; data['t-spd'] = 6; data['t-rec'] = 6; data['t-con'] = 1; data['t-tec'] = 1; data['t-trn'] = 6; data['t-kil'] = 6; localStorage.setItem('lastwar_data', JSON.stringify(data)); localStorage.setItem('tech_init_v3', 'true'); }
    const t = i18n[window.currentLang]; const savedTheme = localStorage.getItem('theme') || 'light'; document.body.className = savedTheme + '-theme';
    const uiMap = { 'nav-calc': t.nav.calc, 'nav-board': t.nav.board, 'tech-title': `🔬 ${t.modal.tech.toUpperCase()}`, 'tech-open-btn': t.modal.btn_open, 'tech-modal-title': t.modal.tech, 'tech-confirm-btn': t.modal.btn_confirm, 'drone-modal-title': t.modal.drone, 'drone-confirm-btn': t.modal.btn_confirm, 'hero-modal-title': t.modal.hero, 'hero-confirm-btn': t.modal.btn_confirm, 'weekly-modal-title': t.modal.weekly, 'weekly-close-btn': t.modal.btn_close, 'spd-cancel-btn': t.modal.btn_cancel, 'spd-apply-btn': t.modal.btn_apply };
    Object.keys(uiMap).forEach(id => { const el = document.getElementById(id); if(el) el.innerText = uiMap[id]; });
    
    const techGrid = document.getElementById('tech-inputs');
    if(techGrid) { const techs = [ {id:'t-expert', l:t.expert, def: 20, max: 20}, {id:'t-radar', l:t.radar, def: 6, max: 10}, {id:'t-spd', l:t.spd, def: 6, max: 10}, {id:'t-rec', l:t.tech_rec, def: 6, max: 10}, {id:'t-con', l:t.con, def: 1, max: 10}, {id:'t-tec', l:t.tec, def: 1, max: 10}, {id:'t-trn', l:t.trn, def: 6, max: 10}, {id:'t-kil', l:t.kil, def: 6, max: 10} ]; const savedData = JSON.parse(localStorage.getItem('lastwar_data') || '{}'); techGrid.innerHTML = techs.map(item => { let currentVal = savedData[item.id] !== undefined ? parseInt(savedData[item.id]) : item.def; if(currentVal > item.max) currentVal = item.max; return `<div class="tech-item"><label>${item.l}</label>${createCustomSelectBtn(item.id, 0, item.max, 'Lv ', '', currentVal)}</div>`; }).join(''); }
    const dayTabs = document.getElementById('day-tabs-container');
    if(dayTabs) { dayTabs.innerHTML = ['mon','tue','wed','thu','fri','sat'].map((d, i) => `<button id="btn-${d}" class="day-btn ${d===window.currentDay?'active':''}" style="background:var(--${d})" onclick="switchTab('${d}')">${t.days[i]}</button>`).join(''); }
    
    renderDroneInputs(); renderHeroInputs(); renderInputs(); updateAll();

    let touchStartX = 0; let touchEndX = 0;
    const calcPage = document.getElementById('page-calc');
    if(calcPage) {
        calcPage.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
        calcPage.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            const days = ['mon','tue','wed','thu','fri','sat']; const threshold = 60; 
            let idx = days.indexOf(window.currentDay);
            if (touchEndX < touchStartX - threshold && idx < days.length - 1) { switchTab(days[idx + 1]); } 
            else if (touchEndX > touchStartX + threshold && idx > 0) { switchTab(days[idx - 1]); } 
        }, {passive: true});
    }
}
window.onload = () => initCalc();
