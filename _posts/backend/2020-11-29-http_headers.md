---
title: "HTTP 헤더"
tags:
  - backend
  - HTTP
  - network
  - header
categories:
  - backend
last_modified_at: 2020-11-27T13:00:00+18:00
toc: true
---

# Introduction

오늘은 `HTTP headers`에 대해 알아보려 한다.

보통 블로그 포스팅 혹은 면접 준비를 위해 여러 블로그를 참조하는데, 최근에 한 포스트에서 인상적인 문구를 봤다.

>결국, 어떤 프로토콜을 이해하려면 프로토콜의 헤더만 알면 된다는 얘기었다.<br>
특정 프로토콜의 헤더의 내용은 특정 프로토콜의 기능을 제공하기 위해 담고 있는 최소한의 정보기 때문이다.<br>
출처: https://jeong-pro.tistory.com/181 [기본기를 쌓는 정아마추어 코딩블로그]

`HTTP` 프로토콜에 대한 전반적인 이해를 위해 이 포스트를 작성한다.

# HTTP headers

>HTTP headers let the client and the server pass additional information with an HTTP request or response

말 그대로 통신 중 이를 해석하기 위한 추가적인 정보다.

보통 헤더는 콜론(:)으로 `field`와 `value`를 구분하며 `field`는 대소문자를 구분하지 않고, `value` 앞에 나오는 공백을 무시한다.

헤더는 아래와 같이 4가지 분류로 나뉜다.

- General headers: 요청과 응답에 모두 포함되는 헤더지만 `body`에서 전송되는 데이터와는 관련이 없다.
- Request headers: 가져올 리소스와 이를 요청하는 클라이언트에 대한 자세한 정보를 가진다.
- Response header: 리소스를 제공하는 서버, 위치 등 응답에 대한 추가적인 정보를 가지고 있다.  
- Entity heders: 콘텐츠 데이터 길이, `MIME type`과 같은 리소의 본문에 대한 정보를 가진다.

또한, `프록시`가 어떻게 아래 헤더를 다루냐에 따라 분류할 수 있다.

- Connection
- Keep-Alive
- Proxy-Authenticate
- Proxy-Authorization
- TE
- Trailer
- Transfer-Encoding
- Upgrade (see also Protocol upgrade mechanism).

- End-to-end headers: 이 헤더는 반드시 최종 메세지 수신자에게 전송되야 하는 헤더다. 중간 프록시는 반드시 이를 캐싱해야하며, 어떤 수정도 하면 안 된다.
- Hop-by-hop headers: `single transport-level connection`에서 유의미한 헤더다. 반드시 재전송 혹은 캐싱될 필요 없다. `Connection` general header 를 사용하여 `hob-by-hob header`만 설정할 수 있다는 점을 유의하자.

## General headers

요청 및 응답 메세지 모두에서 사용 가능한 기적인 헤더다.

### Cache-Control

이후 다른 포스트로 이전할 수도 있는 항목입니다.

#### syntax

모든 캐싱시스템이 따라야할 지시사항을 지정한다. 문법은 아래와 같다

```
Cache-Control : cache-request-directive|cache-response-directive
```

서버와 클라이언트는 캐시에서 특정 문서를 요청하거나 캐싱하기 위해 특정 파라미터를 이용하여 이 헤더를 사용할 수 있다.

클라이언트가 사용가능한 캐싱 요청 `directive`다

```
Cache-Control: max-age=<seconds>
Cache-Control: max-stale[=<seconds>]
Cache-Control: min-fresh=<seconds>
Cache-control: no-cache
Cache-control: no-store
Cache-control: no-transform
Cache-control: only-if-cached
```

서버가 사용가능한 캐싱 응답 디렉티브다.

```
Cache-control: must-revalidate
Cache-control: no-cache
Cache-control: no-store
Cache-control: no-transform
Cache-control: public
Cache-control: private
Cache-control: proxy-revalidate
Cache-Control: max-age=<seconds>
Cache-control: s-maxage=<seconds>
```

#### Directive

##### Cacheability

