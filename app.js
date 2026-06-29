// 1. データ定義（愛媛県・全国）
const weatherDataList = {
    ehime: {
        title: "愛媛県",
        rows: [
            { name: "新居浜", low: 20, high: 27, timeline: ["☔", "☔", "☔", "☔", "☔", "☁️", "🌤️", "🌙", "🌙"] },
            { name: "今治",   low: 21, high: 28, timeline: ["☔", "☁️", "☔", "☔", "☁️", "🌤️", "🌙", "🌙", "🌙"] },
            { name: "松山",   low: 22, high: 28, timeline: ["☁️", "☁️", "☔", "☔", "☁️", "🌤️", "🌙", "🌙", "🌙"] },
            { name: "石鎚山", low: 12, high: 18, timeline: ["☔", "☔", "☃️", "☃️", "☔", "☁️", "☁️", "🌙", "🌙"] },
            { name: "大洲",   low: 22, high: 28, timeline: ["☔", "☔", "☔", "☔", "☔", "☔", "🌙", "🌙", "🌙"] },
            { name: "宇和",   low: 21, high: 27, timeline: ["☔", "☔", "☔", "☔", "☔", "☔", "🌙", "🌙", "🌙"] },
            { name: "宇和島", low: 22, high: 28, timeline: ["☔", "☔", "☔", "☔", "☔", "☔", "🌙", "🌙", "🌙"] }
        ]
    },
    japan: {
        title: "全国の天気",
        rows: [
            { name: "札幌",   low: 15, high: 22, timeline: ["☀️", "☀️", "☀️", "☁️", "☁️", "☔", "☔", "☁️", "🌙"] },
            { name: "仙台",   low: 18, high: 25, timeline: ["☁️", "☁️", "☀️", "☀️", "☀️", "☀️", "🌤️", "🌙", "🌙"] },
            { name: "東京",   low: 23, high: 31, timeline: ["☀️", "☀️", "☀️", "☀️", "☁️", "☔", "☔", "☁️", "🌙"] },
            { name: "名古屋", low: 22, high: 29, timeline: ["☔", "☔", "☁️", "☀️", "☀️", "☀️", "☀️", "🌙", "🌙"] },
            { name: "大阪",   low: 24, high: 32, timeline: ["☁️", "☀️", "☀️", "☀️", "☀️", "☔", "☔", "🌙", "🌙"] },
            { name: "広島",   low: 21, high: 28, timeline: ["☔", "☔", "☔", "☁️", "☀️", "☀️", "☀️", "🌙", "🌙"] },
            { name: "福岡",   low: 22, high: 27, timeline: ["☔", "☔", "☔", "☔", "☁️", "☀️", "☀️", "🌙", "🌙"] }
        ]
    }
};

// 2. URLの末尾（#ehimeなど）をチェックして、どちらを表示するか判定する関数
function getModeFromURL() {
    const hash = window.location.hash.replace('#', ''); // '#'を消す
    if (weatherDataList[hash]) {
        return hash;
    }
    return 'ehime'; // どちらでもない、または何もついていない場合は自動で愛媛にする
}

// 3. 画面を描画する関数
function renderTimeline() {
    const mode = getModeFromURL();
    const data = weatherDataList[mode];

    // タイトルを書き換え
    document.getElementById('view-title').innerText = data.title;

    // 行を生成
    const container = document.getElementById('timeline-rows');
    container.innerHTML = '';

    data.rows.forEach(city => {
        const row = document.createElement('div');
        row.className = 'row';

        let timelineHTML = '';
        city.timeline.forEach(icon => {
            timelineHTML += `<div class="hourly-icon">${icon}</div>`;
        });

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

// 4. リアルタイムデータ更新
function simulateRealTimeUpdate() {
    Object.keys(weatherDataList).forEach(mode => {
        weatherDataList[mode].rows.forEach(city => {
            if (Math.random() > 0.8) {
                city.high += Math.random() > 0.5 ? 1 : -1;
            }
        });
    });
    renderTimeline();
}

// 5. 初期起動と、URLが変わった瞬間のイベント監視
window.onload = () => {
    renderTimeline();
    setInterval(simulateRealTimeUpdate, 5000);
};

// ユーザーがURLを直接書き換える、または別のリンクを踏んでURLが変わったときに自動リロード
window.onhashchange = renderTimeline;
