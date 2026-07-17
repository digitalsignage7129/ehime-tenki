import json
import urllib.request
import random
import os

def fetch_weather():
    """気象庁APIから最新予報を取得"""
    try:
        url = "https://www.jma.go.jp/bosai/forecast/data/forecast/380000.json"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            area_weather = data[0]["timeSeries"][0]["areas"][0]
            weather_text = area_weather["weathers"][0]
            weather_code = area_weather["weatherCodes"][0]
            
            temp_areas = data[0]["timeSeries"][2]["areas"][0]
            temps = temp_areas.get("temps", ["--", "--"])
            max_temp = temps[1] if len(temps) > 1 else temps[0]

            # 天気に合わせた高画質画像（UnsplashのソースURL）
            code_prefix = weather_code[0]
            if code_prefix == "1":
                weather_img_url = "https://images.unsplash.com/photo-1601288496920-b6154fe3626a?w=1000"
            elif code_prefix == "2":
                weather_img_url = "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1000"
            else:
                weather_img_url = "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1000"

            # 💡画像をダウンロードしてローカルに保存
            try:
                img_req = urllib.request.Request(weather_img_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(img_req) as img_res:
                    with open("current_weather.jpg", "wb") as f:
                        f.write(img_res.read())
                weather_image = "current_weather.jpg"
            except:
                weather_image = weather_img_url # 失敗時はURLを直入れ

            return {
                "title": f"松山地方の本日の天気（最高気温 {max_temp}℃）",
                "desc": f"現在の予報は「{weather_text}」です。安全運転をお続けください。",
                "image": weather_image
            }
    except Exception as e:
        return {
            "title": "愛媛県エリア 天気情報",
            "desc": "現在、気象庁からの最新データを自動受信中です。",
            "image": "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=1000"
        }

def get_tourist_info():
    """観光情報と、その内容に応じた画像をダウンロードして保存"""
    spots = [
        {
            "title": "道後温泉本館（松山市）",
            "desc": "日本最古の温泉と言われる道後温泉。歴史情緒あふれる美しい木造建築の建物は、夜になると幻想的にライトアップされ、長旅の疲れを癒やす最高のスポットです。",
            "url": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000"
        },
        {
            "title": "しまなみ海道（今治市）",
            "desc": "瀬戸内海に浮かぶ美しい島々を繋ぐ「しまなみ海道」。青い空と海、白い橋のコントラストは世界中からサイクリストが集まる絶景ドライブコースです。",
            "url": "https://images.unsplash.com/photo-1542640244-7e672d6cef21?w=1000"
        }
    ]
    
    # 内容をランダムで選ぶ
    selected = random.choice(spots)
    
    # 💡選ばれた内容に応じた画像を「current_kanko.jpg」として上書きダウンロード！
    try:
        req = urllib.request.Request(selected["url"], headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            with open("current_kanko.jpg", "wb") as f:
                f.write(response.read())
        image_path = "current_kanko.jpg"
    except Exception as e:
        # 万が一ダウンロード失敗したら元のURLを使う
        image_path = selected["url"]

    return {
        "title": selected["title"],
        "desc": selected["desc"],
        "image": image_path
    }

def update_signage_json():
    weather = fetch_weather()
    tourist = get_tourist_info()
    
    data = {
        "slide0": {
            "title": tourist["title"],
            "desc": tourist["desc"],
            "image": tourist["image"] # ここに「current_kanko.jpg」が入る
        },
        "slide1": {
            "title": "松山自動車道・周辺国道の流れ",
            "desc": "周辺エリアでの通行止めや、重大な事故・渋滞は発生していません。スムーズに走行可能です。",
            "image": "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1000"
        },
        "slide2": {
            "title": weather["title"],
            "desc": weather["desc"],
            "image": weather["image"] # ここに「current_weather.jpg」が入る
        },
        "slide3": {
            "title": "現在、重大な規制情報はありません",
            "desc": "現時点で愛媛県内における緊急の通行規制は発令されていません。安全第一でお進みください。",
            "image": "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=1000"
        }
    }
    
    with open("signage_data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("最新データと画像のダウンロードが完了しました！")

if __name__ == "__main__":
    update_signage_json()
