+++
title = "scheduling"
date = "2020-10-17T13:00:00+09:00"
tags = ["greedy", "algorithm"]
+++

# activity selection problem

$n$개의 팀이 회의하고 싶은 시간을 제출했다고 했을 때 한 개의 회의실에서 선택할 수 있는 최대 회의 개수는?

$input$: $j_1, j_2, j_3, ... j_n$ ($j_i = (s_i, f_i)$)<br>
$output$: maximum number of scheduled interval.

## 알고리즘
1. 목록 $S$에 남는 회의 중 가장 일찍 끝나는 회의 $S_{min}$을 선택한다.
2. $S_{min}$과 겹치는 회의를 $S$에서 모두 지운다.
3. $S$가 텅빌 때까지 반복한다.

## 정확성 증명
$Claim$: 가장 종료 시간이 빠른 회의($S_{min}$)를 포함하는 최적해가 반드시 존재한다.

$Proof$:
$S$의 최적해 중 $S_{min}$을 포함하지 않은 해가 있다고 가정하자. 이 답은 서로 겹치지 않은 회의 목록이다.
이 목록에서 첫 번째로 개최되는 회의를 지우고 $S_{min}$을 대신 추가해 새로운 목록을 만든다하자.
$S_{min}$은 S에서 가장 일찍 끝나는 회의이기 때문에 겹치지 않고 새로 만든 목록 또한 최적해이다.
따라서 $S_{min}$을 선택해 최적해를 항상 구할 수 있다.

# Interval Partitioning

$input$: $j_1, j_2, j_3, ... j_n$ ($j_i = (s_i, f_i)$)<br>
$output$: find minimum number of classroom to schedule all lectures so that no two occur at the same time in the same room

## 알고리즘

```
Algorithm Interval Partition {
    Sort all intervals by start time

    While there are intervals left {
        Let i be the next one

        If there is an existing classroom whose
        schedule is compatible with i {
            Add i to the compatible classroom that has been
            free for the longest time
        }
        Else {
            Create a new classroom and add i to it
        }
    }
}
```

## References
- https://stumash.github.io/Algorithm_Notes/greedy/intervals/intervals.html
- 구종만 지음, 알고리즘 문제 해결 전략, 인사이트, 9장 