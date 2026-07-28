---
title: "YouBike 騎乘網絡與高風險路段辨識"
permalink: /projects/youbike_sna/
layout: single
excerpt: "整合 YouBike 旅次、網絡分析、路徑模擬與交通事故資料，找出臺北市高流量且高風險的自行車路段。"

header:
  overlay_image: /projects/youbike_sna/assets/cover.png
  overlay_filter: 0.55

classes: wide project
---

YouBike 解決了許多人的「最後一哩路」，卻也把騎士帶進一套不連續的自行車路網：自行車優先道突然中斷、騎士在人行道與汽機車道間切換，以及路口缺乏清楚的路權銜接。

這份團隊專案把 YouBike 站點與旅次建成一張有向加權網絡，結合社群偵測、站點角色分群、BRouter 路徑模擬與交通事故風險指標，回答一個具體問題：

> 臺北市哪些自行車路段同時承擔大量騎乘需求，又存在較高的事故風險？

<div class="project-summary-grid">
  <div class="project-summary-card">
    <span>研究場域</span>
    <strong>臺北市與北北市 YouBike 網絡</strong>
  </div>
  <div class="project-summary-card">
    <span>探索期間</span>
    <strong>2023.01–2025.03</strong>
  </div>
  <div class="project-summary-card">
    <span>核心分析期間</span>
    <strong>2023–2024</strong>
  </div>
  <div class="project-summary-card">
    <span>分析工具</span>
    <strong>R、igraph、Gephi、BRouter</strong>
  </div>
</div>

## 專案目標

1. 從借還車旅次辨識城市中的 YouBike 生活圈與重要站點。
2. 將站點間旅次轉換為可能行經的道路，估計路段層級的騎乘流量。
3. 結合 A1、A2 交通事故資料，找出「高流量、高風險」路段。
4. 依道路情境提出具有空間指向性的改善建議，而不只停留在事故件數排名。

## 資料與分析範圍

<div class="data-box" markdown="1">

#### YouBike 旅次資料

