/* Multi-App Manager v0.44 - Smart Template Bridge */

// Smart Template v2.0との統合ブリッジ
class SmartTemplateBridge {
    constructor() {
        this.config = null;
        this.moduleLoader = null;
        this.loadedModules = new Map();
        this.isInitialized = false;
    }

    // 設定読み込み
    async loadConfig() {
        try {
            const response = await fetch('config.json');
            this.config = await response.json();
            console.log('🎯 Smart Template Config loaded:', this.config);
            return this.config;
        } catch (error) {
            console.error('❌ Config load failed:', error);
            // フォールバック設定
            this.config = {
                version: "0.44",
                appName: "Multi-App Manager v0.44",
                enabledApps: ["time", "memo", "calc"],
                features: {
                    moduleLoader: true,
                    debugMode: true
                }
            };
            return this.config;
        }
    }

    // モジュール動的読み込み
    async loadModule(moduleName) {
        if (this.loadedModules.has(moduleName)) {
            return this.loadedModules.get(moduleName);
        }

        try {
            // アプリモジュールを動的読み込み
            const script = document.createElement('script');
            script.src = `apps/${moduleName}.js`;
            
            return new Promise((resolve, reject) => {
                script.onload = () => {
                    console.log(`✅ Module loaded: ${moduleName}`);
                    
                    // グローバルからモジュールを取得
                    const moduleObj = window[`${moduleName}App`] || window[moduleName];
                    if (moduleObj) {
                        this.loadedModules.set(moduleName, moduleObj);
                        resolve(moduleObj);
                    } else {
                        reject(`Module ${moduleName} not found in global scope`);
                    }
                };
                
                script.onerror = () => {
                    reject(`Failed to load module: ${moduleName}`);
                };
                
                document.head.appendChild(script);
            });
        } catch (error) {
            console.error(`❌ Module load failed: ${moduleName}`, error);
            throw error;
        }
    }

    // 有効なアプリを取得
    getEnabledApps() {
        if (!this.config) return [];
        return this.config.enabledApps || [];
    }

    // アプリ設定を取得
    getAppConfig(appName) {
        if (!this.config || !this.config.apps) return null;
        return this.config.apps[appName];
    }

    // Smart Template機能を現在のアプリに統合
    async integrateWithCurrentApp() {
        try {
            await this.loadConfig();
            
            // 有効なアプリをタブに追加
            const enabledApps = this.getEnabledApps();
            console.log('🎯 Enabled apps:', enabledApps);
            
            // 既存のアプリマネージャーに統合
            if (window.appManager) {
                for (const appName of enabledApps) {
                    await this.integrateApp(appName);
                }
            }
            
            this.isInitialized = true;
            console.log('✅ Smart Template Bridge initialized');
        } catch (error) {
            console.error('❌ Smart Template integration failed:', error);
        }
    }

    // 個別アプリの統合
    async integrateApp(appName) {
        try {
            const appConfig = this.getAppConfig(appName);
            if (!appConfig) {
                console.warn(`⚠️ App config not found: ${appName}`);
                return;
            }

            // モジュール読み込み
            const module = await this.loadModule(appName);
            
            // 既存のアプリマネージャーに登録
            if (window.appManager && module) {
                const appData = {
                    id: `smart-${appName}`,
                    name: `${appConfig.icon} ${appConfig.name}`,
                    icon: appConfig.icon,
                    category: 'smart-template',
                    content: this.generateAppContent(appName, appConfig, module)
                };
                
                window.appManager.registerApp(appData);
                console.log(`✅ App integrated: ${appName}`);
            }
        } catch (error) {
            console.error(`❌ App integration failed: ${appName}`, error);
        }
    }

    // アプリコンテンツ生成
    generateAppContent(appName, appConfig, module) {
        return `
            <div class="smart-template-app" data-app="${appName}">
                <div class="smart-header">
                    <h1>${appConfig.icon} ${appConfig.name}</h1>
                    <p>${appConfig.description}</p>
                    <div class="smart-badge">Smart Template v2.0</div>
                </div>
                
                <div class="smart-content" id="smart-${appName}-content">
                    <div class="loading">スマートモジュール読み込み中...</div>
                </div>
                
                <script>
                    // アプリ初期化
                    setTimeout(() => {
                        const contentDiv = document.getElementById('smart-${appName}-content');
                        if (contentDiv && window.smartTemplateBridge) {
                            window.smartTemplateBridge.initializeAppUI('${appName}', contentDiv);
                        }
                    }, 100);
                </script>
            </div>
            
            <style>
                .smart-template-app {
                    padding: 20px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                
                .smart-header {
                    text-align: center;
                    margin-bottom: 30px;
                    position: relative;
                }
                
                .smart-header h1 {
                    color: #2d3748;
                    margin-bottom: 10px;
                    font-size: 2em;
                }
                
                .smart-badge {
                    position: absolute;
                    top: 0;
                    right: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: bold;
                }
                
                .smart-content {
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    min-height: 200px;
                }
                
                .loading {
                    text-align: center;
                    color: #718096;
                    padding: 40px;
                }
            </style>
        `;
    }

    // アプリUI初期化
    async initializeAppUI(appName, contentDiv) {
        try {
            const module = this.loadedModules.get(appName);
            if (!module) {
                contentDiv.innerHTML = '<div class="error">モジュールが見つかりません</div>';
                return;
            }

            // モジュールが初期化関数を持っている場合
            if (typeof module.initialize === 'function') {
                await module.initialize(contentDiv);
            } else if (typeof module.render === 'function') {
                await module.render(contentDiv);
            } else {
                // デフォルトUI
                contentDiv.innerHTML = `
                    <div class="default-ui">
                        <h3>🚀 ${appName} アプリ</h3>
                        <p>Smart Template v2.0 モジュールが正常に読み込まれました。</p>
                        <button onclick="alert('${appName} アプリが動作中！')">テスト実行</button>
                    </div>
                `;
            }
        } catch (error) {
            console.error(`❌ App UI initialization failed: ${appName}`, error);
            contentDiv.innerHTML = `<div class="error">初期化エラー: ${error.message}</div>`;
        }
    }
}

// グローバルインスタンス作成
window.smartTemplateBridge = new SmartTemplateBridge();

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.smartTemplateBridge.integrateWithCurrentApp();
    }, 1000); // アプリマネージャー初期化を待つ
});