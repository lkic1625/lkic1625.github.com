+++
title = "SIMD와 Vectorized Execution"
slug = "simd-vectorized-execution"
date = "2026-09-18T13:41:12+09:00"
draft = false
tags = ["cs", "cpu", "simd", "database"]
+++

## Introduction
SIMD란 **Single Instruction, Multiple Data**의 줄임말이다. 하나의 연산을 동시에 작업하는 방식이다. 이러한 연산 방식은 현재 데이터베이스 시스템에서도 매우 유용하게 사용될 수 있다. 이에 대해서 알아보자.

## SIMD
SIMD 연산은 아주 기본적인 출발점부터 시작한다. 예를 들어 간단한 스칼라 연산을 여러번 반복하는 loop가 있다면 해당 loop는 당연하게도 해당 데이터를 가져오고, 비교하는 연산을 수행한다. 하지만 만약, AVX2의 256-bit register에 `int32`를 넣을 시에는 8개의 데이터를 동시에 연산할 수 있을 것이다. 이것이 SIMD 연산의 개괄이다. 물론, 실제로는 8배로 빨라지진 않는다. 데이터를 DRAM에서 가져오고 처리하는 데에 드는 추가적인 병목이 있기 때문이다.
```
vector register

[120][30][500][90][130][77][220][10]
                    |
                    | compare > 100
                    v

[ T ][ F ][ T ][ F ][ T ][ F ][ T ][ F ]
```
하지만, 이러한 병렬 연산은 충분히 성능 개선의 효과가 있고, 특히 데이터베이스 시스템과 같이 쿼리 내에서도 스칼라 연산을 자주하는 시스템이라면 더욱 그럴 것이다.
### Branch misprediction
여기에 추가로 성능 개선의 포인트는 branch prediction 시에 작업이다. 실제 현대의 CPU는 하나의 연산을 하면서 남는 시간에 다음 작업을 준비하는 형태로 동작한다. 만약 if 분기문으로 인해 하위 함수를 실행하는 연산이 있다면 미리 해당 함수를 로드에서 작업을 준비할 수 있을 것이다.
다만, 이러한 성능 개선 트릭의 문제점은 만약 해당 분기문을 통과하지 못할 경우, 기존에 준비했던 것이 오히려 병목 현상을 가져온다는 점이다.
```
for (int i = 0; i < 8; i++) {
    if (price[i] > 100) {
        count++; // 연산 준비를 미리 해둠
    }
}
```
하지만, SIMD를 이용할 경우, 병렬 연산을 통해 branchless execution 이라는 형태로 우회할 수 있다.
```
Scalar + branch

20  → branch
150 → branch
70  → branch
300 → branch
130 → branch
10  → branch
800 → branch
90  → branch

branch predictor가 결과를 계속 추측해야 함

SIMD

[20 150 70 300 130 10 800 90]
                │
          vector compare
                │
                ▼
       [0 1 0 1 1 0 1 0]
                │
             count = 4

per-row branch가 없음
```
## Practical Examples 1. Vectorized Execution
### Columnar Storage
이를 이해하기 위해서 가볍게 열기반 저장소에 대해서 설명해보자. 열기반 저장소는 기본적으로 현대의 시스템들이 매우 많은 column을 가지더라도 실제 쿼리에서는 4~5개의 데이터만을 쿼리하는데에 그친다는 사실에서 시작한다. [\[1\]](#ref-1)
그렇기에 OLAP와 같은 시스템에서는 이러한 열기반 저장소가 최근에 더욱 채택되고 있다.
### Vectorized Execution
VE는 물론 SIMD라고 볼 수는 없지만, SIMD의 이점을 최대한으로 가져갈 수 있는 방법이다. 실제로도 데이터베이스 개발자들은 SIMD를 명시적으로 쓰지 않고, 단순히 이러한 이점을 가져갈 수 있는 구조에서 최대한 tight loop 코드를 c++로 작성하면서 complier가 분석하기 쉬운 코드로 SIMD의 이점을 더욱 끌어낸다고 한다. [\[2\]](#ref-2)

VE 모델은 단순히 여러 데이터를 batch 로 가져와서 연산하는 작업이고 이를 통해 SIMD의 이점을 살릴 수 있다. 또한 그것 외에도 아래와 같은 부분에서 큰 이점을 볼 수 있다.
1. function call 감소
2. virtual dispatch 감소
3. cache locality 향상
4. branch 감소

## References

<a id="ref-1"></a>
[1] M. Stonebraker, “The Traditional RDBMS Wisdom is All Wrong,” *High Performance Transaction Systems Workshop, presentation slides*. [Online]. Available: <https://hpts.ws/papers/2013/allwrong.pdf>. Accessed: Nov. 9, 2026.

<a id="ref-2"></a>
[2] DuckDB Contributors, “Frequently Asked Questions,” *DuckDB*. [Online]. Available: <https://duckdb.org/faq>. Accessed: Nov. 9, 2026.