| directive | description     |
| :------------- | :------------- |
| public      | 어떤 요청에 대해서든 캐싱한다.    |
| private  | 타인과 공유되는 프록시 서버에는 캐싱하지 않는다. end-user에만 브라우저에 캐싱한다.  |
| no-cache  | 캐싱된 값을 사용하기 위해선 반드시 서버에서 유효한지 확인해야한다.  |
| no-store  | 어떤 요청도 캐시로 저장하지 않는다.  |

##### Expiration

| directive | description     |
| :------------- | :------------- |
| max-age=<seconds>  | 신선도(?)를 설정한다. 이는 캐시가 언제 생성됐는지와 연관있으며 이 후에는 `304 Modifed`를 받아야만 사용가능하다. `Expires`와는 다르게 상대 시간을 설정한다. |
| max-stale[=<seconds>] | Indicates the client will accept a stale response. An optional value in seconds indicates the upper limit of staleness the client will accept.  |
| min-fresh=<seconds>  |  Indicates the client wants a response that will still be fresh for at least the specified number of seconds. |


##### Revalidation and reloading

| directive | description     |
| :------------- | :------------- |
| must-revalidate  |  리소스가 오래됐을 경우 캐시가 반드시 원 서버의 유효성 검사이후 사용해야한다. |
| proxy-revalidate  |  `must-revalidate`와 비슷하지만 공유 캐시에 이용된다. |
|  immutable| Indicates that the response body will not change over time. The resource, if unexpired, is unchanged on the server and therefore the client should not send a conditional revalidation for it (e.g. If-None-Match or If-Modified-Since) to check for updates, even when the user explicitly refreshes the page. Clients that aren't aware of this extension must ignore them as per the HTTP specification. In Firefox, immutable is only honored on https:// transactions. For more information, see also this blog post.  |

##### Other

| directive | description     |
| :------------- | :------------- |
| no-transform  | 중간 캐시 혹은 프록시가 응답 본문, `Content-Encoding`, `Content-Range`, `Cotent-Type`을 수정할 수 없다.|

### Connection

`Connection` 헤더는 클라이언트와 서버의 연결방식을 설정하는 헤더다. `HTTP/1.1`에서 `keep-alive`가 디폴트다.

`HTTP/2`에선 아예 사라져버렸다. 사실상 의미가 없다는 이야기를 들었다.

```
Connection: keep-alive
```

### Date

`HTTP`가 만들어진 시각. 자동으로 생성된다.

모든 `HTTP`는 타임스탬프를 반드시 가지고 있어야 하며, 기준은 `Greenwich Mean Time(GMT)`이다. 아래 세 가지 템플릿을 허용하니 알아두자.

```
Sun, 06 Nov 1994 08:49:37 GMT  ; RFC 822, updated by RFC 1123
Sunday, 06-Nov-94 08:49:37 GMT ; RFC 850, obsoleted by RFC 1036
Sun Nov  6 08:49:37 1994       ; ANSI C's asctime() format
```

### Pragma

`Pragma`는 캐시제어 (no-cache), HTTP/1.0에서 쓰던 것으로 HTTP/1.1에서는 Cache-Control이 쓰인다.

```
Pragma: no-cache
```

### Transfer-Encoding

발신자와 수신자 사이에 안전한 메세지 압축을 위해 본문 내용의 압축 방식을 지정한다.

`chunked`면 본문 내용이 동적으로 생성되어 길이를 모르기 때문에 나눠서 보낸다는 의미다.

```
Transfer-Encoding: chunked
```

### Trailer

트레일러 헤더는 메세지 무결성 검사, 디지털 서명 또는 처리 상태와 같이 메세지 본문이 전송되는 동안 생성될 수 있는 메타데이터를 제공하기 위해 보낸 사람이 chunked 된 메세지의 끝에 추가 필드를 포함시킬 수 있다.

### Upgrade

프로토콜 변경을 위해 사용한다.

```
Upgrade: HTTP/2.0, SHTTP/1.3, IRC/6.9, RTA/x11
```

### Via

중계 프록시 서버의 이름, 버전, 호스트 명을 나타낸다.

```
Via: 1.0 fred, 1.1 nowhere.com (Apache/1.1)
```

### Warning

