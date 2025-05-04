+++
title = "Database Internals"
date = "2025-05-05T00:23:48+09:00"

#
# description is optional
#
# description = "An optional description for SEO. If not provided, an automatically created summary will be used."

tags = []
+++

This is a page about »Database Internals«.

# 개요
해당 개시글은 데이터베이스 인터널스를 읽고 정리한 아티클입니다. 

# 2장 B-트리 개요
## 디스크 기반 스토리지용 트리
이진 트리의 경우 트리의 fanout(한 노드가 가질 수 있는 최대 자식 노드의 개수)가 매우 낮기에 트리의 리밸런싱, 노드 재배치, 포인터 갱신이 자주 발생함.  잦은 포인터 갱신은 높은 유지 비용을 유발하고 디스크 기반 자료 구조로 부적합하다.

또한, 노드는 지역성 측면에서 새 노드는 부모 노드와 가까운 위치에 저장되지 않을 수 있음. (이를 paged binary tree 가 일부 해결해줄 수는 있음)

이진 트리는 fanout 이 상대적으로 낮기에 $O(logN)$ 번의 탐색과 디스크 전송이 필요, 

## 디스크 기반 자료 구조
결국 HDD, SSD 두 저장매체 모두 읽기를 개별 바이트 단위가 아니라, 메모리 청크 단위로 참조하기에 이는 디스크 기반 자료구조에서 염두해야할 가장 큰 제약사항임. B-tree 를 사용하는 이유 역시 고정 크기의 페이지를 단위로 구성하기 때문이다.

## HDD
디스크에서는 탐색 작업이 대부분의 읽기 비용의 전부이다. 헤드를 원하는 물리적 위치까지 옮기는 가장 큰 비율을 차지하지만, 이후 연속적인 읽기/쓰기는 비교적 저렴함.
즉, 연속된 데이터에 대한 I/O 가 권장되야 함.

## SSD (스킵)

# 3장 파일 포맷
디스크 기반 자료 구조와 인메모리 자료 구조의 포인터 관리는 같지않음. 페이지 단위로 구성되는 B-트리 자료구조이기에 
디스크에 저장된 데이터는 read/write 로만 접근할 수있기에 이에 맞는 형식으로 데이터를 저장해야함.

가변길이의 포맷인 경우 보통 해당하는 사이즈와 실제 값을 같이 저장함
```c String{
	size uint_16
	data byte[size]
}
```

데이터베이스 파일은 일반적으로 탐색에 유용한 Lookup 테이블, 오프셋과 시작점을 가리키는 헤더(or 트레일러)가 존재.
![이미지](/assets/images/Pasted%20image%2020221010211308.png)

## 페이지 구조
### 고정 길이 레코드의 페이지 구조

처음 발표된 B-tree 논문에서는 고정 길이 데티어의 페이지 구조를 설명한다. 키, 포인터, 값들의 나열이다. 아래와 같은 구조는 단순하지만 단점이 존재함.

- 빈 공간이 아닌 곳에 추가 시 여러 원소를 재배치해야하고, 가변길이 레코드를 효율적으로 관리 저장이 불가능하다.

![이미지](/assets/images/Pasted%20image%2020221010211320.png)

### Slotted Page

페이지 포맷은 아래와 같은 조건을 충족해야한다.
- 최소한의 오버헤드로 가변길이 레코드(variable-size records)를 저장해야함
	- 페이지를 여러 개의 고정 길이 세그먼트로 분할하면 가변 길이 레코드를 저장할 수 있지만, 레코드 사이즈는 제 각기이기에 세그먼트 크기와 맞지 않는 레코드는 세그먼트의 일부를 사용하지 않는다.
- 삭제된 레코드의 메모리 회수
	- 이를 회수하고 기존에 레코드를 재배치하는 과정에서 다른 페이지가 재배치된 데이터를 참조할 수 있ㄱ디에, 레코드의 오프셋은 유지해야한다. 동시에 메모리 낭비 또한 고려해야 함.
- 레코드의 정확한 위치와 상관없이 참조가능

실제로 PSQL 이 Slotted Page 방식을 사용함. 슬롯 페이지는 레코드마다 고정길이의 헤더와 실제 레코드를 지닌다. 


