// Firebase 설정 (기존 키 유지)
const firebaseConfig = { 
    apiKey: "AIzaSyAbGdlE4KnelSrrKGLVaLcM5433ZZILVYE", 
    authDomain: "lastwar-530f9.firebaseapp.com", 
    projectId: "lastwar-530f9", 
    storageBucket: "lastwar-530f9.firebasestorage.app", 
    messagingSenderId: "135982056229", 
    appId: "1:135982056229:web:92264d4601e5315cdd50cc" 
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currentDocData = null;
const myId = localStorage.getItem('vs_auth_id') || 'u' + Math.random().toString(36).substr(2, 7);
if(!localStorage.getItem('vs_auth_id')) localStorage.setItem('vs_auth_id', myId);
let isAdmin = false;

// 💡 (수정됨) 구형 showPage 함수는 common.js로 통합하여 삭제했습니다!

window.openModal = function() {
    document.getElementById('edit-doc-id').value = "";
    document.getElementById('post-title').value = "";
    document.getElementById('post-content').value = "";
    document.getElementById('writeModal').classList.add('active');
}
window.closeModal = function() { document.getElementById('writeModal').classList.remove('active'); }

window.openViewModal = function(col, docId, data, canDel) {
    currentDocData = { col, docId, data };
    const title = data.content.split('|||')[0] || "제목 없음";
    const body = data.content.split('|||')[1] || "";
    
    const deleteArea = document.getElementById('delete-area');
    if(deleteArea) deleteArea.style.display = canDel ? 'block' : 'none';
    
    document.getElementById('view-content').innerHTML = `<h2 style="margin-top:0; color:var(--text-main); font-weight:800;">${title}</h2><p style="white-space:pre-wrap; line-height:1.6; color:var(--text-muted);">${body}</p>`;
    
    const img = document.getElementById('view-img');
    if(data.image) { 
        img.src = data.image; 
        img.style.display = 'block'; 
        img.style.cursor = 'zoom-in'; 
        img.onclick = () => window.openLightbox(data.image); 
    } 
    else { img.style.display = 'none'; }
    
    document.getElementById('edit-link').style.display = canDel ? 'inline' : 'none';
    window.loadReplies(col, docId, "view-replies");
    document.getElementById('viewModal').classList.add('active');
}
window.closeViewModal = function() { document.getElementById('viewModal').classList.remove('active'); }

window.submitReply = async function() {
    const input = document.getElementById('view-reply-input');
    const text = input.value.trim();
    if(!text || !currentDocData) return;
    try { await window.addReply(currentDocData.col, currentDocData.docId, text); input.value = ""; } 
    catch (error) { console.error("댓글 등록 실패:", error); }
}

window.sendLivePost = async function() {
    const col = 'posts'; 
    const title = document.getElementById('post-title').value.replace(/\|\|\|/g, '');
    const content = document.getElementById('post-content').value.replace(/\|\|\|/g, '');
    const file = document.getElementById('post-file').files[0];
    const editId = document.getElementById('edit-doc-id').value;

    if(!title.trim() || !content.trim()) { window.customAlert("제목과 내용을 모두 입력해주세요."); return; }

    let imgUrl = editId ? (currentDocData.data.image || "") : ""; 
    if(file) {
        imgUrl = await new Promise(res => {
            const reader = new FileReader(); reader.readAsDataURL(file);
            reader.onload = e => {
                const img = new Image(); img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas'); const max_size = 1000;
                    let w = img.width, h = img.height;
                    if (w > h) { if (w > max_size) { h *= max_size / w; w = max_size; } }
                    else { if (h > max_size) { w *= max_size / h; h = max_size; } }
                    canvas.width = w; canvas.height = h;
                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                    
                    // 💡 세계적 수준의 디테일 3: 파일 크기에 따른 동적 압축
                    let quality = file.size > 2000000 ? 0.6 : (file.size > 1000000 ? 0.7 : 0.85);
                    res(canvas.toDataURL('image/jpeg', quality));
                };
            };
        });
    }
    const fullText = title + "|||" + content;
    try {
        if(editId) await db.collection(col).doc(editId).update({ content: fullText, image: imgUrl });
        else await db.collection(col).add({ authorId: myId, content: fullText, image: imgUrl, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
        window.closeModal();
    } catch (error) { window.customAlert("게시물 저장에 실패했습니다."); }
}

window.loadLiveView = function(col) {
    db.collection(col).orderBy("timestamp", "desc").onSnapshot(snap => {
        const list = document.getElementById(col + '-list');
        if(!list) return; list.innerHTML = "";
        snap.forEach(doc => {
            const d = doc.data();
            const title = (d.content || "").split('|||')[0] || "제목 없음";
            const card = document.createElement('div');
            card.className = 'summary-card';
            card.onclick = () => window.openViewModal(col, doc.id, d, (isAdmin || d.authorId === myId));
            card.innerHTML = `
                ${d.image ? `<div class="summary-img-wrapper"><img src="${d.image}" loading="lazy"></div>` : ''}
                <div class="summary-title">${title}</div>
            `;
            list.appendChild(card);
        });
    });
}

window.addReply = async function(col, postId, text) { await db.collection(col).doc(postId).collection('replies').add({ authorId: myId, content: text, timestamp: firebase.firestore.FieldValue.serverTimestamp() }); }

window.loadReplies = function(col, postId, targetId) {
    db.collection(col).doc(postId).collection('replies').orderBy("timestamp", "asc").onSnapshot(snap => {
        const rb = document.getElementById(targetId);
        if(!rb) return; rb.innerHTML = "";
        snap.forEach(doc => {
            const rd = doc.data();
            rb.innerHTML += `<div style="padding: 10px 12px; border-radius: 12px; background: var(--input-bg); margin-bottom: 8px;"><b style="color:var(--primary);">연맹원</b> <span style="color:var(--text-main); margin-left: 5px;">${rd.content}</span></div>`;
        });
    });
}

window.deletePostUI = function() {
    window.customConfirm("정말 삭제하시겠습니까?", () => {
        db.collection(currentDocData.col).doc(currentDocData.docId).delete(); 
        window.closeViewModal();
    });
};

function updatePresence() {
    db.collection('presence').doc(myId).set({ lastSeen: firebase.firestore.FieldValue.serverTimestamp() }).catch(err => console.error(err));
}

db.collection('presence').onSnapshot(snap => {
    const now = Date.now(); let count = 0;
    snap.forEach(doc => { const d = doc.data(); if (d.lastSeen && (now - d.lastSeen.toMillis() < 300000)) count++; });
    const countEl = document.getElementById('user-count'); if (countEl) countEl.innerText = count + "명 접속 중";
});

updatePresence(); setInterval(updatePresence, 30000);

let currentScale = 1; let initialPinchDistance = null;
window.openLightbox = function(src) {
    const lb = document.getElementById('lightboxModal'); const lbImg = document.getElementById('lightbox-img');
    if(lb && lbImg) {
        lbImg.src = src; currentScale = 1; lbImg.style.transform = 'scale(1)'; lb.classList.add('active');
        lbImg.ontouchstart = (e) => { if(e.touches.length === 2) initialPinchDistance = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY); };
        lbImg.ontouchmove = (e) => { if(e.touches.length === 2 && initialPinchDistance) { e.preventDefault(); const currentDistance = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY); let newScale = currentScale * (currentDistance / initialPinchDistance); newScale = Math.min(Math.max(1, newScale), 4); lbImg.style.transform = `scale(${newScale})`; } };
        lbImg.ontouchend = (e) => { if(e.touches.length < 2) { initialPinchDistance = null; const match = lbImg.style.transform.match(/scale\(([^)]+)\)/); if(match) currentScale = parseFloat(match[1]); } };
        let lastTap = 0;
        lbImg.onclick = (e) => { e.stopPropagation(); const currentTime = new Date().getTime(); const tapLength = currentTime - lastTap; if (tapLength < 300 && tapLength > 0) { currentScale = currentScale > 1 ? 1 : 2.5; lbImg.style.transform = `scale(${currentScale})`; } lastTap = currentTime; };
    }
};
window.closeLightbox = function(e) { if(e.target.id === 'lightboxModal' || e.target.classList.contains('close-x')) document.getElementById('lightboxModal').classList.remove('active'); };