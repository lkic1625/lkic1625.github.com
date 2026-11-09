+++
title = "Go Runtime Internals — 작성 중"
slug = "go-runtime-internals"
date = "2026-09-30T17:41:37+09:00"
draft = false
tags = ["cs", "go", "goroutine", "runtime"]
status = "작성 중"
+++

> **작성 중인 글입니다.** Goroutine Stack까지 정리했으며, M·P·schedt·netpoller·sysmon 설명은 이어서 작성할 예정입니다.

## 개요
고루틴을 설명하라고 하면, 반드시 나오는 이야기가 있다. GMP 구조이다. 고루틴의 위대한 업적 중 하나를 뽑자면, 어려운 경량 스레드 모델링에 대해 가장 직관적이고 명료한 모델링이라고 생각한다. 다만, GMP 모델을 아는 것과 이를 완전히 이해하는 것은 서로 다른 문제이다. 아래 질문에 대해서 답변할 수 있는가?
- 왜 `G → OS Thread`가 아니라 **G-M-P**일지
- 왜 `GOMAXPROCS`를 통해 **P 개수**를 제한해야하는지, 그리고 그 개수는 왜 코어 개수인지.
- go runtime은 어떻게 **필요한 M만 유지하면서 runnable G를 P에 공급하는지**
- network I/O 시에 고루틴은 어떻게 동작하는지
이 글은 이 질문에 답변하기 위한 글이다.
## Topology

### G - Goroutine

#### Goroutine Stack
우리가 가장 잘 아는 고루틴이다. stackful한 구조를 통해, 자신이 언제 어디서 멈췄는지를 기억하는, 독립적인 Call Stack을 가지고 있다. 참고로, 보통 코루틴을 나누는 구조 중에 하나는 stackful, stackless이다. stackless는 간단하게 설명하자면, 명시적인 구절을 통해 실제 컴파일 단에서 suspension 지점을 지정하고 상태 기계를 통해 관리하는 방식이다.(물론, 호출자의 스택을 이용해 최소한의 정보만을 저장을 한다는 의미이다.)
코루틴의 대한 다양한 논의와 코루틴 이론에 대해서는 몇 가지 글을 참고할 수 있겠으나, 이 글에서는 다루지 않겠다. [\[1\]](#ref-1), [\[2\]](#ref-2)

고루틴의 스택은 별도로 관리되며, 이러한 관리의 이점으로는 코딩 방식이 기존 체계와 동일하고 함수의 색 문제를 고민하지 않아도 된다는 점이다. [\[3\]](#ref-3) 다만, 컨텍스트 스위칭 비용과 GC 시에 루트 고루틴부터 추적해야하는 문제는 그에 해당하는 트레이드 오프일 것이다. 물론, 고루틴의 스택은 전통적인 스레드 스택과 다르게 가볍고, 2KiB부터 시작해, 점진적으로 커지는 구조이다.
#### Contiguous Copying Stack
고루틴의 스택은 기존에 Segmented Stack 구조로 이루어져 있었지만, 현재는 확장 시에 새로운 메모리 공간에 기존 스택 내용을 복사 후에 확장된 메모리 공간을 예약하는 형식으로 구성된다. 이는 Hot Path 시에 생기는 Allocate, Free가 반복되면서 큰 오버헤드를 만드는 Hot Split 방식을 우회하는 방식이다. [\[4\]](#ref-4)

모든 스택의 내용을 복사하는 건 큰 과정일 수 있지만, 고루틴은 의도적으로 스택의 크기를 2배씩 확장하기에 이에 대한 코스트는 "constant amoritzed cost"라고 언급한다. [\[5\]](#ref-5) 또한 사용량이 전체 스택의 1/4 미만인 경우에는 스택의 크기를 축소하는 과정 또한 포함하여 스택 사용의 급증과 관리를 용이하게 한다.
### M - Machine, OS Thread

### P - Processor
### schedt
### netpoller

### sysmon

## References

<a id="ref-1"></a>
[1] L. Baker, “Coroutine Theory,” *Asymmetric Transfer*, Sep. 25, 2017. [Online]. Available: <https://lewissbaker.github.io/2017/09/25/coroutine-theory>. Accessed: Nov. 9, 2026.

<a id="ref-2"></a>
[2] V. Ramesh, “Stackless vs. Stackful Coroutines,” *Varun Ramesh’s Blog*, Aug. 18, 2017. [Online]. Available: <https://blog.varunramesh.net/posts/stackless-vs-stackful-coroutines>. Accessed: Nov. 9, 2026.

<a id="ref-3"></a>
[3] B. Nystrom, “What Color is Your Function?” *journal.stuffwithstuff.com*, Feb. 1, 2015. [Online]. Available: <https://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/>. Accessed: Nov. 9, 2026.

<a id="ref-4"></a>
[4] “Contiguous stacks,” *Go design document*. [Online]. Available: <https://docs.google.com/document/d/1wAaf1rYoM4S4gtnPh0zOlGzWtrZFQ5suE8qr2sD8uWQ/pub>. Accessed: Nov. 9, 2026.

<a id="ref-5"></a>
[5] The Go Authors, “Source file runtime/stack.go,” *The Go Programming Language*. [Online]. Available: <https://go.dev/src/runtime/stack.go>. Accessed: Nov. 9, 2026.
