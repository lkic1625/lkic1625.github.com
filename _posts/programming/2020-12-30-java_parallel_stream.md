---
title: "자바 병렬 스트림"
tags:
  - java
  - parallel_stream
categories:
  - programming
last_modified_at: 2021-12-31T13:00:00+18:00
toc: true
---
<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>

# Introduction

오늘 이야기해볼 주제는 자바의 `Parallel Stream`(병렬 스트림)이다.

회사에서 병렬 스트림을 쓰면서 당시 관련해 조사하고 공부했던 것들을 적어보려고 한다.

지금 듣고 있는 노래는 `리도어 - 영원은 그렇듯` 이다.

# Parallel Stream

자바의 병렬 스트림에 대해 알아보자.

## 자바의 스트림이란

우선, `Stream`(스트림)이란 자바 8 버전부터 지원하는 데이터 처리 연산을 지원하는 데이터의 연속이다.
> A sequence of elements supporting sequential and parallel aggregate operations.

자바의 스트림 파이프라이닝은 현업에서 강력한 생산성을 줄 수 있다.

## 병렬 스트림이란

병렬 스트림은 앞서 발췌해온 문구에서도 짐작할 수 있듯이, 스트림 파이프라이닝의 연산을 병렬적으로 시행할 수 있도록 한다.

> In programming, concurrency is the composition of independently executing processes, **while parallelism is the simultaneous execution of (possibly related) computations.** Concurrency is about dealing with lots of things at once.
> 출처, https://go.dev/blog/waza-talk#:~:text=In%20programming%2C%20concurrency%20is%20the,lots%20of%20things%20at%20once.

동시에 진행되는 연산은 성능적인 측면에서 분명 강력한 이점을 가져다 줄 것이다.
<br>
우리는 모든 코드에 병렬 스트림을 아니, 그냥 기본적으로 스트림을 병렬로 돌릴 수 있도록 짜는게 낫지 않을까?
<br>
하지만 그렇지 않은 이유는 병렬 연산이 항상 이점을 가져다 주지는 않기 때문이다.

어떤 이유로 병렬 스트림이 항상 사용되지 않는지, 언제 써야 그러면 적절할지에 대해 알기 위해서는 내부에서 병렬 스트림이 어떻게 동작하는지 알아야 한다. 이에 대해 한 번 짚어보도록 하자.

## 병렬 스트림의 내부

병렬 스트림은 내부에서 `ForkJoinPool` 이라는 것을 사용해 구현되었다.

### ForkJoinPool

`ForkJoinPool`이란 자바 7 버전 이후 추가된 기능이며, 한 작업(task)을 여러 개로(sub task) 나누어 각각 다른 스레드에서 연산할 수 있도록 한다.
![이미지](/assets/images/ForkJoinPoolStructure.png)
작업은 나뉘어져 일종의 이진 트리를 생성하며, 종단 노드는 같은 양의 연산을 하게된다.

`Divide And Conquer` 알고리즘과 같은 방식으로 보이기도 하며, 병렬 스트림은 이를 이용해 구현되었다.

`ForkJoinPool`은 내부에 `Work Stealing` 알고리즘을 사용하는 등 재밌게 구현해둔 것이 많지만, 이번 포스트 주제를 벗어나는 내용인 것 같아 자세히는 설명하지 않겠다.
관심이 있다면 따로 찾아보는 것도 추천한다.

### 병렬 스트림은 어떻게 ForkJoinPool 을 이용하는가?

자바의 병렬 스트림은 앞서 설명한 `ForkJoinPool`을 이용하기 때문에 여러 개의 작업으로 잘개 쪼갤 수 있어야한다.
<br>
이를 위해 병렬 스트림은 `Spliterator`의 `trySplit` 메서드를 이용해 재귀적으로 데이터를 분해한다.
>An object for traversing and partitioning elements of a source. The source of elements covered by a Spliterator could be, for example, an array, a Collection, an IO channel, or a generator function.
> 출처, https://docs.oracle.com/javase/8/docs/api/java/util/Spliterator.html

`trySplit`이란 메서드가 이를 담당하고, 아래는 `ArrayList.java`에 실제 구현체다.  
```java
public ArrayList<E>.ArrayListSpliterator trySplit() {
  int hi = getFence(), lo = index, mid = (lo + hi) >>> 1;
  // ArrayListSpliterator can be used here as the source is already bound
  return (lo >= mid) ? null : // divide range in half unless too small
      root.new ArrayListSpliterator(lo, index = mid, expectedModCount);
}
```

자바 코드에 익숙하거나, 분할 정복 알고리즘에 대해 어느정도 알고 있다면 어떤식으로 동작하는지 쉽게 유추해볼 수 있을 것이다.
<br>
여기서 **중요한 건** `trySplit`을 구현하기 위해 중앙점(mid point)을 찾아야 하고, `LinkedList`와 같이 자료구조는 실제 데이터의 크기를 알고있지 않기 때문에, $$O(N)$$ 에 시간복잡도가 필요하다는 점이다.
<br>
이는 곧 다시 언급하겠지만, 병렬 스트림의 성능 저하의 원인 중 하나이다.

## 그렇다면 우리는 언제 이걸 써야할까?

우리는 그러면 병렬 스트림을 언제 쓰면 안되고, 언제 써야하는 걸까.

