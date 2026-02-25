window.currentLang = 'ko';
window.currentDay = 'mon';
window.targetScore = 7200000;
window.activeSpdId = '';
window.customRatio = 5; // 슬라이더 기본값

const i18n = {
    ko: {
        nav: { calc: "📊 계산기", board: "📱 피드", qna: "💬 건의" },
        targets: { t6: "6상", t8: "8상", t9: "9상" },
        fixed: "고정값", reset: "초기화",
        result: { score: "SCORE", box: "BOX", remain: "남은 점수" },
        modal: { tech: "연맹 테크 설정", spd: "가속 계산기", drone: "드론 파츠 상자", hero: "영웅 조각", btn_close: "닫기", btn_apply: "적용", btn_cancel: "취소", btn_open: "입력하기", btn_confirm: "확인", total: "총", weekly: "이번 주 대결 리포트 📈" },
        units: { day: "일", hour: "시", min: "분" },
        expert: "🏆 대결 전문가", radar: "📡 추당-레이더", spd: "⏱️ 추당-가속", rec: "🎫 추당-모집", con: "🏰 추당-건설", tec: "🔬 추당-테크", trn: "⚔️ 추당-훈련", kil: "🔥 추당-적처치",
        days: ["월", "화", "수", "목", "금", "토"],
        success: "🎉 목표 달성 완료!",
        labels: { m5: "5분", m15: "15분", h1: "1시간", h3: "3시간", h8: "8시간", ur: "UR 조각", ssr: "SSR 조각", sr: "SR 조각" },
        inputs: { squads: "🚜 채집 부대 수", squads_unit: "부대", gather: "⏱️ 시간당 채집(h)", dia: "💎 다이아 구매", radar_task: "📡 레이더 임무", stam: "⚡ 체력 소모", exp: "⭐ 영웅 경험치(1M)", part: "⚙️ 드론 부품", data: "💾 드론 데이터(1k)", truck: "🚚 UR 화물차", sec: "🕵️ UR 은밀 임무", surv: "🎫 생존자 모집", build_spd: "⏱️ 건설 가속(h)", pow_con: "🏰 건물 전투력(1k)", tec_spd: "⏱️ 테크 가속(h)", pow_tec: "🔬 테크 전투력(1k)", medal: "🏅 명예 훈장 소모", tkt: "🎫 영웅 모집", sk: "🏅 스킬 훈장", trn_spd: "⏱️ 훈련 가속(h)", trn_cnt: "⚔️ 훈련 수", trn_lvl: "🎯 훈련 레벨", kill_spd: "⏱️ 모든 가속(h)", kill_target: "⚔️ 처치 대상", kill_lvl: "🎯 처치 레벨", kill_cnt: "🔥 처치 수", dth_lvl: "💀 전사 레벨", dth_cnt: "🩸 전사 수", target_spec: "특정 매칭 연맹", target_gen: "일반 적군" },
        rec: { success: "목표 달성! 자원을 아끼세요.", guide_title: "맞춤 가이드", only: "만", count: "개", custom_ratio: "나만의 맞춤 배분", target_goal: "목표" }
    },
    en: {
        nav: { calc: "📊 Calc", board: "📱 Feed", qna: "💬 Q&A" },
        targets: { t6: "6 Boxes", t8: "8 Boxes", t9: "9 Boxes" },
        fixed: "Fixed", reset: "Reset",
        result: { score: "SCORE", box: "BOX", remain: "Remaining" },
        modal: { tech: "Alliance Tech", spd: "Speed-up Calc", drone: "Drone Parts Box", hero: "Hero Shards", btn_close: "Close", btn_apply: "Apply", btn_cancel: "Cancel", btn_open: "Input", btn_confirm: "Confirm", total: "Total", weekly: "Weekly VS Report 📈" },
        units: { day: "d", hour: "h", min: "m" },
        expert: "🏆 VS Expert", radar: "📡 Radar Task", spd: "⏱️ Spd-Up Task", rec: "🎫 Recruit Task", con: "🏰 Build Task", tec: "🔬 Tech Task", trn: "⚔️ Train Task", kil: "🔥 Kill Task",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        success: "🎉 Goal Achieved!",
        labels: { m5: "5m", m15: "15m", h1: "1h", h3: "3h", h8: "8h", ur: "UR Shard", ssr: "SSR Shard", sr: "SR Shard" },
        inputs: { squads: "🚜 Gather Squads", squads_unit: " Units", gather: "⏱️ Hourly(h)", dia: "💎 Buy Diamonds", radar_task: "📡 Radar Tasks", stam: "⚡ Stamina Used", exp: "⭐ Hero EXP (1M)", part: "⚙️ Drone Parts", data: "💾 Drone Data (1k)", truck: "🚚 UR Truck", sec: "🕵️ UR Secret Task", surv: "🎫 Survivor Recruit", build_spd: "⏱️ Build Spd-up(h)", pow_con: "🏰 Build Power(1k)", tec_spd: "⏱️ Tech Spd-up(h)", pow_tec: "🔬 Tech Power(1k)", medal: "🏅 Honor Medals", tkt: "🎫 Hero Recruit", sk: "🏅 Skill Medals", trn_spd: "⏱️ Train Spd-up(h)", trn_cnt: "⚔️ Units Trained", trn_lvl: "🎯 Train Level", kill_spd: "⏱️ Universal Spd-up(h)", kill_target: "⚔️ Target Type", kill_lvl: "🎯 Kill Level", kill_cnt: "🔥 Kill Count", dth_lvl: "💀 Death Level", dth_cnt: "🩸 Death Count", target_spec: "Match Enemy", target_gen: "General Enemy" },
        rec: { success: "Goal Achieved! Save your resources.", guide_title: "Custom Guide", only: " Only", count: "", custom_ratio: "Custom Ratio", target_goal: "Goal" }
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

// 숫자 입력 필드에서 음수(-) 및 불필요한 기호 원천 차단
document.addEventListener('keydown', function(e) {
    if (e.target && e.target.type === 'number') {
        if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === '.') {
            e.preventDefault();
        }
    }
});
document.addEventListener('input', function(e) {
    if (e.target && e.target.type === 'number') {
        if (e.target.value < 0) e.target.value = 0;
    }
});

function getVal(cid) {
    const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}');
    if (data[cid] !== undefined) return data[cid];
    return cid.includes('squads') ? "1" : "0";
}

