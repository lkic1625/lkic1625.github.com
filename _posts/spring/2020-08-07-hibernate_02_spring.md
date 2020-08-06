---
title: "Hibernate 02"
tags:
  - spring
  - hibernate
categories:
  - spring
last_modified_at: 2020-08-07T13:00:00+17:00
toc: true
---
<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML">
</script>

# Hibernate with Java Annotation

### Java Annotation 종류
***
1. `@Entity`
- Database와 Mapping할 것을 알리는 Annotation
2. `@Table(name='')`
- Database Table에서 사용될 name을 명시한다. class name과 table name이 같다면 명시할 필요 없다.
3. `@Id`
- Database Table에서 `primary key`를 특정할 때 쓴다.
4. `@Column(name='')`
- 실제 Table의 속성 값을 특정할 떄 사용. field name과 column name이 같다면 명시할 필요 없다.

### FAQ: Why we are using JPA Annotation instead of Hibernate?
***
ANSWER:
`JPA` is a standard specification. `Hibernate` is an implementation of the `JPA` specification.

`Hibernate` implements all of the `JPA annotations`.

The Hibernate team recommends the use of `JPA annotations` as a best practice.

><font size="6">Refernce</font><br>
https://suhwan.dev/2019/02/24/jpa-vs-hibernate-vs-spring-data-jpa/
https://docs.jboss.org/hibernate/orm/5.4/userguide/html_single/Hibernate_User_Guide.html
