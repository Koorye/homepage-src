---
title: 【Spring Data JPA自学笔记二】初识Spring Data JPA
date: 2020-07-16 18:56:21
tags: [后端,Spring Data JPA]
categories: 后端
description: Spring Data JPA是Spring数据家族的一部分，它使得实现基于JPA访问数据库变得很容易。它增强了对JPA的支持，使得构建使用数据访问技术的spring驱动的应用程序变得更加容易。
---

> Spring Data JPA是Spring数据家族的一部分，它使得实现基于JPA访问数据库变得很容易。它增强了对JPA的支持，使得构建使用数据访问技术的spring驱动的应用程序变得更加容易。

# Spring Data JPA是什么？

上一期我们讲过了JDBC和原生JPA，而JPA的使用还比较麻烦，每次访问数据库，我们都需要创建EntityManagerFactory工厂类、获得EntityManager、创建事务、提交事务，最后释放资源。这样的操作明显是很繁琐的。

于是，Spring Data JPA出现了。Spring Data JPA是基于原生JPA的封装，它使得我们使用JPA变得更加简单，且拥有更强大的功能。

# Spring Data JPA的配置

## 配置pom.xml

引入以下依赖：

- Slf4j日志
- Spring核心
- Spring Data JPA支持
- Druid连接池
- Hibernate核心和JPA支持
- MySQL驱动
- *Junit单元测试
- *Lombok

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>org.koorye</groupId>
  <artifactId>hellospringdatajpa</artifactId>
  <version>1.0-SNAPSHOT</version>

  <dependencies>
    <!-- Slf4j -->
    <dependency>
      <groupId>org.slf4j</groupId>
      <artifactId>slf4j-api</artifactId>
      <version>1.7.25</version>
    </dependency>
    <dependency>
      <groupId>org.slf4j</groupId>
      <artifactId>slf4j-log4j12</artifactId>
      <version>1.7.25</version>
      <scope>test</scope>
    </dependency>

    <!-- Spring -->
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-aop</artifactId>
      <version>5.2.7.RELEASE</version>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-core</artifactId>
      <version>5.2.7.RELEASE</version>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-tx</artifactId>
      <version>5.2.7.RELEASE</version>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-beans</artifactId>
      <version>5.2.7.RELEASE</version>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring</artifactId>
      <version>5.2.7.RELEASE</version>
      <type>pom</type>
    </dependency>

    <!-- Spring Data JPA -->
    <dependency>
      <groupId>org.springframework.data</groupId>
      <artifactId>spring-data-commons</artifactId>
      <version>2.3.1.RELEASE</version>
    </dependency>
    <dependency>
      <groupId>org.springframework.data</groupId>
      <artifactId>spring-data-jpa</artifactId>
      <version>2.3.1.RELEASE</version>
    </dependency>

    <!-- Druid -->
    <dependency>
      <groupId>com.alibaba</groupId>
      <artifactId>druid</artifactId>
      <version>1.1.21</version>
    </dependency>

    <!-- Hibernate -->
    <dependency>
      <groupId>org.hibernate</groupId>
      <artifactId>hibernate-core</artifactId>
      <version>5.4.10.Final</version>
    </dependency>
    <dependency>
      <groupId>org.hibernate</groupId>
      <artifactId>hibernate-entitymanager</artifactId>
      <version>5.4.10.Final</version>
    </dependency>

    <!-- MySQL -->
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>8.0.20</version>
    </dependency>

    <!-- Test -->
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-test</artifactId>
      <version>5.2.7.RELEASE</version>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.12</version>
      <scope>test</scope>
    </dependency>

    <!-- Lombok -->
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <version>1.18.12</version>
    </dependency>
  </dependencies>
