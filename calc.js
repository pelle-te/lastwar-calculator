// 전역 변수 설정
window.currentLang = 'ko';
window.currentDay = 'mon';
window.targetScore = 7200000;
window.activeSpdId = '';

const i18n = {
    ko: {
        nav: { calc: "📊 계산기", board: "📱 피드", qna: "💬 건의" },
        targets: { t6: "6상", t8: "8상", t9: "9상" },
        fixed: "고정값", reset: "초기화",
        result: { score: "SCORE", box: "BOX", remain: "남은 점수" },
        modal: { 
            tech: "연맹 테크 설정", spd: "가속 계산기", drone: "드론 파츠 상자", hero: "영웅 조각",
            btn_close: "확인", btn_apply: "적용", btn_cancel: "취소", btn_open: "입력하기", total: "총" 
        },
        units: { day: "일", hour: "시", min: "분" },
        expert: "🏆 대결 전문가", radar: "📡 추당-레이더", spd: "⏱️ 추당-가속", rec: "🎫 추당-모집", con: "🏰 추당-건설", tec: "🔬 추당-테크", trn: "⚔️ 추당-훈련", kil: "🔥 추당-적처치",
        days: ["월", "화", "수", "목", "금", "토"],
        success: "🎉 목표 달성 완료!",
        inputs: {
            squads: "🚜 채집 부대 수", squads_unit: "부대", gather: "⏱️ 시간당 채집(h)",
            dia: "💎 다이아 구매", radar_task: "📡 레이더 임무", stam: "⚡ 체력 소모", exp: "⭐ 영웅 경험치(1M)", part: "⚙️ 드론 부품", data: "💾 드론 데이터(1k)", food: "🌾 식량 채집(h)", iron: "🪨 철광 채집(h)", gold: "🪙 금화 채집(h)",
            truck: "🚚 UR 화물차", sec: "🕵️ UR 은밀 임무", surv: "🎫 생존자 모집", build_spd: "⏱️ 건설 가속(h)", pow_con: "🏰 건물 전투력(1k)",
            tec_spd: "⏱️ 테크 가속(h)", pow_tec: "🔬 테크 전투력(1k)", medal: "🏅 명예 훈장 소모",
            tkt: "🎫 영웅 모집", sk: "🏅 스킬 훈장",
            trn_spd: "⏱️ 훈련 가속(h)", trn_cnt: "⚔️ 훈련 수", trn_lvl: "🎯 훈련 레벨",
            kill_spd: "⏱️ 모든 가속(h)", kill_target: "⚔️ 처치 대상", kill_lvl: "🎯 처치 레벨", kill_cnt: "🔥 처치 수", dth_lvl: "💀 전사 레벨", dth_cnt: "🩸 전사 수",
            target_spec: "특정 매칭 연맹", target_gen: "일반 적군"
        }
    },
    en: {
        nav: { calc: "📊 Calc", board: "📱 Feed", qna: "💬 Q&A" },
        targets: { t6: "6 Boxes", t8: "8 Boxes", t9: "9 Boxes" },
        fixed: "Fixed", reset: "Reset",
        result: { score: "SCORE", box: "BOX", remain: "Remaining" },
        modal: { 
            tech: "Alliance Tech", spd: "Speed-up Calc", drone: "Drone Box", hero: "Hero Shards",
            btn_close: "Confirm", btn_apply: "Apply", btn_cancel: "Cancel", btn_open: "Input", total: "Total" 
        },
        units: { day: "d", hour: "h", min: "m" },
        expert: "🏆 VS Expert", radar: "📡 Radar Task", spd: "⏱️ Spd-Up Task", rec: "🎫 Recruit Task", con: "🏰 Build Task", tec: "🔬 Tech Task", trn: "⚔️ Train Task", kil: "🔥 Kill Task",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        success: "🎉 Goal Achieved!",
        inputs: {
            squads: "🚜 Gather Squads", squads_unit: " Units", gather: "⏱️ Hourly Gather(h)",
            dia: "💎 Buy Diamonds", radar_task: "📡 Radar Tasks", stam: "⚡ Stamina Used", exp: "⭐ Hero EXP (1M)", part: "⚙️ Drone Parts", data: "💾 Drone Data (1k)", food: "🌾 Food Gather(h)", iron: "🪨 Iron Gather(h)", gold: "🪙 Gold Gather(h)",
            truck: "🚚 UR Truck", sec: "🕵️ UR Secret Task", surv: "🎫 Survivor Recruit", build_spd: "⏱️ Build Spd-up(h)", pow_con: "🏰 Build Power(1k)",
            tec_spd: "⏱️ Tech Spd-up(h)", pow_tec: "🔬 Tech Power(1k)", medal: "🏅 Honor Medals",
            tkt: "🎫 Hero Recruit", sk: "🏅 Skill Medals",
            trn_spd: "⏱️ Train Spd-up(h)", trn_cnt: "⚔️ Units Trained", trn_lvl: "🎯 Train Level",
            kill_spd: "⏱️ Universal Spd-up(h)", kill_target: "⚔️ Target Type", kill_lvl: "🎯 Kill Level", kill_cnt: "🔥 Kill Count", dth_lvl: "💀 Death Level", dth_cnt: "🩸 Death Count",
            target_spec: "Match Enemy", target_gen: "General Enemy"
        }
    }
};

