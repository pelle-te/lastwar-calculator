window.currentLang = 'ko';

window.i18n = {
    ko: {
        nav: { vs: "📊 VS 대결", growth: "📈 성장 계산기", board: "💡 정보 공유" },
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
        rec: { success: "목표를 넉넉하게 달성했습니다! 다음을 위해 자원을 아끼세요.", guide_title: "달성 가이드", desc: "남은 점수를 채우기 위해 두 자원의 비율을 조절해보세요.", single_desc: "목표 달성을 위해 다음 항목의 수량이 추가로 필요합니다.", count: "개", target_goal: "목표" },
        menu: { tech_title: "연맹 테크 설정", tech_desc: "개인별 테크 레벨 반영", skill_title: "스킬 훈장 계산", skill_desc: "독립형 훈장 시뮬레이터" },
        btn: { quick: "⚡ 쾌속", quick_title: "쾌속 입력", quick_bg: "📷 인벤토리 스크린샷 불러오기", quick_apply: "일괄 적용" },
        skill: { title: "🏅 영웅 스킬 훈장 계산기", ur: "UR 영웅", ssr: "SSR 영웅", sr: "SR 영웅", cur: "현재", tgt: "목표", total: "총 필요 훈장", bg_change: "📷 배경 변경", bg_reset: "🗑️ 초기화", pos1: "1스킬 (좌상)", pos2: "2스킬 (우상)", pos3: "3스킬 (좌하)", pos4: "4스킬 (우하)", k_unit: "k" },
        growth: { 
            tab_skill: "🏅 스킬 훈장", tab_gear: "⚙️ 장비 강화", tab_valor: "🔬 테크 연구",
            gear_gun: "🔫 레일건", gear_armor: "🛡️ 장갑", gear_radar: "📡 레이더", gear_chip: "💾 칩",
            res_gold: "금화", res_ore: "강화석", res_cer: "유전체 세라믹", res_bp: "장비 도면(UR)", res_mbp: "장비 도면(신화)",
            cur_tier: "현재 등급", tgt_tier: "목표 등급", tot_res: "총 필요 자원",
            cat_vs: "Alliance Duel (VS 대결)", cat_truck: "Intercity Truck (도시 간 화물차)", cat_sf: "Special Forces (특수 부대)",
            valor_notice: "* 각 연구의 현재/목표 레벨을 지정하면 필요한 총 <b>Valor 개수</b>를 계산합니다.",
            valor_warn: "※ AI 안내: 방대한 내부 수치를 모두 가져올 수 없어 계산기 구조를 완성했습니다. js/growth.js 내부의 VALOR_DATA 부분에 실제 수치를 추가하시면 완벽하게 작동합니다!",
            tot_valor: "총 필요 발러 (Valor Badge)"
        }
    },
    en: {
        nav: { vs: "📊 VS Duel", growth: "📈 Growth Calc", board: "💡 Info Share" },
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
        rec: { success: "Target achieved! Save your resources.", guide_title: "Guide", desc: "Adjust the slider to distribute resources.", single_desc: "The following amount is needed to reach your target.", count: "", target_goal: "Target" },
        menu: { tech_title: "Alliance Tech", tech_desc: "Apply personal tech levels", skill_title: "Skill Medal Calc", skill_desc: "Independent simulator" },
        btn: { quick: "⚡ Quick", quick_title: "Quick Input", quick_bg: "📷 Load Inventory Screenshot", quick_apply: "Apply All" },
        skill: { title: "🏅 Skill Medal Calculator", ur: "UR Hero", ssr: "SSR Hero", sr: "SR Hero", cur: "Current", tgt: "Target", total: "Total Medals", bg_change: "📷 Change BG", bg_reset: "🗑️ Reset", pos1: "Skill 1 (TL)", pos2: "Skill 2 (TR)", pos3: "Skill 3 (BL)", pos4: "Skill 4 (BR)", k_unit: "k" },
        growth: {
            tab_skill: "🏅 Skill Medals", tab_gear: "⚙️ Gear Upgrade", tab_valor: "🔬 Tech Valor",
            gear_gun: "🔫 Railgun", gear_armor: "🛡️ Armor", gear_radar: "📡 Radar", gear_chip: "💾 Chip",
            res_gold: "Gold", res_ore: "Ore", res_cer: "Ceramic", res_bp: "UR Blueprint", res_mbp: "Mythic Blueprint",
            cur_tier: "Current Tier", tgt_tier: "Target Tier", tot_res: "Total Resources Needed",
            cat_vs: "Alliance Duel", cat_truck: "Intercity Truck", cat_sf: "Special Forces",
            valor_notice: "* Set current/target levels to calculate total <b>Valor Badges</b> needed.",
            valor_warn: "※ AI Note: Added the structure since private DB fetch is limited. Add actual values to VALOR_DATA in js/growth.js!",
            tot_valor: "Total Valor Badges"
        }
    }
};

