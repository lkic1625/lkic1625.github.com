+++
title = "topological sort"
date = "2020-10-17T13:00:00+09:00"
tags = ["DAG", "traveling", "search", "algorithm"]
+++

# Definition
$input$: $DAG(\text{Directed Acyclic Graph})$<br>
$output$: Node sequence $(v_1, v_2, ... , v_n)$ such that no edge $v_j \to v_i$ (j > i)

# Invariant
$DAG$에서 $indegree$가 0인 노드는 반드시 존재한다.

$Proof$:
$indegree$가 0인 노드가 하나도 없는 $DAG$를 가정하자. 모든 노드는 그러면 $indegree$가 1보다 크거나 같다.

어떤 노드 하나를 골라 $indegree$가 가리키는 부모 노드를 탐색할 때,
모든 노드들은 $indegree$가 0이상이기 때문에 반드시 부모 노드를 가지게 된다.

노드의 개수는 무한하지 않기 때문에 이 탐색은 순환하며 가정이 모순임을 나타낸다.

$\Box$ $DAG$에서 $indegree$가 0인 노드는 반드시 존재한다.

# algorithm
- find nodes indegree == 0
- insert q
- Iterate until all nodes are checked.

## 문제: 줄세우기
N명의 학생들을 키 순서대로 줄을 세우려고 한다. 각 학생의 키를 직접 재서 정렬하면 간단하겠지만, 마땅한 방법이 없어서 두 학생의 키를 비교하는 방법을 사용하기로 하였다. 그나마도 모든 학생들을 다 비교해 본 것이 아니고, 일부 학생들의 키만을 비교해 보았다.

일부 학생들의 키를 비교한 결과가 주어졌을 때, 줄을 세우는 프로그램을 작성하시오.


### 입력
첫째 줄에 N(1≤N≤32,000), M(1≤M≤100,000)이 주어진다. M은 키를 비교한 회수이다. 다음 M개의 줄에는 키를 비교한 두 학생의 번호 A, B가 주어진다. 이는 학생 A가 학생 B의 앞에 서야 한다는 의미이다.

학생들의 번호는 1번부터 N번이다.

### 출력
첫째 줄부터 앞에서부터 줄을 세운 결과를 출력한다. 답이 여러 가지인 경우에는 아무거나 출력한다.

### 정답 코드
```cpp
#include<iostream>
#include<vector>
#include<algorithm>
#include<queue>

using namespace std;

const int MAX = 32001;
int n, m, a, b, node[MAX];
queue<int> v[MAX];
queue<int> q;

int main() {

	cin >> n >> m;
	for (int i = 0; i < m; i++) {
		scanf("%d %d", &a, &b);
		node[b]++;
		v[a].push(b);
	}
	for (int i = 1; i <= n; i++) {
		if (!node[i]) q.push(i);
	}
	while (!q.empty()) {
		int root = q.front();
		q.pop();
		printf("%d ", root);
		while (!v[root].empty()) {
			int child = v[root].front();
			v[root].pop();
			node[child]--;
			if (!node[child]) {
				q.push(child);
			}
		}
	}
}
```

## References
- https://math.stackexchange.com/questions/3232341/prove-that-a-directed-graph-with-no-cycles-has-at-least-one-node-of-indegree-zer 