const BASE = {
    radar: 10000, truck: 100000, secret: 75000, surv: 1500, spd_min: 50, pow_pt: 10, h_gather: 9523.5, drone_part: 2500, drone_data: 3, honor_medal: 300,
    recruit: 1500, ur_shard: 10000, ssr_shard: 3500, sr_shard: 1000, skill_medal: 10, exp_unit: 1.0/660,
    boxes: [0, 1100, 3300, 10000, 30000, 90000, 270000, 810000],
    trp: [0, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110], 
    kil_spec: [0, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
    kil_gen: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
};

function getVal(cid) {
    const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}');
    if (data[cid] !== undefined) return data[cid];
    return cid === 'mon-squads' ? "1" : "0";
}

window.changeLang = function(lang) {
    window.currentLang = lang;
    const koBtn = document.getElementById('lang-ko');
    const enBtn = document.getElementById('lang-en');
    if(koBtn) koBtn.style.color = lang === 'ko' ? 'var(--primary)' : '#94a3b8';
    if(enBtn) enBtn.style.color = lang === 'en' ? 'var(--primary)' : '#94a3b8';
    initCalc();
};

window.setTarget = function(s) { 
    window.targetScore = s; 
    document.querySelectorAll('.target-btn').forEach(b => b.classList.remove('active'));
    const targetBtn = document.getElementById('target-' + s);
    if(targetBtn) targetBtn.classList.add('active'); 
    updateAll(); 
};

window.switchTab = function(day) {
    window.currentDay = day;
    document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById('btn-' + day);
    if(activeBtn) activeBtn.classList.add('active');
    renderInputs();
    updateAll();
};

window.setFixedValues = function() {
    const msg = window.currentLang === 'ko' ? "고정 설정을 적용하시겠습니까?" : "Apply fixed settings?";
    if(confirm(msg)) {
        const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}');
        data['mon-squads'] = "2"; data['mon-gather'] = "24";
        ['mon','tue','wed','thu','fri','sat'].forEach(d => {
            data[`${d}-radar`] = "82";
            if(d === 'tue' || d === 'sat') { data[`${d}-truck`] = "4"; data[`${d}-sec`] = "7"; }
        });
        localStorage.setItem('lastwar_data', JSON.stringify(data));
        renderInputs(); updateAll();
    }
};

