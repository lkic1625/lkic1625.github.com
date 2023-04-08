---
title: "MockitoExtension"
tags:
  - test
  - mockito
  - junit
categories:
  - test
last_modified_at: 2022-05-29T13:00:00+17:00
toc: true
---

# 개요

이번 글에서는 간단히 `MockitoExtention` 의 생명주기를 알아보려 합니다. `Mockito` 를 `JUnit` 과 같이 사용할 경우 `[MockitoExtention](https://www.javadoc.io/static/org.mockito/mockito-junit-jupiter/4.6.0/org/mockito/junit/jupiter/MockitoExtension.html)` 을 사용하게 되는데, 실제로 언제 테스트 픽스쳐에 목 인스턴스를 주입하게 될까요?

이는 특히 `JUnit` 의 생명주기와도 밀접한 관련이 있습니다. 해당 구현체는 `MockitoCore` 를 어떻게 다루고 있을지, 언제 어떤 식으로 인스턴스가 주입될지에 대해 이야기해보겠습니다.

이 글은 `JUnit` 의 테스트 생명주기와 `Mockito` 사용을 해보신 분이 아니라면 맥락 중에 생략된 것이 많아 적절하지 않을 수 있습니다.

# JUnit 테스트 인스턴스

> **JUnit** is a simple framework to write repeatable tests. It is an instance of the xUnit architecture for unit testing frameworks.

 우선, `JUnit` 부터 봅시다. 여기서 알아야할 특징은 `JUnit` 은 테스트 클래스에서 여러 개의 테스트 메서드가 존재할 때, 각각의 테스트마다 **인스턴스**를 새로 생성한다는 점입니다. 왜 그럴까요?

`JUnit` 은 `Mockito` 를 이용한 테스트 외에도 다양한 테스트에서 사용하는 테스트 프레임워크입니다. 그렇다면 단위 테스트가 아닌, 통합 테스트를 하나 가정해봅시다. 테스트에서 만약 공유하는 데이터베이스를 사용해 그곳에 직접 테스트하면 어떻게 될까요? 모든 테스트는 서로에게 영향을 미치는 “**공유 의존성**” 을 가지게 됩니다. 이는 직접적인 **안티 패턴**으로 간주하고 있습니다.

각각의 테스트는 서로에게 영향을 주어서는 안 됩니다. 그렇기에 `JUnit` 은 테스트 클래스의 메서드마다 해당 테스트 인스턴스를 새로 생성하고 있습니다. 한 인스턴스가 모든 테스트를 진행하게 되면, 그 순간 해당 인스턴스도 하나의 “공유 의존성"이 되는 거죠.

# MockitoExtension

본격적으로 `MockitoExtention` 을 살펴봅시다. 우선 구현체를 살펴보면, 아래와 같습니다.

```java
public class MockitoExtension implements BeforeEachCallback, AfterEachCallback, ParameterResolver {
	...
}
```

여기서 구현하고 있는 인터페이스들은 생소한 게 많습니다. 간단히 설명하자면, `BeforeEachCallback` 과 `AfterEachCallback` 은 상속 시 `JUnit` 테스트 생명주기에서 실행할 수 있는 커스텀 코드를 삽입할 수 있는 인터페이스입니다. 또한, `ParameterResolver` 는 테스트 메서드 파라미터를 런타임에 동적으로 주입할 수 있도록 하는 `Interceptor` 를 구현할 수 있습니다.

`JUnit` 은 한 테스트 인스턴스마다 **생명주기**를 가지고 있습니다. 앞서 말씀드린 어노테이션은 그림에서 각각 `[@BeforeEach](https://junit.org/junit5/docs/5.0.2/api/org/junit/jupiter/api/BeforeEach.html)` 와 `[@AfterEach](https://junit.org/junit5/docs/5.0.2/api/org/junit/jupiter/api/AfterEach.html)` 생명주기에 실행할 수 있도록 `JUnit` 에서 제공하고 있는 인터페이스이며, `MockitoExtension` 또한 이를 구현하기 위해, 정확히는 `Mock` 을 주입하기 위해 사용되죠.

![Untitled](/assets/images/junitlifecycle.png)
<center><i>그림 1. 테스트 인스턴스의 생명주기</i></center>

# Mock 을 주입하는 과정

## BeforeEach

`BeforeEach` 의 구현을 봅시다. 주목해야할 곳은 `MockitoSession` 객체 생성 부분입니다. 해당 클래스는 테스트 인스턴스에서 `Mocking` 이 필요한 클래스를 스캔 및 생성하고 있습니다.

`MockitoSession` 은 한 테스트 인스턴스의 생명주기를 관리하는 `context` 를 이용하며, 각 테스트마다 세션을 생성해, 관리 및 삭제하게 됩니다.

```java
 ...
		@Override
    public void beforeEach(final ExtensionContext context) {
        List<Object> testInstances = context.getRequiredTestInstances().getAllInstances();

        Strictness actualStrictness = this.retrieveAnnotationFromTestClasses(context)
            .map(MockitoSettings::strictness)
            .orElse(strictness);

        MockitoSession session = Mockito.mockitoSession()
            .initMocks(testInstances.toArray())
            .strictness(actualStrictness)
            .logger(new MockitoSessionLoggerAdapter(Plugins.getMockitoLogger()))
            **.startMocking();**

        context.getStore(MOCKITO).put(MOCKS, new HashSet<>());
        context.getStore(MOCKITO).put(SESSION, session);
    }
...
```

## AfterEach

`Mock` 인스턴스는 `[ScopedMock](https://javadoc.io/static/org.mockito/mockito-core/4.6.0/org/mockito/ScopedMock.html)` 이라는 인터페이스를 상속받기에 AutoClosable 이지만, 명시적으로 지워주는 것을 권장하고 있습니다.

> The static mock is released when this object's `[ScopedMock.close()](https://javadoc.io/static/org.mockito/mockito-core/4.6.0/org/mockito/ScopedMock.html#close())` method is invoked. If this object is never closed, the static mock will **remain active on the initiating thread.** It is therefore recommended to create this object within a try-with-resources statement unless when managed explicitly, for example by using a **JUnit rule or extension.** [1]

`BeforeEach` 가 `Mock` 을 주입하기 위해 인스턴스를 생성해주었다면, 반대로 `AfterEach` 는 이를 `close` 하는 작업을 합니다. 인용구에서 알 수 있듯이 하나의 테스트 인스턴스에서만 사용하는 thread-local mock 을 생성하고 관리하기에, 이는 반드시 `close` 되어야 합니다.

```java
...
    @Override
    @SuppressWarnings("unchecked")
    public void afterEach(ExtensionContext context) {
        context.getStore(MOCKITO).remove(MOCKS, Set.class).forEach(mock -> ((ScopedMock) mock).**closeOnDemand**());
        context.getStore(MOCKITO).remove(SESSION, MockitoSession.class)
                .finishMocking(context.getExecutionException().orElse(null));
    }
...
```

# 맺음말

결론적으로는 테스트 인스턴스마다 새로 `Mock` 인스턴스를 생성하며, 이를 매번 다시 `close` 해주는 작업을 진행하고 있습니다. 그 외에 구현하고 있는 `ParameterResolver` 도 소개해보면 좋겠지만, 단순히 `Mock` 인스턴스를 테스트 메서드 파라미터에 주입하는 과정이기에 생략해도 좋을 것 같습니다. 직접 구현체를 보시는 것도 추천드립니다.

# References

[1] [https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/MockedStatic.html](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/MockedStatic.html)
