+++
title = "Cache Affinity와 Seastar"
slug = "cache-affinity"
date = "2026-09-18T13:40:59+09:00"
draft = false
tags = ["cs", "cpu", "cache", "seastar"]
+++

## Intro
Cache Affinity란, 기본적으로 스케쥴링 영역에 해당하는 동작성이다. 이에 대한 정리를 practical 한 예시와 함께 정리해본다.
## Cache Affinity
CPU는 대략적으로 L1, L2, L3, DRAM으로 이루어지며 각 레벨에서의 연산은 기본적으로 단계를 넘어갈수록 매우커진다. 특히, DRAM에 있는 값을 가져오는 연산은 수백배 차이날 수 있다. 그렇기에 이러한 하드웨어 동작에서 중요한 것은 CPU cache에 실제로 해당 값이 있는지를 기반으로 동작의 판가름이 난다. 대략적인 지연시간(latency)는 아래와 같다.

```text
Register       ~ 1 cycle
L1             ~ 4 cycles
L2             ~ 10~20 cycles
L3             ~ 수십 cycles
DRAM           ~ 수백 cycles
```

기본적으로 이러한 캐시 친화성은 CPU 스케쥴링의 영역지만, 더 나아가 현대의 소프트웨어 설계 기법에서도 볼 수 있다.
## How CPU Cache works
CPU는 앞서 설명했듯이 특정 연산을 하기위해서 DRAM 혹은 CPU Cache 내에 값을 가져오는 연산을 진행한다. 연산 중에 가장 빠르게 처리가능한 것은 역시 Cache 내에 값이 있는 경우이다. 다만, 이러한 값을 바꾸기에 앞서 Cache 내에 저장하는 데이터는 단순히 값만 저장하는 게 아님을 알아야한다.

```
L1 Cache

Tag       State      Data
--------------------------------------
0x1000    Shared     [64 bytes ...]
0x2080    Modified   [64 bytes ...]
0x30C0    Exclusive  [64 bytes ...]
```
### Cache Coherence
각 코어들은 공유되는 데이터에 대해서 수정하는 경우 Exclusive Ownership을 가져야만 실제 값을 수정할 수 있다. 또한, 이러한 작업을 하면서 다른 코어에 L1, L2에 있는 값을 Invalidation 시키는 동작성을 포함해야한다. Cache Line의 복사 값의 상태를 변경하고 관리하는 것을  **Cache Coherence Protocol**라고 한다. 대략 아래와 같은 프로세스이다.
#### Snooping
```text
"이 cache line 가지고 있어?"
"이 line invalid로 바꿔."
```
#### Directory
```text
Line X

Sharers:
Core 0 = yes
Core 1 = yes
Core 2 = no

Owner = none
```

### Cache Line bouncing
Cache Line Bouncing 은 Sharing 중인 캐시 라인의 값의 ownership을 서로 다른 Core에서 요청하며 각자의 Private Cache를 Invalidation 하는 순간부터 시작된다.
각 Core가 에 존재하는 값을 지속해서 onwership 을 바꿔가면서 생기는 병목 현상이다.
```
private L1 cache
    ↓
line invalidated

ownership request
    ↓
interconnect

other core cache
    ↓
snoop / transfer / ACK

new ownership
    ↓
private L1 usable again
```
### False Sharing
False Sharing은 기본적으로 64byte 의 캐시라인에서 서로 다른 코어가 서로 다른 값을 변경하지만, 같은 라인 내에 있어 생기는 문제이다.
각 코어는 서로 다른 값을 가지고 ownership을 요청하지만, 실제 같은 캐시 라인에 있는 값을 요청하기에 생기는 문제로 기본적으로는 CachePad 를 쓰는 식으로 우회할 수 있다.
```text
64-byte cache line

┌───────────────────────────────┐
│ a | b | ....................  │
└───────────────────────────────┘
  ▲   ▲
Core0 Core1
```

## Practical Examples 1: ScyllaDB의 Seastar
Seastar는 ScyllaDB가 사용하는 C++ 비동기 서버 프레임워크이다. 핵심은 **데이터를 담당하는 shard에서 그 데이터를 처리하고, 다른 shard의 작업이 필요하면 메시지로 요청하는 것**이다. 이를 통해 여러 코어가 같은 가변 데이터와 lock을 반복해서 건드리는 비용을 줄인다.

### Shard-per-core와 Shared Nothing
일반적인 구성에서는 애플리케이션에 할당한 논리 CPU마다 하나의 reactor thread를 두고, 각 thread를 해당 CPU에 고정한다. 이 실행 단위를 **shard**라고 부른다. Shard는 별도 프로세스가 아니라 같은 프로세스 안의 실행 단위이며, Seastar의 shard와 클러스터의 데이터 분할은 구분해야 한다.

