---
title: "WebSocket"
tags:
  - backend
  - ws
  - websocket
  - http
categories:
  - backend
last_modified_at: 2020-12-09T13:00:00+18:00
toc: true
---

# Introduction

오늘은 웹소켓에 대해 알아보려한다. 입사 전에 간단한 채팅 시스템을 만들고 싶은데 웹소켓을 사용하려 한다. 물론 회사에선 직접적으로 안 쓰일 수 있겠지만, 쓸모없는 지식이 어디 있겠냐는 생각으로 시작해본다.

# WebSocket

>The WebSocket Protocol enables two-way communication between a client running untrusted code in a controlled environment to a remote host that has opted-in to communications from that code<br><br>
— RFC 6455 - The WebSocket Protocol

본론부터 말하자면, 웹소켓은 양방향 전이중 통신을 지원하는 프로토콜이다. HTTP 프로토콜 위에서 `TCP/IP` 소켓 커넥션을 통해 동작한다. 웹소켓은 실시간으로 사용자와 서버가 정보를 주고받을 경우(대표적으론 실시간 시스템이 있겠다.) `HTTP`보다 나은 선택이 될 수 있다.

웹소켓이 없던 시절, 실시간 서비스를 위해 `HTTP` 기반을 어떻게 응용했을까?
`HTTP`의 경우 사용자가 요청하지 않는다면 서버는 사용자에게 어떠한 데이터도 보낼 수 없다. 이러한 문제를 해결하기 위해 개발자들은 `Long-polling` 혹은 `Comet`과 같은 트릭을 사용하여 `stateless`한 `HTTP`에서 위와 같은 서비스를 구현했지만, 추가적이고 불피요한 자원을 지속적으로 사용하게 한다.

>  "contain lots of additional, unnecessary header data and introduce latency" and resulted in "an outrageously high price tag"<br><br>
ㅡ HTML5 Web Socket in Essence - Wayne Ye

## Benefits of WebSocket

`websocket.org`에서는 위와같은 상황에 대해서 왜 `WebSocket`을 사용하는 것이 이로운지 직접적인 예시를 들어 설명했다.

특정 상황을 가정해보자.
서버와 사용자가 주고받는 응답/요청에 대한 `HTTP header`는 대략 `871byte`이고, `Websocket`을 통해 사용자와 서버가 연결한 경우 데이터의 길이는 `2byte`보다 적다.

- HTTP Request
1. 1000명의 사용자가 매 초마다 `polling`을 할 경우: 871 x 1000 = 871000 bytes = 69680000 bit per second (6.6 Mbps)
2. 10000명의 사용자가 매 초마다 `polling`을 할 경우: 871 x 10000 = 8710000 bytes = 696800000 bit per second (66.5 Mbps)
3. 100000명의 사용자가 매 초마다 `polling`을 할 경우: 871 x 100000 = 87100000 bytes = 6968000000 bit per second (665 Mbps)

- HTTP WebSocket
1. 1000명의 사용자가 매 초마다 하나의 메세지를 수신할 경우: 2 x 1000 = 2000 bytes = 16000 bit per second (0.015 Mbps)
2. 10000명의 사용자가 매 초마다 하나의 메세지를 수신할 경우: 2 x 10000 = 20000 bytes = 160000 bit per second (0.153 Mbps)
3. 100000명의 사용자가 매 초마다 하나의 메세지를 수신할 경우: 2 x 100000 = 200000 bytes = 1600000 bit per second (1.526 Mbps)

![이미지](/assets/images/poll-ws-compare.gif)

자 이제 우리가 왜 `websocket`을 써야할지는 명확해진 것 같다.

## Protocol Overview

웹소켓은 기본적인 `HTTP` 요청과 응답을 통해 프로토콜을 시작한다. 사용자는 웹소켓 통신을 시작하고 싶다는 요청을 보내고, 서버는 가능여부를 응답으로 보낸다.

초기 `handshake`가 성공적으로 마무리 되면, 사용자와 서버는 `basic framed message protocol`을 사용하여 통신한다. 만약 양쪽 모두 커넥션을 닫는 것에 동의한다면 `TCP` 커넥션을 종료한다.

