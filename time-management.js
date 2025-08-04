/* Multi-App Manager v0.42 - Time Management Functions */

// 時間管理タブコンテンツ（HTML）
const timeManagementTabsHTML = `
    <div class="time-container">
        <div class="time-header">
            <h1>⏰ 時間管理</h1>
            <p>時間管理機能を選択してください</p>
        </div>
        
        <!-- 内部タブナビゲーション -->
        <div class="time-tab-nav">
            <button class="time-tab-button active" onclick="showTimeTab('record')">
                📝 記録
            </button>
            <button class="time-tab-button" onclick="showTimeTab('analysis')">
                📊 分析
            </button>
            <button class="time-tab-button" onclick="showTimeTab('planning')">
                📅 計画
            </button>
            <button class="time-tab-button" onclick="showTimeTab('habits')">
                🎯 習慣
            </button>
        </div>
        
        <!-- 記録タブ -->
        <div id="record-time-content" class="time-tab-content active">
            <div class="time-section">
                <h2>⚡ リアルタイム時間記録</h2>
                
                <!-- 現在の活動表示 -->
                <div id="current-activity" class="current-activity">
                    <div class="activity-status">現在: 活動選択してください</div>
                    <div class="activity-timer">00:00:00</div>
                </div>
                
                <!-- 活動選択ボタン群 -->
                <div class="activity-buttons">
                    <button class="activity-btn" data-activity="work" onclick="startActivity('work', '💼 仕事')">
                        💼 仕事
                    </button>
                    <button class="activity-btn" data-activity="study" onclick="startActivity('study', '📚 勉強')">
                        📚 勉強
                    </button>
                    <button class="activity-btn" data-activity="exercise" onclick="startActivity('exercise', '🏃 運動')">
                        🏃 運動
                    </button>
                    <button class="activity-btn" data-activity="rest" onclick="startActivity('rest', '☕ 休憩')">
                        ☕ 休憩
                    </button>
                    <button class="activity-btn" data-activity="meeting" onclick="startActivity('meeting', '👥 会議')">
                        👥 会議
                    </button>
                    <button class="activity-btn" data-activity="personal" onclick="startActivity('personal', '🏠 個人')">
                        🏠 個人
                    </button>
                </div>
                
                <!-- 制御ボタン -->
                <div class="control-buttons">
                    <button id="stop-btn" class="control-btn stop" onclick="stopActivity()" disabled>
                        ⏹️ 停止して記録
                    </button>
                    <button id="pause-btn" class="control-btn pause" onclick="pauseActivity()" disabled>
                        ⏸️ 一時停止
                    </button>
                </div>
                
                <!-- 今日の記録 -->
                <div id="today-records" class="today-records">
                    <h3>📋 今日の記録</h3>
                    <div id="records-list" class="records-list">
                        今日の記録はありません
                    </div>
                </div>
                
                <div class="time-result" id="record-result"></div>
            </div>
        </div>
        
        <!-- 分析タブ -->
        <div id="analysis-time-content" class="time-tab-content">
            <div class="time-section">
                <h2>📊 時間分析</h2>
                <div class="time-input-group">
                    <label>分析期間:</label>
                    <select id="analysis-period">
                        <option value="today">今日</option>
                        <option value="week">今週</option>
                        <option value="month">今月</option>
                    </select>
                </div>
                <button class="time-button" onclick="analyzeTime()">分析開始</button>
                <div class="time-result" id="analysis-result"></div>
            </div>
        </div>
        
        <!-- 計画タブ -->
        <div id="planning-time-content" class="time-tab-content">
            <div class="time-section">
                <h2>📅 時間計画</h2>
                <div class="time-input-group">
                    <label>計画名:</label>
                    <input type="text" id="plan-name" placeholder="計画名を入力">
                </div>
                <div class="time-input-group">
                    <label>予定時間（分）:</label>
                    <input type="number" id="planned-duration" placeholder="予定時間を入力" min="1">
                </div>
                <button class="time-button" onclick="createPlan()">計画作成</button>
                <div class="time-result" id="plan-result"></div>
            </div>
        </div>
        
        <!-- 習慣タブ -->
        <div id="habits-time-content" class="time-tab-content">
            <div class="time-section">
                <h2>🎯 習慣管理</h2>
                <div class="time-input-group">
                    <label>習慣名:</label>
                    <input type="text" id="habit-name" placeholder="習慣名を入力">
                </div>
                <div class="time-input-group">
                    <label>目標頻度:</label>
                    <select id="habit-frequency">
                        <option value="daily">毎日</option>
                        <option value="weekly">週1回</option>
                        <option value="monthly">月1回</option>
                    </select>
                </div>
                <button class="time-button" onclick="addHabit()">習慣追加</button>
                <div class="time-result" id="habit-result"></div>
            </div>
        </div>
    </div>
    
    <style>
        .time-container {
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .time-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .time-header h1 {
            color: #2d3748;
            margin-bottom: 10px;
        }
        
        .time-tab-nav {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 30px;
        }
        
        .time-tab-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 16px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9em;
        }
        
        .time-tab-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .time-tab-button.active {
            background: linear-gradient(135deg, #4299e1 0%, #667eea 100%);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .time-tab-content {
            display: none;
        }
        
        .time-tab-content.active {
            display: block;
        }
        
        .time-section {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .time-input-group {
            margin-bottom: 20px;
        }
        
        .time-input-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #2d3748;
        }
        
        .time-input-group input,
        .time-input-group select {
            width: 100%;
            padding: 12px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s ease;
        }
        
        .time-input-group input:focus,
        .time-input-group select:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .time-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
            margin-top: 10px;
        }
        
        .time-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .time-result {
            margin-top: 20px;
            padding: 15px;
            background: #f7fafc;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            min-height: 20px;
        }
        
        /* リアルタイム記録のスタイル */
        .current-activity {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 20px;
        }
        
        .activity-status {
            font-size: 1.1em;
            margin-bottom: 10px;
        }
        
        .activity-timer {
            font-size: 2.5em;
            font-weight: bold;
            font-family: 'Courier New', monospace;
        }
        
        .activity-buttons {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .activity-btn {
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            padding: 15px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1em;
        }
        
        .activity-btn:hover {
            background: #e9ecef;
            transform: translateY(-2px);
        }
        
        .activity-btn.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-color: #667eea;
        }
        
        .control-buttons {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            justify-content: center;
        }
        
        .control-btn {
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1em;
            transition: all 0.3s ease;
        }
        
        .control-btn.stop {
            background: #dc3545;
            color: white;
        }
        
        .control-btn.pause {
            background: #ffc107;
            color: #212529;
        }
        
        .control-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .today-records {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
        }
        
        .records-list {
            max-height: 200px;
            overflow-y: auto;
        }
        
        .record-item {
            background: white;
            padding: 10px;
            margin: 5px 0;
            border-radius: 6px;
            border-left: 4px solid #667eea;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .total-time {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .record-item-compact {
            background: white;
            padding: 8px 12px;
            margin: 3px 0;
            border-radius: 6px;
            border-left: 3px solid #667eea;
            font-size: 0.9em;
            line-height: 1.2;
        }
        
        /* モバイル対応 */
        @media (max-width: 768px) {
            .time-tab-nav {
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
            }
            
            .time-tab-button {
                font-size: 0.8em;
                padding: 10px 12px;
            }
        }
    </style>
`;

