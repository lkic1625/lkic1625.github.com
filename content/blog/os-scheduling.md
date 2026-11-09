+++
title = "스케줄링: 네트워크, SQS, HTTP/2"
slug = "os-scheduling"
date = "2026-10-08T17:53:40+09:00"
draft = false
tags = ["os", "ostep", "scheduling", "network"]
+++

- 기본적인 다단계 피드백 큐와, lottery 알고리즘을 설명한다. [\[1\]](#ref-1), [\[2\]](#ref-2)
- lottery 의 좋은 점은 기존의 스케쥴링된 상태를 추적하고 표현해야 하는 것들을 단순한 ticket 및 확률론에 기대서 구현하여 구현이 단순하다는 장점이 있다.
## 스케쥴링이 쓰이는 다른 분야는?
- Amazon SQS Fair Queues [\[3\]](#ref-3)
- Cloudflare의 HTTP/2 우선순위 처리 [\[4\]](#ref-4)
- NGINX의 HTTP/2 스케줄링 개선 [\[5\]](#ref-5)
- 급증하는 트래픽 안정적으로 처리하기, 구현편 [\[6\]](#ref-6)

## Network Scheduling
네트워크 스케쥴링은 기본적으로 전송되어야 할 패킷의 전송 순서와 전송 속도를 제한하거나 폐기하는 것을 포함할 수 있다. 일반적인 Linux 송신 경로를 단순화하면 `Application -> TCP/UDP + IP -> qdisc -> NIC Driver -> NIC의 하드웨어 TX 큐 -> 링크`로 표현할 수 있다. 여기서 qdisc는 **하드웨어 큐와 별개의 소프트웨어 스케쥴링 계층**이다. 이 경로는 송신 측의 개략도이며, 모든 네트워크 장치의 송수신 경로가 동일하다는 의미는 아니다.
- **Scheduling**: 다음에 어느 큐의 패킷을 보낼지 선택.
- **Shaping**: 패킷을 기다리게 해서 전송률 제한.
- **AQM**: 큐가 과도하게 쌓이는 것을 막기 위해 drop 또는 ECN marking.

TCP 혼잡제어는 송신자가 네트워크 상태에 맞춰 얼마나 보낼지 결정하고, qdisc는 전달받은 패킷 중 무엇을 다음에 내보낼지, 기다리게 하거나 폐기할지를 결정한다. **역할은 다르지만 서로 영향을 준다.** qdisc의 drop이나 ECN marking은 TCP 혼잡제어에 피드백을 주며, Linux의 `fq` qdisc는 TCP가 요구하는 pacing, 즉 패킷 사이의 전송 간격을 반영한다. `fq`와 `fq_codel`은 별개의 qdisc이므로, 아래의 DRR과 CoDel 설명은 `fq_codel`을 대상으로 한다. [\[7\]](#ref-7), [\[8\]](#ref-8)

### qdisc(Queue Discipline)
리눅스에서 제공하는 알고리즘은 기본적으로 pfifo_fast, fq_codel 등이 있다. pfifo_fast 는 내부적으로 queue 를 3개 두어 스케쥴링하는 기법인데 자세히 다루지는 않겠다.
fq_codel은 일부 Linux 배포판에서 기본값으로 채택하는 qdisc이며, Flow Queueing과 Controlled Delay를 결합한다. 실제 기본값과 적용된 qdisc는 배포판 설정 및 장치에 따라 달라진다.

Linux에서 `sysctl net.core.default_qdisc`로 기본 qdisc 설정을, `tc qdisc show dev <인터페이스>`로 해당 인터페이스에 실제 적용된 qdisc를 확인할 수 있다. 물리적인 다중 TX 큐 장치는 root qdisc가 `mq`이고, 그 하위 큐에 기본 qdisc가 적용될 수도 있다. [\[9\]](#ref-9)

- Fair Queueing은 Flow 단위로 패킷 전송 기회를 공정하게 배분한다. 참고로 Flow는 Source IP, Destination IP, Source Port, Destination Port, Protocol (TCP/UDP) 등으로 구분되는 논리적 단위이다.
	- 실제 Flow는 qdisc에서 1024개의 내부 큐를 두고 있고, 해싱을 통해 배정되며 충돌에 대해서는 단순히 두 요청을 같은 Flow에 배정하도록 되어있다.
- **Controlled Delay** 는 패킷이 큐에서 너무 오래 대기하는 상황을 감지하고 혼잡을 제어한다.

#### FQ-CoDel의 Flow Queueing
FQ-CoDel의 큐 선택 부분은 변형된 DRR(Deficit Round Robin)을 사용한다. 각 활성 큐에 **바이트 단위의 credit(deficit)**을 부여하고, 패킷을 하나 내보낼 때마다 그 패킷의 바이트 수만큼 차감한다. Credit이 0 이하가 되면 quantum만큼 보충하고 다음 큐로 차례를 넘긴다.

예를 들어 quantum이 1500바이트이고 두 큐의 시작 credit이 각각 1500이라면, 500바이트 패킷을 담은 큐는 3개를, 1500바이트 패킷을 담은 큐는 1개를 내보낼 수 있다. **패킷 개수가 아니라 전송 바이트를 기준으로 공정성을 맞추는 것**이다. 마지막 패킷을 내보내면서 credit이 음수가 될 수도 있는데, 이 초과분은 다음 차례에 반영된다. Credit이 500인 상태에서 1500바이트를 보내면 -1000이 되고, 다음에 quantum 1500을 보충해도 credit은 500만 남는다. [\[10, Sec. 3\]](#ref-10)

FQ-CoDel은 활성 큐를 `new_flows`와 `old_flows`라는 두 목록으로 관리한다. **new/old는 TCP 연결이나 HTTP 요청의 나이를 뜻하지 않는다.** 비활성 큐에 패킷이 들어오면 new 목록에 추가되고, credit을 소진하면 old 목록으로 이동한다. 스케쥴러는 new 목록의 큐를 우선 선택한다.

이 방식은 큐를 지속적으로 쌓는 대량 전송보다, 간헐적으로 적은 패킷을 보내는 트래픽에 유리하다. 오래 유지된 SSH 연결도 큐가 비활성화되었다가 패킷이 다시 들어오면 new로 취급될 수 있다. 따라서 우대의 근거는 **새 요청이라는 사실보다, 지속적인 backlog를 만들지 않는 트래픽이라는 점**에 있다. ACK, DNS, SSH, VoIP 등이 이런 특성을 보이는 경우가 많다. 다만 기존 큐가 굶지 않도록, new 큐가 비었을 때도 즉시 목록에서 제거하는 대신 old 목록을 거치는 등의 장치가 있다. [\[10, Sec. 1.3, 4.2\]](#ref-10)

#### CoDel
Flow 간 전송 기회를 공정하게 나눠도, 각 큐에 패킷이 지속적으로 쌓이면 지연이 커질 수 있다. **Bufferbloat는 과도한 버퍼에 큐가 지속적으로 쌓여 불필요한 지연이 커지는 문제**이다. 일시적인 큐는 정상적인 burst를 흡수하는 데 필요하므로, 패킷이 쌓였다는 사실만으로 문제가 되는 것은 아니다. CoDel은 이런 일시적인 큐와 지속적인 큐를 구분하려는 AQM이며, FQ-CoDel에서는 각 내부 큐에 별도의 CoDel 상태를 유지한다. [\[11, Sec. 1\]](#ref-11), [\[10, Sec. 1.3\]](#ref-10)

CoDel은 큐 길이 자체보다 **패킷이 해당 큐에서 머무른 시간(Sojourn Time)**을 관찰한다. 핵심은 오래 기다린 패킷 하나가 있는지가 아니라, **관찰 구간 동안 최소 대기 시간조차 target보다 높은 상태가 지속되는지**이다. 구현에서는 모든 측정값을 저장해 최솟값을 계산하는 대신, 대기 시간이 target보다 높은 상태가 얼마나 오래 이어지는지를 추적한다. 큐가 거의 비어 있을 때는 drop을 억제해 링크 이용률을 보호한다. [\[11, Sec. 3.1, 4.1\]](#ref-11)

Linux fq_codel의 기본값은 `target = 5 ms`, `interval = 100 ms`이다. 예를 들어 burst 이후 큐가 빠르게 비워져 대기 시간이 target 아래로 내려가면, 높은 지연이 잠깐 관측되어도 지속적인 혼잡으로 취급하지 않는다. 반대로 target을 초과하는 상태가 interval 동안 지속되면 drop 또는 ECN marking으로 혼잡 신호를 보낸다. **Target은 모든 패킷의 지연을 5 ms 이하로 보장하는 상한이 아니며, 5 ms를 넘긴 패킷을 즉시 모두 버린다는 뜻도 아니다.** [\[12\]](#ref-12)

#### ECN과 TCP의 피드백
ECN(Explicit Congestion Notification)은 혼잡도를 수치로 전달하는 TCP 옵션이 아니라, 패킷에 혼잡 발생을 표시하는 방식이다. 기존 TCP ECN의 피드백 과정은 다음과 같다.

1. 송신자가 ECN을 사용할 수 있는 패킷임을 IP 헤더의 ECT 코드포인트로 표시한다.
2. 혼잡을 감지한 qdisc가 해당 IP 헤더를 CE(Congestion Experienced)로 표시한다.
3. 수신자가 TCP ACK의 ECE(ECN-Echo) 플래그로 송신자에게 혼잡을 알린다.
4. 송신자는 혼잡제어에 이를 반영해 혼잡 윈도우를 줄이고, CWR(Congestion Window Reduced) 플래그로 반응했음을 알린다.

즉, qdisc가 수신자에게 표시한 신호가 ACK를 통해 **송신자로 돌아가야** 송신량 조절로 이어진다. Drop을 사용하면 송신자가 손실을 감지해 혼잡제어에 반영한다. [\[13, Sec. 6\]](#ref-13)

ECN marking을 사용하려면 qdisc의 ECN 설정뿐 아니라 패킷도 ECN 가능한 상태여야 한다. 그렇지 않으면 drop을 사용한다. 또한 ECN이 활성화되어 있어도 큐의 패킷 수나 메모리 한계를 초과하면 drop이 발생할 수 있다. [\[12\]](#ref-12)

#### qdisc가 제어할 수 있는 지연의 범위
CoDel이 측정하는 sojourn time은 **자신이 관리하는 큐에서의 대기 시간**이다. 패킷이 qdisc를 떠난 뒤 NIC의 하드웨어 큐나 이후 경로의 라우터에 오래 머무르면, 그 지연을 해당 qdisc의 CoDel이 직접 측정하거나 제거할 수는 없다.

따라서 FQ-CoDel을 적용했다는 사실만으로 전체 경로의 bufferbloat가 해결되지는 않는다. Linux의 BQL(Byte Queue Limits)은 드라이버가 하드웨어에 넘겨 둔 데이터량을 제한해 하위 큐에 과도하게 쌓이는 것을 억제한다. 실제 병목이 더 느린 하위 링크에 있는 경우에는 그 속도에 맞춘 shaping으로 패킷이 관리 가능한 소프트웨어 큐에 쌓이도록 구성하는 방법도 있다. [\[10, Sec. 5.6\]](#ref-10)

## SQS
- sqs 는 내부 스케쥴링 알고리즘을 알려주진 않았지만, 특정 tenant 의 높은 트래픽에 대한 noisy neighbour 현상을 해소하기 위해 다른 tenant 에게 priority boost 를 주는 형식으로 구성된 옵션을 제공한다. [\[3\]](#ref-3)
## CDN, HTTP/2 Streaming Scheduling
### 1. Dependency aware Scheduling
- HTTP/2 multiplexing 에 대해서 다루며 전송할 데이터에 대해 64개의 티어로 나눠 데이터 전송 시에, js 의 경우에는 병렬로 보내는 것보다는 페이지 로딩은 순차적이기에 순차적으로 보내거나, 이미지의 경우에는 병렬로 전송하는 등 Dependency aware Scheduling을 이용한다. [\[4\]](#ref-4)
### 2. NGINX Structural Enhancements
- 기본적으로 nginx, reverse proxy 단에서는 A, B, C의 요청이 순차적으로 왔을 때, 처리 또한 순차적이고, B와 C의 우선순위가 높다해도 이를 적절히 스케쥴링하기 어렵다는 문제에서 시작.
- 이를 해결하기 위해, 스케쥴링에서 A가 전송 전 Wait Queue 에서 대기 중이고, Backpressure로 만약 실패한다면 해당 Frame을 다시 Stream별 큐로 돌려보내, B, C Frame 들과 경쟁할 수 있도록 NGINX 자체를 수정함. [\[5\]](#ref-5)

## References

<a id="ref-1"></a>
[1] R. H. Arpaci-Dusseau and A. C. Arpaci-Dusseau, “Scheduling: The Multi-Level Feedback Queue,” *Operating Systems: Three Easy Pieces, ver. 1.10, ch. 8, Arpaci-Dusseau Books*, Nov. 2023. [Online]. Available: <https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched-mlfq.pdf>. Accessed: Nov. 9, 2026.

<a id="ref-2"></a>
[2] R. H. Arpaci-Dusseau and A. C. Arpaci-Dusseau, “Scheduling: Proportional Share,” *Operating Systems: Three Easy Pieces, ver. 1.10, ch. 9, Arpaci-Dusseau Books*, Nov. 2023. [Online]. Available: <https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched-lottery.pdf>. Accessed: Nov. 9, 2026.

<a id="ref-3"></a>
[3] M. Schellhorn and D. Fröhner, “Building resilient multi-tenant systems with Amazon SQS fair queues,” *AWS Compute Blog*, Jul. 21, 2025. [Online]. Available: <https://aws.amazon.com/ko/blogs/compute/building-resilient-multi-tenant-systems-with-amazon-sqs-fair-queues/>. Accessed: Nov. 9, 2026.

<a id="ref-4"></a>
[4] P. Meenan, “Better HTTP/2 Prioritization for a Faster Web,” *Cloudflare Blog*, May 14, 2019. [Online]. Available: <https://blog.cloudflare.com/better-http-2-prioritization-for-a-faster-web/>. Accessed: Nov. 9, 2026.

<a id="ref-5"></a>
[5] N. Jones, “NGINX structural enhancements for HTTP/2 performance,” *Cloudflare Blog*, May 22, 2019. [Online]. Available: <https://blog.cloudflare.com/nginx-structural-enhancements-for-http-2-performance/>. Accessed: Nov. 9, 2026.

<a id="ref-6"></a>
[6] 채널코퍼레이션, “급증하는 트래픽 안정적으로 처리하기, 구현편,” *Channel Tech*. [Online]. Available: <https://tech.channel.io/kr/articles/%EA%B8%89%EC%A6%9D%ED%95%98%EB%8A%94-%ED%8A%B8%EB%9E%98%ED%94%BD-%E1%84%8B%E1%85%A1%E1%86%AB%E1%84%8C%E1%85%A5%E1%86%BC%E1%84%8C%E1%85%A5%E1%86%A8%E1%84%8B%E1%85%B3%E1%84%85%E1%85%A9-%E1%84%8E%E1%85%A5%E1%84%85%E1%85%B5%E1%84%92%E1%85%A1%E1%84%80%E1%85%B5-%EA%B5%AC%ED%98%84%ED%8E%B8-235661b0>. Accessed: Nov. 9, 2026.

<a id="ref-7"></a>
[7] iproute2 Contributors, “tc(8),” *Linux manual pages*. [Online]. Available: <https://man7.org/linux/man-pages/man8/tc.8.html>. Accessed: Nov. 9, 2026.

<a id="ref-8"></a>
[8] iproute2 Contributors, “tc-fq(8),” *Linux manual pages*. [Online]. Available: <https://man7.org/linux/man-pages/man8/tc-fq.8.html>. Accessed: Nov. 9, 2026.

<a id="ref-9"></a>
[9] The Linux Kernel Contributors, “Documentation for /proc/sys/net/,” *The Linux Kernel Documentation*. [Online]. Available: <https://www.kernel.org/doc/html/latest/admin-guide/sysctl/net.html>. Accessed: Nov. 9, 2026.

<a id="ref-10"></a>
[10] T. Høiland-Jørgensen, P. McKenney, D. Täht, J. Gettys, and E. Dumazet, “The Flow Queue CoDel Packet Scheduler and Active Queue Management Algorithm,” *IETF, RFC 8290*, Jan. 2018. [Online]. Available: <https://www.rfc-editor.org/rfc/rfc8290.html>. Accessed: Nov. 9, 2026.

<a id="ref-11"></a>
[11] K. Nichols, V. Jacobson, A. McGregor, and J. Iyengar, “Controlled Delay Active Queue Management,” *IETF, RFC 8289*, Jan. 2018. [Online]. Available: <https://www.rfc-editor.org/rfc/rfc8289.html>. Accessed: Nov. 9, 2026.

<a id="ref-12"></a>
[12] iproute2 Contributors, “tc-fq_codel(8),” *Linux manual pages*. [Online]. Available: <https://man7.org/linux/man-pages/man8/tc-fq_codel.8.html>. Accessed: Nov. 9, 2026.

<a id="ref-13"></a>
[13] K. Ramakrishnan, S. Floyd, and D. Black, “The Addition of Explicit Congestion Notification (ECN) to IP,” *IETF, RFC 3168*, Sep. 2001. [Online]. Available: <https://www.rfc-editor.org/rfc/rfc3168.html>. Accessed: Nov. 9, 2026.
