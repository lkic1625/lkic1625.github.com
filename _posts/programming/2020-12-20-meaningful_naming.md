---
title: "의미있는 변수명"
tags:
  - clean_code
  - naming
categories:
  - programming
last_modified_at: 2020-12-20T13:00:00+18:00
toc: true
---

# Introduction

이번에 포스팅할 주제는 `Robert Cecil Martin, Clean Code`의 내용이다.

위 책에서는 좋은 코드에 대한 정의를 상당히 자세히 그리고 친절하게 설명해두었다.

사실 잘 읽히지 않는 코드는 설명하지 않아도 안다. 우리 몸이 바로 <b>반응</b>하지 않는가?
<br>반면에 좋은 코드를 짜는 방법은 뚜렷한 <b>기준</b>이 없는 것 같다. 위 책은 그 애매모호한 기준을 이해하기 쉽게 정리해두었다!

`Netflix`는 개발팀의 누군가가 하나 사라진다해도 완벽히 돌아갈 코드 작성을 지향한다.

개인적으론 작성자의 <b>주석, 설명 없이도</b> 완벽히 이해 가능한 코드를 지향한다.
<br>코드는 단순히 컴퓨터와 소통하는 기구가 아니라 역시 또한 <b>언어</b>라는 의미다.

오늘도 별 쓰잘데없는 서론으로 시작한다. 자 이제 본격적으로 포스팅에 들어가보자.

# 의미있는 변수명

>Names are everywhere in software. We name our variables, our functions, our arguments,
classes, and packages. We name our source files and the directories that contain them. We
name our jar files and war files and ear files. We name and name and name.<br><br>
Clean Code, Chapte 2

우리는 모든 곳에 이름을 붙인다. 솔직히 이름 정하기가 제일 어렵다. 알고리즘 고민보다 변수명 작성이 더 어려운 것 같다..

따라서, 이와 관련된 절대적이지는 않지만 지향되는 규칙을 책에서 정리해두었다.

평소에 몰랐던 것 혹은 매우 중요하게 생각했던 것들만 적어보겠다.

## 의도를 분명히 밝혀라

변수나 함수는 존재 이유, 수행 기능, 사용 방법 등에 대해 분명히 밝힐 필요가있다. 주석과 함께 추가 설명이 필요하다면 이를 충분히 제공하지 못하는 이름이라 할 수 있다.

```java
int d; //경과 시간 (단위: 날짜)
```

보단,

```java
int elapsedTimeInDays;
int daysSinceCreation;
int daysSinceModification;
int fileAgeInDays;
```

위 코드가 직관적이다.

코드를 작성한 사람만 코드를 읽는 게 아니다. 협업을 하고 우리가 만든 코드를 누군가가 사용할 때 작동하는 법을 읽히거나 변수를 사용할 것이다.

아무리 주석을 잘 달아놓은 변수명이라고 하더라도, 기억력이 아주 좋지 않은 이상 저런 모호한 이름은 까먹고 계속해서 정의를 확인하는 작업이 동반될 것이다.
<br>이러한 상황은 결국 비효율적이다. 개발자는 누구보다 <b>효율적이야</b> 하지 않은가?

## 그릇된 정보를 피해라.

코드에 오해의 소지가 있는 단서를 남기면 안 된다.

`hp`, `aix`, `sco`과 같은 변수명은 유닉스 플랫폼이나 유닉스 변종을 가리키는 이름이다. 삼각형의 빗변(hypotenuse)을 나타내는 변수명으로 `hp`는 적절해 보일지 모르지만, 그릇된 정보를 제공하는 것이다.

`AccountsList` 또한 그러하다. `List`는 개발자에게 특별한 의미를 갖는 이름이다. 차라리, `accountGroup`, `bunchOfAccounts` 혹은 `Accounts`가 더 적합할 것 같다.

서로 흡사한 이름도  <b>지양</b>된다.

## 발음하기 쉬운 이름을 사용하라

책에서 말해주는 예시는 `genymdhms(generation date, year, month, day, hour, minute, and second)` 젠 야 무다 힘즈.. 정신이 나가버릴 것만 같은 이름이다.

인간의 뇌는 발음하기 쉬운 것을 쉽게 외운다. 아니 정확히는 자주 발음해본 익숙한 것을 외우기 쉬울 수도 있다.

`DtaRcr02`와 같은 축약어 방식도 <b>지양</b>된다.

## 해법 영역에서 가져온 이름을 사용하라

프로그래머들이 사용하는 전산용어, 알고리즘, 패턴, 수학용어 등은 사용해도 괜찮다.

`Visitor` 패턴에 익숙하거나 `JobQueue`를 아는 프로그래머 등 기술 개념에는 기술 이름이 가장 적합한 선택이다.

><font size="6">Refernce</font>
- Robert Cecil Martin, Clean Code, Chapter 2
