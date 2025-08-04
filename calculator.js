/* Multi-App Manager v0.42 - Calculator Functions */

// 計算タブコンテンツ（HTML）
const calculatorTabsHTML = `
    <div class="calc-container">
        <div class="calc-header">
            <h1>🧮 計算グループ</h1>
            <p>計算方法を選択してください</p>
        </div>
        
        <!-- 内部タブナビゲーション（可変グリッド - 最大5列×2行対応） -->
        <div class="calc-tab-nav">
            <button class="calc-tab-button active" onclick="showCalcTab('add')">
                ➕ 足し算
            </button>
            <button class="calc-tab-button" onclick="showCalcTab('subtract')">
                ➖ 引き算
            </button>
            <button class="calc-tab-button" onclick="showCalcTab('multiply')">
                ✖️ 掛け算
            </button>
            <button class="calc-tab-button" onclick="showCalcTab('divide')">
                ➗ 割り算
            </button>
            <button class="calc-tab-button" onclick="showCalcTab('power')">
                📈 累乗
            </button>
            <button class="calc-tab-button" onclick="showCalcTab('sqrt')">
                √ 平方根
            </button>
            <button class="calc-tab-button" onclick="showCalcTab('percent')">
                ％ パーセント
            </button>
            <button class="calc-tab-button" onclick="showCalcTab('factorial')">
                ! 階乗
            </button>
            <button class="calc-tab-button" onclick="showCalcTab('modulo')">
                ＠ 余り
            </button>
            <button class="calc-tab-button" onclick="showCalcTab('round')">
                🔄 四捨五入
            </button>
        </div>
        
        <!-- 足し算タブ -->
        <div id="add-calc-content" class="calc-tab-content active">
            <div class="calc-calculator">
                <h2>➕ 足し算計算機</h2>
                <div class="calc-input-group">
                    <label>数値1:</label>
                    <input type="number" id="calc-add1" placeholder="最初の数値を入力" autofocus>
                </div>
                <div class="calc-input-group">
                    <label>数値2:</label>
                    <input type="number" id="calc-add2" placeholder="2番目の数値を入力">
                </div>
                <button class="calc-button" onclick="calculateCalc('add')">計算する</button>
                <div class="calc-result" id="calc-add-result">結果がここに表示されます</div>
            </div>
        </div>
        
        <!-- 引き算タブ -->
        <div id="subtract-calc-content" class="calc-tab-content">
            <div class="calc-calculator">
                <h2>➖ 引き算計算機</h2>
                <div class="calc-input-group">
                    <label>数値1（被減数）:</label>
                    <input type="number" id="calc-subtract1" placeholder="引かれる数を入力">
                </div>
                <div class="calc-input-group">
                    <label>数値2（減数）:</label>
                    <input type="number" id="calc-subtract2" placeholder="引く数を入力">
                </div>
                <button class="calc-button" onclick="calculateCalc('subtract')">計算する</button>
                <div class="calc-result" id="calc-subtract-result">結果がここに表示されます</div>
            </div>
        </div>
        
        <!-- 掛け算タブ -->
        <div id="multiply-calc-content" class="calc-tab-content">
            <div class="calc-calculator">
                <h2>✖️ 掛け算計算機</h2>
                <div class="calc-input-group">
                    <label>数値1（被乗数）:</label>
                    <input type="number" id="calc-multiply1" placeholder="掛けられる数を入力">
                </div>
                <div class="calc-input-group">
                    <label>数値2（乗数）:</label>
                    <input type="number" id="calc-multiply2" placeholder="掛ける数を入力">
                </div>
                <button class="calc-button" onclick="calculateCalc('multiply')">計算する</button>
                <div class="calc-result" id="calc-multiply-result">結果がここに表示されます</div>
            </div>
        </div>
        
        <!-- 割り算タブ -->
        <div id="divide-calc-content" class="calc-tab-content">
            <div class="calc-calculator">
                <h2>➗ 割り算計算機</h2>
                <div class="calc-input-group">
                    <label>数値1（被除数）:</label>
                    <input type="number" id="calc-divide1" placeholder="割られる数を入力">
                </div>
                <div class="calc-input-group">
                    <label>数値2（除数）:</label>
                    <input type="number" id="calc-divide2" placeholder="割る数を入力（0以外）">
                </div>
                <button class="calc-button" onclick="calculateCalc('divide')">計算する</button>
                <div class="calc-result" id="calc-divide-result">結果がここに表示されます</div>
            </div>
        </div>
        
        <!-- 累乗タブ -->
        <div id="power-calc-content" class="calc-tab-content">
            <div class="calc-calculator">
                <h2>📈 累乗計算機</h2>
                <div class="calc-input-group">
                    <label>底（数値）:</label>
                    <input type="number" id="calc-power1" placeholder="底となる数値を入力">
                </div>
                <div class="calc-input-group">
                    <label>指数（べき数）:</label>
                    <input type="number" id="calc-power2" placeholder="指数を入力">
                </div>
                <button class="calc-button" onclick="calculateCalc('power')">計算する</button>
                <div class="calc-result" id="calc-power-result">結果がここに表示されます</div>
            </div>
        </div>
        
        <!-- 平方根タブ -->
        <div id="sqrt-calc-content" class="calc-tab-content">
            <div class="calc-calculator">
                <h2>√ 平方根計算機</h2>
                <div class="calc-input-group">
                    <label>数値:</label>
                    <input type="number" id="calc-sqrt1" placeholder="平方根を求める数値を入力">
                </div>
                <button class="calc-button" onclick="calculateCalc('sqrt')">計算する</button>
                <div class="calc-result" id="calc-sqrt-result">結果がここに表示されます</div>
            </div>
        </div>
        
        <!-- パーセントタブ -->
        <div id="percent-calc-content" class="calc-tab-content">
            <div class="calc-calculator">
                <h2>％ パーセント計算機</h2>
                <div class="calc-input-group">
                    <label>全体の値:</label>
                    <input type="number" id="calc-percent1" placeholder="全体の値を入力">
                </div>
                <div class="calc-input-group">
                    <label>部分の値:</label>
                    <input type="number" id="calc-percent2" placeholder="部分の値を入力">
                </div>
                <button class="calc-button" onclick="calculateCalc('percent')">パーセント計算</button>
                <div class="calc-result" id="calc-percent-result">結果がここに表示されます</div>
            </div>
        </div>
        
        <!-- 階乗タブ -->
        <div id="factorial-calc-content" class="calc-tab-content">
            <div class="calc-calculator">
                <h2>! 階乗計算機</h2>
                <div class="calc-input-group">
                    <label>数値（整数）:</label>
                    <input type="number" id="calc-factorial1" placeholder="階乗を求める整数を入力" min="0" max="20">
                </div>
                <button class="calc-button" onclick="calculateCalc('factorial')">階乗計算</button>
                <div class="calc-result" id="calc-factorial-result">結果がここに表示されます</div>
            </div>
        </div>
        
        <!-- 余りタブ -->
        <div id="modulo-calc-content" class="calc-tab-content">
            <div class="calc-calculator">
                <h2>＠ 余り計算機</h2>
                <div class="calc-input-group">
                    <label>割られる数:</label>
                    <input type="number" id="calc-modulo1" placeholder="割られる数を入力">
                </div>
                <div class="calc-input-group">
                    <label>割る数:</label>
                    <input type="number" id="calc-modulo2" placeholder="割る数を入力">
                </div>
                <button class="calc-button" onclick="calculateCalc('modulo')">余り計算</button>
                <div class="calc-result" id="calc-modulo-result">結果がここに表示されます</div>
            </div>
        </div>
        
        <!-- 四捨五入タブ -->
        <div id="round-calc-content" class="calc-tab-content">
            <div class="calc-calculator">
                <h2>🔄 四捨五入計算機</h2>
                <div class="calc-input-group">
                    <label>数値:</label>
                    <input type="number" id="calc-round1" placeholder="四捨五入する数値を入力" step="any">
                </div>
                <div class="calc-input-group">
                    <label>小数点以下桁数:</label>
                    <input type="number" id="calc-round2" placeholder="桁数を入力（0=整数）" min="0" max="10" value="0">
                </div>
                <button class="calc-button" onclick="calculateCalc('round')">四捨五入</button>
                <div class="calc-result" id="calc-round-result">結果がここに表示されます</div>
            </div>
        </div>
    </div>
`;