각 shard는 자신이 담당하는 서비스 객체와 가변 데이터를 주로 자기 thread에서 접근한다. CPU 고정은 thread 이동으로 인한 캐시 locality 손실을 줄이고, 데이터 소유권 분리는 여러 코어의 동시 쓰기로 생기는 lock 경합과 cache line bouncing을 줄인다. Seastar의 `reactor.cc`에는 thread affinity 설정과 CPU에 thread를 고정하는 코드가 있다. [구현: reactor.cc](https://github.com/scylladb/seastar/blob/master/src/core/reactor.cc)

**Shared Nothing은 하드웨어적으로 메모리를 공유하지 않는다는 뜻은 아니다.** 같은 주소 공간을 사용하며, shard 간 메시지 큐도 메모리를 통해 통신한다. 따라서 cache coherence는 여전히 필요하다. 핵심은 애플리케이션의 가변 상태를 여러 shard가 직접 수정하는 패턴을 피하는 것이다. [설계: Shard-per-core](https://www.scylladb.com/product/technology/shard-per-core-architecture/)

```text
논리 CPU 0                         논리 CPU 1
┌─────────────────────┐           ┌─────────────────────┐
│ Shard 0             │           │ Shard 1             │
│ Reactor thread      │           │ Reactor thread      │
│                     │           │                     │
│ 실행 가능한 tasks   │           │ 실행 가능한 tasks   │
│ 로컬 서비스 / 데이터│           │ 로컬 서비스 / 데이터│
│ I/O, timer 처리     │           │ I/O, timer 처리     │
└──────────┬──────────┘           └──────────┬──────────┘
           │       shard 간 메시지          │
           └─────────── ⇄ ─────────────────┘

각 shard의 데이터 접근은 해당 CPU의 캐시 계층을 이용한다.
데이터 전체가 L1/L2에 상주한다는 뜻은 아니다.
```

### 주요 컴포넌트

| 컴포넌트 | 역할 | 동작 예시 |
|---|---|---|
| Shard | 실행과 데이터 소유권을 나누는 단위 | Shard 1의 서비스 객체는 주로 shard 1에서 접근 |
| Reactor | shard의 event loop | task 실행, I/O 완료, timer 만료, 다른 shard의 메시지 처리 |
| Task / Continuation | 지금 실행할 수 있는 작은 작업 | 읽기 완료 후 결과를 가공하는 함수 |
| Future / Promise | 비동기 작업의 결과와 완료 상태 표현 | I/O가 끝나면 결과 또는 예외를 전달 |
| `sharded<T>` | shard마다 별도 서비스 객체 생성·관리 | 각 shard에 로컬 캐시나 서비스 인스턴스 생성 |
| `smp::submit_to()` | 지정한 shard에서 함수 실행 | 다른 shard의 데이터 처리를 요청하고 future로 결과 수신 |
| I/O backend | Linux의 I/O 기능과 reactor 연결 | readiness 또는 completion을 감지하여 대기 작업 재개 |
| Shard-local allocator | shard 중심의 메모리 할당 관리 | 할당용 메타데이터와 pool을 로컬에서 관리 |
| Scheduling group / I/O queue | CPU 시간과 I/O 처리량 배분 | 사용자 요청과 background 작업의 자원 경합 조절 |

Future는 새로운 OS thread를 만드는 기능이 아니다. 한 reactor thread가 여러 요청의 실행 가능한 부분을 번갈아 처리하고, I/O를 기다리는 동안 다른 작업을 실행한다. `sharded<T>`도 하나의 객체를 여러 코어가 공동 수정하게 만드는 것이 아니라, **각 shard에 별도 객체를 둔다.** [Seastar 공식 튜토리얼](https://docs.seastar.io/master/tutorial.html)

Seastar allocator는 메모리 할당 상태를 thread-local하게 관리한다. 다만 shard-local 데이터도 결국 DRAM에 있으며, 물리적 NUMA 배치와 캐시 hit 여부는 별도로 고려해야 한다. [ScyllaDB allocator 설명](https://github.com/scylladb/scylladb/blob/master/docs/dev/debugging.md#the-seastar-memory-allocator)

### Reactor는 실제로 어떻게 동작하는가?
Reactor는 실행 가능한 task를 처리하는 일과 외부 이벤트를 확인하는 일을 반복한다. 실제 구현은 SMP 메시지, 커널 I/O 완료, I/O 제출, timer 등을 처리하는 poller들을 등록하고 task scheduler와 함께 실행한다. 다음은 그 역할을 단순화한 흐름이며, 정확한 내부 실행 순서를 나열한 것은 아니다.

```text
Reactor loop
  │
  ├─ 실행 가능한 task / continuation 처리
  ├─ 다른 shard에서 온 요청과 응답 확인
  ├─ I/O queue의 요청을 backend에 제출
  ├─ 네트워크 이벤트와 디스크 I/O 완료 확인
  ├─ 만료된 timer 처리
  └─ 완료된 작업에 연결된 후속 코드를 실행 가능하게 함
       ↺ 반복
```

예를 들어 요청 A가 디스크 읽기를 시작하면, 완료를 기다리며 reactor thread를 막아 두지 않는다. A의 후속 처리를 future에 연결하고 요청 B나 C를 처리한다. 읽기가 완료되면 A의 후속 처리를 이어 간다. 이미 결과가 준비된 future라면 불필요한 대기 없이 진행할 수도 있다.

Task 처리는 협력적이다. 긴 계산은 적절히 나누고 실행권을 양보해야 한다. 동기식 blocking 호출이나 양보 없는 긴 loop가 reactor를 점유하면 같은 shard의 다른 요청과 timer도 지연된다. Scheduling group은 작업별 CPU 배분을 조절하지만, 임의의 긴 함수 실행을 Linux처럼 강제 선점하는 수단으로 이해하면 안 된다. Reactor는 일이 없을 때 설정과 backend에 따라 대기 상태에 들어갈 수 있어 항상 busy polling하는 것도 아니다. [Reactor loop 구현](https://github.com/scylladb/seastar/blob/master/src/core/reactor.cc), [Scheduling group 설명](https://docs.seastar.io/master/tutorial.html#scheduling-groups-cpu-scheduler)

### 다른 shard의 데이터가 필요할 때
Shard 0이 shard 1의 데이터가 필요하다고 해서 shard 1의 객체를 직접 수정하지 않는다. Shard 1에 처리할 함수를 보내고 결과를 future로 받는 방식으로 구성한다.

```text
Shard 0                                  Shard 1
  │                                         │
  ├─ “key K를 조회해 달라.” ────────────────→│
  │  future를 받고 다른 task 처리            ├─ 로컬 서비스에서 K 조회
  │                                         ├─ 필요하면 비동기 I/O
  │←────────────── 결과 또는 예외 ───────────┤
  └─ 결과를 기다리던 후속 처리 재개          │
```

`seastar::smp::submit_to(target, func)`는 대상이 다른 shard이면 메시지 큐로 작업을 제출한다. `sharded<T>::invoke_on(target, func)`는 이를 이용해 대상 shard의 로컬 서비스 객체에서 함수를 실행한다. 원격 shard란 이 문맥에서는 같은 프로세스 안의 다른 shard이며, 다른 서버로 보내는 네트워크 RPC가 아니다. [구현: smp.hh](https://github.com/scylladb/seastar/blob/master/include/seastar/core/smp.hh), [구현: sharded.hh](https://github.com/scylladb/seastar/blob/master/include/seastar/core/sharded.hh)

메시지 전달에도 큐 접근, 캐시 라인 이동, 대기 비용이 있다. 따라서 작은 작업마다 코어를 왕복하는 것보다는 데이터 소유 shard에서 관련 작업을 모아 처리하는 편이 locality에 유리하다. 메시지로 전달한 함수가 다른 shard 소유 객체를 참조하도록 만들면 소유권 규칙을 깨뜨릴 수 있으므로, 전달할 값과 객체 수명도 관리해야 한다.

### ScyllaDB의 읽기 요청에 적용하면
다음은 한 노드 내부에서 데이터 소유 shard가 읽기를 수행하는 과정을 단순화한 예시이다. 실제 CQL 요청은 coordinator와 replica 간 통신 등 추가 단계를 포함할 수 있다.

1. **요청 수신**: 네트워크 이벤트에 따라 해당 연결의 처리 코드가 실행된다.
2. **처리할 shard 결정**: 요청 대상 데이터의 소유권 정보를 이용한다. 데이터가 다른 shard에 속하면 해당 shard로 처리를 전달한다.
3. **메모리에서 조회**: 소유 shard에서 memtable이나 row cache 등 필요한 메모리 구조를 확인한다.
4. **필요하면 저장 장치 접근**: 메모리만으로 해결되지 않는 부분은 SSTable에서 비동기적으로 읽는다. 기다리는 동안 reactor는 다른 task를 처리한다.
5. **결과 처리와 응답**: 읽기가 완료되면 후속 처리가 실행되고 결과를 합쳐 응답한다. 다른 shard에서 요청했다면 결과를 그 shard로 돌려준다.

여기서 **row cache는 ScyllaDB가 DRAM에 관리하는 소프트웨어 캐시**이며, 앞에서 설명한 CPU의 L1/L2/L3 cache와 다르다. Shard-local하게 row cache를 접근하는 것이 CPU cache locality에도 도움이 되는 관계이다. [ScyllaDB read path 설명](https://www.scylladb.com/product/technology/)

Shard-aware driver는 가능한 경우 적절한 노드와 shard의 연결을 선택해 불필요한 shard 간 전달을 줄인다. 다만 데이터 소유 shard를 항상 고정된 `hash(key) % 코어 수`로 결정한다고 가정하면 안 된다. Tablets를 사용하는 구성에서는 tablet의 replica 및 shard 배치 정보도 라우팅에 관계한다. [Shard-aware driver 설명](https://python-driver.docs.scylladb.com/stable/scylla-specific.html), [Tablet-aware routing 설명](https://rust-driver.docs.scylladb.com/stable/load-balancing/tablets.html)

### Linux와 I/O backend의 관계
Seastar는 사용자 공간의 실행·동시성 모델을 제공한다. Linux는 OS thread 스케줄링, 시스템 호출, 장치 I/O 등을 담당한다. **Reactor의 task 전환과 Linux의 OS thread 전환은 서로 다른 층의 동작**이다.

`io_uring`은 Seastar의 필수 구성요소가 아니라 I/O backend 중 하나이다. 2026-10-12에 확인한 upstream 구현에는 `epoll`, `linux-aio`, `io_uring`, `asymmetric_io_uring` 선택 경로가 있다. 실제 사용 가능 여부와 선택은 빌드, 커널, 버전, 설정에 따라 달라진다. [Backend 선택 구현](https://github.com/scylladb/seastar/blob/master/src/core/reactor_backend.cc)

일반적인 `io_uring` backend는 shard마다 ring을 두지만, `asymmetric_io_uring`은 I/O 처리의 상당 부분을 별도로 지정한 코어의 커널 worker와 polling thread로 넘기는 방식이다. 따라서 모든 I/O 처리 코드가 반드시 데이터 소유 shard의 CPU에서 실행된다고 설명할 수는 없다. [ScyllaDB의 asymmetric io_uring 설명](https://www.scylladb.com/2026/07/22/asymmetric-io_uring-backend-seastar/)

또한 one-thread-per-core는 주된 애플리케이션 실행 모델을 뜻한다. Blocking syscall을 처리하기 위한 보조 thread 등이 존재할 수 있어, 프로세스의 총 thread 수가 shard 수와 같다는 뜻은 아니다. [ScyllaDB FAQ](https://docs.scylladb.com/manual/stable/faq.html)

### Cache Affinity 관점에서의 효과와 한계
Seastar의 설계를 앞의 CPU cache 동작과 연결하면 다음과 같다.

| 설계 | Cache Affinity에 미치는 영향 |
|---|---|
| Reactor thread를 특정 CPU에 고정 | 실행 주체가 이동하면서 잃는 cache locality 감소 |
| 가변 데이터의 소유 shard 지정 | 여러 코어의 반복 쓰기와 ownership 이동 감소 |
| 로컬 서비스와 allocator 사용 | 공유 객체와 할당 메타데이터의 경합 감소 |
| I/O 대기 중 다른 task 실행 | 적은 reactor thread로 많은 동시 요청 처리 |
| 명시적 shard 간 메시지 | 코어 간 작업 이동을 필요한 경로로 제한 |

이 구조에서도 모든 비용이 없어지는 것은 아니다. Hot key가 특정 shard에 집중되거나, shard 간 통신이 많거나, working set이 CPU cache보다 크면 병목이 생길 수 있다. 같은 shard의 task들도 비동기 대기 지점에서 서로 교차 실행되므로, 여러 단계로 이루어진 논리적 작업에는 semaphore 등 별도의 동기화가 필요할 수 있다. 단일 thread라는 사실만으로 비동기 함수 전체가 원자적으로 실행되지는 않는다. [Seastar의 semaphore와 비동기 동시성 설명](https://docs.seastar.io/master/tutorial.html)

**Seastar는 CPU의 coherence protocol을 대체하지 않는다. 데이터와 실행을 같은 shard에 유지하고 공유 가변 상태를 줄여, 하드웨어 coherence가 처리해야 하는 통신과 ownership 이동을 줄이는 소프트웨어 설계이다.**
