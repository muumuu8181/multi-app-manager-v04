# Firebase設定ガイド

## 🔴 オフライン表示の原因と解決方法

現在「🔴 オフライン」と表示される原因は、**Firebase Realtimeデータベースのルール**にあります。

## 🛠️ 修正手順

### 1. Firebase Consoleにアクセス
```
https://console.firebase.google.com/
```

### 2. プロジェクト「shares-b1b97」を選択

### 3. Realtime Databaseの設定

1. 左メニューから「Realtime Database」をクリック
2. 「ルール」タブをクリック
3. 現在のルールを以下に置き換え：

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        ".validate": "auth != null"
      }
    },
    ".read": false,
    ".write": false
  }
}
```

### 4. 「公開」ボタンをクリック

## ✅ 確認方法

ルール更新後、アプリをリロードして：
- ログイン状態を確認
- 接続状態が「🟢 データベース接続」になることを確認

## 🔧 代替設定（テスト用）

もし上記で解決しない場合、一時的にテスト用ルールを使用：

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

**注意**: この設定は本番では使用せず、テスト確認後は安全なルールに戻してください。

## 📋 現在の設定

- **プロジェクトID**: shares-b1b97
- **データベースURL**: https://shares-b1b97-default-rtdb.firebaseio.com
- **認証方法**: Google認証
- **データパス**: users/{userId}/multi-app-data