// 内部タブ切り替え機能（計算グループ用）
function showCalcTab(tabName) {
    // 全ての計算タブコンテンツを非表示
    document.querySelectorAll('.calc-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 全ての計算タブボタンからactiveクラスを削除
    document.querySelectorAll('.calc-tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // 選択された計算タブを表示
    const targetContent = document.getElementById(tabName + '-calc-content');
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // 選択された計算タブボタンにactiveクラスを追加
    event.target.classList.add('active');
    
    // フォーカスを最初の入力フィールドに移動
    setTimeout(() => {
        const firstInput = document.querySelector('#calc-' + tabName + '1');
        if (firstInput) firstInput.focus();
    }, 100);
}

// 内部タブ用計算機能
function calculateCalc(operation) {
    const num1 = parseFloat(document.getElementById('calc-' + operation + '1').value);
    const num2Element = document.getElementById('calc-' + operation + '2');
    const num2 = num2Element ? parseFloat(num2Element.value) : null;
    
    let result;
    let displayText;
    
    switch(operation) {
        case 'add':
            if (isNaN(num1) || isNaN(num2)) {
                document.getElementById('calc-' + operation + '-result').textContent = '有効な数値を入力してください';
                return;
            }
            result = num1 + num2;
            displayText = `${num1} + ${num2} = ${result}`;
            break;
            
        case 'subtract':
            if (isNaN(num1) || isNaN(num2)) {
                document.getElementById('calc-' + operation + '-result').textContent = '有効な数値を入力してください';
                return;
            }
            result = num1 - num2;
            displayText = `${num1} - ${num2} = ${result}`;
            break;
            
        case 'multiply':
            if (isNaN(num1) || isNaN(num2)) {
                document.getElementById('calc-' + operation + '-result').textContent = '有効な数値を入力してください';
                return;
            }
            result = num1 * num2;
            displayText = `${num1} × ${num2} = ${result}`;
            break;
            
        case 'divide':
            if (isNaN(num1) || isNaN(num2)) {
                document.getElementById('calc-' + operation + '-result').textContent = '有効な数値を入力してください';
                return;
            }
            if (num2 === 0) {
                document.getElementById('calc-' + operation + '-result').textContent = '0で割ることはできません';
                return;
            }
            result = num1 / num2;
            result = Math.round(result * 1000000) / 1000000;
            displayText = `${num1} ÷ ${num2} = ${result}`;
            break;
            
        case 'power':
            if (isNaN(num1) || isNaN(num2)) {
                document.getElementById('calc-' + operation + '-result').textContent = '有効な数値を入力してください';
                return;
            }
            result = Math.pow(num1, num2);
            displayText = `${num1}^${num2} = ${result}`;
            break;
            
        case 'sqrt':
            if (isNaN(num1)) {
                document.getElementById('calc-' + operation + '-result').textContent = '有効な数値を入力してください';
                return;
            }
            if (num1 < 0) {
                document.getElementById('calc-' + operation + '-result').textContent = '負の数の平方根は計算できません';
                return;
            }
            result = Math.sqrt(num1);
            result = Math.round(result * 1000000) / 1000000;
            displayText = `√${num1} = ${result}`;
            break;
            
        case 'percent':
            if (isNaN(num1) || isNaN(num2)) {
                document.getElementById('calc-' + operation + '-result').textContent = '有効な数値を入力してください';
                return;
            }
            if (num1 === 0) {
                document.getElementById('calc-' + operation + '-result').textContent = '全体の値が0では計算できません';
                return;
            }
            result = (num2 / num1) * 100;
            result = Math.round(result * 100) / 100;
            displayText = `${num2}は${num1}の${result}%`;
            break;
            
        case 'factorial':
            if (isNaN(num1) || num1 < 0 || num1 !== Math.floor(num1)) {
                document.getElementById('calc-' + operation + '-result').textContent = '0以上の整数を入力してください';
                return;
            }
            if (num1 > 20) {
                document.getElementById('calc-' + operation + '-result').textContent = '20以下の数値を入力してください';
                return;
            }
            result = 1;
            for (let i = 2; i <= num1; i++) {
                result *= i;
            }
            displayText = `${num1}! = ${result}`;
            break;
            
        case 'modulo':
            if (isNaN(num1) || isNaN(num2)) {
                document.getElementById('calc-' + operation + '-result').textContent = '有効な数値を入力してください';
                return;
            }
            if (num2 === 0) {
                document.getElementById('calc-' + operation + '-result').textContent = '0で割ることはできません';
                return;
            }
            result = num1 % num2;
            displayText = `${num1} mod ${num2} = ${result}`;
            break;
            
        case 'round':
            if (isNaN(num1) || isNaN(num2)) {
                document.getElementById('calc-' + operation + '-result').textContent = '有効な数値を入力してください';
                return;
            }
            const decimals = Math.max(0, Math.min(10, Math.floor(num2)));
            result = Math.round(num1 * Math.pow(10, decimals)) / Math.pow(10, decimals);
            displayText = `${num1}を小数点以下${decimals}桁で四捨五入: ${result}`;
            break;
            
        default:
            return;
    }
    
    document.getElementById('calc-' + operation + '-result').textContent = displayText;
}

// 既存の計算機能（従来のアプリ用）
function calculate(operation) {
    const num1 = parseFloat(document.getElementById(operation + '1').value);
    const num2 = parseFloat(document.getElementById(operation + '2').value);
    
    if (isNaN(num1) || isNaN(num2)) {
        document.getElementById(operation + '-result').textContent = '有効な数値を入力してください';
        return;
    }
    
    let result;
    let symbol;
    
    switch(operation) {
        case 'add':
            result = num1 + num2;
            symbol = '+';
            break;
        case 'sub':
            result = num1 - num2;
            symbol = '-';
            break;
        case 'mul':
            result = num1 * num2;
            symbol = '×';
            break;
        case 'div':
            if (num2 === 0) {
                document.getElementById(operation + '-result').textContent = '0で割ることはできません';
                return;
            }
            result = num1 / num2;
            symbol = '÷';
            break;
        default:
            return;
    }
    
    document.getElementById(operation + '-result').textContent = 
        `${num1} ${symbol} ${num2} = ${result}`;
}