// [수정] 완전 초기화: 메인 데이터 + 드론/영웅 상세 데이터 모두 삭제
window.resetDayData = function() {
    const msg = window.currentLang === 'ko' ? "데이터를 초기화하시겠습니까?" : "Reset data?";
    if(confirm(msg)) {
        const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}');
        const spdData = JSON.parse(localStorage.getItem('lastwar_spd_data') || '{}');
        const prefix = window.currentDay + '-';
        
        // 1. 일반 입력값 초기화
        Object.keys(data).forEach(key => { if(key.startsWith(prefix)) data[key] = key.includes('squads') ? "1" : "0"; });
        
        // 2. 가속 상세 데이터 삭제
        Object.keys(spdData).forEach(key => { if(key.startsWith(prefix)) delete spdData[key]; });
        
        // 3. 드론 부품 및 영웅 조각 모달 내 입력값 수동 초기화
        if(window.currentDay === 'wed') {
            for(let i=1; i<=7; i++) { const el = document.getElementById('drone-b'+i); if(el) el.value = 0; }
        }
        if(window.currentDay === 'thu') {
            ['hero-ur','hero-ssr','hero-sr'].forEach(id => { const el = document.getElementById(id); if (el) el.value = 0; });
        }
        
        localStorage.setItem('lastwar_data', JSON.stringify(data));
        localStorage.setItem('lastwar_spd_data', JSON.stringify(spdData));
        renderInputs(); updateAll();
    }
};
// [보강] 가속 데이터를 불러오는 함수
window.getSpdData = function(fullId) {
    const data = JSON.parse(localStorage.getItem('lastwar_spd_data') || '{}');
    return data[fullId] || { m5:0, m15:0, h1:0, h3:0, h8:0 };
};

// [보강] 가속 모달 열기: 기존 입력값을 그대로 로드
window.openSpdModal = (cid, label) => { 
    window.activeSpdId = `${window.currentDay}-${cid}`; 
    const titleEl = document.getElementById('spd-title');
    if(titleEl) titleEl.innerText = label; 
    
    const savedSpd = window.getSpdData(window.activeSpdId);
    
    ['m5','m15','h1','h3','h8'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.value = savedSpd[id] || 0; // 이전에 입력한 수량이 나타남
    });
    
    window.calcSpdTotal(); 
    document.getElementById('spdModal')?.classList.add('active'); 
};

window.closeSpdModal = () => document.getElementById('spdModal')?.classList.remove('active');
window.openTechModal = () => document.getElementById('techModal')?.classList.add('active');
window.closeTechModal = () => { document.getElementById('techModal')?.classList.remove('active'); updateAll(); };
window.openDroneModal = () => document.getElementById('droneModal')?.classList.add('active');
window.closeDroneModal = () => document.getElementById('droneModal')?.classList.remove('active');
window.openHeroModal = () => document.getElementById('heroModal')?.classList.add('active');
window.closeHeroModal = () => document.getElementById('heroModal')?.classList.remove('active');

function val(id) { 
    // 가속 입력창 전용 로직 (요일 접두사 예외 처리)
    if (['m5','m15','h1','h3','h8'].includes(id)) {
        return parseFloat(document.getElementById(id)?.value) || 0;
    }
    let el = document.getElementById(id); 
    return el ? parseFloat(el.value) || 0 : 0; 
}

function getM(subId) { let e = val('t-expert') * 0.05, s = val(subId) * 0.05; return { all: 1 + e, sub: 1 + e + s }; }