- 資料集：[臺北市公共自行車 2.0 租借紀錄](https://data.gov.tw/dataset/150635)
- 探索性分析：2023 年 1 月至 2025 年 3 月
- 核心網絡分析：2023–2024 年，並區分平日、假日與小時
- 網絡定義：站點為節點、站點間旅次為有向邊、旅次次數為權重

</div>

<div class="data-box" markdown="1">

#### 交通事故資料

- 資料集：[臺北市 A1、A2 交通事故資料](https://data.taipei/dataset/detail?id=2f238b4f-1b27-4085-93e9-d684ef0e2735)
- 使用期間：2023–2024 年
- 事故範圍：A1（24 小時內死亡）與 A2（受傷或超過 24 小時死亡）
- 風險衡量：CBI 綜合事故頻率與嚴重程度，EPDO 將不同傷亡程度換算為財損當量

</div>

## 分析流程

<div class="project-flow" aria-label="分析流程">
  <div><b>1</b><span>清理借還車紀錄<br>建立 OD 矩陣</span></div>
  <div><b>2</b><span>建立有向加權網絡<br>計算 SNA 指標</span></div>
  <div><b>3</b><span>辨識生活圈<br>分類站點角色</span></div>
  <div><b>4</b><span>BRouter 模擬路徑<br>回填旅次權重</span></div>
  <div><b>5</b><span>疊合事故資料<br>標記高風險路段</span></div>
</div>

方法上，Louvain 用於辨識依實際旅次形成的生活圈；K-means 依站點的流量與中心性指標區分功能角色；階層式分群則比較平日、假日與每小時的站點結構。最後，以 BRouter 的 Trekking 模式模擬起訖站間路徑，將旅次權重累加到道路上，再與事故風險疊合。

想深入理解指標、公式與方法選擇，可以閱讀延伸文章：
**[從 YouBike 旅次到道路風險：SNA、Louvain、CBI 與 EPDO 的分析方法](/articles/youbike-sna-methods/)**。

## 關鍵發現

### 1. 旅次形成 11 個具有空間連續性的生活圈

Louvain 分群的模組度為 **Q = 0.665**，顯示網絡具有明顯的社群結構。多數旅次發生於同一生活圈內，跨圈移動也多集中在相鄰區域，說明 YouBike 主要服務區域內短程移動。

![Louvain 分群辨識出的 11 個 YouBike 生活圈](/projects/youbike_sna/assets/louvain-communities.png)
<p class="figure-caption">Louvain 依旅次關係辨識出的 11 個生活圈；分群並非直接以行政區或座標切割。</p>

中山圓山生活圈對整體網絡的模組度貢獻最大，扮演跨區移動與商務轉運核心；北投天母生活圈的內聚力最高，使用行為較集中於生活圈內部。

### 2. 地理生活圈與站點功能是兩種不同的分類

K-means 不依地理相鄰性，而是使用平均流量、介數中心度、群聚係數與 PageRank，將站點分為都會核心樞紐、關鍵轉運橋樑、社區生活圈與一般末端站點。

![K-means 分類的四種 YouBike 站點功能角色](/projects/youbike_sna/assets/kmeans-station-roles.png)
<p class="figure-caption">都會核心樞紐散布於信義、中山與大安等高流量區域，反映的是功能角色而非地理分區。</p>

其中，都會核心樞紐的平均流量約 **61 萬次**，同時具有最高的平均介數中心度與 PageRank；社區生活圈的平均群聚係數則最高（**0.752**），顯示旅次較集中於鄰近站點。

### 3. 平日是通勤雙峰，假日則更晚且向郊區擴散

平日的借用量呈早晚雙峰，呼應通勤與大眾運輸接駁；假日多為較晚出現的單峰，且騎乘路線更往河濱與郊區延伸。平日除 18 時外，各時段的模組度多高於假日，也支持假日跨生活圈移動較多的觀察。

![BRouter 模擬的 YouBike 假日騎乘熱點路網](/projects/youbike_sna/assets/holiday-route-heatmap.png)
<p class="figure-caption">假日模擬路網；顏色由綠至紅表示累積的旅次權重增加。</p>

市民大道、信義路三段、復興南北路、和平東路、德行東西路與松仁路，都是模擬中承載較高流量的重要廊道。

### 4. 事故頻率與事故嚴重度需要分開閱讀

CBI 同時考慮相對事故頻率與相對嚴重度，適合辨識「事故多且後果較嚴重」的路段；每千旅次 EPDO 則將事故嚴重程度除以估計騎乘量，讓不同流量路段具有較可比較的暴露基準。

<div class="project-image-pair">
  <figure>
    <img src="/projects/youbike_sna/assets/weekday-cbi-risk.png" alt="YouBike 平日路段 CBI 風險圖">
    <figcaption>平日 CBI：頻率與嚴重度的綜合風險。</figcaption>
  </figure>
  <figure>
    <img src="/projects/youbike_sna/assets/weekday-epdo-risk.png" alt="YouBike 平日每千旅次 EPDO 風險圖">
    <figcaption>平日每千旅次 EPDO：依估計騎乘量標準化後的嚴重度。</figcaption>
  </figure>
</div>

兩個指標指出的高風險區域大致相符，但也揭露不同型態：部分信義區路段呈現「事故頻率高、平均後果相對較低」；假日河濱路段則同時具有較高 CBI 與每千旅次 EPDO，顯示事故不只較常發生，後果也可能更嚴重。

## 具體風險場景

- **洲美大橋北投端**：河濱騎乘需求在狹窄引道匯集，坡度、彎道、視線死角與汽機車速差共同放大風險。
- **致遠一路二段**：住宅與商業混合、路幅有限、臨停及店家出入口密集，騎士容易面臨右轉車與開車門衝突。
- **信義路五段 91 巷口**：從汽機車混流切換至人車共道，路權與鋪面銜接不清楚。
- **通化街**：夜市與捷運人流集中，狹窄道路及路邊停車壓縮自行車的避讓空間。

## 建議

本研究建議優先處理高流量、高風險路段的路權銜接，而非只在事故發生後加強取締。可行方向包含：

- 在自行車道中斷處補足連續動線與清楚導引。
- 於路口及引道改善視距、轉向動線與緩衝空間。
- 針對汽機車混流路段評估實體分隔或停車保護型自行車道。
- 將平日通勤與假日休閒騎乘視為不同使用情境，分別規劃改善優先順序。

## 研究限制

- YouBike 沒有提供路段層級 GPS 軌跡，流量來自 BRouter 預設 Trekking 路徑的模擬，不能視為真實騎乘軌跡。
- 事故與騎乘流量的空間疊合能辨識優先關注區域，但無法單獨證明道路設計造成事故。
- EPDO 權重沿用既有事故成本研究，且成本基準來自 1999 年幣值；本研究已改以「其他財損」作為較接近自行車事故的換算基準，但仍需更新成本參數。
- 天氣、照明、速限、道路寬度、土地使用與騎士特徵尚未納入統計模型。

## 若要讓作品更完整

目前頁面已能說明問題、方法、結果與限制。下一步最值得補齊的是可重現性與個人貢獻：

1. **資料規模**：清理前後旅次筆數、站點數、OD 邊數、事故筆數與剔除規則。
2. **個人負責範圍**：你實際負責的資料、程式、圖表、解讀與簡報段落。
3. **可重現程式碼**：公開或去識別化的 GitHub 儲存庫、環境版本與執行說明。
4. **模型設定與驗證**：Louvain 隨機種子、K-means 標準化與 k 值選擇、階層式分群距離、BRouter 設定，以及敏感度分析。
5. **互動成果**：可切換平日／假日、CBI／EPDO 與風險熱點的互動地圖。
6. **決策輸出**：高風險路段排名表，包含流量、事故數、CBI、每千旅次 EPDO、現地問題與改善建議。

---

本專案的地圖底圖使用 OpenStreetMap、CARTO，路徑由 BRouter 模擬。詳細資料來源與參考文獻請見[方法文章](/articles/youbike-sna-methods/)。