메세지에 반영되지 않은 상태 또는 압축에 대한 추가적인 정보를 보내기 위해 사용한다. 응답은 하나 이상의 `Waring header`를 보낸다.

## Request headers

### Accept

클라이이언트가 응답에서 처리가능한 모든 미디어 타입을 명시한다.

```
Accept: type/subtype [q=qvalue]

Accept: text/plain; q=0.5, text/html, text/x-dvi; q=0.8, text/x-c
```

`qvalue`는 0과 1사이 스케일 값을 가지며, 허용가능한 미디어 타입의 퀄리티 레벨을 표시한다.

### Accept-charset

클라이언트가 지원가능한 문자열 인코딩 방식을 명시한다.

```
Accept-Charset: character_set [q=qvalue]

Accept-Charset: iso-8859-5, unicode-1-1; q=0.8
```

`qvalue`는 0과 1사이 스케일 값으로 선호되지 않는 문자열 집합에 대해 허용되는 품질 수준을 나타낸다.

`*` 와일드 카드가 존재 시 모든 인코딩 방식을 허용하고, 위 헤더가 존재하지 않을 시 기본값이다.

### Accept-Encoding

`Accept`와 비슷하지만 클라이언트가 해석가능한 압축 방식을 지정.

```
Accept-Encoding: compress, gzip
Accept-Encoding:
Accept-Encoding: *
Accept-Encoding: compress;q=0.5, gzip;q=1.0
Accept-Encoding: gzip;q=1.0, identity; q=0.5, *;q=0
```

### Accept-Language

클라이언트가 지원가능한 언어를 나열한다.

```
Accept-Language: language [q=qvalue]

Accept-Language: da, en-gb;q=0.8, en;q=0.7
```

`qvalue`는 비선호 언어에 대한 스케일을 0과 1사이로 나타낸다.

### Authorization

토큰 기반 엑세스를 지원하는 경우 위 헤더를 통해 토큰을 보낸다.

```
Authorization: BASIC Z3Vlc3Q6Z3Vlc3QxMjM=
```

### Cookie

쿠키 값을 보내며 key-value로 표현된다.

```
Cookie: name1=value1;name2=value2;name3=value3
```

### Expect

`Expect`는 클라이언트가 요구하는 특정 서버 동작을 나타낸다.

서버가 지원하지 않는 방식의 `Expect` 헤더를 전달받았을 경우 `417 Expaectation Failed`를 전송한다.

### Host

요청하려는 서버 호스트 이름과 포트 번호를 나타낸다.

```
GET /pub/WWW/ HTTP/1.1
Host: www.w3.org
```

명시하지 않을 경우 default로 80 포트를 설정한다.

### If-Match

The If-Match request-header field is used with a method to make it conditional. This header requests the server to perform the requested method only if the given value in this tag matches the given entity tags represented by ETag. The general syntax is:
```
If-Match : entity-tag
```

An asterisk (*) matches any entity, and the transaction continues only if the entity exists. Following are possible examples:

```
If-Match: "xyzzy"
If-Match: "xyzzy", "r2d2xxxx", "c3piozzzz"
If-Match: *
```

### If-Modifed-Since

현재 필드에 입력된 값 이후로 수정되지 않았다면 본문 없는 `304 not modified`를 서버에서 전송한다.

```
If-Modified-Since: Sat, 29 Oct 1994 19:43:31 GMT
```

### Proxy-Authorization

인증을 필요로 하는 프록시에게 권한을 포함한 값을 전달.

```
Proxy-Authorization : credentials
```

### Referer

이 페이지 이전 페이지 주소가 담겨있다. 이 헤더를 사용하면 페이지 이동에 대해 확인 가능하다. 보통 데이터 애널리스틱스 같은 데 많이 사용한다. `CORS` 관련해서 이 헤더를 사용하는 방법을 해결 방법으로 제시하긴 하는데, 헤더를 조작하는 방법이 존재해 그렇게 큰 의미를 가지지 않는 것으로 안다.

### User-Agent

클라이언트 프로그램 정보를 나타낸다.

```
User-Agent: Mozilla/4.0 (compatible; MSIE5.01; Windows NT)
```

## Response headers

### Access-Control-Allow-Origin

