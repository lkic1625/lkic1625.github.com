---
title: "Bipartite Matching"
tags:
  - network flow
  - algorithm
categories:
  - algorithm
last_modified_at: 2020-07-31T13:00:00+17:00
toc: true
---

# Bipartite Matching(이분 매칭)
### 1. Graph Mathcing
***
Graph의 Mathcing이란 단순 그래프가 주어졌을 때 끝점을 공유하지 않는 간선의 집합을 표현하는 방법이다.
아래 사진은 올바른 매칭이 진행되었을 때 결과이다.

![그래프 이미지](/assets/images/matching.png)

이 때 가장 큰 매칭을 찾아내는 문제를 최대 매칭 문제라고한다.
하지만 가장 General한 Mathcing 알고리즘은 꽤나 [복잡하여](https://en.wikipedia.org/wiki/Blossom_algorithm) 알고리즘 대회에서는 좀 더 단순한 형태로 등장하게 된다.

### 2. 이분매칭
***
이분 그래프란 정점을 두 그룹으로 나누어 모든 간선이 서로 다른 그룹의 정점들을 연결하도록 할 수 있는 그래프다.
이분 그래프는 집합의 대응 관


### Code
***
```cpp
#define MAX_N 1001
int n, m;
int visited[MAX_N];
int b[MAX_N];
vector<vector<int>> node;
int dfs(int here) {
    if (visited[here]) return 0;    //방문 된 정점은 매칭 불가
    visited[here] = 1;
    for (int i = 0; i<node[here].size(); i++) {
        int there = node[here][i];        
        if (!b[there] || dfs(b[there])) {    //매칭이 되어있지 않은 정점을 만나거나 이미 매칭된 정점이 다른 정점과 매칭이 가능할 때
            b[there] = here;        //매칭 시켜준 뒤 1을 리턴 해줌
            return 1;
        }
    }
    return 0;
}
int bmatch() {
    int ret = 0;
    for (int i = 1; i <= n; i++) {        //모든 정점에 대하여 매칭을 시도
        memset(visited, 0, sizeof(visited));
        if (dfs(i))ret++;
    }
    return ret;
}
```
