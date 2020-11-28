---
title: "MVCC"
tags:
  - database
  - MVVC
categories:
  - database
last_modified_at: 2020-11-12T13:00:00+18:00
toc: true
---
<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>

# MVCC
`MVCC(Multi Version Concurrency Control)`의 약자이다.

`Multi Version`는 하나의 레코드에 대해 여러 버전이 관리된다는 의미이다. 일반적으로 레코드 레벨의 트랜잭션을 지원하는 `DBMS`가 제공하는 기능이며, 가장 큰 목적은 잠금을 사용하지 않는 일관된 읽기를 제공하는데 있다.

## Concurrency Control
`Concurrency Control` 즉, 동시성 제어란 `DBMS`가 다수의 사용자 사이에서 동시에 작용하는 트랜잭션의 상호간섭 작용에서 데이터베이스를 보호하는 것을 의미한다. 일반적으로 동시성을 허용하면 일관성이 반비례 관계를 갖고 있다.
![이미지](/assets/images/consistency-concurrency.png)

다수 사용자의 동시 접속을 위해 `DBMS`는 동시성 제어를 위해 `Lock`기능과 `SET TRANSACTION` 명령어를 통해 격리성 수즌을 조정할 수 있도록 한다.

### Pessimistic Concurrency Control

- 사용자다들이 같은 데이터를 동시에 수정할 것이라고 가정
- 데이터를 읽는 시점에 `Lock`을 걸고 트랜잭션이 완료될 때까지 이를 유지
- SELECT 시점에 Lock을 거는 비관적 동시성 제어는 시스템의 동시성을 심각하게 떨어뜨릴 수 있어서 wait 또는 nowait 옵션과 함께 사용해야 함

### Optimistic Concurrency Control

- 사용자들이 같은 데이터를 동시에 수정하지 않을 것이라고 가정
- 데이터를 읽는 시점에 `Lock`을 걸지 않는 대신 수정 싲머에 값이 변경됐는지를 반드시 검사

### 잠금 구조의 문제점.

- 읽기 작업과 쓰기 작업이 서로 방해를 일으키기 때문에 동시성 문제가 발생
- 데이터 일관성에 문제가 생기는 경우도 있어서 `Lock`을 더 오래 유지하거나 테이블 레벨의 `Lock`을 사용해야하고 동시성 저하 발생.

## MVVC란

`MVCC`는 동시 접근을 허용하는 데이터베이스에서 동시성을 제어하기 위해 사용하는 방법 중 하나이다.

`MVCC` 모델에서 데이터에 접근하는 사용자는 접근한 시점에서 데이터베이스의 `Snapshot`을 읽는다. 이 스냅샷 데이터에 대한 변경이 완료될 때 즉, 트랜잭션이 커밋될 때까지 만들어진 변경사항은 다른 데이터베이스 사용자가 볼 수 없다. 이제 사용자가 데이터를 업데이트하면 이전의 데이터를 덮어 씌우는 게 아니라 새로운 버전의 데이터를 `UNDO` 영역에 생성한다. 대신 이전 버전의 데이터와 비교해서 변경된 내용을 기록한다. 이렇게 해서 하나의 데이터에 대해 여러 버전의 데이터가 존재하게 되고, 사용자는 마지막 버전의 데이터를 읽게된다. 특징은 아래와 같다.

- 일반적인 `RDBMS`보다 빠르게 작동
- 사용하지 않는 데아터가 계속 쌓이게 되므로 데이터를 정리하는 시스템이 필요
- 데이터 버전이 충돌하면 어플리케이션 영역에서 수정해야 한다.

접근 방식이 잠금 구조를 사용하지 않기 때문에 일반적인 `RDBMS` 보다 빠르게 작동한다. 또한, 데이터를 읽기 시작할 때, 다른 사람이 그 데이터를 삭제하거나 수정하더라도 영향을 받지 않고 계속 사용할 수 있다. 대신 사용하지 않는 데이터가 계속 쌓이게 되므로 데이터를 정리하는 시스템이 필요할 것이다. 오라클은 `UNDO Segment`를 이용한다.

또한, `UNDO Block I/O`, `CR Copy 생성` `CR 블록 캐싱` 같은 부가적인 작업의 오버헤드가 발생한다. 이러한 구조의 `MVCC`는 문장 수준과 트랜잭션 수준의 읽기 일관성이 존재한다.

MVCC는 포인트-인-타임 일관성(point-in-time consistent) 뷰를 제공한다. MVCC 상태에서 읽기 트랜잭션은 일반적으로 타임스탬프나 트랜잭션 ID를 사용하여 읽을 DB의 상태를 결정하고 데이터의 버전들을 읽는다. 그러므로 읽기, 쓰기 트랜잭션은 락(lock)의 필요 없이 다른 트랜잭션과 격리된다. 그러나 락이 불필요함에도 불구하고 오라클 등 일부 MVCC 데이터베이스에서는 락이 사용된다. 쓰기는 더 새로운 버전을 만드는 반면, 동시성 읽기는 더 오래된 버전에 접근한다.

### 문장 수준의 읽기 일관성

문장수준 읽기 일관성은 다른 트랜잭션에 의해 데이터의 `CRUD`가 발생하더라도 단일 `SQL`문 내에서 일관성 있게 값을 읽는 것을 말한다.

- 일관성 기준 시점은 쿼리 시작점이 된다.

### 트랜잭션 수준의 일관성

트랜잭션 수준 읽기 일관성은 다른 트랜잭션에 의해 데이터의 `CRUD`가 발생하더라도 트랜잭션 내에서 일관성 있게 값을 읽는 것을 말한다.
`MVVC` 구조 또한 트랜잭션 수준 읽기 일관성을 보장하지 못한다. 따라서, 트랜잭션 수준으로 완벽한 읽기 일관성을 보장하려면 격리성 수준을 `Serializable Read`로 올려주어야 한다.
Isolation Level을 Serializable Read로 상향 조정하면, 일관성 기준 시점은 트랜잭션 시작 시점이 된다. 물론 트랜잭션이 진행되는 동한 발생한 변동사항은 변동사항 그대로 읽는다.

```sql
alter database <데이터베이스 이름> set allow_snapshot_isolation on;

-- 트랜잭션 시작하기 전 'snapshot'으로 변경

set tranaction isolation level snapshot

begin tran

    select ...;
    update ...;
commit;
```

><font size="6">Refernce</font>
- https://mangkyu.tistory.com/53
- https://kslee7746.tistory.com/entry/SQLP-%EB%8F%99%EC%8B%9C%EC%84%B1-%EC%A0%9C%EC%96%B4
- https://ko.wikipedia.org/wiki/다중_버전_동시성_제어
