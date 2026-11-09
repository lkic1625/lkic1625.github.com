+++
title = "EEVDF Scheduling"
slug = "eevdf-scheduling"
date = "2026-10-02T11:51:54+09:00"
draft = false
tags = ["cs", "os", "scheduling", "linux"]
+++

## 개요
이건 단순 공부용 정리이다. EEVDF는 **Earliest Eligible Virtual Deadline First**의 약자이다. 이름 그대로, 실행 자격이 있는 스레드 중에서 virtual deadline이 가장 이른 스레드를 선택한다. [\[1\]](#ref-1)
[4. The Process](/os-process/)에서 CPU별 rq와 cfs_rq의 내부구조를 살펴봤었다. 여기서는 그중 Fairness 수준에서 경쟁하는 스레드들을 어떤 기준으로 선택하는지 알아보자. 설명은 하나의 CPU에서 같은 작업 큐를 두고 경쟁하는 스레드들을 기준으로 단순화한다. 다만, 이는 실제 Linux에서 실행 중인 스레드의 짧은 실행 구간을 보호하는 처리 등도 있으므로, 완벽한 로직이라고 판단하면 안된다. [\[2\]](#ref-2)

### 모든 스레드의 1ms는 같을까?
모든 스레드가 같은 CPU 몫을 가져야 하는 건 아니다. 어떤 스레드는 더 높은 우선순위를 가지고, 그에 따라 더 많은 CPU 시간을 받을 수 있다. Linux에서는 `nice` 값에 대응하는 `weight` 를 통해 이러한 상대적인 몫을 표현한다. (**nice 값이 낮을수록 weight는 높다.**)

예를 들어보자. A와 B 스레드의 가중치 비율이 2:1이라면, 둘이 계속 실행 가능한 상태에서 경쟁할 때 A가 B보다 두 배의 CPU 시간을 받는 것이 **공정하다 볼 수 있다**. 그렇기에 실제 실행 시간만 비교하면 안 된다. 각 스레드가 본인의 가중치에 비해 얼마나 실행했는지를 비교할 수 있는 기준이 필요하다.

### vruntime: 가중치로 정규화한 실행 시간
이때 사용하는 값이 `vruntime`이다. 실제 CPU 실행 시간을 가중치(`weight`) 정규화해서 누적한 값이라고 볼 수 있다.

<div class="math">$$
\Delta v_i = \Delta t_i \frac{w_0}{w_i}
$$</div>

- <span class="math">$\Delta t_i$</span>: 스레드가 실제로 실행한 CPU 시간
- <span class="math">$w_i$</span>: 해당 스레드의 weight
- <span class="math">$w_0$</span>: 기준 weight, Linux에서는 nice 0에 해당하는 weight
- <span class="math">$\Delta v_i$</span>: 그 실행으로 증가한 vruntime

가장 직관적인 건 **`weight`가 높을수록 `vruntime`이 천천히 증가한다**는 것이다. 기준 가중치 두 배를 가진 스레드가 2ms를 실행하면 vruntime은 1ms만큼 증가한다. 기준 weight를 가진 스레드가 1ms를 실행해도 vruntime은 1ms만큼 증가한다.

즉, 서로 다른 실제 실행 시간을 썼어도 가중치에 비례해서 사용했다면 같은 만큼의 `vruntime`을 쌓는다. virtual time은 실제 시간을 무조건 더 크게 늘린 시간축이 아니라, 서로 다른 CPU 몫을 비교하기 위한 시간축이다.

### 현재 virtual time `V`
그렇다면 각 스레드의 `vruntime` 을 무엇과 비교해야 할까? 이 기준이 현재 `virtual time`인 <span class="math">$V$</span>이다. 경쟁하는 스레드들의 집합을 고정하여(실제로는 그렇지 않지만) 단순화하면, <span class="math">$V$</span>는 스레드들의 `vruntime`을 `weight`로 가중 평균한 값이다.

<div class="math">$$
V = \frac{\sum_i w_i v_i}{\sum_i w_i}
$$</div>

여기서 <span class="math">$v_i$</span>는 각 스레드의 vruntime이다. <span class="math">$V$</span>는 벽시계 시간이 아니라, 이 실행 큐에서 공정한 서비스를 비교하는 기준 위치이다. 스레드가 들어오거나 나가는 경우에는 별도의 보정이 필요하므로, 시스템 전체 스레드의 단순한 평균으로 생각하면 안 된다.

```

──────A────────V────────B──────
      6        10       12
virtual time →
V: 기준선
A: 자기 몫보다 덜 실행한 상태
B: 자기 몫보다 더 실행한 상태
```

### lag & eligibility
이 차이를 lag라고 부른다. 우선 virtual 단위의 차이로 보면 다음과 같다.

<div class="math">$$
\operatorname{vlag}_i = V - v_i
$$</div>

양수라면 받아야 할 몫보다 덜 받았고, 음수라면 더 받은 것이다. 실제 서비스 부족량으로 표현하려면 여기에 정규화된 가중치(`weight`)를 곱한다.

<div class="math">$$
\operatorname{lag}_i = \frac{w_i}{w_0}(V-v_i)
$$</div>

둘은 단위가 다르지만 부호는 같다. 따라서 실행 자격을 판단하는 조건은 다음처럼 쓸 수 있다.

<div class="math">$$
v_i \le V \quad\Longleftrightarrow\quad \operatorname{lag}_i \ge 0
$$</div>

이 조건을 만족하면 **eligible**, 즉 다음 실행 대상으로 선택될 자격이 있다. (lag가 0인 스레드도 포함한다.) 여기서 주의할 건 lag가 크다고 무조건 먼저 실행하는 것은 아니라는 점이다. lag는 우선 후보가(elgible) 될 수 있는지를 판단한다. 후보들 사이의 순서는 다음에 나오는 VD로 결정한다.

### Virtual Deadline
`eligible`인 스레드가 여러 개라면 누구를 먼저 실행해야 할까? EEVDF는 그중 **virtual deadline, VD가 가장 작은 스레드**를 선택한다.

이번 요청이 시작되는 vruntime 위치를 <span class="math">$v_i^{\text{start}}$</span>, 요청한 실제 실행 시간인 slice를 <span class="math">$r_i$</span>라고 해보자.

<div class="math">$$
VD_i = v_i^{\text{start}} + r_i\frac{w_0}{w_i}
$$</div>

즉, 해당 요청의 slice를 모두 실행했을 때 도달할 `vruntime` 위치를 VD로 설정한다. 여기서도 실제 slice를 virtual 단위로 변환해야 한다.

```

──────요청 시작───────────────────VD──────
          └── virtual slice ────┘

virtual time →
```

이 값은 요청을 설정할 때 정하는 완료 목표 위치이다. 실행하는 동안 현재 `vruntime`은 증가하지만, 매 순간 현재 `vruntime`에 전체 slice를 다시 더해서 VD를 밀어내는 것은 아니다.

같은 가중치와 같은 시작 `vruntime`이라면, slice가 짧은 스레드의 VD가 더 이르다. 그렇기에 짧은 요청이 더 빨리 응답받을 수 있다. 다만 시작 `vruntime`이나 `weight`가 다르면 짧은 slice만 보고 실행 순서를 판단할 수는 없다.

```
같은 실행 큐에서 경쟁하는 스레드
                │
                ▼
       vruntime ≤ V 인가?
          │           │
         YES          NO
          │           │
          ▼           ▼
       eligible    후보에서 제외
          │
          ▼
  eligible 중 가장 작은 VD 선택
```

### 왜 선택했는가?
그래서 메커니즘은 이해했다 그리고, 어느정도 공평한 느낌도 받는다. 다만, 정확히 왜 이러한 스케쥴링 알고리즘을 선택했는지 짚어보자. **VD**는 “**공정하게 CPU를 나눠 받았다면 이번 요청이 언제 끝나야 하는가**”를 나타낸다. 즉, 공정한 몫을 유지하면서 요청의 완료 지연까지 고려할 수 있다는 의미이다.
### VD가 같은 경우
그렇다면 VD까지 같으면 어떻게 될까? 둘 다 eligible이라면 EEVDF의 기본 기준에서는 동률이다. 이번에도 현재 <span class="math">$V=10$</span>이고, 다른 스레드들은 생략한다.

| 스레드 | 현재 vruntime | VD | 남은 실행량 | eligible, <span class="math">$V=10$</span> |
| --- | ---: | ---: | ---: | --- |
| A | 6 | 12 | 6 | O |
| B | 9 | 12 | 3 | O |

A가 서비스를 더 적게 받았고 B는 남은 실행량이 더 짧지만, 이것을 추가 비교 기준으로 삼아야 한다는 규칙은 없다. 확인한 Linux 구현의 `entity_before()`도 deadline만 비교하며 `vruntime`을 통한 동률 해소는 하지 않는다.

> **기본 규칙과 실제 Linux 동작**
> 여기서는 eligibility와 VD를 중심으로 기본 선택 규칙을 설명했다. 실제 Linux에는 실행 중인 스레드의 짧은 실행 구간을 보호하는 처리 등도 있으므로, 매 순간 VD가 가장 작은 스레드로 즉시 전환한다고 이해하면 안 된다.

## References

<a id="ref-1"></a>
[1] The Linux Kernel Contributors, “EEVDF Scheduler,” *The Linux Kernel Documentation*. [Online]. Available: <https://kernel.org/doc/html/latest/scheduler/sched-eevdf.html>. Accessed: Nov. 9, 2026.

<a id="ref-2"></a>
[2] The Linux Kernel Contributors, “kernel/sched/fair.c,” *Linux source code*. [Online]. Available: <https://github.com/torvalds/linux/blob/master/kernel/sched/fair.c>. Accessed: Nov. 9, 2026.
