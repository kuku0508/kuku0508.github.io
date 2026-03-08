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

在本專案中，我們主要使用以下分析方法：

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

SNA是一種用來分析「個體之間關係結構」的方法，
透過將個體視為節點（Nodes），
並以互動或連結作為邊（Edges），
我們可以將複雜的互動關係轉換為網路結構進行分析。

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

在這個專案中，代表站點 i 在特定期間內的借車(Weighted In Degree)與  
還車(Weighted Out Degree)的次數和。公式如下：  

<div class="formula-box">
  <div class="formula-label">Weighted Degree</div>

  $$
  k_i^w=\sum_j w_{ij}+\sum_j w_{ji}
  $$

</div>

$w_{ij}$：站點 i 到站點 j 之間的流量，  
$w_{ji}$：站點 j 到站點 i 之間的流量。  

<div class="formula-box">
  <div class="formula-label">Weighted In-Degree</div>

  $$
  W_{in}(v) = \sum_{u} w_{uv}
  $$

</div>

<div class="formula-box">
  <div class="formula-label">Weighted Out-Degree</div>

  $$
  W_{out}(v) = \sum_{u} w_{vu}
  $$

</div>

### 介數中心度（Betweenness Centrality）
介數中心度用來衡量一個節點位於多少條最短路徑之上。  
一個節點經常出現在其他節點之間的最短路徑中，  
反映其在城市交通流動中對整體系統連通與流量傳遞的影響力。

<div class="formula-box">
  <div class="formula-label">Betweenness Centrality</div>

  $$
  g(v)=\sum_{s\neq v\neq t}\frac{\sigma_{st}(v)}{\sigma_{st}}
  $$

</div>

$\sigma_{st}(v)$：節點 s 到節點 t 會經過節點 v 的最短路徑之流量  
$\sigma_{st}$：節點 s 到節點 t 最短路徑之流量。

### 特徵向量中心度（Eigenvector Centrality）

特徵向量中心度用來衡量節點在整個網路中的影響力。與加權度只計算與其他站點的總流量不同，特徵向量中心度同時考慮「連結的節點是否也重要」。

換句話說，如果一個站點連結到許多高重要性的站點，則其中心度也會相對提高。因此，一個節點的影響力會受到其鄰近節點影響力的加權累積。

在 YouBike 的站點網路中，若某個站點經常與大型轉乘站、商業區或其他核心站點形成密集連結，則該站點的特徵向量中心度通常會較高。這表示該站點不只是流量多，更可能位於整體網路的重要結構之中。

### 網頁排名（PageRank）

PageRank 的概念與特徵向量中心性蠻類似的，兩者都基於同一個核心思想：**一個節點的重要性，不僅取決於連結的數量，更取決於連結來源本身的重要程度。**換句話說，如果一個站點經常接收來自其他「重要大站」的車流，其中心性也會隨之提高。  

然而，與特徵向量中心性不同的是，PageRank 在模型中加入了 **「隨機跳躍」（Random Jump）** 的機制，用來模擬真實世界網路中的不確定性。在 YouBike 的情境中，我們可以想像一位隨機騎乘的騎士，在大部分情況下，他會沿著既有的熱門路線前往下一個站點。但仍有一小部分機率，他會重新開始，並從城市中的任意一個站點重新開始新的騎乘。

這項設計能有效避免某些特殊網路結構對結果造成過度影響。例如，當路網中存在「只有車騎進去、卻沒有車騎出來」的沒有外連結節點，或是幾個站點之間形成封閉的循環結構時，若完全依賴連結傳遞，權重（重要性）可能會被困在這些局部結構中。

透過引入隨機跳躍機制，PageRank 能夠確保權重在整個網路中重新分配，使得最終得到的中心性評估更加穩定，也更貼近真實世界中帶有隨機性的移動行為。

### 群聚係數（Clustering Coefficient）

群聚係數用來衡量某個節點周圍是否形成緊密的群體結構。直觀來說，它描述的是一個節點的鄰居之間彼此是否也互相連結。如果一個節點的鄰居之間經常彼此相連，則代表該節點所在的區域具有較高的群聚性或地方密集度。

在 YouBike 的站點網路中，可以將群聚係數理解為「周圍站點之間是否形成局部騎乘網路」。若某個站點周圍的多個站點彼此之間也存在頻繁的騎乘流動，則代表這些站點形成了一個相對緊密的區域騎乘群。例如，在商圈、大學校園或住宅區附近，騎乘行為往往集中在幾個相鄰站點之間，形成局部循環的移動模式，此時這些站點通常會具有較高的群聚係數。

數學上，節點 i 的群聚係數可以表示為：
<div class="formula-box">
  <div class="formula-label">Clustering Coefficient</div>

  $$
  C_i=\frac{2E_i}{k_i(k_i-1)}
  $$

</div>

$E_i$：節點 i 的鄰居之間實際存在的連結數
$k_i$：節點 i 的鄰居數

## 更新

<div class="map-credit">
  Map rendering generated via MapToPoster.  
  Base map data © OpenStreetMap contributors.
</div>

