let currentDocData = null;

function showPage(pId) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('page-' + pId).classList.add('active');
    document.getElementById('nav-' + pId).classList.add('active');

    const isFeedOrQna = (pId === 'board' || pId === 'qna');
    document.getElementById('float-btn').style.display = isFeedOrQna ? 'flex' : 'none';
    const adminBtn = document.querySelector('.admin-link');
    if(adminBtn) adminBtn.style.display = (pId === 'board') ? 'block' : 'none';
    const rb = document.querySelector('.result-bar');
    if(rb) rb.style.display = (pId === 'calc') ? 'block' : 'none';
}

function openModal() {
    document.getElementById('edit-doc-id').value = "";
    document.getElementById('post-text').value = "";
    document.getElementById('modal-title').innerText = "전략 공유하기 🖋️";
    document.getElementById('submit-btn').innerText = "게시하기";
    document.getElementById('writeModal').style.display = 'block';
}

function closeModal() { document.getElementById('writeModal').style.display = 'none'; }

function openViewModal(col, docId, data, canDel, time) {
    currentDocData = { col, docId, data };
    const modal = document.getElementById('viewModal');
    const img = document.getElementById('view-img');
    const content = document.getElementById('view-content');
    
    if(data.image) { img.src = data.image; img.style.display = 'block'; } 
    else { img.style.display = 'none'; }

    const lines = data.content.split('\n');
    content.innerHTML = `<h2 style="margin:0 0 15px 0; font-size:1.3rem;">${lines[0]}</h2>
                         <p style="white-space:pre-wrap; color:#555; line-height:1.7;">${lines.slice(1).join('\n')}</p>`;
    
    document.getElementById('reply-container').style.display = 'none';
    document.getElementById('edit-link').style.display = canDel ? 'inline' : 'none';
    document.getElementById('delete-area').style.display = canDel ? 'block' : 'none';

    document.getElementById('view-reply-btn').onclick = () => {
        const input = document.getElementById('view-reply-input');
        if(!input.value.trim()) return;
        addReply(col, docId, input.value);
        input.value = "";
    };

    loadReplies(col, docId, "view-replies");
    modal.style.display = 'block';
}

function closeViewModal() { document.getElementById('viewModal').style.display = 'none'; }
function toggleReplySection() {
    const rc = document.getElementById('reply-container');
    rc.style.display = rc.style.display === 'none' ? 'block' : 'none';
}

function prepareEdit() {
    const { docId, data } = currentDocData;
    closeViewModal();
    document.getElementById('writeModal').style.display = 'block';
    document.getElementById('modal-title').innerText = "게시물 수정하기 ✏️";
    document.getElementById('submit-btn').innerText = "수정 완료";
    document.getElementById('edit-doc-id').value = docId;
    document.getElementById('post-text').value = data.content;
}

async function sendLivePost() {
    const col = document.getElementById('page-board').classList.contains('active') ? 'posts' : 'suggestions';
    const txt = document.getElementById('post-text').value;
    const file = document.getElementById('post-file').files[0];
    const editId = document.getElementById('edit-doc-id').value;
    if(!txt.trim()) return;

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

    if(editId) {
        await db.collection(col).doc(editId).update({ content: txt, image: imgUrl });
    } else {
        await db.collection(col).add({ authorId: myId, content: txt, image: imgUrl, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    }
    closeModal();
}

function loadLiveView(col) {
    db.collection(col).orderBy("timestamp", "desc").onSnapshot(snap => {
        const list = document.getElementById(col + '-list');
        if(!list) return;
        list.innerHTML = "";
        snap.forEach(doc => {
            const d = doc.data();
            const docId = doc.id;
            const canDel = isAdmin || (d.authorId === myId);
            const time = d.timestamp ? new Date(d.timestamp.seconds*1000).toLocaleString('ko-KR') : "방금 전";
            
            const card = document.createElement('div');
            card.className = 'summary-card';
            card.onclick = () => openViewModal(col, docId, d, canDel, time);
            card.innerHTML = `
                <div class="summary-img-wrapper">
                    ${d.image ? `<img src="${d.image}">` : `<div style="height:100%; display:flex; align-items:center; justify-content:center; color:#cbd5e1; font-weight:800;">STRATEGY</div>`}
                </div>
                <div class="summary-body">
                    <div class="summary-title">${d.content.split('\n')[0]}</div>
                </div>`;
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
