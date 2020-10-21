---
title: "dynamic programming"
tags:
  - dp
  - algorithm
categories:
  - algorithm
last_modified_at: 2020-10-17T13:00:00+17:00
toc: true
---
<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>

# knapsack problem

## 문제 정의

도둑이 보석가게에 배낭을 메고 침입했다.
배낭의 최대 용량은 W이며, 이를 초과해서 보석을 담으면 배낭이 찢어질 것이다.
각 보석들의 무게와 가격은 알고 있다.
배낭이 찢어지지 않는 선에서 가격 합이 최대가 되도록 보석을 담는 방법은?

$$input$$: $$W$$, $$(w_1,v_1), (w_2,v_2) ... ,(w_n,v_n)$$ <br>
$$output$$: the maximum value V less than or equal to W

## 점화식

$$
DP[i][w] =  \begin{cases} DP[i - 1][w]  & \text{if }w_i > w \\ max(v_i + DP[i-1][w-w_i], DP[i-1][w])   & else \end{cases}
$$

# Fibonacci

## 점화식
$$F_n =  \begin{cases} 0  & \text{if }n = 0 \\ 1   & \text{if }n = 1 \\ F_{n-1} + F_{n-2}   & \text{if }n > 1 \end{cases}$$

# 팰린드롬?

## 문제 정의
명우는 홍준이와 함께 팰린드롬 놀이를 해보려고 한다.

먼저, 홍준이는 자연수 N개를 칠판에 적는다. 그 다음, 명우에게 질문을 총 M번 한다.

각 질문은 두 정수 S와 E(1 ≤ S ≤ E ≤ N)로 나타낼 수 있으며, S번째 수부터 E번째 까지 수가 팰린드롬을 이루는지를 물어보며, 명우는 각 질문에 대해 팰린드롬이다 또는 아니다를 말해야 한다.

https://www.acmicpc.net/problem/10942

## 점화식

![이미지1](/assets/images/pdrom.png)

## 코드

```cpp
#include<iostream>

using namespace std;

int dp[2001][2001], N, S, E, M, n[2001];

int main() {
	//FAST IO
	ios_base::sync_with_stdio(false);
	cin.tie(NULL);
	cout.tie(NULL);
	cin >> N;
	for (int i = 0; i < N; i++) {
		cin >> n[i];
	}

	//dp
	//It should be noted here that the order in which DP matrices are filled is diagonal,
  	//which creates a lower triangulation matrix.

	for (int diff = 0; diff < N; diff++) {
		for (int s = 0, e = s + diff; s < N; s++, e++) {
			if (s == e) {
				dp[s][e] = true;
			}
			else if (e - s == 1) {
				dp[s][e] = (n[e] == n[s]);
			}
			else {
				dp[s][e] = (n[e] == n[s] && dp[s + 1][e - 1]);
			}
		}
	}
	cin >> M;
	for (int i = 0; i < M; i++) {
		cin >> S >> E;
		cout << dp[S - 1][E - 1] << '\n';
	}
}
```
