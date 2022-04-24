---
title: "Hexagonal Architecture"
tags:
  - architecture
  - hexagonal architecture
categories:
  - architecture
last_modified_at: 2022-03-27T13:00:00+17:00
toc: true
---
# 개요

소프트웨어 개발에 있어서 아키텍쳐는 떼려야 뗄 수 없는 관계입니다. 우리는 종종 [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) (`Model-View-Controller`), [MVP](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)(`Model-View-Presenter`) 등 여러 패턴의 아키텍쳐를 접해봤었습니다.

하지만 개인적으론 아키텍쳐로 인해 이점을 얻어본 경험이 있는가에 대해서는 확신이 들지 않았습니다. 꽤나 중요하다는 이야기는 들어봤지만 그게 왜 중요한지, 개발 주기와 어떤 관계가 있을지가 상당히 모호하다는 인상이었습니다.

이번 포스트에서는 이러한 소프트웨어 아키텍쳐의 중요성과 함께 사내 `golang` 프로젝트에서 육각형 설계(**Hexagonal Architecture**)를 선택한 이유에 대해 간단히 포스트를 해보겠습니다. 이 글은 저와 같이 아키텍쳐가 왜 중요한지, 실제로 그러한 아키텍쳐는 무엇이 있을지 궁금한 분들이 읽으면 좋을 것이라 생각합니다.

# 아키텍쳐는 왜 중요한가

우선 아키텍쳐의 중요성부터 짚고 넘어가봅시다. **지속 성장 가능한** 아키텍쳐에 주요 목표는 **통제**와 **예측 가능**한 **제어**[1] 등이 있습니다. 아키텍쳐는 종종 복잡한 구조와 강제성 있는 규칙을 동반하는데, 왜 이렇게 복잡하고 강제성 있는 규칙을 세워 소프트웨어를 통제하고 있을까요?

## 경제적인 관점

많은 이유를 들 수 있겠지만, 제가 이 포스트를 통해 가장 언급하고 싶은 가치는 다름 아닌 **경제성**입니다. 예측 가능하며 통제된 구조는 분명히 추후 우리가 효율적으로 개발할 수 있도록 돕는 장치가 될 것입니다.

