---
title: "Node.js 이벤트 루프"
tags:
  - js
  - event_loop
categories:
  - nodejs
last_modified_at: 2020-11-27T13:00:00+18:00
toc: true
---

# Introduction

`Node.js`를 통해 개발하면서 사용할 줄만 알았지 제대로 된 개념하나 안 잡힌 것 같아 포스트를 작성한다. 이벤트 루프에 대해 알아보자. 블로그에서 최근 작성한 글 중에서 가장 긴 글이 되지 않을까 싶다.

# Event Loop

자바스크립트는 알다 싶이 단일 스레드 기반의 언어다. 단일 쓰레드라는 의미는 들어오는 작업에 대해 순차적으로, 동시성을 지원하지 못하는 순차적인 실행 구조를 가졌다는 의미다.

하지만, 우리는 JS로 비동기와 관련된 여러 기능들을 자유롭게 사용할 수 있다. 이는 어떻게 가능한 것일까?

>이때 등장하는 개념이 바로 '이벤트 루프'이다. Node.js를 소개할 때 '이벤트 루프 기반의 비동기 방식으로 Non-Blocking IO를 지원하고..' 와 같은 문구를 본 적이 있을 것이다. 즉, 자바스크립트는 이벤트 루프를 이용해서 비동기 방식으로 동시성을 지원한다.


## Structure

![이미지](/assets/images/event_loop_node_js.png)

이벤트 루프에 대해 알아보기 위해, `Node.js` 내부로 들어가보려 한다. 보다 자세한 설명은 너무나도 친절하게 쓰여진 [공식문서](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)에서 확인할 수 있다. 시간이 남는다면 읽는 것을 추천한다.

`node.js` 이벤트 루프에서는 `phase` 단위로 나뉘어져 있다. 이벤트 루프를 쉽게 설명하기 위해 하나의 `Queue`만을 사용한 그림 등을 본적이 있겠지만, 이는 너무 포괄적인 개요가 아닌가 싶다.

각 `phase`는 저마다 특정 작업을 실행하며, 콜백을 저장하는 `FIFO Queue`를 가지고 있다. `idle, prepare` 페이즈를 제외한 어느 단계에서나 자바스크립트 실행이 일어나며, 특정 `phase`에 존재하는 대기열을 모두 소진하거나 그 페이즈에서 실행할 수 있는 콜백의 최대 수를 넘었을 경우에 다음 페이즈로 진행한다.

## Phases Overview

### timers

`setTimeout`, `setInterval`에 의해 스케쥴된 콜백을 실행하는 페이즈다.

`setTimeout`은 만료 후 가능한한 빨리 실행되어야 하는 콜백을 가진다. `delay`를 파라미터로 줄 수 있다. 여기서 알아둬야할 것은 딜레이를 `0ms`로 줄 수 없다는 것이다. 내부적으로 타이머의 최소단위를 지정하기 때문에 그 최소단위만큼 지난 후에 태스크 큐에 추가된다.

"즉시"라는 의미를 충족시키기 위해 `setImmediate`가 제안되었다. 현재 `Poll phase`가 끝난 뒤 즉시 시작하도록 설계된 함수다.

`setImmediate`는 안타깝게도 표준 반열에 오르지 못하고 `IE10` 이상에만 포함되었는데, `Node`에는 이런 용도를 위해 `nextTick`라는 함수가 존재한다. 자세한 내용은 추후 설명하겠다.

### pending callbacks

이전 루프에서 연기된 `I/O callback`을 실행한다.

`pending_queue` 들어와 있는 콜백들은 현재 돌고 있는 루프 이전에 한 작업에서 이미 큐에 들어왔던 콜백이다. 예를들어 TCP 핸들러 콜백 함수에서 파일에뭔가 썼다면, TCP 통신과 파일 쓰기가 종료 후 파일 쓰기에 대한 콜백이 이 큐에 들어오는 것이다.

또한, 에러 콜백도 `pending_queue`에 들어온다.

### idle, prepare

