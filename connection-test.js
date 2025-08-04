/* Multi-App Manager v0.49 - Connection Test & Proof */

// 接続証明を表示
function showConnectionProof() {
    const proofDiv = document.createElement('div');
    proofDiv.id = 'connectionProof';
    proofDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px;
        border-radius: 8px;
        z-index: 10000;
        max-width: 300px;
        font-size: 12px;
        line-height: 1.4;
    `;
    
    let proofText = '<strong>🔍 Firebase接続証明</strong><br><br>';
    
    // 1. 認証状態
    if (firebase.auth().currentUser) {
        const user = firebase.auth().currentUser;
        proofText += `✅ 認証: ${user.email}<br>`;
        proofText += `👤 UID: ${user.uid.substring(0, 8)}...<br><br>`;
    } else {
        proofText += '❌ 未認証<br><br>';
    }
    
    // 2. データベース接続テスト
    const testRef = firebase.database().ref('.info/connected');
    testRef.once('value', (snapshot) => {
        const connected = snapshot.val();
        proofText += `🌐 DB接続: ${connected ? '✅ 成功' : '❌ 失敗'}<br>`;
        
        if (connected && firebase.auth().currentUser) {
            // 3. 実際にデータを書き込んで証明
            const user = firebase.auth().currentUser;
            const proofRef = firebase.database().ref(`users/${user.uid}/connection-proof`);
            const timestamp = new Date().toISOString();
            
            proofRef.set({
                timestamp: timestamp,
                message: 'Firebase接続成功',
                version: 'v0.49'
            }).then(() => {
                proofText += `📝 書き込み: ✅ 成功<br>`;
                proofText += `⏰ 時刻: ${new Date().toLocaleString()}<br><br>`;
                proofText += `<button onclick="document.getElementById('connectionProof').remove()" 
                              style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                              閉じる
                              </button>`;
                proofDiv.innerHTML = proofText;
            }).catch((error) => {
                proofText += `📝 書き込み: ❌ ${error.message}<br><br>`;
                proofDiv.innerHTML = proofText;
            });
        } else {
            proofDiv.innerHTML = proofText;
        }
    });
    
    proofDiv.innerHTML = proofText + '読み込み中...';
    document.body.appendChild(proofDiv);
}

// 接続証明ボタンを追加
function addConnectionProofButton() {
    const proofButton = document.createElement('button');
    proofButton.textContent = '✅ 接続証明';
    proofButton.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        z-index: 9999;
        font-size: 12px;
    `;
    proofButton.onclick = showConnectionProof;
    document.body.appendChild(proofButton);
}

// ページ読み込み後に証明ボタンを追加
window.addEventListener('load', () => {
    setTimeout(addConnectionProofButton, 3000);
});