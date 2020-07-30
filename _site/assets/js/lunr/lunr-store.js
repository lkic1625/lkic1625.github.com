var store = [{
        "title": "Bipartite Matching",
        "excerpt":"이분매칭 #define MAX_N 1001 int n, m; int visited[MAX_N]; int b[MAX_N]; vector&lt;vector&lt;int&gt;&gt; node; int dfs(int here) { if (visited[here]) return 0; //방문 된 정점은 매칭 불가 visited[here] = 1; for (int i = 0; i&lt;node[here].size(); i++) { int there = node[here][i]; if (!b[there] || dfs(b[there])) { //매칭이 되어있지 않은 정점을...","categories": ["algorithm"],
        "tags": ["network flow","algorithm"],
        "url": "http://localhost:4000/%EC%9D%B4%EB%B6%84-%EB%A7%A4%EC%B9%AD/",
        "teaser": null
      }]
