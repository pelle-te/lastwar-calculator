let currentLang = 'ko';
let currentDay = 'mon';
let targetScore = 7200000;
let activeSpdId = '';

const i18n = {
    ko: {
        goal: "🎯 목표 설정", boxes: "상자", tech: "🔬 테크 현황",
        expert: "🏆 대결 전문가", radar: "📡 추당-레이더", spd: "⏱️ 추당-가속", rec: "🎫 추당-모집", con: "🏰 추당-건설", tec: "🔬 추당-테크", trn: "⚔️ 추당-훈련", kil: "🔥 추당-적처치",
        days: ["월", "화", "수", "목", "금", "토"],
        rem: "남은 점수", success: "🎉 목표 달성 완료!",
        inputs: {
            dia: "💎 다이아 구매", radar_task: "📡 레이더 임무", stam: "⚡ 체력 소모", exp: "⭐ 영웅 경험치(1M)", part: "⚙️ 드론 부품", data: "💾 드론 데이터(1k)", food: "🌾 식량 채집(h)", iron: "🪨 철광 채집(h)", gold: "🪙 금화 채집(h)",
            truck: "🚚 UR 화물차", sec: "🕵️ UR 은밀 임무", surv: "🎫 생존자 모집", build_spd: "⏱️ 건설 가속(h)", pow_con: "🏰 건물 전투력(1k)",
            tec_spd: "⏱️ 테크 가속(h)", pow_tec: "🔬 테크 전투력(1k)", medal: "🏅 명예 훈장 소모",
            tkt: "🎫 영웅 모집", ur: "🧩 UR 조각", ssr: "🧩 SSR 조각", sr: "🧩 SR 조각", sk: "🏅 스킬 훈장",
            trn_spd: "⏱️ 훈련 가속(h)", trn_cnt: "⚔️ 훈련 수", trn_lvl: "🎯 훈련 레벨",
            kill_spd: "⏱️ 모든 가속(h)", kill_target: "⚔️ 처치 대상", kill_lvl: "🎯 처치 레벨", kill_cnt: "🔥 처치 수", dth_lvl: "💀 전사 레벨", dth_cnt: "🩸 전사 수",
            target_spec: "특정 매칭 연맹", target_gen: "일반 적군"
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

function formatTime(minutes) {
    const d = Math.floor(minutes / 1440);
    const h = Math.floor((minutes % 1440) / 60);
    const m = Math.round(minutes % 60);
    return `${d}일 ${h}시 ${m}분`;
}

function openSpdModal(id, label) {
    activeSpdId = id;
    document.getElementById('spd-title').innerText = label;
    document.getElementById('spdModal').style.display = 'block';
    ['m5','m15','h1','h3','h8'].forEach(k => { document.getElementById(k).value = 0; });
    calcSpdTotal();
}
function closeSpdModal() { document.getElementById('spdModal').style.display = 'none'; }

function calcSpdTotal() {
    const total = (val('m5')*5) + (val('m15')*15) + (val('h1')*60) + (val('h3')*180) + (val('h8')*480);
    document.getElementById('spd-result-text').innerText = `총: ${formatTime(total)}`;
    return total;
}

function applySpd() {
    const totalMin = calcSpdTotal();
    const hours = (totalMin / 60).toFixed(2);
    const targetInput = document.getElementById(`${currentDay}-${activeSpdId}`);
    if(targetInput) {
        targetInput.value = hours;
        updateAll();
    }
    closeSpdModal();
}

function initCalc() {
    const t = i18n[currentLang];
    const grid = document.getElementById('tech-inputs');
    const techs = [
        {id:'t-expert',l:t.expert,v:20},{id:'t-radar',l:t.radar,v:6},{id:'t-spd',l:t.spd,v:6},{id:'t-rec',l:t.rec,v:6},
        {id:'t-con',l:t.con,v:1},{id:'t-tec',l:t.tec,v:1},{id:'t-trn',l:t.trn,v:6},{id:'t-kil',l:t.kil,v:6}
    ];
    grid.innerHTML = techs.map(item => `<div class="tech-item"><label>${item.l}</label><select id="${item.id}" onchange="updateAll()">${Array.from({length:21},(_,i)=>`<option value="${i}" ${i===item.v?'selected':''}>Lv ${i} (+${i*5}%)</option>`).join('')}</select></div>`).join('');
    
    const dayTabs = document.getElementById('day-tabs-container');
    const days = ['mon','tue','wed','thu','fri','sat'];
    dayTabs.innerHTML = days.map((d, i) => `<button id="btn-${d}" class="day-btn ${d===currentDay?'active':''}" style="background:var(--${d})" onclick="switchTab('${d}')">${t.days[i]}</button>`).join('');
    
    renderInputs();
    updateAll();
}

function switchTab(day) { 
    currentDay = day; 
    document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-'+day).classList.add('active'); 
    renderInputs(); 
    updateAll(); 
}

function renderInputs() {
    const t = i18n[currentLang];
    const container = document.getElementById('input-container');
    const config = { 
        mon:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'stam',l:t.inputs.stam},{id:'exp',l:t.inputs.exp},{id:'part',l:t.inputs.part},{id:'data',l:t.inputs.data},{id:'h-food',l:t.inputs.food},{id:'h-iron',l:t.inputs.iron},{id:'h-gold',l:t.inputs.gold}], 
        tue:[{id:'dia',l:t.inputs.dia},{id:'truck',l:t.inputs.truck},{id:'sec',l:t.inputs.sec},{id:'surv',l:t.inputs.surv},{id:'spd',l:t.inputs.build_spd,isSpd:true},{id:'pow',l:t.inputs.pow_con}], 
        wed:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'spd',l:t.inputs.tec_spd,isSpd:true},{id:'pow',l:t.inputs.pow_tec},{id:'mdl',l:t.inputs.medal}], 
        thu:[{id:'dia',l:t.inputs.dia},{id:'tkt',l:t.inputs.tkt},{id:'ur',l:t.inputs.ur},{id:'ssr',l:t.inputs.ssr},{id:'sr',l:t.inputs.sr},{id:'sk',l:t.inputs.sk},{id:'exp',l:t.inputs.exp}], 
        fri:[{id:'dia',l:t.inputs.dia},{id:'radar',l:t.inputs.radar_task},{id:'spd-con',l:t.inputs.build_spd,isSpd:true},{id:'spd-tec',l:t.inputs.tec_spd,isSpd:true},{id:'spd-trn',l:t.inputs.trn_spd,isSpd:true},{id:'pow-con',l:t.inputs.pow_con},{id:'pow-tec',l:t.inputs.pow_tec}], 
        sat:[{id:'dia',l:t.inputs.dia},{id:'truck',l:t.inputs.truck},{id:'sec',l:t.inputs.sec},{id:'spd-all',l:t.inputs.kill_spd,isSpd:true}] 
    };
    
    let html = `<div class="section-title">📊 ${currentDay.toUpperCase()} INPUT</div><div class="input-grid">`;
    (config[currentDay] || []).forEach(i => {
        html += `
            <div class="input-group-compact">
                <div class="input-header">
                    <span class="input-label-small">${i.l}</span>
                    <span class="item-score-tag" id="pts-${i.id}">0</span>
                </div>
                <input type="number" id="${currentDay}-${i.id}" class="compact-input" value="0" oninput="updateAll()">
                ${i.isSpd ? `<button class="spd-btn-mini" onclick="openSpdModal('${i.id}','${i.l}')">가속 아이템 입력</button><div class="time-display" id="time-${i.id}">0일 0시 0분</div>` : ''}
            </div>`;
    });
    
    // 금요일: 훈련 추가
    if(currentDay === 'fri') {
        html += `
        <div class="input-group-compact">
            <div class="input-header"><span class="input-label-small">${t.inputs.trn_lvl}</span><span class="item-score-tag" id="pts-lvl">Lv 8</span></div>
            <select id="fri-lvl" class="compact-input" onchange="updateAll()">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i===7?'selected':''}>Lv ${i+1}</option>`).join('')}</select>
        </div>
        <div class="input-group-compact">
            <div class="input-header"><span class="input-label-small">${t.inputs.trn_cnt}</span><span class="item-score-tag" id="pts-count">0</span></div>
            <input type="number" id="fri-count" class="compact-input" value="0" oninput="updateAll()">
        </div>`;
    }

    // 토요일: 처치 및 전사 추가
    if(currentDay === 'sat') {
        html += `
        <div class="input-group-compact">
            <div class="input-header"><span class="input-label-small">${t.inputs.kill_target}</span></div>
            <select id="sat-target" class="compact-input" onchange="updateAll()"><option value="special">${t.inputs.target_spec}</option><option value="general">${t.inputs.target_gen}</option></select>
        </div>
        <div class="input-group-compact">
            <div class="input-header"><span class="input-label-small">${t.inputs.kill_lvl}</span><span class="item-score-tag" id="pts-elvl">Lv 8</span></div>
            <select id="sat-elvl" class="compact-input" onchange="updateAll()">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i===7?'selected':''}>Lv ${i+1}</option>`).join('')}</select>
        </div>
        <div class="input-group-compact" style="grid-column: span 2;">
            <div class="input-header"><span class="input-label-small">${t.inputs.kill_cnt}</span><span class="item-score-tag" id="pts-kill">0</span></div>
            <input type="number" id="sat-kill" class="compact-input" value="0" oninput="updateAll()">
        </div>
        <div class="input-group-compact">
            <div class="input-header"><span class="input-label-small">${t.inputs.dth_lvl}</span><span class="item-score-tag" id="pts-alvl">Lv 8</span></div>
            <select id="sat-alvl" class="compact-input" onchange="updateAll()">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i===7?'selected':''}>Lv ${i+1}</option>`).join('')}</select>
        </div>
        <div class="input-group-compact">
            <div class="input-header"><span class="input-label-small">${t.inputs.dth_cnt}</span><span class="item-score-tag" id="pts-dth">0</span></div>
            <input type="number" id="sat-dth" class="compact-input" value="0" oninput="updateAll()">
        </div>`;
    }

    html += `</div>`;

    if(currentDay === 'wed') {
        html += `<div class="section-title" style="margin-top:20px">📦 ${t.boxes}</div><div class="input-grid">`;
        for(let i=1; i<=7; i++) {
            html += `<div class="input-group-compact"><div class="input-header"><span class="input-label-small">Lv.${i}</span><span class="item-score-tag" id="pts-b${i}">0</span></div><input type="number" id="wed-b${i}" class="compact-input" value="0" oninput="updateAll()"></div>`;
        }
        html += `</div>`;
    }
    
    container.innerHTML = html;
}

function val(id) { let el = document.getElementById(id); return el ? parseFloat(el.value) || 0 : 0; }
function getM(subId) { let e = val('t-expert') * 0.05, s = val(subId) * 0.05; return { all: 1 + e, sub: 1 + e + s }; }

function updateAll() {
    const d = currentDay;
    let totalScore = 0;
    let m = { 
        rad: getM('t-radar'), spd: getM('t-spd'), rec: getM('t-rec'), 
        con: getM('t-con'), tec: getM('t-tec'), trn: getM('t-trn'), 
        kil: getM('t-kil'), exp: getM('t-expert') 
    };

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
        setPt('h-food', val('mon-h-food')*BASE.h_gather*m.exp.all);
        setPt('h-iron', val('mon-h-iron')*BASE.h_gather*m.exp.all);
        setPt('h-gold', val('mon-h-gold')*BASE.h_gather*m.exp.all);
    } else if(d==='tue') {
        setPt('truck', val('tue-truck')*BASE.truck*m.exp.all);
        setPt('sec', val('tue-sec')*BASE.secret*m.exp.all);
        setPt('surv', val('tue-surv')*BASE.surv*m.exp.all);
        let sMin = val('tue-spd')*60; setPt('spd', sMin*BASE.spd_min*m.spd.sub);
        document.getElementById('time-spd').innerText = formatTime(sMin);
        setPt('pow', val('tue-pow')*1000*BASE.pow_pt*m.con.sub);
    } else if(d==='wed') {
        setPt('radar', val('wed-radar')*BASE.radar*m.rad.sub);
        let sMin = val('wed-spd')*60; setPt('spd', sMin*BASE.spd_min*m.spd.sub);
        document.getElementById('time-spd').innerText = formatTime(sMin);
        setPt('pow', val('wed-pow')*1000*BASE.pow_pt*m.tec.sub);
        setPt('mdl', val('wed-mdl')*BASE.honor_medal*m.exp.all);
        for(let i=1;i<=7;i++) setPt('b${i}', (val('wed-b'+i)||0)*BASE.boxes[i]*m.exp.all);
    } else if(d==='thu') {
        setPt('tkt', val('thu-tkt')*BASE.recruit*m.rec.sub);
        setPt('ur', val('thu-ur')*BASE.ur_shard*m.exp.all);
        setPt('ssr', val('thu-ssr')*BASE.ssr_shard*m.exp.all);
        setPt('sr', val('thu-sr')*BASE.sr_shard*m.exp.all);
        setPt('sk', val('thu-sk')*BASE.skill_medal*m.exp.all);
        setPt('exp', val('thu-exp')*1000000*BASE.exp_unit*m.exp.all);
    } else if(d==='fri') {
        setPt('radar', val('fri-radar')*BASE.radar*m.rad.sub);
        let sCon = val('fri-spd-con')*60; setPt('spd-con', sCon*BASE.spd_min*m.spd.sub); document.getElementById('time-spd-con').innerText = formatTime(sCon);
        let sTec = val('fri-spd-tec')*60; setPt('spd-tec', sTec*BASE.spd_min*m.spd.sub); document.getElementById('time-spd-tec').innerText = formatTime(sTec);
        let sTrn = val('fri-spd-trn')*60; setPt('spd-trn', sTrn*BASE.spd_min*m.spd.sub); document.getElementById('time-spd-trn').innerText = formatTime(sTrn);
        setPt('pow-con', val('fri-pow-con')*1000*BASE.pow_pt*m.con.sub);
        setPt('pow-tec', val('fri-pow-tec')*1000*BASE.pow_pt*m.tec.sub);
        setPt('count', val('fri-count')*BASE.trp[val('fri-lvl')]*m.trn.sub);
    } else if(d==='sat') {
        setPt('truck', val('sat-truck')*BASE.truck*m.exp.all);
        setPt('sec', val('sat-sec')*BASE.secret*m.exp.all);
        let sAll = val('sat-spd-all')*60; setPt('spd-all', sAll*BASE.spd_min*m.spd.sub); document.getElementById('time-spd-all').innerText = formatTime(sAll);
        let kType = document.getElementById('sat-target').value;
        let kLvl = val('sat-elvl');
        let kScore = kType === 'special' ? BASE.kil_spec[kLvl] : BASE.kil_gen[kLvl];
        setPt('kill', val('sat-kill')*kScore*m.kil.sub);
        setPt('dth', val('sat-dth')*BASE.trp[val('sat-alvl')]*m.exp.all);
    }

    document.getElementById('score').innerText = totalScore.toLocaleString(undefined, {maximumFractionDigits: 0});
    let pct = Math.min(100, (totalScore/targetScore)*100); 
    document.getElementById('bar').style.width = pct + '%';
    document.getElementById('diff').innerText = (targetScore-totalScore)>0 ? `${i18n[currentLang].rem}: ${(targetScore-totalScore).toLocaleString()}` : i18n[currentLang].success;
}

function setTarget(s) { 
    targetScore = s; 
    document.querySelectorAll('.target-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('target-' + s).classList.add('active'); 
    updateAll(); 
}

window.onload = () => { initCalc(); };
