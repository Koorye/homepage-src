---
title: 【Spring Data JPA自学笔记三】Spring Data JPA的基础和高级查询方法
date: 2020-07-16 23:26:58
tags: [后端,Spring Data JPA]
categories: 后端
description: 本文将深入了解Spring Data JPA提供的一些复杂查询方法。
---

上一期我们初识了Spring Data JPA，完成了基本配置和简单查询。今天我们将深入了解Spring Data JPA提供的一些复杂查询方法。

# 调用接口的基础方法查询

上一期我们使用接口提供的`findAll`方法进行基本查询，这次我们来深入了解一下Spring Data JPA的各种接口都提供了什么方法。

## Repository

`Repository`提供了一套基本的方法，**不过需要手动声明才可以使用**，其结构如下：

- 第一部分为方法，关键词有：
  - `find(read / get)`
  - `delete(remove)`
  - `save`
  - `count`
  - `exists`
  - `query`
  - `stream`
  
- 第二部分(可不写)为返回结果，关键词有：
  - `Top(后可跟数字以指定返回个数，如Top5)` 返回最大的结果
  - `All`  返回所有结果
  - `First`  返回第一个结果
  - `Distinct(DistinctFirst / DistinctTop) ` 返回去重的结果
  
- 第三部分为条件属性，要求首字母大写，若需要多条件查询，条件属性之间用条件关键字连接，关键字有：
  - `And`  /  `Or`  /  `Between`
  - `LessThan`  /  `GreaterThan`
  - `After` / `Before` (用于时间类型的比较)
  - `IsNull` /  `IsNotNull(NotNull)`
  - `Like` / `NotLike`
  - `StartingWith` / `EndingWith` / `Containing`
  - `OrderBy(Desc)`
  - `Not`  (不等于) / `In` / `NotIn`
  - `TRUE` / `FALSE`
  - `IgnoreCase`
  
- 第二，第三部分之间用`By`连接

**举例：**

  - `findAll()`  查询所有

  - `findFirstByOrderByIdDesc()`  查询以ID倒序返回的第一条结果

  - ...

## CrudRepository

`CrudRepository`继承自`Repository`，提供了一套基本的CRUD方法：

- `save(S) / saveAll(Iterable<S>)`
- `findById(ID) / findAll() / findAllById(Iterable<ID>)`
- `delete(T) / deleteAll(Iterable<? extends T>) / deleteAll() / deleteById(ID)`
- `count()`
- `existsById(ID)`

## PagingAndSortingRepository
`PagingAndSortingRepository`继承自`CrudRepository`，提供了排序和分页方法：

  - `findAll(Sort)`  需要定义一个排序规则作为参数
  - `findAll(Pageable)`  需要定义一个分页规则作为参数

## JPARepository

`JPARepository`继承自`PagingAndSortingRepository`，返回类型由迭代器变为List，更加友好：

- `findAll() / findAll(Sort) / findAll(Example<S>) / findAll(Example<S>, Sort) / findAllById(Iterable<ID>)`
- `saveAll(Iterable<S>) / saveAndFlush(S)`
- `deleteInBatch(Iterable<T>) / deleteAllInBatch()`
- `flush()`
- `getOne(ID var1)`

**举例：**

- `userDao.findAll(Sort.by(Sort.Direction.DESC, "id"))`
- `userDao.findAll(PageRequest.of(0, 10))`

**注： Sort和Pageable的公共构造函数已经在新版中被移除，请使用`.of`和`.by`实现*

## JpaSpecificationExecutor

这个接口单独存在，不继承以上接口，提供了多条件查询的支持，并可以添加排序和分页方法，需要搭配`JPARepository`使用。

# JPQL查询

## 什么是JPQL

JPQL是JPA的查询语句，其语法与SQL相似。

然而，SQL语句面向的是表字段，JPQL语句面向的则是类属性。

JPQL语法说明：

- 除了不能使用`select *(不写select即代表select *)`之外，结构都与SQL一样
- 其关键字指向的是类属性
- 需要传参时用`?`表示，并后跟数字表示参数顺序

## 使用JPQL

声明接口方法：

```java
public interface UserDao extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User> {
  @Query("from User")
  List<User> findByJpql();

  @Query("select id, name from User")
  List<Object[]> findByJpqlw();
}
```

调用方法：

```java
  @Test
  public void TestFind(){
    List<User> userList = userDao.findByJpql();
    for (User user : userList){
      System.out.println(user);
    }
      
	System.out.println();

    List<Object []> users = userDao.findByJpql();
    for (Object[] user : users) {
      System.out.println(Arrays.toString(user));
    }
  }
```

输出结果：

```shell
Hibernate: select user0_.u_id as u_id1_0_, user0_.u_name as u_name2_0_ from user user0_
ID: 1, Name: 鹿目圆香
ID: 2, Name: 小木曾雪菜

Hibernate: select user0_.u_id as col_0_0_, user0_.u_name as col_1_0_ from user user0_
[1, 鹿目圆香]
[2, 小木曾雪菜]

Process finished with exit code 0
```

关于JPQL语句查询的返回值：

- 如果直接使用`from User`，没有指定返回值，就可以用`List<User>`的形式返回结果；

- 如果指定了返回值，如`select id, name from User`，就要使用`List<Object []>`接收结果，因为此时无法判断返回类型。

### 使用有参的JPQL修改数据库

JPQL中，使用`?`后跟数字的形式表示参数。

如果要修改数据库，请加上`@Modifying`注解，并在调用方法时使用`@Transactional`注解提供事务支持：

声明接口方法：

```java
public interface UserDao extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User> {
  @Query("update User set name = ?2 where id = ?1")
  @Modifying
  void updateByJpql(int id,String name);
}
```

调用方法：

```java
  @Transactional
  @Test
  public void TestUpdate() {
    userDao.updateByJpql(1, "冬马和纱");
  }
```

**然而这样并不能改变数据表字段，因为事务默认回滚！**

要解决这个问题，需要使用`@Rollback(false)`显式声明不回滚：

```java
  @Transactional
  @Rollback(false)
  @Test
  public void TestUpdate() {
    userDao.updateByJpql(1, "冬马和纱");
  }
```

这样数据表就会被修改了：

```shell
mysql> select * from user;
+------+-----------------+
| u_id | u_name          |
+------+-----------------+
|    1 | 冬马和纱        |
|    2 | 小木曾雪菜      |
+------+-----------------+
2 rows in set (0.00 sec)
```

# SQL查询

Spring Data JPA中要使用SQL语句非常简单，只需要在`@Query`注解中设定`nativeQuery = true`即可，true表示使用SQL，false表示使用JPQL，默认为false.

当然，由于SQL语句无法指定返回的类，所以我们使用`List<Object []>`接收返回值。

声明接口方法：

```java
  @Query(value = "select * from user", nativeQuery = true)
  List<Object[]> findBySql();
```

调用方法：

```java
  @Test
  public void TestFind() {
    List<Object[]> userList = userDao.findBySql();
    for (Object[] user: userList){
      System.out.println(Arrays.toString(user));
    }
  }
```

返回结果：

```shell
Hibernate: select * from user
[1, 冬马和纱]
[2, 小木曾雪菜]

Process finished with exit code 0
```