![이미지](/assets/images/Pasted%20image%2020221010212336.png)
https://www.cubrid.com/blog/3822789

이를 통해 아래 문제를 해결할 수 있다.
- 오버헤드 최소화: 실제 레코드 위치를 가리키는 포인터 배열 사용이 유일한 오버헤드.
- 공간 회수: 단편화 제거 및 페이지 재구성을 통해 공간을 회수 가능
- 동적 레이아웃: 슬롯은 ID 를 통해 페이지 외부에서 접근하기 때문에 정확한 위치는 페이지 내부에서만 필요함.

## 셀 병합을 통한한 슬롯 페이지 구성
레코드가 추가될 때마다, 셀을(실제 레코드에 저장되는 데이터 자세한 설명은 책에 나와있지만 생략함) 추가하고 오프셋을 특정 순서(ex: 사전순)에 맞게 정렬하여 이진 탐색이 가능하도록 함.

![이미지](/assets/images/Pasted%20image%2020221010213819.png)
![이미지](/assets/images/Pasted%20image%2020221010213826.png)

### 가변길이 데이터를 관리하는 방법
페이지 레코드 삭제 시 해제된 공간으로 다른 셀을 옮길 필요는 없고, 메모리에 저장된 Availability List 에 위치를 가리키는 포인터만 업데이트 하는 방식으로도 사용 가능하다.

단편화된 페이지에서 적합한 세그먼트가 있는지를 확인하고, **페이지에 남아있는 바이트 수를 계산해두어 저장할 수 있을지에 대한 빠른 확인이 가능하도록 한다.**

First Fit, Best Fit 정책에 따라 선택하며 단편화된 집합의 바이트 크기가 충분할 경우에는 모든 셀을 읽고 재배치하는 과정이 포함됨.

![이미지](/assets/images/Pasted%20image%2020221010213911.png)

# 4장 B-트리 구현
책에서는 페이지 == 트리의 노드임을 상기하자. 
## 페이지 기반 노드의 구조의 대한 상세한 설명
### 페이지 헤더
탐색과 유지보수, 최적화에 필요한 정보를 저장함. 플래그 레이아웃, 셀 개수, 빈 공간을 가리키는 오프셋.
### 매직 넘버
페이지 종류와 버전과 같은 정보를 포함하는 멀티바이트 블록,
### 형제 링크
좌우 형제 페이지를 가리키는 링크로써, 상위 노드로 넘어가지 않고 쉽게 이웃 노드를 참조할 수 있도록 도움. 다만, 삭제 및 업데이트 시 분할과 병합이 일어난다면 해당 링크도 갱신해야하기에 더 복잡해짐.
### Rightmost Pointers(가장 오른쪽 포인터)
B-tree 구조를 설명했다 싶이, 반드시 포인터가 키보다 하나 더 있음. 이를 SQLite 는 헤더 정보에 저장함.
![이미지](/assets/images/Pasted%20image%2020221017232819.png)
### Node High Keys
가장 오른쪽 포인터 처리가 쉬워짐. 모든 키 짝이 맞게됨. 
![이미지](/assets/images/Pasted%20image%2020221017232921.png)

### Overflow Pages
기본 페이지 크기(ex 4K) 를 넘었다면 새로 할당된 오버플로우 페이지에 원본 페이지를 연결하고 이를 저장한다. 

## 이진 검색
### Indirection Pointers 를 이용한 이진 검색
페이지 저장방식은 입력 순서대로 레코드를 저장하며 실제로는 Indirection Pointers 를 이용해 아이템을 확인함.

