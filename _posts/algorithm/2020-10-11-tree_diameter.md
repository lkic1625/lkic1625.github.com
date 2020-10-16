---
title: "tree diameter"
tags:
  - greedy
  - algorithm
categories:
  - algorithm
last_modified_at: 2020-10-11T13:00:00+17:00
toc: true
---
<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>

# 트리의 지름
## 문제
트리(tree)는 사이클이 없는 무방향 그래프이다. 트리에서는 어떤 두 노드를 선택해도 둘 사이에 경로가 항상 하나만 존재하게 된다. 트리에서 어떤 두 노드를 선택해서 양쪽으로 쫙 당길 때, 가장 길게 늘어나는 경우가 있을 것이다. 이럴 때 트리의 모든 노드들은 이 두 노드를 지름의 끝 점으로 하는 원 안에 들어가게 된다.

이런 두 노드 사이의 경로의 길이를 트리의 지름이라고 한다. 정확히 정의하자면 트리에 존재하는 모든 경로들 중에서 가장 긴 것의 길이를 말한다.

입력으로 루트가 있는 트리를 가중치가 있는 간선들로 줄 때, 트리의 지름을 구해서 출력하는 프로그램을 작성하시오. 아래와 같은 트리가 주어진다면 트리의 지름은 45가 된다.

## 입력

파일의 첫 번째 줄은 노드의 개수 n(1 ≤ n ≤ 10,000)이다. 둘째 줄부터 n-1개의 줄에 각 간선에 대한 정보가 들어온다. 간선에 대한 정보는 세 개의 정수로 이루어져 있다. 첫 번째 정수는 간선이 연결하는 두 노드 중 부모 노드의 번호를 나타내고, 두 번째 정수는 자식 노드를, 세 번째 정수는 간선의 가중치를 나타낸다. 간선에 대한 정보는 부모 노드의 번호가 작은 것이 먼저 입력되고, 부모 노드의 번호가 같으면 자식 노드의 번호가 작은 것이 먼저 입력된다. 루트 노드의 번호는 항상 1이라고 가정하며, 간선의 가중치는 100보다 크지 않은 양의 정수이다.

## 출력

첫째 줄에 트리의 지름을 출력한다.

## 증명

$$Claim:$$
루트에서 가장 멀리 떨어진 노드 $$A$$에 대해 $$A$$와 가장 멀리 떨어진 노드 $$B$$가 존재한다 하자.
경로 $$\overline {AB}$$는 트리의 지름이다.

$$\overline {RA}$$는 루트에서 $$A$$가지 경로이고 이는 루트에서 시작하는 가장 긴 경로이다.

![이미지1](/assets/images/diameter1.png)

이때, 정점 $$A,B$$ 는 항상 최소공통조상 $$L$$ 을 갖는다.
따라서, $$\overline {AB} = \overline {AL} + \overline {LB}$$ 이다.

![이미지3](/assets/images/diameter2.png)

$$\overline {AB}$$가 트리의 지름이 아니라 가정하면

$$ DP[S][E] = \begin{cases} true & \text{if }S = E \\ n[E] = n[S] & \text{if }E - S = 1 \\ n[E] = n[S] \ and \ DP[S + 1][E - 1] & \text{else } \end{cases} $$


###  Lowest Common Ancestor

![이미지2](/assets/images/lcaexample.png)

- `Common Ancestor(공통조상)`란 트리에서 정점 $$v,u$$에 대해 둘을 자손으로 가지는 노드를 의미한다.
- `Lowest Common Ancestor(최소공통조상)`란 공통 조상 중 루트에서 가장 멀리 떨어진 노드를 의미한다.

위 그림에서는 노드 '2'가 최소공통조상이다.
