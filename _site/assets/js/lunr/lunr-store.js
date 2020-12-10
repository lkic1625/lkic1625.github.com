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
        "title": "Hibernate 03(작성 중)",
        "excerpt":"Hibernate CURD features SessionFactory, Session SessionFactory SessionFactory 인터페이스는 Session 객체를 얻기 위한 메소드를 제공한다. Hibernate config file을 읽어 Session 객체를 생성한다. App 동작 단계에서 한 번만 생성된다(Heavy-weight object). Session Database의 JDBC connection의 Wrapper이다. Short-lived object로써 Database의 한 번 접근 후 재사용하지 않는다. Primary Key primary key란 Table의 행을 특정할 수...","categories": ["spring"],
        "tags": ["spring","hibernate"],
        "url": "http://localhost:4000/spring/hibernate_04_spring/",
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
        "excerpt":"개구리 점프 SCPC 예선 1차 입출력 input 입력 파일에는 여러 개의 테스트 케이스가 포함될 수 있다. 파일의 첫째 줄에는 테스트 케이스 개수를 나타내는 자연수 \\(T\\)가 주어지고, 이후 차례로 T개의 테스트 케이스가 주어진다. \\(( 1≤T≤5 )\\) 각각의 테스트 케이스 첫 번째 줄에는 ‘좌표 \\(0\\)‘에 놓인 돌을 제외한 나머지 돌들의 개수 \\(N\\)...","categories": ["PS"],
        "tags": ["scpc","greedy"],
        "url": "http://localhost:4000/ps/scpc_01_01/",
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
        "excerpt":"데이터베이스 사용 중 자료구조에 대한 생각은 자연스레 떠오를 주제다. 단순히 어떤 구조가 효율적이라는 말은 수업에서 닳도록 들었다. 이번 포스트에서는 그것에 대한 직접적인 응용을 살펴보려 한다. 인덱스란? 인덱스란 단순히 생각하면 사전 순 정렬이다. 사전 같은 경우 미리 순서대로 정렬되어 있어 쉽게 찾을 수 있도록(데이터를 읽을 수 있도록) 도와준다. 마찬가지로 DBMS의 인덱스도...","categories": ["database"],
        "tags": ["b_tree","database","datastructure"],
        "url": "http://localhost:4000/database/b_tree_index/",
        "teaser": null
      },{
        "title": "서비스 배포하기",
        "excerpt":"배포 전 배포환경 설정 개발 환경과는 달리 설정해야 할 코드들을 아래와 같이 변경해야 한다. app.js if (process.env.NODE_ENV === 'production'){ app.use(morgan('combined')); } else{ app.use(morgan('dev')); } ... const sessionOptions = { resave: false, saveUninitialized: false, secret: process.env.COOKIE_SECRET, cookie: { httpOnly: true, secure: false, }, } if (process.env.NODE_ENV === 'production'){ sessionOptions.proxy = true;...","categories": ["nodejs"],
        "tags": ["nodejs","AWS"],
        "url": "http://localhost:4000/nodejs/starting_web_service/",
        "teaser": null
      },{
        "title": "SQL QUERY 정리",
        "excerpt":"sql 쿼리 지문 정리 GROUP_BY SELECT COUNT(column) FROM table_name GROUP_BY column 특정 시간대별 정렬 SELECT date_format(DATETIME, '%H') AS `DATE`, COUNT(date_format(DATETIME, '%H')) FROM ANIMAL_OUTS WHERE date_format(DATETIME, '%H') BETWEEN '09' AND '19' GROUP BY date_format(DATETIME, '%H') ORDER BY date_format(DATETIME, '%H') ASC SELECT HOUR(datetime) AS HOUR, COUNT(HOUR(datetime)) AS COUNT FROM animal_outs GROUP BY...","categories": ["database"],
        "tags": ["database"],
        "url": "http://localhost:4000/database/SQL_QUERY_01/",
        "teaser": null
      },{
        "title": "serverless node",
        "excerpt":"serverless 서버리스라 해서 서버가 없는 것은 아니다. 클라우드 서비스가 대신 관리하여 서버 관리에 드는 부담을 줄이는 것을 의미한다. AWS에 EC2나 Google Compute Engine과는 다르게 VM 인스턴스를 미리 구매해야 한다. 단순히 코드를 업로드한 뒤, 사용량에 따라 요금을 지불하면 된다. AWS Lambda와 Cloud Functions는 특정한 동작을 수행한 로직을 저장하고, 요청이 들어올 때...","categories": ["nodejs"],
        "tags": ["nodejs","AWS"],
        "url": "http://localhost:4000/nodejs/serverless/",
        "teaser": null
      },{
        "title": "책깔:피",
        "excerpt":"책깔피   수업에서 간단한 팀프로젝트 겸 개발했던 프로젝트에서 백엔드 개발 자체를 파이어베이스로 넘겼기에 noed js express 기반으로 작성하였다.   책 OPEN API를 통해 책 정보를 저장하고 사용자는 이를 공유하면 된다.   frontend   backend   더 보완할 점   간단한 DNN을 통해서 사용자가 원하는 게시글을 뽑아내면 안정적인 서비스 제공에 도움이 될 것 같다.  ","categories": ["projects"],
        "tags": ["nodejs","projects"],
        "url": "http://localhost:4000/projects/bookmark/",
        "teaser": null
      },{
        "title": "starting rails(작성 중)",
        "excerpt":"rails rails guiding principles Don’t Repeat Yourself: DRY is a principle of software development which states that “Every piece of knowledge must have a single, unambiguous, authoritative representation within a system.” By not writing the same information over and over again, our code is more maintainable, more extensible, and less...","categories": ["rails"],
        "tags": ["rails","ruby"],
        "url": "http://localhost:4000/rails/starting_rails/",
        "teaser": null
      },{
        "title": "데이터베이스 캐싱(작성 중)",
        "excerpt":"개요 RDBMS 서버구조서 가장 쉽게 만들 수 있는 방식이 주로 RDBMS이다. 용도에 따라 달라지겠지만 규모가 매우큰 포탈에 데이터베이스는 쿼리 진행에도 상당히 많은 시간이 소요될 것이다. 실제로 공공데이터 포탈에서 2000만 Cardinality 규모의 데이터를 받아 샘플 DB를 생성하고 조회해보면 Index를 걸어놓았음에도 불구하고 20초가 넘게 걸린다. 해결방법 데이터베이스 튜닝과 효율적인 인덱싱을 통해 해결할...","categories": ["nodejs"],
        "tags": ["database","cache","nodejs"],
        "url": "http://localhost:4000/nodejs/database_caching/",
        "teaser": null
      },{
        "title": "Nouvelle Vague",
        "excerpt":"개요 알게된 것 https security - should password be hashed server-side or client-side? https://security.stackexchange.com/questions/8596/https-security-should-password-be-hashed-server-side-or-client-side login css design https://doctorcodetutorial.blogspot.com/2019/07/make-animated-signup-form-using-html.html sequelize validation https://sequelize.org/master/manual/validations-and-constraints.html JWT 토큰은 어디에 저장하는게 좋을까? https://lazyhoneyant.tistory.com/ https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage#:~:text=JWT%20sessionStorage%20and%20localStorage%20Security,site%20scripting%20(XSS)%20attacks. Session Storage is Evil https://liferay.dev/blogs/-/blogs/session-storage-is-evil How to log out when using JWT https://medium.com/devgorilla/how-to-log-out-when-using-jwt-a8c7823e8a6 multer upload multiple files https://www.zerocho.com/category/NodeJS/post/5950a6c4f7934c001894ea83 HTTP authentication https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication 비동기...","categories": ["projects"],
        "tags": ["nodejs","projects"],
        "url": "http://localhost:4000/projects/Nouvelle_Vague/",
        "teaser": null
      },{
        "title": "개인정보처리방침",
        "excerpt":"개인 정보의 처리 목적. 본 개발자가 작성한 앱은(는) 다음의 목적을 위하여 개인정보를 처리하고 있으며, 다음의 목적 이외의 용도로는 이용하지 않습니다. 1) 안드로이드 STT 기능을 위한 소리 녹음 개인 정보 처리 위탁 여부 본 개발자의 앱은 타 업체에 개인 정보 처리를 위탁하지 않습니다. 정보 주체의 권리, 의무 및 그 행사 방법...","categories": ["projects"],
        "tags": ["nodejs","projects"],
        "url": "http://localhost:4000/projects/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4%EC%B2%98%EB%A6%AC%EB%B0%A9%EC%B9%A8/",
        "teaser": null
      },{
        "title": "closest pair",
        "excerpt":"definition input: \\(p_1, p_2, p_3, ... p_n\\) \\((p_i = (x_i, y_i))\\) output: \\(p_i, p_j\\) with smallest \\(p_i - p_j\\) Brute-force algorithm minDist = infinity for i = 1 to length(P) - 1 do for j = i + 1 to length(P) do let p = P[i], q = P[j] if...","categories": ["algorithm"],
        "tags": ["divide and conquer","algorithm"],
        "url": "http://localhost:4000/algorithm/closest_pair/",
        "teaser": null
      },{
        "title": "covex hull",
        "excerpt":"Graham Scan pseudo code sort by y-order; //$$p_1, p_2, ..., p_n$$ stack.push($$p_1, p_2$$); for i = 3 to $$n$$ do while next $$\\angle next, top, $$p_i$$ != CCW stack.pop() stack.push($$p_i$$) return stack Analysis of Graham Scan Invariant \\(&lt;p_1, ... ,stack.top()&gt;\\) is convex 기울기 공식: \\(D = det\\begin{vmatrix} 1 &amp; p_x...","categories": ["algorithm"],
        "tags": ["divide and conquer","algorithm"],
        "url": "http://localhost:4000/algorithm/covex_hull/",
        "teaser": null
      },{
        "title": "면접준비용(이후 정리)",
        "excerpt":"MEAN stack mongodb express angular nodejs 모두 자바스크립트로 동작 가능하며, 오픈 소스이다. SPA single page application이라 하며 모든 페이지가 단 하나로 되어 있는 사이트. 보통 웹사이트는 글쓰기, 회원가입 등 복잡한 기능을 여러 페이지에서 지원하지만, 이 페이지는 html 상에서 추가로 필요한 데이터만 서버로부터 받아 화면을 구성해주는 것으로 실제로 추가 HTML 호출이...","categories": ["projects"],
        "tags": ["nodejs","projects"],
        "url": "http://localhost:4000/projects/interview/",
        "teaser": null
      },{
        "title": "tree diameter",
        "excerpt":"트리의 지름 문제 트리(tree)는 사이클이 없는 무방향 그래프이다. 트리에서는 어떤 두 노드를 선택해도 둘 사이에 경로가 항상 하나만 존재하게 된다. 트리에서 어떤 두 노드를 선택해서 양쪽으로 쫙 당길 때, 가장 길게 늘어나는 경우가 있을 것이다. 이럴 때 트리의 모든 노드들은 이 두 노드를 지름의 끝 점으로 하는 원 안에 들어가게...","categories": ["algorithm"],
        "tags": ["greedy","algorithm"],
        "url": "http://localhost:4000/algorithm/tree_diameter/",
        "teaser": null
      },{
        "title": "shortest path",
        "excerpt":"definition \\(input\\): \\(G=(V,E,g), v_0 \\in V\\) \\(output\\): shortest path \\(v_0\\) to \\(v_i\\) \\((v_i \\in V)\\) 다익스트라 알고리즘 다익스트라 알고리즘은 Invariant를 중심으로 진행된다. 이는 아래와 같다 : \\(\\forall{u} \\in T, d_{min}(u) = \\text{shortest path}\\) \\[\\forall{u} \\notin T, \\text{shortest path} v_0 \\to T_0 \\to u is \\text{shortest path then insert u to...","categories": ["algorithm"],
        "tags": ["greedy","algorithm"],
        "url": "http://localhost:4000/algorithm/dijkstra_algorithm/",
        "teaser": null
      },{
        "title": "dynamic programming",
        "excerpt":"chained matrix multiplication \\(input\\): \\(d_0, d_1 ... d_n\\) \\((\\text{size of }M_i = d_{i-1} \\times d_i)\\) \\(output\\): \\(D(i, j) = M_i \\times M_{i+1} \\times ... \\times M_j\\) 의 최소비용 점화식 \\(\\text{for all i}\\in S, D(i,i) = 0\\) \\(D(i, j) = min_{i \\le k \\le j}(D(i, k) + D(k + 1,j) +...","categories": ["algorithm"],
        "tags": ["dp","algorithm"],
        "url": "http://localhost:4000/algorithm/dynamic_programming/",
        "teaser": null
      },{
        "title": "scheduling",
        "excerpt":"activity selection problem \\(n\\)개의 팀이 회의하고 싶은 시간을 제출했다고 했을 때 한 개의 회의실에서 선택할 수 있는 최대 회의 개수는? \\(input\\): \\(j_1, j_2, j_3, ... j_n\\) (\\(j_i = (s_i, f_i)\\)) \\(output\\): maximum number of scheduled interval. 알고리즘 목록 \\(S\\)에 남는 회의 중 가장 일찍 끝나는 회의 \\(S_{min}\\)을 선택한다. \\(S_{min}\\)과 겹치는...","categories": ["algorithm"],
        "tags": ["greedy","algorithm"],
        "url": "http://localhost:4000/algorithm/scheduling/",
        "teaser": null
      },{
        "title": "topological sort",
        "excerpt":"Definition \\(input\\): \\(DAG(\\text{Directed Acyclic Graph})\\) \\(output\\): Node sequence \\((v_1, v_2, ... , v_n)\\) such that no edge \\(v_j \\to v_i\\) (j &gt; i) Invariant \\(DAG\\)에서 \\(indegree\\)가 0인 노드는 반드시 존재한다. \\(Proof\\): \\(indegree\\)가 0인 노드가 하나도 없는 \\(DAG\\)를 가정하자. 모든 노드는 그러면 \\(indegree\\)가 1보다 크거나 같다. 어떤 노드 하나를 골라 \\(indegree\\)가...","categories": ["algorithm"],
        "tags": ["DAG","traveling","search","algorithm"],
        "url": "http://localhost:4000/algorithm/topological_sort/",
        "teaser": null
      },{
        "title": "OAuth 2.0(작성 중)",
        "excerpt":"개요 Token based Authentication 관련 구현에 관심이 있어 공식문서와 여러 인터넷 예제를 참고하여 정리한 글입니다. Introduction Roles OAuth에는 3가지 역할이 있다. Client는 우리가 현재 제공하고 있는 Third party service이다. Resource Owner는 우리의 서비스를 제공받는 사용자이다. Resource Server는 Client에게 Resource를 제공해줄 대상이며 구글, 페이스북 등이 될 수 있다. Authorization Server는 RO가...","categories": ["backend"],
        "tags": ["backend","HTTP","protocol"],
        "url": "http://localhost:4000/backend/OAuth_2.0/",
        "teaser": null
      },{
        "title": "recommender system 개발",
        "excerpt":"개요 추천시스템 개발을 위해 예제를 참고하여 정리하였다. 파이썬 keras로 개발 후 Flaks를 이용해 간단한 API 설계로 서버와 통신하려한다. 아직 미흡한 점이 많은 시슽 코드 import pandas as pd import numpy as np from zipfile import ZipFile import tensorflow as tf from tensorflow import keras from tensorflow.keras import layers from pathlib...","categories": ["ML"],
        "tags": ["ML","Collaborative Filtering","projects"],
        "url": "http://localhost:4000/ml/deep_learning_with_keras_recommender_systems/",
        "teaser": null
      },{
        "title": "젓가락",
        "excerpt":"아이디어 처음으로 든 생각은 젓가락 길이를 sorting 해서 서로 붙어있는 짝을 \\(A,B\\)로 두어야 할 것 같았다. 그 이후에는 이 쌍을 선택하거나 선택하지 않는 0-1 knapsack 문제와 다를 것이 없다. 증명 \\(Claim\\): 정답을 구성하는 쌍들 중 하나를 \\(p\\)라 하자 \\(p = \\{a, b, c\\}(a \\le b \\le c)\\) 크기 순서로 \\(a\\)...","categories": ["PS"],
        "tags": ["greedy","sort","dp"],
        "url": "http://localhost:4000/ps/BOJ_2256/",
        "teaser": null
      },{
        "title": "segment tree",
        "excerpt":"개요 구간별로 합을 저장해두는 자료구조이다. 특정 쿼리에 대해 \\(O(logn + k)\\)로 처리 가능하며 공간 복잡도와 생성 과정에서 \\(O(nlogn)\\)이 사용된다. 구조 설명 \\(S\\)를 구간 혹은 세그먼트의 집합이라고 하고, \\(p_1, p_2, ..., p_m\\)을 오름차순으로 정렬한 구간의 끝점 (혹은 endpoint)라 하자. 각각의 점에 따라 분할되는 구간을 생각했을 때 이를 elementary intervals라 한다. elementary...","categories": ["algorithm"],
        "tags": ["search","tree","graph","datatructure","algorithm"],
        "url": "http://localhost:4000/algorithm/segment_tree/",
        "teaser": null
      },{
        "title": "SQL QUERY 정리 2",
        "excerpt":"sql 쿼리 지문 정리 중복값 제거 COUNT SELECT COUNT(DISTINCT NAME) FROM ANIMAL_INS ; COUNT(*)은 NULL 을 허용한다 AVG, SUM, MIN, MAX --테이블 (MY_TABLE)의 평균나이(AGE) 조회-- SELECT AVG(AGE) AS 평균나이 FROM MY_TABLE --테이블(MY_TABLE)의 수량(QT)의 전체 평균(AS 평균수량)조회-- SELECT AVG(QT) AS 평균수량 FROM MY_TABLE 이름이 두 번 이상 쓰인 경우를 이름순으로 조회...","categories": ["database"],
        "tags": ["database"],
        "url": "http://localhost:4000/database/SQL_QUERY_02/",
        "teaser": null
      },{
        "title": "edit distance(moved)",
        "excerpt":"  edit distance   이 포스트는 여기로 옮겨졌습니다.  ","categories": ["algorithm"],
        "tags": ["algorithm","dp"],
        "url": "http://localhost:4000/algorithm/edit_distance/",
        "teaser": null
      },{
        "title": "floyd warshall(moved)",
        "excerpt":"  floyd warshall   이 포스트는 여기로 옮겨졌습니다.  ","categories": ["algorithm"],
        "tags": ["algorithm","dp"],
        "url": "http://localhost:4000/algorithm/floyd_warshall/",
        "teaser": null
      },{
        "title": "parallel binary search",
        "excerpt":"parallel binary search 어떤 문제가 요구하는 정답이 단조 증가 모양을 가질 때 이를 이용하여 답을 빠르게 구할 수 있다. 단조 증가하며, 순서대로 진행하는 쿼리 \\(Q = {q_1, q_2, ... q_n}\\)이 있다 하자. 위 그림과 같이 쿼리에 대하여 binary search를 진행할 수 있는 경우, 문제공간에 대해 병렬 이분 탐색을 진행할 수...","categories": ["algorithm"],
        "tags": ["algorithm","traversal"],
        "url": "http://localhost:4000/algorithm/parallel_binary_search/",
        "teaser": null
      },{
        "title": "B+tree, InnoDB Structure(작성중)",
        "excerpt":"이 포스트는 B Tree 포스트와 이어집니다. 인덱스란? 인덱스란 단순히 생각하면 사전 순 정렬이다. 사전 같은 경우 미리 순서대로 정렬되어 있어 쉽게 찾을 수 있도록(데이터를 읽을 수 있도록) 도와준다. 마찬가지로 DBMS의 인덱스도 컬럼의 값을 주어진 순서로 미리 정렬해 보관한다. 자료구조를 어느정도 이해하고 있다면, 알 수 있듯이 위와 같이 미리 정렬된 저장구조는...","categories": ["database"],
        "tags": ["b+_tree","database","datastructure"],
        "url": "http://localhost:4000/database/B+_tree/",
        "teaser": null
      },{
        "title": "MVCC(추가 필요)",
        "excerpt":"MVCC MVCC(Multi Version Concurrency Control)의 약자이다. Multi Version는 하나의 레코드에 대해 여러 버전이 관리된다는 의미이다. 일반적으로 레코드 레벨의 트랜잭션을 지원하는 DBMS가 제공하는 기능이며, 가장 큰 목적은 잠금을 사용하지 않는 일관된 읽기를 제공하는데 있다. Concurrency Control Concurrency Control 즉, 동시성 제어란 DBMS가 다수의 사용자 사이에서 동시에 작용하는 트랜잭션의 상호간섭 작용에서 데이터베이스를...","categories": ["database"],
        "tags": ["database","MVVC"],
        "url": "http://localhost:4000/database/database_MVCC/",
        "teaser": null
      },{
        "title": "InnoDB 인덱스 페이지 구조",
        "excerpt":"이 포스트는 B+ Tree 포스트와 이어집니다. 인덱스란? 인덱스란 단순히 생각하면 사전 순 정렬이다. 사전 같은 경우 미리 순서대로 정렬되어 있어 쉽게 찾을 수 있도록(데이터를 읽을 수 있도록) 도와준다. 마찬가지로 DBMS의 인덱스도 컬럼의 값을 주어진 순서로 미리 정렬해 보관한다. 자료구조를 어느정도 이해하고 있다면, 알 수 있듯이 위와 같이 미리 정렬된 저장구조는...","categories": ["database"],
        "tags": ["b+_tree","database","datastructure"],
        "url": "http://localhost:4000/database/innoDB_index_page/",
        "teaser": null
      },{
        "title": "레디스 기본 데이터 타입",
        "excerpt":"Redis? 길게 소개하자면 한도 끝도 없고, 나 말고도 필력 좋은 블로그들이 더 잘 소개했을 것 같기에 간단하게만 중점만 짚어 소개하자면, 레디스는 In-Memory Database로서 고가용성인 메모리에 저장하고 조회한다. 기존 관계형 데이터베이스 앞에 캐싱 시스템으로 이용하기 적합한 것으로 알려져있다. 오픈소스인만큼 다양한 서비스에서 사용되고 있으며, 앞으로 계속해서 중요한 역할을 할 것같아 책에 예제와...","categories": ["redis"],
        "tags": ["NoSQL","database","redis","nodejs"],
        "url": "http://localhost:4000/redis/redis_00/",
        "teaser": null
      },{
        "title": "FaaS, BaaS",
        "excerpt":"서버리스 컴퓨팅에 대해 정리하다가 FaaS와 BaaS에 대한 언급이 잦아 정리해보려고 한다. Function as a Service AWS Lambda가 대표적인 FaaS의 예시다. 아래는 AWS Lambda의 공식 홈페이지 설명을 가져와봤다. AWS Lambda lets you run code without provisioning or managing servers. … With Lambda, you can run code for virtually any type of...","categories": ["backend"],
        "tags": ["backend","serverless","FaaS"],
        "url": "http://localhost:4000/backend/FaaS_BaaS/",
        "teaser": null
      },{
        "title": "Serverless",
        "excerpt":"이 글은 https://martinfowler.com/bliki/Serverless.html 번역을 기반으로 작성된 포스트입니다! Serverless 란 Serverless 아키텍처는 기존과 다른 인터넷 기반 서버개발 프로세스이다. third-party services, client-side logic, 호스팅 원격 프로시져 콜의 조합에만 의존한다.(Instead they rely solely on a combination of third-party services, client-side logic, and service hosted remote procedure calls (Faas)) Serverless 어플리케이션은 전통적으로 서버가 처리하던...","categories": ["backend"],
        "tags": ["backend","serverless"],
        "url": "http://localhost:4000/backend/Serverless/",
        "teaser": null
      },{
        "title": "레디스 콜렉션",
        "excerpt":"이번 포스트에서는.. 저번 포스트에서는 기본적인 데이터 타입을 설명했다. 이번 포스트에선 한발 더 나아가 Set, Sorted Set, Bitmap, Hyperloglog 데이터 타입을 살펴보려 한다. 이 글은 레디스 기본 데이터 타입 포스트와 이어집니다. Sets 셋은 스트링과는 구분되는 순서가 없는 콜렉션이다. 중복되는 원소를 셋에 집어넣을수 없으며 내부적으로 해쉬테이블처럼 구현됐다. 이러한 이유는 최적화 때문인데, 멤버...","categories": ["redis"],
        "tags": ["NoSQL","database","redis","nodejs"],
        "url": "http://localhost:4000/redis/redis_01/",
        "teaser": null
      },{
        "title": "Heavy-Light Decompostion(작성중)",
        "excerpt":"Introduction 오늘은 HLD에 대해 포스팅을 해보려 한다. 문제 유형이 한정적이고 어려운 테크닉에 속하기에 포스팅할까 망설였다.(어디다 쓰는 알고리즘인데 도대체) 대회 준비를 하는 것도 아니기에 기본적인 자료구조, 알고리즘을 지향하려 했지만, 최근에는 굳이 그럴 필요 있을까 생각한다. 알고리즘은 기업 코테도 있다보니 겸사겸사 시작했지만, 요즘은 하나의 논리를 배우는 거라 생각한다. 우리는 개발을 하면서 언어에...","categories": ["algorithm"],
        "tags": ["algorithm","traversal","graph","segment_tree","lca"],
        "url": "http://localhost:4000/algorithm/HLD/",
        "teaser": null
      },{
        "title": "CORS(작성중)",
        "excerpt":"Introduction node 개발할 때, 따로 CORS란 단어를 책에선 본 적은 있지만 제대로 다루지는 않았다 헤더에 와일드 카드를 추가하던가, cors 모듈을 사용하여 가능한 URI를 설정하라는 것은 익히 알고 있었으나 그 속 내부까지 파고들어 가볼까 한다. CORS란 Cross Origin Resource Sharing(CORS)는 웹서버를 개발하다보면 자주 마주칠 수 있는 상황이다. 이는 도메인 또는 포트가...","categories": ["backend"],
        "tags": ["backend","CORS"],
        "url": "http://localhost:4000/backend/CORS/",
        "teaser": null
      },{
        "title": "그런 REST API로 괜찮은가.",
        "excerpt":"REpresentaion State Transfer 1991년에 WWW이 출시된 이후 인터넷 정보를 어떻게 공유할 것인가에 대한 연구가 활발히 진행됐는데, 그 예로 가장 먼저 HTTP라는 프로토콜이 만들어졌다. Roy T.Fielding은 REST의 창시자이며 HTTP 프로토콜 개발에 참여했던 연구진으로 HTTP 개발이후 HTTP object model이란 이름의 REST 아키텍쳐를 발표했다. Roy T.Fielding: “How do i improve HTTP without breaking...","categories": ["backend"],
        "tags": ["backend","REST"],
        "url": "http://localhost:4000/backend/REST/",
        "teaser": null
      },{
        "title": "시계열 데이터 관측",
        "excerpt":"Time Series 시계열(時系列, 영어: time series)은 일정 시간 간격으로 배치된 데이터들의 수열을 말한다. 시계열 해석(time series analysis)라고 하는 것은 이런 시계열을 해석하고 이해하는 데 쓰이는 여러 가지 방법을 연구하는 분야이다. -wikipedia 시계열 데이터는 다양한 분석방법에 쓰일 수 있으며, 아래는 이에 대한 예시이다. Usage of specific words or terms in a...","categories": ["redis"],
        "tags": ["NoSQL","database","redis","nodejs","time-series"],
        "url": "http://localhost:4000/redis/redis_02/",
        "teaser": null
      },{
        "title": "동기, 비동기, 블록킹 그리고 논 블록킹",
        "excerpt":"Introduction 최근 꽤나 오래 일을 해오신 개발자 분도 둘의 차이를 모르는 것 같아 놀랐다. 꼭 구분해야할 것이라곤 생각 안 하지만 말의 미묘한 차이는 커뮤니케이션에도 치명적일 수 있으니 한 번 정리해보자. 이번 포스트 주제는 말은 비슷해 보이지만 뭔가 다른 두 쌍에 대해 알아보자. Blocking/Non-Blocking blocking과 non-blocking 호출되는 함수가 바로 리턴하는가에 차이다....","categories": ["js"],
        "tags": ["os","sync"],
        "url": "http://localhost:4000/js/Blocking_NonBlocking_Synchronous_Asynchronous/",
        "teaser": null
      },{
        "title": "Node.js 이벤트 루프",
        "excerpt":"Introduction Node.js를 통해 개발하면서 사용할 줄만 알았지 제대로 된 개념하나 안 잡힌 것 같아 포스트를 작성한다. 이벤트 루프에 대해 알아보자. 블로그에서 최근 작성한 글 중에서 가장 긴 글이 되지 않을까 싶다. Event Loop 자바스크립트는 알다 싶이 단일 스레드 기반의 언어다. 단일 쓰레드라는 의미는 들어오는 작업에 대해 순차적으로, 동시성을 지원하지 못하는...","categories": ["nodejs"],
        "tags": ["js","event_loop"],
        "url": "http://localhost:4000/nodejs/node_event_loop/",
        "teaser": null
      },{
        "title": "HTTP 헤더",
        "excerpt":"Introduction 오늘은 HTTP headers에 대해 알아보려 한다. 보통 블로그 포스팅 혹은 면접 준비를 위해 여러 블로그를 참조하는데, 최근에 한 포스트에서 인상적인 문구를 봤다. 결국, 어떤 프로토콜을 이해하려면 프로토콜의 헤더만 알면 된다는 얘기었다. 특정 프로토콜의 헤더의 내용은 특정 프로토콜의 기능을 제공하기 위해 담고 있는 최소한의 정보기 때문이다. 출처: https://jeong-pro.tistory.com/181 [기본기를 쌓는...","categories": ["backend"],
        "tags": ["backend","HTTP","network","header"],
        "url": "http://localhost:4000/backend/http_headers/",
        "teaser": null
      },{
        "title": "Pollard's rho algorithm",
        "excerpt":"Introduction 이번 포스트에서 다룰 알고리즘은 폴라드 \\(\\rho\\) 알고리즘이다. 폴라드 \\(\\rho\\) 알고리즘은 빠른 소인수 분해를 위한 알고리즘이다. 백준에 큰 수 소인수분해 4149 문제 풀이와 함께 진행하겠다. Core ideas 소인수 분해하려는 숫자 \\(n = pq\\)에서 \\(p\\)는 자명하지 않은 인수라고 가정하자. 다항식을 \\(n\\)으로 나누는 연산 \\(g(x) = (x^2 + 1)\\text{ mod n}\\)은 암호학에...","categories": ["algorithm"],
        "tags": ["math","number_theory","prime"],
        "url": "http://localhost:4000/algorithm/pollards_rho/",
        "teaser": null
      },{
        "title": "WebSocket",
        "excerpt":"Introduction 최근에 포스팅이 눈에 띄게 적었는데, 다시 시작해볼까 한다. 조금 들떠있었나보다. 다시 마음을 가다듬고 싶다. 오늘은 웹소켓에 대해 알아보려한다. 입사 전에 간단한 채팅 시스템을 만들고 싶은데 웹소켓을 사용하려 한다. 물론 회사에선 직접적으로 안 쓰일 수 있겠지만, 절대 필요없는 지식이 없다는 생각으로 포스팅한다. WebSocket The WebSocket Protocol enables two-way communication between...","categories": ["backend"],
        "tags": ["backend","ws","websocket","http"],
        "url": "http://localhost:4000/backend/websocket/",
        "teaser": null
      }]
