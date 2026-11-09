+++
title = "LDE와 런타임 스케줄링: Go, Rust, Java"
slug = "os-limited-direct-execution"
date = "2026-10-05T17:22:05+09:00"
draft = false
tags = ["os", "ostep", "scheduling", "runtime"]
+++

## 개요
OS에게 안전한 처리를 맡기고, 적절히 제공하기 위해 우리는 커널과 유저모드를 나누었다. 특히, 적절한 스케쥴링과 함께라면 우리는 OS로 하여금 좋은 퍼포먼스를 제공 받을 수 있을 것이다. 다만, 요즘의 프로그래밍 언어들은 여기에서 멈추지 않는다.
특히, 경량 스레드라는 모델링은 현대 시스템의 맞는 런타임 추상화를 한 번 더 진행했다. 복잡도를 늘리는 대신 OS 스레드의 스케쥴링과는 전혀 다른 영역에 런타임 스케쥴링을 하도록 하여 컨텍스트 스위칭 비용을 줄이고 효율성을 높인다. 이에 대한 간략한 추상화를 알아보자.
## 경량 스레드
경량 스레드란 기본적으로 점점 더 복잡해지고 커지는 시스템에서, 전통적인 thread-per-request 모델로는 부족한 상황을 기반으로 발전했다. 기본적으로 우리는 시스템을 작성하며 수많은 I/O와 싸운다. 그리고 이를 위해 실제 OS Thread를 block 시키고 기다린다. 이러한 I/O는 상대적으로 **"매우 느리다"**. 서버 시스템의 대부분의 로직은 I/O 대기에 쓰인다.

그렇기에 2000년대 초반에는 이벤트 기반 I/O 방식(kqueue, epoll 등) 발전했다. 그렇기에 나온 것들이 Reactor, Loom, Netty 등이다. 다만, 이러한 이벤트 기반 방식은 콜백 지옥과, 에러 전파 등의 문제로 우리가 코드를 작성하는 방식을 더욱더 어렵게 만들었다. **함수의 색(Function Coloring Problem)** 문제로인해 이러한 이벤트 기반의 작성된 것이 점점 더 모든 코드를 비슷한 방식으로 작성하게 만든다.

