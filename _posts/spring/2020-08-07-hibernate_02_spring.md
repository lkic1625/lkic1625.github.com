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

### SessionFactory, Session
***
![이미지2](/assets/images/JPA_Hibernate.svg)

1. `SessionFactory`
- `SessionFactory` 인터페이스는 `Session` 객체를 얻기 위한 메소드를 제공한다.
- Hibernate config file을 읽어 `Session` 객체를 생성한다.
- App 동작 단계에서 한 번만 생성된다(`Heavy-weight object`).

2. `Session`
- Database의 JDBC connection의 `Wrapper`이다.
- `Short-lived object`로써 Database의 한 번 접근 후 재사용하지 않는다.

### Code
***
```java
package com.b1n.hibernate.demo.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="student")
public class Student {
    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                '}';
    }

    @Id
    @Column(name="id")
    private int id;

    public Student(String firstName, String lastName, String email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    @Column(name="first_name")
    private String firstName;

    @Column(name="last_name")
    private String lastName;

    @Column(name="name")
    private String email;

    public Student(){

    }


}
```

### FAQ: Why we are using JPA Annotation instead of Hibernate?
***
ANSWER:
`JPA` is a standard specification. `Hibernate` is an implementation of the `JPA` specification.

`Hibernate` implements all of the `JPA annotations`.

The Hibernate team recommends the use of `JPA annotations` as a best practice.

><font size="6">Refernce</font><br>
https://joosjuliet.github.io/hibernate_structure/
https://docs.jboss.org/hibernate/orm/5.4/userguide/html_single/Hibernate_User_Guide.html
