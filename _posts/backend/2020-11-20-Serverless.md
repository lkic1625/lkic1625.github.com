---
title: "Serverless(작성중)"
tags:
  - backend
  - serverless
categories:
  - backend
last_modified_at: 2020-11-20T13:00:00+18:00
toc: true
---

이 글은 https://martinfowler.com/bliki/Serverless.html 번역을 기반으로 작성된 포스트입니다!

# Serverless 란

`Serverless` 아키텍처는 기존과 다른 인터넷 기반 서버개발 프로세스이다.

`third-party services`, `client-side logic`, 호스팅 원격 프로시져 콜의 조합에만 의존한다.(Instead they rely solely on a combination of third-party services, client-side logic, and service hosted remote procedure calls [(Faas)](/backend/FaaS_BaaS))

![이미지](/assets/images/serverless-archittectures.png)

`Serverless` 어플리케이션은 전통적으로 서버가 처리하던 작업을 수행하기 위해 `third party services`를 광범위하게 사용한다. 이러한 서비스는 아마존 `AWS`, `Azure`와 같이 상호 운용되는 서비스의 풍부한 생태계가 될 수 있고, `Parse`나 `Firebase`같은 턴키 기능 셋을 제공하는 단일 서비스일 수도 있다.

이 서비스에서 제공되는 `abstraction`은 인프라(메세지 큐, 데이터베이스, edge caching) 또는 더 높은 수준에 (federated identity, role and capability managemnet, seach) 등이 될 수 있다.       

범용 서버 기반 웹 어플리케이션에서 가장 중요한 것 중 하나는 request-response 사이클을 제어하는 것이다. 서버사이드에 컨트롤러는 입력을 처리하고 적절한 어플리케이션 작업을 포함하며, 동적인 리스폰스를 생성한다. `third-party services`로부터 어플리케이션 동작이 함께 짜여진 서버리스 어플리케이션에서 클라이언트 사이드 컨트롤러와 동적 콘텐츠 생성은 서버 사이트 컨트롤러로 대체한다. 수많은 자바스크립트 어플리케이션과 모바일 어플리케이션은 API 호출과 동적인 콘텐츠 생성을 위한 클라이언트 사이드 UI 프레임워크를 사용함으로써 다양한 서비스 간의 상호작용을 조정한다.

서버 기반 웹 어플리케이션의 가장 중요한 부분은 컨트롤러와 인프라 사이에 발생하는 작업이다;(비지니스 로직) `long-lived server`는 이 로직을 구현하는 코드를 호스트하고 어플리케이션 활성 상태를 유지하는 한 필요한 처리를 수행한다. 서버리스 어플리케이션에서, 커스텀 코드 컴포넌트는 단일 HTTP request/response 사이클의 타임라인보다 더욱 짧고, 가까운 라이프 사이클을 가진다. 코드는 리퀘스트가 도착했을 때 실행되며, 이를 처리하고 종료되는 즉시 휴먼상태가 된다. 이러한 코드는 보통 `AWS Lambda`, `Azure Function`, `Google Cloud Function`등 코드 생명주기를 관리하고 스캐일링을 돕는 환경에서 사용할 수 있다. 이러한 스타일의 소프트웨어를 `FaaS`라고 부르기도 한다.  

더 좋은 서버리스 아키텍쳐에 대해 읽고 싶다면 [이 링크](https://martinfowler.com/articles/serverless.html)를 읽어보는 것도 좋다.

><font size="6">Refernce</font>
- https://martinfowler.com/bliki/Serverless.html
