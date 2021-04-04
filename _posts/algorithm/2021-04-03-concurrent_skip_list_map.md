---
title: "ConcurrentSkipListMap"
tags:
  - data_structure
  - algorihm
categories:
  - algorithm
last_modified_at: 2021-03-07T13:00:00+17:00
toc: true
---
<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>

# Introduction

오늘 이야기해볼 주제는 java의 [`ConcurrentSkipListMap`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ConcurrentSkipListMap.html)다.

응용한 구현체와 그 때 이용된 알고리즘 등에 대해서 자세히 살펴볼까 한다. 꽤나 deep한 내용이 될 수 있지만, `thread safe`한 로직을 하나정도 깊게 다뤄보는 것은 매우 중요하다.

물론 개인적인 공부에 회사에서 쓰는 로직 등은 지양하려 하나, 관심있는 분야에 대해서는 논외다.

바로 포스팅을 시작해보자. 지금 듣고 있는 노래는 `지문 - 안다영`이다.

# ConcurrentSkipListMap

> A scalable concurrent ConcurrentNavigableMap implementation.
>
> The map is sorted according to the natural ordering of its keys, or by a Comparator provided at map creation time, depending on which constructor is used.
>
> This class implements a concurrent variant of `SkipLists` providing expected average $$log(n)$$ time cost for the containsKey, get, put and remove operations and their variants. Insertion, removal, update, and access operations safely execute concurrently by multiple threads.
>
> Iterators and spliterators are weakly consistent.

멀티스레드 환경에서 동기화 없이 사용될 수 있는 자료구조로써 `skip list` 구현체를 이용한 방식이다.