경량 스레드는 기존에 코드 작성 방식을 고수하되, 언어단에서 이를 추상화하여 제공하는 데에 있다. 특히, Java의 VT는 sycronized 와 같은 Carrie Thread를 Block 하는 방식이 아니라면 대부분의 Thread-per-request 모델의 코드에서 쉽게 대체할 수 있다.
## OS 스케줄링 위에 런타임 스케줄링을 올린다면
[4. The Process](/os-process/)에서는 프로세스 내부에 여러 실행 흐름이 존재할 수 있고, 이들을 커널 스레드에 배정하는 런타임이 있다는 점을 살펴보았다. 여기서는 그 실행 흐름이 **어떻게 멈추고, 다시 실행되는지**를 Go, Rust, Java를 통해 비교해보자.
먼저 LDE(Limited Direct Execution)는 사용자 코드를 CPU에서 직접 실행하되, 특권 작업은 커널에 맡기고 타이머 인터럽트 등을 통해 OS가 제어권을 되찾는 방식이다. [\[1\]](#ref-1) 런타임 스케줄링은 이 구조 위에 한 계층을 더 올린다.
```text
goroutine / async task / virtual thread
                  │
                  │ 런타임: 어떤 작업을 실행할까?
                  ▼
              OS thread
                  │
                  │ OS: 어떤 스레드에 CPU를 줄까?
                  ▼
                 CPU
```

런타임이 작업 A 대신 B를 실행하기로 했어도, 그 작업을 수행할 OS 스레드가 CPU를 배정받지 못하면 B 역시 실행되지 않는다. 런타임 스케줄링은 OS 스케줄링을 대체하지 않는다.
또한 경량 실행 흐름의 전환을 사용자 공간에서 처리할 수 있다는 것과 syscall을 없앤다는 것은 다르다. 네트워크나 파일 I/O에는 여전히 OS의 도움이 필요하다. 주요 이점은 **대기 중인 작업마다 OS 스레드를 하나씩 붙잡아 둘 필요를 줄이는 것**이다.

## Topology

### 선점형(preemptive)과 협력형(cooperative)
선점형(preemptive)에서는 실행 중인 작업이 명시적으로 양보하지 않아도 스케줄러가 실행을 중단하고 다른 작업을 실행할 수 있다. OS의 타이머 기반 시분할이 대표적인 예다.
협력형(cooperative)에서는 작업이 대기하거나 양보하는 지점에서 스케줄러로 제어권이 돌아온다. 작업이 긴 계산을 수행하며 제어권을 돌려주지 않으면 다른 작업의 실행이 지연될 수 있다.
여기서 어느 계층의 선점인지 구분해야 한다. OS가 worker thread를 선점해도, 그 worker 위에서 실행하던 task가 런타임의 다른 task로 교체되는 것은 아니다. worker가 CPU를 다시 얻으면 같은 task의 계산을 이어갈 수 있다.

### Stackful과 stackless
**Stackful**은 실행 흐름마다 호출 스택을 보존한다. `handle → fetch → read`처럼 일반 함수를 여러 겹 호출한 상태에서도, 런타임이 지원하는 대기 지점에서 멈췄다가 호출 흐름을 이어갈 수 있다.
**Stackless**는 실행 흐름마다 독립적인 호출 스택을 보존하는 대신, 중단 위치와 재개에 필요한 지역 변수 등을 상태 객체에 저장한다. Rust의 `async/await`처럼 컴파일러가 코드를 상태 머신으로 변환하는 방식이 대표적이다.

> **Stackless는 스택을 쓰지 않는다는 뜻이 아니다**
> 실행 중에는 worker thread의 일반 호출 스택을 사용한다. 다만 중단된 task마다 독립적인 호출 스택을 유지하지 않는다는 뜻이다. 상태 객체가 반드시 힙에 할당되는 것도 아니다.

## Go: Stackful goroutine과 G-M-P 스케줄러

| 요소 | 의미 |
| --- | --- |
| G | goroutine. 실행할 코드와 실행 상태 |
| M | OS thread. 실제 코드를 실행하는 스레드 |
| P | Go 코드를 실행하는 데 필요한 스케줄러·할당기 자원 |

Go에서는 `go handle()`처럼 새로운 goroutine을 시작한다. 일반 함수 호출 방식으로 코드를 작성하면서, 런타임이 실행 흐름의 중단과 재개를 관리한다. Go 런타임의 스케줄러는 세 가지 요소를 연결한다
P는 물리 CPU 코어가 아니다. P의 개수는 `GOMAXPROCS`이며, 동시에 Go 코드를 실행할 수 있는 병렬성의 상한을 정한다. syscall 등으로 대기하는 M이 존재할 수 있으므로, M의 개수와 P의 개수도 같지 않다. 각 goroutine은 작게 시작해서 필요에 따라 크기가 조정되는 독립적인 스택을 가진다. 따라서 stackful로 분류할 수 있다. [\[2\]](#ref-2)

네트워크 읽기가 즉시 완료되지 않으면, Go 런타임의 netpoller와 연동된 I/O에서는 해당 G를 대기시키고 M이 다른 G를 실행할 수 있다. 반면 실제로 OS 스레드를 막는 syscall이나 외부 코드 호출도 존재한다. 이런 경우에는 P를 다른 M이 사용할 수 있게 하여 다른 G의 진행을 지원한다. 모든 대기가 같은 방식으로 처리되는 것은 아니다. [\[3\]](#ref-3)

Go는 대기나 명시적 양보에 의한 전환뿐 아니라 런타임의 선점도 지원한다. Go 1.14에서 도입된 비동기 선점은 함수 호출 없이 오래 실행하는 tight loop도 다른 goroutine의 실행을 막지 않도록 개선했다. 다만 모든 명령어 위치에서 무조건 선점 가능한 것은 아니며, 런타임의 안전 지점과 플랫폼 제약이 있다. [\[4\]](#ref-4), [\[5\]](#ref-5)

## Rust: Stackless Future와 executor

Rust에서는 OS 스레드와 async task를 먼저 구분해야 한다. `std::thread`는 OS 스레드를 사용하는 모델이고, `async/await`는 `Future`를 만드는 모델이다. **Rust 언어가 하나의 async 스케줄러를 정해주는 것은 아니다.** 여기서는 Tokio를 대표적인 executor로 살펴본다. [\[6\]](#ref-6), [\[7\]](#ref-7)
```rust
async fn handle() {
    let response = fetch().await;
    save(response).await;
}
```
이 코드는 개념적으로 `fetch를 기다리는 상태 → save를 기다리는 상태 → 완료`로 진행하는 상태 머신이 된다. 중단 이후에도 필요한 값은 Future의 상태에 보관한다. 일반 함수의 호출 스택 전체를 task 전용으로 유지하지 않으므로 stackless다. [\[8\]](#ref-8) Executor는 Future의 `poll()`을 호출해 작업을 진행한다.

```text
executor가 task의 Future를 poll
               │
        ┌──────┴──────┐
        ▼             ▼
      Ready         Pending
      완료          executor로 반환
                      │
                 I/O 등의 이벤트
                      │
                 Waker로 재실행 요청
                      │
                 다시 poll
```

`Pending`은 지금 더 진행할 수 없다는 의미다. 이벤트가 발생하면 `Waker`를 통해 task가 다시 실행될 수 있도록 알린다. Waker가 직접 작업을 끝내거나, executor가 모든 Future를 계속 반복 조회하는 구조는 아니다. 또한 중첩된 모든 Future가 독립적으로 스케줄링되는 것도 아니다. 보통 executor는 task를 스케줄링하고, 그 task의 Future가 내부 Future들을 poll한다. [\[9\]](#ref-9)
여기서 `.await`는 무조건 양보하는 지점이 아니다. 기다리는 Future가 즉시 `Ready`를 반환하면 같은 실행 흐름에서 다음 코드로 진행한다. `Pending`이 바깥 task까지 전달되어 `poll()`이 반환되어야 executor가 다른 task를 실행할 기회를 얻는다. 따라서 `.await` 없이 긴 계산을 하거나, 계속 즉시 완료되는 Future만 기다리면 worker를 오래 점유할 수 있다. [\[10\]](#ref-10)
Tokio의 multi-thread runtime은 worker pool과 work stealing을 사용한다. current-thread runtime은 한 스레드에서 task들을 실행한다. Tokio에는 협력적 실행 예산도 있지만, 임의의 사용자 계산을 타이머로 강제 중단하는 방식은 아니다. 블로킹 작업은 `spawn_blocking` 등으로 분리할 수 있으며, CPU 계산의 병렬성은 별도로 제한해야 한다. [\[7\]](#ref-7), [\[11\]](#ref-11)

### 예제 1: poll은 작업을 한 번 진행시키는 함수

`Future`는 아직 완료되지 않았을 수 있는 작업을 표현하는 값이다. `poll()`은 그 작업에 **“지금 실행을 진행해보고, 끝났으면 결과를 돌려줘”**라고 요청하는 함수다. 단순히 완료 여부만 조회하는 것이 아니라 실제 코드를 실행해 진행시킨다. [\[9\]](#ref-9)

| 반환값 | 의미 | 호출한 쪽의 동작 |
| --- | --- | --- |
| `Poll::Ready(value)` | 작업이 끝났고 결과가 나왔다 | 결과를 사용한다. 완료된 Future를 다시 poll하지 않는다 |
| `Poll::Pending` | 이번 호출에서는 완료되지 않았다 | 호출에서 돌아와 다른 일을 할 수 있다 |

아래 예제는 첫 번째 poll에서는 한 번 양보하고, 두 번째 poll에서는 `42`를 반환한다. I/O 없이 `Pending → wake → 다시 poll → Ready`의 관계를 보여주는 예제다.

```rust
use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;
use std::task::{Context, Poll, Wake, Waker};

struct YieldOnce {
    yielded: bool, // 이전 poll에서 양보했는지 보관하는 상태
}

impl Future for YieldOnce {
    type Output = u32;

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<u32> {
        if !self.yielded {
            self.yielded = true;
            // 다음에는 진행할 수 있으므로 재실행을 요청한다.
            cx.waker().wake_by_ref();
            Poll::Pending
        } else {
            Poll::Ready(42)
        }
    }
}

// 실제 실행 큐 대신, wake 요청을 출력만 하는 교육용 Waker.
struct PrintWake;

impl Wake for PrintWake {
    fn wake(self: Arc<Self>) {
        println!("wake: 다시 poll해 주세요");
    }
}

fn main() {
    let waker = Waker::from(Arc::new(PrintWake));
    let mut cx = Context::from_waker(&waker);
    let mut future = Box::pin(YieldOnce { yielded: false });

    println!("첫 poll: {:?}", future.as_mut().poll(&mut cx));
    // 실제 executor라면 wake 요청을 받아 나중에 다시 poll한다.
    println!("둘째 poll: {:?}", future.as_mut().poll(&mut cx));
}
```

출력은 다음과 같다.

```text
wake: 다시 poll해 주세요
첫 poll: Pending
둘째 poll: Ready(42)
```

첫 호출이 끝나도 `yielded = true`는 Future에 남아 있으므로 두 번째 호출에서 다음 상태로 진행할 수 있다. `Context`는 현재 task의 `Waker`를 전달하고, `Waker`는 executor에 재실행을 요청하는 수단이다. `Pin`은 Future가 요구하는 메모리 위치 보장과 관련된 타입이며, 여기서는 `Box::pin`으로 준비했다고 이해하면 된다. [\[9\]](#ref-9), [\[12\]](#ref-12)

이 예제의 `PrintWake`는 출력만 하므로 두 번째 poll을 직접 호출했다. 실제 executor는 실행 큐를 관리한다. 위처럼 한 번 양보하는 Future는 자기 자신을 깨우지만, I/O Future는 보통 이벤트가 발생했을 때 깨우도록 등록한다. `Pending`만 반환하고 깨울 방법을 마련하지 않으면 작업이 다시 실행되지 않을 수 있다. [\[9\]](#ref-9)

### 예제 2: 소켓을 기다리는 것은 무엇을 기다리는가?

TCP 연결을 맺었다고 해서 상대방이 보낼 데이터가 이미 도착한 것은 아니다. **I/O 대기**는 이 예제에서 “상대방이 보낸 바이트를 아직 읽을 수 없어서 더 진행하지 못하는 상태”다.

동기 방식의 blocking read는 데이터를 기다리는 동안 호출한 OS 스레드를 막는다. 이 스레드는 다른 작업의 코드를 실행할 수 없다. 반면 Tokio의 TCP 읽기는 데이터가 없으면 깨울 방법을 등록하고 `Pending`을 반환한다. 기다리는 실행 흐름의 상태는 남지만, worker는 다른 작업을 실행할 수 있다. [\[13\]](#ref-13)

아래 프로그램은 **한 worker thread**에서 TCP 송신·수신과 다른 작업을 함께 진행한다. 별도의 외부 서버는 필요 없다. 서버는 연결을 받은 뒤 500ms 후에 `ping`을 보내고, 그동안 다른 작업은 100ms 후에 메시지를 출력한다.

`Cargo.toml`의 의존성:

```toml
[dependencies]
tokio = { version = "1", features = ["rt", "macros", "net", "io-util", "time"] }
```

`src/main.rs`:

```rust
use std::io;
use std::time::Duration;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::{TcpListener, TcpStream};
use tokio::time::sleep;

#[tokio::main(flavor = "current_thread")]
async fn main() -> io::Result<()> {
    let listener = TcpListener::bind("127.0.0.1:0").await?;
    let mut client = TcpStream::connect(listener.local_addr()?).await?;

    let sender = async {
        let (mut socket, _) = listener.accept().await?;
        sleep(Duration::from_millis(500)).await;
        socket.write_all(b"ping").await?;
        Ok::<(), io::Error>(())
    };

    let receiver = async {
        let mut buf = [0u8; 4];
        println!("수신: 데이터를 기다립니다");
        client.read_exact(&mut buf).await?;
        println!("수신: {}", String::from_utf8_lossy(&buf));
        Ok::<(), io::Error>(())
    };

    let other_work = async {
        sleep(Duration::from_millis(100)).await;
        println!("다른 작업: 수신 대기 중에도 실행됩니다");
    };

    let (sent, received, _) = tokio::join!(sender, receiver, other_work);
    sent?;
    received?;
    Ok(())
}
```

`cargo run`으로 실행하면 다음 순서로 출력된다.

```text
수신: 데이터를 기다립니다
다른 작업: 수신 대기 중에도 실행됩니다
수신: ping
```

`read_exact`는 버퍼를 채울 때까지 읽는 Future를 만든다. TCP에서는 데이터가 나뉘어 도착할 수 있으므로, 여기서는 4바이트가 모두 모여야 `.await` 다음으로 진행한다. `sleep().await`도 worker를 막는 `std::thread::sleep()`과 달리 타이머를 기다리는 Future다. [\[7\]](#ref-7), [\[14\]](#ref-14)

이 예제의 `join!`은 세 Future를 한 task 안에서 함께 진행한다. 별도 task를 세 개 만드는 것은 아니다. [\[15\]](#ref-15) 수신 Future가 `Pending`을 반환하면 같은 task 안에서 다른 Future도 진행할 수 있고, 모두 대기 중이라면 바깥 task도 `Pending`을 반환한다.

### 데이터가 도착하면 누가 다시 poll하는가?

수신 측 흐름을 단순화하면 다음과 같다. Tokio의 runtime에는 task를 실행하는 scheduler와 I/O 이벤트를 처리하는 driver가 함께 있다. [\[7\]](#ref-7), [\[13\]](#ref-13)

```text
executor가 바깥 Future를 poll
    ↓
receiver 안에서 read_exact의 Future를 poll
    ↓
아직 읽을 데이터가 없음
    ├─ 읽기 가능 이벤트가 오면 현재 task를 깨우도록 등록
    └─ Pending 반환
    ↓
다른 Future / 실행 가능한 다른 task 진행

상대방이 데이터 전송 → OS가 소켓의 읽기 가능 상태를 알림
    ↓
Tokio I/O driver가 이벤트 처리
    ↓
등록된 Waker로 task의 재실행 요청
    ↓
executor가 바깥 Future를 다시 poll
    ↓
read_exact가 읽기를 진행
    ├─ 아직 4바이트가 안 모임 → 다시 대기할 수 있음
    └─ 4바이트가 모임 → Ready → .await 다음 코드 실행
```

여기서 **wake는 완료 통보가 아니라 다시 진행을 시도하라는 요청**이다. 읽기 가능 이벤트를 받았어도 실제 읽기가 다시 대기 상태가 될 수 있다. Future의 `poll()`도 Unix의 `poll(2)` syscall과는 별개의 함수다. [\[9\]](#ref-9), [\[13\]](#ref-13)

> **worker도 아무 일이 없으면 기다릴 수 있다**
> 실행 가능한 작업이 하나도 없으면 runtime의 스레드가 OS 이벤트를 기다릴 수 있다. 핵심은 I/O 요청마다 스레드를 하나씩 붙잡아 두지 않아도 된다는 것이다. 또한 파일 I/O 등은 내부적으로 blocking thread pool을 사용하는 경우가 있으므로, 이 TCP 예제의 동작을 모든 I/O에 그대로 적용하면 안 된다. [\[16\]](#ref-16)

## Java: Platform thread와 stackful virtual thread

Java의 platform thread는 OS 스레드에 대응하며, 실행 순서는 주로 OS 스케줄러가 결정한다. 반면 JDK 21에서 정식 도입된 virtual thread는 JVM이 여러 실행 흐름을 carrier thread들에 배정하는 모델이다.

```text
여러 Virtual Thread
          │
          │ JVM scheduler
          ▼
여러 Carrier Thread(OS thread)
          │
          │ OS scheduler
          ▼
         CPU
```

Virtual thread는 호출 스택을 보존하는 stackful 모델이다. 개발자는 일반적인 순차 코드와 blocking API를 사용하고, 지원되는 대기 상황에서는 JVM이 virtual thread를 carrier에서 분리(unmount)한다. 이때 스택은 힙의 stack chunk로 보관된다. 이후에는 다른 carrier에 다시 배정(mount)되어 실행을 이어갈 수도 있다. [\[17\]](#ref-17)
Goroutine과 비슷해 보이지만 선점 방식에는 차이가 있다. JEP 444에서 설명하는 virtual thread scheduler는 FIFO 모드의 work-stealing `ForkJoinPool`이며, virtual thread마다 CPU 시간 조각을 나누어 강제 교체하는 time sharing을 구현하지 않는다. 긴 계산을 수행하는 virtual thread는 carrier를 계속 점유할 수 있다. OS가 그 carrier를 선점하는 것과 JVM이 다른 virtual thread를 carrier에 올리는 것은 별개다. [\[17\]](#ref-17)

또한 모든 blocking 작업이 carrier를 반환하는 것은 아니다. JDK 21에서는 `synchronized` 내부의 blocking으로 인한 pinning이 주요 제약이었다. JDK 24의 JEP 491은 이 제약을 해소했지만, native 코드 등과 관련된 제약은 별도로 살펴야 한다. 따라서 virtual thread의 대기 동작을 설명할 때는 JDK 버전도 함께 명시해야 한다. [\[18\]](#ref-18)

## 같은 I/O 대기를 서로 다르게 표현한다
세 모델 모두 I/O를 기다리는 동안 다른 작업을 진행할 수 있게 하지만, 멈춘 실행을 표현하는 방식이 다르다.

| 비교 항목        | Go goroutine   | Rust async + Tokio                    | Java virtual thread               |
| ------------ | -------------- | ------------------------------------- | --------------------------------- |
| 런타임이 실행하는 단위 | G(goroutine)   | task의 Future를 poll                    | virtual thread                    |
| 중단 상태 보존     | 독립적인 호출 스택     | Future의 상태 머신                         | 호출 스택, 중단 시 stack chunk           |
| 분류           | Stackful       | Stackless                             | Stackful                          |
| 작업 간 전환      | 대기·양보 + 런타임 선점 | poll 반환을 통한 협력형 전환                    | 대기·양보 중심, 시간 조각 기반 선점 없음          |
| OS 스레드와의 관계  | 여러 G를 여러 M에 배정 | 여러 task를 worker에서 실행, executor에 따라 다름 | 여러 virtual thread를 여러 carrier에 배정 |
| 코드에 보이는 대기   | 일반 함수 호출       | 명시적인 `.await`                         | 일반적인 blocking API 호출              |

이 표는 Go 런타임, Rust의 async/await와 Tokio, JEP 444의 Java virtual thread 모델을 비교한 것이다. 언어 전체를 하나의 스케줄링 방식으로 분류한 표는 아니다. 예를 들어 네트워크 응답을 기다리는 요청이 10,000개 있다고 하자. 각 요청마다 OS 스레드를 계속 유지하는 모델에서는 대기 중에도 많은 스레드 자원을 사용한다. 반면 위의 모델들은 호출 스택이나 Future 상태로 대기 중인 작업을 보관하고, 실행 가능한 작업에 OS 스레드를 사용할 수 있다.
다만 대기 중인 요청이 많다는 것과, 동시에 계산할 수 있는 요청이 많다는 것은 다르다. 경량 실행 흐름을 늘려도 CPU 코어와 사용 가능한 CPU 시간은 늘어나지 않는다. [4. The Process](/os-process/)에서 살펴본 cgroup의 CPU quota 역시 아래 계층의 OS 스레드 실행에 적용되므로, 런타임은 그 한도 안에서 작업을 배정해야 한다.

## References

<a id="ref-1"></a>
[1] R. H. Arpaci-Dusseau and A. C. Arpaci-Dusseau, “Mechanism: Limited Direct Execution,” *Operating Systems: Three Easy Pieces, ver. 1.10, ch. 6, Arpaci-Dusseau Books*, Nov. 2023. [Online]. Available: <https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-mechanisms.pdf>. Accessed: Nov. 9, 2026.

<a id="ref-2"></a>
[2] The Go Authors, “Source file runtime/HACKING,” *The Go Programming Language*. [Online]. Available: <https://go.dev/src/runtime/HACKING>. Accessed: Nov. 9, 2026.

<a id="ref-3"></a>
[3] The Go Authors, “Source file runtime/proc.go,” *The Go Programming Language*. [Online]. Available: <https://go.dev/src/runtime/proc.go>. Accessed: Nov. 9, 2026.

<a id="ref-4"></a>
[4] The Go Authors, “Go 1.14 Release Notes,” *The Go Programming Language*. [Online]. Available: <https://go.dev/doc/go1.14>. Accessed: Nov. 9, 2026.

<a id="ref-5"></a>
[5] The Go Authors, “Source file runtime/preempt.go,” *The Go Programming Language*. [Online]. Available: <https://go.dev/src/runtime/preempt.go>. Accessed: Nov. 9, 2026.

<a id="ref-6"></a>
[6] The Rust Project Developers, “std::thread,” *Rust Documentation*. [Online]. Available: <https://doc.rust-lang.org/std/thread/index.html>. Accessed: Nov. 9, 2026.

<a id="ref-7"></a>
[7] The Tokio Contributors, “tokio::runtime,” *Tokio Documentation*. [Online]. Available: <https://docs.rs/tokio/latest/tokio/runtime/index.html>. Accessed: Nov. 9, 2026.

<a id="ref-8"></a>
[8] The Rust Project Developers, “Futures and the Async Syntax,” *Rust Documentation*. [Online]. Available: <https://doc.rust-lang.org/book/ch17-01-futures-and-syntax.html>. Accessed: Nov. 9, 2026.

<a id="ref-9"></a>
[9] The Rust Project Developers, “Future in std::future,” *Rust Documentation*. [Online]. Available: <https://doc.rust-lang.org/std/future/trait.Future.html>. Accessed: Nov. 9, 2026.

<a id="ref-10"></a>
[10] The Rust Project Developers, “Await expressions,” *Rust Documentation*. [Online]. Available: <https://doc.rust-lang.org/reference/expressions/await-expr.html>. Accessed: Nov. 9, 2026.

<a id="ref-11"></a>
[11] The Tokio Contributors, “tokio::task::coop,” *Tokio Documentation*. [Online]. Available: <https://docs.rs/tokio/latest/tokio/task/coop/index.html>. Accessed: Nov. 9, 2026.

<a id="ref-12"></a>
[12] The Rust Project Developers, “Wake in std::task,” *Rust Documentation*. [Online]. Available: <https://doc.rust-lang.org/std/task/trait.Wake.html>. Accessed: Nov. 9, 2026.

<a id="ref-13"></a>
[13] The Tokio Contributors, “AsyncRead in tokio::io,” *Tokio Documentation*. [Online]. Available: <https://docs.rs/tokio/latest/tokio/io/trait.AsyncRead.html>. Accessed: Nov. 9, 2026.

<a id="ref-14"></a>
[14] The Tokio Contributors, “AsyncReadExt in tokio::io,” *Tokio Documentation*. [Online]. Available: <https://docs.rs/tokio/latest/tokio/io/trait.AsyncReadExt.html>. Accessed: Nov. 9, 2026.

<a id="ref-15"></a>
[15] The Tokio Contributors, “join in tokio,” *Tokio Documentation*. [Online]. Available: <https://docs.rs/tokio/latest/tokio/macro.join.html>. Accessed: Nov. 9, 2026.

<a id="ref-16"></a>
[16] The Tokio Contributors, “tokio::fs,” *Tokio Documentation*. [Online]. Available: <https://docs.rs/tokio/latest/tokio/fs/index.html>. Accessed: Nov. 9, 2026.

<a id="ref-17"></a>
[17] R. Pressler and A. Bateman, “JEP 444: Virtual Threads,” *OpenJDK*. [Online]. Available: <https://openjdk.org/jeps/444>. Accessed: Nov. 9, 2026.

<a id="ref-18"></a>
[18] Oracle, “Significant Changes in JDK 24 Release,” *Java Documentation*. [Online]. Available: <https://docs.oracle.com/en/java/javase/24/migrate/significant-changes-jdk-24.html>. Accessed: Nov. 9, 2026.
