---
title: "covex hull"
tags:
  - divide and conquer
  - algorithm
categories:
  - algorithm
last_modified_at: 2020-10-09T13:00:00+17:00
toc: true
---
<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>

# Graham Scan

## pseudo code
```
sort by y-order; //$$p_1, p_2, ..., p_n$$
stack.push($$p_1, p_2$$);
for i = 3 to $$n$$ do
  while next $$\angle next, top, $$p_i$$ != CCW
    stack.pop()
  stack.push($$p_i$$)
return stack
```

## Analysis of Graham Scan
1. Invariant $$<p_1, ... ,stack.top()>$$ is convex
2. 기울기 공식:
$$D = det\begin{vmatrix} 1 & p_x & p_y \\ 1 & q_x & q_y \\ 1 & r_x & r_y \end{vmatrix}$$
- if $$D > 0$$ then $$\angle p, q, r$$ is CCW
- else if $$D < 0$$ $$\angle p, q, r$$ is CW
- else then $$\angle p, q, r$$ is straight
- $$D = p \cdot (q \times r)$$ 이다.
3. 정렬 이후 $$O(n)$$번의 스캔이 일어나며 반복 수행마다 $$logn$$의 시간 소요
- time complexity: $$O(nlogn)$$

#Divide and Conquer


><font size="6">Refernce</font>
- https://sites.cs.ucsb.edu/~suri/cs235/ConvexHull.pdf
