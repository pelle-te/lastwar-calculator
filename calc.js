let currentLang = 'ko';
let currentDay = 'mon';
let targetScore = 7200000;

// 번역 데이터 세트
const i18n = {
    ko: {
        goal: "🎯 목표 설정", boxes: "상자", tech: "🔬 테크 현황",
        expert: "🏆 대결 전문가", radar: "📡 추당-레이더", spd: "⏱️ 추당-가속", rec: "🎫 추당-모집", con: "🏰 추당-건설", tec: "🔬 추당-테크", trn: "⚔️ 추당-훈련", kil: "🔥 추당-적처치",
        days: ["월", "화", "수", "목", "금", "토"],
        rem: "남은 점수", success: "🎉 목표 달성 완료!",
        inputs: {
            dia: "💎 다이아 구매", radar_task: "📡 레이더 임무", stam: "⚡ 체력 소모", exp: "⭐ 영웅 경험치 (1M)", part: "⚙️ 드론 부품", data: "💾 드론 데이터 (1k)", food: "🌾 식량 채집(h)", iron: "🪨 철광 채집(h)", gold: "🪙 금화 채집(h)",
            truck: "🚚 UR 화물차", sec: "🕵️ UR 은밀 임무", surv: "🎫 생존자 모집", build_spd: "⏱️ 건설 가속 (h)", pow_con: "🏰 건물 전투력 (1k)",
            tec_spd: "⏱️ 테크 가속 (h)", pow_tec: "🔬 테크 전투력 (1k)", medal: "🏅 명예 훈장 소모",
            tkt: "🎫 영웅 모집", ur: "🧩 UR 조각", ssr: "🧩 SSR 조각", sr: "🧩 SR 조각", sk: "🏅 스킬 훈장",
            trn_spd: "⏱️ 훈련 가속 (h)", trn_cnt: "⚔️ 훈련 수", trn_lvl: "🎯 훈련 레벨",
            kill_spd: "⏱️ 모든 가속 (h)", kill_target: "⚔️ 처치 대상", kill_lvl: "🎯 처치 레벨", kill_cnt: "🔥 처치 수", dth_lvl: "💀 전사 레벨", dth_cnt: "🩸 전사 수",
            target_spec: "특정 매칭 연맹", target_gen: "일반 적군"
        }
    },
    en: {
        goal: "🎯 DAILY GOAL", boxes: "Boxes", tech: "🔬 ALLIANCE TECH",
        expert: "🏆 VS Expert", radar: "📡 Radar Task", spd: "⏱️ Spd-Up Task", rec: "🎫 Recruit Task", con: "🏰 Build Task", tec: "🔬 Tech Task", trn: "⚔️ Train Task", kil: "🔥 Kill Task",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        rem: "Remaining", success: "🎉 Goal Achieved!",
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

// 언어 변경 함수
function changeLang(lang) {
    currentLang = lang;
    document.getElementById('lang-ko').style.color = lang === 'ko' ? 'var(--primary)' : '#94a3b8';
    document.getElementById('lang-en').style.color = lang === 'en' ? 'var(--primary)' : '#94a3b8';
    initCalc(); // UI 재렌더링
}

const BASE = {
    radar: 10000, truck: 100000, secret: 75000, surv: 1500, spd_min: 50, pow_pt: 10, h_gather: 9523.5, drone_part: 2500, drone_data: 3, honor_medal: 300,
    recruit: 1500, ur_shard: 10000, ssr_shard: 3500, sr_shard: 1000, skill_medal: 10, exp_unit: 1.0/660,
    boxes: [0, 1100, 3300, 10000, 30000, 90000, 270000, 810000],
    trp: [0, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110], 
    kil_spec: [0, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
    kil_gen: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
};

function initCalc() {
    const t = i18n[currentLang];
    
    // 섹션 타이틀 번역
    document.querySelectorAll('.section-title')[0].innerText = t.goal;
    document.querySelectorAll('.section-title')[1].innerText = t.tech;
    
    // 목표 버튼 번역
    document.getElementById('target-2300000').innerText = `6 ${t.boxes}`;
    document.getElementById('target-3600000').innerText = `8 ${t.boxes}`;
    document.getElementById('target-7200000').innerText = `9 ${t.boxes}`;

    // 테크 번역
    const grid = document.getElementById('tech-inputs');
    const techs = [
        {id:'t-expert',l:t.expert,v:20},{id:'t-radar',l:t.radar,v:6},{id:'t-spd',l:t.spd,v:6},{id:'t-rec',l:t.rec,v:6},
        {id:'t-con',l:t.con,v:1},{id:'t-tec',l:t.tec,v:1},{id:'t-trn',l:t.trn,v:6},{id:'t-kil',l:t.kil,v:6}
    ];
    grid.innerHTML = techs.map(item => `<div class="tech-item"><label>${item.l}</label><select id="${item.id}" onchange="updateAll()">${Array.from({length:21},(_,i)=>`<option value="${i}" ${i===item.v?'selected':''}>Lv ${i} (+${i*5}%)</option>`).join('')}</select></div>`).join('');
    
    // 요일 탭 번역
    const dayTabs = document.getElementById('day-tabs-container');
    const days = ['mon','tue','wed','thu','fri','sat'];
    dayTabs.innerHTML = days.map((d, i) => `<button id="btn-${d}" class="day-btn ${d===currentDay?'active':''}" style="background:var(--${d})" onclick="switchTab('${d}')">${t.days[i]}</button>`).join('');
    
    renderInputs();
    updateAll();
}

function setTarget(s) { 
    targetScore = s; 
    document.querySelectorAll('.target-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('target-' + s).classList.add('active'); 
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
        mon:[{id:'dia',l:t.inputs.dia,m:100000},{id:'radar',l:t.inputs.radar_task,m:500},{id:'stam',l:t.inputs.stam,m:10000},{id:'exp',l:t.inputs.exp,m:3000},{id:'part',l:t.inputs.part,m:5000},{id:'data',l:t.inputs.data,m:10000},{id:'h-food',l:t.inputs.food,m:100},{id:'h-iron',l:t.inputs.iron,m:100},{id:'h-gold',l:t.inputs.gold,m:100}], 
        tue:[{id:'dia',l:t.inputs.dia,m:100000},{id:'truck',l:t.inputs.truck,m:100},{id:'sec',l:t.inputs.sec,m:200},{id:'surv',l:t.inputs.surv,m:5000},{id:'spd',l:t.inputs.build_spd,m:3000},{id:'pow',l:t.inputs.pow_con,m:10000}], 
        wed:[{id:'dia',l:t.inputs.dia,m:100000},{id:'radar',l:t.inputs.radar_task,m:500},{id:'spd',l:t.inputs.tec_spd,m:3000},{id:'pow',l:t.inputs.pow_tec,m:10000},{id:'mdl',l:t.inputs.medal,m:10000}], 
        thu:[{id:'dia',l:t.inputs.dia,m:100000},{id:'tkt',l:t.inputs.tkt,m:5000},{id:'ur',l:t.inputs.ur,m:5000},{id:'ssr',l:t.inputs.ssr,m:5000},{id:'sr',l:t.inputs.sr,m:10000},{id:'sk',l:t.inputs.sk,m:10000},{id:'exp',l:t.inputs.exp,m:3000}], 
        fri:[{id:'dia',l:t.inputs.dia,m:100000},{id:'radar',l:t.inputs.radar_task,m:500},{id:'spd-con',l:t.inputs.build_spd,m:2000},{id:'spd-tec',l:t.inputs.tec_spd,m:2000},{id:'spd-trn',l:t.inputs.trn_spd,m:2000},{id:'pow-con',l:t.inputs.pow_con,m:10000},{id:'pow-tec',l:t.inputs.pow_tec,m:10000}], 
        sat:[{id:'dia',l:t.inputs.dia,m:100000},{id:'truck',l:t.inputs.truck,m:100},{id:'sec',l:t.inputs.sec,m:200},{id:'spd-all',l:t.inputs.kill_spd,m:5000}] 
    };
    
    let html = `<div class="section-title">📊 ${currentDay.toUpperCase()} INPUT</div>`;
    html += (config[currentDay] || []).map(i => `<div class="input-group"><div class="input-row"><label class="input-label">${i.l}</label><input type="number" id="${currentDay}-${i.id}" value="0" min="0" oninput="syncRange('${i.id}', this.value)"></div><input type="range" id="range-${i.id}" min="0" max="${i.m}" value="0" step="1" oninput="syncInput('${i.id}', this.value)"></div>`).join('');
    
    if(currentDay === 'wed') {
        html += `<div class="section-title">📦 ${t.boxes}</div><div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">`;
        for(let i=1; i<=7; i++) html += `<div class="tech-item"><label>Lv.${i}</label><input type="number" id="wed-b${i}" value="0" oninput="updateAll()" style="width:100%; border:none; background:white; font-weight:800; color:var(--primary); text-align:right"></div>`;
        html += `</div>`;
    }
    if(currentDay === 'fri') {
        html += `<div class="input-group"><div class="input-row"><label>${t.inputs.trn_lvl}</label><select id="fri-lvl" onchange="updateAll()" style="border:none; background:white; font-weight:800; color:var(--primary)">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i===7?'selected':''}>Lv ${i+1}</option>`).join('')}</select></div></div>`;
        html += renderQuickInput('fri', 'count', t.inputs.trn_cnt, 50000);
    }
    if(currentDay === 'sat') {
        html += `<div class="input-group"><div class="input-row"><label>${t.inputs.kill_target}</label><select id="sat-target" onchange="updateAll()" style="border:none; background:white; font-weight:800; color:var(--primary)"><option value="special">${t.inputs.target_spec}</option><option value="general">${t.inputs.target_gen}</option></select></div></div><div class="input-group"><div class="input-row"><label>${t.inputs.kill_lvl}</label><select id="sat-elvl" onchange="updateAll()" style="border:none; background:white; font-weight:800; color:var(--primary)">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i===7?'selected':''}>Lv ${i+1}</option>`).join('')}</select></div></div>`;
        html += renderQuickInput('sat', 'kill', t.inputs.kill_cnt, 200000);
        html += `<div class="input-group"><div class="input-row"><label>${t.inputs.dth_lvl}</label><select id="sat-alvl" onchange="updateAll()" style="border:none; background:white; font-weight:800; color:var(--primary)">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i===7?'selected':''}>Lv ${i+1}</option>`).join('')}</select></div></div>`;
        html += renderQuickInput('sat', 'dth', t.inputs.dth_cnt, 200000);
    }
    container.innerHTML = html;
}

function renderQuickInput(d, id, l, m) { return `<div class="input-group"><div class="input-row"><label>${l}</label><input type="number" id="${d}-${id}" value="0" min="0" oninput="syncRange('${id}', this.value)"></div><input type="range" id="range-${id}" min="0" max="${m}" value="0" oninput="syncInput('${id}', this.value)"></div>`; }
function syncInput(id, v) { document.getElementById(`${currentDay}-${id}`).value = v; updateAll(); }
function syncRange(id, v) { if(v<0) v=0; let r=document.getElementById('range-'+id); if(r) r.value=v; updateAll(); }
function val(id) { let el = document.getElementById(id); return el ? parseFloat(el.value) || 0 : 0; }
function getM(subId) { let e = val('t-expert') * 0.05, s = val(subId) * 0.05; return { all: 1 + e, sub: 1 + e + s }; }

function updateAll() {
    const d = currentDay; let s = val(d+'-dia') * 30;
    let m = { rad: getM('t-radar'), spd: getM('t-spd'), rec: getM('t-rec'), con: getM('t-con'), tec: getM('t-tec'), trn: getM('t-trn'), kil: getM('t-kil'), exp: getM('t-expert') };
    if(d==='mon') s += (val('mon-radar')*BASE.radar*m.rad.sub)+(val('mon-stam')*150*m.exp.all)+(val('mon-exp')*1000000*BASE.exp_unit*m.exp.all)+(val('mon-h-food')*BASE.h_gather*m.exp.all)+(val('mon-h-iron')*BASE.h_gather*m.exp.all)+(val('mon-h-gold')*BASE.h_gather*m.exp.all)+(val('mon-part')*BASE.drone_part*m.exp.all)+(val('mon-data')*1000*BASE.drone_data*m.exp.all);
    else if(d==='tue') s += (val('tue-truck')*BASE.truck*m.exp.all)+(val('tue-sec')*BASE.secret*m.exp.all)+(val('tue-surv')*BASE.surv*m.exp.all)+(val('tue-spd')*60*BASE.spd_min*m.spd.sub)+(val('tue-pow')*1000*BASE.pow_pt*m.con.sub);
    else if(d==='wed') { s += (val('wed-radar')*BASE.radar*m.rad.sub)+(val('wed-spd')*60*BASE.spd_min*m.spd.sub)+(val('wed-pow')*1000*BASE.pow_pt*m.tec.sub)+(val('wed-mdl')*BASE.honor_medal*m.exp.all); for(let i=1;i<=7;i++) s += (val('wed-b'+i)||0)*BASE.boxes[i]*m.exp.all; }
    else if(d==='thu') s += (val('thu-tkt')*BASE.recruit*m.rec.sub)+(val('thu-ur')*BASE.ur_shard*m.exp.all)+(val('thu-ssr')*BASE.ssr_shard*m.exp.all)+(val('thu-sr')*BASE.sr_shard*m.exp.all)+(val('thu-sk')*BASE.skill_medal*m.exp.all)+(val('thu-exp')*1000000*BASE.exp_unit*m.exp.all);
    else if(d==='fri') { s += (val('fri-radar')*BASE.radar*m.rad.sub) + (val('fri-spd-con')*60*BASE.spd_min*m.spd.sub) + (val('fri-spd-tec')*60*BASE.spd_min*m.spd.sub) + (val('fri-spd-trn')*60*BASE.spd_min*m.spd.sub) + (val('fri-pow-con')*1000*BASE.pow_pt*m.con.sub) + (val('fri-pow-tec')*1000*BASE.pow_pt*m.tec.sub); s += (val('fri-count')*BASE.trp[val('fri-lvl')]*m.trn.sub); }
    else if(d==='sat') { s += (val('sat-truck')*BASE.truck*m.exp.all) + (val('sat-sec')*BASE.secret*m.exp.all) + (val('sat-spd-all')*60*BASE.spd_min*m.spd.sub); let kType = document.getElementById('sat-target').value; let kLvl = val('sat-elvl'); let kScore = kType === 'special' ? BASE.kil_spec[kLvl] : BASE.kil_gen[kLvl]; s += (val('sat-kill')*kScore*m.kil.sub) + (val('sat-dth')*BASE.trp[val('sat-alvl')]*m.exp.all); }
    
    document.getElementById('score').innerText = s.toLocaleString(undefined, {minimumFractionDigits: 1});
    let pct = Math.min(100, (s/targetScore)*100); document.getElementById('bar').style.width = pct + '%';
    document.getElementById('diff').innerText = (targetScore-s)>0 ? `${i18n[currentLang].rem}: ${(targetScore-s).toLocaleString()}` : i18n[currentLang].success;
}
