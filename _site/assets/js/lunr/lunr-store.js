var store = [{
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
      },{
        "title": "async/await",
        "excerpt":"비동기 프로그래밍 비동기 처리란? 일반적으로 코드는 순차적으로 진행된다. 이를 synchronous이라하며, 순차적 진행으로 코드가 요청한 결과가 반드시 선언한 자리에서 일어나야 한다. 하지만 요즘과 같이 멀티 코어로 컴퓨터의 성능이 올라간 결과 효율적으로 쓰기 위해서는 이런 순차적 진행은 어울리지 않을 것이다. 그렇게 해서 나온 것이 asynchronous이다. 당신이 다른 코어 프로세서에 다른 작업들을 움직이게...","categories": ["js"],
        "tags": ["js","asynchronous"],
        "url": "http://localhost:4000/js/await_async/",
        "teaser": null
      },{
        "title": "promise",
        "excerpt":"promise 이 포스트는 JavaScript 비동기 프로그래밍에 관한 포스트입니다. 비동기처리와 관련된 설명은 링크를 참고하여 주세요. promise란, promise는 생성 시 꼭 알려지지 않아도 되는 proxy로써, 결과 값이나 실패 이유를 처리할 수 있게 핸들러와 연결시켜 준다. 프로미스는 비동기적 메서드를 동기적 메서드처럼 값을 리턴하게 해준다. 바로 최종 상황을 리턴하지는 않고, 프로미스를 반환하여 어떤 시점에...","categories": ["js"],
        "tags": ["js","asynchronous"],
        "url": "http://localhost:4000/js/promise/",
        "teaser": null
      },{
        "title": "express, middleware",
        "excerpt":"미들웨어 morgan morgan 미들웨어는 콘솔에 요청에 대한 정보를 기록해준다. 사용법 ... var logger = reqire('morgan'); ... app.use(logger('dev')); ... 개발 시에는 주로 short, dev를 인자로 주며, 배포 시에는 common, combined를 사용한다. parameter format tiny :method :url :status :res[content-length] - :response-time ms dev :method :url :status :response-time ms - :res[content-length] short :remote-addr...","categories": ["nodejs"],
        "tags": ["nodejs","express"],
        "url": "http://localhost:4000/nodejs/express_02/",
        "teaser": null
      },{
        "title": "express, Router",
        "excerpt":"라우팅 주소별 분기 처리를 위한 라우팅 방식에 대해 알아보도록 하자. express 기본 코드 app.js ... var indexRouter = require('./routes/index'); var usersRouter = require('./routes/users'); ... app.use('/', indexRouter); app.use('/users', usersRouter); ... 사용 방식에서 알 수 있듯이 라우팅 또한 미들웨어의 일종이라고 볼 수 있다. use 대신 get, post, put, patch, delete 같은 HTTP...","categories": ["nodejs"],
        "tags": ["nodejs","express"],
        "url": "http://localhost:4000/nodejs/express_03/",
        "teaser": null
      },{
        "title": "express, view engine(작성 중)",
        "excerpt":"  템플릿 엔진 사용   Pug(Jade)  루비 문법과 흡사하여 사용해보았다면 익숙할 것이다.   사용법   app.js에는 아래 코드가 반드시 있어야 한다.  ... app.set('views', path.join(__dirname, 'views')); app.set('view engine', 'pug'); ...   템플릿 파일들이 위치한 폴더를 지정하고, res.render 메서드가 이 폴더를 기준으로 템플릿 엔진을 찾아 렌더링한다.   HTML 표현      Refernce        조헌영, Node.js 교과서, 길벗, 6장 express      ","categories": ["nodejs"],
        "tags": ["nodejs","express"],
        "url": "http://localhost:4000/nodejs/express_04/",
        "teaser": null
      },{
        "title": "개구리 점프",
        "excerpt":"개구리 점프 SCPC 예선 1차 입출력 input 입력 파일에는 여러 개의 테스트 케이스가 포함될 수 있다. 파일의 첫째 줄에는 테스트 케이스 개수를 나타내는 자연수 \\(T\\)가 주어지고, 이후 차례로 T개의 테스트 케이스가 주어진다. \\(( 1≤T≤5 )\\) 각각의 테스트 케이스 첫 번째 줄에는 ‘좌표 \\(0\\)‘에 놓인 돌을 제외한 나머지 돌들의 개수 \\(N\\)...","categories": ["algorithm"],
        "tags": ["scpc","greedy"],
        "url": "http://localhost:4000/algorithm/scpc_01_01/",
        "teaser": null
      },{
        "title": "bipartite matching",
        "excerpt":"Bipartite Matching(이분 매칭) 1. Graph Mathcing Graph의 Mathcing이란 단순 그래프가 주어졌을 때 끝점을 공유하지 않는 간선의 집합을 표현하는 방법이다. 아래 사진은 올바른 매칭이 진행되었을 때 결과이다. 이 때 가장 큰 매칭을 찾아내는 문제를 최대 매칭 문제라고한다. 하지만 가장 General한 Mathcing 알고리즘은 꽤나 복잡하여 알고리즘 대회에서는 좀 더 단순한 형태로 등장하게...","categories": ["algorithm"],
        "tags": ["network flow","algorithm"],
        "url": "http://localhost:4000/algorithm/bipartite_matching/",
        "teaser": null
      },{
        "title": "관계형 데이터베이스 모델링 개요",
        "excerpt":"모델 모델은 목적에 부합하는 모방이라 할 수 있다. 사람이 살아가면서 나타날 수 있는 다양한 현상은 사람 사물 개념 등에 의해 발생된다고 할 수 있으며 모델링은 이것을 표기법에 의해 규칙을 가지고 표기하는 것 자체를 의미한다. 즉 모델을 만들어가는 일 자체를 모델링으로 정의할 수 있다. 전체 흐름 업무파악 -&gt; 개념적 데이터 모델링...","categories": ["database"],
        "tags": ["RDBMS","database"],
        "url": "http://localhost:4000/database/relational_database_01/",
        "teaser": null
      },{
        "title": "sequelize(작성 중)",
        "excerpt":"시퀄라이즈 ORM(object-relational Mapping)인 시퀄라이즈를 사용해보자. ORM의 편한 부분은 자바스크립트 구문을 SQL 쿼리문으로 바꿔주기 때문이다. 설치 express 프로젝트를 생성 후 sequelize를 설치한다. 시퀄라이즈 커맨드 사용을 위한 sequelize-cli 도 설치해준다. npm i sequelize mysql2 npm i -g sequelize-cli sequelize init Sequelize CLI [Node: 12.18.2, CLI: 6.2.0, ORM: 6.3.5] Created \"config\\config.json\" Successfully created...","categories": ["nodejs"],
        "tags": ["nodejs","sequelize"],
        "url": "http://localhost:4000/nodejs/sequelize/",
        "teaser": null
      },{
        "title": "sns 프로젝트 demo",
        "excerpt":"SNS 서비스 프로젝트 구조 갖추기 nodebird/package.json을 생성 후 아래와 같이 작성한다. author, license, description 등은 바꾸어도 상관없다. { \"name\": \"nodebird\", \"version\": \"0.0.1\", \"description\": \"익스프레스로 만드는 sns서비스\", \"main\": \"app.js\", \"scripts\": { \"start\": \"nodemon app\" }, \"author\": \"b1n\", \"license\": \"MIT\", } $ npm i -g sequelize-cli $ npm i sequelize mysql2 $...","categories": ["nodejs"],
        "tags": ["nodejs"],
        "url": "http://localhost:4000/nodejs/sns_project/",
        "teaser": null
      },{
        "title": "PUT VS POST",
        "excerpt":"서비스 개발 도중 문득 put 과 post의 차이가 분명하지 않아 직접 찾아본 자료들을 정리해둔 글이다. HTTP API 개발 단계에서 서버 자원을 수정, 추가, 배포하기 위해서는 어떤 메서드를 사용해야 하나? 네트워크 지식이 매우 미흡한 작성자에게는 상당히 어려운 부분이다. 간단한게 말해서 하나도 모른다. 그렇다고 HTTP의 정의부터 전부 쓰기도 그러니 공식 문서(rfc7231)를 참고하여...","categories": ["backend"],
        "tags": ["backend","HTTP","protocol"],
        "url": "http://localhost:4000/backend/put_post/",
        "teaser": null
      },{
        "title": "B-tree, index(작성중)",
        "excerpt":"인덱스란? 인덱스란 단순히 생각하면 사전 순 정렬이다. 사전 같은 경우 미리 순서대로 정렬되어 있어 쉽게 찾을 수 있도록(데이터를 읽을 수 있도록) 도와준다. 마찬가지로 DBMS의 인덱스도 컬럼의 값을 주어진 순서로 미리 정렬해 보관한다. 자료구조를 어느정도 이해하고 있다면, 알 수 있듯이 위와 같이 미리 정렬된 저장구조는 읽기 성능을 끌어올리는 방법으로써 수정, 삭제,...","categories": ["database"],
        "tags": ["b_tree","database","datastructure"],
        "url": "http://localhost:4000/database/b_tree_index/",
        "teaser": null
      },{
        "title": "서비스 배포하기",
        "excerpt":"배포 전 배포환경 설정 개발 환경과는 달리 설정해야 할 코드들을 아래와 같이 변경해야 한다. app.js if (process.env.NODE_ENV === 'production'){ app.use(morgan('combined')); } else{ app.use(morgan('dev')); } ... const sessionOptions = { resave: false, saveUninitialized: false, secret: process.env.COOKIE_SECRET, cookie: { httpOnly: true, secure: false, }, } if (process.env.NODE_ENV === 'production'){ sessionOptions.proxy = true;...","categories": ["nodejs"],
        "tags": ["nodejs"],
        "url": "http://localhost:4000/nodejs/starting_web_service/",
        "teaser": null
      }]
