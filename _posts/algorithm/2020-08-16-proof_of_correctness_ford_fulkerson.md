---
title: "ford-fulkerson 정당성 증명*(작성 중)"
tags:
  - network flow
  - algorithm
categories:
  - algorithm
last_modified_at: 2020-08-13T13:00:00+17:00
toc: true
---
<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>
# proof of correctness

### cut 이란.
***
`Min-cut` 문제를 이용하여 증명을 하기 때문에 먼저 `Min-cut`에 대해 알아보자

그래프 이론에서 `cut`이란 그래프의 정점을 두 개의 서로소 부분집합으로 분할 하는 것을 말한다. 어떤 컷이든 하나의 끝점이 있는 간선의 집합 `cut-set`을 결정한다.

`flow netwrok`에서는  `s-t cut`이라하며, 소스와 싱크를 다른 부분집합에 속하게 한다. 이 때 `cut-set`은 반드시 소스에서 싱크로가는 간선만을 포함한다. `The capacity of an s–t cut`은  `cut-set`의 포함되는 간선의 용량의 총합이다.

![이미지1](/assets/images/s-t-cut-example-01.png)

위 그림에서 s-t 컷의 용량은 $$12 + 7 + 4 = 33$$이다.

$$Thm$$ of cut in flow network
1. 컷의 유량은 소스에서 싱크로 가는 총 유량과 같다.
네트워크의 모든 유량은 $$S$$에 포함된 소스에서 흘러나와 $$T$$에 포함된 싱크로 흘러들어가기 때문이다.
2. 컷의 유량은 용량과 같거나 더 작다. 이는 용량 제한 속성 때문이다.<br>
- (용량 제한 속성) $$f(u, v) \leq c(u, v)$$:

### 정당성 증명
***
네트워크에서 용량이 가장 작은 컷을 찾아내는 문제를 최소 컷(min cut) 문제라고 한다.

최소 컷 문제는 최대 유량 문제와 밀접하게 연관되어 있다.<br>
용량과 유량이 같은 컷 $$S, T$$가 존재한다 하자





><font size="6">Refernce</font><br>
구종만 지음, 알고리즘 문제 해결 전략, 인사이트, 32장
https://en.wikipedia.org/wiki/Cut_(graph_theory)
