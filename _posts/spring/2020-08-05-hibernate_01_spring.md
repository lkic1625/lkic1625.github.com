---
title: "Hibernate 01"
tags:
  - spring
  - hibernate
categories:
  - spring
last_modified_at: 2020-07-31T13:00:00+17:00
toc: true
---
<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>

# Hibernate
### JPA, Hibernate
***
#### JPA(Java persistence API)

JPA는 Java에서 적용하는 ORM(object-relational mapping) 기술에 대한 표준 명세이다.
JPA는 특정 기능을 하는 라이브러리가 아닌 인터페이스라는 의미이다.

ORM이란 객체와 DB의 Table이 mapping을 이루는 것을 말한다.
ORM을 이용하면 SQL Query가 아닌 직관적인 코드(메서드)로서 데이터를 조작할 수 있다.

JPA는 자바 어플리케이션에서 관계형 데이터베이스를 어떻게 사용해야 하는지를 정의하는 한 방법일 뿐이다.


#### Hibernate

![이미지0](/assets/images/hibernate-architecture.png)<br>

> Hibernate, as an ORM solution, effectively "sits between" the Java application data access layer and the Relational Database, as can be seen in the diagram above. The Java application makes use of the Hibernate APIs to load, store, query, etc. its domain data. Here we will introduce the essential Hibernate APIs. This will be a brief introduction; we will discuss these contracts in detail later.


![이미지2](/assets/images/JPA_Hibernate.svg)

JPA를 사용하기 위해서 반드시 `Hibernate`를 사용할 필요는 없다. 작동 방식이 맘에 안 든다면 언제든지 다른 JPA 구현체를 사용할 수 있다. 심지어 본인이 직접 JPA를 구현해서 사용할 수도 있다. 다만 그렇게 하지 않는 이유는 단지 Hibernate가 굉장히 성숙한 라이브러리이기 때문일 뿐이다.

>One of the great things about Hibernate is open source and therefore free.


><font size="6">Refernce</font><br>
https://suhwan.dev/2019/02/24/jpa-vs-hibernate-vs-spring-data-jpa/
https://docs.jboss.org/hibernate/orm/5.4/userguide/html_single/Hibernate_User_Guide.html
