/* Multi-App Manager v0.42 - Todo Functions */

// 汎用タブコンテンツ（外部設定用）
function getTabContentHTML(tabId, tabName, description) {
    return `
        <div class="todo-container">
            <div class="todo-header">
                <h1>${tabName}</h1>
                <p>${description}</p>
            </div>
            
            <div>
                <label for="todo-${tabId}" style="display: block; margin-bottom: 8px; font-weight: bold; color: #2d3748;">
                    📝 ${tabName} Todo リスト
                </label>
                <textarea 
                    id="todo-${tabId}" 
                    class="todo-textarea"
                    placeholder="ここに${tabName}に関するタスクやメモを入力してください...

例：
□ 今日やること
□ 明日の予定
□ アイデア
□ 進捗メモ

✓ 完了したタスク

このエリアはブラウザに自動保存されます。"
                    oninput="saveTodoContent('${tabId}', this.value)"
                ></textarea>
                
                <div class="todo-controls">
                    <button class="todo-btn" onclick="clearTodoContent('${tabId}')">
                        🗑️ クリア
                    </button>
                    <button class="todo-btn secondary" onclick="exportTodoContent('${tabId}', '${tabName}')">
                        📋 コピー
                    </button>
                    <button class="todo-btn secondary" onclick="addTimestamp('${tabId}')">
                        📅 日時追加
                    </button>
                </div>
            </div>
            
            <div class="feature-info">
                <strong>💡 使い方のヒント:</strong><br>
                • テキストは自動保存されます（ブラウザローカルストレージ）<br>
                • □ を使ってチェックリスト形式で管理<br>
                • ✓ で完了マーク<br>
                • 日時追加ボタンで現在時刻を挿入可能
            </div>
        </div>
        
        <script>
            // ページ読み込み時にTodoコンテンツを復元
            document.addEventListener('DOMContentLoaded', function() {
                loadTodoContent('${tabId}');
            });
            
            // 初期化（このタブが表示された時に実行）
            setTimeout(() => loadTodoContent('${tabId}'), 100);
        </script>
    `;
}

// Todo内容の保存
function saveTodoContent(tabId, content) {
    try {
        localStorage.setItem('todo-' + tabId, content);
    } catch (e) {
        console.warn('Todo保存に失敗:', e);
    }
}

// Todo内容の読み込み
function loadTodoContent(tabId) {
    try {
        const content = localStorage.getItem('todo-' + tabId);
        if (content) {
            const textarea = document.getElementById('todo-' + tabId);
            if (textarea) {
                textarea.value = content;
            }
        }
    } catch (e) {
        console.warn('Todo読み込みに失敗:', e);
    }
}

// Todo内容のクリア
function clearTodoContent(tabId) {
    // タブ名を取得（呼び出し元から推定）
    const tabElement = document.querySelector(`h1`);
    const tabName = tabElement ? tabElement.textContent : 'このタブ';
    
    if (confirm(`${tabName}のTodoリストをクリアしますか？`)) {
        const textarea = document.getElementById('todo-' + tabId);
        if (textarea) {
            textarea.value = '';
            saveTodoContent(tabId, '');
        }
    }
}

// Todo内容のコピー
function exportTodoContent(tabId, tabName) {
    const textarea = document.getElementById('todo-' + tabId);
    if (textarea && textarea.value.trim()) {
        const content = '=== ' + tabName + ' Todo リスト ===\\n\\n' + textarea.value;
        navigator.clipboard.writeText(content).then(() => {
            alert('📋 クリップボードにコピーしました！');
        }).catch(() => {
            // フォールバック: テキストエリアを選択
            textarea.select();
            alert('📋 テキストを選択しました。Ctrl+Cでコピーしてください。');
        });
    } else {
        alert('コピーする内容がありません。');
    }
}

// 現在時刻の追加
function addTimestamp(tabId) {
    const textarea = document.getElementById('todo-' + tabId);
    if (textarea) {
        const now = new Date();
        const timestamp = now.getFullYear() + '/' + 
            String(now.getMonth() + 1).padStart(2, '0') + '/' + 
            String(now.getDate()).padStart(2, '0') + ' ' + 
            String(now.getHours()).padStart(2, '0') + ':' + 
            String(now.getMinutes()).padStart(2, '0');
        
        const cursorPos = textarea.selectionStart;
        const textBefore = textarea.value.substring(0, cursorPos);
        const textAfter = textarea.value.substring(cursorPos);
        const newText = textBefore + '\\n📅 ' + timestamp + ' - \\n' + textAfter;
        
        textarea.value = newText;
        textarea.focus();
        textarea.setSelectionRange(cursorPos + timestamp.length + 7, cursorPos + timestamp.length + 7);
        
        saveTodoContent(tabId, newText);
    }
}