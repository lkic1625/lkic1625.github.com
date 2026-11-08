+++
title = "메모리 할당기: glibc, jemalloc, TCMalloc, Java, Go"
slug = "os-memory-allocation"
date = "2026-11-08T00:04:00+09:00"
draft = false
tags = ["os", "ostep", "memory", "allocator"]
+++

## Allocation 관련 정리
Allocator는 기본적으로, 4가지 정도 존재한다.
1. 얼마나 빨리 할당할 수 있는가,
	1. 매번 커널 진입이 아닌, 미리 확보한 메모리를 Free List 를 통해 활요하는 Fast Path를 이용
2. 얼마나 적은 메모리를 낭비하는가
	1. 단편화 문제를 어떻게 해결하는가, 실제 요청보다 더 큰 Block을 할당하거나, 여유 공간은 충분하지만 연속 공간을 효율적으로 반환하기 어려운 경우
3. 동시성 확보를 위한 방식
	1. 여러 스레드가 요청하는 경우의 contention 관리
4. 언제 메모리를 반환할 것인가.
	1. 실제 메모리가 다시 쓰일 확률이 높다면 이를 가지고 재사용하는 것이 합당하다
이 네 가지를 통해 실제 설계 철학들을 엿볼 수 있다. 또한, 현대의 메모리 할당기가 서로 배타적인 구현을 하는 것이 아니고, 각 방법에서 핵심 설계 관점을 다르게 보는 것이다.

| Allocator                  | 핵심 설계 관점                | 대표적인 기법                                        |
| -------------------------- | ----------------------- | ---------------------------------------------- |
| glibc malloc (ptmalloc 계열) | 범용성, 호환성                | Arena, Thread Cache                            |
| jemalloc                   | 단편화 관리, 메모리 사용량 제어      | Multiple Arenas, Decay, Purging                |
| TCMalloc                   | 높은 병렬성과 빠른 할당           | Per-CPU Cache, rseq, Hugepage-aware Allocation |
| mimalloc                   | 낮은 경합, Locality, 메모리 효율 | Free-list Sharding, Eager Purging              |
| snmalloc                   | Cross-thread Free의 확장성  | Message Passing                                |
| Scudo                      | Heap 메모리 안전성            | Metadata 검증, Quarantine, Randomization         |
### tcache, glibc

```
Thread 1 ── tcache ──┐
Thread 2 ── tcache ──┼── Arenas ── OS
Thread 3 ── tcache ──┘
```
객체를 할당하고 해제하는데 필요한 정보를 스레드 별로 두어, lock 집중을 막는 방식
### jemalloc
메모리가 해제된 후, OS 반환 시간을 Decay 방식으로 관리하여 유지하며 효율성을 확보 예를 들어 `dirty_decay_ms`를 줄이면 RSS 감소에 유리할 수 있지만, 같은 메모리를 다시 사용할 때 Page Fault나 물리 메모리 재확보 비용이 커질 수 있다.
### TCMalloc, per-CPU Cache
rseq 등을 이용해, per-CPU 자료구조를 가져가며 해당 스레드가 선점 혹은 마이그레이션 되는 경우에는 재시작 가능하도록 갱신 리스트를 관리하며, lock contention 을 최소화 함.
#### rseq, 커널의 스케줄링 정보를 활용한 Lock-free Fast Path
rseq 는 실제로, per-CPU 자료구조에 대한 가벼운 갱신을 위해 설계되었으며, 이를 이용해 실제 해당 CPU 자료구조에 값을 변경하다가, 선점 혹은 마이그레이션 등의 작업이 일어나면, 미완료 작업을 버리고 안전하게 재시도 하도록 하는 메커니즘. 이를 통해 lock contention 을 줄였음.
#### Hugepage-aware Allocation
Temeraire Hugepage-aware Allocator를 통해 할당되며, Huge Page 안에서 최대한 효율적으로 배치하려고 함. 이러한 방식을 하는 이유는, 기본적으로 raw pointer 로 되어있는 실제 메모리 접근에 대해서 관리하며 재배치하는 GC 유사한 기능 구현하기 어렵기에 할당부터 주요한 고민이 필요함.

#### Java, Go 의 할당기

Java와 Go도 **미리 확보한 Heap을 나누어 쓰고, 할당의 Fast Path를 실행 주체별로 분산해 경합을 줄인다.** 다만, 개발자가 `free()`를 호출하는 대신 GC가 도달 불가능한 객체를 찾아 공간을 회수한다. 따라서 할당 속도와 함께 GC 비용도 고려해야 한다.

아래는 Java의 HotSpot JVM과 Go의 표준 런타임을 기준으로 한 설명이다. 세부 경로는 버전과 GC 설정에 따라 달라진다.

##### Java: TLAB과 Bump-pointer Allocation
HotSpot은 TLAB(Thread-Local Allocation Buffer)을 통해 스레드가 사용할 Heap의 일부를 미리 확보한다. **TLAB은 스택이 아니라 공유 Heap 안의 할당용 구역**이다. 여기서 생성한 객체도 다른 스레드와 공유할 수 있다.

