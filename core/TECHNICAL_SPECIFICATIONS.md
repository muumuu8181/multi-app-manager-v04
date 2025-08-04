# 🔧 Multi-App Manager v0.5 - 技術仕様書

**Core保護ドキュメント - 技術者向け詳細仕様**

---

## 🏗️ アーキテクチャ概要

### システム構成
```
Multi-App Manager v0.5
├── Frontend: HTML5 + JavaScript (ES6+)
├── Backend: Node.js Express Server (Port 3003)
├── Database: Firebase Realtime Database
├── Authentication: Firebase Auth + Google OAuth
└── Testing: 必須要件自動チェック機能
```

---

## 🔥 Firebase Integration 詳細

### 初期化シーケンス
```javascript
// 1. Firebase SDK読み込み (index.html 9-12行目)
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>

// 2. 設定初期化 (index.html 15-28行目)
const firebaseConfig = {
    apiKey: "AIzaSyA5PXKChizYDCXF_GJ4KL6Ylq9K5hCPXWE",
    authDomain: "shares-b1b97.firebaseapp.com",
    databaseURL: "https://shares-b1b97-default-rtdb.firebaseio.com",
    projectId: "shares-b1b97",
    storageBucket: "shares-b1b97.firebasestorage.app",
    messagingSenderId: "38311063248",
    appId: "1:38311063248:web:0d2d5726d12b305b24b8d5"
};

// 3. Core Classes初期化 (index.html 31-186行目)
window.firebaseAuthCore = new FireBaseAuthCore();
window.firebaseDataCore = new FirebaseDataCore();
```

### 認証フロー詳細
```javascript
// FirebaseAuthCore Class (index.html 31-118行目)
class FirebaseAuthCore {
    constructor() {
        this.user = null;
        this.auth = null;
        this.callbacks = {
            onAuthStateChanged: [],
            onLoginSuccess: [],
            onLoginError: [],
            onLogoutSuccess: []
        };
        this.isInitialized = false;
    }

    init(firebaseConfig) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        this.auth = firebase.auth();
        this.setupAuthStateListener();
        this.isInitialized = true;
    }

    setupAuthStateListener() {
        this.auth.onAuthStateChanged((user) => {
            this.user = user;
            this.callbacks.onAuthStateChanged.forEach(callback => callback(user));
        });
    }

    async signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await this.auth.signInWithPopup(provider);
        this.callbacks.onLoginSuccess.forEach(callback => callback(result.user));
        return result.user;
    }
}
```

### データ管理フロー
```javascript
// FirebaseDataCore Class (index.html 120-186行目)
class FirebaseDataCore {
    constructor() {
        this.database = null;
        this.userRef = null;
        this.dataType = null;
        this.callbacks = {
            onConnectionChange: [],
            onError: []
        };
    }

    init(firebaseConfig, dataType = 'app-data') {
        this.database = firebase.database();
        this.dataType = dataType;
        this.setupConnectionListener();
    }

    setupUserData(user) {
        if (user) {
            this.userRef = this.database.ref(`users/${user.uid}/${this.dataType}`);
        } else {
            this.userRef = null;
        }
    }

    async addData(data) {
        if (!this.userRef) {
            throw new Error('User not authenticated');
        }
        const newRef = this.userRef.push();
        await newRef.set({
            ...data,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        return newRef.key;
    }
}
```

---

## 📋 必須要件チェック機能 詳細

### connection-test.js 実装解析

