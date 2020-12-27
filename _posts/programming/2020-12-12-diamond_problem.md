---
title: "Diamond Problem"
tags:
  - OOP
  - diamond_problem
categories:
  - programming
last_modified_at: 2020-12-20T13:00:00+18:00
toc: true
---

# Introduction

다이아몬드 문제는 면접 때 들었던 다중상속에 관한 이야기다.

사실 최근에 객체지향언어를 자주 사용한 것도 아니라 답변을 못했다.
<br>배울 게 아직 많다고 느낀다.

긴 인트로는 싫어하니 바로 본론으로 들어가보자.

# Overview

오늘 알아 볼 주제는 `Diamond Problem`이다. `Diamond Problem`은 다중상속 시 일어나는 문제로써 이를 설명하기 위한 다이어그램이 꼭 다이아몬드와 같다해서 생겨난 별칭이다.

![이미지](/assets/images/330px-Diamond_inheritance.svg.png)

다양한 언어에서 이를 방지하기 위한 대책을 마련해두었는데, 이번 포스트에서는 `C++`, `Java`에서 어떻게 이를 해결하는지 이야기해보겠다.

# Multiple Inheritance

우선 다중 상속부터 먼저 설명해야겠다. 다중 상속은 말 그대로 하나 이상의 클래스를 상속받는 것이다. 자바에서는 클래스단위에서 다중 상속을 허용하지 않는데, `C++`은 허용한다.

```cpp
#include<iostream>
using namespace std;

class A
{
public:
  A()  { cout << "A's constructor called" << endl; }
};

class B
{
public:
  B()  { cout << "B's constructor called" << endl; }
};

class C: public B, public A  // Note the order
{
public:
  C()  { cout << "C's constructor called" << endl; }
};

int main()
{
    C c;
    return 0;
}
```

아래를 보지 않고도 출력이 어떻게 될지 머릿속에 그려진다면 어느정도 다중상속에 대한 지식이 있는 것 같아보인다.

참고로 소멸자는 생성자가 호출된 순서와 정반대로 호출된다.

```
B's constructor called
A's constructor called
C's constructor called
```

# Diamond Problem

## in C++

다이아몬드 문제를 C++ 예제로 직접 살펴보자.

```c
#include<iostream>
using namespace std;
class A {
public:
    A() { cout << "A::A() "; }
    A(int x) : m_x(x) { cout << "A::A(" << x << ") "; }
    int getX() const { return m_x; }
private:
    int m_x = 42;
};

class B : public A {
public:
    B(int x) :A(x) { cout << "B::B(" << x << ") "; }
};

class C : public A {
public:
    C(int x) :A(x) { cout << "C::C(" << x << ") "; }
};

class D :  public C,  public B {
public:
    D(int x, int y) : C(x), B(y) {
        cout << "D::D(" << x << ", " << y << ") ";
    }
};

int main() {
    cout << "Create b(2): " << endl;
    B b(2); cout << endl << endl;

    cout << "Create c(3): " << endl;
    C c(3); cout << endl << endl;

    cout << "Create d(2,3): " << endl;
    D d(2, 3); cout << endl << endl;

    // error: request for member 'getX' is ambiguous
    //cout << "d.getX() = " << d.getX() << endl;

    // error: 'A' is an ambiguous base of 'D'
    //cout << "d.A::getX() = " << d.A::getX() << endl;

    cout << "d.B::getX() = " << d.B::getX() << endl;
    cout << "d.C::getX() = " << d.C::getX() << endl;
}
```

뭔가 이상함을 느끼고 있는가? `A` 클래스를 상속받은 `B`와 `C`가 `D`를 상속중이다. 이 경우에 생성자는 어떻게 생성과 소멸을 반복할지 명확하지 않다.

위 코드의 출력은 어떻게 될까?

이러한 경우 상속 관계는 `A` 클래스가 `B`와 `C`를 상속했지만, 실제로 생성되는 인스턴스는 두 개의 `A`를 가지게 된다.

```
A   A  
|   |
B   C  
 \ /  
  D
```

<b> output</b>
```
Create b(2):
A::A(2) B::B(2)

Create c(3):
A::A(3) C::C(3)

Create d(2,3):
A::A(2) C::C(2) A::A(3) B::B(3) D::D(2, 3)

d.B::getX() = 3
d.C::getX() = 2

```

`C++`은 이를 막기위해 `virtual`이라는 키워드를 통해 다이아몬드 문제를 해결했다.

`virtual`에 대한 자세한 설명은 내가 아니더라도 충분히 많은 블로그 및 문서에서 다룰 것이라 생각하기에 관련된 코드만을 올려두겠다.

```c
...
class B : virtual public A {
public:
    B(int x) :A(x) { cout << "B::B(" << x << ") "; }
};

class C : virtual public A {
public:
    C(int x) :A(x) { cout << "C::C(" << x << ") "; }
};
...
```

