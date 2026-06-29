// 模擬データ（初期値）
const weatherData = {
    matsuyama: { high: 29, low: 18 },
    niihama:   { high: 28, low: 16 },
    uwajima:   { high: 29, low: 20 }
};

// 画面の表示を更新する関数
function updateDOM() {
    Object.keys(weatherData).forEach(area => {
        const panel = document.getElementById(`panel-${area}`);
        if (panel) {
            panel.querySelector('.temp-high .val').innerText = weatherData[area].high;
            panel.querySelector('.temp-low .val').innerText = weatherData[area].low;
        }
    });
    console.log("データを更新しました:", new Date().toLocaleTimeString());
}

// リアルタイム更新のシミュレーション（数秒ごとにランダムで気温を変化させる）
function simulateRealTimeUpdate() {
    Object.keys(weatherData).forEach(area => {
        // 最高気温を -1 〜 +1 の範囲でランダムに変動させる
        const change = Math.floor(Math.random() * 3) - 1; 
        weatherData[area].high += change;
        
        // あまりに変な気温にならないように制限（25℃〜35℃）
        weatherData[area].high = Math.max(25, Math.min(35, weatherData[area].high));
    });

    updateDOM();
}

// 初回実行
updateDOM();

// 5秒ごとにデータを更新（実際の本番環境ではここを 600000ms（10分）などにしてAPIを叩く）
setInterval(simulateRealTimeUpdate, 5000);
