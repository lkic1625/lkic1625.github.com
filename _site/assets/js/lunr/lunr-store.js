var store = [{
        "title": "Bipartite Matching",
        "excerpt":"Bipartite Matching(이분 매칭) 1. Graph Mathcing Graph의 Mathcing이란 단순 그래프가 주어졌을 때 끝점을 공유하지 않는 간선의 집합을 표현하는 방법이다. 아래 사진은 올바른 매칭이 진행되었을 때 결과이다. 이 때 가장 큰 매칭을 찾아내는 문제를 최대 매칭 문제라고한다. 하지만 가장 General한 Mathcing 알고리즘은 꽤나 복잡하여 알고리즘 대회에서는 좀 더 단순한 형태로 등장하게...","categories": ["algorithm"],
        "tags": ["network flow","algorithm"],
        "url": "http://localhost:4000/algorithm/bipartite_matching/",
        "teaser": null
      },{
        "title": "Hibernate 01",
        "excerpt":"Hibernate JPA, Hibernate JPA(Java persistence API) JPA는 Java에서 적용하는 ORM(object-relational mapping) 기술에 대한 표준 명세이다. JPA는 특정 기능을 하는 라이브러리가 아닌 인터페이스라는 의미이다. ORM이란 객체와 DB의 Table이 mapping을 이루는 것을 말한다. ORM을 이용하면 SQL Query가 아닌 직관적인 코드(메서드)로서 데이터를 조작할 수 있다. JPA는 자바 어플리케이션에서 관계형 데이터베이스를 어떻게 사용해야 하는지를...","categories": ["spring"],
        "tags": ["spring","hibernate"],
        "url": "http://localhost:4000/spring/hibernate_01_spring/",
        "teaser": null
      },{
        "title": "Hibernate 02",
        "excerpt":"Hibernate with Java Annotation Java Annotation 종류 @Entity Database와 Mapping할 것을 알리는 Annotation @Table(name='') Database Table에서 사용될 name을 명시한다. class name과 table name이 같다면 명시할 필요 없다. @Id Database Table에서 primary key를 특정할 때 쓴다. @Column(name='') 실제 Table의 속성 값을 특정할 떄 사용. field name과 column name이 같다면 명시할 필요...","categories": ["spring"],
        "tags": ["spring","hibernate"],
        "url": "http://localhost:4000/spring/hibernate_02_spring/",
        "teaser": null
      },{
        "title": "Hibernate 03(작성 중)",
        "excerpt":"Hibernate CURD features SessionFactory, Session SessionFactory SessionFactory 인터페이스는 Session 객체를 얻기 위한 메소드를 제공한다. Hibernate config file을 읽어 Session 객체를 생성한다. App 동작 단계에서 한 번만 생성된다(Heavy-weight object). Session Database의 JDBC connection의 Wrapper이다. Short-lived object로써 Database의 한 번 접근 후 재사용하지 않는다. Primary Key primary key란 Table의 행을 특정할 수...","categories": ["spring"],
        "tags": ["spring","hibernate"],
        "url": "http://localhost:4000/spring/hibernate_03_spring/",
        "teaser": null
      },{
        "title": "Flutter 시작하기",
        "excerpt":"Flutter 시작하기 설치 Flutter 홈페이지 접속 후 SDK를 특정 경로에 압축 해제한다. 작성자는 C:\\sdk\\flutter에 압축해제하였다. (이 때 C:\\Program Files\\과 같은 권한 상승이 필요한 directory에 저장하지 않는다.) 환경 변수 설정. 시스템 환경 변수 설정을 위해 시작 탭에서 환경 변수를 검색한다. 아래 보이는 환경 변수를 클릭 후 시스템 변수의 Path 변수가 존재...","categories": ["flutter"],
        "tags": ["flutter"],
        "url": "http://localhost:4000/flutter/get_started_flutter/",
        "teaser": null
      },{
        "title": "Chapter6 express",
        "excerpt":"Express 4장에서 웹 서버를 http 모듈만으로 만들기 때문에 불편하고 확장성도 떨어진다 느꼈을 것이다. npm에는 서버 제작 시 불편함을 해소하고, 편의 기능을 추가한 웹 서버 프레임워크가 있다. express 외에도 koa나 hapi 같은 웹 서버 프레임워크가 존재하지만, express의 다운로드 수가 압도적으로 높다. 이는 성능과 직접적인 연관이 없을지 모르지만 기능 추가나 유지보수 측면에서...","categories": ["nodejs"],
        "tags": ["nodejs","express"],
        "url": "http://localhost:4000/nodejs/express_01/",
        "teaser": null
      },{
        "title": "Chapter5 npm",
        "excerpt":"npm (Node Package Manager) npm 이란. npm 이란 이름 그대로 노드 패키지 매니저이다. 대부분의 패키지가 npm에 등록되어 있으므로 특정 기능의 패키지가 필요하다면 npm에서 찾아 설치하면 된다. npm에 업로드된 모듈을 패키지라 부른다. 모듈이 다른 모듈을 사용할 수 있는 것처럼, 패키지가 다른 패키지를 사용할 수 있다. 이런 관계를 의존 관계라 하며 의존...","categories": ["nodejs"],
        "tags": ["nodejs","npm"],
        "url": "http://localhost:4000/nodejs/npm/",
        "teaser": null
      },{
        "title": "ford-fulkerson",
        "excerpt":"network flow flow network란 그래프 이론에서 flow network란 각각의 edge가 capacity을 가지고 있고 flow를 전달하는 Directed Graph이다. 네트워크는 graph이며 \\(G = (V, E)\\), \\(V\\)는 정점의 집합, \\(E\\)는 \\(V\\)의 간선의 집합으로써 \\(V\\) x \\(V\\)의 subset이다. 이와 함께 \\(c: V\\) x \\(V → ℝ∞\\) 용량 함수 또한 정의된다. \\(WLOG\\) if \\((u, v)...","categories": ["algorithm"],
        "tags": ["network flow","algorithm"],
        "url": "http://localhost:4000/algorithm/ford_fulkerson/",
        "teaser": null
      },{
        "title": "ford-fulkerson 정당성 증명",
        "excerpt":"이 포스트는 FordFulkerson의 정당성 증명에 관한 포스트입니다. proof of correctness cut 이란. Min-cut 문제를 이용하여 증명을 하기 때문에 먼저 cut에 대해 알아보자 그래프 이론에서 cut이란 그래프의 정점을 두 개의 서로소 부분집합으로 분할 하는 것을 말한다. 어떤 컷이든 하나의 끝점이 있는 간선의 집합 cut-set을 결정한다. flow netwrok에서는 s-t cut이라하며, 소스와 싱크를...","categories": ["algorithm"],
        "tags": ["network flow","algorithm"],
        "url": "http://localhost:4000/algorithm/proof_of_correctness_ford_fulkerson/",
        "teaser": null
      }]
