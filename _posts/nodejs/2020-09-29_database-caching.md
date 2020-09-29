---
title: "데이터베이스 캐싱"
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

# Redis
레디스는 `In-Memory Data structure Strore`로서 메모리 상에 프로세스로 올라간다.







><font size="6">Refernce</font>
- https://tmdahr1245.tistory.com/120
- https://www.youtube.com/watch?v=mPB2CZiAkKM