</project>
```

## 配置applicationContext.xml

配置Spring Data JPA分为6步：

- 配置连接池，此时选用Druid

- 配置`EntityManagerFactory`，其中需要指定：

  - `dataSource`  连接池
  - `packageToScan`  实体类包的位置
  - `persistenceProvider`  持久化提供者，此处选择Hibernate提供的持久化
  - `jpaVendorAdapter`  JPA供应商适配器，其中需要提供一个`bean`，包含一个`jpaVendorAdapter`类，而`bean`有一些配置：

    - generateDdl  是否自动创建数据表
    - database  指定数据库类型
    - showSql  是否显示sql语句
    - databasePlatform  配置数据库方言
  - `jpaDialect`  JPA方言
  
- 配置`transcationManager`事务管理器，指定一个`JPATranscationManager`类，并提供`EntityManagerFactory`

- 整合`springDataJPA`，使用`jpa:repository`标签，指定以下内容：

  - `base-package`  指定JPA方法类包的位置

  - `transaction-manager-ref`  引用`transactionManager`

  - `entity-manager-factory-ref`  引用`entityManagerFactory`

- 配置自动装配，使用`component-scan`标签


```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:jpa="http://www.springframework.org/schema/data/jpa"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/data/jpa http://www.springframework.org/schema/data/jpa/spring-jpa-1.3.xsd
    http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.0.xsd">

  <!-- Data source -->
  <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
    <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
    <property name="url" value="jdbc:mysql://localhost:3306/demo?useUnicode=true&amp;characterEncoding=UTF-8&amp;serverTimezone=UTC"/>
    <property name="username" value="root"/>
    <property name="password" value="root"/>
  </bean>

  <!-- Entity manager factory, provided by hibernate -->
  <bean id="entityManagerFactory" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean">
    <property name="dataSource" ref="dataSource"/>
    <property name="packagesToScan" value="org.koorye.pojo"/>
    <property name="persistenceProvider">
      <bean class="org.hibernate.jpa.HibernatePersistenceProvider"/>
    </property>

    <!-- Adapter -->
    <property name="jpaVendorAdapter">
      <bean class="org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter">
        <property name="generateDdl" value="false"/>
        <property name="database" value="MYSQL"/>
        <property name="showSql" value="true"/>

        <!-- SQL dialect -->
        <property name="databasePlatform" value="org.hibernate.dialect.MySQL5Dialect"/>
      </bean>
    </property>

    <!-- JPA dialect -->
    <property name="jpaDialect">
      <bean class="org.springframework.orm.jpa.vendor.HibernateJpaDialect"/>
    </property>
  </bean>

  <!-- Transaction manager -->
  <bean id="transactionManager" class="org.springframework.orm.jpa.JpaTransactionManager">
    <property name="entityManagerFactory" ref="entityManagerFactory"/>
  </bean>

  <!-- Spring data JPA -->
  <jpa:repositories base-package="org.koorye.dao"
                    transaction-manager-ref="transactionManager"
                    entity-manager-factory-ref="entityManagerFactory"/>

  <!-- Component scan -->
  <context:component-scan base-package="org.koorye"/>
</beans>
```

# Spring Data JPA的使用

Spring Data JPA的使用分为3步：

- 根据数据表编写实体类，并配置实体类与表、类属性与表字段的映射关系
- 编写持久层接口，**不需要编写实现类！**
- 调用接口方法

首先来实现一个实体类，大部分内容与上一期相同，不再介绍：

```java
package org.koorye.pojo;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "user")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "u_id")
  private int id;

  @Column(name = "u_name")
  private String name;

  @Override
  public String toString() {
    return "ID: " + id + ", Name: " + name;
  }
}
```

接下来编写一个接口类，注意此处继承了两个接口：

- `JpaRepository<实体类名, 主键类型>`  提供基本的CRUD功能
- `JpaSpecificationExecutor<实体类名>`  提供多条件查询的支持

```java
package org.koorye.dao;

import org.koorye.pojo.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface UserDao extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User> {
}
```

最后来测试一下：

```java
package org.koorye;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.koorye.dao.UserDao;
import org.koorye.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class SpringDataJPATest {
  @Autowired
  private UserDao userDao;

  @Test
  public void TestFindAll() {
    List<User> userList = userDao.findAll();
    for (User user : userList) {
      System.out.println(user);
    }
  }
}
```

注意到，我们的接口类并没有`findAll`方法，该方法继承自`JpaRepository`接口。

输出结果，测试成功：

```shell
Hibernate: select user0_.u_id as u_id1_0_, user0_.u_name as u_name2_0_ from user user0_
ID: 1, Name: 冬马和纱
ID: 2, Name: 小木曾雪菜

Process finished with exit code 0
```

# Spring Data JPA的运行原理

为什么我们仅仅编写了接口，就可以使用其方法呢？

首先我们来明确几点：

- Java必须通过实现类调用方法
- Java动态代理可以生成接口的实现类

事实上，Spring Data JPA就是通过动态代理实现接口，再装配到我们的持久层类上的。

在调用`userDao.findAll`方法时，Spring Data JPA实际上调用`JdkDynamicAopProxy`创建动态代理对象。

而这个动态代理对象就是`UserDao`接口的实现类，名为`simpleJpaRepository`，这个实现类实现了`UserDao`继承的接口，从而拥有方法。

而`simpleJpaRepository`中实现的方法，正是通过`EntityManager`的各种方法实现的。