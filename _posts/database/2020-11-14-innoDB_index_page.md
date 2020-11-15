---
title: "InnoDB 인덱스 페이지 구조"
tags:
  - b+_tree
  - database
  - datastructure
categories:
  - database
last_modified_at: 2020-11-16T13:00:00+18:00
toc: true
---
<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>

이 포스트는 [B+ Tree 포스트](/database/b+_tree)와 이어집니다.

# 인덱스란?

인덱스란 단순히 생각하면 사전 순 정렬이다. 사전 같은 경우 미리 순서대로 정렬되어 있어 쉽게 찾을 수 있도록(데이터를 읽을 수 있도록) 도와준다. 마찬가지로 `DBMS`의 인덱스도 컬럼의 값을 주어진 순서로 미리 정렬해 보관한다.

자료구조를 어느정도 이해하고 있다면, 알 수 있듯이 위와 같이 미리 정렬된 저장구조는 읽기 성능을 끌어올리는 방법으로써 수정, 삭제, 삽입의 시간이 매우 크게 희생될 수 있다.

>여기서도 알 수 있듯이 테이블의 인덱스를 하나 더 추가할지 말지는 데이터의 저장 속도를 어디까지 희생할 수 있는지, 읽기 속도를 얼마나 더 빠르게 만들어야 하는지의 여부에 따라 결정돼야 합니다. SELECT 쿼리 문장의 WHERE 조건절에 사용되는 컬럼이라고 전부 인덱스로 생성하면 데이터 저장 성능이 떨어지고 인덱스의 크기가 비대해져서 오히려 역효과만 불러올 수 있습니다.

# InnoDB 인덱스 페이지 구조

`InnoDB`는 디스크에 데이터를 저장하는 가장 기본 단위를 페이지라고 하며, 인덱스 역시 페이지 단위로 관리된다.

## InnoDB는 모든 것이 인덱스로 이루어져있다.

무슨 뜻인지 알아보자.

1. 모든 테이블인 `primary key`를 가지고 있다. 만약 테이블이 생성된다면 자동으로 첫번째 필드값을 `NOT NULL`인 `unique key`로 지정하며 지정에 실패했을 경우에는 숨겨진 필드를 추가하여 프라이머리 키로 사용한다. 이는 사용자 입장에서 필요없지만, 행마다 6바이트를 추가로 할당하게 된다.
2. 행 데이터(프라이머리키를 가지지 않는 필드)가 프라이머리 키 인덱스 구조에 저장될 경우 `clusterd key`라고 부른다. 이 인덱스 구조에서 프라이머리 키를 키로, 행 데이터를 키에 첨부되는 값이다. (물론 [`MVCC`](/database/database_MVCC)를 위한 필드도)
3. `Secondary key`는 `identical`한 인덱스 구조에 저장되지만, `KEY` 밸류에 키값이며 프라이머리 키 값은 그 키에 첨부된다.

## Overview

![페이지 오버뷰](/assets/images/INDEX_Page_Overview.png)

위는 페이지 구조에 대한 오버뷰이며 그에 대한 설명은 아래와 같다.

- `FIL` 헤더와 트레일러는 페이지의 공통적으로 있는 속성이다. 직접적인 예시로는 `INDEX` 페이지에 같은 `level`에 존재하는 이전 페이지와 다음 페이지를 포인터를 가지고 있는 경우와 인덱스의 키값을 오름차순으로 가지고 있는 경우이다.
- `FSEG` 헤더는 파일 관리에 사용되는 헤더이며 루트 페이지의 `FSEG`는 인덱스를 사용하는 파일 세그먼트에 대한 포인터를 가지고 있다. 그외에 페이지에서는 사용하지 않는다.
- `INDEX` 헤더는 인덱스 페이지와 레코드 관리를 위한 필드를 포함한다.
- `System records`는 모든 페이지가 가지고 있는 시스템 레코드로써 `infimum`과 `supremum`을 가지고 있다 이는 페이지에 대한 오프셋이다.
- `User records`는 실제 제이터이다. 모든 레코드는 변수는 `variable-width(가변 폭) header`와 실제 콜럼 데이터를 가지고 있다. 헤더에는 다음 레코드에 대한 포인터를 포함하며, 이는 오름차순으로 정렬되어 있다.
- `The page directory`는 `FIL` 트레일러에서 시작하는 페이지의 top에서부터 아래로 확장되며, 페이지의 일부 레코드에(매 4~8번째 레코드) 대한 포인터를 포함한다. 아래에서 자세히 설명하겠다.

