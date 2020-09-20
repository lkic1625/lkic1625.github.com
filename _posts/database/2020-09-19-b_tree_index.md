---
title: "B-tree, index(작성중)"
tags:
  - b_tree
  - database
  - datastructure
categories:
  - database
last_modified_at: 2020-09-20T13:00:00+18:00
toc: true
---
<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>

# 인덱스란?

인덱스란 단순히 생각하면 사전 순 정렬이다. 사전 같은 경우 미리 순서대로 정렬되어 있어 쉽게 찾을 수 있도록(데이터를 읽을 수 있도록) 도와준다. 마찬가지로 `DBMS`의 인덱스도 컬럼의 값을 주어진 순서로 미리 정렬해 보관한다.

자료구조를 어느정도 이해하고 있다면, 알 수 있듯이 위와 같이 미리 정렬된 저장구조는 읽기 성능을 끌어올리는 방법으로써 수정, 삭제, 삽입의 시간이 매우 크게 희생될 수 있다.

>여기서도 알 수 있듯이 테이블의 인덱스를 하나 더 추가할지 말지는 데이터의 저장 속도를 어디까지 희생할 수 있는지, 읽기 속도를 얼마나 더 빠르게 만들어야 하는지의 여부에 따라 결정돼야 합니다. SELECT 쿼리 문장의 WHERE 조건절에 사용되는 컬럼이라고 전부 인덱스로 생성하면 데이터 저장 성능이 떨어지고 인덱스의 크기가 비대해져서 오히려 역효과만 불러올 수 있습니다.

# B-tree
가장 일반적으로, 가장 먼저 사용된 인덱스 알고리즘으로써, 칼럼의 값을 변형하지 않고 원래의 값을 이용해 인덱싱하는 알고리즘이다.
`B+-Tree` 혹은 `B*-Tree`가 자주 사용되며, 약자 B는 balanced를 의미한다.

## 구조 및 특성
`B-Tree`는 컬럼의 값을 변형시키지 않고 인덱스 구조체 내에서 항상 정렬된 상태로 유지하고 있다.

기본적으로 루트노드, 브랜치노드, 리프노드로 형성된 계층구조로 나뉘어져 있다.
데이터베이스 내에서는 인덱스와 실제 데이터가 저장된 데이터는 따로 관리하는데, 인덱스의 리프 노드는 실제 데이터 레코드를 찾아가기 위한 주소 값을 가지고 있다.

대부분 `RDBMS`의 데이터 파일에서 레코드는 특정 기준으로 정렬되지 않고 임의의 순서대로 저장된다. 하지만 `InnoDB`에서는 클러스터링돼 디스크에 저장하는 것을 기본으로 하기에 프라이머리 키 순서대로 정렬한 후 저장된다.
다른 `DBMS`에서는 선택 사항이지만 별도의 옵션이 없다면 기본적으로 클러스터링 테이블이 생성된다.

`InnoDB` 테이블에서는 프라이머리 키에 의해 클러스터링되기 때문에 프라이머리 키값 자체가 주소 역할을 한다. 실제 `MySQL` 테이블의 인덱스는 항상 인덱스 컬럼 값과 주소 값(`MyISAM`의 레코드 아이디 값 또는 `InnoDB`의 프라이머리 키값)의 조합이 인덱스 레코드로 구성됩니다.

![이미지](/assets/images/B_Tree_Structure.png)

## B-tree Properties

1. 모든 리프 노드들은 같은 높이에 있다.
2. order가 m인 경우 m-1개의 키와 m개의 자식 노드를 가질 수 있다.
3. 모든 노드는 최대 m개의 노드를 자식으로 가질 수 있다.
4. 루트 노드는 반드시 두 개 이상의 노드를 가지고 있어야 한다.
5. 루트 노드와 리프 노드를 제외한 노드는 최소 두 개의(m/2) 자식 노드를 가진다.
6. ROOT 노드를 제외한 모든 노드는 적어도 ⌊ M/2 ⌋ 개의 키를 가지고 있어야 한다.

## 탐색

![이미지2](/assets/images/B-tree-1.png)

탐색과정은 이진 탐색 트리와 매우 흡사하다. 위 트리를 예시로 들어 $$3$$을 찾는다고 하자.

1. $$3<$$, $$3<15$$ 이므로 왼쪽 서브 트리를 탐색한다.
2. $$3<4$$ 이므로 다시 왼쪽 서브 트리를 탐색한다.
3. $$3>2$$, $$3=3$$이므로 탐색을 종료한다.

위 탐색과정에서 알 수 있듯이 탐색은 트리의 높이에 의존한다. 보통 탐색 시간은 $$O(log N)$$ 정도.

## 삽입

