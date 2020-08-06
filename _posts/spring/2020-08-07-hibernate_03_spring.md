---
title: "Hibernate 03(작성 중)"
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

# Hibernate CURD features

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

### Primary Key
***
`primary key`란 Table의 행을 특정할 수 있는 key이다.
중복과 null이 불가능한 value라고 생각하면 된다.
### Code
***
```java
package com.b1n.hibernate.demo;

import com.b1n.hibernate.demo.entity.Student;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class CreateStudentDemo {

    public static void main(String[] args) {

        // create session factory
        SessionFactory factory = new Configuration()
                .configure("hibernate.cfg.xml")
                .addAnnotatedClass(Student.class)
                .buildSessionFactory();
        //create session
        Session session = factory.getCurrentSession();

        try{
            // use the session object to save Java object
            // create a student object
            System.out.println("Creating new Student object..");
            Student student = new Student("Jo", "Wonbin", "lkic1625@gmail.com");
            // start a transaction
            session.beginTransaction();
            // save the student object
            System.out.println("Saving the Student.. ");
            session.save(student);
            // commit transaction
            session.getTransaction().commit();
            System.out.println("Done.");
        } finally {
            factory.close();
        }

    }
}


```

><font size="6">Refernce</font><br>
