---
title: "shortest path"
tags:
  - greedy
  - algorithm
categories:
  - algorithm
last_modified_at: 2020-10-17T13:00:00+17:00
toc: true
---
<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>

# definition

$$input$$: $$G=(V,E,g), v_0 \in V$$<br>
$$output$$: shortest path $$v_0$$ to $$v_i$$ $$(v_i \in V)$$

# 다익스트라 알고리즘
다익스트라 알고리즘은 `Invariant`를 중심으로 진행된다. 이는 아래와 같다

1. : $$\forall{u} \in T, d_{min}(u) = \text{shortest path}$$
2. $$\forall{u} \notin T, \text{shortest path} v_0 \to T_0 \to u is \text{shortest path then insert u to T} (T_0 \in T)$$

## 정확성 증명

Proof of Dijkstra's algorithm is constructed by induction on the number of visited nodes.

Invariant hypothesis: For each node v, dist[v] is the shortest distance from source to v when traveling via visited nodes only, or infinity if no such path exists. (Note: we do not assume dist[v] is the actual shortest distance for unvisited nodes.)

The base case is when there is just one visited node, namely the initial node source, in which case the hypothesis is trivial.

Otherwise, assume the hypothesis for n-1 visited nodes. In which case, we choose an edge vu where u has the least dist[u] of any unvisited nodes and the edge vu is such that dist[u] = dist[v] + length[v,u]. dist[u] is considered to be the shortest distance from source to u because if there were a shorter path, and if w was the first unvisited node on that path then by the original hypothesis dist[w] > dist[u] which creates a contradiction. Similarly if there were a shorter path to u without using unvisited nodes, and if the last but one node on that path were w, then we would have had dist[u] = dist[w] + length[w,u], also a contradiction.

After processing u it will still be true that for each unvisited node w, dist[w] will be the shortest distance from source to w using visited nodes only, because if there were a shorter path that doesn't go by u we would have found it previously, and if there were a shorter path using u we would have updated it when processing u.

After all nodes are visited, the shortest path from source to any node v consists only of visited nodes, therefore dist[v] is the shortest distance.

## pseudo code
```
function Dijkstra(Graph, source):
      dist[source] ← 0                           // Initialization

      create vertex priority queue Q

      for each vertex v in Graph:          
          if v ≠ source
              dist[v] ← INFINITY                 // Unknown distance from source to v
              prev[v] ← UNDEFINED                // Predecessor of v

         Q.add_with_priority(v, dist[v])


     while Q is not empty:                      // The main loop
         u ← Q.extract_min()                    // Remove and return best vertex
         for each neighbor v of u:              // only v that are still in Q
             alt ← dist[u] + length(u, v)
             if alt < dist[v]
                 dist[v] ← alt
                 prev[v] ← u
                 Q.decrease_priority(v, alt)

     return dist, prev
```

## 생각해볼 문제.

주어진 그래프 $$G$$의 한 노드인 $$v_0$$에서 어떤 노드 $$v_i$$로 가는 $$\text{Shortest Path}$$를 구하였다고 가정하자.
이 $$Path$$의 일부분인 $$p$$가 $$v_j$$에서 시작하여 $$v_k$$에서 끝난다면, $$p$$는 $$v_j$$와 $$v_k$$를 잇는 $$\text{Shortest Path}$$임을 증명하라.
또한 $$p$$의 시작과 끝이 아닌 중간 노드들 중에는 $$v_0$$나 $$v_k$$가 없음을 증명하라.
><font size="6">Refernce</font>
- https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Proof_of_correctness
