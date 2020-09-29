---
title: "데이터베이스 캐싱(작성 중)"
tags:
  - database
  - cache
  - nodejs
categories:
  - nodejs
last_modified_at: 2020-09-29T13:00:00+18:00
toc: true
---

# 개요

## RDBMS

서버구조서 가장 쉽게 만들 수 있는 방식이 주로 `RDBMS`이다.
용도에 따라 달라지겠지만 규모가 매우큰 포탈에 데이터베이스는 쿼리 진행에도 상당히 많은 시간이 소요될 것이다.
실제로 공공데이터 포탈에서 2000만 Cardinality 규모의 데이터를 받아 샘플 DB를 생성하고 조회해보면 Index를 걸어놓았음에도 불구하고 20초가 넘게 걸린다.

## 해결방법

데이터베이스 튜닝과 효율적인 인덱싱을 통해 해결할 수도 있겠으나 근본적인 문제인 데이터베이스의 쿼리를 줄이는 방법도 있다.

나중에 요청된 결과를 미리 저장해두는 것을 캐시라 한다.
데이터베이스 캐싱 또한 이와 다르지 않은데 물론 내부적으로 데이터베이스에서 제공하는 캐시가 있지만
지속적으로 사용 시 캐시가 덮어씌어지며 새로운 디스크를 읽는 과정에서 성능저하를 야기할 수 있다.

주로 캐싱으로는 `Redis`나 `Memcached`를 사용한다.

![이미지1](/assets/images/memory-hierarchy.png)

## 캐시 구조

1. Look Aside
- 캐시에 없으면 디비로가서 디비에서 읽어온다.
2. Write Back
- 쓰기가 반복적으로 일어나는 작업일 경우 디비에 먼저 저장하는 것이 아니라 캐시에 저장 후 특정 시점마다 디비에다 저장한다.
- 메모리는 휘발성이므로 저장된 값이 사라질 수 있다.
- 극단적으로 매우 큰 쓰기 작업, 로그와 같은 쓰기 작업의 `INSERT`, 재생가능한 데이터 쓰기 등에서 이러한 구조를 사용한다.

# Redis
레디스는 `In-Memory Data structure Strore`로서 메모리 상에 프로세스로 올라간다.

레디스가 `Memcached`와 달리 유용한 점은 우선 `Collection`을 예로 들 수 있다.
직접 구현하는 것과 구현된 것을 사용하는 방식의 차이는 생산성 측면에서 큰 강점이다.

## 개발의 편의성

레디스는 자료구조에서 `Atomic`함을 보장하기 때문에 삽입과정에서 오류를 방지할 수 있다.
기존에 구현된 구조를 사용하는 것은 비지니스 로직에 집중할 수 있도록 도와준다.

### 사용 예시

- 인증 토큰 저장(String 또는 Hash)
- 랭킹 보드로 사용(Sorted Set)
- 유저 API limit

### Collection
- Strings(key, value)
- List(중간 삽입구조에 많은 시간 들어감)
- Set
- Sorted Set
- Hash

## 메모리 관리

레디스는 `In-Memory Data structure Strore`이므로 `Physiacal Memory`이상을 사용하면 문제가 발생.
디스크를 쓰게 되는 순간 즉, Swap이 일어난다면 해당 메모리 Page 접근 시마다 디스크를 쓰게되고 성능이 저하된다.

`maxmemory`값을 설정하게 되더라도 메모리 단편화가 생길 수 있다. OS 메모리 할당 자체가 페이지 단위로 일어나기 때문에 최대값을 설정한다고 해서
메모리 관리를 하지 않아도 된다는 말이 아니다.


## 간단 구현 예제

```javascript
...
const redisClient = redis.createClient({
  no_ready_check: true,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  pass: process.env.REDIS_PASSWORD,
  logErrors: true,
});
...
router.post('/account/auth', async (req, res) => {
    const { user_email, user_pw } = req.body;

    //Try fetching the result from Redis first in case we have it cached
    return redisClient.get(user_email, (error, result) => {
      if(error) {
        throw error;
      }
       // If that key exist in Redis store
      if(result != null){
        const token = jwt.sign({
          id: result.id,
          name: result.name,
        }, process.env.JWT_SECRET, {
          expiresIn: '30m', // 30분
          issuer: 'bookmark-api',
        });

        return res.json({
          code: 200,
          payload: JSON.stringify(result),
          message: '토큰이 발급되었습니다',
          token,
        });
      } else {
...
```

><font size="6">Refernce</font>
- https://tmdahr1245.tistory.com/120
- https://www.youtube.com/watch?v=mPB2CZiAkKM
- https://dzone.com/articles/a-brief-introduction-to-caching-with-nodejs-and-re