function renderDroneInputs() {
    const container = document.getElementById('drone-inputs-container');
    if(!container) return;
    let html = '';
    for(let i=1; i<=7; i++) {
        html += `<div class="tech-item"><label>Lv.${i}</label><input type="number" id="drone-b${i}" class="compact-input" min="0" value="${getVal('drone-b'+i)}" oninput="updateAll()"></div>`;
    }
    container.innerHTML = html;
}

window.changeLang = function(lang) {
    window.currentLang = lang;
    document.getElementById('lang-ko').style.fontWeight = lang === 'ko' ? '800' : 'normal';
    document.getElementById('lang-en').style.fontWeight = lang === 'en' ? '800' : 'normal';
    initCalc();
};

window.setTarget = function(s) { 
    window.targetScore = s; 
    document.querySelectorAll('.target-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('target-' + s)?.classList.add('active'); 
    updateAll(); 
};

window.switchTab = function(day) {
    window.currentDay = day;
    document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + day)?.classList.add('active');
    renderInputs();
    updateAll();
};

window.setFixedValues = function() {
    const msg = window.currentLang === 'ko' ? "고정 설정을 적용하시겠습니까?" : "Apply fixed settings?";
    if(confirm(msg)) {
        const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}');
        data['mon-squads'] = "2"; 
        data['mon-gather'] = "24";
        ['mon','tue','wed','thu','fri','sat'].forEach(d => {
            data[`${d}-radar`] = "82";
            if(d === 'tue' || d === 'sat') { data[`${d}-truck`] = "4"; data[`${d}-sec`] = "7"; }
        });
        localStorage.setItem('lastwar_data', JSON.stringify(data));
        renderInputs(); 
        updateAll();
    }
};

window.resetDayData = function() {
    const msg = window.currentLang === 'ko' ? "데이터를 초기화하시겠습니까?" : "Reset data?";
    if(confirm(msg)) {
        const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}');
        const spdData = JSON.parse(localStorage.getItem('lastwar_spd_data') || '{}');
        const prefix = window.currentDay + '-';
        
        Object.keys(data).forEach(key => { if(key.startsWith(prefix)) data[key] = key.includes('squads') ? "1" : "0"; });
        Object.keys(spdData).forEach(key => { if(key.startsWith(prefix)) delete spdData[key]; });
        
        if(window.currentDay === 'wed') { for(let i=1; i<=7; i++) { const el = document.getElementById('drone-b'+i); if(el) el.value = 0; } }
        if(window.currentDay === 'thu') { ['hero-ur','hero-ssr','hero-sr'].forEach(id => { const el = document.getElementById(id); if (el) el.value = 0; }); }
        
        localStorage.setItem('lastwar_data', JSON.stringify(data));
        localStorage.setItem('lastwar_spd_data', JSON.stringify(spdData));
        renderInputs(); updateAll();
    }
};

