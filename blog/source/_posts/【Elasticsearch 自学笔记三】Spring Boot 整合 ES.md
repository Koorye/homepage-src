---
title: 【Elasticsearch 自学笔记三】Spring Boot 整合 ES
date: 2020-08-06 16:14:49
tags: [数据库, Elasticsearch, Spring Boot]
categories: [数据库]
description: 本文介绍了 Spring Boot 整合 Elasticsearch 的方法，包括索引操作、字段操作、复杂搜索、分页与排序、使用 @Query、使用 NativeQuery。
---

这一期我们用 Spring Boot + Spring Data Elasticsearch 整合 ES.

# 导入依赖

选用 Idea 快速创建 Spring Boot 项目，选择：

- Spring Data Elasticsearch
- Lombok

```xml
    <!-- Spring Data Elasticsearch -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
    </dependency>

    <!-- Spring Web -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Spring Development -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-devtools</artifactId>
      <scope>runtime</scope>
      <optional>true</optional>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-configuration-processor</artifactId>
      <optional>true</optional>
    </dependency>

    <!-- Lombok -->
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <optional>true</optional>
    </dependency>

    <!-- Spring Test -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
      <exclusions>
        <exclusion>
          <groupId>org.junit.vintage</groupId>
          <artifactId>junit-vintage-engine</artifactId>
        </exclusion>
      </exclusions>
    </dependency>
```

# 编写配置

不写也可以，因为这本来就是默认值。

```properties
spring.elasticsearch.rest.uris=http://127.0.0.1:9200
```

# 索引操作

到这里，我们就可以操作索引了。

通过 Autowired 自动注入 ElasticsearchRestTemplate 类，这里演示索引的创建、查看和删除：

```java
  @Autowired
  private ElasticsearchRestTemplate elasticsearchRestTemplate;

  @Test
  public void testCreateIndex() {
    boolean isSuccess = elasticsearchRestTemplate.indexOps(IndexCoordinates.of("user")).create();
    System.out.println(isSuccess);
  }

  @Test
  public void testGetIndex() {
    Map<String, Object> map = elasticsearchRestTemplate.indexOps(IndexCoordinates.of("user")).getMapping();
    for (Map.Entry<String, Object> entry : map.entrySet()) {
      System.out.println(entry.getKey() + ": " + entry.getValue());
    }
  }

  @Test
  public void testDeleteIndex() {
    boolean isSuccess = elasticsearchRestTemplate.indexOps(IndexCoordinates.of("user")).delete();
    System.out.println(isSuccess);
  }
```

# 字段操作

## 创建实体类

`@Document`  指定索引名

`@Field`  指定字段类型，store 指定字段是否保存，analzyer 指定分词器。

```java
@NoArgsConstructor
@Getter
@Setter
@Accessors(chain = true)
@Document(indexName = "user")
public class User {

  @Id
  @Field(type = FieldType.Integer, store = true)
  private String id;

  @Field(type = FieldType.Keyword, store = true)
  private String name;

  @Field(type = FieldType.Integer, store = true)
  private int age;

  @Field(type = FieldType.Text, store = true, analyzer = "ik_max_word")
  private String desc;

  @Override
  public String toString() {
    return "Name: " + name + ", age: " + age + ", description: " + desc + ".";
  }

}
```

此处 ID 使用 String 类型，是因为当我们不指定 ID 时，String = null，ES 会自动生成随机 ID.

## 创建接口

Spring Data 系列的一贯传统，声明接口方法，自动通过动态代理实现。

至于接口方法的命名规则，可以查看我之前的 Spring Data JPA 笔记。

```java
public interface UserDao extends ElasticsearchRepository<User, String> {
  List<User> findByDescMatches(String key);
}
```

## 调用接口方法

我们来写一个 Service：

```java
public interface ElasticsearchService {

  void addUser(User user) throws IOException;

  void addUserList(List<User> list);

  List<User> searchUserByDesc(String desc) throws IOException;

}
```

实现类：

```java
package org.koorye.service;

import org.koorye.dao.UserDao;
import org.koorye.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ElasticsearchServiceImpl implements ElasticsearchService {

  @Autowired
  private UserDao userDao;

  @Override
  public void addUser(User user) {
    userDao.save(user);
  }

  @Override
  public void addUserList(List<User> list) {
    userDao.saveAll(list);
  }

  @Override
  public List<User> searchUserByDesc(String key) {
    return userDao.findByDescMatches(key);
  }

}
```

非常简单，一行代码就可以解决一个方法。

测试：

```java
  @Test
  public void testAddUser() {
    List<User> userList = new ArrayList<>();
    userList.add(new User().setName("koorye1").setAge(19).setDesc("I love python"));
    userList.add(new User().setName("koorye2").setAge(20).setDesc("I love java"));
    userList.add(new User().setName("koorye3").setAge(21).setDesc("I love c"));
    elasticsearchService.addUserList(userList);
  }

  @Test
  public void testSearchUserByDesc() {
    String matchKey = "love";
    List<User> list = elasticsearchService.searchUserByDesc(matchKey);
    for (User user : list) {
      System.out.println(user);
    }
  }
```

返回结果：

```shell
Name: koorye1, age: 19, description: I love python.
Name: koorye2, age: 20, description: I love java.
Name: koorye3, age: 21, description: I love c.
```

# 复杂搜索

