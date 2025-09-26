---
title: 【Spring Data JPA自学笔记四】动态查询
date: 2020-07-17 16:16:04
tags: [后端,Spring Data JPA]
categories: 后端
description: Spring Data JPA是Spring Data的一个子项目，是对JPA的一种简化封装，提供了很多便捷的方法。本文将介绍Spring Data JPA的动态查询方法，即JpaSpecificationExecutor接口。
---

上一期介绍了Spring Data JPA的各种查询方法，这一期来详细讲一下动态查询类，` JpaSpecificationExecutor`.

# JpaSpecificationExecutor接口

`JpaSpecificationExecutor`提供了`findOne`、`findAll`、`count`方法的几个重载：

- `Optional<T> findOne(Specification<T> spec);`  根据规范查找一个结果
- `List<T> findAll(Specification<T> spec);`  根据规范查找所有结果
- `Page<T> findAll(Specification<T> spec, Pageable pageable);`  根据规范和分页方式查找结果
- `List<T> findAll(Specification<T> spec, Sort sort);`  根据规范和排序方式查找结果
- `long count(Specification<T> spec);`  根据规范统计个数

上一期我们提到了`PagingAndSortingRepository`接口，这个接口提供了排序和分页查找的方法，然而它却不支持条件查询，`JpaSpecificationExecutor`接口解决了这个问题。

# 初见Specification类

`Specification`类用于确定规范，那么这个规范要如何确定呢？接下来我们细看一下这个类：

`Specification`需要提供一个泛型确定实体类，类中有一个`toPredicate`方法需要我们重载，而`toPerdicate`方法拥有3个参数：

- `root`  用于获取类属性
- `criteriaQuery`  添加条件(不常用)
- `criteriaBuilder`  添加条件

举例：

```java
  @Test
  @Transactional
  public void TestFind() {
    Specification<User> spec = new Specification<User>() {
      @Override
      public Predicate toPredicate(Root<User> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
        Path<Object> name = root.get("name");
        return criteriaBuilder.equal(name, "冬马和纱");
      }
    };
    
    List<User> userList = userDao.findAll(spec);
    for (User user : userList) {
      System.out.println(user);
    }
  }
```

这里笔者使用root的get方法获取一个类属性，注意返回值使用`Path<Object>`接收；接着使用`criteriaBuilder`添加equal条件：

- `criteriaBuilder.equal(name, "冬马和纱")` 即 `name = "冬马和纱"`

返回结果：

```shell
Hibernate: select user0_.u_id as u_id1_1_, user0_.u_address_id as u_addres3_1_, user0_.u_name as u_name2_1_ from user user0_ where user0_.u_name=?
Hibernate: select address0_.a_id as a_id1_0_0_, address0_.a_name as a_name2_0_0_ from address address0_ where address0_.a_id=?
ID: 1, Name: 冬马和纱, Address: 北京

Process finished with exit code 0
```

当然，在Java 8及以上版本，我们可以使用Lambda表达式使代码更美观：

```java
    Specification<User> spec = (Specification<User>) (root, criteriaQuery, criteriaBuilder) -> {
      Path<Object> name = root.get("name");
      return criteriaBuilder.equal(name, "冬马和纱");
    };
```

# Specification的更多功能

## Specification的条件

对于`toPredicate`方法中的`criteriaBuilder`参数，除了equal判等之外，还有更多强大的功能：

- `equal` / `notEqual`  判等
- `like` / `notLike`  模糊查询
- `gt` / `ge` / `lt` / `le`  大于、大于等于、小于、小于等于
- `between`  范围查询

需要注意的是，除了判等方法可以直接传递参数之外，其他方法都需要使用`as`指定数据类型，如：

```java
  @Test
  @Transactional
  public void TestFind() {
    Specification<User> spec = (Specification<User>) (root, criteriaQuery, criteriaBuilder) -> {
      Path<Object> name = root.get("name");
      return criteriaBuilder.like(name.as(String.class), "冬马%");
    };

    List<User> userList = userDao.findAll(spec);
    for (User user : userList) {
      System.out.println(user);
    }
  }
```

返回结果：

```shell
Hibernate: select user0_.u_id as u_id1_1_, user0_.u_address_id as u_addres3_1_, user0_.u_name as u_name2_1_ from user user0_ where user0_.u_name like ?
Hibernate: select address0_.a_id as a_id1_0_0_, address0_.a_name as a_name2_0_0_ from address address0_ where address0_.a_id=?
ID: 1, Name: 冬马和纱, Address: 北京

Process finished with exit code 0
```

