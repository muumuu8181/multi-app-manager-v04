/* Multi-App Manager v0.43 - Main Application */

// アプリ設定とコンテンツの管理クラス
class AppManager {
    constructor() {
        this.apps = new Map();
        this.activeApp = null;
        this.settings = this.loadSettings();
        this.tabsConfig = null;
        this.init();
    }

    // 初期化
    async init() {
        await this.loadTabsConfig();
        this.registerDefaultApps();
        this.registerTabsFromConfig();
        this.generateDemoApps();
        this.renderTabs();
        this.renderSettings();
        this.showApp('welcome');
        this.updateStatus(`${this.apps.size}個のアプリが利用可能`);
    }

    // 外部タブ設定の読み込み（フォールバック対応）
    async loadTabsConfig() {
        try {
            const response = await fetch('tabs-config.json');
            this.tabsConfig = await response.json();
            console.log('タブ設定を読み込みました:', this.tabsConfig);
        } catch (error) {
            console.warn('タブ設定の読み込みに失敗、デフォルト設定を使用:', error);
            // フォールバック: デフォルト設定を直接定義
            this.tabsConfig = {
                "tabs": [
                    {
                        "id": "tab1",
                        "name": "時間管理",
                        "icon": "⏰",
                        "category": "productivity",
                        "type": "content",
                        "description": "時間の管理と効率化ツール"
                    },
                    {
                        "id": "tab2", 
                        "name": "体型管理",
                        "icon": "🏃‍♀️",
                        "category": "health",
                        "type": "content",
                        "description": "体型維持と健康管理システム"
                    },
                    {
                        "id": "tab3",
                        "name": "仕事管理", 
                        "icon": "💼",
                        "category": "work",
                        "type": "content",
                        "description": "業務とプロジェクトの管理"
                    },
                    {
                        "id": "tab4",
                        "name": "女性管理",
                        "icon": "👩",
                        "category": "lifestyle",
                        "type": "content", 
                        "description": "女性向けライフスタイル管理"
                    },
                    {
                        "id": "tab5",
                        "name": "計算グループ",
                        "icon": "🧮",
                        "category": "tools",
                        "type": "calculator-tabs",
                        "description": "各種計算機能（内部タブ）"
                    },
                    {
                        "id": "tab6",
                        "name": "部屋片付け",
                        "icon": "🧹",
                        "category": "lifestyle",
                        "type": "content",
                        "description": "部屋の整理整頓と清掃管理"
                    },
                    {
                        "id": "tab7",
                        "name": "タブ7",
                        "icon": "7️⃣", 
                        "category": "tab",
                        "type": "content",
                        "description": "カスタマイズ可能なタブ7"
                    },
                    {
                        "id": "tab8",
                        "name": "タブ8",
                        "icon": "8️⃣",
                        "category": "tab", 
                        "type": "content",
                        "description": "カスタマイズ可能なタブ8"
                    },
                    {
                        "id": "tab9",
                        "name": "タブ9",
                        "icon": "9️⃣",
                        "category": "tab",
                        "type": "content", 
                        "description": "カスタマイズ可能なタブ9"
                    },
                    {
                        "id": "tab10",
                        "name": "タブ10",
                        "icon": "🔟",
                        "category": "tab",
                        "type": "content",
                        "description": "カスタマイズ可能なタブ10"
                    }
                ]
            };
        }
    }

    // デフォルトアプリの登録
    registerDefaultApps() {
        this.registerApp({
            id: 'welcome',
            name: 'ホーム',
            icon: '🏠',
            category: 'system',
            content: this.getWelcomeContent()
        });
    }

