// 전역 변수 설정
window.currentLang = 'ko';
window.currentDay = 'mon';
window.targetScore = 7200000;
window.activeSpdId = '';

const i18n = {
    ko: {
        nav: { calc: "📊 계산기", board: "📱 피드", qna: "💬 건의" },
        targets: { t6: "6상", t8: "8상", t9: "9상" },
        goal: "🎯 목표 설정", boxes: "상자", tech: "🔬 테크 현황",
        expert: "🏆 대결 전문가", radar: "📡 추당-레이더", spd: "⏱️ 추당-가속", rec: "🎫 추당-모집", con: "🏰 추당-건설", tec: "🔬 추당-테크", trn: "⚔️ 추당-훈련", kil: "🔥 추당-적처치",
        days: ["월", "화", "수", "목", "금", "토"],
        rem: "남은 점수", success: "🎉 목표 달성 완료!",
        modal: { title: "가속 계산기", total: "총", apply: "적용하기", cancel: "취소", btn_open: "가속 아이템 입력" },
        units: { day: "일", hour: "시", min: "분" },
        inputs: {
            dia: "💎 다이아 구매", radar_task: "📡 레이더 임무", stam: "⚡ 체력 소모", exp: "⭐ 영웅 경험치(1M)", part: "⚙️ 드론 부품", data: "💾 드론 데이터(1k)", food: "🌾 식량 채집(h)", iron: "🪨 철광 채집(h)", gold: "🪙 금화 채집(h)",
            truck: "🚚 UR 화물차", sec: "🕵️ UR 은밀 임무", surv: "🎫 생존자 모집", build_spd: "⏱️ 건설 가속(h)", pow_con: "🏰 건물 전투력(1k)",
            tec_spd: "⏱️ 테크 가속(h)", pow_tec: "🔬 테크 전투력(1k)", medal: "🏅 명예 훈장 소모",
            tkt: "🎫 영웅 모집", ur: "🧩 UR 조각", ssr: "🧩 SSR 조각", sr: "🧩 SR 조각", sk: "🏅 스킬 훈장",
            trn_spd: "⏱️ 훈련 가속(h)", trn_cnt: "⚔️ 훈련 수", trn_lvl: "🎯 훈련 레벨",
            kill_spd: "⏱️ 모든 가속(h)", kill_target: "⚔️ 처치 대상", kill_lvl: "🎯 처치 레벨", kill_cnt: "🔥 처치 수", dth_lvl: "💀 전사 레벨", dth_cnt: "🩸 전사 수",
            target_spec: "특정 매칭 연맹", target_gen: "일반 적군"
        }
    },
    en: {
        nav: { calc: "📊 Calc", board: "📱 Feed", qna: "💬 Q&A" },
        targets: { t6: "6 Boxes", t8: "8 Boxes", t9: "9 Boxes" },
        goal: "🎯 DAILY GOAL", boxes: "Boxes", tech: "🔬 ALLIANCE TECH",
        expert: "🏆 VS Expert", radar: "📡 Radar Task", spd: "⏱️ Spd-Up Task", rec: "🎫 Recruit Task", con: "🏰 Build Task", tec: "🔬 Tech Task", trn: "⚔️ Train Task", kil: "🔥 Kill Task",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        rem: "Remaining", success: "🎉 Goal Achieved!",
        modal: { title: "Speed-up Calculator", total: "Total", apply: "Apply", cancel: "Cancel", btn_open: "Input Speed-up Items" },
        units: { day: "d", hour: "h", min: "m" },
        inputs: {
            dia: "💎 Buy Diamonds", radar_task: "📡 Radar Tasks", stam: "⚡ Stamina Used", exp: "⭐ Hero EXP (1M)", part: "⚙️ Drone Parts", data: "💾 Drone Data (1k)", food: "🌾 Food Gather(h)", iron: "🪨 Iron Gather(h)", gold: "🪙 Gold Gather(h)",
            truck: "🚚 UR Truck", sec: "🕵️ UR Secret Task", surv: "🎫 Survivor Recruit", build_spd: "⏱️ Build Spd-up(h)", pow_con: "🏰 Build Power(1k)",
            tec_spd: "⏱️ Tech Spd-up(h)", pow_tec: "🔬 Tech Power(1k)", medal: "🏅 Honor Medals",
            tkt: "🎫 Hero Recruit", ur: "🧩 UR Shards", ssr: "🧩 SSR Shards", sr: "🧩 SR Shards", sk: "🏅 Skill Medals",
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

function formatTime(minutes) {
    const t = i18n[window.currentLang].units;
    const d = Math.floor(minutes / 1440);
    const h = Math.floor((minutes % 1440) / 60);
    const m = Math.round(minutes % 60);
    return `${d}${t.day} ${h}${t.hour} ${m}${t.min}`;
}

window.validatePos = function(el) { if (el.value < 0) el.value = 0; };

window.openSpdModal = function(id, label) {
    window.activeSpdId = id;
    document.getElementById('spd-title').innerText = `가속 계산기 (${label})`;
    document.getElementById('spdModal').classList.add('active');
    ['m5','m15','h1','h3','h8'].forEach(k => { document.getElementById(k).value = 0; });
    calcSpdTotal();
};

window.closeSpdModal = function() { document.getElementById('spdModal').classList.remove('active'); };

window.openTechModal = function() { document.getElementById('techModal').classList.add('active'); };

window.closeTechModal = function() { document.getElementById('techModal').classList.remove('active'); updateAll(); };

window.calcSpdTotal = function() {
    const t = i18n[window.currentLang].modal;
    const total = (val('m5')*5) + (val('m15')*15) + (val('h1')*60) + (val('h3')*180) + (val('h8')*480);
    document.getElementById('spd-result-text').innerText = `${t.total}: ${formatTime(total)}`;
    return total;
};

window.applySpd = function() {
    const totalMin = calcSpdTotal();
    const hours = (totalMin / 60).toFixed(2);
    const targetInput = document.getElementById(`${window.currentDay}-${window.activeSpdId}`);
    if(targetInput) {
        targetInput.value = hours;
        updateAll();
    }
    closeSpdModal();
};

function val(id) { let el = document.getElementById(id); return el ? parseFloat(el.value) || 0 : 0; }
function getM(subId) { let e = val('t-expert') * 0.05, s = val(subId) * 0.05; return { all: 1 + e, sub: 1 + e + s }; }

window.saveAllData = function() {
    const inputs = document.querySelectorAll('.compact-input');
    const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}');
    inputs.forEach(input => { data[input.id] = input.value; });
    localStorage.setItem('lastwar_data', JSON.stringify(data));
};

window.loadAllData = function() {
    const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}');
    const inputs = document.querySelectorAll('.compact-input');
    inputs.forEach(input => { if (data[input.id] !== undefined) { input.value = data[input.id]; } });
};

window.resetDayData = function() {
    const dayNames = { mon: "월요일", tue: "화요일", wed: "수요일", thu: "목요일", fri: "금요일", sat: "토요일" };
    if(confirm(`${dayNames[window.currentDay]} 데이터를 초기화하시겠습니까?`)) {
        const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}');
        const inputs = document.querySelectorAll('.compact-input');
        inputs.forEach(input => { input.value = 0; delete data[input.id]; });
        localStorage.setItem('lastwar_data', JSON.stringify(data));
        updateAll();
        alert(`${dayNames[window.currentDay]} 데이터가 초기화되었습니다.`);
    }
};

