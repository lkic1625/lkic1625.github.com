+++
title = "Swap과 메모리 관리: Linux, TMO, ZRAM"
slug = "os-swap"
date = "2026-11-02T15:30:04+09:00"
draft = false
tags = ["os", "ostep", "memory", "swap"]
+++

## 개요
swap, 메모리 오프로딩은 물리적으로 부족한 용량 한계를 하위 단계의 메모리로 이동 시키는 기술이다. 이를 이용하여 우리는 가상화의 큰 장점을 확보하였다.
하지만, 이로 인해 생기는 여러 장단점은 명확한 trade-off이다. 우리는 우선 현대 시스템에서 이러한 Swap이 어떻게 구성되어 있는지 보고, 실제 사례를 보며 기존 시스템의 일반적인 솔루션이 가진 한계를 어떻게 해결하려고 하였는지 찾아보자.

## Linux
리눅스는 가장 기본적인 방식은 PTE가 어떻게 바뀌는지를 기본으로 설명할 수 있다. x86-64 Linux에서 특정 페이지가 Swap-out 된다면, 해당 페이지를 가리키던 PTE가 정상적인 물리적 메모리를 매핑하는 게 아닌, Swap Entry를 나타내는 값으로 변경된다.
CPU는 메모리 매핑 중에, 물리 페이지 접근이 불가능함을 판단하고, Page Fault를 통해 OS에게 이를 맡긴다. 이를 통해 Swap Entry라면, 데이터 위치에 대한 정보를 가지고 있기에 이 값을 통해 정장적인 물리 주소 매핑을 구할 수 있다. 보통의 구조는 아래와 같다.
참고로, Linux는 페이지 회수를 위해 Multi-Generational LRU(MGLRU)를 사용할 수 있으며, 활성화 여부는 커널 빌드와 런타임 설정에 따라 달라진다. 자세한 건 페이지 교체 알고리즘 챕터에서 더 설명하겠다. [\[1\]](#ref-1)

![Linux Swap Entry 구조](/assets/images/os-notes/linux-swap-entry.png)

## #1 TMO(Transparent Memory Offloading) at Meta
그렇다면, 이제 실제 이러한 Swap 관련 사용례를 더 살펴보자. 메타는 데이터센터에서, 더 많은 메모리를 제공하기 위해 주기적으로 Cold Page를 찾아 Swap-out했다.
일반적인 사용례를 위해 접근 빈도가 낮은 페이지를 선제적으로 Swap-out 하는 공격적인 방식을 선택했고, 이에 대한 배경에 대해서 더 알아보도록 하자. [\[2\]](#ref-2)

이러한 전략의 배경은 어플리케이션의 성능 저하가 **허용 가능한 수준**이라면 메모리가 충분하더라도, Cold Page를 선제적으로 Swap-out 한다는 것이다.
이 때 사용하는 것은 Linux의 PSI(Pressure Stall Information) 지표이다. PSI 지표는 실제로 I/O 병목 CPU가 실제로 대기한 시간, 메모리 문제로 정체된 시간의 비율을 제공한다. [\[3\]](#ref-3) 기존에 Page Fault 시에 Swap을 진행하는 방식보다 메모리 절감을 20~32% 정도 절감할 수 있다고 발표했다. (물론, 그에 따른 trade-off로는 I/O Pressure 및, 실제 SSD 수명과 쓰기 속도 등이 있을 것이다.)

|PSI 지표|의미|
|---|---|
|`memory.some`|해당 관찰 구간에 하나 이상의 작업이 메모리 문제로 정체된 시간의 비율|
|`memory.full`|모든 비유휴 작업이 메모리 문제로 정체된 시간의 비율|
|`io.some`|하나 이상의 작업이 I/O로 정체된 시간의 비율

또한, 메타는 이 외에도 Swap 시에 heap, stack 데이터 보다 파일 캐시를 우선 적으로 swap-out 하는 리눅스의 기본 정책을 튜닝했는데, 파일 캐시가 다시 재적재 되는, FIle Refault 수치에 따라, heap, stack 등의 데이터를 swap-out 하는 비중을 늘리는 형식으로 피드백 루프에 따른 균형을 맞추려고 했다.

## #2 Android, ZRAM
ZRAM은 안드로이드에서 사용하는 메모리 관리 방식이고, **압축된 페이지를 RAM에 보관하여 Swap Device처럼 사용하는 방식이다.** [\[4\]](#ref-4)
안드로이드 17버전 이후부터는 더욱 적극적으로 이를 사용하는데, 앱의 백그라운드 전환 및 어플리케이션의 특성을 이용하여 Swap 정책을 구성한다.

우리가 안드로이드 앱을 사용하는 패턴을 보면 특히, 더욱 이러한 ZRAM 정책이 효과적임을 짐작할 수 있을 것이다. 안드로이드 17 버전 이후부터는 Prefetch를 통해 선제적으로 어플리케이션이 다시 활성화 된다는 신호와 함게 이를 미리 Swap-in 하도록 정책을 구성한다. ActivityManager가 실제, 앱 상태 전환 이벤트를 추적하고 이러한 앱의 생명 주기를 이용해 OS 정책의 메모리 Swap 방식을 관리하는 것이다. [\[5\]](#ref-5)

## References

<a id="ref-1"></a>
[1] The Linux Kernel Contributors, “Multi-Gen LRU,” *The Linux Kernel Documentation*. [Online]. Available: <https://docs.kernel.org/admin-guide/mm/multigen_lru.html>. Accessed: Nov. 9, 2026.

<a id="ref-2"></a>
[2] Meta, “Transparent memory offloading: more memory at a fraction of the cost and power,” *Engineering at Meta*, Jun. 20, 2022. [Online]. Available: <https://engineering.fb.com/2022/06/20/data-infrastructure/transparent-memory-offloading-more-memory-at-a-fraction-of-the-cost-and-power/>. Accessed: Nov. 9, 2026.

<a id="ref-3"></a>
[3] J. Weiner, “PSI - Pressure Stall Information,” *The Linux Kernel Documentation*, Apr. 2018. [Online]. Available: <https://docs.kernel.org/accounting/psi.html>. Accessed: Nov. 9, 2026.

<a id="ref-4"></a>
[4] The Linux Kernel Contributors, “zram: Compressed RAM-based Block Devices,” *The Linux Kernel Documentation*. [Online]. Available: <https://docs.kernel.org/admin-guide/blockdev/zram.html>. Accessed: Nov. 9, 2026.

<a id="ref-5"></a>
[5] Android Open Source Project, “Memory management daemon,” *Android Documentation*. [Online]. Available: <https://source.android.com/docs/core/perf/mmd>. Accessed: Nov. 9, 2026.