    // 外部設定からタブを登録
    registerTabsFromConfig() {
        if (!this.tabsConfig || !this.tabsConfig.tabs) return;

        this.tabsConfig.tabs.forEach(tabConfig => {
            let appData = {
                id: tabConfig.id,
                name: tabConfig.name,
                icon: tabConfig.icon,
                category: tabConfig.category
            };

            switch(tabConfig.type) {
                case 'calculator-tabs':
                    appData.content = this.getCalculatorTabsContent();
                    break;
                case 'time-management-tabs':
                    appData.content = this.getTimeManagementTabsContent();
                    break;
                case 'todolist':
                    appData.content = this.getTodoListContent();
                    break;
                case 'content':
                    appData.content = this.getTabContent(tabConfig.id, tabConfig.name, tabConfig.description);
                    break;
                case 'url':
                    appData.url = tabConfig.url;
                    break;
                default:
                    appData.content = this.getTabContent(tabConfig.id, tabConfig.name, tabConfig.description);
            }

            this.registerApp(appData);
        });
    }

    // デモアプリの生成（100個対応のテスト）
    generateDemoApps() {
        const categories = ['ツール', 'ゲーム', 'ユーティリティ', '計算', 'エンターテイメント'];
        const icons = ['🔧', '🎮', '📊', '🧮', '🎬', '📝', '🎨', '📱', '💼', '🌟'];
        
        for (let i = 5; i <= 50; i++) {
            const category = categories[i % categories.length];
            const icon = icons[i % icons.length];
            
            this.registerApp({
                id: `demo_${i}`,
                name: `${category}アプリ${i}`,
                icon: icon,
                category: category.toLowerCase(),
                content: this.getDemoAppContent(i, category, icon),
                enabled: false // デフォルトで無効
            });
        }
    }

    // アプリ登録
    registerApp(appConfig) {
        const defaultConfig = {
            enabled: true,
            loadOnDemand: true
        };
        this.apps.set(appConfig.id, { ...defaultConfig, ...appConfig });
    }

    // 設定の読み込み
    loadSettings() {
        try {
            const saved = localStorage.getItem('multiAppSettings');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.warn('設定の読み込みに失敗:', e);
            return {};
        }
    }

    // 設定の保存
    saveSettings() {
        try {
            localStorage.setItem('multiAppSettings', JSON.stringify(this.settings));
        } catch (e) {
            console.warn('設定の保存に失敗:', e);
        }
    }

    // タブの描画
    renderTabs() {
        const tabList = document.getElementById('tabList');
        tabList.innerHTML = '';

        for (const [id, app] of this.apps) {
            const isEnabled = this.settings[id] !== false && app.enabled !== false;
            
            if (isEnabled) {
                const button = document.createElement('button');
                button.className = 'tab-button';
                button.innerHTML = `
                    <span>
                        <span class="icon">${app.icon}</span>
                        ${app.name}
                    </span>
                `;
                button.onclick = () => this.showApp(id);
                tabList.appendChild(button);
            }
        }
    }

    // 設定パネルの描画
    renderSettings() {
        const container = document.getElementById('appCheckboxes');
        container.innerHTML = '';

        for (const [id, app] of this.apps) {
            if (app.category !== 'system') {
                const div = document.createElement('div');
                div.className = 'app-checkbox';
                
                const isChecked = this.settings[id] !== false && app.enabled !== false;
                
                div.innerHTML = `
                    <input type="checkbox" id="check_${id}" ${isChecked ? 'checked' : ''} 
                           onchange="appManager.toggleApp('${id}', this.checked)">
                    <label for="check_${id}">${app.icon} ${app.name}</label>
                `;
                container.appendChild(div);
            }
        }
    }

    // アプリの有効/無効切り替え
    toggleApp(id, enabled) {
        this.settings[id] = enabled;
        this.saveSettings();
        this.renderTabs();
        
        if (!enabled && this.activeApp === id) {
            this.showApp('welcome');
        }
    }

    // アプリの表示
    async showApp(id) {
        const app = this.apps.get(id);
        if (!app) return;

        // URLが設定されている場合は直接移動
        if (app.url) {
            window.location.href = app.url;
            return;
        }

        this.activeApp = id;
        this.updateActiveTab(id);
        
        const contentArea = document.getElementById('contentArea');
        
        // ローディング表示
        contentArea.innerHTML = '<div class="loading">アプリを読み込み中</div>';
        
        // 遅延読み込みのシミュレーション
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // コンテンツの表示
        contentArea.innerHTML = app.content;
        
        // 時間管理タブの場合、記録を再読み込み
        if (id === 'tab1') {
            setTimeout(() => {
                if (typeof initializeTimeRecords === 'function') {
                    console.log('🔄 時間管理タブ表示 - 記録を再読み込み');
                    initializeTimeRecords();
                }
            }, 300);
        }
        
        this.updateStatus(`${app.name} を表示中`);
    }

