---
title: "서비스 배포하기"
tags:
  - nodejs
  - AWS
categories:
  - nodejs
last_modified_at: 2020-09-20T13:00:00+18:00
toc: true
---
<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>

# 배포 전 배포환경 설정

개발 환경과는 달리 설정해야 할 코드들을 아래와 같이 변경해야 한다.

## app.js
```javascript
if (process.env.NODE_ENV === 'production'){
  app.use(morgan('combined'));
} else{
  app.use(morgan('dev'));
}
...
const sessionOptions = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}
if (process.env.NODE_ENV === 'production'){
  sessionOptions.proxy = true;
  sessionOptions.cookie.secure = true;
}
app.use(session(sessionOptions));
...

```

`morgan`의 `combined`같은 경우 `dev`보다 더 많은 로그를 남긴다.

세션 같은 경우 무조건 변경해야 하는 것은 아니고, `https`를 적용할 경우에만 사용하면 된다. `https` 적용을 위해 노드 앞에 다른 서버를 두었을 때 사용한다.
`cookie.secure` 또한 로드밸런싱 등을 위해 `true` 값으로 변경한다.

`process.env.NODE_ENV`는 `.env`에 넣을 수 없다. 개발환경인지 배포 환경인지에 따라 변경해야 하는데 정적파일이기 때문에 `cross-env`를 통해 변경해야 한다.

## cross-env

`package.json`
```json
...
"scripts": {
    "start": "cross-env NODE_ENV=production PORT=80 node app",
    "dev": "nodemon app",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
...
```

리눅스나 맥에서는 cross-env NODE_ENV~ 가 아닌 NODE_ENV=production만 주어도 되지만 윈도우 환경에서는 오류가 나기 때문에 `cross-env`를 설치해주어야 한다.

```
npm i -g cross-env && npm i cross-env
```

## pm2
원할한 서버 운영을 위한 패키지이다. 서버가 에러로 꺼졌을 때 서버를 다시 켜주는 역할을 할 수 있다.
또한, 멀티 스레딩은 아니지만 멀티 프로세싱을 지원하여 프로세스 개수를 1개 이상으로 늘릴 수 있다. 하나의 프로세스가 받는 부하가 적어지므로 서비스를 원할하게 운영 가능하다.

하지만, 단점도 있다. 멀티 스레딩이 아니기 때문에 자원 공유가 불가능하여 프로세스간의 세션 공유가 불가능하다는 점이다.
이 문제를 극복하기 위햐서는 `Memacached`나 레디스를 사용한다. 사용방법은 뒷 절에서 다루도록 하자.

```
npm i -g pm2 && npm i pm2
```

```json
...
"scripts": {
    "start": "cross-env NODE_ENV=production PORT=80 pm2 start app.js",
    "dev": "nodemon app",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
...
```

`pm2`로 실행할 경우 백그라운드에서 작업하기에 서버 동작 후에도 동일한 콘솔을 사용가능하다.
`pm2 list`로 현재 실행중인 서버를 확인 가능하다.

```json
...
"scripts": {
    "start": "cross-env NODE_ENV=production PORT=80 pm2 start app.js -i -1",
    "dev": "nodemon app",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
...
```

`pm2`에서는 `cluster` 모듈과 같이 클러스터링을 도와주는 기능 또한 존재한다.

위와 같이 실행에 `-i 0` 옵션을 준다면 현재 cpu 코어 개수만큼 프로세스를 생성하겠다는 뜻이다. (ex `-i -1`은 한개 덜 생성)
그 외에도 `pm2 kill`, `pm2 monit` 등 다양한 명령어가 많다.

## winston
실제 서버 운영시 `console.log`나 `console.error`는 사용하기 어렵다. 서버 종료 시 로그들도 사라지며, 호출 시간 또한 파악하기 어렵기 때문이다.
`winston`은 이를 대체하기 위한 모듈이다.

에러메세지 발생 후 서버가 셧다운 된다면 로그를 확인조차 불가능 할 것이다.
이에 따라 데이터베이스에 저장해야 한다.

