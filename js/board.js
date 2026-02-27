/* ==========================================
   js/board.js - 커뮤니티 게시판 및 Firebase V9 연동
========================================== */
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, doc, setDoc, deleteDoc, updateDoc, query, orderBy } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { Store } from "./store.js";
import { customAlert, customConfirm } from "./main.js";

const firebaseConfig = { 
    apiKey: "AIzaSyAbGdlE4KnelSrrKGLVaLcM5433ZZILVYE", 
    authDomain: "lastwar-530f9.firebaseapp.com", 
    projectId: "lastwar-530f9", 
    storageBucket: "lastwar-530f9.firebasestorage.app", 
    messagingSenderId: "135982056229", 
    appId: "1:135982056229:web:92264d4601e5315cdd50cc" 
};

// V9 앱 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentDocData = null;


// Firebase 익명 로그인 (인증 정보 보강 버전)
signInAnonymously(auth).then((credential) => {
    // 1. Firebase에서 발급한 고유 UID 가져오기
    const firebaseUid = credential.user.uid;
    
    // 2. 기존 로컬 스토리지 ID 확인 (작성 권한 유지용)
    let myId = localStorage.getItem('vs_auth_id');
    
    if (!myId || !myId.startsWith('u')) {
        myId = firebaseUid;
        localStorage.setItem('vs_auth_id', myId);
    }
    
    // 3. Store에 확실히 저장
    Store.setState('authId', myId);
    
    console.log("인증 완료: ", myId); // 확인용 로그
    
    updatePresence();
    loadLiveView('posts');
}).catch(err => {
    console.error("Firebase Auth 상세 에러:", err.code, err.message);
    customAlert("인증 서버 연결에 실패했습니다. (사유: " + err.code + ")");
});

// UI 제어 함수들
export function openModal() {
    document.getElementById('edit-doc-id').value = "";
    document.getElementById('post-title').value = "";
    document.getElementById('post-content').value = "";
    document.getElementById('writeModal').classList.add('active');
}

// 👇 여기부터 아래 코드를 추가해 주세요! (수정 전용 모달 열기)
export function openEditModal() {
    if (!currentDocData) return;
    
    // 숨겨진 ID 창에 현재 문서 ID 저장
    document.getElementById('edit-doc-id').value = currentDocData.docId;
    
    // 기존 제목과 내용 불러오기
    const title = currentDocData.data.content.split('|||')[0] || "";
    const body = currentDocData.data.content.split('|||')[1] || "";
    
    // 입력창에 기존 데이터 채워넣기
    document.getElementById('post-title').value = title;
    document.getElementById('post-content').value = body;
    
    // 모달 전환 (보기 창 닫고, 쓰기 창 열기)
    document.getElementById('viewModal').classList.remove('active');
    document.getElementById('writeModal').classList.add('active');
}

export function openViewModal(col, docId, data, canDel) {
    currentDocData = { col, docId, data };
    const title = data.content.split('|||')[0] || "제목 없음";
    const body = data.content.split('|||')[1] || "";
    
    const deleteArea = document.getElementById('delete-area');
    if(deleteArea) deleteArea.style.display = canDel ? 'block' : 'none';
    
    document.getElementById('view-content').innerHTML = `<h2 style="margin-top:0; color:var(--text-main); font-weight:800;">${title}</h2><p style="white-space:pre-wrap; line-height:1.6; color:var(--text-muted);">${body}</p>`;
    
    const img = document.getElementById('view-img');
    if(data.image) { 
        img.src = data.image; img.style.display = 'block'; img.style.cursor = 'zoom-in'; 
        img.onclick = () => { document.getElementById('lightbox-img').src = data.image; document.getElementById('lightboxModal').classList.add('active'); };
    } 
    else { img.style.display = 'none'; }
    
    document.getElementById('edit-link').style.display = canDel ? 'inline' : 'none';
    loadReplies(col, docId, "view-replies");
    document.getElementById('viewModal').classList.add('active');
}

export async function submitReply() {
    const input = document.getElementById('view-reply-input');
    const text = input.value.trim();
    const myId = Store.getState('authId');
    if(!text || !currentDocData || !myId) return;
    try { 
        await addDoc(collection(db, currentDocData.col, currentDocData.docId, 'replies'), { 
            authorId: myId, content: text, timestamp: serverTimestamp() 
        }); 
        input.value = ""; 
    } catch (error) { console.error("댓글 등록 실패:", error); }
}

