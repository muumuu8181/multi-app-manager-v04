const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3003;

// CORS設定
app.use(cors());

// 静的ファイル配信
app.use(express.static(__dirname));

// JSONパース
app.use(express.json());

// ルートアクセス
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`🚀 Multi-App Manager v0.46 Server`);
    console.log(`📡 http://localhost:${PORT}`);
    console.log(`🔑 Firebase認証対応サーバー起動完了`);
});