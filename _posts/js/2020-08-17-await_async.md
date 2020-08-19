---
title: "async/await"
tags:
  - js
  - asynchronous
categories:
  - js
last_modified_at: 2020-08-17T13:00:00+18:00
toc: true
---
<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>

# 비동기 프로그래밍

## 비동기 처리란?
일반적으로 코드는 순차적으로 진행된다. 이를 `synchronous`이라하며, 순차적 진행으로 코드가 요청한 결과가 반드시 선언한 자리에서 일어나야 한다.
하지만 요즘과 같이 멀티 코어로 컴퓨터의 성능이 올라간 결과 효율적으로 쓰기 위해서는 이런 순차적 진행은 어울리지 않을 것이다.

그렇게 해서 나온 것이 `asynchronous`이다.

>당신이 다른 코어 프로세서에 다른 작업들을 움직이게 하고 작업이 완료되면 알려줄 수 있을 때, 무언가를 기다리는 것은 의미가 없습니다 .그 동안 다른 작업을 수행할 수 있고, 이것이 비동기 프로그래밍의 기본입니다. <br><br>이러한 작업을 비동기적으로 실행할 수 있는 API를 제공하는 것은 당신이 사용하고 있는 프로그래밍 환경(웹 개발의 경우 웹브라우저) 에 달려 있습니다.

비동기는 컴퓨터 프로그래밍에서 메인 프로그램의 흐름과 독립된 이벤트의 발생과 그러한 이벤트 처리 방법을 가리킨다.
이는 signal을 전달 받는 외부 이벤트 혹은 동시 실행과 관련된 작업일 수 있으며, 비동기에서는 프로그램의 결과를 기다리기 위한 `blocking`이 일어나지 않는다. 따라서, 병렬적인 작업 처리가 가능하다.

## 콜백 지옥
비동기 콜백 함수에서도 task들이 순차적으로 진행되어야 하는 상황이 있을 수 있다.
이럴 경우 프로그래머는 난해한 코드 상황에 맞닥뜨릴 것이다.

![이미지1](/assets/images/callback-hell.png)
출처: https://adrianalonso.es/desarrollo-web/apis/trabajando-con-promises-pagination-promise-chain/

`js`에서는 이렇게 난잡한 코드를 조금이나마 해소하기 위해 `promise`나 `ES2017`의 `aysnc/await`이 대표적인 예이다.
`promise`는 간단하게 설명해서 비동기를 강제하는 특별한 오브젝트 형태다.

더욱 자세한 설명은 [promise 포스팅을](../promise) 통해 알아보도록 하고 포스팅의 본주제로 넘어가보자.

## async/await

콜백 지옥에서 벗어나기 위해 프로미스를 사용한 것처럼 프로미스 패턴 극복을 위해 다시 나온 것이 async/await이다.

기본적으로 알아야 할 사실은  async/await의 기반이 promise라는 것이다.
`async`는 프로미스를 리턴하고 모든 `await` 함수는 일반적으로 프로미스가 된다.

### promise와 비교

promise 코드
```javascript
function findAndSaveUser(Users) {
  Users.findOne({})
    .then((user) => {
      user.name = 'zero';
      return user.save();
    })
    .then((user) => {
      return Users.findOne({ gender: 'm' });
    })
    .then((user) => {
      // 생략
    })
    .catch(err => {
      console.error(err);
    });
}
```

async/await 코드
```javascript
async function findUser() {
  try {
    let user = await Users.findOne({}).exec();
    user.name = 'zero';
    user = await user.save();
    user = await Users.findOne({ gender: 'm' }).exec();
    ...
  } catch (err) {
    console.error(err);
  }
}
```

### 사용법
`promise`보다 비교적 사용법이 쉽다. `function` 키워드 앞에 `async`만 붙여주면 되고 비동기로 처리되는 부분 앞에 `await`만 붙여주면 사용할 수 있다.

다만, 몇 가지 주의할 점이 있다면 `await` 뒷부분이 반드시 `promise` 를 반환해야 한다는 것과 `async function` 자체도 `promise` 를 반환한다는 것이다.
또한, `await`은 반드시 `async` 함수 바로 안에서만 쓰여야한다. `async` 함수 안에 또 다른 일반 함수가 있고, 그 안에 `await`이 있다면 안 된다.

아래 코드는 일반 함수가 포함될 경우와 정상 작동하는 경우이다.
```javascript
async function a() {
  (function b() {
    await Promise.resolve(true); // async 함수 바로 안이 아니라서 에러. 아래와 같이 수정
  })();
}
```
```javascript
function a() {
  (async function b() {
    await Promise.resolve(true); // 이제 정상 작동. 차이점이 보이시죠?
  })();
}
```
> 프로미스가 도입되었음에도 여전히 콜백을 사용하는 것처럼, async/await이 도입되었다고 해서 프로미스나 콜백을 사용하지 않아야 하는 것은 아닙니다.

콜백은 문법이 간단하기 때문에 콜백 지옥으로 여겨지지 않는 한 여전히 유용합니다. 보통 코드가 적은 게 좋죠? 프로미스와 async/await이 나왔음에도 콜백이 계속 쓰이는 것은 간단함에 있습니다. 콜백을 async 함수로 전환하려면 Promise를 거쳐야 합니다. 두 단계를 거쳐 async/await을 사용하느니 그냥 콜백을 사용하는 게 나은 경우가 많습니다.

async/await이 나왔음에도 불구하고 콜백이 계속 사용되는 이유는 간단함에 있다. 즉, 콜백지옥이 아니라면 계속해서 사용하는 것이 나은 경우가 많다.

### 참고 Promise.all
`ES2018`부터 추가된 기능이지만, `Promise.all`을 대체하는 방법도 있다.
```javascript
const promise1 = Promise.resolve('성공1');
const promise2 = Promise.resolve('성공2');
(async () => {
  for await (promise of [promise1, promise2]) {
    console.log(promise);
  }
})();
```


><font size="6">Refernce</font>
- https://developer.mozilla.org/ko/docs/Learn/JavaScript/Asynchronous/Concepts<br>
- https://en.wikipedia.org/wiki/Asynchrony_(computer_programming)<br>
- https://www.zerocho.com/category/ECMAScript/post/58d142d8e6cda10018195f5a<br>
- https://medium.com/@kiwanjung/%EB%B2%88%EC%97%AD-async-await-%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-%EC%A0%84%EC%97%90-promise%EB%A5%BC-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-955dbac2c4a4<br>