> Concentrating on high internal quality(옮 is about reducing that drop off in **productivity**. Indeed some products see an opposite effect, where developers can accelerate as new features can be easily built by making use of prior work. This happy situation is a rarer case, as it requires a skilled and disciplined team to make it happen. But we do occasionally see it.

저명한 소프트웨어 개발자 [마틴 파울러](https://ko.wikipedia.org/wiki/%EB%A7%88%ED%8B%B4_%ED%8C%8C%EC%9A%B8%EB%9F%AC)는 장기적인 관점에서 아키텍쳐(**Internal Quality**)의 중요성을 말합니다.

우선, 대부분의 소프트웨어가 그렇듯이 잘 짜여지지 않은 아키텍쳐 위에선 시간이 지날수록 생산성이 저하되어 새로운 기능을 만들기에 매우 어려운 상황에 다다릅니다. 이 때는 간단한 변경만을 위해서도 개발자는 **수많은 코드에 대한 이해**를 선행해야만 하는 최악의 상황에 봉착합니다.

![Untitled](/assets/images/lower-time.png)

<center><i>그림 1, 소프트웨어 개발 주기에서 낮은 품질</i></center>

반면에, 잘 짜여진 아키텍쳐 위에서의 코드 설계는 분명히 처음에 느린 개발 속도와 복잡함을 가지고 있지만, 기존에 코드들이 잘 모듈화 되어 이를 **재사용** 하면서 제품 개발을 효율적으로 만들고, 모듈화되어 관리되는 상황은 작은 부분의 코드 이해만 가지고도 쉽게 개발할 수 있도록 만듭니다.

![Untitled](/assets/images/good-time.png)

<center><i>그림 2, 소프트웨어 개발 주기에서 높은 품질과 낮은 품질</i></center>

우리는 제품을 만들며, 항상 **소프트웨어의 품질**과 **빠른 개발** 사이에서 저울질합니다만, 앞선 설명을 듣고나면 이는 장기적인 관점과 단기적인 관점에서의 **경제성을 택하는 문제**로 치환할 수 있을 것 같습니다.

그렇다면, 우리는 어떤 걸 선택해 개발하고 있었고, 앞으로는 어떤 방향성을 가지고 개발해야할까요? 또한, 생산성을 높여 새로운 기능 개발을 빠르게 할 수 있는 아키텍쳐는 어떤 형태일까요?

# 육각형 아키텍쳐

> The term "**hexagonal**" comes from the graphical conventions that shows the application component like a hexagonal cell. The purpose was not to suggest that there would be six borders/ports, but to leave enough space to represent the **different interfaces needed between the component and the external world.**[3]

육각형 설계(`Hexagonal Architecture`)란, 포트와 어답터 패턴(`Ports and Adapters pattern`)이라고도 불리며, 느슨한 연결(`loosely coupled`)을 지향하는 아키텍쳐입니다. 소프트웨어 아키텍쳐들의 개요을 읽어보면 워낙 추상적인 말로 써있다보니 사실 개인적으로도 잘 와닿지 않습니다. 오히려 구조부터 차근차근 파보는 게 좋을 것 같으니, 거두절미하고 바로 설명으로 넘어가보겠습니다.

![Untitled](/assets/images/hexagonal.png)

<center><i>그림 3. 육각형 아키텍쳐의 구조도[4]</i></center>

간단히 계층을 설명해보자면 가장 안에는 하지만 **도메인 계층**, 중간에는 **어플리케이션 계층**, 외부 의존성과 실제로 통신하는 **인프라스트럭쳐 계층**이 있습니다. **어플리케이션 계층**은 실제 도메인과 외부 의존성 사이에서 실제 비지니스 로직을 만드는 역할을 하고 있고, 느슨한 연결을 돕는 중간 다리입니다.

자 그럼 이제 위 그림에서 나타나는 의존성의 흐름을 봐봅시다. 외부와의 통신에 필요한 `HTTP`, `RPC`, `MySQL` 등은 현재 어댑터 형식으로 포트와 연결되어 있습니다. 실제로 포트는 **어플리케이션 계층**에서 이용되며, 포트와 어답터를 이용해 코드가 작성되기 때문에 변경이 잦은 외부 의존성과 비지니스 로직을 분리할 수 있습니다. 이러한 방식은 실제로 존재하는 의존성이 모두 **육각형의 내부**를 가리키도록 합니다.

```go
// Port
type Repository interface {
	Create(entity Entity) error
	Update(entity Entity) error
}

// Adapter
type SQLRepository struct {
	sql.ModelMapper
	sql.Repository
}

type (s SQLRepository) Create(entity Entity) error {
	...
}
```

<center><i>코드 1. 포트와 어답터 예시</i></center>

따라서, 어플리케이션 계층의 핵심 비지니스 로직은 데이터베이스가 어떻게 연결되는지, 데이터베이스가 어떤 것인지 등을 **전혀 몰라도** 됩니다. 이처럼 제한적인 관심사와 외부 의존성과의 느슨한 연결은 비지니스 로직을 견고하게 가져갈 수 있도록 만들 것입니다. 실제로 넷플릭스의 경우도 육각형 아키텍쳐 상에서 데이터베이스 교체하는 큰 작업이 단 한 줄의 코드 변경과 함께 2시간 만의 끝났다고 언급했습니다.[5]

# 그러면 왜 육각형 아키텍쳐를 택했나요?

실제 `golang` 프로젝트는 회사 내부에서도 상당히 도전적인 프로젝트입니다. 그렇기에 기존의 모놀리식 자바 어플리케이션과는 달리 다양한 기술적 시도를 쉽게 할 수 있는 상황입니다.

앞서 말한 모놀리식 자바 프로젝트는 비지니스 로직을 담당하는 코드들이 외부 의존성에 묶여 쉽게 변경될 수 없는 매우 강한 [결합도](https://en.wikipedia.org/wiki/Coupling_(computer_programming))를[6] 지니고 있기 때문에 어려운 상황인데, `golang` 프로젝트는 이와 반대로 최대한 느슨한 연결을 지향하여 **통제**하고 **예측가능**하게 관리해야합니다. 이는 비지니스 로직은 변경 없는 견고함을 가져가며, 실제 외부 의존성을 자유롭게 바꿀 수 있는 근거가 될 수 있겠지요.

> 여러분께서 맡고 있는 애플리케이션은 분명히 변합니다. **반드시 바뀌고 필히 확장됩니다.** 그럴 때마다 포트와 어댑터 설계는 여러분이 어디를 수정해야 할지 직관적으로 알려주고, 무엇을 바꿔야 할지 고민할 시간을 줄여주기도 하며, 수정사항을 쉽게 적용할 수 있게 해줄 겁니다

# 맺음말

오늘은 소프트웨어 아키텍쳐에 대한 중요성, 육각형 아키텍쳐는 어떤 구조인지를 가볍게 살펴보았습니다.

사실 이렇게 정리해도 아직까지는 아키텍쳐의 추상적이고 모호한 부분이 완전히 사라진 건 아닙니다. 또한, 이러한 특성은 실제 개발할 때도 나타난다고 생각합니다. 이론적인 부분은 분명히 현실에서 타협할 수 없는 부분과 맞닿아 있고, 이러한 이유로 이론적인 것을 완벽히 가져갈 수 없을지도 모릅니다.

다만, 어떤 것이든 트레이드 오프(trade-off)가 있기 마련이고 각자 상황에 맞는 아키텍쳐를, 개발 방식을 선택할 수 있어야 하기에 이 글이 누군가의 선택의 근거가 되기를 바랍니다.

# References

[1] [https://geminikim.medium.com/지속-성장-가능한-소프트웨어를-만들어가는-방법-97844c5dab63](https://geminikim.medium.com/%EC%A7%80%EC%86%8D-%EC%84%B1%EC%9E%A5-%EA%B0%80%EB%8A%A5%ED%95%9C-%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4%EB%A5%BC-%EB%A7%8C%EB%93%A4%EC%96%B4%EA%B0%80%EB%8A%94-%EB%B0%A9%EB%B2%95-97844c5dab63)

[2] [https://martinfowler.com/articles/is-quality-worth-cost.html#SoftwareQualityMeansManyThings](https://martinfowler.com/articles/is-quality-worth-cost.html#SoftwareQualityMeansManyThings)

[3] [https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software))

[4] [https://engineering.linecorp.com/ko/blog/port-and-adapter-architecture/](https://engineering.linecorp.com/ko/blog/port-and-adapter-architecture/)

[5] [https://netflixtechblog.com/ready-for-changes-with-hexagonal-architecture-b315ec967749](https://netflixtechblog.com/ready-for-changes-with-hexagonal-architecture-b315ec967749)

[6] [https://en.wikipedia.org/wiki/Coupling_(computer_programming)](https://en.wikipedia.org/wiki/Coupling_(computer_programming))

[7] [https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/ch01.html](
