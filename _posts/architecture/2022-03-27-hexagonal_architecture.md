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

소프트웨어 개발에 있어서 아키텍쳐는 떼려야 뗄 수 없는 관계이다. 우리는 종종 [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)(`Model-View-Controller`), [MVP](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93presenter#:~:text=Model%E2%80%93view%E2%80%93presenter%20(MVP,is%20pushed%20to%20the%20presenter.)(`Model-View-Presenter`) 등 여러 패턴의 아키텍쳐를 접해봤다.

하지만 역설적으로, 이러한 아키텍쳐로 인해 이점을 얻어본 경험이 있는가에 대해서는 대부분의 개발자들이 확신하지 못 한다. 꽤나 중요하다는 이야기는 들어봤지만 그게 왜 중요한지 개발 주기와 어떤 관계가 있을지 알지 못한다.

이번 포스트에서는 이러한 소프트웨어 아키텍쳐의 중요성과 함께 사내 `golang` 프로젝트에서 육각형 설계(**Hexagonal Architecture**)를 선택한 이유에 대해 알아보고자 한다.

긴 말은 그만하고 바로 시작해보자.

# 아키텍쳐는 왜 중요한가

우선 아키텍쳐의 중요성부터 짚고 넘어가보도록 하자. **지속 성장 가능한** 아키텍쳐에 주요 목표는 **통제**와 **예측 가능**한 **제어**[1] 등이 있다. 아키텍쳐는 종종 복잡한 구조와 강제성 있는 규칙을 동반하는데, 왜 이렇게 복잡하고 강제성 있는 규칙을 세워 소프트웨어를 통제할까?

## 경제적인 관점

많은 이유를 들 수 있겠지만, 내가 이 포스트를 통해 가장 언급하고 싶은 가치는 다름 아닌 **경제성**이다. 예측 가능한, 통제된 구조는 분명히 추후 우리가 효율적으로 개발할 수 있게 만들 것이다.

> Concentrating on high internal quality(옮 is about reducing that drop off in **productivity**. Indeed some products see an opposite effect, where developers can accelerate as new features can be easily built by making use of prior work. This happy situation is a rarer case, as it requires a skilled and disciplined team to make it happen. But we do occasionally see it.

저명한 소프트웨어 개발자 [마틴 파울러](https://ko.wikipedia.org/wiki/%EB%A7%88%ED%8B%B4_%ED%8C%8C%EC%9A%B8%EB%9F%AC)는 장기적인 관점에서 아키텍쳐(**Internal Quality**)의 중요성을 말한다.

우선, 대부분의 소프트웨어가 그렇듯이 잘 짜여지지 않은 아키텍쳐 위에선 시간이 지날수록 생산성이 저하되어 새로운 기능을 만들기에 매우 어려운 상황에 다다른다. 이 때는 간단한 변경만을 위해서도 개발자는 **수많은 코드에 대한 이해**를 선행해야만 할 것이다.

![Untitled](/assets/iamges/lower-time.png)

<center>*그림 1, [소프트웨어 개발 주기에](https://martinfowler.com/articles/is-quality-worth-cost.html#SoftwareQualityMeansManyThings)서 낮은 품질 [1]*</center>

반면에, 잘 짜여진 아키텍쳐 위에서의 코드 설계는 분명히 처음에 느린 개발 속도와 복잡함을 가지고 있지만, 기존에 코드들이 잘 모듈화 되어 이를 **재사용** 하면서 제품 개발을 효율적으로 만들고, 모듈화되어 관리되는 상황은 작은 부분의 코드 이해만 가지고도 쉽게 개발할 수 있도록 한다.

![Untitled](/assets/iamges/good-time.png)

<center>*그림 2, [소프트웨어 개발 주기에](https://martinfowler.com/articles/is-quality-worth-cost.html#SoftwareQualityMeansManyThings)서 높은 품질과 낮은 품질 [1]*</center>

우리는 제품을 만들며, 항상 **소프트웨어의 품질**과 **빠른 개발** 사이에서 저울질한다. 하지만, 앞선 설명을 듣고나면 이는 장기적인 관점과 단기적인 관점에서의 **경제성을 택하는 문제**로 치환할 수 있을 것 같다.

그렇다면, 우리는 어떤 걸 선택해 개발하고 있었고, 앞으로는 어떤 방향성을 가지고 개발해야할까? 또한, 생산성을 높여 새로운 기능 개발을 빠르게 할 수 있는 아키텍쳐는 어떤 형태일까?

# 육각형 아키텍쳐

> The term "**hexagonal**" comes from the graphical conventions that shows the application component like a hexagonal cell. The purpose was not to suggest that there would be six borders/ports, but to leave enough space to represent the **different interfaces needed between the component and the external world.**[3]

육각형 설계(`Hexagonal Architecture`)란, 포트와 어답터 패턴(`Ports and Adapters pattern`)이라고도 불리며, 느슨한 연결(`loosely coupled`)을 지향하는 아키텍쳐다.

워낙 추상적인 말로 무장하다보니 사실 잘 와닿지 않는 게 당연해 보인다. 간단히 육각형 아키텍쳐의 구조부터 시작해 차근차근 해부해보도록 하자.

<center>![Untitled](/assets/iamges/hexagonal.png)</center>

*그림 3. 육각형 아키텍쳐의 구조도[4]*

간단히 계층을 설명해보자면 가장 안에는 도메인 계층, 중간에는 어플리케이션 계층, 외부 의존성과 실제로 통신하는 인프라스트럭쳐 계층이 있다. 어플리케이션 계층인 실제 도메인과 외부 의존성 사이에서 실제 비지니스 로직을 만드는 역할을 하고 있다.

자 그럼 이제 위 그림에서 나타나는 의존성의 흐름을 보자. 외부와의 통신에 필요한 `HTTP`, `RPC`, `MySQL` 등은 현재 어댑터 형식으로 포트와 연결되어 있다.

실제로 포트는 어플리케이션(**Application**) 계층에서 이용되며, 포트를 이용해 코드가 작성되기 때문에 변경이 잦은 외부 의존성과 비지니스 로직을 분리할 수 있다. 이러한 방식은 실제로 존재하는 의존성이 모두 육각형의 내부를 가리키도록 한다.

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

<center>*코드 1. 포트와 어답터 예시*</center>

따라서, 어플리케이션 계층의 핵심 비지니스 로직은 데이터베이스가 어떻게 연결되는지, 데이터베이스가 어떤 것인지 등을 **전혀 몰라도 된다**. 이처럼 제한적인 관심사와 외부 의존성과의 느슨한 연결은 비지니스 로직을 견고하게 가져갈 수 있도록 만든다.

우리가 개발하는 소프트웨어는 필히 확장되고,

실제 넷플릭스의 경우 육각형 아키텍쳐 상에서 데이터베이스 교체하는 큰 작업이 단 한 줄의 코드 변경과 함께 2시간 만의 끝났다고 언급했다.[5]

# 그러면 왜 육각형 아키텍쳐를 택했는가?

실제 `golang` 프로젝트는 회사 내부에서도 상당히 도전적인 프로젝트이다. 기존의 모놀리식 자바 어플리케이션과는 달리 다양한 시도를 해볼 수 있는 좋은 기회의 땅이며, 그렇기에 여러 라이브러리와 통신 규약, 데이터베이스를 자주 변경할 수 있는 환경이다.

이러한 변경은 앞서 말한 모놀리식 자바 어플리케이션에서는 어려운 시도인데, 비지니스 로직을 담당하는 코드들이 외부 의존성들에 의해 쉽게 변경될 수 있는, 매우 강한 [결합도](https://en.wikipedia.org/wiki/Coupling_(computer_programming))를[6] 지니고 있기 때문이다.

`golang` 프로젝트는 이와 반대로 최대한 느슨한 연결을 지향하여 **통제**하고 **예측가능**하게 관리한다. 이는 비지니스 로직은 변경 없는 견고함을 가져가며, 실제 외부 의존성을 자유롭게 바꿀 수 있는 근거가 될 것이다.

> 여러분께서 맡고 있는 애플리케이션은 분명히 변합니다. **반드시 바뀌고 필히 확장됩니다.** 그럴 때마다 포트와 어댑터 설계는 여러분이 어디를 수정해야 할지 직관적으로 알려주고, 무엇을 바꿔야 할지 고민할 시간을 줄여주기도 하며, 수정사항을 쉽게 적용할 수 있게 해줄 겁니다

# 번외, 그 외에 규칙

이번 `golang` 프로젝트에서는 몇 가지 계층형 아키텍쳐가 기본적으로 가져가는 규칙들을 추가로 가지고 있는데, 이 또한 설명하면 좋을 것 같아 간단히 소개해보고자 한다.

## 건너뛰기 금지

일반적으로 계층형 아키텍쳐에서 주요하게 작용하는 방식 중 하나다. 아래 그림과 같이 요청(Request)의 흐름은 오직 한 단계씩 레이어를 통해서 요청되어야 하며, 이를 어길 경우 비지니스 로직이 세부 구현에 대해 너무 많이 알고 있게 된다. 이는 또 다시 변경이 어려운 코드로 변질될 것이다.

![Untitled](/assets/iamges/layered.png)

<center> *그림 4. 계층형 구조에서 Closed layers[7]*</center>

`golang` 프로젝트의 경우 아래에 흐름이 강제된다. (그림으로 보충 필요)

<aside>
👍 `Infrastructure`(gRPC, HTTP ..) → `Use case` → `Service` → `Repository`


</aside>

## 역류 금지

위에서 언급한 계층의 흐름이 강제되며 역류할 수 없다.

<aside>
🚫 `Infrastructure`(gRPC, HTTP ..) ←(불가능) `Use case`


</aside>

## 동일 계층 참조 금지

잘 만들어진 구현체의 재사용을 늘리고, 비지니스 로직의 오염을 막기 위한 방식이다.

<aside>
🚫 `Service` →(불가능) `Service`


</aside>

# 맺음말

오늘은 소프트웨어 아키텍쳐에 대한 중요성, 육각형 아키텍쳐는 어떤 구조인지 등 여러가지를 알아보았다.

사실 이렇게 글을 써도 아직까지는 아키텍쳐의 추상적이고 모호한 부분을 잘 설명하지 못한 것 같다. 또한, 이러한 특성은 실제 개발할 때도 나타난다고 생각한다. 항상 이상적인 부분과 현실은 결합될 수 없는 무언가로 맞닿아 있고, 우리 역시 그러한 문제를 실제로 겪고있다고 느낀다.

어떤 것이든 트레이드 오프(trade-off)가 있기 마련이고 각자 상황에 맞는 아키텍쳐를, 개발 방식을 선택할 수 있기를 바라며 이 글이 그 결정을 돕는 하나의 기준이되길 바란다.

# References

[1] [https://geminikim.medium.com/지속-성장-가능한-소프트웨어를-만들어가는-방법-97844c5dab63](https://geminikim.medium.com/%EC%A7%80%EC%86%8D-%EC%84%B1%EC%9E%A5-%EA%B0%80%EB%8A%A5%ED%95%9C-%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4%EB%A5%BC-%EB%A7%8C%EB%93%A4%EC%96%B4%EA%B0%80%EB%8A%94-%EB%B0%A9%EB%B2%95-97844c5dab63)

[2] [https://martinfowler.com/articles/is-quality-worth-cost.html#SoftwareQualityMeansManyThings](https://martinfowler.com/articles/is-quality-worth-cost.html#SoftwareQualityMeansManyThings)

[3] [https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software))

[4] [https://engineering.linecorp.com/ko/blog/port-and-adapter-architecture/](https://engineering.linecorp.com/ko/blog/port-and-adapter-architecture/)

[5] [https://netflixtechblog.com/ready-for-changes-with-hexagonal-architecture-b315ec967749](https://netflixtechblog.com/ready-for-changes-with-hexagonal-architecture-b315ec967749)

[6] [https://en.wikipedia.org/wiki/Coupling_(computer_programming)](https://en.wikipedia.org/wiki/Coupling_(computer_programming))

[7] [https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/ch01.html](
