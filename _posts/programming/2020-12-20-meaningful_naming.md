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

책에서는 좋은 코드에 대한 정의를 상당히 자세히 그리고 친절하게 설명해두었다.<br>
근데 막상 직접 느껴보면 뭐가 나쁜 코드인지는 본능적으로 알지 않나 싶다.

난 예전부터 좋은 코드는 주석 없이도 술술 읽히며 이 코드가 뭘 원하는지 알 수 있는 코드가 제일 좋은 코드라 생각했다.<br>
특히 작성자의 설명 없이도 읽힌다면, `아름다운` 코드가 아닐까?

오늘도 별 쓰잘데없는 서론으로 시작한다. 자 이제 본격적으로 포스팅에 들어가보자.

# 의미있는 변수명

>Names are everywhere in software. We name our variables, our functions, our arguments,
classes, and packages. We name our source files and the directories that contain them. We
name our jar files and war files and ear files. We name and name and name.<br><br>
Clean Code, Chapte 2

우리는 모든 곳에 이름을 붙인다. 솔직히 이름 정하기가 제일 어렵다. 알고리즘 고민보다 변수명 작성이 더 어려운 것 같다..

따라서, 이와 관련된 절대적이지는 않지만 지향되는 규칙을 정리해보겠다.

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
<br>아무리 주석을 잘 달아놓은 변수명이라고 하더라도, 기억력이 아주 좋지 않은 이상 저런 모호한 이름은 까먹고 계속해서 정의를 확인하는 작업이 동반될 것이다.
<br>이러한 상황은 결국 비효율적이다. 개발자는 누구보다 효율적이야 하지 않은가?

## 그릇된 정보를 피해라.

코드에 오해의 소지가 있는 단서를 남기면 안 된다.

`hp`, `aix`, `sco`과 같은 변수명은 유닉스 플랫폼이나 유닉스 변종을 가리키는 이름이다. 삼각형의 빗변(hypotenuse)을 나타내는 변수명으로 `hp`는 적절해 보일지 모르지만, 그릇된 정보를 제공하는 것이다.<br>
`AccountsList` 또한 그러하다. `List`는 개발자에게 특별한 의미를 갖는 이름이다. 차라리, `accountGroup`, `bunchOfAccounts` 혹은 `Accounts`가 더 적합할 것 같다.<br>
서로 흡사한 이름도 지양된다.