window.getSpdData = function(fullId) {
    const data = JSON.parse(localStorage.getItem('lastwar_spd_data') || '{}');
    return data[fullId] || { m5:0, m15:0, h1:0, h3:0, h8:0 };
};

window.openSpdModal = (cid, label) => { 
    window.activeSpdId = `${window.currentDay}-${cid}`; 
    const titleEl = document.getElementById('spd-title');
    if(titleEl) titleEl.innerText = label; 
    
    const savedSpd = window.getSpdData(window.activeSpdId);
    ['m5','m15','h1','h3','h8'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.value = savedSpd[id] || 0;
    });
    
    window.calcSpdTotal(); 
    document.getElementById('spdModal')?.classList.add('active'); 
};

window.openTechModal = () => document.getElementById('techModal').classList.add('active');
window.closeTechModal = () => { document.getElementById('techModal').classList.remove('active'); updateAll(); };
window.closeSpdModal = () => document.getElementById('spdModal').classList.remove('active');
window.openDroneModal = () => document.getElementById('droneModal').classList.add('active');
window.closeDroneModal = () => document.getElementById('droneModal').classList.remove('active');
window.openHeroModal = () => document.getElementById('heroModal').classList.add('active');
window.closeHeroModal = () => document.getElementById('heroModal').classList.remove('active');

