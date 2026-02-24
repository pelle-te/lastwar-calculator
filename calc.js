let currentDay = 'mon';
let targetScore = 7200000;

const BASE = {
    radar: 10000, truck: 100000, secret: 75000, surv: 1500, spd_min: 50, pow_pt: 10, h_gather: 9523.5, drone_part: 2500, drone_data: 3, honor_medal: 300,
    recruit: 1500, ur_shard: 10000, ssr_shard: 3500, sr_shard: 1000, skill_medal: 10, exp_unit: 1.0/660,
    boxes: [0, 1100, 3300, 10000, 30000, 90000, 270000, 810000],
    trp: [0, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110], 
    kil_spec: [0, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
    kil_gen: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
};

function initCalc() {
    const grid = document.getElementById('tech-inputs');
    const techs = [{id:'t-expert',l:'🏆 대결 전문가',v:20},{id:'t-radar',l:'📡 추당-레이더',v:6},{id:'t-spd',l:'⏱️ 추당-가속',v:6},{id:'t-rec',l:'🎫 추당-모집',v:6},{id:'t-con',l:'🏰 추당-건설',v:1},{id:'t-tec',l:'🔬 추당-테크',v:1},{id:'t-trn',l:'⚔️ 추당-훈련',v:6},{id:'t-kil',l:'🔥 추당-적처치',v:6}];
    grid.innerHTML = techs.map(t => `<div class="tech-item"><label>${t.l}</label><select id="${t.id}" onchange="updateAll()">${Array.from({length:21},(_,i)=>`<option value="${i}" ${i===t.v?'selected':''}>Lv ${i} (+${i*5}%)</option>`).join('')}</select></div>`).join('');
    
    const dayTabs = document.getElementById('day-tabs-container');
    const days = ['mon','tue','wed','thu','fri','sat'];
    const dayNames = ['월','화','수','목','금','토'];
    dayTabs.innerHTML = days.map((d, i) => `<button id="btn-${d}" class="day-btn ${d==='mon'?'active':''}" style="background:var(--${d})" onclick="switchTab('${d}')">${dayNames[i]}</button>`).join('');
    
    switchTab('mon');
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
    const container = document.getElementById('input-container');
    const config = { 
        mon:[{id:'dia',l:'💎 다이아 구매',m:100000},{id:'radar',l:'📡 레이더 임무',m:500},{id:'stam',l:'⚡ 체력 소모',m:10000},{id:'exp',l:'⭐ 영웅 경험치 (1M)',m:3000},{id:'part',l:'⚙️ 드론 부품',m:5000},{id:'data',l:'💾 드론 데이터 (1k)',m:10000},{id:'h-food',l:'🌾 식량 채집(h)',m:100},{id:'h-iron',l:'🪨 철광 채집(h)',m:100},{id:'h-gold',l:'🪙 금화 채집(h)',m:100}], 
        tue:[{id:'dia',l:'💎 다이아 구매',m:100000},{id:'truck',l:'🚚 UR 화물차',m:100},{id:'sec',l:'🕵️ UR 은밀 임무',m:200},{id:'surv',l:'🎫 생존자 모집',m:5000},{id:'spd',l:'⏱️ 건설 가속 (h)',m:3000},{id:'pow',l:'🏰 건물 전투력 (1k)',m:10000}], 
        wed:[{id:'dia',l:'💎 다이아 구매',m:100000},{id:'radar',l:'📡 레이더 임무',m:500},{id:'spd',l:'⏱️ 테크 가속 (h)',m:3000},{id:'pow',l:'🔬 테크 전투력 (1k)',m:10000},{id:'mdl',l:'🏅 명예 훈장 소모',m:10000}], 
        thu:[{id:'dia',l:'💎 다이아 구매',m:100000},{id:'tkt',l:'🎫 영웅 모집',m:5000},{id:'ur',l:'🧩 UR 조각',m:5000},{id:'ssr',l:'🧩 SSR 조각',m:5000},{id:'sr',l:'🧩 SR 조각',m:10000},{id:'sk',l:'🏅 스킬 훈장',m:10000},{id:'exp',l:'⭐ 영웅 경험치 (1M)',m:3000}], 
        fri:[{id:'dia',l:'💎 다이아 구매',m:100000},{id:'radar',l:'📡 레이더 임무',m:500},{id:'spd-con',l:'⏱️ 건설 가속 (h)',m:2000},{id:'spd-tec',l:'⏱️ 테크 가속 (h)',m:2000},{id:'spd-trn',l:'⏱️ 훈련 가속 (h)',m:2000},{id:'pow-con',l:'🏰 건물 전투력 (1k)',m:10000},{id:'pow-tec',l:'🔬 테크 전투력 (1k)',m:10000}], 
        sat:[{id:'dia',l:'💎 다이아 구매',m:100000},{id:'truck',l:'🚚 UR 화물차',m:100},{id:'sec',l:'🕵️ UR 은밀 임무',m:200},{id:'spd-all',l:'⏱️ 모든 가속 (h)',m:5000}] 
    };
    let html = `<div class="section-title">📊 ${currentDay.toUpperCase()} INPUT</div>`;
    html += (config[currentDay] || []).map(i => `<div class="input-group"><div class="input-row"><label class="input-label">${i.l}</label><input type="number" id="${currentDay}-${i.id}" value="0" min="0" oninput="syncRange('${i.id}', this.value)"></div><input type="range" id="range-${i.id}" min="0" max="${i.m}" value="0" step="1" oninput="syncInput('${i.id}', this.value)"></div>`).join('');
    if(currentDay === 'wed') {
        html += `<div class="section-title">📦 테크 상자</div><div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">`;
        for(let i=1; i<=7; i++) html += `<div class="tech-item"><label>Lv.${i}</label><input type="number" id="wed-b${i}" value="0" oninput="updateAll()" style="width:100%; border:none; background:white; font-weight:800; color:var(--primary); text-align:right"></div>`;
        html += `</div>`;
    }
    if(currentDay === 'fri') {
        html += `<div class="input-group"><div class="input-row"><label>🎯 훈련 레벨</label><select id="fri-lvl" onchange="updateAll()" style="border:none; background:white; font-weight:800; color:var(--primary)">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i===7?'selected':''}>Lv ${i+1}</option>`).join('')}</select></div></div>`;
        html += renderQuickInput('fri', 'count', '⚔️ 훈련 수', 50000);
    }
    if(currentDay === 'sat') {
        html += `<div class="input-group"><div class="input-row"><label>⚔️ 처치 대상</label><select id="sat-target" onchange="updateAll()" style="border:none; background:white; font-weight:800; color:var(--primary)"><option value="special">특정 매칭 연맹</option><option value="general">일반 적군</option></select></div></div><div class="input-group"><div class="input-row"><label>🎯 처치 레벨</label><select id="sat-elvl" onchange="updateAll()" style="border:none; background:white; font-weight:800; color:var(--primary)">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i===7?'selected':''}>Lv ${i+1}</option>`).join('')}</select></div></div>`;
        html += renderQuickInput('sat', 'kill', '🔥 처치 수', 200000);
        html += `<div class="input-group"><div class="input-row"><label>💀 전사 레벨</label><select id="sat-alvl" onchange="updateAll()" style="border:none; background:white; font-weight:800; color:var(--primary)">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i===7?'selected':''}>Lv ${i+1}</option>`).join('')}</select></div></div>`;
        html += renderQuickInput('sat', 'dth', '🩸 전사 수', 200000);
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
    let diff = targetScore - s; document.getElementById('diff').innerText = diff > 0 ? `남은 점수: ${diff.toLocaleString()}` : "🎉 목표 달성 완료!";
}