    // アクティブタブの更新
    updateActiveTab(activeId) {
        const buttons = document.querySelectorAll('.tab-button');
        buttons.forEach((button, index) => {
            const apps = Array.from(this.apps.values()).filter(app => 
                (this.settings[app.id] !== false && app.enabled !== false) ||
                (app.category === 'system')
            );
            
            if (apps[index] && apps[index].id === activeId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // ステータス更新
    updateStatus(message) {
        document.getElementById('statusBar').textContent = message;
    }

    // ウェルカムコンテンツ
    getWelcomeContent() {
        return `
            <div class="welcome">
                <h1>🎉 拡張マルチアプリ管理ツール</h1>
                <p>左側のタブから利用したいアプリを選択してください。</p>
                <p>⚙️ <strong>設定ボタン</strong>でアプリの表示/非表示を切り替えできます。</p>
                <p>📱 <strong>モバイル対応</strong>: スマートフォン・タブレットでも快適に使用可能</p>
                <p>⚡ <strong>高性能設計</strong>: 必要時のみアプリを読み込み、メモリ効率を最適化</p>
                <p>🔧 <strong>カスタマイズ可能</strong>: 最大100個のアプリまで対応</p>
                <p>💾 <strong>設定保存</strong>: ブラウザにアプリ設定を自動保存</p>
                <br>
                <p>現在利用可能なアプリ: <strong>${this.apps.size}個</strong></p>
                <p>表示中のアプリ: <strong>${Array.from(this.apps.values()).filter(app => 
                    (this.settings[app.id] !== false && app.enabled !== false) ||
                    app.category === 'system'
                ).length}個</strong></p>
            </div>
        `;
    }

    // デモアプリコンテンツ
    getDemoAppContent(num, category, icon) {
        return `
            <div class="welcome">
                <h1>${icon} ${category}アプリ${num}</h1>
                <p>これは<strong>${category}</strong>カテゴリのデモアプリです。</p>
                <p>アプリID: demo_${num}</p>
                <p>カテゴリ: ${category}</p>
                <p>このエリアに実際のアプリ機能を実装できます。</p>
                <br>
                <div style="background: #f0f8ff; padding: 20px; border-radius: 10px; border: 2px dashed #667eea;">
                    <h3>💡 カスタマイズヒント</h3>
                    <p>• HTMLを直接編集してアプリ機能を追加</p>
                    <p>• JavaScript関数でインタラクティブ機能を実装</p>
                    <p>• CSSでスタイリングをカスタマイズ</p>
                    <p>• LocalStorageでデータを永続化</p>
                </div>
            </div>
        `;
    }

    // 計算タブコンテンツ（内部タブ付き - 左メニュー残存版）
    getCalculatorTabsContent() {
        return calculatorTabsHTML; // calculator.jsから読み込み
    }

    // 時間管理タブコンテンツ（内部タブ付き）
    getTimeManagementTabsContent() {
        return timeManagementTabsHTML; // time-management.jsから読み込み
    }

    // 汎用タブコンテンツ（外部設定用）
    getTabContent(tabId, tabName, description) {
        return getTabContentHTML(tabId, tabName, description); // todo.jsから読み込み
    }

    // Todoリストメニューコンテンツ
    getTodoListContent() {
        return `
            <div class="todo-container">
                <div class="todo-header">
                    <h1>📝 Todo</h1>
                    <p>全タブTodo一覧管理</p>
                </div>
                
                <div>
                    <label for="todo-all" style="display: block; margin-bottom: 8px; font-weight: bold; color: #2d3748;">
                        📝 全Todoリスト
                    </label>
                    <textarea 
                        id="todo-all" 
                        class="todo-textarea"
                        readonly
                        placeholder="各タブのTodoがここに表示されます..."
                        style="height: 400px;"
                    ></textarea>
                    
                    <div class="todo-controls">
                        <button class="todo-btn" onclick="updateAllTodoList()">
                            🔄 更新
                        </button>
                    </div>
                </div>
                
                <div class="feature-info">
                    <strong>💡 使い方:</strong><br>
                    • 各タブのTodo内容を一覧表示<br>
                    • 更新ボタンで最新状態に更新<br>
                    • 個別編集は各タブで行ってください
                </div>
            </div>
            
            <script>
                // 全Todo更新
                function updateAllTodoList() {
                    const tabs = [
                        {id: 'tab1', name: '⏰ 時間管理'},
                        {id: 'tab2', name: '🏃‍♀️ 体型管理'},
                        {id: 'tab3', name: '💼 仕事管理'},
                        {id: 'tab4', name: '👩 女性管理'},
                        {id: 'tab6', name: '🧹 部屋片付け'},
                        {id: 'tab7', name: '7️⃣ タブ7'},
                        {id: 'tab8', name: '8️⃣ タブ8'},
                        {id: 'tab9', name: '9️⃣ タブ9'}
                    ];
                    
                    let allContent = '';
                    tabs.forEach(tab => {
                        const content = localStorage.getItem('todo-' + tab.id) || '';
                        allContent += '【' + tab.name + '】\\n';
                        if (content.trim()) {
                            allContent += content + '\\n\\n';
                        } else {
                            allContent += '(Todoなし)\\n\\n';
                        }
                    });
                    
                    const textarea = document.getElementById('todo-all');
                    if (textarea) {
                        textarea.value = allContent;
                    }
                }
                
                // 初期読み込み
                setTimeout(updateAllTodoList, 200);
            </script>
        `;
    }

    // 設定リセット
    resetSettings() {
        if (confirm('すべての設定をリセットしますか？')) {
            this.settings = {};
            this.saveSettings();
            this.renderTabs();
            this.renderSettings();
            this.showApp('welcome');
            this.updateStatus('設定をリセットしました');
        }
    }
}

// グローバル変数とユーティリティ関数
let appManager;

// Firebase初期化とアプリ初期化
let firebaseAuthCore, firebaseDataCore;

// 初期化
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Firebase初期化
        await initializeFirebase();
        
        // アプリマネージャー初期化
        appManager = new AppManager();
        
        console.log('✅ Multi-App Manager v0.43 初期化完了');
    } catch (error) {
        console.error('❌ 初期化エラー:', error);
        document.getElementById('statusBar').textContent = '初期化エラーが発生しました';
    }
});

// Firebase初期化関数
async function initializeFirebase() {
    try {
        // プロトコルチェック
        if (location.protocol === 'file:') {
            console.warn('⚠️ Firebase認証にはHTTPサーバーが必要です');
            document.getElementById('statusBar').textContent = '⚠️ サーバー起動が必要 - start-server.batを実行してください';
            updateConnectionStatus(false);
            return;
        }
        
        // Firebase Auth Core 初期化
        firebaseAuthCore = new FirebaseAuthCore();
        await firebaseAuthCore.init(firebaseConfig);
        
        // Firebase Data Core 初期化
        firebaseDataCore = new FirebaseDataCore();
        firebaseDataCore.init(firebaseConfig, 'multi-app-data');
        
        // 認証状態変更のリスナー
        firebaseAuthCore.onAuthStateChange((user) => {
            updateAuthUI(user);
            firebaseDataCore.setupUserData(user);
        });
        
        // 接続状態変更のリスナー
        firebaseDataCore.onConnectionChange((connected) => {
            console.log('🔄 データベース接続状態変更:', connected);
            updateConnectionStatus(connected);
        });
        
        // データエラーのリスナー
        firebaseDataCore.onError((error) => {
            console.error('🚨 Firebase Data Error:', error);
            document.getElementById('statusBar').textContent = `❌ DB接続エラー: ${error.message}`;
        });
        
        console.log('🔥 Firebase 初期化完了');
    } catch (error) {
        console.error('❌ Firebase 初期化失敗:', error);
        // Firebaseが使えない場合はローカルモードで続行
        updateConnectionStatus(false);
        
        if (error.message.includes('location.protocol')) {
            document.getElementById('statusBar').textContent = '🔧 HTTPサーバーが必要 - start-server.batを実行してください';
        }
    }
}

// 認証UI更新
function updateAuthUI(user) {
    const loginButton = document.getElementById('loginButton');
    const userInfo = document.getElementById('userInfo');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    
    if (user) {
        loginButton.style.display = 'none';
        userInfo.style.display = 'flex';
        userAvatar.src = user.photoURL || '';
        userName.textContent = user.displayName || user.email || 'ユーザー';
        
        // ログイン成功メッセージ
        document.getElementById('statusBar').textContent = `✅ ${user.displayName || user.email}でログイン中`;
    } else {
        loginButton.style.display = 'block';
        userInfo.style.display = 'none';
        
        // ログイン必要メッセージ
        document.getElementById('statusBar').textContent = '🔑 Googleログインが必要です';
    }
}

// 接続状態更新
function updateConnectionStatus(connected) {
    const statusElement = document.getElementById('connectionStatus');
    if (connected) {
        statusElement.textContent = '🟢 データベース接続';
        statusElement.style.color = '#38a169';
        console.log('✅ Firebase Database 接続成功');
    } else {
        statusElement.textContent = '🔴 データベース未接続';
        statusElement.style.color = '#e53e3e';
        console.warn('⚠️ Firebase Database 接続失敗');
        
        // データベース接続を再試行
        setTimeout(() => {
            if (firebaseDataCore && firebaseAuthCore && firebaseAuthCore.user) {
                console.log('🔄 データベース接続を再試行...');
                firebaseDataCore.setupUserData(firebaseAuthCore.user);
            }
        }, 2000);
    }
}

// Google認証
async function signInWithGoogle() {
    try {
        await firebaseAuthCore.signInWithGoogle();
    } catch (error) {
        console.error('ログインエラー:', error);
        alert('ログインに失敗しました: ' + error.message);
    }
}

// サインアウト
async function signOut() {
    try {
        await firebaseAuthCore.signOut();
    } catch (error) {
        console.error('ログアウトエラー:', error);
    }
}

// 設定パネルの切り替え
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.classList.toggle('active');
}

