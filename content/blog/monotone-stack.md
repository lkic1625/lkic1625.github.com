+++
title = "monotone stack"
date = "2021-03-07T13:00:00+09:00"
tags = ["stack", "algorithm"]
+++

# Inroduction

오늘 다뤄볼 알고리즘은 `monotone stack`이다 특정 PS 기법으로 사용되기에 예제와 함께 풀어보겠다.

# Monoton Stack

`Monotone Stack`은 이름처럼 단조 증가(감소) 스택을 만든다.

다만, 증가하는 스택의 규칙을 따르도록 구성하려면 `pop`, `push`가 필수적이다.
위 과정에서 저장해두었던 여러 정보를 통해 PS를 푸는 기법이다.

위 설명만 하자니 솔직히 나라도 못 알아 들을 것 같다. 애초에 기법 또한 특정 알고리즘이라기 보단 `sliding window`와 같은 방법론적인 부분이 크다 생각하여 예시가 꼭 필요해보인다. 보통은 알고리즘의 설명 이후 문제를 소개하곤 하지만, 이번엔 문제를 먼저 소개해보도록 하자.


## 빗물이 넘쳐흘러

[백준 17421 빗물이 넘쳐 흘러](https://www.acmicpc.net/problem/17421)

처음에는 [codeforces 448C Painting Fence](https://codeforces.com/contest/448/problem/C)의 분할정복 접근법과 유사한 문제로 생각했다.

해당 문제의 입력 개수가 적었다면 충분히 `분할 정복`으로 풀 수 있는 문제였으나 아쉽게도 테스트 케이스 수는 TLE를 일으킬 수 밖에 없어 새로운 알고리즘을 도입해야했다. 그것이 바로 모노톤 스택이다.


### 응용

해당 문제를 어떻게하면 모노톤 스택과 결을 맞춰 구현할 수 있을까?

간단하게 생각해보자. 우리가 직접 한 덩어리가 채워지는 걸 어떻게 확인하는가? 왼쪽에서부터 차례대로 블럭의 높이를 보며 갑자기 움푹 파이는 즉, 물이 고이는 순간(혹은 구조)? 확인할 것이다.

그렇게 되는 순간은? 높이가 단조 증가하다가 갑자기 감소하는 시점이다. 즉 해당 블럭을 `pivot`으로 생각하여 해당 웅덩이를 나눌 수 있다.

모노톤 스택의 구조랑 비슷하지 않은가? 계속 단조 증가하는 값을 저장하다 규칙이 깨지는 값이 들어오는 순간 규칙을 지키기 위해 블럭을 `pop`해야 한다.

그렇다. 우리는 단순히 규칙을 지키며 stack을 운영하며 `pivot`을 기점으로 특정 operation을 진행하면 되는 것이다.

다만, 이 문제에서 중요하게 짚어야할 점은 여러개의 웅덩이가 하나로 합쳐지는 시점이다. 이 때에는 주의깊게 operation을 지정하며 기존에 모아왔던 웅덩이를 전부 빼주어야 한다.

### 결국은..

모노톤 스택은 단순히 단조 증가 형태를 유지하며 운영하고 그 스택에 저장되는 값은 그간 스캔해왔던 누적 값을 저장해둔다.

빗물이 넘쳐 흘러는 모노톤 스택의 예를 확실하게 보여주는 예시라 생각한다. 아래 코드를 통해 더욱 확실히 이해할 수 있을 것이다.

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