[여기로 이동](/backend/2020-11-27-CORS)

### Age

`max-age` 시간내 얼마나 지났는지를 나타내는 추정치


### Location

`300`번대 응답 혹은  `201 Created` 상태 코드일 때 볼 수 있는 헤더로 서버가 응답이 다른 곳에 있다고 알려주며, `URI`를 지정함.

```
Location: http://www.tutorialspoint.org/http/index.htm
```

### Server

웹 서버의 종류를 나타낸다.

```
Server: Apache/2.2.14 (Win32)
```

### Set-Cookie

이름-밸류 쌍의 형식으로 되어있으며, 쿠키를 설정한다.

```
Set-Cookie: name1=value1,name2=value2; Expires=Wed, 09 Jun 2021 10:18:14 GMT
```

옵션은 아래와 같다.

| options | description     |
| :------------- | :------------- |
|  Comment=comment  |   쿠키와 관련된 코멘트 작성     |
| 	Domain=domain   |    쿠키가 유효한 도메인을 명시    |
| Expires=Date-time   |     쿠키 만료시간을 나타냄. 만약 공백일 경우 방문자가 나갈경우 쿠키가 만료됨.   |
|  	Path=path  |    쿠키가 사용될 `URL Path`    |
|  Secure  |   `secure connection` 밑에 있을 경우에만 사용가능한     |


### Proxy-Authenticate

`407 Proxy Authentication Required`와 함께 나타나며 요청한 서버가 프록시 서버인 겨웅 유저 인증을 위한 값을 나타낸다.

```
Proxy-Authenticate  : challenge
```

### WWW-Authenticate

`401 Unauthorized`와 관려있으며 사용자 인증이 필요한 자원을 요구할 시, 서버가 제공하는 인증방식.

## Entity headers

### Allow

허용 가능한 메소드를 명시한다.

```
Allow: GET, HEAD, PUT
```

### Content-Encoding

컨텐츠 압축 방식이다. 응답 컨텐츠를  br, gzip, deflate 등의 알고리즘으로 압축해서 보내면 브루아주거 알아서 해제 후 사용한다.

```
Content-Encoding: gzip
```

### Content-Language

사용자의 언어를 뜻 한다. 응답이 무슨 언어인지와는 관련이 없다.

```
Content-Language: mi, en
```

### Content-Length

요청과 응답 메세지의 본문 크기를 나타낸다. 자동으로 만들어짐.

```
Content-Length: 3495
```

### Content-MD5

메세지 무결성을 위해 포함하며, 해싱한 값이다

```
Content-MD5  : 8c2d46911f3f5a326455f0ed7a8ed3b3
```


### Content-Type

컨텐츠의 타입과 문자열 인코딩을 명시할 수 있다. `Accept`, `Accept-Charset`과 대응된다.

```
Content-Type: text/html; charset=ISO-8859-4
```

### Expires

지원의 만료 일자. 응답이 신선하지 않은지를 확인할 수 있는 기준.

```
Expires: Thu, 01 Dec 1994 16:00:00 GMT
```

### Last-Modified

최근에 수정된 날짜를 나타낸다.

현재 리소스가 수정된 날짜를 나타낸다. 여러 버전의 같은 리소스를 비교할 때 사용.

`ETag` 보단 부정확하지만, 계산이 쉽다.

# 마무리하며..

헤더를 작성 후 다른 `HTTP` 관련 포스트를 작성했을 때 더 빠른 이해를 돕지 않을까 싶다.

`CORS`와 `cache` 관련한 섹션은 따로 빼서 포스트를 작성할 것이다. 수정이 안 되어 있다면 작성자가 게으른 것.



><font size="6">Refernce</font>
- https://feel5ny.github.io/2019/10/05/HTTP_007-2/#cacheflow
- http://www.ktword.co.kr/abbr_view.php?m_temp1=3790
- https://developer.mozilla.org/ko/docs/Web/HTTP/CORS
- https://www.tutorialspoint.com/http/http_header_fields.htm
- https://www.zerocho.com/category/HTTP/post/5b3ba2d0b3dabd001b53b9db
- https://feel5ny.github.io/2019/10/05/HTTP_007-2/