[내부적으로 사용한다.](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#phases-overview)

### Poll phase

`I/O 콜백`을 허용한다. 예로들면 `fs.readFile`에 넘겨준 콜백인자가 `I/O` 작업이 끝난 후에 실행된다.

평소에 `Poll queue(watcher_queue)`가 비어있다면, 곧바로 페이즈로 넘어가는 것이 아니라 약간에 대기시간을 가지고 콜백이 들어오면 바로 실행한다.

이 대기시간은 아래서 설명하겠지만, 기준은 `Timer queue`에 콜백의 존재 유무다.

### Check phase

`setImmediate`만을 위한 페이즈다. 추후 설명하겠다.

### Close callbacks

`socket.on('close', () =>{})`과 같은 `close` 이벤트 타입의 헨들러가 여기서 처리된다.

## Microtasks, NextTick?

- `Microtasks`란 다음 페이즈로 넘어가기 전에 반드시 실행되어야 할 콜백이다. 예로는 프로미스의 Resolve된 콜백이 있다.

- `nextTick` 0.9버전 이상의 노드에서는 `Microtasks`를 이용하도록 변경되었다. 자세한 설명은 이 포스트에서 하긴 어려울 것 같다. [공식문서](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#process-nexttick)에서 확인하길 바란다.

위와 같은 콜백을 담당하는 `Queue`는 `nextTickQueue와` `microTaskQueue`라 불린다.

위에 나온 그림에서도 얼핏 눈치챘을지 모르지만, 위 둘은 이벤트 루프에 일부가 아니다. `libUV` 라이브러리에 포함된 것이 아닌 노드에 포함된 기술이라는 의미다.

위 큐에 적재되어있는 작업은 반드시 현재 작업이 끝나자마자 바로 호출되어야 한다.

>libUV는 Node.js에서 사용하는 비동기 I/O 라이브러리이다. 이 라이브러리는 C로 작성되었고 윈도우나 리눅스 커널을 추상화해서 Wrapping하고 있는 구조이다. 즉, 커널에서 어떤 비동기 작업들을 지원해주는 지 알고 있기 때문에 커널을 사용하여 처리할 수 있는 비동기 작업을 발견하면 바로 커널로 작업을 넘겨버린다.
<br>
이후 이 작업들이 종료되어 OS 커널로부터 시스템 콜을 받으면 이벤트 루프에 콜백을 등록하는 것이다. 만약 OS 커널이 지원하지 않는 작업일 경우 별도의 스레드에 작업을 던져서 처리한다. 이 스레드에 관한 내용은 원작자가 밑에서 추가적으로 설명하고있다.

>microtasks와 일반 task, Scheduled와 관련해 인터랙션과 함께 잘 정리된 글이 있어 아래 링크를 남긴다. 이 포스트와 함께 읽는다면 좋을 것 같다. https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/

## Event loop phases in more detail

개요가 너무 길었다 자세하게 알아보자.

우선 우리가 실행하려는 자바스크립트 파일 `hello.js`을 보자. 콘솔에서 `node hello.js`를 입력한다면 노드는 이벤트 루프를 생성 후 루프 바깥에서 메인 모듈인 `hello.js`를 실행한다. 한 번 메인 모듈이 실행된 후에 노드는 이벤트 루프에서 처리해야할 작업이 있다면 루프로 들어가 `timer phase`부터 시작한다. 만약 없다면, `process.on('exit', foo)` 종료 콜백을 실행한다.

![이미지](/assets/images/nodejs-event-loop-workflow.png)

### Timer Phase

이벤트 페이즈가 타이머 페이즈에 들어가게 되면 실행할 타이머 콜백 큐를 탐색한다. 사실, 앞에서 각 페이즈에는 `FIFO Queue`가 존재한다 하였다. 이는 큐에 들어있는 작업의 포지션을 절대 변경하지 않는다는 것이다. 무조건 큐에 먼저 들어간 작업이 먼저 실행된다. 또한, 이를 실질적으로 감리감독하는 자료구조의 실체는 `min heap`이다.

느슨한 순서로 저장된 자료구조 `min heap`에서 특정 시점 콜백이 실행시간을 만족하는지 확인한다. 만약 만족하지 못할 경우 이후 콜백은 확인할 필요가 없다.(정렬되어 있으니)

### Pending I/O Phase

타임 페이즈가 종료된 후 이벤트 루프는 펜딩 I/O 페이즈에 진입한다. 가장 먼저 `pending queue`에 이전 작업들의 콜백이 실행 대기 중인지 확인한다. 만약 실행 대기 중이라면, 대기열이 소진되거나 시스템의 실행 한도를 초과할 때까지 콜백을 실행한다. 이 과정이 종료되면 이벤트 루프는 `Idle Handler Phase`로 이동한 후 내부 처리를 위한 `Prepare Phase`를 거쳐 최종적으로 `Poll Phase`에 도달하게 된다.

### Poll Phase

이 페이즈는 폴링을 진행하는 단계다. 이벤트 루프가 이 페이즈에 들어왔을 경우 `polling queue(watcher_queue)` 내부파일 읽기에 대한 콜백, HTTP 응답 콜백과 같은 작업이 존재하며, 시스템 한도 내에서 이를 실행시킨다.

만약 더 이상 실행할 콜백이 없다면,  `check_queue`, `pending_queue`, `closing_callbacks_queue`에 해야할 작업이 있는지를 검사하고, 만약 해야할 작업이 있다면 바로 `Poll phase가` 종료되고 다음 페이즈로 넘어가게 된다. 하지만 특별히 해야할 작업이 더 이상 없는 경우 `Poll phase`는 다음 페이즈로 넘어가지 않고 계속 대기하게 된다.

대기시간에 제약은 아래 알고리즘을 따른다.
1. `Check Phase`에 실행할 콜백이 있는가?
2. 없다면 `Timer`에 있는가? -> 타이머 페이즈가 실행 가능한 시간까지 대기 후 타이머 페이즈로 간다.
3. 없다면 대기

### Check Phases

`Poll Phase`가 지나면 이벤트 루프의 다음 목적지로 `API` 콜백과 관련있는 `Check phase`로 들어온다. 이 페이즈에선 `setImmediate`의 콜백을 실행한다. 다른 페이즈와 마찬가지로 큐가 비거나 시스템 실행 한도 초과에 도달할 때까지 계속 해서 `setImmediate` 콜백들을 실행한다.

### Close Phase

`close`나 `destroy`를 관리하는 페이즈다.

이벤트 루프가 `Close callback`들과 함께 종료하면, 이벤트 루프는 다음에 돌아야할 루프가 존재하는지 확인한다. 만약 아니라면 이벤트 루프는 종료하게 된다. 수행할 것이 남아있으면 이벤트 루프 순회를 돌며 `Timer phase` 부터 다시 시작하게 된다.

# Example

## Basic

```javascript
setTimeout(() => {
    console.log('setTimeout');
}, 0);
setImmediate(() => {
  console.log('setImmediate');
});
```

`setTimeout`이 반드시 앞에 올거라는 확신을 할 수 있을까?

타이머는 시스템 시간과 사용자 제공 시간을 사용하여 등록한다. 이는 어떤 의미일까? 좀 더 자세하게 이야기하면 타이머는 메모리에 현재 타이머를 저장하게 된다. 그 순간 컴퓨터 성능이나 다른 외부 작업에 의해 약간의 딜레이가 발생할 수 있는 것이다.

또 다른 포인트는 노드가 `Timer phase`에 진입하기전에 변수 `now`를 선언하고 그 변수를 현재시간으로 간주한다는 점이다. 그러므로 정확한 계산이라고 하기에는 약간의 노이즈가 껴있고, 이게 바로 `setTimeout`이 반드시 먼저 실행될 것이라고 확신할 수 없는 불확실성의 이유가 된다.

하지만, 아래와 같은 코드처럼 `I/O 콜백` 사이클 내부로 옮긴다면 반드시 순서를 보장할 수 있다.

```javascript
fs.readFile('my-file-path.txt', () => {
  setTimeout(() => {
    console.log('setTimeout');
  }, 0);
  setImmediate(() => {
    console.log('setImmediate');
  });
});
```

순서대로 코드가 실행되는 동작을 확인하겠다.

1. `fs.readFile`을 만나면 이벤트 루프는 `libUV`에게 해당 작업을 보낸다.
2. 파일 읽기는 `OS Kernel`에서 `Asynchronous API`를 제공하지 않기 때문에 `libUV`는 별도의 스레드에 해당 작업을 던진다.
3. 작업이 완료되면 이벤트 루프는 `Pending I/O callback phase`의 `pending_queue`에 작업의 콜백을 등록한다.
4. 이벤트 루프가 `Pending Phase`를 지날 때 해당 콜백을 실행한다.
5. `setTimeout`의 콜백이 `Timer Phase` 큐에 등록된다.
6. `setImmediate`의 콜백이 `chekc Phase`에 등록된다.
7. `setImmediate를` 콘솔에 출력한다.
8. `setTimeout을` 콘솔에 출력한다.


## Timer에 이해

```javascript
var i = 0;
var start = new Date();
function foo () {
    i++;
    if (i < 1000) {
        setImmediate(foo);
    } else {
        var end = new Date();
        console.log("Execution time: ", (end - start));
    }
}
foo();
```

위 예시에서는 `foo`를 1000번 재귀호출한다.

```javascript
var i = 0;
var start = new Date();
function foo () {
    i++;
    if (i < 1000) {
        setTimeout(foo, 0);
    } else {
        var end = new Date();
        console.log("Execution time: ", (end - start));
    }
}
foo();
```

`setTimeout(foo, 0)`과 `setImmediate(foo)`는 놀랍게도 시간차이가 상당하다. 어째서일까? 정답은 시간을 비교하고 편차를 알아내는 작업이 CPU 연산을 상대적으로 많이 사용하기 때문이다.

`setImmediate`는 이러한 작업이 필요없기 때문에 상대적으로 매우 빠르다.



# FAQ

## 이벤트 루프는 자바스크립트 엔진 내부에 있나?

`ECMAScript`에는 이벤트 루프가 없다. `ES6`부터는 여러가지 지원하는 것들이 늘어났지만 기본적으로 자바스크립트 엔진 내부에 없으며, 이를 구동하는 환경인 웹브라우저나 `Node.js`에서 담당한다.

![이미지](/assets/images/js_inner.png)

그림에서도 볼 수 있듯이 실제로 우리가 비동기 호출에 사용하는 `setTimeout`과 같은 함수들이 엔진 내부가 아닌 `Web API` 영역에 따로 정의되어 있다.

예를들어 보자. `Node.js`는 비동기 지원을 `libuv`에서 제공하는 이벤트 루프를 통해 실현시켰다. 자바스크립트 엔진은 비동기 작업을 위해 내부 `API`를 호출하고 내부에 존재하는 이벤트 루프를 통해 스케쥴 되고 실행되는 것이다.

## 그래서 이벤트 루프는 어디서 실행되는데?

자바스크립트와 이벤트 루프는 다른 쓰레드를 통해 독립적으로 실행되는 것이 아니라. 이벤트 루프 자체에서 `V8` 혹은 다른 엔진을 사용하여 자바스크립트를 실행하는 것이다. 단 하나의 쓰레드를 사용하여 자바스크립트는 실행된다.

>실행 자체는 `Synchronous` 하며, 자바스크립트가 실행되지 않는다면 이벤트 루프 또한 진행되지 않는다.


## nextTickQueue과 microTaskQueue의 실행 시기는 언제인가?

즉시 실행되기를 바라는 두 큐는 언제 실행될까?

![이미지](/assets/images/nodejs-event-loop-workflow.png)

`IBM developer`의 `Node.js` 이벤트 루프에 대한 글에선 아래와 같이 설명하고 있다.

>Immediately after mainline finishes and after every phase of the event loop, the microtask callbacks run.

`nextTickQueue` 또한 마찬가지이며, `nextTickQueue는` `microTaskQueue` 보다는 높은 우선 순위를 가지고 있다.

# 글을 마치며..

오랜만에 좋은 블로그와 자료들을 찾아서 이를 나만의 방식으로 정리했다. 최근에 포스트를 단순히 옮겨적는 데에 치중했었는데 늘어졌던 자세를 바로잡는 기회가 되지 않았나 싶다.




><font size="6">Refernce</font>
- https://evan-moon.github.io/2019/08/01/nodejs-event-loop-workflow/
- https://meetup.toast.com/posts/89
- https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/
- https://developer.ibm.com/tutorials/learn-nodejs-the-event-loop/
- https://www.voidcanvas.com/nodejs-event-loop