window.calcSpdTotal = function() {
    const t = i18n[window.currentLang];
    const m5 = parseFloat(document.getElementById('m5').value) || 0;
    const m15 = parseFloat(document.getElementById('m15').value) || 0;
    const h1 = parseFloat(document.getElementById('h1').value) || 0;
    const h3 = parseFloat(document.getElementById('h3').value) || 0;
    const h8 = parseFloat(document.getElementById('h8').value) || 0;

    const totalMin = (m5 * 5) + (m15 * 15) + (h1 * 60) + (h3 * 180) + (h8 * 480);
    const d = Math.floor(totalMin / 1440);
    const h = Math.floor((totalMin % 1440) / 60);
    const m = Math.round(totalMin % 60);
    
    const resText = document.getElementById('spd-result-text');
    if(resText) {
        const unit = t.units;
        const totalLabel = t.modal ? t.modal.total : '총';
        resText.innerText = `${totalLabel}: ${d}${unit.day} ${h}${unit.hour} ${m}${unit.min}`;
    }
    return totalMin;
};

// [수정] 가속 적용 버튼: 수량 데이터를 영구 저장
window.applySpd = function() {
    const totalMin = window.calcSpdTotal();
    const targetInput = document.getElementById(window.activeSpdId); 
    
    if(targetInput) { 
        targetInput.value = (totalMin / 60).toFixed(2); // 메인 화면에 시간 단위로 표시
        
        const spdData = JSON.parse(localStorage.getItem('lastwar_spd_data') || '{}');
        spdData[window.activeSpdId] = {
            m5: document.getElementById('m5').value,
            m15: document.getElementById('m15').value,
            h1: document.getElementById('h1').value,
            h3: document.getElementById('h3').value,
            h8: document.getElementById('h8').value
        };
        localStorage.setItem('lastwar_spd_data', JSON.stringify(spdData)); // 수량 데이터 저장
        
        updateAll(); 
    }
    window.closeSpdModal();
};

