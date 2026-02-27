/* ==========================================
   js/store.js - 앱 전체 상태 및 로컬 데이터 관리소
   (더 이상 window.xxx 전역 변수를 사용하지 않습니다!)
========================================== */

export const Store = {
    // 1. 앱의 현재 상태 (UI 런타임 데이터)
    state: {
        lang: 'ko',
        theme: localStorage.getItem('theme') || 'dark',
        currentDay: 'mon',
        targetScore: 7200000,
        customRatio: 50,
        activeSpdId: '',
        currentSkillTier: 'UR',
        authId: null,
        isAdmin: false
    },
    
    // 2. 입력된 계산 데이터
    data: {},
    spdData: {},
    skillData: {},
    
    // 초기화 (로컬 스토리지에서 불러오기)
    init() {
        this.data = this.safeJSONParse(localStorage.getItem('lastwar_data'), {});
        this.spdData = this.safeJSONParse(localStorage.getItem('lastwar_spd_data'), {});
        this.skillData = this.safeJSONParse(localStorage.getItem('lastwar_skill_data'), {s1:{c:1,t:10},s2:{c:1,t:10},s3:{c:1,t:10}});
    },

    // 안전한 JSON 파싱 헬퍼
    safeJSONParse(str, defaultVal) {
        if (!str) return defaultVal;
        try { return JSON.parse(str); } 
        catch(e) { console.warn("Parse Error:", e); return defaultVal; }
    },

    // 💡 State (상태) 게터/세터
    getState(key) {
        return this.state[key];
    },
    setState(key, value) {
        this.state[key] = value;
    },

    // 💡 Data (계산값) 게터/세터
    get(key, defaultVal = 0) {
        return this.data[key] !== undefined ? this.data[key] : defaultVal;
    },
    set(key, val, autoSave = true) {
        this.data[key] = val;
        if(autoSave) this.debouncedSave();
    },

    // 성능 최적화를 위한 디바운스 세이브 (연속 호출 방지)
    saveTimer: null,
    debouncedSave() {
        if(this.saveTimer) clearTimeout(this.saveTimer);
        this.saveTimer = setTimeout(() => {
            try { 
                localStorage.setItem('lastwar_data', JSON.stringify(this.data)); 
            } catch(e) { console.error("Storage Full Error:", e); }
        }, 300);
    },

    // 가속 데이터 저장
    spdSaveTimer: null,
    debouncedSpdSave() {
        if(this.spdSaveTimer) clearTimeout(this.spdSaveTimer);
        this.spdSaveTimer = setTimeout(() => {
            try { 
                localStorage.setItem('lastwar_spd_data', JSON.stringify(this.spdData)); 
            } catch(e) { console.error("Storage Full Error:", e); }
        }, 300);
    },
    
    // 스킬 데이터 저장
    saveSkillData() {
        localStorage.setItem('lastwar_skill_data', JSON.stringify(this.skillData));
    }
};

// 디바운스 유틸리티 함수도 여기서 관리하여 모듈 전체가 공유합니다.
export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
