// [추가] Firebase 설정 및 db 변수 정의 (에러 해결 핵심)
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
const db = firebase.firestore(); // 여기서 db를 정의해야 ReferenceError가 사라집니다.

// 기존 board.js 내용 시작...
let currentDocData = null;
const myId = localStorage.getItem('vs_auth_id') || 'u' + Math.random().toString(36).substr(2, 7);
if(!localStorage.getItem('vs_auth_id')) localStorage.setItem('vs_auth_id', myId);
let isAdmin = false;

function showPage(pId) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('page-' + pId).classList.add('active');
    document.getElementById('nav-' + pId).classList.add('active');
    document.getElementById('float-btn').style.display = (pId === 'board' || pId === 'qna') ? 'flex' : 'none';
}

function openModal() {
    document.getElementById('edit-doc-id').value = "";
    document.getElementById('post-title').value = "";
    document.getElementById('post-content').value = "";
    document.getElementById('writeModal').classList.add('active');
}
function closeModal() { document.getElementById('writeModal').classList.remove('active'); }

function openViewModal(col, docId, data, canDel, time) {
    currentDocData = { col, docId, data };
    const title = data.content.split('|||')[0] || "제목 없음";
    const body = data.content.split('|||')[1] || "";
    
    document.getElementById('view-content').innerHTML = `<h2>${title}</h2><p style="white-space:pre-wrap;">${body}</p>`;
    const img = document.getElementById('view-img');
    if(data.image) { img.src = data.image; img.style.display = 'block'; } else { img.style.display = 'none'; }
    
    document.getElementById('edit-link').style.display = canDel ? 'inline' : 'none';
    document.getElementById('delete-area').style.display = canDel ? 'block' : 'none';
    loadReplies(col, docId, "view-replies");
    document.getElementById('viewModal').classList.add('active');
}
function closeViewModal() { document.getElementById('viewModal').classList.remove('active'); }

async function sendLivePost() {
    // 현재 활성화된 페이지에 따라 저장할 컬렉션 결정
    const col = document.getElementById('page-board').classList.contains('active') ? 'posts' : 'suggestions';
    
    // index.html에 정의된 분리된 ID로 데이터 가져오기
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const file = document.getElementById('post-file').files[0];
    const editId = document.getElementById('edit-doc-id').value;

    // 필수 입력 체크
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

    // 제목과 본문을 구분자(|||)로 합쳐서 content 필드에 저장
    const fullText = title + "|||" + content;

    try {
        if(editId) {
            // 수정 모드
            await db.collection(col).doc(editId).update({ 
                content: fullText, 
                image: imgUrl 
            });
        } else {
            // 신규 게시 모드
            await db.collection(col).add({ 
                authorId: myId, 
                content: fullText, 
                image: imgUrl, 
                timestamp: firebase.firestore.FieldValue.serverTimestamp() 
            });
        }
        // 완료 후 모달 닫기 및 입력창 초기화
        closeModal();
        document.getElementById('post-title').value = "";
        document.getElementById('post-content').value = "";
        document.getElementById('post-file').value = "";
    } catch (error) {
        console.error("게시물 저장 중 오류 발생:", error);
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
            const title = d.content.split('|||')[0];
            const card = document.createElement('div');
            card.className = 'summary-card';
            card.onclick = () => openViewModal(col, doc.id, d, (isAdmin || d.authorId === myId));
            card.innerHTML = `<div class="summary-img-wrapper">${d.image ? `<img src="${d.image}">` : `<div style="height:100%; display:flex; align-items:center; justify-content:center; color:#ccc;">NO IMAGE</div>`}</div><div class="summary-title">${title}</div>`;
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
            rb.innerHTML += `<div class="reply-item"><b>연맹원</b> ${rd.content}</div>`;
        });
    });
}

function deleteCurrentPost() {
    if(confirm("정말 삭제하시겠습니까?")) {
        db.collection(currentDocData.col).doc(currentDocData.docId).delete();
        closeViewModal();
    }
}
