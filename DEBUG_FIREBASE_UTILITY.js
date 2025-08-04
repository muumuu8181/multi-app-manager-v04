/**
 * Firebase デバッグユーティリティ
 * 
 * 🎯 用途: Firebase初期化の問題を視覚的に診断
 * 📅 作成日: 2025-01-04
 * 🏷️ バージョン: v1.0
 * 
 * 💡 使い方:
 * 1. HTML内のボタンに onclick="debugFirebaseStatus()" を追加
 * 2. このスクリプトを読み込み
 * 3. ボタンクリックでFirebaseの状態を確認
 */

// Firebase状態を視覚的にデバッグする関数
function debugFirebaseStatus() {
    // 各コンポーネントの状態をチェック
    const debugInfo = {
        'Firebase SDK': typeof firebase !== 'undefined' ? '✅ 利用可能' : '❌ 未読み込み',
        'FirebaseAuthCore Class': typeof FirebaseAuthCore !== 'undefined' ? '✅ 定義済み' : '❌ 未定義',
        'firebaseAuthCore Instance': window.firebaseAuthCore ? '✅ 作成済み' : '❌ 未作成',
        'isInitialized': window.firebaseAuthCore?.isInitialized ? '✅ 初期化完了' : '❌ 未初期化',
        'FirebaseDataCore Class': typeof FirebaseDataCore !== 'undefined' ? '✅ 定義済み' : '❌ 未定義',
        'firebaseDataCore Instance': window.firebaseDataCore ? '✅ 作成済み' : '❌ 未作成'
    };
    
    // 追加情報
    const additionalInfo = {
        'Current Protocol': location.protocol,
        'Current Host': location.host,
        'Firebase Apps Length': typeof firebase !== 'undefined' ? firebase.apps.length : 'N/A'
    };
    
    // デバッグメッセージを構築
    let debugMessage = '🔍 Firebase デバッグ情報:\n\n';
    debugMessage += '=== 基本コンポーネント ===\n';
    for (const [key, value] of Object.entries(debugInfo)) {
        debugMessage += `${key}: ${value}\n`;
    }
    
    debugMessage += '\n=== 環境情報 ===\n';
    for (const [key, value] of Object.entries(additionalInfo)) {
        debugMessage += `${key}: ${value}\n`;
    }
    
    // コンソールとアラートの両方に出力
    console.log(debugMessage);
    alert(debugMessage);
    
    // 簡易的な解決策の提案
    let suggestion = '\n💡 推奨アクション:\n';
    if (typeof firebase === 'undefined') {
        suggestion += '- Firebase SDK の読み込みを確認\n';
    } else if (typeof FirebaseAuthCore === 'undefined') {
        suggestion += '- FirebaseAuthCore クラスの定義を確認\n';
    } else if (!window.firebaseAuthCore) {
        suggestion += '- FirebaseAuthCore インスタンスの作成処理を確認\n';
    } else if (!window.firebaseAuthCore.isInitialized) {
        suggestion += '- Firebase初期化処理のエラーログを確認\n';
    } else {
        suggestion += '- 全て正常です！ログイン処理を実行できます\n';
    }
    
    console.log(suggestion);
    alert(suggestion);
    
    return debugInfo;
}

// より詳細なFirebase設定確認
function debugFirebaseConfig() {
    if (typeof firebase === 'undefined') {
        alert('Firebase SDK が読み込まれていません');
        return;
    }
    
    const config = window.firebaseConfig || {};
    const configInfo = {
        'API Key': config.apiKey ? '設定済み (****)' : '未設定',
        'Auth Domain': config.authDomain || '未設定',
        'Database URL': config.databaseURL || '未設定',
        'Project ID': config.projectId || '未設定'
    };
    
    let message = '🔥 Firebase 設定情報:\n\n';
    for (const [key, value] of Object.entries(configInfo)) {
        message += `${key}: ${value}\n`;
    }
    
    console.log(message);
    alert(message);
}

// Firebase初期化を強制実行（デバッグ用）
async function forceFirebaseInit() {
    try {
        console.log('🔄 Firebase強制初期化開始...');
        
        if (typeof FirebaseAuthCore === 'undefined') {
            throw new Error('FirebaseAuthCore クラスが定義されていません');
        }
        
        // 強制的にインスタンス作成
        window.firebaseAuthCore = new FirebaseAuthCore();
        console.log('✅ FirebaseAuthCore インスタンス強制作成完了');
        
        // 強制的に初期化
        await window.firebaseAuthCore.init(window.firebaseConfig);
        console.log('✅ FirebaseAuthCore 強制初期化完了');
        
        alert('✅ Firebase強制初期化が成功しました！');
        
    } catch (error) {
        console.error('❌ Firebase強制初期化失敗:', error);
        alert(`❌ Firebase強制初期化失敗:\n${error.message}`);
    }
}

// エクスポート用オブジェクト
const FirebaseDebugUtility = {
    debugFirebaseStatus,
    debugFirebaseConfig,
    forceFirebaseInit,
    
    // 使用例
    usage: {
        basic: 'debugFirebaseStatus()',
        config: 'debugFirebaseConfig()',
        force: 'forceFirebaseInit()'
    }
};

// グローバルに公開
if (typeof window !== 'undefined') {
    window.FirebaseDebugUtility = FirebaseDebugUtility;
    window.debugFirebaseStatus = debugFirebaseStatus;
    window.debugFirebaseConfig = debugFirebaseConfig;
    window.forceFirebaseInit = forceFirebaseInit;
}

console.log('🔧 Firebase Debug Utility loaded successfully');