window.switchTab = function(day) {
    window.currentDay = day;
    document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById('btn-' + day);
    if(activeBtn) activeBtn.classList.add('active');
    renderInputs();
    loadAllData();
    updateAll();
};

window.updateAll = function() {
    const d = window.currentDay;
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
        const squadCount = val('mon-squads');
        const hourlyGather = val('mon-gather');
        setPt('gather', hourlyGather * squadCount * BASE.h_gather * m.exp.all);
    } else if(d==='tue') {
        setPt('truck', val('tue-truck')*BASE.truck*m.exp.all);
        setPt('sec', val('tue-sec')*BASE.secret*m.exp.all);
        setPt('surv', val('tue-surv')*BASE.surv*m.exp.all);
        let sMin = val('tue-spd')*60; setPt('spd', sMin*BASE.spd_min*m.spd.sub);
        setPt('pow', val('tue-pow')*1000*BASE.pow_pt*m.con.sub);
    } else if(d==='wed') {
        setPt('radar', val('wed-radar')*BASE.radar*m.rad.sub);
        let sMin = val('wed-spd')*60; setPt('spd', sMin*BASE.spd_min*m.spd.sub);
        setPt('pow', val('wed-pow')*1000*BASE.pow_pt*m.tec.sub);
        setPt('mdl', val('wed-mdl')*BASE.honor_medal*m.exp.all);
    } else if(d==='thu') {
        setPt('tkt', val('thu-tkt')*BASE.recruit*m.rec.sub);
        setPt('ur', val('thu-ur')*BASE.ur_shard*m.exp.all);
        setPt('ssr', val('thu-ssr')*BASE.ssr_shard*m.exp.all);
        setPt('sr', val('thu-sr')*BASE.sr_shard*m.exp.all);
        setPt('sk', val('thu-sk')*BASE.skill_medal*m.exp.all);
        setPt('exp', val('thu-exp')*1000000*BASE.exp_unit*m.exp.all);
    } else if(d==='fri') {
        setPt('radar', val('fri-radar')*BASE.radar*m.rad.sub);
        let sCon = val('fri-spd-con')*60; setPt('spd-con', sCon*BASE.spd_min*m.spd.sub);
        let sTec = val('fri-spd-tec')*60; setPt('spd-tec', sTec*BASE.spd_min*m.spd.sub);
        let sTrn = val('fri-spd-trn')*60; setPt('spd-trn', sTrn*BASE.spd_min*m.spd.sub);
        setPt('pow-con', val('fri-pow-con')*1000*BASE.pow_pt*m.con.sub);
        setPt('pow-tec', val('fri-pow-tec')*1000*BASE.pow_pt*m.tec.sub);
        setPt('count', val('fri-count')*BASE.trp[val('fri-lvl')]*m.trn.sub);
    } else if(d==='sat') {
        setPt('truck', val('sat-truck')*BASE.truck*m.exp.all);
        setPt('sec', val('sat-sec')*BASE.secret*m.exp.all);
        let sAll = val('sat-spd-all')*60; setPt('spd-all', sAll*BASE.spd_min*m.spd.sub);
        let kType = document.getElementById('sat-target').value;
        let kScore = kType === 'special' ? BASE.kil_spec[val('sat-elvl')] : BASE.kil_gen[val('sat-elvl')];
        setPt('kill', val('sat-kill')*kScore*m.kil.sub);
        setPt('dth', val('sat-dth')*BASE.trp[val('sat-alvl')]*m.exp.all);
    }

    saveAllData();

    const pct = Math.min(100, (totalScore / window.targetScore) * 100);
    const scoreEl = document.getElementById('score');
    if(scoreEl) scoreEl.innerText = totalScore.toLocaleString();
    const barEl = document.getElementById('bar');
    if(barEl) barEl.style.width = pct + '%';
    const pctTextEl = document.getElementById('pct-text');
    if(pctTextEl) pctTextEl.innerText = Math.floor(pct) + '%';
    const boxStatusEl = document.getElementById('box-status');
    const currentBox = Math.floor(totalScore / (window.targetScore / 9));
    if(boxStatusEl) boxStatusEl.innerText = `${Math.min(9, currentBox)} / 9`;
    const diffEl = document.getElementById('diff');
    const rem = window.targetScore - totalScore;
    if(diffEl) diffEl.innerText = rem > 0 ? `남은 점수: ${rem.toLocaleString()}` : "목표 달성 완료! 🎉";
};