```text
Thread 1 ── TLAB 1 ──┐
Thread 2 ── TLAB 2 ──┼── JVM Heap ── OS
Thread 3 ── TLAB 3 ──┘

TLAB 내부
[이미 할당한 객체들 | 남은 공간              ]
                   ↑ top                  ↑ end
```

TLAB에 공간이 있으면 현재 `top`을 객체 주소로 사용하고, 객체 크기와 정렬을 반영한 만큼 `top`을 전진시킨다. 이를 **Bump-pointer Allocation**이라고 한다. 매번 Free List를 탐색하거나 공유 할당 포인터에 락을 걸 필요가 없다. 실제 객체 생성에는 메모리 초기화와 헤더 설정 등의 작업도 포함된다. [HotSpot TLAB 구현](https://github.com/openjdk/jdk/blob/master/src/hotspot/share/gc/shared/threadLocalAllocBuffer.inline.hpp)

공간이 부족하면 Slow Path에서 TLAB을 보충하거나 TLAB 밖에서 할당한다. 큰 객체 등은 TLAB을 우회할 수 있고, Heap 공간이 부족하면 GC가 필요할 수 있다. 즉, 모든 `new`가 항상 포인터 갱신만으로 끝나는 것은 아니다. [HotSpot 할당 경로](https://github.com/openjdk/jdk/blob/master/src/hotspot/share/gc/shared/memAllocator.cpp)

많은 객체가 짧게 살아남는다는 특성을 활용해, 세대별 GC는 새 객체가 모이는 영역을 자주 수집한다. 복사·압축을 사용하는 수집 단계에서는 살아 있는 객체를 옮겨 연속된 빈 공간을 만들 수 있다. 빠른 할당을 뒷받침하는 대신, 객체 이동과 참조 갱신 등의 비용을 GC가 부담한다. 구체적인 방식과 정지 시간은 선택한 GC에 따라 다르다. [HotSpot GC 설명](https://docs.oracle.com/en/java/javase/25/gctuning/garbage-collector-implementation.html)
##### Go: per-P mcache와 Size Class
Go의 Heap 할당기는 TCMalloc에서 출발했지만 독자적으로 발전했다. 작은 객체는 크기를 **Size Class**에 맞추고, 같은 크기의 슬롯으로 나눈 `mspan`에서 빈 슬롯을 선택한다. 일반적인 작은 객체의 경로는 다음과 같다. [Go 할당기 구현](https://go.dev/src/runtime/malloc.go)

```text
현재 P의 mcache
  └─ Size Class에 맞는 mspan의 빈 슬롯에서 할당
       └─ 슬롯 부족: mcentral에서 다른 mspan 확보
            └─ 필요하면 mheap에서 페이지 묶음 확보
                 └─ 필요하면 OS에서 메모리 추가 확보
```

`mcache`는 goroutine별이 아닌 **P별 캐시**다. P는 Go 코드를 실행하는 데 필요한 런타임의 실행 자원이며, 물리 CPU 코어와 고정된 일대일 관계가 아니다. 현재 P의 로컬 할당 경로에서는 락 없이 처리하고, 공유 계층에서 공간을 보충할 때 동기화 비용을 나누어 부담한다. 따라서 앞의 TCMalloc per-CPU Cache와 설계 목적은 비슷하지만 캐시의 소유 단위가 다르다. [Go mcache 구현](https://go.dev/src/runtime/mcache.go)

큰 객체는 작은 객체용 캐시 계층을 우회해 `mheap`에서 페이지 단위로 할당한다. GC의 Sweep은 죽은 객체의 슬롯을 재사용 가능하게 하고, 완전히 빈 span의 페이지는 `mheap`으로 돌려준다. 이 방식은 재사용에 유리하지만, 크기 등급으로 인한 내부 단편화와 일부 객체가 살아 있는 span의 공간 낭비가 생길 수 있다. [Go 할당·회수 경로](https://go.dev/src/runtime/malloc.go)

그 전에 **Heap 할당 자체를 피하는 최적화**도 중요하다. Go 컴파일러는 Escape Analysis 등을 통해 가능한 값을 goroutine의 스택에 배치한다. `new(T)`를 썼다는 이유만으로 반드시 Heap에 할당되는 것은 아니다. Heap 할당이 줄면 GC가 처리할 객체도 줄어든다. [Go GC 가이드](https://go.dev/doc/gc-guide#Where_Go_Values_Live)

Go도 Sweep 이후 별도의 Scavenging으로 미사용 페이지의 물리 메모리를 반환한다. 따라서 GC가 끝나도 RSS가 곧바로 같은 양만큼 줄어든다고 볼 수 없다. [Go Scavenger 구현](https://go.dev/src/runtime/mgcscavenge.go)