```
npm i winston
```

설치 후 `logger.js`를 작성한다.

```javascript
const { createLogger, format, transports, info } = require('winston');

const logger = createLogger({
    level: info,
    format: format.json(),
    transports: [
        new transports.File({ filename: 'combined.log ' }),
        new transports.File({ filename: 'error.log', level: 'error' }),
    ],
});


if(process.env.NODE_ENV !== 'production'){
    logger.add(new transports.Console({ format: format.simple() }));
}

module.exports = logger;
```

`winston` 패키지의 `createLogger` 메서드를 통해 `logger`를 만든다. 인자로 `logger`에 대한 설정을 넣어줄 수 있다.

- `level`은 로그의 심각도를 의미하며, `error`. `warn`, `info`, `verbose`, `debug`, `silly`가 있다. 심각도가 낮은 것을 고른다면 윗 단계의 로그도 함께 기록된다.
- `format`은 로그의 형식이다. `json`, `label`, `timestamp`, `printf`, `simple`, `combine` 등의 형식이 있으며 기본적으로는 `json`형태로 기록하지만 로그 기록 시간을 표시하려면 `timestamp`를 쓰는 것이 좋다. 활용법이 다양하기에 [공식 문서](https://www.npmjs.com/package/winston#formats)를 찾아보는 걸 추천한다.
- `transports`는 로그 저장방식을 의미한다. 위에서는 파일로 저장하고 콘솔로 출력한다는 의미이고, 여러 로깅 방식을 동시에 사용할 수 있다.

## helmet, hpp

서버의 각종 취약점을 보완해주는 패키지이다.

```
npm i helmet hpp
```

```javascript
...
const helmet = require('helmet');
const hpp = require('hpp');
...
if (process.env.NODE_ENV === 'production'){
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(hpp());
} else{
  app.use(morgan('dev'));
}
...
```
배포시에만 미들웨어로 사용할 수 있도록 설정하자.

이 미들웨어를 통해 방어할 수 있는 취약점 목록은 공식 문서를 통해 확인하자.

## connect-redis
멀티 프로세스 간 세션 공유를 위해 `Redis`를 사용할 것이다.
세션 아이디와 실제 사용자 정보는 메모리에 저장되기 때문에 서버 종료 시 로그인이 모두 풀리게 된다. 이를 방지하기 위해 세션 아이디와 실제 사용자 정보를 데이터베이스에 저장한다.
이 때 사용하는 데이터베이스가 레디스이다.

```
npm i connect-redis
```

```javascript
...
const hpp = require('hpp');
const RedisStore = require('connect-redis')(session);
...
const sessionOptions = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  store: new RedisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    pass: process.env.REDIS_PASSWORD
  }),
}
...

```

레디스를 직접 깔아 서버에 설치할 수도 있지만, [호스팅해주는 업체](https://redislabs.com/)가 있기 때문에 이를 사용해보도록 한다.

새로운 데이터베이스를 생성 후 엔드포인트와 비밀번호를 `.env`에 저장해주고 위와같이 사용한다.

# AWS에 배포하기

`Lightsail`을 사용하여 배포할 것이다.

새로운 서버 생성 후 `SSH`를 이용한다.

```
sudo apt-get update
sudo apt-get install -y mysql-server-5.7
sudo mysql_secure_insatllation
```
위를 입력해 mysql을 설치한다.

깃허브에 저장된 서버를 클론 후 서버 실행을 위해 기본적으로 `Lightsail`에 켜져있는 `apache`서버를 끈다.

```
cd /opt/bitnami
sudo ./ctlscript.sh stop apache
```

```
cd ~/[cloned repos name]
npm i
sudo npm i -g pm2 cross-env sequelize-cli
sequelize db:create --env [database_name]
```


><font size="6">Refernce</font>
- 조헌영, Node.js 교과서, 길벗, 15장 AWS와 GCP로 배포하[]<br>
