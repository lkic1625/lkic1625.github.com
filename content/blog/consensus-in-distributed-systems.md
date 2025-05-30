+++
title = "2PC, Raft 정리"
date = "2023-04-08T00:57:55+09:00"

#
# description is optional
#
# description = "An optional description for SEO. If not provided, an automatically created summary will be used."

tags = ["database",]
+++


# 개요

오늘 다뤄볼 이야기는 따라서, 분산 데이터베이스 시스템 안에서의 **트랜잭션이** 어떤 것이며, 어떻게 이용되는지 간단한 예시를 통해 알아보려고 합니다. 또한, 더 일반적인 문제에 해당하는 **합의**를 어떻게 구현하는지 실제 예시를 보며 소개해보겠습니다.

# 분산 시스템에서의 정합성

데이터베이스 시스템에서 순서 보장과 정합성은 매우 중요합니다. 하나의 머신이 하나의 오퍼레이션에 대해 정합성과 순서를 보장하는 건 비교적 쉽습니다. 하지만, 데이터베이스 시스템은 여러 개의 오퍼레이션을 원자적(*Atomicity*)으로 실행시킬 필요가 있습니다.

더, 나아가 이를 물리적으로 분리된 서버에서 진행하게 된다면 우리가 알고 있는 잠금 기반의 방법으론 어렵습니다. 더욱 확장되거나, 이것만으로는 부족합니다. 결국 분산 트랜잭션의 목표는 이에 있습니다.

## 알고리즘

쉽게 접할 수 있는 알고리즘에는 *2PC*(*two-phase commit*), *3PC*(*three-phase commit*) 나아가서는 Google 의 *Spanner* 와 *Calvin* 등이 존재합니다. (이번 포스트에서는 *2PC* 만 다루려고 합니다.) 

*2PC* 는 가장 고전적이지만 그 **단순함과 직관성**에 의해 자주 사용되곤 합니다. *PostgreSQL*[1], *MongoDB*[2], 와 같은 전통적인 데이터베이스 시스템에서 뿐만 아니라, *Spanner* 와 같은 프로토콜에서도 2PC 알고리즘으로 구성합니다. 물론 가용성 개선을 위해 노드들간이 아닌 내부 *Paxos* *Group* 간의 통신이지만요.

# 2PC(Two-Phase Commit)

{{< figure src="/assets/images/Untitled.png" caption="그림 1. Two-Phase Commit(2PC)" >}}

*2PC* 는 기본적으로 코디네이터(혹은 리더가) 존재함이 가정입니다. 분산 시스템에서의 통신은 일반적으로 리더 선정을 기본으로 하며, 간단하게 이유를 설명하자면, $N$ 개의 노드가 존재할 때, 모든 노드끼리 서로 통신하는 $O(N^2)$ 비용을 줄이는 측면에서부터 효율적입니다. 

코디네이터 외에 모든 노드들은 코호트(*Cohorts*)로 불립니다. 간단히는 아래와 같은 프로세스를 진행합니다.

*Prepare*

코디네이터는 코호트들에게 새로운 *Propose* 를 전달하여 새 트랜잭션이 시작됨을 알립니다. 코호트는 일부 적용될 수 있는 해당 트랜잭션의 커밋 여부를 결정하고, 이를 전달합니다. 코호트가 내린 모든 결정은 코디네이터가 저장하며, 코호트도 로컬에 이를 저장합니다. 

*Commit/abort*

만약, **하나의 코호트라도 트랜잭션을 거부할 경우 이는 중단되며**, 코디네이터가 모든 코호트들에게 중단됨을 알립니다. 모든 코호트가 커밋 여부에 대해 긍정으로 투표한 경우에만 커밋합니다.

## 실패 시나리오, **Cohort Failures**

가용성 측면에서, 특정 코호트가 *Propose phase* 에서 접근 불가능하여, 대답을 못 보냈다고 가정해보죠. 하나의 노드라도 이렇게 된다면 트랜잭션은 결과적으로 중단됩니다. 그렇기에 앞서 언급했던 것처럼 가용성 측면에서 새로운 접근이 필요하게 되지요.

