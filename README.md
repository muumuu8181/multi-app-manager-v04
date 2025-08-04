# Multi-App Manager v0.46

Firebase認証対応の統合アプリ管理システム

## 🚀 サーバー起動方法

Firebase認証を使用するには、HTTPサーバーが必要です。

### Windows
```bash
# 方法1: バッチファイル実行（推奨）
start-server.bat

# 方法2: 手動実行
npm install
npm start
```

### アクセス方法
サーバー起動後、ブラウザで以下にアクセス：
```
http://localhost:3003
```

## ✅ 機能確認

1. **Firebase認証**: 🔑 Googleログインボタンをクリック
2. **Smart Template**: 左サイドバーから各アプリにアクセス
3. **時間管理**: 内部タブで記録・分析・計画・習慣管理

## 📁 構成

- `index.html` - メインUI
- `app.js` - アプリケーション管理
- `smart-template-bridge.js` - Smart Template統合
- `firebase-auth-template/` - Firebase認証システム
- `apps/` - Smart Template v2.0 アプリ群
- `config.json` - 設定ファイル

## 🔧 エラー対処

### ログインエラー
- `start-server.bat`でサーバー起動
- `http://localhost:3003`でアクセス
- file://では認証不可

### モジュールエラー
```bash
npm install
```

## 📋 バージョン履歴

- v0.46: HTTPサーバー対応、Firebase認証修正
- v0.45: ログインUI改善
- v0.44: Smart Template v2.0統合
- v0.43: Firebase統合完了