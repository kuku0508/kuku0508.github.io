---
title: "YouBike 站點互動網路與生活圈辨識"
permalink: /projects/YouBike_sna/
layout: single
excerpt: "從日常騎乘出發，理解城市流動的結構與風險。"

header:
  overlay_image: /projects/YouBike_sna/assets/cover.png
  overlay_filter: 0.5

classes: wide
---

自從YouBike出現，他就是我最常使用的大眾運輸工具。  
從家裡到學校、到捷運站，  
YouBike的出現讓我不必再買自行車，  
不再需要擔心被偷走或是生鏽。

他同時也承載著這個城市很大部分的流量，  
承載流量的同時，關於自行車的問題也漸漸浮上水面 。  
3個月內，光是台北市的自行車違規件數就有1,000多件。  

我們好奇，擁有「自行車王國」美名的台灣，  
自行車的處境，究竟是什麼樣子的?  
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

**一、社會網路分析(Social Network Analysis, SNA)**

**二、社群辨識**  
- **Louvain演算法**  
- **K-means演算法**  
- **Hierarchical分群**  

**三、流量模擬與風險評估**  
- **Brouter路經模擬**  
- **EPDO、CBI 指標計算**  

透過這些分析，  
我們可以將大量的數據，轉換成YouBike的使用資訊，  
以及特定路段的自行車風險評估。

## 03 分群：看見城市的生活圈

當社群分群成功時，我看到的不是抽象的網路圖。  
而是一種熟悉的節奏。

多數騎乘都是短距離。  
從家到捷運站，  
或從捷運站到工作地點。

這些短短的運輸，  
在網路中形成了明確的群落。

城市的生活圈，真的存在於資料之中。


![Louvain 分群視覺化](/projects/YouBike_sna/assets/community.png)

> Louvain 演算法辨識出明顯社群結構，  
> 社群分布與地理區域高度重疊。


---

## 04 橋樑節點與轉運結構

除了社群分群，我也分析了中心性指標：

- Degree Centrality
- Betweenness Centrality
- PageRank

具有高 betweenness 的站點，  
多集中於大型轉運節點附近。

這意味著：

YouBike 並非隨機分布的移動工具，  
而是嵌入於都市公共運輸系統之中。


![中心性視覺化](/projects/YouBike_sna/assets/centrality.png)


---

## 05 流動，也意味著風險

在理解城市流動結構的同時，  
我也開始思考另一個問題。

當騎乘行為集中於特定橋樑型節點時，  
是否也意味著風險的集中？

若某些站點承載高度轉運流量，  
交通事故的暴露機率是否也隨之提高？

流動讓城市更有效率，  
但也可能讓風險變得更加隱性而集中。

未來若能結合事故資料與空間資訊，  
或許能更具體地辨識潛在風險區域。

對一般騎乘者而言，  
理解這些結構，也是一種自我保護。


---

## 06 本專案展現能力

**資料處理與清理**
- 大型騎乘資料整理
- 加權網路建構

**社群與網路分析**
- Louvain 社群偵測
- 中心性指標計算
- 結構詮釋

**視覺化與敘事轉譯**
- 網路圖視覺化
- 結構結果轉譯為生活語言
- 將數據與城市觀察連結


---

## 結語

理解城市的流動，不只是為了看見結構。  
也是為了在日常騎乘之中，多一份對風險的覺察。


<div class="map-credit">
  Map rendering generated via MapToPoster.  
  Base map data © OpenStreetMap contributors.
</div>