// [수정] 점수 계산 로직: 각 항목별로 정확한 테크 보너스 적용
window.updateAll = function() {
    const d = window.currentDay;
    const t = i18n[window.currentLang];
    let totalScore = 0;
    
    // 각 테크 항목의 레벨에 맞는 보너스 계산 (전문가 기본 5% + 항목별 5%)
    let m = { 
        rad: getM('t-radar'),    // 레이더 테크 적용
        spd: getM('t-spd'),      // 가속 테크 적용
        rec: getM('t-rec'),      // 모집 테크 적용
        con: getM('t-con'),      // 건설 테크 적용
        tec: getM('t-tec'),      // 테크 테크 적용
        trn: getM('t-trn'),      // 훈련 테크 적용
        kil: getM('t-kil'),      // 적처치 테크 적용
        exp: getM('t-expert')    // 대결 전문가 기본 보너스
    };

    function setPt(id, pt) {
        const el = document.getElementById('pts-' + id);
        if(el) el.innerText = Math.floor(pt).toLocaleString();
        totalScore += pt;
    }

    setPt('dia', val(d+'-dia') * 30); // 다이아는 테크 보너스 제외

    if(d==='mon') {
        setPt('radar', val('mon-radar')*BASE.radar*m.rad.sub);
        setPt('stam', val('mon-stam')*150*m.exp.all);
        setPt('exp', val('mon-exp')*1000000*BASE.exp_unit*m.exp.all);
        setPt('part', val('mon-part')*BASE.drone_part*m.exp.all);
        setPt('data', val('mon-data')*1000*BASE.drone_data*m.exp.all);
        setPt('gather', val('mon-gather') * val('mon-squads') * BASE.h_gather * m.exp.all);
    } else if(d==='tue') {
        setPt('truck', val('tue-truck')*BASE.truck*m.exp.all);
        setPt('sec', val('tue-sec')*BASE.secret*m.exp.all);
        setPt('surv', val('tue-surv')*BASE.surv*m.exp.all);
        setPt('spd', val('tue-spd')*60*BASE.spd_min*m.spd.sub);
        setPt('pow', val('tue-pow')*1000*BASE.pow_pt*m.con.sub);
    } else if(d==='wed') {
        setPt('radar', val('wed-radar')*BASE.radar*m.rad.sub);
        setPt('spd', val('wed-spd')*60*BASE.spd_min*m.spd.sub);
        setPt('pow', val('wed-pow')*1000*BASE.pow_pt*m.tec.sub);
        setPt('mdl', val('wed-mdl')*BASE.honor_medal*m.exp.all);
        let droneTotal = 0;
        for(let i=1; i<=7; i++) { droneTotal += val('drone-b'+i) * BASE.boxes[i]; }
        setPt('drone-box', droneTotal * m.exp.all);
    } else if(d==='thu') {
        setPt('tkt', val('thu-tkt')*BASE.recruit*m.rec.sub);
        setPt('hero-shard', (val('hero-ur')*BASE.ur_shard + val('hero-ssr')*BASE.ssr_shard + val('hero-sr')*BASE.sr_shard) * m.exp.all);
        setPt('sk', val('thu-sk')*BASE.skill_medal*m.exp.all);
        setPt('exp', val('thu-exp')*1000000*BASE.exp_unit*m.exp.all);
    } else if(d==='fri') {
        setPt('radar', val('fri-radar')*BASE.radar*m.rad.sub);
        setPt('spd-con', val('fri-spd-con')*60*BASE.spd_min*m.spd.sub);
        setPt('spd-tec', val('fri-spd-tec')*60*BASE.spd_min*m.spd.sub);
        setPt('spd-trn', val('fri-spd-trn')*60*BASE.spd_min*m.spd.sub);
        setPt('pow-con', val('fri-pow-con')*1000*BASE.pow_pt*m.con.sub);
        setPt('pow-tec', val('fri-pow-tec')*1000*BASE.pow_pt*m.tec.sub);
        setPt('count', val('fri-count')*BASE.trp[val('fri-lvl')]*m.trn.sub);
    } else if(d==='sat') {
        setPt('truck', val('sat-truck')*BASE.truck*m.exp.all);
        setPt('sec', val('sat-sec')*BASE.secret*m.exp.all);
        setPt('spd-all', val('sat-spd-all')*60*BASE.spd_min*m.spd.sub);
        let kScore = document.getElementById('sat-target')?.value === 'special' ? BASE.kil_spec[val('sat-elvl')] : BASE.kil_gen[val('sat-elvl')];
        setPt('kill', val('sat-kill')*kScore*m.kil.sub);
        setPt('dth', val('sat-dth')*BASE.trp[val('sat-alvl')]*m.exp.all);
    }

    saveAllData();
    const pct = Math.min(100, (totalScore / window.targetScore) * 100);
    const scoreEl = document.getElementById('score');
    if(scoreEl) scoreEl.innerText = totalScore.toLocaleString();
    const barEl = document.getElementById('bar');
    if(barEl) barEl.style.width = pct + '%';
    const boxEl = document.getElementById('box-status');
    if(boxEl) boxEl.innerText = `${Math.min(9, Math.floor(totalScore / (window.targetScore / 9)))} / 9`;
    const diffEl = document.getElementById('diff');
    const rem = window.targetScore - totalScore;
    if(diffEl) diffEl.innerText = rem > 0 ? `${t.result.remain}: ${rem.toLocaleString()}` : t.success;
};