function renderInputs() {
    const t = i18n[window.currentLang];
    const container = document.getElementById('input-container');
    const dayNames = { mon: "월요일", tue: "화요일", wed: "수요일", thu: "목요일", fri: "금요일", sat: "토요일" };
    
    const config = { 
        mon:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'stam',l:t.inputs.stam},{id:'exp',l:t.inputs.exp},{id:'part',l:t.inputs.part},{id:'data',l:t.inputs.data}], 
        tue:[{id:'dia',l:t.inputs.dia},{id:'truck',l:t.inputs.truck},{id:'sec',l:t.inputs.sec},{id:'surv',l:t.inputs.surv},{id:'spd',l:t.inputs.build_spd,isSpd:true},{id:'pow',l:t.inputs.pow_con}], 
        wed:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'spd',l:t.inputs.tec_spd,isSpd:true},{id:'pow',l:t.inputs.pow_tec},{id:'mdl',l:t.inputs.medal}], 
        thu:[{id:'dia',l:t.inputs.dia},{id:'tkt',l:t.inputs.tkt},{id:'ur',l:t.inputs.ur},{id:'ssr',l:t.inputs.ssr},{id:'sr',l:t.inputs.sr},{id:'sk',l:t.inputs.sk},{id:'exp',l:t.inputs.exp}], 
        fri:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'spd-con',l:t.inputs.build_spd,isSpd:true},{id:'spd-tec',l:t.inputs.tec_spd,isSpd:true},{id:'spd-trn',l:t.inputs.trn_spd,isSpd:true},{id:'pow-con',l:t.inputs.pow_con},{id:'pow-tec',l:t.inputs.pow_tec}], 
        sat:[{id:'dia',l:t.inputs.dia},{id:'truck',l:t.inputs.truck},{id:'sec',l:t.inputs.sec},{id:'spd-all',l:t.inputs.kill_spd,isSpd:true}] 
    };

    let html = `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <div class="section-title" style="margin:0;">📊 ${window.currentDay.toUpperCase()} INPUT</div>
        <button onclick="resetDayData()" class="btn-secondary" style="background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 10px; font-size: 0.75rem; font-weight: 800; border-radius: 8px; cursor:pointer;">${dayNames[window.currentDay]} 초기화</button>
    </div><div class="input-grid">`;

    if(window.currentDay === 'mon') {
        html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">🚜 채집 부대 수</span></div>
            <select id="mon-squads" class="compact-input" onchange="updateAll()">
                ${[1,2,3,4,5].map(n => `<option value="${n}">${n}부대</option>`).join('')}
            </select></div>
            <div class="input-group-compact"><div class="input-header"><span class="input-label-small">⏱️ 시간당 채집(h)</span><span class="item-score-tag" id="pts-gather">0</span></div>
            <input type="number" id="mon-gather" class="compact-input" value="0" min="0" oninput="validatePos(this); updateAll()"></div>`;
    }

    (config[window.currentDay] || []).forEach(i => {
        html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">${i.l}</span><span class="item-score-tag" id="pts-${i.id}">0</span></div>
            <input type="number" id="${window.currentDay}-${i.id}" class="compact-input" value="0" min="0" oninput="validatePos(this); updateAll()">
            ${i.isSpd ? `<button class="spd-btn-mini" onclick="openSpdModal('${i.id}','${i.l}')">${t.modal.btn_open}</button>` : ''}</div>`;
    });

    if(window.currentDay === 'fri') {
        html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.trn_lvl}</span></div>
            <select id="fri-lvl" class="compact-input" onchange="updateAll()">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i===7?'selected':''}>Lv ${i+1}</option>`).join('')}</select></div>
            <div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.trn_cnt}</span><span class="item-score-tag" id="pts-count">0</span></div>
            <input type="number" id="fri-count" class="compact-input" value="0" min="0" oninput="validatePos(this); updateAll()"></div>`;
    }

    if(window.currentDay === 'sat') {
        html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.kill_target}</span></div>
            <select id="sat-target" class="compact-input" onchange="updateAll()"><option value="special">${t.inputs.target_spec}</option><option value="general">${t.inputs.target_gen}</option></select></div>
            <div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.kill_lvl}</span></div>
            <select id="sat-elvl" class="compact-input" onchange="updateAll()">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i===7?'selected':''}>Lv ${i+1}</option>`).join('')}</select></div>
            <div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.kill_cnt}</span><span class="item-score-tag" id="pts-kill">0</span></div>
            <input type="number" id="sat-kill" class="compact-input" value="0" min="0" oninput="validatePos(this); updateAll()"></div>
            <div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.dth_lvl}</span></div>
            <select id="sat-alvl" class="compact-input" onchange="updateAll()">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i===7?'selected':''}>Lv ${i+1}</option>`).join('')}</select></div>
            <div class="input-group-compact"><div class="input-header"><span class="input-label-small">${t.inputs.dth_cnt}</span><span class="item-score-tag" id="pts-dth">0</span></div>
            <input type="number" id="sat-dth" class="compact-input" value="0" min="0" oninput="validatePos(this); updateAll()"></div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
}