// 設定リセット
function resetSettings() {
    appManager.resetSettings();
}

// キーボードショートカット
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && !e.shiftKey && !e.altKey) {
        // 計算グループの内部タブ切り替え（Ctrl+1-4）
        if (document.querySelector('.calc-tab-button')) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    showCalcTab('add');
                    break;
                case '2':
                    e.preventDefault();
                    showCalcTab('subtract');
                    break;
                case '3':
                    e.preventDefault();
                    showCalcTab('multiply');
                    break;
                case '4':
                    e.preventDefault();
                    showCalcTab('divide');
                    break;
            }
        } else {
            // 通常のアプリ切り替え（Ctrl+1-9）
            const key = parseInt(e.key);
            if (key >= 1 && key <= 9) {
                e.preventDefault();
                const apps = Array.from(appManager.apps.values()).filter(app => 
                    (appManager.settings[app.id] !== false && app.enabled !== false) ||
                    app.category === 'system'
                );
                if (apps[key - 1]) {
                    appManager.showApp(apps[key - 1].id);
                }
            }
        }
    }
});

// Enter キーで計算実行
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && appManager.activeApp) {
        const activeApp = appManager.activeApp;
        if (['addition', 'subtraction', 'multiplication', 'division'].includes(activeApp)) {
            const operation = activeApp === 'addition' ? 'add' :
                            activeApp === 'subtraction' ? 'sub' :
                            activeApp === 'multiplication' ? 'mul' : 'div';
            calculate(operation);
        }
    }
});

// サービスワーカー登録（PWA対応の準備）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // 今後PWA対応時に実装
    });
}