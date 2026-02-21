---
title: "YouBike 站點互動網路與生活圈辨識"
permalink: /projects/youbike_sna/
layout: single
excerpt: "從日常騎乘出發，理解城市流動的結構與風險。"
math: true

header:
  overlay_image: /projects/youbike_sna/assets/cover.png
  overlay_filter: 0.5

classes: wide project
---

自從YouBike出現，他就是我最常使用的大眾運輸工具。  
從家裡到學校、到捷運站，  
YouBike的出現讓我不必再買自行車，  
不再需要擔心被偷走或是生鏽。

他同時也承載著這個城市很大部分的流量，  
承載流量的同時，關於自行車的問題也漸漸浮上水面 。  
3個月內，光是台北市的自行車違規件數就有1,000多件。  

我們好奇，在擁有「自行車王國」美名的台灣，  
自行車的實際騎乘環境究竟是什麼樣子?  
這個大眾運輸是如何被民眾使用?  
又是怎麼與交通系統交互的呢?  

## 透過數據理解台北市自行車網路

<div class="data-box" markdown="1">

#### DATA SOURCE 1

- 資料集： [臺北市公共自行車 2.0 租借紀錄](https://data.gov.tw/dataset/150635)
- 使用資料時段：2023 年 1 月 – 2025 年
- 提供單位：臺北市政府交通局
- 授權方式：政府資料開放授權條款 第一版

</div>

<div class="data-box" markdown="1">

#### DATA SOURCE 2

- 資料集： [臺北市A1及A2交通事故資料](https://data.taipei/dataset/detail?id=2f238b4f-1b27-4085-93e9-d684ef0e2735)
- 使用資料時段：2023 年 – 2024 年
- 提供單位：臺北市政府警察局交通大隊
- 授權方式：公開

</div>

在本專案中，我主要使用以下分析方法：

**一、社群網路分析(Social Network Analysis, SNA)**

**二、社群辨識**  
- **Louvain演算法**  
- **K-means演算法**  
- **Hierarchical分群**  

**三、流量模擬與風險評估**  
- **Brouter路徑模擬**  
- **EPDO、CBI 指標計算**  

透過這些分析，  
我們可以將大量的數據，轉換成YouBike的使用資訊，  
以及特定路段的自行車風險評估。

## 社群網路分析(Social Network Analysis, SNA)

在這次的專案中，我們主要使用的方法叫做SNA，  
所謂的SNA主要是在**關注個體與個體之間的關係**。  
我們就是把所有的個體，根據一個標準來做連結，畫一個關係圖。

<div style="text-align:left;">
  <img src="/projects/youbike_sna/assets/sna_demo.png" width="500">
</div>

在這個專案裡面，我們採用的標準是**流量**：

- 節點(Nodes)：YouBike 站點
- 連結(Edges)：站點之間的旅次
- 權重(Weight)：旅次次數


而在SNA之中，我們採用的指標有以下幾個：
### 加權度(Weighted Degree)
加權度指的是節點所連結邊之權重總和，  
反應一個節點與其他節點的互動強度。

在這個專案中，代表站點在特定期間內的借車(Weighted In Degree)與  
還車(Weighted Out Degree)的次數和。公式如下：  

<div class="formula-box">
  <div class="formula-label">Weighted Degree</div>

  $$
  WD(v) = \sum_{u \in N(v)} w_{vu}
  $$

</div>

其中$w_{ij}$站點 i 到站點 j 之間的流量，$w_{ji}$為站點 j 到站點 i 之間的流量。  
Weighted in degree的公式如下：  

<div class="formula-box">
  <div class="formula-label">Weighted In-Degree</div>

  $$
  W_{in}(v) = \sum_{u} w_{uv}
  $$

</div>

Weighted out degree的公式如下： 

<div class="formula-box">
  <div class="formula-label">Weighted Out-Degree</div>

  $$
  W_{out}(v) = \sum_{u} w_{vu}
  $$

</div>

### 介數中心度（Betweenness Centrality）
介數中心度用來衡量一個節點位於多少條最短路徑之上。  
如果一個節點經常出現在其他節點之間的最短路徑中，
則它具有較高的中介能力。

**在本專案中的意義：**  
高介數站點往往是轉運節點，
例如捷運站周邊的 YouBike 站點。  
它們在不同生活圈之間扮演橋樑角色，
連結多個社群。

### 特徵向量中心度（Eigenvector Centrality）

**原生定義：**  
特徵向量中心度不僅考慮連結數量，
還考慮「你連到的人是否重要」。

換句話說，連到高影響力節點的節點，
自身也會獲得較高的重要性分數。

**在本專案中的意義：**  
此指標可辨識位於高影響力區域中的站點，
例如核心商業區或高流動區域。

### PageRank

**原生定義：**  
PageRank 是基於隨機遊走理論，
衡量節點被「訪問」的機率。

**在本專案中的意義：**  
若將騎乘行為視為流動過程，
則 PageRank 可以理解為：
一名隨機騎乘者最終停留於某站點的相對機率。

### 群聚係數（Clustering Coefficient）

**原生定義：**  
群聚係數衡量一個節點的鄰居之間彼此連結的程度。

**在本專案中的意義：**  
若某些站點之間高度互通，
代表該區域形成明顯的生活圈，
例如住宅區或校園周邊。

## 

<div class="map-credit">
  Map rendering generated via MapToPoster.  
  Base map data © OpenStreetMap contributors.
</div>