또한, 코호트가 *Commit/abort phase* 에서 접근 불가능할 경우, 모든 코호트가 전부 일관적인 상태를 갖지 못 하며, 문제가 된 코호트가 복구될 때, 로그를 보고 복제하는 프로세스가 추가됩니다.

결국에는 코호트의 연결 문제로 인한 메세지 유실은 코디네이터가 계속 기다려야 하는 뒤에 다른 작업들이 진행되지 못 하는 상황을 만듭니다.

## 실패 시나리오, **Coordinator Failures**

코디네이터가 커밋 도중에, 혹은 투표 과정에서 문제가 생길 경우 특정 코호트들은 최종 결정에 대해 알 수 없습니다. 이는 *2PC* 알고리즘이 원자적 블로킹(*Blocking*) 알고리즘으로 불리는 이유입니다. 이 때 쌓아두었던 로그를 이용해 다시 프로세스를 진행할 수 있는 상태로 **복구가 필요합니다.**

*2PC* 알고리즘의 문제점은 간략하게 보아도 꽤나 치명적입니다. 가용성이 보장되지 않는 코호트가 존재할 경우 특히 그렇고요. 이러한 관점에서 *2PC* 는 직관적이지만 효과적이지 않습니다. *3PC*, *Spanner* 이 나온 이유는 결국 이를 보완하기 위해서겠죠.

# 분산 트랜잭션 그리고 2PC, 그 다음은?

우선, 위와 같은 분산 트랜잭션의 구현에 대해서 더 알고 싶다면, *Spanner* 와 이를 구현한(혹은 파생된) *CockroachDB*[3] 와 *YugaByte DB*[4] 를 찾아보시는 걸 추천드립니다.

하지만, 현대의 분산 트랜잭션의 구현은 결국에 물리적으로 떨어진 노드들 끼리 어떻게 합의의 이루냐는 관점이므로, **합의 알고리즘이 자주 사용되곤 하죠**. 실제로 대부분의 구현체들이 분산 합의 알고리즘을 사용하고 있습니다. 

합의 알고리즘은 원자적 커밋에만 집중하지 않으며, 고장 감내와 참여자 간의 결정 문제를 잘 분리해내는 특성을 가지고 있기에 다음 섹션에서 더욱 알아보고자 합니다.

# 합의 알고리즘 개요

분산 데이터베이스 시스템에서 멀리 떨어져있는 노드간의 통신의 정합성과 동기화를 보장하는 것은 가장 중요한 문제입니다. 트랜잭션 또한 같습니다. 합의(*Consensus*) 알고리즘은 이러한 맥락에서 출발했습니다.

또한, 합의 알고리즘에서 특정된 하나의 노드가 리더 역할을 맡고, 합의 알고리즘을 주도한다는 점은 앞에서 언급했듯이 분산 시스템에서 리더의 역할이 매우 중요함을 시사합니다.

