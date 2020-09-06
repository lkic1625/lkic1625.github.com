---
title: "sns 프로젝트 demo"
tags:
  - nodejs
categories:
  - nodejs
last_modified_at: 2020-09-05T13:00:00+18:00
toc: true
---
<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>

# SNS 서비스

## 프로젝트 구조 갖추기

`nodebird/package.json`을 생성 후 아래와 같이 작성한다.
`author`, `license`, `description` 등은 바꾸어도 상관없다.

```json
{
  "name": "nodebird",
  "version": "0.0.1",
  "description": "익스프레스로 만드는 sns서비스",
  "main": "app.js",
  "scripts": {
    "start": "nodemon app"
  },
  "author": "b1n",
  "license": "MIT",
}
```

```
$ npm i -g sequelize-cli
$ npm i sequelize mysql2
$ sequelize init
$ npm i express cookie-parser express-session morgan connect-flash pug dotenv
$ npm i -g nodemon
$ npm i -D nodemon
```

`nodemon`은 코드 수정사항이 있을 때마다 매번 서버를 재시작해주는 모듈이다.
배포시에는 사용할 일이 거의 없으니 `--save-dev` 옵션을 사용해 설치해준다.

nodebird/app.js
```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('session');
const flash = require('flash');

const pageRouter = require('./routes/page');
require('dotenv').config();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.join());
app.use(express.urlencoded( { extended: false } ));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
app.use(flash());

app.use('/', pageRouter);

app.use((req, res ,next) => {
    const err = new Error('Not Fount');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) =>{
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
```

`dotenv`를 사용하기 위해 `nodebird/.env` 파일을 만들어 아래 내용을 추가하도록 하자.
```
COOKIE_SECRET=nodebirdsecret
```

또한, 현재 `config.json` 파일이 하드코딩 되어 있기 때문에 `config.js`로 수정하여 사용한다.
`nodebird/.env`에 `SEQUELIZE_PASSWORD`를 추가하자.

```javascript
require('dotenv').config();

module.exports = {
    "development": {
      "username": "root",
      "password": process.env.SEQUELIZE_PASSWORD,
      "database": "database_development",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "test": {
      "username": "root",
      "password": process.env.SEQUELIZE_PASSWORD,
      "database": "database_test",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "production": {
      "username": "root",
      "password": process.env.SEQUELIZE_PASSWORD,
      "database": "database_production",
      "host": "127.0.0.1",
      "dialect": "mysql"
    }
  }
```

## 데이터베이스
`./config/config.js`를 이용해 시퀄라이저가 직접 테이블을 생성할 수 있도록 하며, 우선 콘솔에서 `sequelize db:create`를 통해 데이터베이스를 생성한다.

`app.js`에는 `sequelize.sync()`를 통해 디비 세팅을 해준다.
중요한 부분만 집고 넘어가자면, 팔로잉한 유저와 팔로우한 유저는 서로 N:M 관계이므로 `mapping table`을 생성해줄 필요가 있다. 아래는 그에 대한 sql쿼리다.