1. 삽입할 위치를 탐색한다.
2. 리프 노드가 $$m-1$$개 이하의 키를 가지고 있다면 오름차순으로 값을 삽입한다.
3. 키가 $$m-1$$일 경우
  - 새로운 값을 오름차순으로 삽입한다.
  - 중간 값을 기준으로 두개의 노드로 나눈다.
  - 중간 값을 부모 노드로 보낸다.
  - 부모 노드의 키가 $$m-1$$개라면 적절한 리프 노드를 찾을 때까지 위 과정을 반복한다.
4. 삽입이 완료된다.

1 -> 10 -> 5 -> 14 -> 123 -> 7 -> 8
아래 이미지는 위 순서대로 삽입할 경우 생성되는 트리 구조이다.

![이미지3](/assets/images/b-tree-2.png)

## 삭제

삭제 방식에는 두 가지가 존재.

1. 삭제 후 invariants를 유지하도록 트리를 재구성
2. Do a single pass down the tree, but before entering (visiting) a node, restructure the tree so that once the key to be deleted is encountered, it can be deleted without triggering the need for any further restructuring.

삭제할 경우 특이케이스는 아래와 같다.
1. 브랜치 노드의 삭제할 원소가 자식 노드들의 구분자일 경우
2. 원소를 삭제할 경우 해당 노드가 원소 최소개수와 자식 수를 만족하지 못할 경우

### 리프 노드 삭제

1. 삭제할 값을 찾는다.
2. 만약 값이 리프 노드에 있다면 그 노드를 삭제한다.
3. b-tree 구조를 만족시키지 못할 경우 `Rebalancing after deletion` 항목에 따라 재구성한다.

### 브랜치 노드 삭제

브랜치 노드의 값은 항상 서브트리의 구분자로서 역할을 하기 때문에, 구분자의 역할을 대체할 필요가 있다. 여기서 알아야 할 점은 왼쪽 서브트리의 가장 큰 값은 항상 구분자보다 작고 오른쪽 서브트리의 가장 작은 값은 항상 구분자보다 크다는 점이다.

1. 새로운 구분자를 찾는다. (왼쪽 서브트리 최대값 혹은 오른쪽 서브트리 최소값) 리프 노드에서 값을 제거 후 새로운 구분자를 추가한다.
2. 리프 노드에서 삭제된 경우로 인해 트리의 균형이 깨졌다면 그 리프 노드부터 `Rebalancing after deletion`에 따라 재구성한다.

### Rebalancing after deletion

Rebalancing starts from a leaf and proceeds toward the root until the tree is balanced. If deleting an element from a node has brought it under the minimum size, then some elements must be redistributed to bring all nodes up to the minimum. Usually, the redistribution involves moving an element from a sibling node that has more than the minimum number of nodes. That redistribution operation is called a rotation. If no sibling can spare an element, then the deficient node must be merged with a sibling. The merge causes the parent to lose a separator element, so the parent may become deficient and need rebalancing. The merging and rebalancing may continue all the way to the root. Since the minimum element count doesn't apply to the root, making the root be the only deficient node is not a problem. The algorithm to rebalance the tree is as follows:[citation needed]

If the deficient node's right sibling exists and has more than the minimum number of elements, then rotate left
Copy the separator from the parent to the end of the deficient node (the separator moves down; the deficient node now has the minimum number of elements)
Replace the separator in the parent with the first element of the right sibling (right sibling loses one node but still has at least the minimum number of elements)
The tree is now balanced
Otherwise, if the deficient node's left sibling exists and has more than the minimum number of elements, then rotate right
Copy the separator from the parent to the start of the deficient node (the separator moves down; deficient node now has the minimum number of elements)
Replace the separator in the parent with the last element of the left sibling (left sibling loses one node but still has at least the minimum number of elements)
The tree is now balanced
Otherwise, if both immediate siblings have only the minimum number of elements, then merge with a sibling sandwiching their separator taken off from their parent
Copy the separator to the end of the left node (the left node may be the deficient node or it may be the sibling with the minimum number of elements)
Move all elements from the right node to the left node (the left node now has the maximum number of elements, and the right node – empty)
Remove the separator from the parent along with its empty right child (the parent loses an element)
If the parent is the root and now has no elements, then free it and make the merged node the new root (tree becomes shallower)
Otherwise, if the parent has fewer than the required number of elements, then rebalance the parent
Note: The rebalancing operations are different for B+ trees (e.g., rotation is different because parent has copy of the key) and B*-tree (e.g., three siblings are merged into two siblings).


><font size="6">Refernce</font>
- https://12bme.tistory.com/138
- SQLD 개발자 가이드, http://www.dbguide.net/index.db
- https://www.softwaretestinghelp.com/b-tree-data-structure-cpp/
- https://www.cs.usfca.edu/~galles/visualization/BTree.html
- https://matice.tistory.com/8
- https://en.wikipedia.org/wiki/B-tree