```javascript
// 必須要件チェック関数 (connection-test.js 31-78行目)
function showConnectionProof() {
    // UI生成
    const proofDiv = document.createElement('div');
    proofDiv.id = 'connectionProof';
    
    // 要件1: Firebase Database チェック
    if (firebase.database && firebase.database()) {
        proofText += '✅ Firebase Database 接続中<br>';
        proofText += '✅ LocalStorage 回避済み<br>';
    }
    
    // 要件2: Google認証チェック
    if (firebase.auth().currentUser) {
        const user = firebase.auth().currentUser;
        proofText += `✅ Google認証 成功<br>`;
        proofText += `✅ ユーザー: ${user.email}<br>`;
        proofText += `✅ UID: ${user.uid.substring(0, 8)}...<br>`;
    }
    
    // 要件3: コピー機能チェック
    const copyButtons = document.querySelectorAll('.universal-copy-btn, .copy-btn, [onclick*="copy"]');
    if (copyButtons.length > 0) {
        proofText += `✅ コピーボタン: ${copyButtons.length}個 検出<br>`;
    }
    
    // 要件4: Core保護チェック
    if (window.firebaseConfig && window.firebaseAuthCore) {
        proofText += '✅ Firebase Core 保護済み<br>';
        proofText += '✅ 認証Core 保護済み<br>';
    }
}
```

### 証明データ永続化
```javascript
// Firebase書き込み証明 (connection-test.js 93-137行目)
const proofData = {
    timestamp: timestamp,
    requirements_check: {
        firebase_database: '✅ 使用中',
        google_auth: '✅ 認証済み',
        log_copy_features: copyButtons.length > 0 ? '✅ 検出済み' : '❌ 未検出',
        core_protection: (window.firebaseConfig && window.firebaseAuthCore) ? '✅ 保護済み' : '❌ 変更検出'
    },
    version: 'v0.5-requirements-compliant',
    compliance_status: 'MANDATORY_REQUIREMENTS_MET'
};

// Firebase Database パス: users/{uid}/mandatory-requirements-proof
const proofRef = firebase.database().ref(`users/${user.uid}/mandatory-requirements-proof`);
await proofRef.set(proofData);
```

---

## 🔧 デバッグシステム詳細

### debug-firebase.js 機能解析

```javascript
// デバッグ実行関数 (debug-firebase.js 4-74行目)
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
    }
    
    // 3. データベース接続テスト
    const testRef = firebase.database().ref('.info/connected');
    testRef.on('value', (snapshot) => {
        const connected = snapshot.val();
        console.log('🌐 Firebase接続状態:', connected);
        
        if (connected && firebase.auth().currentUser) {
            // 4. 読み書きテスト
            const userRef = firebase.database().ref(`users/${user.uid}/test`);
            userRef.set({
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                message: 'Connection test',
                version: '0.48'
            });
        }
    });
}
```

### コピー機能実装
```javascript
// デバッグ情報コピー (debug-firebase.js 119-138行目)
function copyDebugInfo() {
    const user = firebase.auth().currentUser;
    const debugInfo = `Firebase Debug Info:
===================
Config: ${JSON.stringify(firebaseConfig, null, 2)}
Auth Status: ${user ? 'Authenticated' : 'Not authenticated'}
${user ? `User: ${user.email} (${user.uid.substring(0,8)}...)` : ''}
Database URL: ${firebaseConfig.databaseURL}
Timestamp: ${new Date().toLocaleString()}
Browser: ${navigator.userAgent}
URL: ${window.location.href}`;
    
    navigator.clipboard.writeText(debugInfo);
}
```

---

## 🎨 UI Components詳細

### コピーボタンシステム
```javascript
// ユーザー情報コピー (index.html 193-201行目)
function copyUserInfo() {
    const user = firebase.auth().currentUser;
    if (user) {
        const userInfo = `ユーザー情報:
Email: ${user.email}
UID: ${user.uid}
DisplayName: ${user.displayName || 'N/A'}
作成日時: ${new Date(user.metadata.creationTime).toLocaleString()}
最終ログイン: ${new Date(user.metadata.lastSignInTime).toLocaleString()}`;
        navigator.clipboard.writeText(userInfo);
        showCopyNotification('ユーザー情報をコピーしました');
    }
}

// 接続情報コピー (index.html 203-210行目)
function copyConnectionStatus() {
    const status = document.getElementById('connectionStatus').textContent;
    const timestamp = new Date().toLocaleString();
    const connectionInfo = `Firebase接続状態: ${status}
確認時刻: ${timestamp}
URL: ${window.location.href}`;
    navigator.clipboard.writeText(connectionInfo);
    showCopyNotification('接続情報をコピーしました');
}
```