## WebSocket Open handshake

웹소켓은 기존의 `https`와 `http` 스킴대신, `wss`, `ws` 스킴을 사용하여 통신한다. `ws://host:port/path/?query`와 같은 방식으로 진행되며 `URI`의 기본적인 구조는 기존의 `http`와 다르지 않은 것을 알 수 있다.

그렇다면 웹소켓을 사용하기 위해선 `HTTP`에서 `WebSocket` 프로토콜로 변경하는 과정이 반드시 필요할 것이다. 예제를 통해 핸드셰이킹과 이에 포함되어야 하는 필수적인 헤더에 대해 알아보자.

```
GET ws://example.com:8181/ HTTP/1.1
Host: localhost:8181
Connection: Upgrade
Pragma: no-cache
Cache-Control: no-cache
Upgrade: websocket
Sec-WebSocket-Version: 13
Sec-WebSocket-Key: q4xkcO32u266gldTuKaSOw==
```

- `Connection: Upgrade`
  - `Connection` 헤더는 보편적으로 현재 요청/응답이 끝난 후 네트워크 연결을 컨트롤하기 위해 존재하며, 이러한 상황에는 보통 `keep-alive`를 사용한다. 웹소켓 핸드셰이킹을 할 경우 헤더는 `Upgrade`를 값으로 가지며, 현재 연결을 끊지않고 `HTTP`가 아닌 다른 프로토콜을 사용하여 요청할 것을 의미한다.

- `Upgrade: websocket`
  - `Upgrade` 헤더는 서버에게 다른 프로토콜로 변경할 것을 요청한다. 우리는 현재 웹소켓을 사용하기 위해 `websocket`을 명시하였다.

- `Sec-WebSocket-Key: q4xkcO32u266gldTuKaSOw==`
  - `Sec-WebSocket-Key` 헤더는 사용자가 생성한 일회용 난수(`nonce`)다.

- `Sec-WebSocket-Version: 13`
  - 웹소켓의 버전을 나타낸다.

사용자는 웹소켓 연결을 요청하고 서버의 응답을 기다린다. 서버는 `Upgrade`에 명시된 프로토콜로 바꾸기 위해서 반드시 `HTTP 101 Switching Protocols` 상태코드를 보낸다. 또한, 서버는 헤더에 커넥션이 성공적으로 변경됐는지를 포함시켜야 한다.

```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: fA9dggdnMPU79lJgAE3W4TRnyDM=
```

- `Connection: Upgrade`
  - 커넥션이 `upgade`된 것을 확인.
