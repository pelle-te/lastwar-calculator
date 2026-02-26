/* ==========================================
   js/common.js - 글로벌 상태 및 코어 유틸리티
========================================== */

window.autoSaveTimer = null; 

// 💡 세계적 수준의 디테일 1: LocalStorage 안전 파싱 (용량 초과나 데이터 꼬임 방지)
window.safeJSONParse = function(str, defaultVal = {}) {
    if (!str) return defaultVal;
    try { return JSON.parse(str); } 
    catch(e) { console.warn("Storage Parse Error:", e); return defaultVal; }
};

window.safeStorageSet = function(key, val) {
    try { localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val)); } 
    catch(e) { window.customAlert("디바이스 저장 공간이 부족합니다."); }
};

// 💡 세계적 수준의 디테일 2: Debounce 유틸리티 (성능 최적화)
window.debounce = function(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

// 페이지 전환 로직 (부드러운 페이드 인 적용)
window.showPage = function(pId) {
    document.querySelectorAll('.page-content').forEach(p => {
        p.style.opacity = '0';
        setTimeout(() => { p.classList.remove('active'); }, 150);
    });
    
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    setTimeout(() => {
        const targetPage = document.getElementById('page-' + pId);
        targetPage.classList.add('active');
        // 강제 리플로우 후 투명도 조절로 부드러운 전환
        void targetPage.offsetWidth; 
        targetPage.style.opacity = '1';
        document.getElementById('nav-' + pId).classList.add('active');
    }, 150);

    const rb = document.querySelector('.result-bar');
    if(rb) rb.style.display = (pId === 'vs') ? 'flex' : 'none';
    
    if(pId === 'board' && window.loadLiveView) window.loadLiveView('posts');
    if(pId === 'growth' && window.showGrowthTab) {
        if (!document.querySelector('.growth-section.active')) window.showGrowthTab('skill');
        else window.showGrowthTab(document.querySelector('.growth-tab-btn.active').id.replace('tab-', ''));
    }
}

// 테마 관리 (부드러운 전환)
window.toggleDarkMode = function() { 
    const body = document.body; 
    const isLight = body.classList.contains('light-theme');
    body.classList.replace(isLight ? 'light-theme' : 'dark-theme', isLight ? 'dark-theme' : 'light-theme'); 
    window.safeStorageSet('theme', isLight ? 'dark' : 'light'); 
};

// 커스텀 모달 알림
window.customAlert = function(msg) {
    document.getElementById('dialogTitle').innerText = window.i18n[window.currentLang].modal.btn_open || "알림";
    document.getElementById('dialogMsg').innerText = msg;
    document.getElementById('dialogBtnCancel').style.display = 'none';
    document.getElementById('dialogBtnConfirm').onclick = () => document.getElementById('customDialog').classList.remove('active');
    document.getElementById('customDialog').classList.add('active');
};

window.customConfirm = function(msg, onConfirm) {
    document.getElementById('dialogMsg').innerText = msg;
    document.getElementById('dialogBtnCancel').style.display = 'block';
    document.getElementById('dialogBtnCancel').onclick = () => document.getElementById('customDialog').classList.remove('active');
    const confirmBtn = document.getElementById('dialogBtnConfirm');
    confirmBtn.onclick = () => { document.getElementById('customDialog').classList.remove('active'); onConfirm(); };
    document.getElementById('customDialog').classList.add('active');
};

// 클라우드 저장 트리거 (Debounce 활용)
window.triggerAutoSave = window.debounce(async () => {
    const statusEl = document.getElementById('auto-save-status');
    if(statusEl) statusEl.innerHTML = `<span class="icon" style="animation: pulse 1s infinite;">🔄</span><span class="label">저장 중</span>`;
    try {
        const data = window.safeJSONParse(localStorage.getItem('lastwar_data')); 
        const spdData = window.safeJSONParse(localStorage.getItem('lastwar_spd_data'));
        if (typeof db !== 'undefined' && typeof myId !== 'undefined' && myId) { 
            await db.collection('user_sync').doc(myId).set({ basic: data, speed: spdData, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }); 
        }
        if(statusEl) statusEl.innerHTML = `<span class="icon">☁️</span><span class="label">저장됨</span>`;
    } catch(e) { console.error("Auto save failed", e); }
}, 1500);

// 모달 외부 클릭 닫기
window.onclick = function(event) { 
    if (event.target.classList.contains('modal')) { 
        event.target.classList.remove('active'); 
        if(event.target.id === 'techModal' && window.debouncedUpdateAll) window.debouncedUpdateAll(); 
    } 
};