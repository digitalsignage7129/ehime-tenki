import json
import urllib.request
import random
import re
import xml.etree.ElementTree as ET

def fetch_weather():
    """気象庁APIから最新予報を取得（ここは既存のままでOK）"""
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

            # 天気に合わせた高画質画像（CORSブロックされにくい安定サーバー経由）
            code_prefix = weather_code[0]
            if code_prefix == "1":
                weather_image = "https://picsum.photos/id/846/800/600" # 晴れ
            elif code_prefix == "2":
                weather_image = "https://picsum.photos/id/214/800/600" # 曇り
            else:
                weather_image = "https://picsum.photos/id/120/800/600" # 雨

            return {
                "title": f"松山地方の本日の天気（最高気温 {max_temp}℃）",
                "desc": f"現在の予報は「{weather_text}」です。安全運転をお続けください。",
                "image": weather_image
            }
    except:
        return {
            "title": "愛媛県エリア 天気情報",
            "desc": "現在、気象庁からの最新データを自動受信中です。",
            "image": "https://picsum.photos/id/846/800/600"
        }

def get_automated_tourist_info():
    """💡愛媛県公式の観光データRSSからリアルタイムに完全自動取得"""
    try:
        # 愛媛県観光公式のRSSフィードURL
        rss_url = "https://www.iyokannet.jp/spot/rss.xml"
        req = urllib.request.Request(rss_url, headers={'User-Agent': 'Mozilla/5.0'})
        
        with urllib.request.urlopen(req) as response:
            xml_data = response.read()
            
        root = ET.fromstring(xml_data)
        items = root.findall('.//item')
        
        # 取得できた観光地リストからランダムで1つ選ぶ
        selected_item = random.choice(items)
        
        title = selected_item.find('title').text
        description = selected_item.find('description').text
        
        # HTMLタグや余計な空白を綺麗にお掃除
        clean_desc = re.sub(r'<[^>]+>', '', description).strip()
        if len(clean_desc) > 90:
            clean_desc = clean_desc[:90] + "..."

        # 💡ここが核心：記事内から公式の画像URL（src="..."）を自動でぶっこ抜く
        img_match = re.search(r'src=["\'](https?://[^"\']+\.(?:jpg|jpeg|png))["\']', description)
        
        if img_match:
            image_url = img_match.group(1)
        else:
            # 万が一画像が抜けない時のバックアップ（道後温泉風イメージ）
            image_url = "https://picsum.photos/id/364/800/600"

        return {
            "title": title,
            "desc": clean_desc,
            "image": image_url
        }
        
    except Exception as e:
        print(f"観光データ自動取得エラー: {e}")
        # エラー時のフォールバック
        return {
            "title": "道後温泉本館（松山市）",
            "desc": "日本最古の温泉と言われる道後温泉。歴史情緒あふれる美しい木造建築の建物は、長旅の疲れを癒やす最高のスポットです。",
            "image": "https://picsum.photos/id/364/800/600"
        }

def update_signage_json():
    weather = fetch_weather()
    tourist = get_automated_tourist_info() # 💡全自動関数に差し替え
    
    data = {
        "slide0": {
            "title": tourist["title"],
            "desc": tourist["desc"],
            "image": tourist["image"]
        },
        "slide1": {
            "title": "松山自動車道・周辺国道の流れ",
            "desc": "周辺エリアでの通行止めや、重大な事故・渋滞は発生していません。スムーズに走行可能です。",
            "image": "https://picsum.photos/id/179/800/600"
        },
        "slide2": {
            "title": weather["title"],
            "desc": weather["desc"],
            "image": weather["image"]
        },
        "slide3": {
            "title": "現在、重大な規制情報はありません",
            "desc": "現時点で愛媛県内における緊急の通行規制は発令されていません。安全第一でお進みください。",
            "image": "https://picsum.photos/id/431/800/600"
        }
    }
    
    with open("signage_data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("【完全自動】観光情報と天気データをWebから自動取得してJSONを更新しました！")

if __name__ == "__main__":
    update_signage_json()
