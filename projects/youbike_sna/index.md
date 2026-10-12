---
title: "臺北 YouBike 路網與道路風險分析"
permalink: /projects/youbike_sna/
layout: single
excerpt: "整合 1.09 億筆 YouBike 旅次、BRouter 路徑重建與交通事故資料，建立道路層級騎乘暴露量與風險檢視流程。"

header:
  overlay_image: /projects/youbike_sna/assets/cover.png
  overlay_filter: 0.55

classes: wide project
---

這個專案從超過一億筆 YouBike 旅次出發，將站點間的 OD 移動進一步轉換成道路層級的估計騎乘暴露量，再結合 2023–2024 年交通事故資料，建立可重現的道路風險檢視流程。

研究的目的不是產生一份「最危險道路排名」，而是利用資料縮小值得進一步觀察的範圍，再回到實際道路情境理解可能需要改善的地方。

> **資料幫助找到值得看的地方，道路脈絡則幫助理解可能需要改善的是什麼。**

[查看 GitHub Repository](https://github.com/kuku0508/YouBike-Road-Risk-Analysis){: .btn .btn--primary }

<div class="project-summary-grid">
  <div class="project-summary-card">
    <span>完整解析旅次</span>
    <strong>109.7M</strong>
  </div>
  <div class="project-summary-card">
    <span>道路微路段</span>
    <strong>106,049</strong>
  </div>
  <div class="project-summary-card">
    <span>事故實體</span>
    <strong>46,586</strong>
  </div>
  <div class="project-summary-card">
    <span>事故道路配對率</span>
    <strong>85.2%</strong>
  </div>
</div>

## 研究問題

這個專案主要回答三個問題：

1. YouBike 騎乘主要集中在哪些站點與路網？
2. 哪些高流量道路微路段具有較突出的事故頻率與嚴重度？
3. 這些數值在實際道路環境中，可能對應哪些通行問題？

## 分析流程

![YouBike 專案分析流程](/projects/youbike_sna/assets/project_pipeline.svg)

整體流程從原始旅次清理開始，經過 OD 網路建構、BRouter 路徑重建、道路微路段暴露量估計、事故實體重建與空間配對，最後以風險指標協助人工道路情境檢視。

<div class="project-flow" aria-label="分析流程">
  <div><b>1</b><span>清理旅次資料<br>建立 OD 網路</span></div>
  <div><b>2</b><span>站點與<br>網路分析</span></div>
  <div><b>3</b><span>BRouter 路徑重建<br>估計道路暴露量</span></div>
  <div><b>4</b><span>事故實體重建<br>與空間配對</span></div>
  <div><b>5</b><span>風險指標<br>與人工道路檢視</span></div>
</div>

## 從站點 OD 到道路層級

2023–2024 年核心分析資料包含：

- **91,138,763 筆**可納入 OD 分析的旅次
- **2,782 個**站點
- **1,125,519 條**有向 OD 邊

YouBike 公開資料提供借車站與還車站，但沒有實際騎乘 GPS 軌跡。因此，本研究進一步使用 BRouter 的 Trekking profile 重建站點之間可能行經的道路路徑。

最終完成 **1,100,919 條 BRouter 路由**，再將正反方向道路幾何整合為 **106,049 個方向中立道路微路段**，並依 OD 旅次權重估計各路段的騎乘暴露量。

這裡的暴露量（exposure）代表 **BRouter 重建路徑通過微路段的加權 traversal**，並不是真實 GPS 流量、官方交通量或唯一騎士人數。

## 事故實體重建與道路配對

2023–2024 年事故資料先依時間、位置文字與座標重建為 **46,586 個 canonical accident entities**。

之後再依道路語境、空間距離及明確的配對規則，將事故配對至方向中立道路微路段。

最終結果：

- **39,711 件事故成功配對**
- 正式道路配對率約 **85.2%**
- **39,705 件**已配對事故具有可用嚴重度分類
- 其中包含 **124 件 fatal** 與 **39,581 件 injury**

無法安全判定的案件不強迫配對，而是保留於排除帳與 QA 紀錄中。

## 風險指標

### CBI：相對事故頻率與嚴重度

綜合自行車指標（Composite Bicycle Index, CBI）由兩個相對指標組成：

```text
CBI = SRI + SSI
```

其中：

- SRI：相對事故頻率
- SSI：相對事故嚴重度

CBI 在共同的 106,049 個道路微路段 universe 上正規化，因此適合協助辨識事故頻率與嚴重度相對突出的路段。

CBI **不包含騎乘暴露量**，也不代表絕對事故機率。

### EPDO per 1,000 estimated trips

另一個互補指標是將事故嚴重度加權結果除以估計 exposure：

```text
EPDO per 1,000 estimated trips
```

它提供 exposure-adjusted burden 的視角。

目前可用且可空間配對的事故資料沒有完整 PDO-only 資料，因此本研究實際觀察到的 EPDO 為：

```text
observed EPDO = 193 × fatal + 117 × injury
```

PDO component 是 **unobserved**，不是假設為 0。

CBI、EPDO／1,000 estimated trips 與 high-flow flag 分別回答不同問題，沒有被合成單一「總風險分數」。

## 高流量範圍與指標穩定性

若直接對所有微路段計算 EPDO／1,000 estimated trips，低 exposure denominator 可能產生非常大的極端值。

因此，本研究沿用 day-type exposure 中位數作為 high-flow presentation universe：

- 平日高流量微路段：**53,032 段**
- 假日高流量微路段：**53,025 段**

在 high-flow universe 中，暴露調整指標的尾端明顯收斂，使人工道路檢視更聚焦於具有實際使用量的路段。

這是一項描述性的穩定性依據，不代表中位數是統計上的最佳風險門檻，也不代表低流量道路沒有風險。

![高流量微路段的暴露調整負擔分布](/projects/youbike_sna/assets/phase8_5c_rate_distribution.png)

## 平日與假日 CBI

下圖使用同一組 canonical CBI 與共同的視覺化分級。

<div class="project-image-pair">
  <figure>
    <img src="/projects/youbike_sna/assets/phase8_5c_weekday_cbi.png" alt="平日高流量道路微路段 CBI">
    <figcaption>平日高流量道路微路段的 CBI 呈現。</figcaption>
  </figure>
  <figure>
    <img src="/projects/youbike_sna/assets/phase8_5c_holiday_cbi.png" alt="假日高流量道路微路段 CBI">
    <figcaption>假日高流量道路微路段的 CBI 呈現。</figcaption>
  </figure>
</div>

顏色分級的目的只是縮小人工檢視範圍。

它不是 hotspot detector、不是 Top-N 排名，也不應直接解讀為「這條道路比另一條道路危險幾倍」。

最終仍需要回到道路環境理解可能的風險機制。

## 四個代表性道路案例

CBI-guided review 將需要人工檢視的範圍縮小後，再結合道路環境進行人工判讀，最後整理出四種代表性情境。
> **街景影像說明：** 下列影像僅用於理解案例的道路空間脈絡。影像拍攝時間可能與 2023–2024 年事故資料期間不同，因此不作為事故因果關係的判定依據。

### A｜民權東路二段

**地下道出入口與自行車通行空間**
<figure>
  <img src="/projects/youbike_sna/assets/case-a-minquan.png" alt="民權東路二段地下道出入口與自行車通行空間">
  <figcaption>
    道路現況觀察：地下道出入口、自行車通行空間與路口轉向動線距離接近，周邊亦有商業活動與行人使用需求。
  </figcaption>
</figure>

此處本身已有相當程度的自行車通行空間，但地下道出入口、行人活動、店家空間與自行車動線彼此非常接近。

值得進一步檢視的重點包括：

- 自行車空間與行人、店家活動的整合
- 地下道出入口附近的轉向與交會
- 視距、標線與道路辨識

**改善方向：空間整合與交會管理**

### B｜百齡橋橋頭

**自行車上橋入口導引**
<figure>
  <img src="/projects/youbike_sna/assets/case-b-bailing-bridge.png" alt="百齡橋橋頭自行車上橋入口道路環境">
  <figcaption>
    道路現況觀察：從主要接近方向觀察，自行車上橋入口在較遠距離不易辨識，接近入口後通行位置才較為明確。
  </figcaption>
</figure>

大型多車道路環境旁已有自行車上橋入口，但入口本身不容易被提前辨識。

騎士若太晚才發現入口，可能面臨突然轉向或錯過入口的情況；連續上坡也會降低騎乘速度，進一步放大與其他車流的速度差。

值得檢視：

- 提前導引是否足夠
- 地面箭頭與標線是否連續
- 自行車入口是否足夠醒目

**改善方向：入口辨識與提前導引**

### C｜基隆路二段

**高車流、公車站與 YouBike 出入口交織**
<figure>
  <img src="/projects/youbike_sna/assets/case-c-keelung-road.png" alt="基隆路二段 YouBike 站點與道路通行環境">
  <figcaption>
    道路現況觀察：YouBike 站點出入口鄰近外側車流與人行空間，周邊植栽亦可能影響部分方向的視線條件。
  </figcaption>
</figure>

此處為多車道、高流量道路環境，YouBike 站點出口與公車站及外側車流距離較近。

站點使用者進入道路時，可能同時面對：

- 公車進出站
- 一般汽機車流
- 外側道路混合通行
- 植栽或道路設施造成的視距限制

**改善方向：匯入交織與視距管理**

### D｜大度路一段

**長距離混合通行與退出選擇受限**
<figure>
  <img src="/projects/youbike_sna/assets/case-d-dadu-road.png" alt="大度路一段長距離多車道路環境">
  <figcaption>
    道路現況觀察：道路筆直、距離長且車道數多，呈現長距離混合通行與速度差需要進一步檢視的道路脈絡。
  </figcaption>
</figure>

道路筆直且距離長，自行車可能長時間與較高速車流共享道路空間。

研究者人工地圖量測顯示，部分路段到下一個明確退出位置約為 **2.7 km**；這項數字屬於案例觀察，不是整體資料集的 canonical 指標。

值得進一步檢視：

- 可退出或轉換路線的位置
- 長距離騎乘造成的速度差異
- 超車與避讓空間
- 不同道路側的空間條件差異

**改善方向：增加安全退出選擇與長距離騎乘容錯**

![CBI 引導式人工案例檢視](/projects/youbike_sna/assets/phase8_6a_case_candidate_review.png)

## 從四個案例看到什麼？

四個案例道路型態不同，但共同指出一件事：

> **自行車環境不能只看「有沒有自行車設施」。**

還需要檢視：

- 設施是否容易辨識
- 動線是否連續
- 是否與行人、公車及一般車流妥善整合
- 關鍵位置的視距是否足夠
- 騎士是否具有安全退出或替代路線

這些是由資料與道路情境共同提出的 **可能風險機制**，而不是事故因果關係的證明。

## 可重現性與工程設計

除了分析結果，本專案也將資料處理流程重新整理為可重現的研究 pipeline。

包含：

- fail-closed 資料解析與清理
- quarantine 與 record conservation
- deterministic fingerprints 與 machine-readable receipts
- BRouter cache、checkpoint 與 resume
- 空間配對 QA 與敏感度檢查
- 自動化測試
- 原始資料與大型中間成果不進 Git

完整的分析契約、QA、測試與重建紀錄皆保留於 GitHub repository。

## 技術工具

`Python` · `SQL` · `R` · `Pandas` · `PyArrow` · `NetworkX` · `Shapely` · `BRouter` · `Folium` · `Matplotlib` · `Git`

## 研究限制

- BRouter exposure 是路徑重建估計值，不是真實 GPS 騎乘流量。
- 目前缺乏完整可用的 PDO-only 事故資料，因此 EPDO 僅涵蓋目前可觀察的死亡與受傷事故。
- 事故與道路微路段的空間配對並非 100%，未成功配對案件保留於排除帳。
- 10 m matching threshold 是分析決策，不是自然形成的風險界線。
- 道路微路段不是正式道路或整條 corridor 的等價物。
- CBI = 0 不代表道路安全，只表示目前資料與配對規則下沒有觀察到計分事故。
- high-flow 中位數門檻是呈現與穩定性決策，不代表統計最佳風險門檻。
- 街景與道路環境人工判讀只能提出可能機制，不能單獨建立事故因果關係。

## 專案背景

本研究源自團隊期末專案；本頁呈現的是後續重新建構、驗證與整理後的作品集版本。

重建過程保留原研究問題，同時將無法確認的舊實作與目前可重現結果分開處理，不以推測補回遺失的程式流程。

## 完整方法與程式碼

網站主要呈現研究問題、核心結果與代表性案例。

完整的資料清理契約、網路分析、路由重建、事故空間配對、QA、測試與研究限制可在 GitHub 查看：

[查看完整 GitHub Repository](https://github.com/kuku0508/YouBike-Road-Risk-Analysis){: .btn .btn--primary }