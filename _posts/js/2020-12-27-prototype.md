---
title: "prototype"
tags:
  - js
  - asynchronous
categories:
  - js
last_modified_at: 2020-12-28T13:00:00+18:00
toc: true
---

# Introduction

`redis` 공부 중 예제에서 `prototype`을 사용했다. 처음에는 아 이거~ 하면서 아는 듯이 사용했지만 이게 뭐하는 건지 제대로 알고 쓴 적이 없다는 걸 느꼈다.

<b>가볍게</b> 써보는 `prototype`에 대한 포스트다.

아, 그리고 최근들어 포스트를 작성할 때 듣고있는 노래를 기록해보고 있다. 지금 내가 듣고 있는 노래는 `SATIE Trois gymnopédies: No. 1, Lent et doloreux`다.

# Prototype

## Prototype-based language

자바스크립트는 `prototype-based language`다. 물론 자바스크립트에서도 ES2015부터 `class`를 사용가능하다.

하지만 클래스도 결국 js내에서 <b>완벽히 새로운 기능은</b> 아니다. 클래스를 정의한다 해도 결국 클래스는 `function` 즉, 함수다.

```javascript
class Human{
  constructor(name){
    this.name = name;
  }
  run(){
    //run!
  }
}
```
`constructor`에서 함수 본문을 가져오고, 정의한 메서드를 `Human.prototype`에 저장할 뿐이다.

