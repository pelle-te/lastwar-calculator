// Firebase 설정 및 db 변수 정의
const firebaseConfig = { 
    apiKey: "AIzaSyAbGdlE4KnelSrrKGLVaLcM5433ZZILVYE", 
    authDomain: "lastwar-530f9.firebaseapp.com", 
    projectId: "lastwar-530f9", 
    storageBucket: "lastwar-530f9.firebasestorage.app", 
    messagingSenderId: "135982056229", 
    appId: "1:135982056229:web:92264d4601e5315cdd50cc" 
};

// 중복 초기화 방지를 위한 체크
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

let currentDocData = null;
const myId = localStorage.getItem('vs_auth_id') || 'u' + Math.random().toString(36).substr(2, 7);
if(!localStorage.getItem('vs_auth_id')) localStorage.setItem('vs_auth_id', myId);
let isAdmin = false;

function showPage(pId) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('page-' + pId).classList.add('active');
    document.getElementById('nav-' + pId).classList.add('active');

    const rb = document.querySelector('.result-bar');
    if(rb) {
        rb.style.display = (pId === 'calc') ? 'flex' : 'none';
    }
    
    // board 페이지 접근 시 리스트 로드
    if(pId === 'board') loadLiveView('posts');
    if(pId === 'qna') loadLiveView('suggestions');
}

function openModal() {
    document.getElementById('edit-doc-id').value = "";
    document.getElementById('post-title').value = "";
    document.getElementById('post-content').value = "";
    document.getElementById('writeModal').classList.add('active');
}
function closeModal() { document.getElementById('writeModal').classList.remove('active'); }

function openViewModal(col, docId, data, canDel) {
    currentDocData = { col, docId, data };
    const title = data.content.split('|||')[0] || "제목 없음";
    const body = data.content.split('|||')[1] || "";
    
    const deleteArea = document.getElementById('delete-area');
    if(deleteArea) deleteArea.style.display = canDel ? 'block' : 'none';
    
    document.getElementById('view-content').innerHTML = `<h2 style="margin-top:0; color:var(--primary);">${title}</h2><p style="white-space:pre-wrap; line-height:1.5;">${body}</p>`;
    const img = document.getElementById('view-img');
    if(data.image) { img.src = data.image; img.style.display = 'block'; } 
    else { img.style.display = 'none'; }
    
    document.getElementById('edit-link').style.display = canDel ? 'inline' : 'none';
    loadReplies(col, docId, "view-replies");
    document.getElementById('viewModal').classList.add('active');
}
function closeViewModal() { document.getElementById('viewModal').classList.remove('active'); }

async function submitReply() {
    const input = document.getElementById('view-reply-input');
    const text = input.value.trim();
    if(!text || !currentDocData) return;

    try {
        await addReply(currentDocData.col, currentDocData.docId, text);
        input.value = "";
    } catch (error) {
        console.error("댓글 등록 실패:", error);
    }
}

async function sendLivePost() {
    const col = document.getElementById('page-board').classList.contains('active') ? 'posts' : 'suggestions';
    
    // 안전한 데이터 파싱을 위해 ||| 강제 치환
    const title = document.getElementById('post-title').value.replace(/\|\|\|/g, '');
    const content = document.getElementById('post-content').value.replace(/\|\|\|/g, '');
    const file = document.getElementById('post-file').files[0];
    const editId = document.getElementById('edit-doc-id').value;

    if(!title.trim() || !content.trim()) {
        alert("제목과 내용을 모두 입력해주세요.");
        return;
    }

    let imgUrl = editId ? (currentDocData.data.image || "") : ""; 
    if(file) {
        imgUrl = await new Promise(res => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = e => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const max_size = 800;
                    let w = img.width, h = img.height;
                    if (w > h) { if (w > max_size) { h *= max_size / w; w = max_size; } }
                    else { if (h > max_size) { w *= max_size / h; h = max_size; } }
                    canvas.width = w; canvas.height = h;
                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                    res(canvas.toDataURL('image/jpeg', 0.7));
                };
            };
        });
    }

    const fullText = title + "|||" + content;

    try {
        if(editId) {
            await db.collection(col).doc(editId).update({ content: fullText, image: imgUrl });
        } else {
            await db.collection(col).add({ 
                authorId: myId, content: fullText, image: imgUrl, 
                timestamp: firebase.firestore.FieldValue.serverTimestamp() 
            });
        }
        closeModal();
    } catch (error) {
        console.error("저장 실패:", error);
        alert("게시물 저장에 실패했습니다.");
    }
}

function loadLiveView(col) {
    db.collection(col).orderBy("timestamp", "desc").onSnapshot(snap => {
        const list = document.getElementById(col + '-list');
        if(!list) return;
        list.innerHTML = "";
        snap.forEach(doc => {
            const d = doc.data();
            const title = (d.content || "").split('|||')[0] || "제목 없음";
            const card = document.createElement('div');
            card.className = 'summary-card';
            card.onclick = () => openViewModal(col, doc.id, d, (isAdmin || d.authorId === myId));
            card.innerHTML = `<div class="summary-img-wrapper" style="height:200px; background:#f1f5f9; overflow:hidden; border-bottom:1px solid var(--insta-border);">${d.image ? `<img src="${d.image}" style="width:100%; height:100%; object-fit:cover;">` : `<div style="height:100%; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-weight:700;">NO IMAGE</div>`}</div><div class="summary-title" style="padding:15px; font-weight:800; font-size:1rem; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${title}</div>`;
            list.appendChild(card);
        });
    });
}

async function addReply(col, postId, text) {
    await db.collection(col).doc(postId).collection('replies').add({
        authorId: myId, content: text, timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
}

function loadReplies(col, postId, targetId) {
    db.collection(col).doc(postId).collection('replies').orderBy("timestamp", "asc").onSnapshot(snap => {
        const rb = document.getElementById(targetId);
        if(!rb) return;
        rb.innerHTML = "";
        snap.forEach(doc => {
            const rd = doc.data();
            rb.innerHTML += `<div style="padding: 8px; border-radius: 8px; background: var(--bg-main); margin-bottom: 6px;"><b style="color:var(--primary);">연맹원</b> <span style="color:var(--text-main);">${rd.content}</span></div>`;
        });
    });
}

function deleteCurrentPost() {
    if(confirm("정말 삭제하시겠습니까?")) {
        db.collection(currentDocData.col).doc(currentDocData.docId).delete();
        closeViewModal();
    }
}

// 1. 접속자 정보 기록
function updatePresence() {
    const myPresenceRef = db.collection('presence').doc(myId);
    myPresenceRef.set({ 
        lastSeen: firebase.firestore.FieldValue.serverTimestamp() 
    }).catch(err => console.error("Presence update error:", err));
}

// 2. 실시간 감시 및 UI 업데이트
db.collection('presence').onSnapshot(snap => {
    const now = Date.now();
    let count = 0;
    snap.forEach(doc => {
        const d = doc.data();
        if (d.lastSeen && (now - d.lastSeen.toMillis() < 300000)) count++;
    });

    const countEl = document.getElementById('user-count');
    if (countEl) countEl.innerText = count + "명 접속 중";
}, err => {
    console.error("Presence error:", err);
});

// 초기 실행 및 주기적 실행 (구문 오류 수정됨)
updatePresence();
setInterval(updatePresence, 30000);
