---
title: "Nouvelle Vague"
tags:
  - nodejs
  - projects
categories:
  - nodejs
last_modified_at: 2020-09-24T13:00:00+18:00
toc: true
---

# MEAN stack

- mongodb
- express
- angular
- nodejs

모두 자바스크립트로 동작 가능하며, 오픈 소스이다.

# SPA
`single page application`이라 하며 모든 페이지가 단 하나로 되어 있는 사이트.

보통 웹사이트는 글쓰기, 회원가입 등 복잡한 기능을 여러 페이지에서 지원하지만, 이 페이지는 html 상에서 추가로 필요한 데이터만 서버로부터 받아 화면을 구성해주는 것으로 실제로 추가 HTML 호출이 일어나지 않는다.

일반적으로 웹사이트에서 메뉴바, 푸터 등은 페이지마다 정적임에도 불구하고 서버에 새로 읽어오게 되는데, 이에 따라 불필요한 데이터 소모가 일어난다. 불필한 코드를 계속해서 요청하지 않아도 된다는 장점이있다.

# 스크립트 언어

https://www.a-mean-blog.com/ko/blog/MEAN-Stack/_/MEAN-Stack-%EC%86%8C%EA%B0%9C

# Docker 란

https://subicura.com/2017/01/19/docker-guide-for-beginners-1.html

# 온 디맨드 이미지 리사이징

https://heropy.blog/2019/07/21/resizing-images-cloudfrount-lambda/
https://helloinyong.tistory.com/246

## content delivery network

https://goddaehee.tistory.com/173

# httponlycookie

https://owasp.org/www-community/HttpOnly

# federated learning

연합학습이란, 민감정보를 이용한 러닝을 효과적으로 진행할 수 있는 방식으로써, 사용자 개개인의 데이터를 이용한 로컬 모델의 러닝이후 weight값을 모아 평균을 구하고, 이를 글로벌 모델에게

## secure aggregation Protocol

## KGC?

key generation server 약자.

trusted third party

## middle server

# 데이터베이스 캐싱

[링크](/nodejs/database_caching)

# 데이터베이스 모델

# REST, HTTP API

## REST 구성

- 자원(resource) - URI
- 행위(verb) - HTTP METHOD
- 표현(representation)

## REST 특징

### 1. uniform interface
유니폼 인터페이스는 URI로 지정한 리소스에 대한 조작을 통일되고 한정적인 인터페이스로 수행하는 아키텍쳐 스타일을 의미한다.
### 2. stateless
`REST`는 무상태성을 가진다. 다시 말하자면, 작업을 위한 상태정보를 따로 저장하고 관리하지 않는다.

세션 정보나 쿠키 정보를 별도로 저장하고 관리하지 않기 때문에 API 서버는 들어오는 요청만을 단순히 처리하면 된다.
때문에 서비스의 자유도가 높아지고 서버에서 불필요한 정보를 관리하지 않음으로서 구현이 단순해진다.
### 3. cacheable
`REST`의 가장 큰 특징 중 하나는 `HTTP`라는 기존 웹표준을 그대로 사용하기 때문에, 웹에서 사용하던 기존 인프라를 그대로 활용한다.
따라서, `HTTP`가 가진 캐싱 기능을 적용 가능하다. 기존 프로토콜에서 사용하는 `last-modified`, `e-tag`를 이용하면 캐싱 구현이 가능하다.
### 4. self-decriptiveness(자체 표현 구조)
`REST API`를 보고도 기능을 추론, 이해할 수 있다.
### 5. client - server 구조
`REST`서버는 `API`를 제공 클라이언트는 사용자 인증과 컨텍스트를 직접 관리하는 구조로 각각의 역할을 확실히 분할하기 때문에 서로간 의존성이 줄어든다.
### 6. 계층형 구조
`REST` 서버는 다중 계층으로 구성할 수 있다. 보안, 로드밸런싱, 암호화 계층을 추가해 구조상의 유연성을 확보하며 `PROXY`, `GATEWAY`등 네트워크 기반 중간매체를 둘 수 있음.

## REST API 중심 규칙

- URI는 정보 자원을 표현해야 한다.
- HTTP METHOD는 자원에 대한 행위를 표현해야 한다.

```
GET /members/delete/1  (X)
```

```
DELETE /members/1  (O)
```

## 설계시 주의점

### 슬래시 구분자는 계층관계를 나타내는 데 사용한다.
```
http://restapi.example.com/houses/apartments
http://restapi.example.com/animals/mammals/whales
```

### URI 마지막 문자로 슬래시를 포함하지 않는다.
URI에 포함되는 모든 글자는 유일한 식별자로 사용되어야 하며 URI가 다르다는 것은 리소스가 다르다는 것이다.
```
http://restapi.example.com/houses/apartments/ (X)
http://restapi.example.com/houses/apartments  (0)
```

### 가독성을 위해 하이픈(-) 사용

### 밑줄(_)은 사용하지 않는다.
가독성 관련 문제이다.

