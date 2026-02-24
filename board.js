
// Firebase 설정 (이미지 기반)
const firebaseConfig = { apiKey: "AIzaSyAbGdlE4KnelSrrKGLVaLcM5433ZZILVYE", authDomain: "lastwar-530f9.firebaseapp.com", projectId: "lastwar-530f9", storageBucket: "lastwar-530f9.firebasestorage.app", messagingSenderId: "135982056229", appId: "1:135982056229:web:92264d4601e5315cdd50cc" };
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

if(!localStorage.getItem('vs_auth_id')) localStorage.setItem('vs_auth_id', 'u' + Math.random().toString(36).substr(2, 7));
const myId = localStorage.getItem('vs_auth_id');
let isAdmin = false;

// 페이지 전환
// board.js 파일의 showPage 함수 수정
function showPage(pId) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById('page-' + pId).classList.add('active');
    document.getElementById('nav-' + pId).classList.add('active');
    
    // 글쓰기 버튼 표시 제어
    document.getElementById('float-btn').style.display = pId === 'calc' ? 'none' : 'flex';

    // [추가] 하단 결과 바(배너) 표시 제어
    const resultBar = document.querySelector('.result-bar');
    if (resultBar) {
        resultBar.style.display = pId === 'calc' ? 'block' : 'none';
    }

    window.scrollTo(0,0);
}
function openModal() { document.getElementById('writeModal').style.display = 'block'; }
function closeModal() { document.getElementById('writeModal').style.display = 'none'; }
function enableAdmin() { if(prompt("비밀번호") === "1234") { isAdmin = true; alert("관리자 모드 활성"); loadLiveView('posts'); } }

// 게시글 작성
// board.js 내 수정할 부분
async function sendLivePost() {
    const col = document.getElementById('page-board').classList.contains('active') ? 'posts' : 'suggestions';
    const txt = document.getElementById('post-text').value;
    const file = document.getElementById('post-file').files[0];
    if(!txt.trim()) return;

    let imgUrl = "";
    if(file) {
        // [이미지 압축 로직 추가]
        imgUrl = await new Promise(res => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = event => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const max_size = 800; // 가로 세로 최대 800px로 제한
                    let width = img.width;
                    let height = img.height;
                    if (width > height) { if (width > max_size) { height *= max_size / width; width = max_size; } }
                    else { if (height > max_size) { width *= max_size / height; height = max_size; } }
                    canvas.width = width; canvas.height = height;
                    canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                    res(canvas.toDataURL('image/jpeg', 0.7)); // 화질 70%로 압축
                };
            };
        });
    }
    db.collection(col).add({ authorId: myId, content: txt, image: imgUrl, timestamp: firebase.firestore.FieldValue.serverTimestamp() })
    .then(() => { closeModal(); document.getElementById('post-text').value=""; });
}
// 피드 로드
function loadLiveView(col) {
    db.collection(col).orderBy("timestamp", "desc").onSnapshot(snap => {
        const list = document.getElementById(col + '-list'); list.innerHTML = "";
        snap.forEach(doc => {
            const d = doc.data(); const canDel = isAdmin || (d.authorId === myId);
            const time = d.timestamp ? new Date(d.timestamp.seconds*1000).toLocaleString('ko-KR', {month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : "방금 전";
            list.innerHTML += `<div class="insta-card"><div class="insta-header"><div class="avatar">${d.authorId?d.authorId.substr(1,2).toUpperCase():'W'}</div><div style="font-size:0.85rem; font-weight:700">연맹원_${d.authorId?d.authorId.substr(1,4):'익명'}</div>${canDel?`<div class="del-link" onclick="deletePost('${col}','${doc.id}')">삭제</div>`:""}</div>${d.image?`<img src="${d.image}" class="insta-img">`:""}<div class="insta-body"><div style="display:flex; gap:12px; margin-bottom:8px; font-size:1.2rem"><span>🤍</span><span>💬</span><span>✈️</span></div><div class="insta-content"><b>연맹원_${d.authorId?d.authorId.substr(1,4):'익명'}</b> ${d.content}</div><div class="insta-time">${time}</div></div></div>`;
        });
    });
}
function deletePost(col, id) { if(confirm("삭제?")) db.collection(col).doc(id).delete(); }

// 라이브 접속자 로직
function updatePresence() { db.collection('presence').doc(myId).set({ lastSeen: firebase.firestore.FieldValue.serverTimestamp() }); }
setInterval(updatePresence, 30000); updatePresence();
db.collection('presence').onSnapshot(snap => {
    const now = Date.now(); let count = 0;
    snap.forEach(doc => { if(doc.data().lastSeen && (now - doc.data().lastSeen.toMillis() < 300000)) count++; });
    document.getElementById('user-count').innerText = count + "명 접속 중";
});

// 초기 실행
window.onload = () => { initCalc(); loadLiveView('posts'); loadLiveView('suggestions'); };
