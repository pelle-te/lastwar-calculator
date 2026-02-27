/* ==========================================
   js/main.js - 앱 진입점 및 전역 이벤트 라우터 (이벤트 위임)
========================================== */
import { Store, debounce } from './store.js';
import { updateUITexts, changeLang } from './i18n.js';
import { 
    renderInputs, renderTechInputs, renderDroneInputs, renderHeroInputs,
    setTarget, switchTab, setSatTarget, setFixedValues, resetDayData,
    openSpdModal, applySpd, openQuickInputModal, applyQuickInput, 
    openCustomSelect, selectCustomValue, debouncedUpdateAll, updateRatioText,
    startStep, startQuickStep, stopStep, stopQuickStep, showWeeklyReport, previewQuickScreenshot
} from './vs.js';
import { showGrowthTab, calcGearCost, calcValorCost, changeValorCategory, setSkillTier, startSkillStep, stopSkillStep } from './growth.js';
import { openModal, openEditModal, sendLivePost, submitReply, deletePostUI } from './board.js';

// 1. 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    Store.init();
    if (!Store.get('t-expert', null)) { 
        Store.set('t-expert', "20", false); Store.set('t-radar', "6", false); Store.set('t-spd', "6", false); 
        Store.set('t-rec', "6", false); Store.set('t-con', "1", false); Store.set('t-tec', "1", false); 
        Store.set('t-trn', "6", false); Store.set('t-kil', "6", false); 
        Store.debouncedSave(); 
    }
    document.body.className = Store.getState('theme') + '-theme';
    updateUITexts(); renderDroneInputs(); debouncedUpdateAll();

    // 💡 메인 탭 스와이프 로직
    let touchStartX = 0; let touchStartY = 0; 
    const calcPage = document.getElementById('page-vs');
    if(calcPage) {
        calcPage.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; touchStartY = e.changedTouches[0].screenY; }, {passive: true});
        calcPage.addEventListener('touchend', e => {
            if (e.target.closest('input, button, .stepper-btn, .btn-calc-pill')) return; 
            const diffX = e.changedTouches[0].screenX - touchStartX; 
            const diffY = Math.abs(e.changedTouches[0].screenY - touchStartY);
            const days = ['mon','tue','wed','thu','fri','sat']; 
            if (Math.abs(diffX) > 90 && diffY < 50) { 
                let idx = days.indexOf(Store.getState('currentDay')); 
                if (diffX < 0 && idx < days.length - 1) switchTab(days[idx + 1]); 
                else if (diffX > 0 && idx > 0) switchTab(days[idx - 1]); 
            }
        }, {passive: true});
    }

    // 💡 모달 쓸어내려 닫기 (Swipe down to dismiss)
    document.querySelectorAll('.modal').forEach(modal => {
        let mStartY = 0;
        modal.addEventListener('touchstart', e => { mStartY = e.changedTouches[0].screenY; }, {passive: true});
        modal.addEventListener('touchend', e => {
            const mEndY = e.changedTouches[0].screenY;
            // 위에서 아래로 크게(100px 이상) 스와이프하면 닫기
            if (mEndY - mStartY > 100 && e.target.closest('.modal-card, .bottom-sheet')) {
                closeModal(modal);
            }
        }, {passive: true});
    });
});

// 2. 클릭 이벤트 위임
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) { closeModal(e.target); return; }
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    
    const action = actionEl.getAttribute('data-action');
    const ds = actionEl.dataset;

    switch(action) {
        case 'toggleDarkMode': toggleDarkMode(); break;
        case 'changeLang': changeLang(ds.lang); break;
        case 'showPage': showPage(ds.page); break;
        case 'closeModal': closeModal(actionEl.closest('.modal')); break;
        case 'closeLightbox': if(e.target.id === 'lightboxModal' || e.target.classList.contains('close-x')) { document.getElementById('lightboxModal').classList.remove('active'); } break;
        case 'showWeeklyReport': showWeeklyReport(); break;
        case 'setTarget': setTarget(parseInt(ds.target)); break;
        case 'switchTab': switchTab(ds.day); break;
        case 'setFixedValues': setFixedValues(); break;
        case 'resetDayData': resetDayData(); break;
        case 'setSatTarget': setSatTarget(ds.target); break;
        case 'openTechModal': document.getElementById('techModal').classList.add('active'); break;
        case 'openDroneModal': document.getElementById('droneModal').classList.add('active'); break;
        case 'openHeroModal': document.getElementById('heroModal').classList.add('active'); break;
        case 'openSpdModal': openSpdModal(ds.id, ds.label); break;
        case 'openQuickInputModal': openQuickInputModal(); break;
        case 'openCustomSelect': openCustomSelect(ds.id, parseInt(ds.min), parseInt(ds.max), ds.prefix, ds.suffix); break;
        case 'applySpd': applySpd(); break;
        case 'applyQuickInput': applyQuickInput(); break;
        case 'selectCustomValue': selectCustomValue(ds.id, parseInt(ds.val), ds.prefix, ds.suffix); break;
        case 'showGrowthTab': showGrowthTab(ds.tab); break;
        case 'openWriteModal': openModal(); break;
        case 'setSkillTier': setSkillTier(ds.tier); break;
        case 'sendLivePost': sendLivePost(); break;
        case 'submitReply': submitReply(); break;
        case 'deletePostUI': e.preventDefault(); deletePostUI(); break;
        case 'editPost': e.preventDefault(); openEditModal(); break;
    }
});

