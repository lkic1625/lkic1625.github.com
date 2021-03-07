---
title: "monotone stack(작성 중)"
tags:
  - stack
  - algorithm
categories:
  - algorithm
last_modified_at: 2021-03-07T13:00:00+17:00
toc: true
---
<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>
# Inroduction

오늘 다뤄볼 알고리즘은 `monotone stack`이다 특정 PS 기법으로 사용되기에 예제와 함께 풀어보겠다.

내가 지금 듣고 있는 노래는 `민수 - 생일노래`다.

# Monoton Stack

`Monotone Stack`은 이름처럼 단조 증가(감소) 스택을 만든다.

다만, 증가하는 스택의 규칙을 따르도록 구성하려면 `pop`, `push`가 필수적이다.
위 과정에서 저장해두었던 여러 정보를 통해 PS를 푸는 기법이다.

위 설명만 하자니 솔직히 나라도 못 알아 들을 것 같다. 애초에 기법 또한 특정 알고리즘이라기 보단 `sliding window`와 같은 방법론적인 부분이 크다 생각하여 예시가 꼭 필요해보인다. 보통은 알고리즘의 설명 이후 문제를 소개하곤 하지만, 이번엔 문제를 먼저 소개해보도록 하자.


## 빗물이 넘쳐흘러

[백준 17421 빗물이 넘쳐 흘러](https://www.acmicpc.net/problem/17421)

해당 문제를 [codeforces 448C Painting Fence](https://codeforces.com/contest/448/problem/C)와 유사한 문제로 생각했다.

해당 문제의 입력 개수가 적었다면 충분히 `분할 정복`으로 풀 수 있는 문제였으나 아쉽게도 시간초과가 날 수 밖에 없어, 새로운 알고리즘을 도입해야했다. 그것이 바로 모노톤 스택이다.


### 응용

해당 문제를 어떻게하면 모노톤 스택과 결을 맞춰 구현할 수 있을까?

해당 문제부터 상당히 난감했다. 특히,


### 최종 코드

```cpp
#include<iostream>
#include<algorithm>
#include<stack>
#include<vector>

using namespace std;

const long long MAX_N = 100'000 + 5, MAX_HEIGHT = 1'000'000, TIME_BOUND = MAX_N * MAX_HEIGHT;

long long N, K, height[MAX_N], ans, k;

struct Segment {
    int left, right, height, segmented;
};

int main() {
    //FAST I/O
    ios::sync_with_stdio(0);
    cin.tie(0), cout.tie(0);
    cin >> N >> K;

    stack<Segment> st;

    for (int i = 0; i <= N; i++) {
        if (i != N) {
            cin >> height[i];
        }

        int left = i;
        int segmented = 0;
        bool isFirst = true;

        while (!st.empty() && st.top().height >= height[i]) {
            left = st.top().left;

            long long diff = st.top().height - height[i];
            if (diff > 0) {
                if (isFirst) {
                    isFirst = false;
                    k++;
                    segmented++;
                }
                k -= st.top().segmented;
            }
            else {
                segmented += st.top().segmented;
            }

            if (k == K) {
                cout << ans << endl;
                return 0;
            }
            ans += diff * (st.top().right - st.top().left + 1);
            st.pop();
        }

        st.push({ left, i, height[i], segmented });
    }
    cout << -1;

}
```