이번 섹션에서 다룰 것은 합의 알고리즘과 그 중 가장 보편적으로 알려진 *Raft* 에 대한 이야기입니다. 현대의 분산 데이터베이스 시스템(*[CockroachDB](https://github.com/cockroachdb/cockroach/blob/master/pkg/kv/kvserver/raft.go)*[5], *[etcd](https://github.com/etcd-io/raft)*[6], *[Consul](https://github.com/hashicorp/raft)*[7])은 이러한 합의 알고리즘을 통해 *transaction* *coordination*, *leader election*, *failure detection* 등을 구현합니다. 

# Raft, In Search of an Understandable Consensus Algorithm

> 💡 *Raft* is a consensus algorithm that is designed to be easy to understand. It's equivalent to *Paxos* in fault-tolerance and performance.


분산 합의 알고리즘을 설명할 때는 다양한 예시가 있습니다. 간단히 *2PC, 3PC* 도 포함될 수 있고 머리가 아파지는 *Paxos*[10] 도 그 중에 뽑아볼 수 있겠죠. *Paxos* 는 variation(*Multi-Paxos, Fast Paxos, EPaxos, Flexible Paxos 등)*도 다양하지만, 일단 **인지적이지 않다는 점에서** 머리를 아파오게 합니다.

*Raft* 는 이러한 상황에서 악명이 높은 *Paxos* 와는 반대로 명쾌하고 보다 이해가 쉬운 직관성을 가지도록 설계되었죠.

{{< figure src="/assets/images/Untitled%201.png" caption="그림 2. Raft" >}}

## 동작 방식

알고리즘의 동작 방식부터 설명해보자면, 모든 참가자는 반드시 역할을 가지고 있습니다. 역할은 3가지 존재합니다.

*Candidate*

모든 참가자는 이 역할을 맡을 수 있습니다. 리더가 되기 위해서는 우선 **후보자가** 되어야 하고, 과반수(혹은 쿼럼) 이상의 투표를 받을 경우 리더로 선정될 수 있습니다. 후보자들이 서로 과반수를 못 받는 경우에는 새로운 임기를 시작하고 투표가 다시 시작됩니다. 

*Leader*

특정 기간(임기라고 표현) 동안 선출되며 해당 클러스터의 리더가 됩니다. 임기는 임의의 기간동안 계속 될 수 있으며, 기존에 리더에게 문제가 생길 경우(네트워크 파티션, 메세지 지연 등) **새로운 리더를 선출합니다.**

*Follower*

수동적인 참가자로서, 리더 선출과 로그 저장 과정에서 후보자와 리더에게 응답하는 역할입니다. *Paxos* 에서도 *acceptor* 와 *learner* 가 비슷한 역할을 합니다.

여기서 설명하는 **임기(*Term*)**는 중요한데, 리더마다 고유한 임기를 가지며 시간을 임기로 분할해 생각하기에, *clock synchronization* 없이 전역 부분 순서 문제를 해결할 수 있습니다.[8]

## 주요 컴포넌트

{{< figure src="/assets/images/Untitled%202.png" caption="그림 3. Raft 흐름" >}}

*Leader election*

후보자 P1 은 RequestVote 메세지를 다른 노드들에게 보냅니다. 메세지에는 후보자의 임기($x+1$)와 로컬에 저장되는 로그에 마지막 임기 ID($x$) 를 포합니다. 과반수(혹은 쿼럼) 이상의 투표를 받으면 리더로 선정되며 새로운 임기가 시작됩니다. **각 투표에서 투표는 한 명의 후보에게만 할 수 있습니다.**

*Periodic heartbeats*

프로토콜은 허트비트 메커니즘을 이용해 참가자의 라이브니스(*liveness*)를 보장합니다. 리더는 임기동안 주기적으로 팔로워에게 허트비트를 전송해야하며, 팔로워가 새로운 허트비트를 받지 못할 경우 리더는 현재 가용 불가 상태이며 새로운 임기 상태가 필요한 것을 인지합니다. 이를 ***election timeout*** 라고 부릅니다.

*Log replication / broadcast*

리더는 주기적으로 *AppendEntries* 메세지를 보내 ***replicated log*** 에 새로운 값을 추가합니다. 메세지에는 현재의 임기와 인덱스, 저장할 항목이 포함됩니다.

## 리더의 역할

리더로 선정되고 나면 리더는 클라이언트의 요청을 받아들이며 이를 다른 노드들로 전달합니다. 팔로워들에게 병렬적으로 전송하며, *replicated log* 에 추가합니다.

팔로워는 *AppendEntries* 메세지를 받게 되면, 메세지를 *Local log* 에 추가합니다. 이후 리더에게 해당 메세지가 저장되었음을 알리며, 충분히 복제가 완료되었다고 판단하면 리더는 이를 **커밋했다고** 인지합니다.

{{< figure src="/assets/images/Untitled%203.png" caption="그림 4. 노드 간 복제 상황" >}}

## 실패 시나리오

### Split Vote

리더 선출 과정에서 후보자가 여려명이고, 어떠한 후보자도 과반수 노드에게 투표를 받지 못했을 경우, *Split vote* 현상이라고 부릅니다. 앞에서 언급했던 것처럼 다시 한 번 투표가 진행되는데, Raft 는 뒤 따르는 투표에서도 계속해서 *Split vote* 현상이 지속되는 걸 막기 위해 무작위 타이머를 이용하여 이에 대한 확률을 줄입니다. [9] 

### 팔로워의 연결 지연

특정 시간 이상 팔로워의 응답이 오지 않을 경우 메세지 전송을 재시도 합니다. 팔로워는 언제든 연결 지연이 일어날 수 있으며, 그 상태에서 리더는 최선의 노력으로 메세지 전송 과정을 이루어내야 합니다. 앞에서 언급했던 병렬적인 메세지 전송 또한 이에 해당됩니다. 각 메세지에는 리더가 만들어낸 고유값, ID 가 존재하기 때문에 로그 저장에서 순서 문제가 발생하지 않습니다.

### 커밋 메세지의 결정론적 성격

커밋 메세지가 전달되는 과정에서 네트워크 등의 문제로 이미 레플리카에는 커밋되었지만, 커밋 중인 걸로 표시될 수 있습니다. 이런 경우 리더는 지속적으로 클라이언트 요청을 재시도하여 해결합니다. [8]

### 고장 감지

리더가 보내는 주기적인 허트비트 매커니즘은 팔로워에게 리더가 현재 가용 불가능 상태이며 새로운 임기가 필요하다는 사실을 알려줍니다. 새로운 리더가 선출되면 바로 복구 프로세스를 진행하고 리더와 팔로워가 알고 있는 가장 최신의 로그로 클러스터의 상태를 동기화합니다. 이 과정에서 리더는 절대 자신의 항목을 삭제하지 않고, 로그를 추가할 수만 있습니다.

### Summary

- 특정 임기 동안은 한 리더만 존재한다. 물론 실제론 두 명의 리더가 존재할 수 있지만, 팔로워가 받는 메세지안의 정보를 통해 현재의 임기를 가진 리더만 동작할 수 있도록 설계되어 있다.
- 리더는 저장된 로그를 절대 삭제나 수정하지 않는다. 오직 추가만 가능하다.
- 모든 메세지는 임기와 메세지에 따라 고유성을 가진다, 현재와 이후의 리더는 동일한 식별자를 재사용할 수 없다.

# 마침말

이번 포스트에선 분산 시스템에서의 트랜잭션 나아가는 더 일반적인 문제인 합의에 대해 알아보고, 대표적인 예시인 *2PC* 와 *Raft 를* 알아보았습니다. 이러한 알고리즘은 현대 분산 데이터베이스, 메세지 큐, 스케줄러 등 다양한 영역에서 사용되고 있어, 이번 글을 통해 그러한 시스템이 어떻게 동작되는지 아는 시작점이 된다면 좋을 것 같습니다.

## References

[1] [https://www.postgresql.org/docs/current/sql-prepare-transaction.html](https://www.postgresql.org/docs/current/sql-prepare-transaction.html)<br>
[2] [https://www.mongodb.com/docs/v3.6/tutorial/perform-two-phase-commits](https://www.mongodb.com/docs/v3.6/tutorial/perform-two-phase-commits/)<br>
[3] [https://github.com/cockroachdb/cockroach/blob/master/docs/design.md](https://github.com/cockroachdb/cockroach/blob/master/docs/design.md)<br>
[4] [https://docs.yugabyte.com/preview/faq/comparisons/google-spanner/](https://docs.yugabyte.com/preview/faq/comparisons/google-spanner/)<br>
[5] [https://github.com/cockroachdb/cockroach/blob/master/pkg/kv/kvserver/raft.go](https://github.com/cockroachdb/cockroach/blob/master/pkg/kv/kvserver/raft.go)<br>
[6] [https://github.com/etcd-io/raft](https://github.com/etcd-io/raft)<br>
[7] [https://github.com/hashicorp/raft](https://github.com/hashicorp/raft)<br>
[8] [https://www.cl.cam.ac.uk/techreports/UCAM-CL-TR-857.pdf](https://www.cl.cam.ac.uk/techreports/UCAM-CL-TR-857.pdf)<br>
[9] [https://github.com/etcd-io/raft/blob/5fe1c31c515840dd807b8f07d91f704f8334a1b6/raft.go#L387](https://github.com/etcd-io/raft/blob/5fe1c31c515840dd807b8f07d91f704f8334a1b6/raft.go#L387)<br>
[10] [https://en.wikipedia.org/wiki/Paxos_(computer_science)](https://en.wikipedia.org/wiki/Paxos_(computer_science))