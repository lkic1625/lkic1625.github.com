---
title: "sequelize(작성 중)"
tags:
  - nodejs
  - sequelize
categories:
  - nodejs
last_modified_at: 2020-09-03T13:00:00+18:00
toc: true
---
<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>

# 시퀄라이즈

`ORM(object-relational Mapping)`인 시퀄라이즈를 사용해보자.
`ORM`의 편한 부분은 자바스크립트 구문을 SQL 쿼리문으로 바꿔주기 때문이다.

## 설치

`express` 프로젝트를 생성 후 `sequelize`를 설치한다.

시퀄라이즈 커맨드 사용을 위한 `sequelize-cli` 도 설치해준다.
```
npm i sequelize mysql2
npm i -g sequelize-cli
sequelize init

Sequelize CLI [Node: 12.18.2, CLI: 6.2.0, ORM: 6.3.5]

Created "config\config.json"
Successfully created models folder at "C:\Users\lkic1\NodejsProjects\learn-sequelize\models".
Successfully created migrations folder at "C:\Users\lkic1\NodejsProjects\learn-sequelize\migrations".
Successfully created seeders folder at "C:\Users\lkic1\NodejsProjects\learn-sequelize\seeders".
```

이때 기본 생성되는 `models/index.js`를 아래와 같이 수정해주고 사용하자.

```javascript
const Sequelize = require('sequelize');
// const User = require('./user');
// const Comment = require('./comment');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.User = User;
// db.Comment = Comment;

User.init(sequelize);
Comment.init(sequelize);

User.associate(db);
Comment.associate(db);

module.exports = db;
```

## mysql 연결

`app.js`
```javascript
...
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sequelize = require('./models/index.js').sequelize;
...

var app = express();
sequelize.sync();
...
```
`sync()`를 사용하면 서버 실행 시 `MySQL`과 연동된다.

## 모델 정의하기

SQL서 미리 정의된 테이블을 시퀄라이즈에도 정의해야 한다.

시퀄라이즈는 기본적으로 모델 이름을 단수형으로, 테이블 이름을 복수형으로 사용한다.

데이터 테이블은 아래 형식과 같다

users
```
+-----------+--------------+------+-----+-------------------+-------------------+
| Field     | Type         | Null | Key | Default           | Extra             |
+-----------+--------------+------+-----+-------------------+-------------------+
| id        | int          | NO   | PRI | NULL              | auto_increment    |
| name      | varchar(20)  | NO   | UNI | NULL              |                   |
| age       | int unsigned | NO   |     | NULL              |                   |
| married   | tinyint      | NO   |     | NULL              |                   |
| comment   | text         | YES  |     | NULL              |                   |
| create_at | datetime     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+-----------+--------------+------+-----+-------------------+-------------------+
```
comments
```
+------------+--------------+------+-----+-------------------+-------------------+
| Field      | Type         | Null | Key | Default           | Extra             |
+------------+--------------+------+-----+-------------------+-------------------+
| id         | int          | NO   | PRI | NULL              | auto_increment    |
| commenter  | int          | NO   | MUL | NULL              |                   |
| comment    | varchar(100) | NO   |     | NULL              |                   |
| created_at | datetime     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+------------+--------------+------+-----+-------------------+-------------------+
```

`models/users.js`
```javascript
const { sequelize } = require(".");
const { DataTypes } = require("sequelize/types");

module.exports = (sequelize, DataTypes) =>{
  return sequelize.define('user', {
    name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    age:{
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    married:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    create_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
  },{
    timestamps: false,
  }
  );
};
```
`models/comment.js`
```javascript
const { sequelize } = require(".");
const { DataTypes } = require("sequelize/types");

module.exports = (sequelize, DataTypes) =>{
  return sequelize.define('comment', {
    comment: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    create_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
  },{
    timestamps: false,
  }
  );
};
```

`config/config.json`을 커넥션과 일치하게 수정하면 된다.

## 관계 정의하기
유저 테이블과 코멘트 테이블의 관계를 정의해보자.
사용자는 한명이지만, 사용할 수 있는 댓글의 개수 제한은 없기 떄문에 일대다 관계이다.

다른 관계로는 일대일 다대다 관계가 있다.
다대다는 해시태그(#)가 될 수 있다. 게시글은 해시태그를 여러개 포함할 수 있으며 해시태그가 포함된 게시글 또한 여러개이다.

### 1:N
`hasMany`메서드를 통해 유저 테이블의 로우 하나를 불러올 때 연결된 코멘트 테이블의 로우들도 같이 불러올 수 있다.

`belongsTo`메서드를 통해 코멘트 테이블의 로우를 불러올 때 연결된 유저 테이블의 로우도 같이 불러올 수 있다.

`models/index.js`
```javascript
...
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User(sequelize, Sequelize);
db.Comment = Comment(sequelize, Sequelize);

db.User.hasMany(db.Comment, {foreignKey: 'commenter', sourceKey: 'id'});
db.Comment.belongsTo(db.User, {foreignKey: 'commenter', targetKey: 'id'});
...
```

### 1:1

`hasOne`메서드를 통해 직접 연결된 테이블을 불러올 수 있다.

`belongsTo` `hasOne`과 순서가 반대가 되어도 상관없다 일대일 대응이기 때문이다.

### N:M
`belongsToMany`메서드를 통해 코멘트 테이블의 로우를 불러올 때 연결된 유저 테이블의 로우도 같이 불러올 수 있다.
둘 다 위 메서드를 사용하여 불러온다.

자세한 사용법은 이후 9장에서 포스팅 하겠다.

## 쿼리 사용법.

`INSERT INTO users (name, age, married, comment) VALUES ('zero', 24, 0, '자기소개')`
```javascript
User.create({
  name: 'zero',
  age: 24,
  married: false,
  comment: '자기소개',
});
```
여기서 주의할 점은 `married` 콜럼값이 시퀄라이즈에서 정의된 자료형으로 넣는다는 것이다 false가 아닌 0을 넣는다면 오류를 발생시키며,
시퀄라이즈는 알아서 MySQL 자료형으로 바꿔주기 때문에 옵션에 부합하는 자료형을 넣는 것이 중요하다.

`SELECT * FROM users`
```javascript
User.findAll({});
```

`SELECT * FROM users LIMIT 1`
```javascript
User.find({});
```

`SELECT name, age FROM users`
```javascript
User.findAll({
  attributes: ['name', 'married'],
});
```

><font size="6">Refernce</font>
- 조헌영, Node.js 교과서, 길벗, 7장 MySQL<br>