```MySQL
CREATE TABLE IF NOT EXISTS `Follow` (`createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `followingId` INTEGER , `followerId` INTEGER , PRIMARY KEY (`followingId`, `followerId`), FOREIGN KEY (`followingId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (`followerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_general_ci;

CREATE TABLE IF NOT EXISTS `PostHashtag` (`createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `PostId` INTEGER , `HashtagId` INTEGER , PRIMARY KEY (`PostId`, `HashtagId`), FOREIGN KEY (`PostId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (`HashtagId`) REFERENCES `hashtags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
```

보기만 해도 정신이 나갈 것 같지만, `./config/user.js`에서는 시퀄라이즈가 지원하는 방법을 통해 간단한 코드로 작성한다.
참고로 여기서 `as` 옵션은  시퀄라이즈가 join 작업 시 사용하는 이름이다. `getFollowings`, `addFollowing` 등의 메서드를 자동 추가해준다.

```javascript
...
static associate(db) {
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.User, {
      foreignKey: 'followingId',
      as: 'Followers',
      through: 'Follow',
    });
    db.User.belongsToMany(db.User, {
      foreignKey: 'followerId',
      as: 'Followings',
      through: 'Follow',
    });
  }
...
```

## passport
로그인 구현에는 세션과 쿠키 처리 등 복잡한 작업이 많아 검증된 모듈을 사용하여 하는 것이 좋다.

`app.js`
```javascript
...
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
app.use(flash());
app.use(passport.initialize());// req 객체에 passport 설정을 심고
app.use(passport.session());// req.session 객체에 passport 정보를 저장한다.
// req.session 은 express-session 에서 생성하므로 항상 그보다 뒤에 연결해야 한다.
...
```

`./passpot/index.js`
```javascript
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User } = require('../models');

module.exports = (passport) =>{
    passport.serializeUser((user, done) => {//req.session에 저장할 정보를 선택한다.
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {//매 요청 시 실행된다.
        //passport.session() 미들웨어가 이 메서드를 호출한다. 데이터베이스에서 받은 아이디를 조회하고 로그인한 사용자의 정보를 가져올 수 있다.
        //조회한 정보를 req.user에 저장할 것이므로 언제든 사용자 정보를 가져올 수 있다.
        User.find( { where: { id }})
            .then(user => done(null, user))
            .catch(err => done(err));     
    });

    local(passport);
    kakao(passport);
}
```

`serializeUser`는 사용자 정보 객체를 세션에 아이디로 저장하는 것이고, `deserializeUser`는 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러오는 것이다.\

<b> 로그인 </b>
1. 로그인 요청
2. `passport.authenticate` 메서드 호출
3. 로그인 전략 수행
4. 로그인 성공 시 사용자 정보객체와 함께 `req.login`호출
5. `req.login` 메서드가 `passport.serializeUser`호출
6. `req.session`에 사용자 아이디만 저장
7. 로그인 완료


<b> 로그인 이후 </b>
1. 모든 요청에 `passprot.session()` 미들웨어가 `passport.deserializeUser` 호출
2. `req.session`에 저장된 아이디로 db조회
3. `req.user`에 저장
4. 라우터에서 위 객체 사용가능

### 로컬 로그인 구현

`routes/middlewares`
```javascript
exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        next();
    } else {
        res.redirect('/');
    }
}
```

라우팅 중에도 미들웨어를 사용하여 로그인 유저에 대한 구현을 쉽게 만들 수 있다.

`./routes/page.js`
```javascript
const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { title: '내정보 - Nodebird', user: req.user});
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
        title: 'Nodebird',
        twits: [],
        user: req.user,
        joinError: req.flash('joinError'),
    });
})

router.get('/', (req, res, next) => {
    res.render('main', {
       title: 'NodeBird',
       twits: [],
       user: req.user,
       loginError: req.flash('loginError'),
    });
});

module.exports = router;
```

`req.user`을 html에서도 사용할 수 있게 전달하는 과정과 미들웨어를 만들어 `next()`가 안될 경우에 주목하자.

`./routes/auth.js`
```javascript
const express = require('express');
const passport = require('passport');
const bcrpyt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try{
        const exUser = await User.find( { where: { email } });
        if(exUser){
            req.flash('joinError', '이미 가입된 이메일입니다.');
            return res.redirect('/join');
        }
        const hash = await bcrpyt.hash(password, 20);//salt round
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');

    } catch(error){
        console.error(error);
        return next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            console.error(authError);
            return next(authError);
        }
        if(!user) {
            req.flash('loginError', info.message);
            return res.redirect('/');
        }

        return req.login(user, (loginError) => {
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); //미들웨어 내 미들웨어네는 (req, res, next)를 붙인다
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    req.redirect('/');
});
module.exports = router;
```

`Passport`객체는 `req`객체에 `login`과 `logout`을 추가시킨다.




><font size="6">Refernce</font>
- 조헌영, Node.js 교과서, 길벗, 7장 MySQL<br>