아래는 자바 언어 아키텍트인 `Brian Goetz`가 언급한 병렬 스트림의 성능에 영향을 줄 수 있는 요소들이다.

- The source is expensive to split, or splits unevenly.
- Merging partial results is expensive.
- The problem doesn’t admit sufficient exploitable parallelism.
- The layout of the data results in poor access locality.
- There’s not enough data to overcome the startup costs of parallelism.

이 중 몇 가지를 소개해보고자 한다.

### Source splitting

`ArrayList`의 경우에는 가장 적합한 예제로 볼 수 있다. 내부에 이미 해당 리스트의 크기를 알고 있기 때문에 쉽게 중간점을 찾을 수 있고, (균형잡힌 이진 트리로) 쪼개기 적합하다.

반면에 `LinkedList`는 중간점을 찾기 위해 전체 리스트의 절반을 순회해야 하는 문제점을 가지고 있다. 이렇게 된다면 나뉘는데 $$O(NlogN)$$의 시간이 소요될 것이다.
<br>
`LinkedList`는 이러한 분할 연산의 비효율적인 구조를 피하기 위해 불균형 이진 트리를(unbalanced binary tree)를 생성하게 된다.

추가로 `Hash-based`, `Tree-based` 자료구조는 `LinkedList`만큼 비효율적이진 않지만, 기존 배열처럼 분할할 크기를 예측할 수 없어 경우에 따라 최적화가 어려울 수 있다.

### Result combination

`reduce`와 같은 집계 작업은 매우 효율적이지만, 두 `Set`을 병합하는 등의 작업은 비효율적일 수 있다.

집계 작업은 연산하는 트리에 높이에 의존적이기 때문에 불균형 트리에 경우 최대 $$O(N)$$의 작업이 반복될 수 있다.

또한 연산 트리를 마지막으로 합칠 때, `sorted`, `collect` 등의 메서드는 `sequential`한 작업이기 때문에 이 또한, 병렬 스트림의 성능 저하 원인이 될 수 있다.

### Memory locality

현대의 컴퓨터 시스템은 자주 사용하는 데이터를 CPU에 최대한 가깝게 유지하기 위해 정교하게 짜여진 복수 계층의 캐시를 이용한다.
<br>
L1 캐시의 경우 실제로 메인 메모리에 올라간 데이터보다 100배 가까이 빠를 수 있어, CPU 가 다음에 어떤 데이터를 필요로할지 예측한다면 더 빠른 연산 수행능력을 보여줄 것이다.

캐싱을 할 때는 캐시 라인(x86 칩의 경우 64 바이트) 기준으로 데이터를 가져오는데, 메모리 엑세스의 선형적인 패턴이 보이는 경우 하드웨어는 다음 원소도 필요할 것이라고 가정하고 프리페치를 진행한다.
<br>
그렇기에 배열과 같은 연속적이고 메모리 지역성이 높은 자료구조에 경우 프리페치가 성능적으로 큰 이점을 가져올 것이다.
<br>
또한, 배열은 페치당 연산량을 극대화할 수 있다.

자바 구현의 경우 대부분 객체의 필드를 연속적으로 메인 메모리에 배치하도록 구현되어 있는데, `primitive` 한 타입의 필드를 가지고 있다면 메모리 지역성이 매우 높아 캐싱에 큰 이점이 있다.

반면에 객체가 내부에 여러개의 객체를 필드로 가지고 있을 경우 포인터 참조가 일어나며, 메모리 지역성이 낮을 가능성이 다분하기에 이에 따라 캐시 히트율이 낮아지고 지연될 가능성을 가지고 있다.

# $$NQ$$ Model

자바의 병렬 스트림은 위와 같이 다양한 요소에 의존적이기 때문에 사용하는 기준이 명확하지 않다.

`Brian Goetz`는 이러한 모호할 수 있는 기준을 명확하게 단정짓기 위해 `$$NQ$$ model`를 제시했는데, 이는 아래와 같다.

- $$N = \text{the number of data elements}$$
- $$Q = \text{the amount of work performed per element}$$

$$NQ > 10,000$$ 인 경우 병렬 스트림을 사용하는 기준으로 보며,
<br>
앞서 설명했던 병렬 스트림에 성능에 영향을 줄 수 있는 다양한 요인들 또한 $$Q$$ 즉, 연산량에 의해 완화될 수 있다고 했다.

심지어 `LinkedList` 또한 원소 하나당 큰 연산량을 지니는 작업에 경우 충분히 병렬 스트림으로 성능 개선을 이뤄낼 수 있다고 언급한다.

# 마무리 지으며

오늘은 자바의 병렬 스트림에 대해 알아보았다.

스트림 파이프 라인이 가지는 강력한 생산성에 성능 개선까지 이뤄낼 수 있는 멋진 기능이지만, 자칫 잘못하면 오히려 성능 저하의 요인이 될 수 있기에 여러 자료를 조사해보았고 기록에 남긴다.

이 외에도 다양한 자바의 동시성 프로그래밍에 기능들이 존재하는데 또 다뤄볼 수 있다면 좋을 것 같다.


><font size="6">Refernce</font>
- https://developer.ibm.com/articles/j-java-streams-5-brian-goetz/
- https://m.blog.naver.com/tmondev/220945933678