물론 클래스를 단순히 `syntactic sugar` 즉, 기존 문법을 쉽게 읽기 위한 도구로 취급하는 건 좋지 않다. 자세히 설명한 내용은 [링크](https://ko.javascript.info/class)에서 확인 가능하다.

오늘의 주제는 `prototype`인만큼 클래스에 관한 이야기는 아끼겠다.


## What is Prototype?

백문이 불여일견 코드부터 살펴보자.
```javascript
function Person(first, last, age, gender, interests) {

  // property and method definitions
  this.name = {
    'first': first,
    'last' : last
  };
  this.age = age;
  this.gender = gender;
  //...see link in summary above for full definition
}
let person1 = new Person('Bob', 'Smith', 32, 'male', ['music', 'skiing']);
```
클래스 기반 언어의 `instance`는 모두 잘 이해하고 있을 것이다. `new` 연산자로 새로 생성할 경우 만들어지는 객체를 <b>인스턴스</b>라고 칭하겠다.

코드만 보면 `Person`의 인스턴스인 `person1`은 단순히 위에서 정의된 `name`, `age`, `gender`와 같은 프로퍼티만을 가질 것이다. 그렇다면 아래 코드는 동작하지 않는가?

```javascript
person1.valueOf();​
```

직접 실행해보면 알겠지만 아래와 같은 값들을 가지고 있다. 넣지도 않은 녀석이 왜 존재하는거지?
```
age: 32
gender: "male"
name: {first: "Bob", last: "Smith"}
__proto__:
constructor: ƒ Person(first, last, age, gender, interests)
__proto__:
constructor: ƒ Object()
hasOwnProperty: ƒ hasOwnProperty()
isPrototypeOf: ƒ isPrototypeOf()
propertyIsEnumerable: ƒ propertyIsEnumerable()
toLocaleString: ƒ toLocaleString()
toString: ƒ toString()
valueOf: ƒ valueOf()
__defineGetter__: ƒ __defineGetter__()
__defineSetter__: ƒ __defineSetter__()
__lookupGetter__: ƒ __lookupGetter__()
__lookupSetter__: ƒ __lookupSetter__()
get __proto__: ƒ __proto__()
set __proto__: ƒ __proto__()
```

`__proto__`이 바로 우리가 다루어야 할 프로토타입의 실체다. 객체의 사슬 형태로 꼬리를 물고 정의되어있는 형태는 `prototype chain`이라고도 부른다.

![이미지](/assets/images/MDN-Graphics-person-person-object-2.png)

>Note: We want to reiterate that the methods and properties are not copied from one object to another in the prototype chain. They are accessed by walking up the chain as described above.

## instance.__proto__

자바의 구현된 모든 클래스가 오브젝트를 루트로 두는 것처럼 자바스크립트의 모든 함수(객체)는 `Object`를 프로토타입으로 가진다.

우리가 만드는 함수, 배열 등 모두가 결국엔 오브젝트를 상속받아 구현된 것이다. 이는 모든 객체가 가지고 있는 속성이다.

```javascript
let myString = 'This is my string.';
myString.__proto__;
//String {"", constructor: ƒ, anchor: ƒ, big: ƒ, blink: ƒ, …}
//...
```

실제로, `myString`은 `split()` `indexOf()`, `replace()` 등을 사용 가능하다. 이제는 말하지 않아도 감을 잡았을 거라 생각한다.

## Object.create vs new

객체를 생성하는 방법에는 두 가지가 있다.

`Object.create()`, `new` 두 방식의 차이는 간단히 요약하자면 아래와 같다.

>new X()는 Object.create(X.prototype)와 같이 __proto__를 set하며, 생성자 함수를 호출한다.

깊게 파고들 정도의 주제는 아니라 생각해 이정도 설명에서 그치겠다.

## Prototype Chain

제일 중요한 프로토타입 체인에 대해 알아보자.

`__proto__`는 앞에서 언급했듯이 객체라면 누구나 가지고 있는 속성이다.

직접 가지고 있지 않은 속성이라 해도, 만약 그 객체가 상속받은 객체를 `__proto__`를 통해 가지고 있다면, js는 이를 반환한다.

아래 코드를 음미해보자.

```javascript
// Let's create an object o from function f with its own properties a and b:
let f = function () {
   this.a = 1;
   this.b = 2;
}
let o = new f(); // {a: 1, b: 2}

// add properties in f function's prototype
f.prototype.b = 3;
f.prototype.c = 4;

// do not set the prototype f.prototype = {b:3,c:4}; this will break the prototype chain
// o.[[Prototype]] has properties b and c.
// o.[[Prototype]].[[Prototype]] is Object.prototype.
// Finally, o.[[Prototype]].[[Prototype]].[[Prototype]] is null.
// This is the end of the prototype chain, as null,
// by definition, has no [[Prototype]].
// Thus, the full prototype chain looks like:
// {a: 1, b: 2} ---> {b: 3, c: 4} ---> Object.prototype ---> null

console.log(o.a); // 1
// Is there an 'a' own property on o? Yes, and its value is 1.

console.log(o.b); // 2
// Is there a 'b' own property on o? Yes, and its value is 2.
// The prototype also has a 'b' property, but it's not visited.
// This is called Property Shadowing

console.log(o.c); // 4
// Is there a 'c' own property on o? No, check its prototype.
// Is there a 'c' own property on o.[[Prototype]]? Yes, its value is 4.

console.log(o.d); // undefined
// Is there a 'd' own property on o? No, check its prototype.
// Is there a 'd' own property on o.[[Prototype]]? No, check its prototype.
// o.[[Prototype]].[[Prototype]] is Object.prototype and there is no 'd' property by default, check its prototype.
// o.[[Prototype]].[[Prototype]].[[Prototype]] is null, stop searching,
// no property found, return undefined.
```

여기서 `o.[[Prototype]]`은 특정 인스턴스의 프로로토타입이다.

# 마치며,,

아직은 좀 부족한 점이 많은 포스트 같다.

prototype chain에 대해 더 자세히 다룰 날이 온다면, 포스팅을 수정해보도록 하겠다.



><font size="6">Refernce</font>
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
- https://medium.com/@bluesh55/javascript-prototype-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-f8e67c286b67
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Details_of_the_Object_Model#property_inheritance_revisited
- https://ko.javascript.info/class
-



There is one exception that arrow function doesn't have a default prototype property)