function renderInputs() {
    const t = i18n[window.currentLang];
    const container = document.getElementById('input-container');
    if(!container) return;
    const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}');
    const config = { 
        mon:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'stam',l:t.inputs.stam},{id:'exp',l:t.inputs.exp},{id:'part',l:t.inputs.part},{id:'data',l:t.inputs.data}], 
        tue:[{id:'dia',l:t.inputs.dia},{id:'truck',l:t.inputs.truck},{id:'sec',l:t.inputs.sec},{id:'surv',l:t.inputs.surv},{id:'spd',l:t.inputs.build_spd,isSpd:true},{id:'pow',l:t.inputs.pow_con}], 
        wed:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'spd',l:t.inputs.tec_spd,isSpd:true},{id:'pow',l:t.inputs.pow_tec},{id:'mdl',l:t.inputs.medal}], 
        thu:[{id:'dia',l:t.inputs.dia},{id:'tkt',l:t.inputs.tkt},{id:'exp',l:t.inputs.exp},{id:'sk',l:t.inputs.sk}],
        fri:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'spd-con',l:t.inputs.build_spd,isSpd:true},{id:'spd-tec',l:t.inputs.tec_spd,isSpd:true},{id:'spd-trn',l:t.inputs.trn_spd,isSpd:true},{id:'pow-con',l:t.inputs.pow_con},{id:'pow-tec',l:t.inputs.pow_tec}], 
        sat:[{id:'dia',l:t.inputs.dia},{id:'truck',l:t.inputs.truck},{id:'sec',l:t.inputs.sec},{id:'spd-all',l:t.inputs.kill_spd,isSpd:true}] 
    };

    let html = `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;"><div class="section-title" style="margin:0;">📊 ${window.currentDay.toUpperCase()} INPUT</div><div style="display:flex; gap:8px;"><button onclick="setFixedValues()" class="btn-secondary" style="background:#eef2ff; color:#6366f1; border:1px solid #c7d2fe; padding:4px 10px; font-size:0.75rem; font-weight:800; border-radius:8px; cursor:pointer;">${t.fixed}</button><button onclick="resetDayData()" class="btn-secondary" style="background:#fee2e2; color:#ef4444; border:1px solid #fecaca; padding:4px 10px; font-size:0.75rem; font-weight:800; border-radius:8px; cursor:pointer;">${t.reset}</button></div></div><div class="input-grid">`;

    if(window.currentDay === 'mon') {
        const sVal = getVal('mon-squads'); const gVal = getVal('mon-gather');
        html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.squads}</span></div><select id="mon-squads" class="compact-input" onchange="updateAll()">${[1,2,3,4,5].map(n => `<option value="${n}" ${sVal==n?'selected':''}>${n}${t.inputs.squads_unit}</option>`).join('')}</select></div><div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.gather}</span><span class="item-score-tag" id="pts-gather">0</span></div><input type="number" id="mon-gather" class="compact-input" value="${gVal}" oninput="updateAll()"></div>`;
    }
    if(window.currentDay === 'wed') {
        html += `<div class="input-group-compact full-mobile-item"><div class="input-header"><span class="input-label-small">📦 ${t.modal.drone}</span><span class="item-score-tag" id="pts-drone-box">0</span></div><button class="spd-btn-mini" onclick="openDroneModal()">${t.modal.btn_open}</button></div>`;
    }
    if(window.currentDay === 'thu') {
        html += `<div class="input-group-compact full-mobile-item"><div class="input-header"><span class="input-label-small">🧩 ${t.modal.hero}</span><span class="item-score-tag" id="pts-hero-shard">0</span></div><button class="spd-btn-mini" onclick="openHeroModal()">${t.modal.btn_open}</button></div>`;
    }

    (config[window.currentDay] || []).forEach(i => {
        const cid = `${window.currentDay}-${i.id}`;
        html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">${i.l}</span><span class="item-score-tag" id="pts-${i.id}">0</span></div><input type="number" id="${cid}" class="compact-input" value="${getVal(cid)}" oninput="updateAll()">${i.isSpd ? `<button class="spd-btn-mini" onclick="openSpdModal('${i.id}','${i.l}')">${t.modal.btn_open}</button>` : ''}</div>`;
    });

    if(window.currentDay === 'fri') {
        const lvl = getVal('fri-lvl') || "8";
        html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.trn_lvl}</span></div><select id="fri-lvl" class="compact-input" onchange="updateAll()">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i+1==lvl?'selected':''}>Lv ${i+1}</option>`).join('')}</select></div><div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.trn_cnt}</span><span class="item-score-tag" id="pts-count">0</span></div><input type="number" id="fri-count" class="compact-input" value="${getVal('fri-count')}" oninput="updateAll()"></div>`;
    }
    if(window.currentDay === 'sat') {
        const target = getVal('sat-target') || "special";
        html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.kill_target}</span></div><select id="sat-target" class="compact-input" onchange="updateAll()"><option value="special" ${target=='special'?'selected':''}>${t.inputs.target_spec}</option><option value="general" ${target=='general'?'selected':''}>${t.inputs.target_gen}</option></select></div><div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.kill_lvl}</span></div><select id="sat-elvl" class="compact-input" onchange="updateAll()">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i+1==(getVal('sat-elvl')||8)?'selected':''}>Lv ${i+1}</option>`).join('')}</select></div><div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.kill_cnt}</span><span class="item-score-tag" id="pts-kill">0</span></div><input type="number" id="sat-kill" class="compact-input" value="${getVal('sat-kill')}" oninput="updateAll()"></div><div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.dth_lvl}</span></div><select id="sat-alvl" class="compact-input" onchange="updateAll()">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i+1==(getVal('sat-alvl')||8)?'selected':''}>Lv ${i+1}</option>`).join('')}</select></div><div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.dth_cnt}</span><span class="item-score-tag" id="pts-dth">0</span></div><input type="number" id="sat-dth" class="compact-input" value="${getVal('sat-dth')}" oninput="updateAll()"></div>`;
    }
    html += `</div>`;
    container.innerHTML = html;
}

window.saveAllData = function() {
    const inputs = document.querySelectorAll('.compact-input, select.compact-input');
    const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}');
    inputs.forEach(input => { if(input.id) data[input.id] = input.value; });
    localStorage.setItem('lastwar_data', JSON.stringify(data));
};

function initCalc() {
    const t = i18n[window.currentLang];
    const uiMap = {
        'nav-calc': t.nav.calc, 'nav-board': t.nav.board, 'nav-qna': t.nav.qna,
        'target-2300000': t.targets.t6, 'target-3600000': t.targets.t8, 'target-7200000': t.targets.t9,
        'tech-title': `🔬 ${t.modal.tech.toUpperCase()}`, 'tech-modal-title': t.modal.tech, 'drone-modal-title': t.modal.drone, 'hero-modal-title': t.modal.hero
    };
    Object.keys(uiMap).forEach(id => { const el = document.getElementById(id); if(el) el.innerText = uiMap[id]; });
    
    const grid = document.getElementById('tech-inputs');
    if(grid) {
        const techs = [{id:'t-expert',l:t.expert,v:20}, {id:'t-radar',l:t.radar,v:6},
            {id:'t-spd',l:t.spd,v:6}, {id:'t-rec',l:t.rec,v:6},
            {id:'t-con',l:t.con,v:1}, {id:'t-tec',l:t.tec,v:1},
            {id:'t-trn',l:t.trn,v:6}, {id:'t-kil',l:t.kil,v:6}];
        grid.innerHTML = techs.map(item => `<div class="tech-item"><label>${item.l}</label><select id="${item.id}" onchange="updateAll()">${Array.from({length:21},(_,i)=>`<option value="${i}" ${i===item.v?'selected':''}>Lv ${i} (+${i*5}%)</option>`).join('')}</select></div>`).join('');
    }
    const dayTabs = document.getElementById('day-tabs-container');
    if(dayTabs) {
        const days = ['mon','tue','wed','thu','fri','sat'];
        dayTabs.innerHTML = days.map((d, i) => `<button id="btn-${d}" class="day-btn ${d===window.currentDay?'active':''}" style="background:var(--${d})" onclick="switchTab('${d}')">${t.days[i]}</button>`).join('');
    }
    renderInputs(); updateAll();
}

window.onload = () => { initCalc(); if(typeof loadLiveView === 'function') { loadLiveView('posts'); loadLiveView('suggestions'); } };
window.validatePos = function(el) { if (el.value < 0) el.value = 0; };