## Specification多条件查询

`toPredicate`的`criteriaBuilder`参数提供了条件处理的方法：and / or / not.

很好理解，不多做解释。

举例：

```java
  @Test
  @Transactional
  public void TestFind() {
    Specification<User> spec = (Specification<User>) (root, criteriaQuery, criteriaBuilder) -> {
      Path<Object> id = root.get("id");
      Path<Object> address = root.get("address");
      Predicate p1 = criteriaBuilder.ge(id.as(Integer.class), 2);
      Predicate p2 = criteriaBuilder.equal(address, 10001);
      return criteriaBuilder.and(p1, p2);
    };

    List<User> userList = userDao.findAll(spec);
    for (User user : userList) {
      System.out.println(user);
    }
  }
```

返回结果：

```shell
Hibernate: select user0_.u_id as u_id1_1_, user0_.u_address_id as u_addres3_1_, user0_.u_name as u_name2_1_ from user user0_ where cast(user0_.u_id as signed)>=2 and user0_.u_address_id=10001
Hibernate: select address0_.a_id as a_id1_0_0_, address0_.a_name as a_name2_0_0_ from address address0_ where address0_.a_id=?
ID: 3, Name: 鹿目圆香, Address: 北京
ID: 5, Name: 雪之下雪乃, Address: 北京

Process finished with exit code 0
```

# 排序和分页

在旧版本中，`Sort`和`Pageable`可以通过构造方法设定参数，然而在2.2版本之后，构造方法不再被支持。

## 使用Sort

新版本中使用`Sort.by`设定参数，第一个参数表示排序方向，第二个参数表示排序对象。

举例：

```java
  @Test
  @Transactional
  public void TestFind() {
    Specification<User> spec = (Specification<User>) (root, criteriaQuery, criteriaBuilder) -> {
      Path<Object> address = root.get("address");
      return criteriaBuilder.equal(address, 10001);
    };

    List<User> userList = userDao.findAll(spec, Sort.by(Sort.Direction.DESC, "id"));
    for (User user : userList) {
      System.out.println(user);
    }
  }
```

返回结果：

```shell
Hibernate: select user0_.u_id as u_id1_1_, user0_.u_address_id as u_addres3_1_, user0_.u_name as u_name2_1_ from user user0_ where user0_.u_address_id=10001 order by user0_.u_id desc
Hibernate: select address0_.a_id as a_id1_0_0_, address0_.a_name as a_name2_0_0_ from address address0_ where address0_.a_id=?
ID: 5, Name: 雪之下雪乃, Address: 北京
ID: 3, Name: 鹿目圆香, Address: 北京
ID: 1, Name: 冬马和纱, Address: 北京

Process finished with exit code 0
```

如果要进行多条件排序查询，可以使用`Sort.and(Sort)`，本文不再演示。

## 使用PageRequest

`PageRequest.of()`方法返回一个`Pageable`对象，需要提供两个参数，第一个参数表示开始页(**从第零页开始**)，第二个参数表示每页的数据量。

`findAll(Spec, Pageable)`方法返回一个Page对象，这个对象有以下常用方法：

- `getTotalElements`  返回元素总数
- `getTotalPages`  返回总页数
- `getContent`  以List形式返回当前页面的元素

举例：

```java
  @Test
  @Transactional
  public void TestFind() {
    Specification<User> spec = (Specification<User>) (root, criteriaQuery, criteriaBuilder) -> {
      Path<Object> id = root.get("id");
      return criteriaBuilder.gt(id.as(Integer.class), 1);
    };
    Page<User> userPage = userDao.findAll(spec, PageRequest.of(1, 2));
    List<User> userList = userPage.getContent();
    for (User user : userList) {
      System.out.println(user);
    }
  }
```

返回结果：

```shell
Hibernate: select user0_.u_id as u_id1_1_, user0_.u_address_id as u_addres3_1_, user0_.u_name as u_name2_1_ from user user0_ where cast(user0_.u_id as signed)>1 limit ?, ?
Hibernate: select address0_.a_id as a_id1_0_0_, address0_.a_name as a_name2_0_0_ from address address0_ where address0_.a_id=?
Hibernate: select address0_.a_id as a_id1_0_0_, address0_.a_name as a_name2_0_0_ from address address0_ where address0_.a_id=?
Hibernate: select count(user0_.u_id) as col_0_0_ from user user0_ where cast(user0_.u_id as signed)>1
ID: 5, Name: 雪之下雪乃, Address: 北京
ID: 10, Name: 由比滨结衣, Address: 深圳

Process finished with exit code 0
```


