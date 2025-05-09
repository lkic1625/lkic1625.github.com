+++
title = "네트워크 유량"
date = "2020-08-13T10:31:20+09:00"

#
# description is optional
#
# description = "An optional description for SEO. If not provided, an automatically created summary will be used."

tags = ["database",]
+++


## flow network란

그래프 이론에서 `flow network`란 각각의 `edge`가 `capacity`을 가지고 있고 `flow`를 전달하는 `Directed Graph`이다.

네트워크는 `graph`이며 $G = (V, E)$, $V$는 정점의 집합, $E$는 $V$의 간선의 집합으로써 $V$ x $V$의 `subset`이다.
이와 함께 $c: V$ x $V → ℝ∞$ 용량 함수 또한 정의된다.

[$WLOG$](https://en.wikipedia.org/wiki/Without_loss_of_generality)<br>
if $(u, v) ∈ E$ then $(v, u) ∈ E$<br>
if $(u, v) ∉ E$ then $c(v, u)$ = 0

서로 다른 노드 `source` $s$와 `sink` $t$가 구분될 경우 $(G, c, s, t)$ 를 `flow network`라 한다.
![이미지1](/assets/images/Network_Flow.svg.png)

## 유량 네트워크 성질

$Def$ of flow network
- $f(u, v)$: u, v로 흐르는 실제 유량이다.<br>
- $c(u, v)$: u, v로 흐를 수 있는 용량이다.<br>

$Thm$ of flow network
- (용량 제한 속성) $f(u, v) \leq c(u, v)$:
가장 자명한 속성으로, 각 간선의 유량은 해당 간선의 용량을 초과할 수 없다.
- (유량 대칭성)  $f(u, v) = -f(v, u)$:
$v$로 유량이 흘러올 경우 $v$의 입장에서는 음수의 유량을 보내는 것이라 생각하자.
- (유량 보존)  $\Sigma f(u,v) = 0$:
유량의 대칭성으로 의해 들어오는 유량과 나가는 유량을 합하면 결국 0이 되어야 한다.

## ford-fulkerson Algorithm

[`maximum flow problem`](https://en.wikipedia.org/wiki/Maximum_flow_problem)은 `flow netwrok`에서 얻을 수 있는 가장 큰 유량을 구하는 문제이다. 이를 해결하기 위해 가장 간단한 알고리즘인 `ford-fulkerson` 알고리즘에 대해 알아보자.
최초로 고안된 네트워크 유량 알고리즘으로 비교적 개념이 간단하다.

1. 유량 네트워크 간선의 유량을 모두 0으로 설정 후 소스에서 싱크로 더 보낼 수 있는 경로를 찾아 보내기를 반복한다.
유량을 보내는 경로를 증가 경로(`augmenting path`)라 한다.

2. 증가 경로이려면 흐르고 있는 유량을 제외하더라도 여유 용량이 존재해야 한다.
이를 잔여 용량(`residual capacity`)라 하며,<br><br>
$r: V$ x $V → ℝ∞$<br> $r(u, v) = c(u, v) - f(u, v)$<br><br>
로 정의하자. 흘려 보낼 수 있는 유량의 최대량은 포함된 간선의 잔여 용량 중 최소값으로 정의된다.

단순히 위 속성만으로는 알고리즘이 항상 최대 유량을 얻는다는 것은 의문점이 들 것이다. 여기서 `ford-fulkerson` 알고리즘의 핵심이 되는 아이디어는 유량의 대칭성을 이용한 접근법이다.

![이미지2](/assets/images/ford-fulkerson-example-01.png)

if $f(A, B) = 1$ then $f(B, A) = -1$ <br>
$\rightarrow r(B, A) = c(B, A) - f(B, A) = 0 + (-1) = 1$<br><br>
위 과정은 실제로 존재하지 않는 간선 $(B, A)$에 대해 용량의 1만큼의 유량을 더 보낼 수 있다는 의미이다. 특정 방향으로 보내는 유량을 줄이는 것은 그 반대쪽에서 유량을 보내주는 것과 같은 효과를 내기 때문이다. 따라서, 기존 유량을 상쇄하는 방향으로 증가 경로를 건설하고, 탐색 알고리즘을 진행한다면, 우리가 원하는 최대 유량을 찾을 수 있는 것이다.

## 정당성 증명

[포드 풀커슨 알고리즘 정당성 증명](/prooving-ford-fulkerson-correctenss)


## 구현 및 코드

```cpp
//source code for praticing ford-fulkerson Algorithm

#include<algorithm>
#include<queue>
#include<iostream>
#include<vector>
using namespace std;

const int MAX_V = 100;

int V;
int capacity[MAX_V + 1][MAX_V + 1], flow[MAX_V][MAX_V];

int FordFulkerson (int source, int sink) {
	memset(flow, 0, sizeof(flow));
	int totalFlow = 0;

	while (true) {
		vector<int> parent(MAX_V + 1, -1);
		queue<int> q;
		parent[source] = source;
		q.push(source);
		while (!q.empty()) {
			int here = q.front(); q.pop();
			for (int there = 0; there < V; there++) {
				if (capacity[here][there] - flow[here][there] > 0
					&& parent[there] == -1) {
					q.push(there);
					parent[there] = here;
				}
			}

		}
		if (parent[sink] == -1) break;
		int amount = 123123123;
		for (int p = sink; p != source; p = parent[p]) {
			amount = min(amount, capacity[parent[p]][p] - flow[parent[p]][p]);
		}
		for (int p = sink; p != source; p = parent[p]) {
			flow[parent[p]][p] += amount;
			flow[p][parent[p]] -= amount;
		}
		totalFlow += amount;
	}
	return totalFlow;
}
```

## 응용 및 문제

승부조작, https://www.algospot.com/judge/problem/read/MATCHFIX/, ALGOSPOT

예제 입력
```
3
2 2
3 3
0 1
0 1
3 3
4 2 2
1 2
1 2
1 2
4 4
5 3 3 2
0 1
1 2
2 3
1 3
```

예제 출력
```
5
-1
5
```

구현 코드
```cpp
/*
https://www.algospot.com/judge/problem/read/MATCHFIX\

networkFlow, bellmanFord Algorithm

input
입력의 첫 줄에는 테스트 케이스의 수 C (C <= 50) 가 주어집니다.
각 테스트 케이스의 첫 줄에는 결승 리그에 참가하는 선수의 수 N (2 <= N <= 12) 과 남아 있는 경기의 수 M (0 <= M <= 100) 이 주어집니다.
이 때 각 선수에게는 0부터 N-1 까지의 번호가 주어집니다.
그 다음 줄에는 N 개의 정수로 0번부터 N-1 번까지 순서대로 각 선수의 현재 승수가 주어집니다.
그 후 M 줄에는 각 경기를 치르는 두 선수의 번호가 주어집니다. 모든 선수의 현재 승수는 1000 이하입니다.

output
각 테스트 케이스마다 한 줄에 X가 리그를 단독 우승하기 위해 필요한 최소 승수를 출력합니다. 만약 이것이 불가능하다면 -1 을 출력합니다.

*/
#include<iostream>
#include<tuple>
#include<algorithm>
#include<string.h>
#include<queue>

using namespace std;

const int MAX_N = 12, MAX_M = 100, PLAYER_X = 0, SIZE = MAX_N + MAX_M, SOURCE = SIZE,  SINK = SIZE + 1;

int C, N, M, input, u, v;
int wins[MAX_N + 2], capacity[SIZE + 2][SIZE + 2], flow[SIZE + 2][SIZE + 2];
pair<int, int> match[MAX_M];

int FordFulkerson(int source, int sink) {
	//init flow edge
	memset(flow, 0, sizeof(flow));
	int totalFlow = 0;
	int totalFlow = 0;
	while (true) {
		vector<int> parent(SIZE + 2, -1);
		queue<int> q;
		parent[source] = source;
		q.push(source);
		while (!q.empty()) {
			int here = q.front(); q.pop();
			for (int there = 0; there < SIZE + 2; there++) {
				if (capacity[here][there] - flow[here][there] > 0
					&& parent[there] == -1) {//If there is a node that has not been visited and can flow, push to the queue.
					q.push(there);
					parent[there] = here;
				}
			}

		}
		if (parent[sink] == -1) break;
		int amount = MAX_N + 1;
		//finding the minimum amount of flow.
		for (int p = sink; p != source; p = parent[p]) {
			amount = min(amount, capacity[parent[p]][p] - flow[parent[p]][p]);
		}
		//flowing..
		for (int p = sink; p != source; p = parent[p]) {
			flow[parent[p]][p] += amount;
			flow[p][parent[p]] -= amount;
		}
		totalFlow += amount;
	}
	return totalFlow;

}


int isChampionshipable(int totalWins) {

	//If there is a Wins greater than totalWins, then return false;
	if (*max_element(wins  + 1, wins + N) >= totalWins) return false;
	//init capacity edge
	memset(capacity, 0, sizeof(capacity));
	//boundary of Indexing
	int boundary = MAX_N;

	for (int i = 0; i < M; i++) {
		int u = match[i].first;
		int v = match[i].second;
		capacity[SOURCE][boundary + i] = 1;
		capacity[boundary + i][u] = 1;
		capacity[boundary + i][v] = 1;
	}

	//If X is to win alone with a w win, the win or loss of the remaining games will be properly determined
	//and all other players must finish the league with less than w - 1 win.
	for (int node = 0; node < N; node++) {
		capacity[node][SINK] = max(totalWins - wins[node] - 1, 0);
	}
	capacity[PLAYER_X][SINK] = totalWins - wins[PLAYER_X];

	return FordFulkerson(SOURCE, SINK) == M && flow[PLAYER_X][SINK] == capacity[PLAYER_X][SINK];

}


int main() {
	//fast I/O
	ios_base::sync_with_stdio(false); cin.tie(NULL); cout.tie(NULL);

	//input
	cin >> C;
	while (C-- > 0) {
		int totalMatchCountOfX = 0;
		cin >> N >> M;
		for (int player = 0; player < N; player++) {
			cin >> input;
			wins[player] = input;
		}
		for (int game = 0; game < M; game++) {
			cin >> u >> v;
			match[game] = { u ,v };
			if (u == 0 || v == 0) {
				totalMatchCountOfX++;
			}
		}
		int flag = false, i = 0;
		for (; i <= totalMatchCountOfX; i++) {
			if (isChampionshipable(wins[PLAYER_X] + i)) {
				flag = true;
				break;
			}
		}
		if(flag)
			cout << i + wins[PLAYER_X] << "\n";
		else
			cout << -1 << "\n";

	}
	return 0;


}

```

## References
- 구종만 지음, 알고리즘 문제 해결 전략, 인사이트, 32장
- https://en.wikipedia.org/wiki/Flow_network