function val(id) { 
    if (['m5','m15','h1','h3','h8'].includes(id)) return parseFloat(document.getElementById(id)?.value) || 0;
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

window.applySpd = function() {
    const totalMin = window.calcSpdTotal();
    const targetInput = document.getElementById(window.activeSpdId); 
    
    if(targetInput) { 
        targetInput.value = (totalMin / 60).toFixed(2); 
        const spdData = JSON.parse(localStorage.getItem('lastwar_spd_data') || '{}');
        spdData[window.activeSpdId] = {
            m5: document.getElementById('m5').value, m15: document.getElementById('m15').value,
            h1: document.getElementById('h1').value, h3: document.getElementById('h3').value, h8: document.getElementById('h8').value
        };
        localStorage.setItem('lastwar_spd_data', JSON.stringify(spdData)); 
        updateAll(); 
    }
    window.closeSpdModal();
};

// [수정] 맞춤가이드 라벨을 언어 설정에 맞게 동적으로 가져오기
function getRecommendMap(t) {
    return {
        mon: [{ label: t.inputs.part, unit: (m) => BASE.drone_part * m.exp.all }, { label: t.inputs.data, unit: (m) => 1000 * BASE.drone_data * m.exp.all }],
        tue: [{ label: t.inputs.build_spd, unit: (m) => 60 * BASE.spd_min * m.spd.sub }, { label: t.inputs.pow_con, unit: (m) => 1000 * BASE.pow_pt * m.exp.all }],
        wed: [{ label: t.inputs.tec_spd, unit: (m) => 60 * BASE.spd_min * m.spd.sub }, { label: t.inputs.pow_tec, unit: (m) => 1000 * BASE.pow_pt * m.exp.all }],
        thu: [{ label: "🧩 " + t.labels.ur, unit: (m) => BASE.ur_shard * m.exp.all }, { label: t.inputs.sk, unit: (m) => BASE.skill_medal * m.exp.all }],
        fri: [{ label: t.inputs.trn_spd, unit: (m) => 60 * BASE.spd_min * m.spd.sub }, { label: t.inputs.trn_cnt, unit: (m) => BASE.trp[getVal('fri-lvl')||8] * m.exp.all }],
        sat: [{ label: t.inputs.kill_spd, unit: (m) => 60 * BASE.spd_min * m.spd.sub }, { label: t.inputs.kill_cnt, unit: (m) => (getVal('sat-target') === 'general' ? BASE.kil_gen[getVal('sat-elvl')||8] : BASE.kil_spec[getVal('sat-elvl')||8]) * m.exp.all }]
    };
}

function calculateDayScore(day) {
    let score = 0;
    const m = { exp: getM('t-expert'), rad: getM('t-radar'), spd: getM('t-spd'), rec: getM('t-rec'), con: getM('t-con'), tec: getM('t-tec'), trn: getM('t-trn'), kil: getM('t-kil') };
    score += parseFloat(getVal(day + '-dia')) * 30 || 0;
    
    if(day === 'mon') {
        score += parseFloat(getVal('mon-radar'))*BASE.radar*m.rad.sub || 0;
        score += parseFloat(getVal('mon-stam'))*150*m.exp.all || 0;
        score += parseFloat(getVal('mon-exp'))*1000000*BASE.exp_unit*m.exp.all || 0;
        score += parseFloat(getVal('mon-part'))*BASE.drone_part*m.exp.all || 0;
        score += parseFloat(getVal('mon-data'))*1000*BASE.drone_data*m.exp.all || 0;
        score += parseFloat(getVal('mon-gather')) * parseFloat(getVal('mon-squads')) * BASE.h_gather * m.exp.all || 0;
    } else if(day === 'tue') {
        score += parseFloat(getVal('tue-truck'))*BASE.truck*m.exp.all || 0;
        score += parseFloat(getVal('tue-sec'))*BASE.secret*m.exp.all || 0;
        score += parseFloat(getVal('tue-surv'))*BASE.surv*m.exp.all || 0;
        score += parseFloat(getVal('tue-spd'))*60*BASE.spd_min*m.spd.sub || 0;
        score += parseFloat(getVal('tue-pow'))*1000*BASE.pow_pt*m.con.sub || 0;
    } else if(day === 'wed') {
        score += parseFloat(getVal('wed-radar'))*BASE.radar*m.rad.sub || 0;
        score += parseFloat(getVal('wed-spd'))*60*BASE.spd_min*m.spd.sub || 0;
        score += parseFloat(getVal('wed-pow'))*1000*BASE.pow_pt*m.tec.sub || 0;
        score += parseFloat(getVal('wed-mdl'))*BASE.honor_medal*m.exp.all || 0;
        let droneTotal = 0;
        for(let i=1; i<=7; i++) droneTotal += (parseFloat(getVal('drone-b'+i)) || 0) * BASE.boxes[i];
        score += droneTotal * m.exp.all;
    } else if(day === 'thu') {
        score += parseFloat(getVal('thu-tkt'))*BASE.recruit*m.rec.sub || 0;
        score += (parseFloat(getVal('hero-ur'))*BASE.ur_shard + parseFloat(getVal('hero-ssr'))*BASE.ssr_shard + parseFloat(getVal('hero-sr'))*BASE.sr_shard) * m.exp.all || 0;
        score += parseFloat(getVal('thu-sk'))*BASE.skill_medal*m.exp.all || 0;
        score += parseFloat(getVal('thu-exp'))*1000000*BASE.exp_unit*m.exp.all || 0;
    } else if(day === 'fri') {
        score += parseFloat(getVal('fri-radar'))*BASE.radar*m.rad.sub || 0;
        score += parseFloat(getVal('fri-spd-con'))*60*BASE.spd_min*m.spd.sub || 0;
        score += parseFloat(getVal('fri-spd-tec'))*60*BASE.spd_min*m.spd.sub || 0;
        score += parseFloat(getVal('fri-spd-trn'))*60*BASE.spd_min*m.spd.sub || 0;
        score += parseFloat(getVal('fri-pow-con'))*1000*BASE.pow_pt*m.con.sub || 0;
        score += parseFloat(getVal('fri-pow-tec'))*1000*BASE.pow_pt*m.tec.sub || 0;
        score += parseFloat(getVal('fri-count'))*BASE.trp[getVal('fri-lvl')||8]*m.trn.sub || 0;
    } else if(day === 'sat') {
        score += parseFloat(getVal('sat-truck'))*BASE.truck*m.exp.all || 0;
        score += parseFloat(getVal('sat-sec'))*BASE.secret*m.exp.all || 0;
        score += parseFloat(getVal('sat-spd-all'))*60*BASE.spd_min*m.spd.sub || 0;
        let kScore = document.getElementById('sat-target')?.value === 'special' ? BASE.kil_spec[val('sat-elvl')] : BASE.kil_gen[val('sat-elvl')];
        score += parseFloat(getVal('sat-kill'))*kScore*m.kil.sub || 0;
        score += parseFloat(getVal('sat-dth'))*BASE.trp[getVal('sat-alvl')||8]*m.exp.all || 0;
    }
    return score;
}

window.updateRatioText = function(val) {
    window.customRatio = parseInt(val);
    updateAll(); 
};

window.updateAll = function() {
    const d = window.currentDay;
    const t = i18n[window.currentLang];
    let totalScore = 0;
    
    let m = { rad: getM('t-radar'), spd: getM('t-spd'), rec: getM('t-rec'), con: getM('t-con'), tec: getM('t-tec'), trn: getM('t-trn'), kil: getM('t-kil'), exp: getM('t-expert') };

    function setPt(id, pt) {
        const el = document.getElementById('pts-' + id);
        if(el) el.innerText = Math.floor(pt).toLocaleString();
        totalScore += pt;
    }

    setPt('dia', val(d+'-dia') * 30);

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
        for(let i=1; i<=7; i++) droneTotal += val('drone-b'+i) * BASE.boxes[i];
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
    document.getElementById('score').innerText = totalScore.toLocaleString();
    
    const rem = window.targetScore - totalScore;
    const recBox = document.getElementById('recommend-box');
    const dayName = t.days[['mon','tue','wed','thu','fri','sat'].indexOf(window.currentDay)];

    if(recBox) {
        if(rem <= 0) {
            // [수정] 성공 메시지 언어 연동
            recBox.innerHTML = `<div class="recommend-card success" style="background:var(--fri); text-align:center; font-weight:800;">✅ [${dayName}] ${t.rec.success}</div>`;
        } else {
            const m_calc = { exp: getM('t-expert'), spd: getM('t-spd'), rad: getM('t-radar'), con: getM('t-con'), tec: getM('t-tec'), trn: getM('t-trn'), kil: getM('t-kil') };
            const items = getRecommendMap(t)[window.currentDay]; // 언어 연동된 항목들 불러오기
            
            if (items) {
                const v1 = items[0].unit(m_calc);
                const v2 = items[1].unit(m_calc);
                const leftRatio = (10 - window.customRatio) / 10;
                const rightRatio = window.customRatio / 10;

                const existingSlider = document.getElementById('inner-ratio');
                const renderedDay = recBox.getAttribute('data-rendered-day');
                const renderedLang = recBox.getAttribute('data-rendered-lang'); // 현재 렌더링된 언어 추적
                
                // 목표 텍스트 언어 연동 (9상 -> 9 Boxes)
                const targetText = window.targetScore === 7200000 ? (window.currentLang === 'ko' ? '9상' : '9 Boxes') : t.rec.target_goal;
                
                // 요일과 '언어'가 동일할 때만 숫자만 교체 (언어가 바뀌면 전체 덮어쓰기)
                if (existingSlider && renderedDay === window.currentDay && renderedLang === window.currentLang) {
                    document.getElementById('rec-val-1').innerText = Math.ceil(rem/v1).toLocaleString() + t.rec.count;
                    document.getElementById('rec-val-2').innerText = Math.ceil(rem/v2).toLocaleString() + t.rec.count;
                    document.getElementById('rec-ratio-title').innerText = `${t.rec.custom_ratio} (${10-window.customRatio}:${window.customRatio})`;
                    document.getElementById('rec-ratio-val').innerText = `${Math.ceil((rem * leftRatio)/v1).toLocaleString()} / ${Math.ceil((rem * rightRatio)/v2).toLocaleString()}`;
                } else {
                    recBox.setAttribute('data-rendered-day', window.currentDay);
                    recBox.setAttribute('data-rendered-lang', window.currentLang);
                    recBox.innerHTML = `
                        <div class="recommend-card">
                            <span class="rec-title" style="font-weight:800; display:block; margin-bottom:10px;">💡 [${dayName}] ${targetText} ${t.rec.guide_title}</span>
                            <div class="rec-grid">
                                <div class="rec-item"><span>${items[0].label}${t.rec.only}</span><br><b id="rec-val-1">${Math.ceil(rem/v1).toLocaleString()}${t.rec.count}</b></div>
                                <div class="rec-item"><span>${items[1].label}${t.rec.only}</span><br><b id="rec-val-2">${Math.ceil(rem/v2).toLocaleString()}${t.rec.count}</b></div>
                                <div class="rec-item highlight ratio-integration">
                                    <div class="ratio-info" style="width:100%;">
                                        <span id="rec-ratio-title">${t.rec.custom_ratio} (${10-window.customRatio}:${window.customRatio})</span><br>
                                        <b id="rec-ratio-val" style="font-size:0.95rem;">${Math.ceil((rem * leftRatio)/v1).toLocaleString()} / ${Math.ceil((rem * rightRatio)/v2).toLocaleString()}</b>
                                    </div>
                                    <div class="ratio-control" style="width:100%; margin-top:8px;">
                                        <input type="range" id="inner-ratio" min="0" max="10" value="${window.customRatio}" step="1" 
                                               class="vertical-slider" oninput="window.updateRatioText(this.value)">
                                    </div>
                                </div>
                            </div>
                        </div>`;
                }
            }
        }
    }
    
    if(document.getElementById('bar')) document.getElementById('bar').style.width = pct + '%';
    if(document.getElementById('pct-text')) document.getElementById('pct-text').innerText = Math.floor(pct) + '%';
    if(document.getElementById('box-status')) document.getElementById('box-status').innerText = `${Math.min(9, Math.floor(totalScore / (window.targetScore / 9)))} / 9`;
    if(document.getElementById('diff')) document.getElementById('diff').innerText = rem > 0 ? `${t.result.remain}: ${rem.toLocaleString()}` : t.success;
};

window.syncToCloud = async function() {
    const data = localStorage.getItem('lastwar_data');
    const spdData = localStorage.getItem('lastwar_spd_data');
    try {
        await db.collection('user_sync').doc(myId).set({
            basic: JSON.parse(data), speed: JSON.parse(spdData), updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("☁️ 데이터가 클라우드에 안전하게 저장되었습니다!");
    } catch(e) { alert("저장 실패: " + e.message); }
};

window.closeWeeklyModal = function() { document.getElementById('weeklyModal').classList.remove('active'); };

window.showWeeklyReport = function() {
    const days = ['mon','tue','wed','thu','fri','sat'];
    const currentT = i18n[window.currentLang];
    let html = `<div class="weekly-container">`; 
    let totalWeeklyScore = 0;

    days.forEach((d, idx) => {
        const dayLabel = currentT.days[idx];
        const dayScore = calculateDayScore(d); 
        totalWeeklyScore += dayScore;
        html += `<div class="weekly-row"><span class="weekly-day">${dayLabel}</span><span class="weekly-score">${Math.floor(dayScore).toLocaleString()} pt</span></div>`;
    });

    html += `<div class="weekly-total"><span>TOTAL</span><span>${Math.floor(totalWeeklyScore).toLocaleString()} pt</span></div></div>`;
    document.getElementById('weekly-report-content').innerHTML = html;
    document.getElementById('weeklyModal').classList.add('active');
};

window.toggleDarkMode = function() {
    const body = document.body;
    if(body.classList.contains('light-theme')) {
        body.classList.replace('light-theme', 'dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.replace('dark-theme', 'light-theme');
        localStorage.setItem('theme', 'light');
    }
};

function renderInputs() {
    const t = i18n[window.currentLang];
    const container = document.getElementById('input-container');
    if(!container) return;
    const config = { 
        mon:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'stam',l:t.inputs.stam},{id:'exp',l:t.inputs.exp},{id:'part',l:t.inputs.part},{id:'data',l:t.inputs.data}], 
        tue:[{id:'dia',l:t.inputs.dia},{id:'truck',l:t.inputs.truck},{id:'sec',l:t.inputs.sec},{id:'surv',l:t.inputs.surv},{id:'spd',l:t.inputs.build_spd,isSpd:true},{id:'pow',l:t.inputs.pow_con}], 
        wed:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'spd',l:t.inputs.tec_spd,isSpd:true},{id:'pow',l:t.inputs.pow_tec},{id:'mdl',l:t.inputs.medal}], 
        thu:[{id:'dia',l:t.inputs.dia},{id:'tkt',l:t.inputs.tkt},{id:'exp',l:t.inputs.exp},{id:'sk',l:t.inputs.sk}],
        fri:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'spd-con',l:t.inputs.build_spd,isSpd:true},{id:'spd-tec',l:t.inputs.tec_spd,isSpd:true},{id:'spd-trn',l:t.inputs.trn_spd,isSpd:true},{id:'pow-con',l:t.inputs.pow_con},{id:'pow-tec',l:t.inputs.pow_tec}], 
        sat:[{id:'dia',l:t.inputs.dia},{id:'truck',l:t.inputs.truck},{id:'sec',l:t.inputs.sec},{id:'spd-all',l:t.inputs.kill_spd,isSpd:true}] 
    };

    let html = `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;"><div class="section-title" style="margin:0;">📊 ${window.currentDay.toUpperCase()} INPUT</div><div style="display:flex; gap:8px;"><button onclick="setFixedValues()" class="btn-secondary" style="background:var(--primary-soft); color:var(--primary); padding:4px 10px; font-size:0.75rem; border-radius:8px;">${t.fixed}</button><button onclick="resetDayData()" class="btn-secondary" style="background:#fee2e2; color:#ef4444; padding:4px 10px; font-size:0.75rem; border-radius:8px;">${t.reset}</button></div></div><div class="input-grid">`;

    if(window.currentDay === 'mon') {
        const sVal = getVal('mon-squads'); const gVal = getVal('mon-gather');
        html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.squads}</span></div><select id="mon-squads" class="compact-input" onchange="updateAll()">${[1,2,3,4,5].map(n => `<option value="${n}" ${sVal==n?'selected':''}>${n}${t.inputs.squads_unit}</option>`).join('')}</select></div><div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.gather}</span><span class="item-score-tag" id="pts-gather">0</span></div><input type="number" id="mon-gather" class="compact-input" min="0" value="${gVal}" oninput="updateAll()"></div>`;
    }
    if(window.currentDay === 'wed') {
        html += `<div class="input-group-compact full-mobile-item"><div class="input-header"><span class="input-label-small">📦 ${t.modal.drone}</span><span class="item-score-tag" id="pts-drone-box">0</span></div><button class="spd-btn-mini" onclick="openDroneModal()">${t.modal.btn_open}</button></div>`;
    }
    if(window.currentDay === 'thu') {
        html += `<div class="input-group-compact full-mobile-item"><div class="input-header"><span class="input-label-small">🧩 ${t.modal.hero}</span><span class="item-score-tag" id="pts-hero-shard">0</span></div><button class="spd-btn-mini" onclick="openHeroModal()">${t.modal.btn_open}</button></div>`;
    }

    (config[window.currentDay] || []).forEach(i => {
        const cid = `${window.currentDay}-${i.id}`;
        html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">${i.l}</span><span class="item-score-tag" id="pts-${i.id}">0</span></div><input type="number" id="${cid}" class="compact-input" min="0" value="${getVal(cid)}" oninput="updateAll()">${i.isSpd ? `<button class="spd-btn-mini" onclick="openSpdModal('${i.id}','${i.l}')">${t.modal.btn_open}</button>` : ''}</div>`;
    });

    if(window.currentDay === 'fri') {
        const lvl = getVal('fri-lvl') || "8";
        html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.trn_lvl}</span></div><select id="fri-lvl" class="compact-input" onchange="updateAll()">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i+1==lvl?'selected':''}>Lv ${i+1}</option>`).join('')}</select></div><div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.trn_cnt}</span><span class="item-score-tag" id="pts-count">0</span></div><input type="number" id="fri-count" class="compact-input" min="0" value="${getVal('fri-count')}" oninput="updateAll()"></div>`;
    }
    if(window.currentDay === 'sat') {
        const target = getVal('sat-target') || "special";
        html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.kill_target}</span></div><select id="sat-target" class="compact-input" onchange="updateAll()"><option value="special" ${target=='special'?'selected':''}>${t.inputs.target_spec}</option><option value="general" ${target=='general'?'selected':''}>${t.inputs.target_gen}</option></select></div><div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.kill_lvl}</span></div><select id="sat-elvl" class="compact-input" onchange="updateAll()">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i+1==(getVal('sat-elvl')||8)?'selected':''}>Lv ${i+1}</option>`).join('')}</select></div><div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.kill_cnt}</span><span class="item-score-tag" id="pts-kill">0</span></div><input type="number" id="sat-kill" class="compact-input" min="0" value="${getVal('sat-kill')}" oninput="updateAll()"></div><div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.dth_lvl}</span></div><select id="sat-alvl" class="compact-input" onchange="updateAll()">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i+1==(getVal('sat-alvl')||8)?'selected':''}>Lv ${i+1}</option>`).join('')}</select></div><div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.dth_cnt}</span><span class="item-score-tag" id="pts-dth">0</span></div><input type="number" id="sat-dth" class="compact-input" min="0" value="${getVal('sat-dth')}" oninput="updateAll()"></div>`;
    }
    html += `</div>`;
    container.innerHTML = html;
}

window.saveAllData = function() {
    const inputs = document.querySelectorAll('.compact-input');
    const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}');
    inputs.forEach(input => { if(input.id) data[input.id] = input.value; });
    localStorage.setItem('lastwar_data', JSON.stringify(data));
};

function initCalc() {
    if (!localStorage.getItem('tech_init_v3')) {
        const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}');
        data['t-expert'] = 20;
        data['t-radar'] = 6;
        data['t-spd'] = 6;
        data['t-rec'] = 6;
        data['t-con'] = 1;
        data['t-tec'] = 1;
        data['t-trn'] = 6;
        data['t-kil'] = 6;
        localStorage.setItem('lastwar_data', JSON.stringify(data));
        localStorage.setItem('tech_init_v3', 'true');
    }

    const t = i18n[window.currentLang];
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme + '-theme';

    const uiMap = {
        'nav-calc': t.nav.calc, 'nav-board': t.nav.board, 'nav-qna': t.nav.qna,
        'target-2300000': t.targets.t6, 'target-3600000': t.targets.t8, 'target-7200000': t.targets.t9,
        'tech-title': `🔬 ${t.modal.tech.toUpperCase()}`, 'tech-open-btn': t.modal.btn_open,
        'tech-modal-title': t.modal.tech, 'tech-confirm-btn': t.modal.btn_confirm,
        'drone-modal-title': t.modal.drone, 'drone-confirm-btn': t.modal.btn_confirm,
        'hero-modal-title': t.modal.hero, 'hero-confirm-btn': t.modal.btn_confirm,
        'weekly-modal-title': t.modal.weekly, 'weekly-close-btn': t.modal.btn_close,
        'spd-cancel-btn': t.modal.btn_cancel, 'spd-apply-btn': t.modal.btn_apply,
        'label-m5': t.labels.m5, 'label-m15': t.labels.m15, 'label-h1': t.labels.h1, 'label-h3': t.labels.h3, 'label-h8': t.labels.h8,
        'label-ur': t.labels.ur, 'label-ssr': t.labels.ssr, 'label-sr': t.labels.sr
    };
    Object.keys(uiMap).forEach(id => { const el = document.getElementById(id); if(el) el.innerText = uiMap[id]; });

    const techGrid = document.getElementById('tech-inputs');
    if(techGrid) {
        const techs = [
            {id:'t-expert', l:t.expert, def: 20, max: 20},
            {id:'t-radar', l:t.radar, def: 6, max: 10},
            {id:'t-spd', l:t.spd, def: 6, max: 10},
            {id:'t-rec', l:t.rec, def: 6, max: 10},
            {id:'t-con', l:t.con, def: 1, max: 10},
            {id:'t-tec', l:t.tec, def: 1, max: 10},
            {id:'t-trn', l:t.trn, def: 6, max: 10},
            {id:'t-kil', l:t.kil, def: 6, max: 10}
        ];
        
        const savedData = JSON.parse(localStorage.getItem('lastwar_data') || '{}');
        
        techGrid.innerHTML = techs.map(item => {
            let currentVal = savedData[item.id] !== undefined ? parseInt(savedData[item.id]) : item.def;
            if(currentVal > item.max) currentVal = item.max; 
            
            return `<div class="tech-item"><label style="font-size:0.85rem; margin-bottom:5px; font-weight:700;">${item.l}</label><select id="${item.id}" class="compact-input" onchange="updateAll()">${Array.from({length:item.max + 1},(_,i)=>`<option value="${i}" ${i===currentVal?'selected':''}>Lv ${i}</option>`).join('')}</select></div>`;
        }).join('');
    }

    const dayTabs = document.getElementById('day-tabs-container');
    if(dayTabs) {
        dayTabs.innerHTML = ['mon','tue','wed','thu','fri','sat'].map((d, i) => `<button id="btn-${d}" class="day-btn ${d===window.currentDay?'active':''}" style="background:var(--${d})" onclick="switchTab('${d}')">${t.days[i]}</button>`).join('');
    }

    renderDroneInputs();
    renderInputs(); 
    updateAll();
}

window.onload = () => initCalc();
window.validatePos = function(el) { if (el.value < 0) el.value = 0; };
