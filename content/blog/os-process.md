+++
title = "프로세스와 cgroup의 CPU 자원 관리"
slug = "os-process"
date = "2026-09-30T14:10:20+09:00"
draft = false
tags = ["os", "ostep", "process", "cgroup"]
+++

- 프로세스는 메모리에 올라가 실행되는 프로그램 흐름 [\[1\]](#ref-1)
- 이전에 Process 라는 추상화된 개념은 각 프로그램끼리의 독립적인 흐름을 필요로 하기에 더욱이 격리될 필요가 있었음.
- 다만, 근래에 와서는 프로세스는 단순히 공통 실행 흐름의 역할을 하지 실제 CPU의 적재되어 실행되는 단위라고 보기 어려움. 과거 UNIX에서 실행흐름이 아래와 같았기에 그렇게 배우는 것

```text
1 Process = 1 Address Space + 1 Execution Flow
```

### 현대의 Virtual thread, Coroutine 까지
- 현대에 와서는 더욱 복잡하다, 특히 프로세스라는 개념보다는 Kernel Thread 로 인식된다. 특히, Linux에서는 둘 다 task 라는 개념으로 컨텍스트를 저장하기도 한다.
- 하지만 여전히 멀티 스레딩의 모델이어도 현대의 시스템에서는 충분하지 못하다, 실제로도 수만개의 스레드가 특정 프로세스의 생긴다고 해도 이것이 모두 cpu 자원을 사용하는 게 아니다.
- 그렇기에 커널이 모르는 새로운 실행 흐름을 만들자는 게 vitual thread, coroutine, goroutine, async/await 등이 나오게 됨
```
Process
  └─ Runtime
      ├─ N개의 Virtual Thread
      │       ↓ multiplexing
      └─ M개의 Kernel Thread
              ↓ scheduling
             CPU
```
- virtual thread 는 cpu scheduling 과 독립적인 스케쥴링을 한다는 데에서 또한, 기존에 thread-per-request 모델을 확장하는 데에 있어서 중요하다. 특히 컨텍스트 스위칭의 문제라기보단 실제 커널 모드에 진입해 syscall 을 하는 과정에서 생기는 오버헤드가 크기에 이를 우회하기 위함도 있다. 물론, Carrier Thread 를 재사용한다는 측면에서 시작된 것 역시 맞다. [\[2\]](#ref-2)

## cgroup mechanisms
시분할 메커니즘은 우리에게 여러 개의 프로그램이 거의 동시에 동작하는 것처럼 보이도록하는 효과가 있다. 다만, 현대의 시스템은 이를 더더욱 활용하기 위해 확장하고 제안한다.
예를 들어보자, Docker 등의 Container Runtime 에서 Resource Limit 을 지정할 수 있고 이를 위해 vcpu, mem 를 설정해본 기억이 있을 거다. 이러한 제약은 어떻게 이루어질까? 대표적으로 알려진 이러한 자원 할당 메커니즘은 Linux 의 cgroup 이다.
#### cgroup?
cgroup이란 뭘까? 필자는 처음에 이게 어떠한 메커니즘, 어떠한 알고리즘 정도로만 와닿았지 실체를 알지는 못했다. cgroup이라고 부르는지 정확히 감이 오진 않았었다. 다만, 명확한 건 cgroup이 직접 CPU 자원을 따로 내어주는 게 아닐 거 같다는 직관만 있었다.
cgroup은 프로세스를 계층적으로 그룹화하고 자원을 제어한다. CPU controller는 weight를 통한 상대적 배분과 quota를 통한 사용량 제한을 제공한다. 우리가 보통 CPU throttle 을 마주한다면 quota 를 통한 사용량 제한의 대표적인 예시일 것이다. [\[3\]](#ref-3)
### Container
Container 역시 결국에는 여러 Kernel Thread 들이 모여있다. 해당 컨테이너에서 생성된 스레드들은 Docker runetime 을 통해 같은 cgroup hierarchy 로 묶는다.
가장 직관적인 건 hard limit 의 경우일 것이다. 실제로 cgroup v2의 cpu.max 는 `MAX PERIOD` 형식으로 파일에 저장하는데, `PERIOD` 기간마다, 최대 MAX만큼의 CPU execution time 을 쓸 수 있다는 의미이다.
따라서, 우리가 흔히 설정하는 1vcpu 라는 의미는 **100ms 동안총 100ms의 CPU execution time 사용 가능**라는 의미이다. [\[3\]](#ref-3), [\[4\]](#ref-4)
```

period 1                   period 2

████████████|.............|████████████|.............
            ↑                         ↑
         throttle                  throttle
```

### How to calculate quota
더 중요한 것은, 현대의 시스템은 하나의 프로세스가 동작하는 게 아니라 수천개의 스레드가 동작한다는 것이다. 즉 멀티 스레딩의 환경에서는 이러한 cgroup 이 어떤식으로 동작할까?
Global quota를 가지고 있다고 하더라도, 이를 실행시키는 스레드는 멀티 코어/멀티 스레드 환경에서 동시에 consumption 할 수 있다. 만약, 이러한 quota를 실시간에 맞게 계산하려면 엄청난 lock contention 과 해당 데이터에 대한 cache line bouncing 역시 피할 수 없을 것이다.
```
Kubernetes
    ↓
cpu.max = 100000 100000
    ↓

Linux cgroup
cfs_bandwidth
┌─────────────────────┐
│ quota   = 100ms     │
│ period  = 100ms     │
│ runtime = 100ms     │
└──────────┬──────────┘
           │
       slice allocation
           │
 ┌─────────┼─────────┐
 ▼         ▼         ▼
CPU0      CPU1      CPU2
cfs_rq    cfs_rq    cfs_rq
 5ms       5ms       5ms
 │         │          │
T1        T2         T3
```
### Global Quota & local slice
실제로 cgroup 으로 묶인 스레드들은 Global quota 를 공유하고 이에서 할당 받은 자원을 기반으로 CPU-local 한 budget 을 이용해 cpu 자원을 할당 받는다.
local budget은 user instruction 이후, 커널 모드르 진입할 경우, runtime accounting 을 진행해, 만약 local budget이 0 이하인 경우, Global quota에서도 가져올d 값이 없다면 throttle이 걸리는 구조이다.
```
CPU 0
│
│
├── Thread A user code
│       │
│       │ syscall / IRQ / exception
│       ▼
│
├── Kernel mode
│       │
│       ├─ syscall / interrupt 처리
│       │
│       ├─ runtime accounting
│       │
│       │     rq0
│       │     cfs_rq
│       │     cgroup quota
│       │
│       └─ scheduling 필요?
│                │
│          ┌─────┴─────┐
│          │           │
│         NO          YES
│          │           │
│          │       scheduler
│          │           │
│          │        rq0 조회
│          │           │
│          │       Thread B 선택
│          │           │
│          │       context switch
│          │           │
│          ▼           ▼
│       Thread A    Thread B
│
└── User mode 계속
```

#### 실제 rq 예시
```
                         CPU 0
                           │
                           ▼
                    ┌─────────────┐
                    │  struct rq  │
                    └──────┬──────┘
                           │
          ┌────────────────┼──────────────────┐
          │                │                  │
          ▼                ▼                  ▼
       dl_rq             rt_rq              cfs_rq
          │                │                  │
        D1,D2           R1,R2,R3            A,B,C
          │                │                  │
          │      class별 scheduling algorithm │
          │                │                  │
          └────────────────┼──────────────────┘
                           │
                           ▼
                    Scheduler core
                           │
             class priority 순으로 확인
                           │
            DL → RT → FAIR → ...
                           │
                           ▼
                    next task 선택
                           │
                           ▼
                          CPU
```

추가적으로 남은 작업이 없음에도 local slice 값이 남은 경우 global quota에 반환하지만, min_cfs_rq_runtime(1ms) 값 정도를 남겨둠. 만약 남겨두지 않는다면 추후 배정되었을 때, 다시 이를 위해서 lock 을 잡아야하므로, local cache를 일부 남겨두는 작업이라고 볼 수 있음. [\[4\]](#ref-4)

> **Linux rq 구조**
> 참고로 rq(runqueue)는 CPU 코어마다 스케쥴러가 달려있고, 해당 코어의 스레드가 커널모드로 진입 시에, rq 에서 순서별로 다른 스케쥴러 모듈을 훑으며 높은 수선순위의 스레드를 스케쥴링한다. [\[5\]](#ref-5)

## References

<a id="ref-1"></a>
[1] R. H. Arpaci-Dusseau and A. C. Arpaci-Dusseau, “The Abstraction: The Process,” *Operating Systems: Three Easy Pieces, ver. 1.10, ch. 4, Arpaci-Dusseau Books*, Nov. 2023. [Online]. Available: <https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf>. Accessed: Nov. 9, 2026.

<a id="ref-2"></a>
[2] R. Pressler and A. Bateman, “JEP 444: Virtual Threads,” *OpenJDK*. [Online]. Available: <https://openjdk.org/jeps/444>. Accessed: Nov. 9, 2026.

<a id="ref-3"></a>
[3] T. Heo, “Control Group v2,” *The Linux Kernel Documentation*. [Online]. Available: <https://docs.kernel.org/admin-guide/cgroup-v2.html>. Accessed: Nov. 9, 2026.

<a id="ref-4"></a>
[4] The Linux Kernel Contributors, “CFS Bandwidth Control,” *The Linux Kernel Documentation*. [Online]. Available: <https://www.kernel.org/doc/html/latest/scheduler/sched-bwc.html>. Accessed: Nov. 9, 2026.

<a id="ref-5"></a>
[5] The Linux Kernel Contributors, “kernel/sched/sched.h,” *Linux source code*. [Online]. Available: <https://github.com/torvalds/linux/blob/master/kernel/sched/sched.h>. Accessed: Nov. 9, 2026.