/* ==========================================
   js/board.js - 게시판 저장 기능 보강
========================================== */
export async function sendLivePost() {
    const myId = Store.getState('authId');
    if (!myId) { customAlert("인증 정보가 없습니다. 새로고침 해주세요."); return; }

    const titleEl = document.getElementById('post-title');
    const contentEl = document.getElementById('post-content');
    const fileEl = document.getElementById('post-file');
    const editId = document.getElementById('edit-doc-id').value;

    const title = titleEl.value.trim();
    const content = contentEl.value.trim();

    if(!title || !content) { customAlert("제목과 내용을 입력해주세요."); return; }

    // 💡 등록 프로세스 시작 알림
    const btn = document.querySelector('[data-action="sendLivePost"]');
    if(btn) { btn.disabled = true; btn.innerText = "전송 중..."; }

    try {
        let imgUrl = "";
        if(fileEl.files[0]) {
            // 이미지 압축 로직 (기존과 동일) ...
            imgUrl = await compressImage(fileEl.files[0]);
        } else if(editId) {
            imgUrl = currentDocData.data.image || "";
        }

        const fullContent = title + "|||" + content;
        
        if(editId) {
            await updateDoc(doc(db, 'posts', editId), {
                content: fullContent,
                image: imgUrl,
                timestamp: serverTimestamp()
            });
        } else {
            await addDoc(collection(db, 'posts'), {
                authorId: myId,
                content: fullContent,
                image: imgUrl,
                timestamp: serverTimestamp()
            });
        }

        document.getElementById('writeModal').classList.remove('active');
        titleEl.value = ""; contentEl.value = ""; fileEl.value = "";
    } catch (e) {
        console.error("저장 실패:", e);
        customAlert("저장에 실패했습니다. 콘솔(F12)의 에러 메시지를 확인해주세요.");
    } finally {
        if(btn) { btn.disabled = false; btn.innerText = "등록하기"; }
    }
}

// 이미지 압축 헬퍼 함수
async function compressImage(file) {
    return new Promise(res => {
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

export function loadLiveView(col) {
    const q = query(collection(db, col), orderBy("timestamp", "desc"));
    onSnapshot(q, (snap) => {
        const list = document.getElementById(col + '-list');
        if(!list) return; list.innerHTML = "";
        
        const myId = Store.getState('authId');
        const isAdmin = Store.getState('isAdmin');

        snap.forEach(docSnap => {
            const d = docSnap.data();
            const title = (d.content || "").split('|||')[0] || "제목 없음";
            const card = document.createElement('div');
            card.className = 'summary-card';
            card.onclick = () => openViewModal(col, docSnap.id, d, (isAdmin || d.authorId === myId));
            card.innerHTML = `${d.image ? `<div class="summary-img-wrapper"><img src="${d.image}" loading="lazy"></div>` : ''}<div class="summary-title">${title}</div>`;
            list.appendChild(card);
        });
    });
}

function loadReplies(col, postId, targetId) {
    const q = query(collection(db, col, postId, 'replies'), orderBy("timestamp", "asc"));
    onSnapshot(q, (snap) => {
        const rb = document.getElementById(targetId);
        if(!rb) return; rb.innerHTML = "";
        snap.forEach(docSnap => {
            const rd = docSnap.data();
            rb.innerHTML += `<div style="padding: 10px 12px; border-radius: 12px; background: var(--input-bg); margin-bottom: 8px;"><b style="color:var(--primary);">연맹원</b> <span style="color:var(--text-main); margin-left: 5px;">${rd.content}</span></div>`;
        });
    });
}

export function deletePostUI() {
    customConfirm("정말 삭제하시겠습니까?", async () => {
        if (currentDocData) {
            await deleteDoc(doc(db, currentDocData.col, currentDocData.docId));
            document.getElementById('viewModal').classList.remove('active');
        }
    });
}

function updatePresence() {
    const myId = Store.getState('authId');
    if (!myId) return;
    setDoc(doc(db, 'presence', myId), { lastSeen: serverTimestamp() }, { merge: true })
        .catch(err => console.error(err));
}

// 접속자 수 카운팅
onSnapshot(collection(db, 'presence'), (snap) => {
    const now = Date.now(); let count = 0;
    snap.forEach(docSnap => { 
        const d = docSnap.data(); 
        if (d.lastSeen && (now - d.lastSeen.toMillis() < 300000)) count++; 
    });
    const countEl = document.getElementById('user-count'); 
    if (countEl) countEl.innerText = count + "명 접속 중";
});

setInterval(updatePresence, 30000);