window.updateUITexts = function() {
    const t = window.i18n[window.currentLang];
    
    const elVs = document.getElementById('nav-vs'); if(elVs) elVs.innerText = t.nav.vs;
    const elGrowth = document.getElementById('nav-growth'); if(elGrowth) elGrowth.innerText = t.nav.growth;
    const elBoard = document.getElementById('nav-board'); if(elBoard) elBoard.innerText = t.nav.board;
    
    const elTabSkill = document.getElementById('tab-skill'); if(elTabSkill) elTabSkill.innerText = t.growth.tab_skill;
    const elTabGear = document.getElementById('tab-gear'); if(elTabGear) elTabGear.innerText = t.growth.tab_gear;
    const elTabValor = document.getElementById('tab-valor'); if(elTabValor) elTabValor.innerText = t.growth.tab_valor;

    const map = {
        'menu-tech-title': t.menu.tech_title, 'menu-tech-desc': t.menu.tech_desc,
        'tech-title': `🔬 ${t.menu.tech_title.toUpperCase()}`, 'tech-open-btn': t.modal.btn_open,
        'tech-modal-title': t.menu.tech_title, 'tech-confirm-btn': t.modal.btn_confirm,
        'drone-modal-title': t.modal.drone, 'drone-confirm-btn': t.modal.btn_confirm,
        'hero-modal-title': t.modal.hero, 'hero-confirm-btn': t.modal.btn_confirm,
        'weekly-modal-title': t.modal.weekly, 'weekly-close-btn': t.modal.btn_close,
        'spd-cancel-btn': t.modal.btn_cancel, 'spd-apply-btn': t.modal.btn_apply,
        'quick-modal-title': t.btn.quick_title, 'quick-bg-btn': t.btn.quick_bg,
        'quick-cancel-btn': t.modal.btn_cancel, 'quick-apply-btn': t.btn.quick_apply,
    };
    Object.keys(map).forEach(id => { const el = document.getElementById(id); if(el) el.innerText = map[id]; });
    
    const t6El = document.getElementById('target-2300000'); if (t6El) t6El.innerHTML = `${t.targets.t6}<br><span class="target-medal">🏅 400</span>`;
    const t8El = document.getElementById('target-3600000'); if (t8El) t8El.innerHTML = `${t.targets.t8}<br><span class="target-medal">🏅 800</span>`;
    const t9El = document.getElementById('target-7200000'); if (t9El) t9El.innerHTML = `${t.targets.t9}<br><span class="target-medal">🏅 1,200</span>`;

    const dayTabs = document.getElementById('day-tabs-container');
    if(dayTabs) { dayTabs.innerHTML = ['mon','tue','wed','thu','fri','sat'].map((d, i) => `<button id="btn-${d}" class="day-btn ${d===window.currentDay?'active':''}" style="background:var(--${d})" onclick="window.switchTab('${d}')">${t.days[i]}</button>`).join(''); }

    if(window.renderTechInputs) window.renderTechInputs(); 
    if(window.renderHeroInputs) window.renderHeroInputs(); 
    if(window.renderInputs) window.renderInputs(); 
    
    const growthSkill = document.getElementById('growth-skill');
    if(growthSkill && growthSkill.classList.contains('active') && window.renderSkillRows) window.renderSkillRows();
    const growthGear = document.getElementById('growth-gear');
    if(growthGear && growthGear.classList.contains('active') && window.renderGearUI) window.renderGearUI();
    const growthValor = document.getElementById('growth-valor');
    if(growthValor && growthValor.classList.contains('active') && window.renderValorUI) window.renderValorUI();
}

window.changeLang = function(lang) { 
    window.currentLang = lang; 
    document.getElementById('lang-ko').classList.toggle('active', lang === 'ko'); 
    document.getElementById('lang-en').classList.toggle('active', lang === 'en'); 
    const recBox = document.getElementById('recommend-box'); 
    if(recBox) { recBox.removeAttribute('data-rendered-day'); recBox.removeAttribute('data-rendered-lang'); } 
    window.updateUITexts(); 
    if(window.updateAll) window.updateAll();
};