Spring Data Elasticsearch 的方法命名匹配使得我们执行复杂搜索变得异常简单。

官方文档的示例：

| 关键词              | 示例                                        |
| ------------------- | ------------------------------------------- |
| And                 | findByNameANdPrice                          |
| Or                  | findByNameOrPrice                           |
| Is                  | findByName                                  |
| Not                 | findByNameNot                               |
| Between             | findByPriceBetween                          |
| LessThan            | findByPriceLessThan                         |
| LessThanEqual       | findByPriceLessThanEqual                    |
| GreaterThan         | findByPriceGreaterThan                      |
| GreaterThanEqual    | findByPriceGreaterThanEqual                 |
| Before              | findByPriceBefore                           |
| After               | findByPriceAfter                            |
| Like                | findByNameLike                              |
| StartingWith        | findByNameStartingWith                      |
| EndingWith          | findByNameEndingWith                        |
| Contains/Containing | findByNameContaining                        |
| In                  | findByNameIn(Collection`<String>` names)    |
| NotIn               | findByNameNotIn(Collection`<String>` names) |
| Near                | findByStoreNear(暂不支持？)                 |
| True                | findByAvailableTrue                         |
| False               | findByAvailableFalse                        |
| OrderBy             | findByAvailableTrueOrderByNameDesc          |

借助这些关键词，布尔查询、区间查询就可以非常方便的实现。

## 结果分页与排序

只需在参数中加入 Pageable 和 Sort 就可以实现，当然排序也可以使用 OrderBy ：

```java
public interface ElasticsearchService {

  void addUser(User user) throws IOException;

  void addUserList(List<User> list);

  List<User> searchUserByDesc(String desc) throws IOException;

  List<User> searchUserByDescOrderByAge(String desc);

  List<User> searchUserByDesc(String desc, Sort sort);

  Page<User> searchUserByDesc(String desc, Pageable pageable) throws IOException;

}
```

Service 层代码就不再演示。

测试：

```java
  @Test
  public void testSearchUserBySort() {
    String key = "love";
    Sort sort = Sort.by(Sort.Direction.DESC, "age");
    List<User> userList = elasticsearchService.searchUserByDesc(key, sort);
    for (User user : userList) {
      System.out.println(user);
    }
  }

  @Test
  public void testSearchUserByOrder() {
    String key = "love";
    List<User> userList = elasticsearchService.searchUserByDescOrderByAge(key);
    for (User user : userList) {
      System.out.println(user);
    }
  }

  @Test
  public void testSearchUserByDescPageable() {
    String matchKey = "love";
    Pageable pageable = PageRequest.of(0, 2);
    Page<User> userPage = elasticsearchService.searchUserByDesc(matchKey, pageable);
    List<User> userList = userPage.getContent();
    for (User user : userList) {
      System.out.println(user);
    }
  }

```

 返回结果：

```shell
Name: koorye3, age: 21, description: I love c.
Name: koorye3, age: 21, description: I love c.
Name: koorye2, age: 20, description: I love java.
Name: koorye2, age: 20, description: I love java.
Name: koorye1, age: 19, description: I love python.
Name: koorye1, age: 19, description: I love python.
```

```shell
Name: koorye3, age: 21, description: I love c.
Name: koorye3, age: 21, description: I love c.
Name: koorye2, age: 20, description: I love java.
Name: koorye2, age: 20, description: I love java.
Name: koorye1, age: 19, description: I love python.
Name: koorye1, age: 19, description: I love python.
```

```shell
Name: koorye1, age: 19, description: I love python.
Name: koorye2, age: 20, description: I love java.

```

# 使用 @Query

@Query 注解使得我们可以使用 JSON 编写条件：

```java
  @Query("{\"match\": {\"desc\": \"love\"}}")
  List<User> searchUserByQuery();
```

测试：

```java
  @Test
  public void testSearchUserByQuery() {
    List<User> userList = elasticsearchService.searchUserByQuery();
    for (User user : userList) {
      System.out.println(user);
    }
  }
```

返回结果：

```java
Name: koorye1, age: 19, description: I love python.
Name: koorye2, age: 20, description: I love java.
Name: koorye3, age: 21, description: I love c.
Name: koorye1, age: 19, description: I love python.
Name: koorye2, age: 20, description: I love java.
Name: koorye3, age: 21, description: I love c.
```

# 使用 NativeQuery

相当于原生的查询，我们可以指定很多复杂条件，如过滤、分页、排序、高亮等：

```java
  @Test
  public void testSearchUserByNativeQuery() {
    NativeSearchQuery nativeSearchQuery = new NativeSearchQueryBuilder().withFields("name", "age")
        .withQuery(QueryBuilders.matchQuery("desc", "love"))
        .withPageable(PageRequest.of(0, 3))
        .withSort(SortBuilders.fieldSort("age").order(SortOrder.DESC))
        .withHighlightFields(new HighlightBuilder.Field("desc"))
        .build();

    List<User> userList = elasticsearchRestTemplate.queryForList(nativeSearchQuery, User.class, IndexCoordinates.of("user"));

    for (User user : userList) {
      System.out.println(user);
    }
  }
```

返回结果：

```shell
Name: koorye3, age: 21, description: null.
Name: koorye3, age: 21, description: null.
Name: koorye2, age: 20, description: null.
```

最新版本中 NativeQuery 已被弃用？