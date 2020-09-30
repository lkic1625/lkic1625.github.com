---
title: "serverless node"
tags:
  - nodejs
  - AWS
categories:
  - nodejs
last_modified_at: 2020-09-24T13:00:00+18:00
toc: true
---

# serverless

서버리스라 해서 서버가 없는 것은 아니다.
클라우드 서비스가 대신 관리하여 서버 관리에 드는 부담을 줄이는 것을 의미한다.

AWS에 EC2나 Google Compute Engine과는 다르게 VM 인스턴스를 미리 구매해야 한다.
단순히 코드를 업로드한 뒤, 사용량에 따라 요금을 지불하면 된다.

AWS Lambda와 Cloud Functions는 특정한 동작을 수행한 로직을 저장하고, 요청이 들어올 때 로직을 실행하는 서비스다.
`FaaS(Functtion as a Service)`라 불린다. 이미지 리사이징과 같은 노드가 버거운 작업들을 함수로 만들어 클라우드에 올리고,
리사이징이 필요할 때마다 서비스를 호출하면 된다.

S3는 클라우드 데이터 저장소라고 보면 된다. 노드 서버가 정적 파일 제공에 딱히 이점이 있이 않으므로 클라우드 데이터 저장소가 대신 정정파일을 제공하도록 위임한다.

# AWS S3 사용하기

S3를 사용하려면 미리 AWS 웹사이트에서 관련 설정을 해두어야 한다.

## 버킷 권한 설정

버킷을 설정 변경 없이 생성 후 아래 JSON 파일을 권한 - 버킷 정책에서 입력하자.
버킷 생성 시 퍼블릭 엑세스를 막아둔다면 권한 변경이 불가하니 이를 주의하도록 하자.

버킷 정책 예제에 대한 자세한 설명은 [이 사이트](https://docs.aws.amazon.com/ko_kr/AmazonS3/latest/dev/example-bucket-policies.html)에서 볼 수 있다.

```json
{
   "Version": "2020-09-24",
   "Statement": [
       {
           "Sid": "AddPerm",
           "Effect": "Allow",
           "Principal": "*",
           "Action": [
               "s3:GetObject",
               "s3:PutObject"
           ],
           "Resource": "arn:aws:s3:::bookmark/*"
       }
   ]
}
```

이후 내 계정 - 보안 자격 증명 메뉴 선택 후 엑세스 키 탭에서 새 엑세스 키 만들기를 선택 후 키 파일을 다운로드하자.

```
$ npm i multer-s3 aws-sdk
```

서비스 사용에 필요한 모듈을 다운로드 후 보안 엑세스 키를 `.env`파일에 복사한다.

middlewares.js
```javascript
...
const AWS = require('aws-sdk');
const path = require('path');
const multer = require('multer');
const multerS3 = require('multer-s3');
const fs = require('fs');

fs.readdir('uploads', (error) => {
  if(error){
    fs.mkdirSync('uploads');
  }
});
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
});
exports.upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'bookmark',
    key(req, file, cb) {
      cb(null, `original/${+new Date()}${path.basename(file.originalname)}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
...
```

`region`은 `ap-northeast-2` 서울을 입력했다.
`req.file.loaction`의 `S3` 버킷 이미지 주소가 담겨있다.

`accessKeyId`와 `secretAccessKey`가 현재 `deprecated` 상태이므로 다른 방식을 취해서 `S3`에 접근해야한다.
`credential` 파일을 이용하는 방법이 존재하는데, [공식문서](https://docs.aws.amazon.com/ko_kr/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html)에서 사용법을 확인해보자.

# AWS Lambda 사용하기
`S3`에 올린 이미지를 리사이징한 후 줄어든 이미지를 다시 S3에 저장해보겠다.
리사이징은 cpu를 많이 사용하는 작업이라 `Lambda`로 분리하여 사용해보았다.

`aws-upload` 프로젝트 폴더를 생성후 `aws-sdk`와 `gm`을 설치한다.

```
$ npm i aws-sdk gm
```

index.js
```javascript
const AWS = require('aws-sdk');
const gm = require('gm').subClass({ imageMagick: true});
const s3 = new AWS.S3();

exports.handler = (event, context, callback) => {
    const Bucket = event.Records[0].s3.bucket.name;
    const Key = event.Records[0].s3.object.key;
    const filename = Key.split('/')[Key.split('/').length - 1];
    const ext = Key.split('.')[Key.split('.').length - 1];

    s3.getObject({ Bucket, Key }, (err, data) => {
        if(err){
            console.error(err);
            return callback(err);    
        }

        return gm(data.Body)
            .resize(200, 200, '^')
            .quality(90)
            .toBuffer(ext, (err, buffer) => {
                if(err) {
                    console.err(err);
                    return callback(err);
                }
                return s3.putObject({
                    Bucket,
                    Key: `thumb/${filename}`,
                    Body: buffer,
                }, (err) =>{
                    if(err) {
                        console.error(err);
                        return callback(err);
                    }
                    return callback(null,  `thumb/${filename}`);
                });
            });
    });
};

```

- `gm` 패키지는 이미지 조작을 위한 패키지이다. `imageMagick`방식으로 이미지를 리사이징 하기위해 `subClass`로 `imageMagick`을 설정하였다.
- `handler` 함수는 `Lambda`호출 시 실행되는 함수이며 매개변수로는 `event`와 `context`, `callback`이 주어진다. `event`는 호출 상황에 대한 정보
`context`는 실행되는 함수환경에 대한 정보, `callback`은 함수가 완료되었는지를 람다에게 알려준다. `callback`의 첫 번째 인자는 에러 여부를, 두 번째 인자는 설명을 의미한다.
- `event` 객체로부터 버킷과 파일경로, 파일명, 확장자 등을 확인한다.
- `s3.GetObject`를 통해서 버킷에 파일을 불러온다 `data.Body`에 파일버퍼가 담겨있다.
- `gm`함수에 파일 버퍼를 넣고 리사이즈 한다. 자세한 인자 설명은 [GM 공식문서](https://www.npmjs.com/package/gm)를 확인하자.
- `s3.putObject`로 이미지를 저장한다.

코드 작성이 완료되었다면 파일을 압축한다.

## Lambda 서비스 설정

![이미지](/assets/images/lambda-create-menu.png)


><font size="6">Refernce</font>
- 조헌영, Node.js 교과서, 길벗, 16장 서버리스 노드 개발