<b> output</b>
```
Create b(2):
A::A(2) B::B(2)

Create c(3):
A::A(3) C::C(3)

Create d(2,3):
A::A() C::C(2) B::B(3) D::D(2, 3)

d.B::getX() = 42
d.C::getX() = 42
```

결과값을 보고 알 수 있듯이 `virtual`을 사용한다면 하나의 `A`의 (기본생성자)생성자를 호출한다.

## in Java
자바에서는 다이아몬드 문제를 막기위해 `interface`를 두어 그 외에 클래스는 다중상속을 불가능하게 했다.

긴 포스트를 읽느라 수고했다.

![이미지](/assets/images/IMG_0946.gif)

이렇게만 끝나면 재미없으나 고맙게도 다이아몬드 문제를 해결해야할 새로운 기능이 자바에 추가됐다.

### Default Method

인터페이스는 원래 기능에 대한 선언만 가능하고 실제 구현은 포함될 수 없었다.

하지만 자바8부터는 이러한 룰을 깨고 메소드에 키워드 하나만 명시해도 인터페이스 내부에 코드를 작성할 수 있는 방법이 생겼다. 그것이 바로 `default method`이다.

```java
interface MyInterface {
    default void printHello() {
        System.out.println("Hello World");
    }
}
```

#### Reason for adding default and static methods in interfaces

>...(중략) ... 바로 "하위 호환성"때문이다. 예를 들어 설명하자면, 여러분들이 만약 오픈 소스코드를 만들었다고 가정하자. 그 오픈소스가 엄청 유명해져서 전 세계 사람들이 다 사용하고 있는데, 인터페이스에 새로운 메소드를 만들어야 하는 상황이 발생했다. 자칫 잘못하면 내가 만든 오픈소스를 사용한 사람들은 전부 오류가 발생하고 수정을 해야 하는 일이 발생할 수도 있다. 이럴 때 사용하는 것이 바로 default 메소드다. <br><br> (자바의 신 2권)

>The main goal is to allow interface evolution, that is, the addition of new methods. If a new method is added to an interface, existing classes that implement the interface would be missing an implementation, which would be incompatible. To be compatible, an implementation has to come from somewhere, so it is provided by default methods.

더 깊게 더 많이 설명하고 싶지만, 나중 포스팅을 위해 아껴두겠다.

### solution

자바8에서는 이 문제에 대해 3가지 규칙을 따른다.

1. 클래스가 항상 우선순위를 가진다.
  - 클래스나 슈퍼클래스에서 정의한 메서드가 `default method`보다 우선권을 가진다.
2. 1번 규칙 이외의 상황에서는 `sub interface`가 우선권을 가진다.
  - 상속관계를 갖는 인터페이스에서 `B`가 `A`를 상속받았을 경우 `B`가 우선권을 가진다.  
3. 그 외에는 명시한다.
  - 자바8에서는 `parentClassName.super.methodName()`과 같은 형태의 새로운 문법을 제시하였다.

이해를 돕기 위해 몇 가지 예시와 함께 살펴보자.

## 2. sub interface가 우선권을 가진다.

```java
public interface A {
       default void hello() { System.out.println("Hello World from A"); }
   }
   public interface B extends A {
       default void hello() { System.out.println("Hello World from B"); }
   }
   public class C implements B, A {
       public static void main(String... args) {
           new C().hello();//Hello World from B:
       }
   }
```

## 그 외에는 명시한다.

만약 위 예제에서 클래스 B가 A를 상속받지 않았을 경우, 컴파일러는 아래와 같은 메세지를 발생시킨다.

```
class C inherits unrelated defaults for hello() from types A and B
reference to hello is ambiguous, both method hello() in A and method hello() in B match.
```

첫 번째 에러 메세지 상속된 디폴트 메서드가 호출된 상황과 관계없이 출력된다.

자바8에서는 `parentClassName.super.methodName()`과 같은 형태의 새로운 문법을 제시하였다. 이를 사용하자면,

```java
public class C implements B, A {
        public void hello() {
            A.super.hello();//  Hello World from A.
        }
        ...
    }
```

# 마치며,,

이번 포스팅에서는 다이아몬드 문제에 대해 알아보았다. 가장 기본적인 것이고 1학년 때도 이와같은 상황을 배웠었다.

아쉽게도 계속 머리에 담아두진 않았지만, 이번 포스팅을 통해 객체지향을 이해하는데 도움이 되었으면 좋겠다.


><font size="6">Refernce</font>
- https://www.geeksforgeeks.org/multiple-inheritance-in-c/
- https://en.wikipedia.org/wiki/Multiple_inheritance#cite_note-6
- https://goodgid.github.io/Java-8-Default-Method/
- https://stackoverflow.com/questions/29997052/reason-for-adding-default-and-static-methods-in-interfaces
- http://www.lambdafaq.org/what-about-the-diamond-problem/
