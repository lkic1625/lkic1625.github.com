---
title: "segment tree"
tags:
  - search
  - tree
  - graph
  - datatructure
  - algorithm
categories:
  - algorithm
last_modified_at: 2020-10-24T13:00:00+17:00
toc: true
---
<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>

# 개요

구간별로 합을 저장해두는 자료구조이다. 특정 쿼리에 대해 $$O(logn + k)$$로 처리 가능하며 공간 복잡도와 생성 과정에서 $$O(nlogn)$$이 사용된다.

## 구조 설명

$$S$$를 구간 혹은 세그먼트의 집합이라고 하고, $$p_1, p_2, ..., p_m$$을 오름차순으로 정렬한 구간의 끝점 (혹은 `endpoint`)라 하자.
각각의 점에 따라 분할되는 구간을 생각했을 때 이를 `elementary intervals`라 한다.

![이미지1](/assets/images/seg_tree_intervals.png)

`elementary intervals`들은 연속적인 두 개의 끝점에선 개구간을, 한 점으로 이루어진 경우에는 폐구간을 갖는다.
한 점을 구간으로 취급하는 이유는 쿼리에 대한 응답에서 내부의 끝점과 `elementary intervals`를 구분할 필요가 없기 때문이다(?)

구간 혹은 세그먼트 집합 $$I$$가 주어졌을 때, 트리 $$T$$는 아래와 같이 구성된다.

- $$T$$는 이진트리다.
- 종단 노드는 끝점으로 구성된 `elementary intervals`를 순서대로 나타내며, 왼쪽 종단 노드는 가장 왼쪽에 있는 구간(intervals)이다.
종단노드 $$v$$를 나타내는 `elementary intervals`는 Int($$v$$)라 표기한다.
- 중간 노드는 `elementary intervals`의 합이다. 노드 $$N$$에 대해 구간 합 Int($$N$$)은 $$N$$을 조상으로 가지는 두 자식 노드의 합이다.
- 노드는

## Construction

구간 집합 $$I$$로 이루어지는 세그먼트 트리를 구성하는 방법에 대해 알아보자.
우선, 구간의 `endpoint`는 정렬되어 있다.




><font size="6">Refernce</font>
- https://www.acmicpc.net/blog/view/9
- https://en.wikipedia.org/wiki/Segment_tree