// 内部タブ切り替え機能（時間管理用）
function showTimeTab(tabName) {
    // 全ての時間管理タブコンテンツを非表示
    document.querySelectorAll('.time-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 全ての時間管理タブボタンからactiveクラスを削除
    document.querySelectorAll('.time-tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // 選択された時間管理タブを表示
    const targetContent = document.getElementById(tabName + '-time-content');
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // 選択された時間管理タブボタンにactiveクラスを追加
    event.target.classList.add('active');
    
    // 現在時刻を自動設定（記録タブの場合）
    if (tabName === 'record') {
        setTimeout(() => {
            const now = new Date();
            const formattedTime = now.toISOString().slice(0, 16);
            const startTimeInput = document.getElementById('start-time');
            if (startTimeInput && !startTimeInput.value) {
                startTimeInput.value = formattedTime;
            }
        }, 100);
    }
}

// 活動記録機能
function recordActivity() {
    const activityName = document.getElementById('activity-name').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const category = document.getElementById('activity-category').value;
    const resultDiv = document.getElementById('record-result');
    
    if (!activityName || !startTime || !endTime) {
        resultDiv.innerHTML = '<span style="color: #e53e3e;">すべての項目を入力してください</span>';
        return;
    }
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (end <= start) {
        resultDiv.innerHTML = '<span style="color: #e53e3e;">終了時間は開始時間より後に設定してください</span>';
        return;
    }
    
    const duration = Math.round((end - start) / (1000 * 60)); // 分単位
    
    // ローカルストレージに保存（後でFirebaseに置き換え）
    const record = {
        id: Date.now(),
        activity: activityName,
        start: startTime,
        end: endTime,
        category: category,
        duration: duration,
        created: new Date().toISOString()
    };
    
    const records = JSON.parse(localStorage.getItem('timeRecords') || '[]');
    records.push(record);
    localStorage.setItem('timeRecords', JSON.stringify(records));
    
    resultDiv.innerHTML = `
        <div style="color: #38a169;">
            ✅ 記録完了！<br>
            活動: ${activityName}<br>
            時間: ${duration}分<br>
            カテゴリ: ${getCategoryName(category)}
        </div>
    `;
    
    // フォームリセット
    document.getElementById('activity-name').value = '';
    document.getElementById('start-time').value = '';
    document.getElementById('end-time').value = '';
}

// 時間分析機能
function analyzeTime() {
    const period = document.getElementById('analysis-period').value;
    const resultDiv = document.getElementById('analysis-result');
    const records = JSON.parse(localStorage.getItem('timeRecords') || '[]');
    
    if (records.length === 0) {
        resultDiv.innerHTML = '<span style="color: #718096;">記録がありません</span>';
        return;
    }
    
    // 期間フィルタリング（簡易版）
    const now = new Date();
    const filteredRecords = records.filter(record => {
        const recordDate = new Date(record.created);
        switch(period) {
            case 'today':
                return recordDate.toDateString() === now.toDateString();
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return recordDate >= weekAgo;
            case 'month':
                const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                return recordDate >= monthAgo;
            default:
                return true;
        }
    });
    
    if (filteredRecords.length === 0) {
        resultDiv.innerHTML = '<span style="color: #718096;">この期間の記録がありません</span>';
        return;
    }
    
    // カテゴリ別集計
    const categoryTotals = {};
    let totalTime = 0;
    
    filteredRecords.forEach(record => {
        categoryTotals[record.category] = (categoryTotals[record.category] || 0) + record.duration;
        totalTime += record.duration;
    });
    
    let analysisHTML = `<div style="color: #2d3748;"><strong>📊 分析結果 (${getPeriodName(period)})</strong><br><br>`;
    analysisHTML += `総時間: ${Math.floor(totalTime / 60)}時間${totalTime % 60}分<br><br>`;
    
    Object.entries(categoryTotals).forEach(([category, minutes]) => {
        const percentage = ((minutes / totalTime) * 100).toFixed(1);
        analysisHTML += `${getCategoryName(category)}: ${Math.floor(minutes / 60)}時間${minutes % 60}分 (${percentage}%)<br>`;
    });
    
    analysisHTML += '</div>';
    resultDiv.innerHTML = analysisHTML;
}

// 計画作成機能
function createPlan() {
    const planName = document.getElementById('plan-name').value;
    const duration = document.getElementById('planned-duration').value;
    const resultDiv = document.getElementById('plan-result');
    
    if (!planName || !duration) {
        resultDiv.innerHTML = '<span style="color: #e53e3e;">計画名と予定時間を入力してください</span>';
        return;
    }
    
    const plan = {
        id: Date.now(),
        name: planName,
        duration: parseInt(duration),
        created: new Date().toISOString()
    };
    
    const plans = JSON.parse(localStorage.getItem('timePlans') || '[]');
    plans.push(plan);
    localStorage.setItem('timePlans', JSON.stringify(plans));
    
    resultDiv.innerHTML = `
        <div style="color: #38a169;">
            ✅ 計画作成完了！<br>
            計画: ${planName}<br>
            予定時間: ${Math.floor(duration / 60)}時間${duration % 60}分
        </div>
    `;
    
    // フォームリセット
    document.getElementById('plan-name').value = '';
    document.getElementById('planned-duration').value = '';
}

// 習慣追加機能
function addHabit() {
    const habitName = document.getElementById('habit-name').value;
    const frequency = document.getElementById('habit-frequency').value;
    const resultDiv = document.getElementById('habit-result');
    
    if (!habitName) {
        resultDiv.innerHTML = '<span style="color: #e53e3e;">習慣名を入力してください</span>';
        return;
    }
    
    const habit = {
        id: Date.now(),
        name: habitName,
        frequency: frequency,
        created: new Date().toISOString(),
        completed: []
    };
    
    const habits = JSON.parse(localStorage.getItem('timeHabits') || '[]');
    habits.push(habit);
    localStorage.setItem('timeHabits', JSON.stringify(habits));
    
    resultDiv.innerHTML = `
        <div style="color: #38a169;">
            ✅ 習慣追加完了！<br>
            習慣: ${habitName}<br>
            頻度: ${getFrequencyName(frequency)}
        </div>
    `;
    
    // フォームリセット
    document.getElementById('habit-name').value = '';
}

// ヘルパー関数
function getCategoryName(category) {
    const categories = {
        'work': '仕事',
        'study': '勉強',
        'exercise': '運動',
        'rest': '休憩',
        'personal': '個人'
    };
    return categories[category] || category;
}

function getPeriodName(period) {
    const periods = {
        'today': '今日',
        'week': '今週',
        'month': '今月'
    };
    return periods[period] || period;
}

function getFrequencyName(frequency) {
    const frequencies = {
        'daily': '毎日',
        'weekly': '週1回',
        'monthly': '月1回'
    };
    return frequencies[frequency] || frequency;
}

// ============================================
// リアルタイム時間記録機能
// ============================================

let currentActivity = null;
let startTime = null;
let pausedTime = 0;
let timerInterval = null;
let todayRecords = [];

// 活動開始
function startActivity(activityType, activityName) {
    // 既存の活動があれば停止
    if (currentActivity) {
        stopActivity();
    }
    
    // 新しい活動開始
    currentActivity = {
        type: activityType,
        name: activityName,
        startTime: new Date()
    };
    
    startTime = new Date();
    pausedTime = 0;
    
    // UI更新
    updateActivityUI();
    startTimer();
    
    // ボタン状態更新
    document.querySelectorAll('.activity-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-activity="${activityType}"]`).classList.add('active');
    
    document.getElementById('stop-btn').disabled = false;
    document.getElementById('pause-btn').disabled = false;
    
    console.log('✅ 活動開始:', activityName);
}

// 活動停止して記録
function stopActivity() {
    if (!currentActivity) return;
    
    const endTime = new Date();
    const duration = Math.floor((endTime - startTime - pausedTime) / 1000);
    
    // 記録保存
    const record = {
        id: Date.now(),
        activity: currentActivity.name,
        type: currentActivity.type,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: duration,
        date: new Date().toDateString()
    };
    
    // ローカルストレージに保存
    const records = JSON.parse(localStorage.getItem('timeRecords') || '[]');
    records.push(record);
    localStorage.setItem('timeRecords', JSON.stringify(records));
    
    // Firebaseにも保存（ログイン時）
    if (window.firebaseDataCore && firebase.auth().currentUser) {
        window.firebaseDataCore.addData(record).catch(console.error);
    }
    
    // UI更新
    stopTimer();
    resetActivityUI();
    loadTodayRecords();
    
    // 結果表示
    document.getElementById('record-result').innerHTML = `
        <div style="color: #38a169;">
            ✅ 記録完了！<br>
            活動: ${currentActivity.name}<br>
            時間: ${formatDuration(duration)}
        </div>
    `;
    
    console.log('✅ 活動記録:', record);
}

// 活動一時停止
function pauseActivity() {
    if (!timerInterval) return;
    
    pausedTime += new Date() - startTime;
    stopTimer();
    
    document.getElementById('pause-btn').textContent = '▶️ 再開';
    document.getElementById('pause-btn').onclick = resumeActivity;
}

// 活動再開
function resumeActivity() {
    startTime = new Date();
    startTimer();
    
    document.getElementById('pause-btn').textContent = '⏸️ 一時停止';
    document.getElementById('pause-btn').onclick = pauseActivity;
}

// タイマー開始
function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

// タイマー停止
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// タイマー表示更新
function updateTimer() {
    if (!startTime) return;
    
    const elapsed = Math.floor((new Date() - startTime + pausedTime) / 1000);
    document.querySelector('.activity-timer').textContent = formatDuration(elapsed);
}

// 活動UI更新
function updateActivityUI() {
    if (currentActivity) {
        document.querySelector('.activity-status').textContent = `現在: ${currentActivity.name}`;
    }
}

// 活動UIリセット
function resetActivityUI() {
    currentActivity = null;
    startTime = null;
    pausedTime = 0;
    
    document.querySelector('.activity-status').textContent = '現在: 活動選択してください';
    document.querySelector('.activity-timer').textContent = '00:00:00';
    
    document.querySelectorAll('.activity-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById('stop-btn').disabled = true;
    document.getElementById('pause-btn').disabled = true;
    document.getElementById('pause-btn').textContent = '⏸️ 一時停止';
    document.getElementById('pause-btn').onclick = pauseActivity;
}

// 時間フォーマット
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 今日の記録読み込み（Firebase + ローカル統合版）
async function loadTodayRecords() {
    const recordsList = document.getElementById('records-list');
    if (!recordsList) {
        console.warn('records-list要素が見つかりません');
        return;
    }
    
    // ローディング表示
    recordsList.innerHTML = '<div style="text-align: center; padding: 20px;">📡 記録を読み込み中...</div>';
    
    try {
        // 1. ローカルストレージから読み込み
        const localRecords = JSON.parse(localStorage.getItem('timeRecords') || '[]');
        
        // 2. Firebaseから読み込み（ログイン時のみ）
        let firebaseRecords = [];
        if (window.firebaseDataCore && firebase.auth().currentUser) {
            console.log('🔥 Firebaseから記録を取得中...');
            firebaseRecords = await loadFirebaseRecords();
        }
        
        // 3. データを統合（重複除去）
        const allRecords = mergeRecords(localRecords, firebaseRecords);
        
        // 4. 今日の記録のみフィルタ
        const today = new Date().toDateString();
        const todayRecords = allRecords.filter(record => record.date === today);
        
        // 5. 統合データをローカルストレージに保存（同期効果）
        localStorage.setItem('timeRecords', JSON.stringify(allRecords));
        
        // 6. 表示
        displayRecords(todayRecords);
        
        console.log(`✅ 記録読み込み完了: ローカル${localRecords.length}件 + Firebase${firebaseRecords.length}件 = 統合${allRecords.length}件 (今日${todayRecords.length}件)`);
        
    } catch (error) {
        console.error('❌ 記録読み込みエラー:', error);
        // エラー時はローカルのみ表示
        const localRecords = JSON.parse(localStorage.getItem('timeRecords') || '[]');
        const today = new Date().toDateString();
        const todayRecords = localRecords.filter(record => record.date === today);
        displayRecords(todayRecords);
    }
}

// Firebaseから記録を読み込む
async function loadFirebaseRecords() {
    return new Promise((resolve, reject) => {
        if (!window.firebaseDataCore || !firebase.auth().currentUser) {
            resolve([]);
            return;
        }
        
        const user = firebase.auth().currentUser;
        const recordsRef = firebase.database().ref(`users/${user.uid}/multi-app-data`);
        
        recordsRef.once('value', (snapshot) => {
            try {
                const data = snapshot.val();
                if (!data) {
                    resolve([]);
                    return;
                }
                
                // Firebase データを配列形式に変換
                const records = [];
                Object.keys(data).forEach(key => {
                    if (data[key] && data[key].activity) {
                        // 時間記録データの場合
                        records.push({
                            id: key,
                            ...data[key],
                            source: 'firebase'
                        });
                    }
                });
                
                console.log(`🔥 Firebase記録取得: ${records.length}件`);
                resolve(records);
                
            } catch (error) {
                console.error('Firebase データ解析エラー:', error);
                resolve([]);
            }
        }, (error) => {
            console.error('Firebase 読み込みエラー:', error);
            resolve([]);
        });
    });
}

// ローカルとFirebaseのデータを統合（重複除去）
function mergeRecords(localRecords, firebaseRecords) {
    const merged = [...localRecords];
    const existingIds = new Set(localRecords.map(r => r.id));
    
    // Firebaseの記録で重複しないものを追加
    firebaseRecords.forEach(record => {
        if (!existingIds.has(record.id)) {
            merged.push(record);
        }
    });
    
    // 時間順でソート（新しい順）
    merged.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    
    return merged;
}

// 記録を表示
function displayRecords(todayRecords) {
    const recordsList = document.getElementById('records-list');
    
    if (todayRecords.length === 0) {
        recordsList.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">今日の記録はありません</div>';
        return;
    }
    
    let html = '';
    let totalDuration = 0;
    
    todayRecords.forEach(record => {
        totalDuration += record.duration || 0;
        const startTime = new Date(record.startTime).toLocaleTimeString('ja-JP', {hour: '2-digit', minute: '2-digit'});
        const endTime = new Date(record.endTime).toLocaleTimeString('ja-JP', {hour: '2-digit', minute: '2-digit'});
        
        // データソース表示（デバッグ用）
        const sourceIcon = record.source === 'firebase' ? '☁️' : '💾';
        
        html += `
            <div class="record-item-compact" title="${record.source || 'local'} - ${record.id}">
                ${record.activity} ${startTime}-${endTime} (${formatDuration(record.duration)}) ${sourceIcon}
            </div>
        `;
    });
    
    // 合計時間を追加
    html = `
        <div class="total-time">
            📊 今日の合計: ${formatDuration(totalDuration)} (${todayRecords.length}件)
        </div>
        ${html}
        <div style="font-size: 10px; color: #888; text-align: center; margin-top: 10px;">
            💾ローカル ☁️Firebase
        </div>
    `;
    
    recordsList.innerHTML = html;
}

// タブ表示時の初期化イベント（グローバル）
function initializeTimeRecords() {
    console.log('🔄 時間記録初期化開始');
    
    // 少し遅延させてDOM要素が確実に存在する状態にする
    setTimeout(() => {
        const recordsList = document.getElementById('records-list');
        if (recordsList) {
            loadTodayRecords();
            console.log('✅ 時間記録初期化完了');
        } else {
            console.warn('⚠️ records-list要素が見つかりません - 再試行します');
            // 再試行
            setTimeout(() => {
                if (document.getElementById('records-list')) {
                    loadTodayRecords();
                }
            }, 500);
        }
    }, 200);
}

// 時間管理タブが表示された時に呼び出される関数
function onTimeTabShow() {
    console.log('📅 時間管理タブ表示');
    initializeTimeRecords();
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeTimeRecords, 1000);
});

// MutationObserverで動的なDOM変更を監視
const timeRecordsObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            const recordsList = document.getElementById('records-list');
            if (recordsList && recordsList.innerHTML === '今日の記録はありません') {
                // 記録が初期状態の場合、再読み込み
                setTimeout(loadTodayRecords, 100);
            }
        }
    });
});

// ページ全体の変更を監視開始
setTimeout(() => {
    timeRecordsObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}, 2000);