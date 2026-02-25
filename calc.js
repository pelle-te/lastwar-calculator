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
            tech: "연맹 테크 설정", spd: "가속 계산기", drone: "드론 파츠 상자 입력", hero: "영웅 조각 입력",
            btn_close: "확인", btn_apply: "적용", btn_cancel: "취소", btn_open: "입력하기" 
        },
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
            tech: "Alliance Tech", spd: "Speed-up Calc", drone: "Drone Parts Input", hero: "Hero Shards Input",
            btn_close: "Confirm", btn_apply: "Apply", btn_cancel: "Cancel", btn_open: "Input" 
        },
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

// [수정] 언어 변경 함수 정의 (window 객체에 할당하여 index.html에서 호출 가능하게 함)
window.changeLang = function(lang) {
    window.currentLang = lang;
    const koBtn = document.getElementById('lang-ko');
    const enBtn = document.getElementById('lang-en');
    
    // 버튼 색상 업데이트
    if(koBtn) koBtn.style.color = lang === 'ko' ? 'var(--primary)' : '#94a3b8';
    if(enBtn) enBtn.style.color = lang === 'en' ? 'var(--primary)' : '#94a3b8';
    
    initCalc(); // UI 다시 그리기
};

function getVal(cid) {
    const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}');
    if (data[cid] !== undefined) return data[cid];
    return cid === 'mon-squads' ? "1" : "0";
}

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
    const msg = window.currentLang === 'ko' ? "고정 설정(2부대 24시간, 레이더 82 등)을 적용하시겠습니까?" : "Apply fixed settings?";
    if(confirm(msg)) {
        const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}');
        data['mon-squads'] = "2";
        data['mon-gather'] = "24";
        ['mon','tue','wed','thu','fri','sat'].forEach(d => {
            data[`${d}-radar`] = "82";
            if(d === 'tue' || d === 'sat') {
                data[`${d}-truck`] = "4";
                data[`${d}-sec`] = "7";
            }
        });
        localStorage.setItem('lastwar_data', JSON.stringify(data));
        renderInputs();
        updateAll();
    }
};

window.resetDayData = function() {
    const msg = window.currentLang === 'ko' ? "데이터를 0으로 초기화하시겠습니까?" : "Reset data to 0?";
    if(confirm(msg)) {
        const data = JSON.parse(localStorage.getItem('lastwar_data') || '{}');
        const prefix = window.currentDay + '-';
        Object.keys(data).forEach(key => {
            if(key.startsWith(prefix)) data[key] = key.includes('squads') ? "1" : "0";
        });
        localStorage.setItem('lastwar_data', JSON.stringify(data));
        renderInputs();
        updateAll();
    }
};

// 모달 제어 함수
window.openTechModal = () => document.getElementById('techModal')?.classList.add('active');
window.closeTechModal = () => { document.getElementById('techModal')?.classList.remove('active'); updateAll(); };
window.openDroneModal = () => document.getElementById('droneModal')?.classList.add('active');
window.closeDroneModal = () => document.getElementById('droneModal')?.classList.remove('active');
window.openHeroModal = () => document.getElementById('heroModal')?.classList.add('active');
window.closeHeroModal = () => document.getElementById('heroModal')?.classList.remove('active');
window.openSpdModal = (cid, label) => { 
    window.activeSpdId = cid; 
    const titleEl = document.getElementById('spd-title');
    if(titleEl) titleEl.innerText = label; 
    document.getElementById('spdModal')?.classList.add('active'); 
};
window.closeSpdModal = () => document.getElementById('spdModal')?.classList.remove('active');

