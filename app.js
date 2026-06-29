// 初期データ（元画像の数値をベースに設定）
const weatherData = {
    matsuyama:   { high: 29, low: 18 },
    niihama:     { high: 28, low: 16 },
    ishizuchi:   { high: 28, low: 16 },
    yawatahama:  { high: 26, low: 19 },
    uwajima:     { high: 29, low: 20 }
};

// 画面表示を更新するメイン処理
function updateWeatherDisplay() {
    Object.keys(weatherData).forEach(area => {
        const panel = document.getElementById(`panel-${area}`);
        if (panel) {
            panel.querySelector('.temp-high .val').innerText = weatherData[area].high;
            panel.querySelector('.temp-low .val').innerText = weatherData[area].low;
        }
    });
}

// リアルタイムのデータ更新シミュレーション
// (API連携時はここをfetchリクエストに置き換えます)
function fetchLatestWeatherData() {
    console.log("--- リアルタイムデータ同期実行中 ---");
    
    Object.keys(weatherData).forEach(area => {
        // 10%の確率で気温が1度上下するリアルタイム感を演出
        if (Math.random() > 0.8) {
            const isUp = Math.random() > 0.5;
            weatherData[area].high += isUp ? 1 : -1;
            console.log(`[更新] ${area} の最高気温が変動しました: ${weatherData[area].high}℃`);
        }
    });

    updateWeatherDisplay();
}

// 画面ロード時の初期化処理
function init() {
    // タイトルの日付を現在の日に自動設定
    const today = new Date();
    const dateElement = document.getElementById('today-date');
    if (dateElement) {
        dateElement.innerText = `${today.getDate()}日`;
    }

    // 初回レンダリング
    updateWeatherDisplay();

    // 3秒ごとに最新データをチェックしてリアルタイム更新
    setInterval(fetchLatestWeatherData, 3000);
}

// 起動
window.onload = init;