function initCalc() {
    const t = i18n[window.currentLang];
    const navCalc = document.getElementById('nav-calc');
    const navBoard = document.getElementById('nav-board');
    const navQna = document.getElementById('nav-qna');
    if(navCalc) navCalc.innerText = t.nav.calc;
    if(navBoard) navBoard.innerText = t.nav.board;
    if(navQna) navQna.innerText = t.nav.qna;
    const btn6 = document.getElementById('target-2300000');
    const btn8 = document.getElementById('target-3600000');
    const btn9 = document.getElementById('target-7200000');
    if(btn6) btn6.innerText = t.targets.t6;
    if(btn8) btn8.innerText = t.targets.t8;
    if(btn9) btn9.innerText = t.targets.t9;
    const grid = document.getElementById('tech-inputs');
    if(grid) {
        const techs = [{id:'t-expert',l:t.expert,v:20},{id:'t-radar',l:t.radar,v:6},{id:'t-spd',l:t.spd,v:6},{id:'t-rec',l:t.rec,v:6},{id:'t-con',l:t.con,v:1},{id:'t-tec',l:t.tec,v:1},{id:'t-trn',l:t.trn,v:6},{id:'t-kil',l:t.kil,v:6}];
        grid.innerHTML = techs.map(item => `<div class="tech-item"><label>${item.l}</label><select id="${item.id}" onchange="updateAll()">${Array.from({length:21},(_,i)=>`<option value="${i}" ${i===item.v?'selected':''}>Lv ${i} (+${i*5}%)</option>`).join('')}</select></div>`).join('');
    }
    const dayTabs = document.getElementById('day-tabs-container');
    if(dayTabs) {
        const days = ['mon','tue','wed','thu','fri','sat'];
        dayTabs.innerHTML = days.map((d, i) => `<button id="btn-${d}" class="day-btn ${d===window.currentDay?'active':''}" style="background:var(--${d})" onclick="switchTab('${d}')">${t.days[i]}</button>`).join('');
    }
    renderInputs();
    updateAll();
}

window.onload = () => { initCalc(); loadLiveView('posts'); loadLiveView('suggestions'); };
