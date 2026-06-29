// 1. データ定義（愛媛県・全国）
const weatherDataList = {
    ehime: [
        { name: "新居浜", low: 20, high: 27, timeline: ["☔", "☔", "☔", "☔", "☔", "☁️", "🌤️", "🌙", "🌙"] },
        { name: "今治",   low: 21, high: 28, timeline: ["☔", "☁️", "☔", "☔", "☁️", "🌤️", "🌙", "🌙", "🌙"] },
        { name: "松山",   low: 22, high: 28, timeline: ["☁️", "☁️", "☔", "☔", "☁️", "🌤️", "🌙", "🌙", "🌙"] },
        { name: "石鎚山", low: 12, high: 18, timeline: ["☔", "☔", "☃️", "☃️", "☔", "☁️", "☁️", "🌙", "🌙"] }, // 石鎚山追加
        { name: "大洲",   low: 22, high: 28, timeline: ["☔", "☔", "☔", "☔", "☔", "☔", "🌙", "🌙", "🌙"] },
        { name: "宇和",   low: 21, high: 27, timeline: ["☔", "☔", "☔", "☔", "☔", "☔", "🌙", "🌙", "🌙"] },
        { name: "宇和島", low: 22, high: 28, timeline: ["☔", "☔", "☔", "☔", "☔", "☔", "🌙", "🌙", "🌙"] }
    ],
    japan: [
        { name: "札幌",   low: 15, high: 22, timeline: ["☀️", "☀️", "☀️", "☁️", "☁️", "☔", "☔", "☁️", "🌙"] },
        { name: "仙台",   low: 18, high: 25, timeline: ["☁️", "☁️", "☀️", "☀️", "☀️", "☀️", "🌤️", "🌙", "🌙"] },
        { name: "東京",   low: 23, high: 31, timeline: ["☀️", "☀️", "☀️", "☀️", "☁️", "☔", "☔", "☁️", "🌙"] },
        { name: "名古屋", low: 22, high: 29, timeline: ["☔", "☔", "☁️", "☀️", "☀️", "☀️", "☀️", "🌙", "🌙"] },
        { name: "大阪",   low: 24, high: 32, timeline: ["☁️", "☀️", "☀️", "☀️", "☀️", "☔", "☔", "🌙", "🌙"] },
        { name: "広島",   low: 21, high: 28, timeline: ["☔", "☔", "☔", "☁️", "☀️", "☀️", "☀️", "🌙", "🌙"] },
        { name: "福岡",   low: 22, high: 27, timeline: ["☔", "☔", "☔", "☔", "☁️", "☀️", "☀️", "🌙", "🌙"] }
    ]
};

let currentMode = 'ehime'; // 初期値は愛媛県

// 2. 画面を描画するメイン関数
function renderTimeline() {
    const container = document.getElementById('timeline-rows');
    container.innerHTML = ''; // 一度リセット

    const list = weatherDataList[currentMode];

    list.forEach(city => {
        // 行全体の枠
        const row = document.createElement('div');
        row.className = 'row';

        // タイムライン（アイコン）の生成
        let timelineHTML = '';
        city.timeline.forEach(icon => {
            timelineHTML += `<div class="hourly-icon">${icon}</div>`;
        });

        // HTML構造の組み立て
        row.innerHTML = `
            <div class="city-name">${city.name}</div>
            <div class="temp-zone">
                <div class="temp-low">${city.low}</div>
                <div class="temp-high">${city.high}</div>
            </div>
            <div class="weather-forecast-bar">
                ${timelineHTML}
            </div>
        `;
        container.appendChild(row);
    });
}

// 3. 表示切り替え（タブクリック用）
function switchView(mode) {
    currentMode = mode;
    
    // タブボタンの「アクティブ状態」の見た目を切り替え
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    renderTimeline();
}

// 4. リアルタイムデータ更新シミュレーション（5秒ごとにランダムでどこかの天気が変わる）
function simulateRealTimeUpdate() {
    const modes = ['ehime', 'japan'];
    modes.forEach(mode => {
        weatherDataList[mode].forEach(city => {
            if (Math.random() > 0.7) { // 30%の確率でデータ変更
                // 気温を微変動
                city.high += Math.random() > 0.5 ? 1 : -1;
                // ランダムな時間の天気を入れ替え
                const icons = ["☀️", "☁️", "☔", "🌙", "🌤️"];
                const randomIndex = Math.floor(Math.random() * city.timeline.length);
                city.timeline[randomIndex] = icons[Math.floor(Math.random() * icons.length)];
            }
        });
    });
    renderTimeline();
    console.log("リアルタイムに情報を更新しました:", new Date().toLocaleTimeString());
}

// 初期起動
window.onload = () => {
    // 日付をセット
    document.getElementById('current-date').innerText = new Date().getDate();
    renderTimeline();
    setInterval(simulateRealTimeUpdate, 5000); // 5秒ごとにバックグラウンド更新
};
