/* Multi-App Manager v0.48 - Firebase Debug Tool */

// デバッグ情報を表示する関数
function debugFirebaseConnection() {
    console.log('=== Firebase Debug Info ===');
    
    // 1. 設定確認
    console.log('🔥 Firebase Config:', firebaseConfig);
    
    // 2. 認証状態確認
    if (firebase.auth().currentUser) {
        const user = firebase.auth().currentUser;
        console.log('✅ 認証済みユーザー:', {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
        });
    } else {
        console.log('❌ 未認証');
        return;
    }
    
    // 3. データベース接続テスト
    const testRef = firebase.database().ref('.info/connected');
    testRef.on('value', (snapshot) => {
        const connected = snapshot.val();
        console.log('🌐 Firebase接続状態:', connected);
        
        if (connected) {
            // 4. 手動でデータベースアクセステスト
            const user = firebase.auth().currentUser;
            if (user) {
                const userRef = firebase.database().ref(`users/${user.uid}/test`);
                
                // 書き込みテスト
                userRef.set({
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    message: 'Connection test',
                    version: '0.48'
                }).then(() => {
                    console.log('✅ データベース書き込み成功');
                    
                    // 読み込みテスト
                    userRef.once('value').then((snapshot) => {
                        const data = snapshot.val();
                        console.log('✅ データベース読み込み成功:', data);
                        
                        // 接続状態を強制更新
                        updateConnectionStatus(true);
                        
                    }).catch((error) => {
                        console.error('❌ データベース読み込みエラー:', error);
                    });
                    
                }).catch((error) => {
                    console.error('❌ データベース書き込みエラー:', error);
                    console.log('📋 エラー詳細:', {
                        code: error.code,
                        message: error.message
                    });
                });
            }
        }
    });
    
    // 5. データベースURL直接テスト
    console.log('🔗 Database URL:', firebaseConfig.databaseURL);
    
    // 6. ルール確認のヒント
    console.log('💡 Firebase Console確認項目:');
    console.log('- Authentication > Users タブでユーザー登録確認');
    console.log('- Realtime Database > Rules タブでルール確認');
    console.log('- Realtime Database > Data タブでデータ確認');
}

// デバッグボタンを追加
function addDebugButton() {
    const debugButton = document.createElement('button');
    debugButton.textContent = '🔍 Firebase Debug';
    debugButton.style.cssText = `
        position: fixed;
        top: 60px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        z-index: 9999;
        font-size: 12px;
    `;
    debugButton.onclick = debugFirebaseConnection;
    document.body.appendChild(debugButton);
}

// ページ読み込み後にデバッグボタンを追加
window.addEventListener('load', () => {
    setTimeout(addDebugButton, 2000);
});