- `Sec-WebSocket-Accept: fA9dggdnMPU79lJgAE3W4TRnyDM=`
  - 위 헤더는 `SHA-1`에 의해 해싱된 벨류로서 클라이언트가 보낸 `Sec-WebSocket-Key`의 `nonce`값과 [RFC 6455](https://tools.ietf.org/html/rfc6455)에 명시된 `258EAFA5-E914-47DA-95CA-C5AB0DC85B11`을 조합하여 생성한 문자열이다. 이는 복잡해 보이지만 양쪽이 모두 웹소켓을 지원한다는 것을 의미한다. 만약 어느 한 쪽의 문제로 위 통신과정을 `HTTP` 프로토콜로 인식한다면 잠재적인 보안 문제가 존재한다.

## 헤더, 페이로드

웹소켓은 `framed protocol`이다. 즉, 데이터를 전송할 때, 프레임 시퀀스를 보낸다. 기본적인 프레임 프로토콜은 `opcode`, `payload`의 길이, `frame type`을 정의하며, 추가적인 데이터 위치를 정의한다. 자세한 사항은 [RFC 6455](https://tools.ietf.org/html/rfc6455#section-5.2)에서 확인 가능하다.

```
0                   1                   2                   3
0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-------+-+-------------+-------------------------------+
|F|R|R|R| opcode|M| Payload len |    Extended payload length    |
|I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
|N|V|V|V|       |S|             |   (if payload len==126/127)   |
| |1|2|3|       |K|             |                               |
+-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
|     Extended payload length continued, if payload len == 127  |
+ - - - - - - - - - - - - - - - +-------------------------------+
|                               |Masking-key, if MASK set to 1  |
+-------------------------------+-------------------------------+
| Masking-key (continued)       |          Payload Data         |
+-------------------------------- - - - - - - - - - - - - - - - +
:                     Payload Data continued ...                :
+ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
|                     Payload Data continued ...                |
+---------------------------------------------------------------+
```

이 포스트에선 프로토콜에 중요한 부분만 설명하겠다. 자세한 내용은 공식 문서를 확인하길 바란다.

### Fin bit

첫 비트는 `Fin bit` 헤더다. 이 비트가 켜질 경우 현재 프레임이 메세지의 마지막 부분임을 의미한다.

### RSV1, RSV2, RSV3 bits

확장성을 위해 존재한다.

### opcode

프레임은 페이로드를 어떻게 해석할지 결정하기 위한 `opcode`를 가지고 있다.

| Opcde value | Description     |
| :------------- | :------------- |
| 0x00       | This frame continues the payload from the previous frame.       |
| 0x01       |   Denotes a text frame. Text frames are UTF-8 decoded by the server.  |
| 0x02       |  	Denotes a binary frame. Binary frames are delivered unchanged by the server.   |
| 0x03 - 0x07       |Reserved for future use.    |
| 0x08       |  Denotes the client wishes to close the connection.   |
| 0x09       |   A ping frame. Serves as a heartbeat mechanism ensuring the connection is still alive. The receiver must respond with a pong.  |
| 0x0a       |  	A pong frame. Serves as a heartbeat mechanism ensuring the connection is still alive. The receiver must respond with a ping frame.   |
| 0x0b - 0x0f       |  	Reserved for future use.   |

### Mask

이 비트가 켜질 경우 `masking`이 활성화된다. 웹소켓은 사용자가 선택한 임의의 키를 사용하여 모든 페이로드를 난독화한다. 페이로드 데이터는 전송전에 마스킹 키와 `XOR` 연산을 진행한다. 마스킹은 웹소켓 프레임이 캐시가능한 데이터로 판단되는 것을 막는다.

웹소켓 프로토콜 배포과정에서, `cache poisoning`이라는 공격 기법이 일어날 수 있다. 이는 인터넷 구조와 상호작용 하는 새로운 프로토콜에서 자주 일어날 수 있는 방법이며, 자세한 사항은 `Security`와 관련된 포스트를 추후 작성하도록 하겠다.

### Payload len

`Payload len`와 `Extended payload length`는 현재 프레임에 패이로드 길이를 나타낸다. 만약 패이로드가 126 bytes 보다 작을 경우 `Payload len`에 표시된다. 페이로드 데이터가 커질 것을 대비해 추가적인 필드를 마련해둔 것이다.

### Masking-key

`MASK` 비트에서 말했듯이, 마스킹을 진행하기 위한 키다.

### Payload data

임의의 응용 프로그램 데이터와 클라이언트 서버 간에 협의된 모든 데이터를 포함한다. 협의된 내용은 초기 핸드셰이킹에서 다루어진다.

## Close Handshake

`0x08 opcode`를 설정하면 웹소켓 연결을 끊을 수 있다. 연결을 끊은 이유가 추가적으로 포함될 수 있으며, 한 쪽이 연결을 끊을 것을 요청하면 반드시 반대쪽에서 `response`를 주어야한다.

 Once the close frame has been received by both parties, the TCP connection is torn down

# 마치며

오늘은 웹소켓 프로토콜에 전반적인 개요에 대해 알아보았다. 이 포스트에선 아직, 보안적인 측면에서 마련된 장치에 대해 자세한 이야기를 하지 않았다. 이는 추후 포스트에서 다루도록 하겠다.


><font size="6">Refernce</font>
- https://www.codeproject.com/Articles/209041/HTML5-Web-Socket-in-Essence#Introduction
- https://tools.ietf.org/html/rfc6455
- https://sookocheff.com/post/networking/how-do-websockets-work/
- By Vanessa Wang, Frank Salim, and Peter Moskovits, The Definitive Guide to HTML5 WebSocket, 2013