// 3. 체인지 & 인풋 이벤트
document.addEventListener('change', (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.getAttribute('data-action');
    if (action === 'updateAll') debouncedUpdateAll();
    if (action === 'previewQuickScreenshot') previewQuickScreenshot(e);
    if (action === 'calcGearCost') calcGearCost();
    if (action === 'calcValorCost') calcValorCost(e);
    if (action === 'changeValorCategory') changeValorCategory();
});
document.addEventListener('input', (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (actionEl && actionEl.getAttribute('data-action') === 'updateRatio') updateRatioText(e.target.value);
});

// 4. 스텝퍼 꾹 누르기 모션 처리
document.addEventListener('mousedown', handlePointerDown);
document.addEventListener('touchstart', handlePointerDown, {passive: false});

function handlePointerDown(e) {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.getAttribute('data-action');
    const ds = actionEl.dataset;
    if (action === 'startStep') startStep(e, ds.id, parseInt(ds.delta));
    if (action === 'startQuickStep') startQuickStep(e, ds.id, parseInt(ds.delta));
    if (action === 'startSkillStep') startSkillStep(e, ds.id, parseInt(ds.delta));
}

document.addEventListener('mouseup', () => { stopStep(); stopQuickStep(); stopSkillStep(); }); 
document.addEventListener('touchend', () => { stopStep(); stopQuickStep(); stopSkillStep(); });

// ================= UI 헬퍼 =================
function showPage(pId) {
    document.querySelectorAll('.page-content').forEach(p => {
        p.style.opacity = '0';
        setTimeout(() => { p.classList.remove('active'); }, 150);
    });
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    setTimeout(() => {
        const targetPage = document.getElementById('page-' + pId);
        if(targetPage) {
            targetPage.classList.add('active');
            void targetPage.offsetWidth; 
            targetPage.style.opacity = '1';
            document.getElementById('nav-' + pId).classList.add('active');
            if(pId === 'growth') {
                const activeTab = document.querySelector('.growth-tab-btn.active');
                showGrowthTab(activeTab ? activeTab.dataset.tab : 'skill');
            }
        }
    }, 150);

    const rb = document.querySelector('.result-bar');
    if(rb) rb.style.display = (pId === 'vs') ? 'flex' : 'none';
}

function toggleDarkMode() { 
    const body = document.body; 
    const isLight = body.classList.contains('light-theme');
    const newTheme = isLight ? 'dark' : 'light';
    body.classList.replace(isLight ? 'light-theme' : 'dark-theme', newTheme + '-theme'); 
    Store.setState('theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function closeModal(modalEl) {
    if(!modalEl) return;
    modalEl.classList.remove('active');
    if (modalEl.id === 'techModal') debouncedUpdateAll();
}

export function customAlert(msg) {
    document.getElementById('dialogTitle').innerText = "알림";
    document.getElementById('dialogMsg').innerText = msg;
    document.getElementById('dialogBtnCancel').style.display = 'none';
    document.getElementById('customDialog').classList.add('active');
}

export function customConfirm(msg, onConfirm) {
    document.getElementById('dialogMsg').innerText = msg;
    document.getElementById('dialogBtnCancel').style.display = 'block';
    const confirmBtn = document.getElementById('dialogBtnConfirm');
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
    newBtn.onclick = () => { document.getElementById('customDialog').classList.remove('active'); onConfirm(); };
    document.getElementById('customDialog').classList.add('active');
}