## 분할과 병합
형제 포인터 및 부모 포인터는 반드시 분할과 병합 시 갱신해주어야 함. [WiredTiger](https://github.com/wiredtiger/wiredtiger/blob/f08bc4b18612ef95a39b12166abcccf207f91596/src/include/btmem.h#L550) 같은 경우에는 형제 포인터로 발생할 수 있는 데드락을 제거하기 위해 부모 포인터를 사용하기도 함.
### 탐색 경로(Breadcrumbs)
삽입 삭제 시 타고온 경로를 다시 순회하는 방식이기에. 탐색 경로를 저장해 사용할 수도 있음. PSQL 은 [BTStack](https://github.com/postgres/postgres/blob/REL_12_STABLE/src/include/access/nbtree.h#L405-L423) 을 사용함

![이미지](/assets/images/Pasted%20image%2020221017234008.png)

## 리밸런싱
분할 및 병합 비용은 비싸기에, 특정 레벨의 원소를 리밸런싱하거나 이를 방지하기 위해 빈공간이 많은 노드로 데이터를 최대한 옮김. 비용이 발생하긴 하나, 레벨을 낮추고 노드 점유율을 증진시킬 수 있음.

물론, 삽입 삭제 시 **로드 밸런싱** 수행하는 방법도 있음. 효율적인 공간 활용을 위해 노드를 분할하는 대신 형제 노드로 일부 원소를 옮기고 삽입할 공간을 확보함.

B*-Trees 는 형제 노드에 찰 때까지 이웃 노드 간에 원소를 분산하는데, 하나를 기준으로 하는 게 아니라 2개를 기준으로 전체가 2/3 으로 찰 때가지 분산함. 부하를 지연시키고, 점유율을 높일 수 있지만 균형을 맞추는 로직이 추가로 더 필요함. 다만, 순회 시 효율성 또한 높아짐. SQLite 이 이와 비슷한로드 밸런싱을 ([balance sibling algorithm](https://www.sqlite.org/btreemodule.html#balance_siblings)) 수행함.

## Right-Only Appends
단조 증가 auto-incremented 인 키를 대부분이 프라이머리 키로 사용하기에, 대부분 각 레벨의 가장 오른쪽 노드에서 분할 작업이 일어난다. 이는 최적화 대상이.
PSQL 에서는 이러한 최적화 방식을 [Fastpath](https://github.com/postgres/postgres/blob/bf491a9073e12ce1fc3e6facd0ae1308534df570/src/backend/access/nbtree/nbtinsert.c#L127-L144)라고 하는데, 전문은 아래와 같다.
```c
/*
* It's very common to have an index on an auto-incremented or
* monotonically increasing value. In such cases, every insertion happens
* towards the end of the index. We try to optimize that case by caching
* the right-most leaf of the index. If our cached block is still the
* rightmost leaf, has enough free space to accommodate a new entry and
* the insertion key is strictly greater than the first key in this page,
* then we can safely conclude that the new key will be inserted in the
* cached block. So we simply search within the **cached block and insert
* the key at the appropriate location.** We call it a fastpath.
*
```
**항상 새로운 키값은 가장 오른쪽 페이지의 첫번째 키보다 큼이 보장되기에 공간이 충분하다면 바로 캐시된 페이지에 새 키값을 삽입한다.** 

### 벌크로딩
잘 모르겠음.

## 압축
실제 raw 데이터 저장 시 상당한 오버헤드가 있을 수 있지만, 압축은 RAM, CPU 사이클을 소모하기에 조심해야함. 데이터 셋이 클 수록 작은 압축단위가 적절함.

Disk 는 블록 단위로 불러오기에 아래와 같은 상황이 발생할 수 있다. 
압축된 값 (a) 만이 필요한데, (b)까지 불러와질 수 있음.

![이미지](/assets/images/Pasted%20image%2020221018000553.png)
## Vacuum and Maintenance
앞에서 설명한 slotted page 는 설계상 추가 처리가 필요하다. 삭제 업데이트 삽입 등 작업이 일어나면 계속해서 단편화가 발생해 논리적 공간은 충분하지만, 연속적인 물리적 공간이 부족할 수 있음.
![이미지](/assets/images/Pasted%20image%2020221018001121.png)
비어 있는 값은 가비지 영역이다.

### 단편화
페이지를 compaction 를 위해 vacuum process 를 가비지 컬렉터가 진행하거나 오프셋을 덮어 씌울 수 있음.
> MVCC 구현을 위해 바로 삭제된 셀을 덮어 씌우거나 삭제하지 않고 둔다. 트랜잭션 동안 이를 접근할 수 있으며, 롤백이나 고스트 레코드에 접근하는 트랜잭션이 끝날 때까지 기다렸다가 가비지 컬렉터가 이를 회수한다.

보통 연속화된 데이터를 필요로 하기에 죽은 셀들은 비동기 적으로 컴팩션이 필요한 경우가 잦음. 

# 5장 트랜잭션 처리와 복구