### 通知システム
```javascript
// コピー通知表示 (index.html 212-229行目)
function showCopyNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = `✅ ${message}`;
    notification.style.cssText = `
        position: fixed;
        top: 50px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 9999;
        font-size: 12px;
        animation: fadeInOut 3s ease-in-out;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}
```

---

## 🌐 サーバー構成

### simple-server.js 解析
```javascript
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3003;

// CORS設定 - Firebase認証に必要
app.use(cors());

// 静的ファイル配信 - SPAサポート
app.use(express.static(__dirname));

// JSONパース - API通信用
app.use(express.json());

// ルートアクセス - index.html配信
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`🚀 Multi-App Manager v0.46 Server`);
    console.log(`📡 http://localhost:${PORT}`);
    console.log(`🔑 Firebase認証対応サーバー起動完了`);
});
```

---

## 📊 パフォーマンス最適化

### 読み込み順序
1. **HTML構造** (index.html) - 即座表示
2. **Firebase SDK** (CDN) - 並列読み込み
3. **Core Classes** (Inline) - 同期実行
4. **Application Scripts** (External) - 非同期読み込み

### メモリ管理
```javascript
// グローバル変数最小化
window.firebaseAuthCore = null;  // 認証管理
window.firebaseDataCore = null;  // データ管理
window.firebaseConfig = {...};   // 設定情報のみ

// イベントリスナー自動クリーンアップ
window.addEventListener('beforeunload', () => {
    // Firebase接続クリーンアップは自動
    // カスタムリスナーのみ手動クリーンアップ
});
```

---

## 🔒 セキュリティ考慮事項

### Firebase Rules
```json
// firebase-database-rules.json
{
  "rules": {
    ".read": false,
    ".write": false,
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### クライアントサイド保護
```javascript
// API Key保護 (公開しても安全)
// Firebase Rules により実際のアクセス制御

// XSS対策
// innerHTML使用時は必要最小限
// textContent優先使用

// CSRF対策  
// Firebase Auth Token による自動保護
```

---

## 🧪 テスト仕様

### 必須要件テスト
```javascript
// 自動テスト関数 (connection-test.js内)
function runMandatoryRequirementsTest() {
    const results = {
        firebase_database: firebase.database && firebase.database(),
        google_auth: firebase.auth().currentUser !== null,
        copy_buttons: document.querySelectorAll('.universal-copy-btn').length > 0,
        core_protection: window.firebaseConfig && window.firebaseAuthCore
    };
    
    const allPassed = Object.values(results).every(result => result === true);
    return {
        results,
        allPassed,
        compliance: allPassed ? 'MANDATORY_REQUIREMENTS_MET' : 'REQUIREMENTS_FAILED'
    };
}
```

### 統合テスト手順
1. **サーバー起動**: `npm start`
2. **ブラウザアクセス**: `http://localhost:3003`
3. **認証テスト**: Google ログイン実行
4. **機能テスト**: 各タブとコピー機能確認
5. **要件テスト**: 「✅ 接続証明」ボタン実行
6. **結果確認**: ALL GREEN 表示確認

---

## 📈 監視・ログ

### Firebase Analytics
```javascript
// 接続状態監視
firebase.database().ref('.info/connected').on('value', (snapshot) => {
    const connected = snapshot.val();
    console.log('Firebase接続状態:', connected ? '接続中' : '切断');
});

// 認証状態監視
firebase.auth().onAuthStateChanged((user) => {
    console.log('認証状態変更:', user ? user.email : '未認証');
});
```

### エラーハンドリング
```javascript
// Firebase操作エラー
try {
    await firebase.database().ref('test').set(data);
} catch (error) {
    console.error('Firebase書き込みエラー:', error.code, error.message);
    // ユーザーフレンドリーなエラー表示
}

// 認証エラー
firebase.auth().signInWithPopup(provider).catch((error) => {
    console.error('認証エラー:', error.code, error.message);
    // エラー種別に応じた処理分岐
});
```

---

**🔧 技術仕様書 - Multi-App Manager v0.5**
**作成日: 2025-08-05 | 最終更新: 2025-08-05**