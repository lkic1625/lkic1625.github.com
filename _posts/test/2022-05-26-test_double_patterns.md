---
title: "여기저기서이상한소리만하는테스트대역(TestDouble)용어정리해보기"
tags:
  - test
  - test_double_patterns
categories:
  - spring
last_modified_at: 2022-05-29T13:00:00+17:00
toc: true
---

# 개요

 Mock 프레임워크(ex: [Mockito](https://site.mockito.org/))를 사용하다보면 생소한 단어들이 자주 출몰하곤 합니다. **@Spy**, **@Mock** 등 뜻은 모른 체 기능만 이해하고 사용하는 경우가 많은데, 이에 대한 정확한 정의는 뭘까요?

최근 사내 스터디에서 읽고 있는 [Unit Testing](https://www.amazon.com/Unit-Testing-Principles-Practices-Patterns/dp/1617296279) 또한 이러한 용어가 자주 언급됩니다. 토의를 진행하다가도 계속 물음표만 자아낼 뿐 맥락상으로만 이해한 것들이 많았는데, 이런 상태로 스터디를 이어가는 것도 한계가 있어보여 위 용어들을 명확하게 정의해보기로 하였습니다.

이번 포스트는 여러 자료를 토대로 모호한 `Test Double Patterns` 의 용어들을 잘 정의해보기 위해 작성했습니다. 간단한 예제를 통해 살펴보려고 하며, 저처럼 자료마다 제 각기인 [Test Double](https://en.wikipedia.org/wiki/Test_double) 이야기에 신물이 난 분들에게 도움이 됐으면 좋겠습니다.

> 해당 포스트의 모든 내용은 [xUnit Test Patterns](https://www.amazon.com/xUnit-Test-Patterns-Refactoring-Code/dp/0131495054) 와 Martin Fowler 의 블로그 글을 기반으로 작성되었습니다.

# 기본적인 테스트 방법

우리는 기본적으로 테스트할 때, [Given-When-Then](https://en.wikipedia.org/wiki/Given-When-Then)(혹은 Arrange-Act-Assert) 구조를 따라갑니다. **주어진 상황**에서 테스트 대상이 올바르게 **동작**하는지 **검증**하는 방식으로 구성되어 있죠.

```java
public class OrderStateTester extends TestCase {
  ...
  public void testOrderIsFilledIfEnoughInWarehouse() {
    // Given
    Order order = new Order(TALISKER, 50);
    // When
    order.fill(warehouse);
    // Then
    assertTrue(order.isFilled());
    assertEquals(0, warehouse.getInventory(TALISKER));
  }
  ...
}
```
<center><i>코드 1. 전형적인 테스트 구조]</i></center>

그렇다면 **검증**한다는 것은 정확히 어떤 것을 검증하는 것일까요? 여기서 우리가 꼭 알아야 할 단어가 등장합니다. 바로, `Behavior verification` 과 `State verification` 입니다.

# 그 전에 잠시

앞선 두 검증 방식의 차이를 명확하게 이해하기 위해선 또 다시 `Indirect Points` 와 `SUT(System Under Test)` 를 의미를 이해해야 하는데요, 선행 과정이 많고 모두 추상적이라 걱정이지만, 간단하게 살펴봅시다.

## System Under Test

> The "system under test". It is short for "whatever thing we are testing" and is always defined from the perspective of the test.
>

**SUT(System Under Test)** 는 실제 테스트할 대상(혹은 동작)을 지칭하는 포괄적인 개념입니다. **단위 테스트**를 할 때 어떤 클래스, 오브젝트 혹은 메서드가 모두 포함될 수 있습니다.

## Indirect Points

> When the behavior of the **[system under test (SUT)](http://xunitpatterns.com/SUT.html)** includes actions that cannot be observed through the public API of the **[SUT](http://xunitpatterns.com/SUT.html)** but which are seen or experienced by other systems or application components, we call those actions the *indirect outputs* of the **[SUT](http://xunitpatterns.com/SUT.html).**
>

**Indircet Points** 는 다른 어플리케이션이나 컴포넌트에서 일어나며, 실제 SUT 상에서 확인할 수 없는 동작들을 의미합니다. 예시로는 메세지 큐의 `consume`, 다른 컴포넌트의 메서드가 이에 해당할 수 있습니다.

이렇게만 설명하면 더욱 추상적이니 `UserMailNotificationService` 라는 시스템을 하나 가정해보도록 하겠습니다.

```java
public UserMailNotificationService {
	private MailService mailService;
	private UserRepository userRepository;

  public void sentAll(String msg) {
    ...
	  List<User> users = userRepository.findAll();
    users.forEach(user -> {
			boolean success = mailService.sent(user.getEmail(), msg);
			if (success) {
				user.setSent(Instant.now());
			}
		});
    ...
  }
}
```

실제 `UserMailNotificationService#sentAll` 메서드 내부에서 `mailService` 를 이용해 어떤 메세지를 `sent` 하고 있지만 이는 내부 구현으로써, 외부에 공개되지 않은 동작입니다. 또한, `mailService` 는 실제로 `UserMailNotificationService` 에 대한 단위 테스트 시 **우리가 집중해야할 대상이 아닙니다.** 메일이 실제로 보내지는지 중요하지 않죠.

이러한 Indirect points 는 실제로 단위 테스트 시 처리하는 방법이 여러가지 존재합니다. Test Double 이 그 좋은 예이며, 계속해서 이들을 설명해보겠습니다.

# Behavior verification vs State verification

## State verification

이해하기 쉬운 **State verification** 부터 짚고 넘어가봅시다. State verification 은 실제 내부에 Indirect points 의 결과값이 어떻게 동작하든 상관없이, 동작 이후 SUT 의 **상태만을** 검증합니다.

![Untitled](/assets/images/stateverfication.png)

앞서 들어본 예제를 이용하자면, `UserMailNotificationService#sentAll` 이후 유저의 상태 정도만 파악하겠죠.

```java
public UserMailNotificationServiceTest {
	...

	@Test
	void sentAll() {
		String msg = "dummy";
		User user = createUser();
		userRepository.save(user);

		service.sentAll(msg);

		// state verification
		assertThat(user.getSent()).isNotNull();
		assertThat(user.getSent()).isLessThanEqaul(Instant.now());
    ...
	}
	...

}
```

## Behavior verification

**Behavior verification** 은 이와 조금 다릅니다. SUT 가 실행되는 동안 실제 indrects points 또한 동작을 검증합니다.

![Untitled](/assets/images/behaviorverfication.png)

앞서 본 예제를 조금 변형시킨다면, 아래와 같은 검증문을 통해 검사를 진행할 것입니다.

```java
public UserMailNotificationServiceTest {
	...

	@Test
	void sentAll() {
		String msg = "dummy";
		User user = createUser();
		userRepository.save(user);

		service.sentAll(msg);

		// Behavior verification
		Mockito.verify(**mockMailService**, times(1)).sent(user.getEmail(), msg);    
		...
	}
	...

}
```

# Test Double Patterns 정리

## Mock 을 이용한 테스트 방식

![Untitled](/assets/images/mockobject.png)

**Mock Object** 은 실제 indirect points 를 검증하는 도구입니다. 앞서 보았던 Behavior verification 을 사용하는 유일한 테스트 더블이며,방금 전 `Mockito.verify(mockRepository, ..)` 이 이에 해당합니다.

```java
public UserMailNotificationServiceTest {
	...

	@Test
	void sentAll() {
		String msg = "dummy";
		User user = createUser();
		userRepository.save(user);

		service.sentAll(msg);

		// Behavior verification
		Mockito.verify(**mockMailService**, times(1)).sent(user.getEmail(), msg);
		...
	}
	...

}
```

## Stub 을 이용한 테스트 방식

![Untitled](/assets/images/teststub.png)

**Test Stub** 은 실제 SUT 상에서 indirect points 를 제어하고 미리 테스트에 필요한 **결과값만을** 제공합니다. State verification 을 사용하며, 예제는 아래와 같습니다.

```java
public UserMailNotificationServiceTest {
	...

	@Test
	void sentAll() {
		String msg = "dummy";
		User user = createUser();
		userRepository.save(user);

		List<User> users = List.of(user);
		// stubbing
		Mocktio.when(mailService.sent(User.class, String.class)).thenReturn(true); //stubbing

		service.sentAll(msg);

		// state verification
		assertThat(sut).isEqualTo(users);
    ...
	}
	...

}
```

## 그 외

### Test Spy

![Untitled](/assets/images/testspy.png)

**Test Spy** 는 보통 Indirect points 와 실제로 같은 동작을 하며, 호출 횟수와 같은 추가적인 정보를 저장합니다. 아래는 이를 검증하는 예시입니다.

```java
public UserMailNotificationServiceTest {
	...

	@Test
	void sentAll() {
		String msg = "dummy";
		User user = createUser();
		userRepository.save(user);

		service.sentAll(msg);

		// state verification
		assertThat(**mailServiceSpy**.getNumberOfCalls()).isEqualTo(1);
    ...
	}
	...

}
```

### Fake Object

![Untitled](/assets/images/fakeobject.png)

**Fake Object** 는 실제로 동작하는 구현을 가지고는 있지만, 프로덕션 환경에서 적합하지 않은 구현체를 의미합니다. 가장 대표적인 예시로는 **인메모리 데이터베이스**가 있습니다.

# 맺음말

정리하고 든 생각입니다만, 이정도로까지 이해도를 깊게 가져갈 필요는 없어보입니다. 분명 `Stubbing` 과 `Mocking` 의 차이는 중요할 수 있지만, 라이브러리를 사용하는 입장에서는 모르고 사용해도 좋은 단위 테스트를 작성할 수 있으니까요.

이전에도 언급했지만 이론적인 부분과 실무는 항상 **타협점이 존재한다** 생각합니다. 이상적인 상황은 현실에선 드물기 때문이죠. [`Mockito` 역시 `Mocking Framework` 가 아니고 실질적으론 `Test Spy framework` 입니다.](https://github.com/mockito/mockito/wiki/FAQ#is-it-really-a-mocking-framework) 이런 사례에서도 볼 수 있듯이 명확한 정의는 중요한 것이 아니라고 느껴집니다.

각자가 생각하는 각 조직이 생각하는 테스트에 중요성이 있을 것이고, 서로간의 상호협의, 공유만 존재한다면 Mock 이 뭐고, Stub 이 뭔지 몰라도 충분히 상관없다 느낍니다. `Test Double Patterns` 는 아무리 생각해도 뇌절 같아요.

# References

[1] [https://martinfowler.com/articles/mocksArentStubs.html#TestIsolation](https://martinfowler.com/articles/mocksArentStubs.html#TestIsolation)

[2] [http://xunitpatterns.com/Test Double.html](http://xunitpatterns.com/Test%20Double.html)