function val(id) { let el = document.getElementById(id); return el ? parseFloat(el.value) || 0 : 0; }
function getM(subId) { let e = val('t-expert') * 0.05, s = val(subId) * 0.05; return { all: 1 + e, sub: 1 + e + s }; }

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
    const pctEl = document.getElementById('pct-text');
    if(pctEl) pctEl.innerText = Math.floor(pct) + '%';
    const boxEl = document.getElementById('box-status');
    if(boxEl) boxEl.innerText = `${Math.min(9, Math.floor(totalScore / (window.targetScore / 9)))} / 9`;
    const diffEl = document.getElementById('diff');
    const rem = window.targetScore - totalScore;
    if(diffEl) diffEl.innerText = rem > 0 ? `${t.result.remain}: ${rem.toLocaleString()}` : t.success;

    const labels = document.querySelectorAll('.info-label');
    if(labels.length >= 2) {
        labels[0].innerText = t.result.score;
        labels[1].innerText = t.result.box;
    }
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
        html += `<div class="input-group-compact" style="grid-column: span 2;"><div class="input-header"><span class="input-label-small">📦 드론 파츠 상자</span><span class="item-score-tag" id="pts-drone-box">0</span></div><button class="spd-btn-mini" style="width:100%; margin-top:5px;" onclick="openDroneModal()">${t.modal.btn_open}</button></div>`;
    }
    if(window.currentDay === 'thu') {
        html += `<div class="input-group-compact" style="grid-column: span 2;"><div class="input-header"><span class="input-label-small">🧩 영웅 조각</span><span class="item-score-tag" id="pts-hero-shard">0</span></div><button class="spd-btn-mini" style="width:100%; margin-top:5px;" onclick="openHeroModal()">${t.modal.btn_open}</button></div>`;
    }

    (config[window.currentDay] || []).forEach(i => {
        const cid = `${window.currentDay}-${i.id}`;
        html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">${i.l}</span><span class="item-score-tag" id="pts-${i.id}">0</span></div><input type="number" id="${cid}" class="compact-input" value="${getVal(cid)}" oninput="updateAll()">${i.isSpd ? `<button class="spd-btn-mini" onclick="openSpdModal('${cid}','${i.l}')">${t.modal.btn_open}</button>` : ''}</div>`;
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
    
    // 네비게이션 번역
    const navCalc = document.getElementById('nav-calc');
    const navBoard = document.getElementById('nav-board');
    const navQna = document.getElementById('nav-qna');
    if(navCalc) navCalc.innerText = t.nav.calc;
    if(navBoard) navBoard.innerText = t.nav.board;
    if(navQna) navQna.innerText = t.nav.qna;

    // 목표 점수 버튼 번역
    const t6 = document.getElementById('target-2300000');
    const t8 = document.getElementById('target-3600000');
    const t9 = document.getElementById('target-7200000');
    if(t6) t6.innerText = t.targets.t6;
    if(t8) t8.innerText = t.targets.t8;
    if(t9) t9.innerText = t.targets.t9;

    // 모달 제목 번역
    const tt = document.getElementById('tech-title');
    if(tt) tt.innerText = `🔬 ${t.modal.tech.toUpperCase()}`;
    const mt = document.getElementById('tech-modal-title');
    if(mt) mt.innerText = t.modal.tech;
    const dt = document.getElementById('drone-modal-title');
    if(dt) dt.innerText = t.modal.drone;
    const ht = document.getElementById('hero-modal-title');
    if(ht) ht.innerText = t.modal.hero;

    // 연맹 테크 그리드 생성
    const grid = document.getElementById('tech-inputs');
    if(grid) {
        const techs = [{id:'t-expert',l:t.expert,v:20},{id:'t-radar',l:t.radar,v:6},{id:'t-spd',l:t.spd,v:6},{id:'t-rec',l:t.rec,v:6},{id:'t-con',l:t.con,v:1},{id:'t-tec',l:t.tec,v:1},{id:'t-trn',l:t.trn,v:6},{id:'t-kil',l:t.kil,v:6}];
        grid.innerHTML = techs.map(item => `<div class="tech-item"><label>${item.l}</label><select id="${item.id}" onchange="updateAll()">${Array.from({length:21},(_,i)=>`<option value="${i}" ${i===item.v?'selected':''}>Lv ${i} (+${i*5}%)</option>`).join('')}</select></div>`).join('');
    }
    
    // 요일 탭 생성
    const dayTabs = document.getElementById('day-tabs-container');
    if(dayTabs) {
        const days = ['mon','tue','wed','thu','fri','sat'];
        dayTabs.innerHTML = days.map((d, i) => `<button id="btn-${d}" class="day-btn ${d===window.currentDay?'active':''}" style="background:var(--${d})" onclick="switchTab('${d}')">${t.days[i]}</button>`).join('');
    }
    
    renderInputs();
    updateAll();
}

window.onload = () => { 
    initCalc(); 
    if(typeof loadLiveView === 'function') {
        loadLiveView('posts'); 
        loadLiveView('suggestions'); 
    }
};

window.validatePos = function(el) { if (el.value < 0) el.value = 0; };
window.calcSpdTotal = function() {
    const t = i18n[window.currentLang].modal;
    const total = (val('m5')*5) + (val('m15')*15) + (val('h1')*60) + (val('h3')*180) + (val('h8')*480);
    const d = Math.floor(total / 1440);
    const h = Math.floor((total % 1440) / 60);
    const m = Math.round(total % 60);
    const unit = i18n[window.currentLang].units;
    const resText = document.getElementById('spd-result-text');
    if(resText) resText.innerText = `${t.total}: ${d}${unit.day} ${h}${unit.hour} ${m}${unit.min}`;
    return total;
};
window.applySpd = function() {
    const totalMin = window.calcSpdTotal();
    const targetInput = document.getElementById(window.activeSpdId);
    if(targetInput) { targetInput.value = (totalMin / 60).toFixed(2); updateAll(); }
    window.closeSpdModal();
};
