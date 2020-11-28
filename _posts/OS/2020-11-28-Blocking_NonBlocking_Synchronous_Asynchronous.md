---
title: "동기, 비동기, 블록킹 그리고 논 블록킹"
tags:
  - os
  - sync
categories:
  - js
last_modified_at: 2020-11-27T13:00:00+18:00
toc: true
---

# Introduction

최근 꽤나 오래 일을 해오신 개발자 분도 둘의 차이를 모르는 것 같아 놀랐다. 꼭 구분해야할 것이라곤 생각 안 하지만 말의 미묘한 차이는 커뮤니케이션에도 치명적일 수 있으니 한 번 정리해보자.

이번 포스트 주제는 말은 비슷해 보이지만 뭔가 다른 두 쌍에 대해 알아보자.



# Blocking/Non-Blocking

`blocking`과 `non-blocking` 호출되는 함수가 바로 리턴하는가에 차이다.

호출된 함수가 바로 리턴해서 호출한 함수에게 제어권을 넘겨주고 호출한 함수가 다른일을 할 수 있는 기회를 줄 수 있으면, 논블록킹이다.

그렇지 않고 호출된 함수가 자신의 작업을 모두 마칠 때까지 호출한 함수에게 제어권을 넘겨주지 않고 대기하게 만든다면 블록킹이다.

# Synchronous/Asynchronous


`Synchronous`과 `Asynchronous`는 호출되는 함수의 작업 완료 여부를 누가 신경쓰는가에 차이다.

호출되는 함수에게 `callback`을 전달해서 호출되는 함수의 작업이 완료되면, 전달받은 callback을 실행하고, 호출하는 함수는 작업 완료 여부를 신경쓰지 않으면 `Asynchronous`다.

호출하는 함수가 호출되는 함수의 작업 완료 후 리턴을 기다리거나 호출되는 함수로부터 바로 리턴 받더라도 작업 완료 여부를 호출하는 함수 스스로 계속 스스로 확인하면 `Synchronous`다.

# Blocking with Synchronous, Non-Blocking with Asynchronous

이와 같이 묶인 조합은 상당히 비슷한 동작을 진행하는 둘이기에 이해가 쉽다. 아래 그림을 참조하자.

![이미지](/assets/images/ibm-devwokrs-2x2matrix.png)


# Non-Blocking with Synchronous

위에 정의대로라면 호출된 함수는 바로 리턴을 하지만, 호출한 함수가 작업 완료여부를 계속해서 확인하는 것이다. 작업 완료 전까지는 호출한 함수가 계속해서 물으며 진행은 못하지만 또 다른 작업을 진행할 수는 있다.

![이미지](/assets/images/nonblocking_with_sync.png)

# Blocking with Asynchronous

위에 정의대로라면 호출된 함수는 바로 리턴하지 않지만, 이에 대한 완료여부를 호출한 함수가 신경쓰지 않는 것이다.

![이미지](/assets/images/blocking_with_sync.png)

참고한 블로그에서는 이에대한 예시로 `MySQL`과 `Node.js`의 조합을 언급했다. `Node.js` 쪽에서 callback 지옥을 헤치면서 Async로 전진해와도, 결국 DB 작업 호출 시에는 `MySQL`에서 제공하는 드라이버를 호출하게 되는데, 이 드라이버가 `Blocking` 방식이라고 한다.

>Blocking-Async는 별다른 장점이 없어서 일부러 사용할 필요는 없지만, NonBlocking-Async 방식을 쓰는데 그 과정 중에 하나라도 Blocking으로 동작하는 놈이 포함되어 있다면 의도하지 않게 Blocking-Async로 동작할 수 있다.


><font size="6">Refernce</font>
- http://homoefficio.github.io/2017/02/19/Blocking-NonBlocking-Synchronous-Asynchronous/
