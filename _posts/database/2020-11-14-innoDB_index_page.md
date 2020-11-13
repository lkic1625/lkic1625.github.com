---
title: "InnoDB 인덱스 페이지 구조"
tags:
  - b+_tree
  - database
  - datastructure
categories:
  - database
last_modified_at: 2020-11-12T13:00:00+18:00
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

## InnoDB는 모든 것이 인덱스로 이루어져있다.

무슨 뜻인지 알아보자.

1. 모든 테이블인 `primary key`를 가지고 있다. 만약 테이블이 생성된다면 자동으로 첫번째 필드값을 `NOT NULL`인 `unique key`로 지정하며 지정에 실패했을 경우에는 숨겨진 필드를 추가하여 프라이머리 키로 사용한다. 이는 사용자 입장에서 필요없지만, 행마다 6바이트를 추가로 할당하게 된다.
2. 행 데이터(프라이머리키를 가지지 않는 필드)가 프라이머리 키 인덱스 구조에 저장될 경우 `clusterd key`라고 부른다. 이 인덱스 구조에서 프라이머리 키를 키로, 행 데이터를 키에 첨부되는 값이다. (물론 [`MVCC`](/database/database_MVCC)를 위한 필드도)
3. `Secondary key`는 `identical`한 인덱스 구조에 저장되지만, `KEY` 밸류에 키값이며 프라이머리 키 값은 그 키에 첨부된다.

><font size="6">Refernce</font>
- https://blog.jcole.us/2013/01/07/the-physical-structure-of-innodb-index-pages/
- https://blog.jcole.us/2013/01/10/btree-index-structures-in-innodb/#:~:text=InnoDB%20uses%20a%20B%2BTree,the%20tree%2C%20which%20scales%20nicely.