## INDEX header

![페이지 인덱스 헤더](/assets/images/INDEX_Header.png)


위는 인덱스 헤더 대한 개요이며, 고정 크기를 가진 구조이다.

- `Index ID`: 인덱스 페이지가 속한 아이디이다.
- `Format Flag`: 현재 페이지가 저장한 레코드의 포맷이다. `Number of Heap Records` 필드보다 높은 비트에서 저장되며, 가능한 값으로는 `COMPACT`, `REDUNDANT`가 있다.
- `Maximum Transaction ID`: 현재 페이지에서 레코드에 대한 수정의 `maximum transaction ID`이다.
- `Number of Heap Records`: 현재 페이지에 레코드 총 개수이며 `infimum`과 `supremum`, 삭제된 레코드를 포함한다.
- `Number of Records`: 삭제되지 않은 페이지 레코드이다.
- `Heap Top Position`: 현재 사용된 공간의 `end` 바이트 오프셋이다. 모든 저장공간은 힙의 탑과 페이지 디렉토리의 끝을 비워둔다.
- `First Garbage Record Offset`: 삭제된 레코드 리스트의 첫 원소를 가리키는 포인터다.
- `Garbage Space`: 가비지 레코드 리스트에서 관리하는 레코드의 총 바이트 수이다.
- `Last Insert Position`: 마지막으로 페이지에 추가된 레코드의 바이트 오프셋이다.
- `Page Direction`: 페이지 디렉션을 위해 `LEFT`, `RIGHT`, `NO_DIRECTION`이 사용된다. 이 페이지에 순차적인 삽입 혹은 임의적인 삽입이 일어나는지에 대한 표시자이다. 각 삽입에서 마지막 삽입 위치를 읽고 삽입 방향을 결정하기 위해 현재 삽입된 레코드 키와 비교한다.
- `Number of Inserts in Page Direction`: 한번 페이지 디렉션이 설정되면 그 이후 삽입에서 방향을 바꾸지 않고 이 값을 증가시킨다.
- `Number of Directory Slots`: `slots`에 각 값이 16-bit 바이트 오프셋인 페이지 디렉토리 사이즈이다.
- `Page Level`: 현재 인덱스 페이지의 레벨이다.

### Record format: redundant VS compact

`COMPACT` 레코드 포멧은 새로운 형식의 `Barracuda table format`이며, `REDUNDANT`는 기존의 형식의 `Antelope table format`이다. `COMPACT` 형식은 각 레코드에 중복 저장되어 정보들을 삭제하였다. 예를들어 데이터 딕셔너리에서 얻을 수 있는 필드 수, nullable 필드, 필드의 동적 길이 등이 있다.

## the page directory

![페이지 인덱스 디렉토리](/assets/images/INDEX_Page_Directory.png)

페이지 디렉토리는 `FIL` 트레일러에서 시작하며 유저 레코드 위에 있으며, 아래 방향으로 크기가 커진다. 페이지 디렉토리 매 4-8 레코드의 포인터를 포함하며, 항상 `infimum`과 `supremum`를 포함한다.

페이지 디렉토리는 동적 크기 배열이며, 16비트 오프셋 포인터를 가진다.

><font size="6">Refernce</font>
- https://blog.jcole.us/2013/01/07/the-physical-structure-of-innodb-index-pages/
- https://blog.jcole.us/2013/01/10/btree-index-structures-in-innodb/#:~:text=InnoDB%20uses%20a%20B%2BTree,the%20tree%2C%20which%20scales%20nicely.
