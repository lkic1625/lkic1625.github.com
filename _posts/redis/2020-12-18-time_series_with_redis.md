---
title: "시계열 데이터 관측"
tags:
  - NoSQL
  - database
  - redis
  - nodejs
  - time-series
categories:
  - redis
last_modified_at: 2020-12-18T13:00:00+18:00
toc: true
---
<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>

# Introduction

오랜만에 포스팅한다. 하고 싶은 포스팅은 넘치는데 천천히 하나씩 해보겠다.

이 포스트는 [레디스 콜렉션](/redis/redis_01)과 이어집니다.


# Time Series

>시계열(時系列, 영어: time series)은 일정 시간 간격으로 배치된 데이터들의 수열을 말한다. 시계열 해석(time series analysis)라고 하는 것은 이런 시계열을 해석하고 이해하는 데 쓰이는 여러 가지 방법을 연구하는 분야이다.
-wikipedia

시계열 데이터는 다양한 분석방법에 쓰일 수 있으며, 아래는 이에 대한 예시이다.

- Usage of specific words or terms in a newspaper over time
- Minimum wage year-by-year
- Daily changes in stock prices
- Product purchases month-by-month
- Climate changes

많은 시계열 시스템이 빠르게 늘어나는 데이테셋을 저장하는 문제를 겪고있다.

# Overview


><font size="6">Refernce</font>
- Maxwell Dayvson Da Silva, Redis Essentials
- https://ko.wikipedia.org/wiki/시계열