### URI는 소문자가 적합하다.
 RFC 3986(URI 문법 형식)은 URI 스키마와 호스트를 제외하고는 대소문자를 구별하도록 규정하기 때문이다.

### 확장자는 포함하지 않는다.


# js


## es6?

### const, let
`const`를 기본으로 사용한다. 이는 불변성을 말하는 것이 아니라 값을 재할당할 수 없다는 것이다.
`const`를 사용하더라도 배열과 오브젝트의 값을 변경하는 것은 가능하다.

> const declaration tells readers, "this variable is never reassigned," reducing cognitive load and improving maintainability.

> Block scope is common in many other programming languages and helps programmers avoid mistakes such as:

```javascript
var count = people.length;
var enoughFood = count > sandwiches.length;

if (enoughFood) {
    var count = sandwiches.length; // accidentally overriding the count variable
    console.log("We have " + count + " sandwiches for everyone. Plenty for all!");
}

// our count variable is no longer accurate
console.log("We have " + count + " people and " + sandwiches.length + " sandwiches!");
```


## arrow function

### 람다식, 익명함
람다식은 함수형 프로그래밍의 적합한 문법적 표현방식이다.

> 람다식은 결국 로컬 구현객체를 생성하게 되지만, 이의 사용 목적은 인터페이스가 가지고 있는 메소드를 간편하게 즉흥적으로 구현해서 사용하는 것이 목적이다.

반복문의 블럭 크기를 줄이고 프로그래머의 의도를 좀 더 간결히 나타낸다.(가독성)
지역적 사용으로 인한 함수에 대해 외부 노출을 피할 수 있다.

또한 `high order function` 함수형 프로그래밍으로 람다식을 사용하기도 한다.

# https?

`Transport Layer Security`와 `Secure Socket Layer` 등의 프로토콜을 사용한다.

`TLS`는 핸드쉐이킹을 통해 서로 통신이 열리면 인증서와 키공유등을 통해 암호화 파라미터를 공유한다.

`SSL`의 경우 OSI 7계층중 특정 계층에 속해있는 것이 아닌 전송계층 과 응용계층 사이에 독립적인 계층을 만들어 동작한다.


# index

# MVC

디자인 패턴 중 하나로써 규약을 통해 쓉게 쓸 수 있는 형태로 만든 것이다.

비지니스 처리 로직과 사용자 인터페이스 요소를 분리시켜 서로 영향없이 개발할 수 있다.

![이미지](/assets/images/mvc_role_diagram.png)

## model

모델은 어플리케이션의 정보, 데이터를 나타낸다. 정보의 접근, 가공을 책임지는 컴포넌트이다.

1. 사용자가 편집하길 원하는 모든 데이터를 가지고 있어야한다.
2. 뷰나 컨트롤러와 독립적이며 이에 대한 어떤 정보도 가지고 있지 않는다.
3. 변경에 대한 통지방법을 구현해야 한다.

## controller
데이터와 사용자 인터페이스 요소를 잇는 다리역할을 한다. 이벤트를 처리하며, 이는 모델이 "어떻게" 처리할지를 알려주는 컴포넌트이다.

## view
화면에 보여주기 위한 역할을 하며, 최종 사용자에게 맞춤 UI를 제공한다,


# TCP, UDP

## TCP

- 연결 지향형 프로토콜
- 데이터 dropout을 방지하는 데이터 흐름제어를 한다.
- 에러 메세지가 발생할 경우 자동으로 전송하는 에러제어
- TCP 는 멀티캐스팅이나 브로드캐스팅을 지원하지 않는다.

## UDP

- 신뢰성있는 전송을 보장하지 않음.
- 효율적이다.

# 스레드

스레드는 프로세스의 실행 단위라고 할 수 있다. 한 프로세스 내에서 동작되는 여러 실행 흐름으로 프로세스 내의 주소 공간이나 자원을 공유할 수 있다. 스레드는 스레드 ID, 프로그램 카운터, 레지스터 집합, 그리고 스택으로 구성된다. 같은 프로세스에 속한 다른 스레드와 코드, 데이터 섹션, 그리고 열린 파일이나 신호와 같은 운영체제 자원들을 공유한다. 하나의 프로세스를 다수의 실행 단위로 구분하여 자원을 공유하고 자원의 생성과 관리의 중복성을 최소화하여 수행 능력을 향상시키는 것을 멀티스레딩이라고 한다. 이 경우 각각의 스레드는 독립적인 작업을 수행해야 하기 때문에 각자의 스택과 PC 레지스터 값을 갖고 있다.

# sql 엔진 차이점

https://rebeccajo.tistory.com/14


><font size="6">Refernce</font>
- https://www.a-mean-blog.com/ko/blog/MEAN-Stack/_/MEAN-Stack-%EC%86%8C%EA%B0%9C
- https://meetup.toast.com/posts/92
- https://github.com/Mrchanghao/Interview_Question_for_Beginner
- https://velog.io/@godori/ES6-%EC%A0%95%EB%A6%AC-vpjmrh6hhe
- https://eslint.org/docs/rules/no-var.html
