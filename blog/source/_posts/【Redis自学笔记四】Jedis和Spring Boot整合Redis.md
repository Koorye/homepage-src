---
title: 【Redis自学笔记四】Jedis和Spring Boot整合Redis
date: 2020-07-21 00:17:13
tags: [数据库,Redis,Spring Boot]
categories: 数据库
description: Jedis是官方推荐的Redis Java连接开发工具。这一期我们来了解Jedis和Spring Boot如何整合Redis。
---

Jedis是官方推荐的Redis Java连接开发工具。这一期我们来了解Jedis和Spring Boot如何整合Redis。

# Jedis

我们从创建Maven项目开始。

## 导入依赖

```xml
    <dependency>
      <groupId>redis.clients</groupId>
      <artifactId>jedis</artifactId>
      <version>3.3.0</version>
    </dependency>

    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.13</version>
      <scope>test</scope>
    </dependency>
```

## 配置Redis

打开配置文件：

```shell
vim /etc/redis/redis.conf
```

找到`bind 127.0.0.1::1`，将其注释。

找到`protect-mode yes`，将其设置为no.

## 测试连接

```java
package org.koorye.test;

import org.junit.Test;
import redis.clients.jedis.Jedis;

public class TestJedis {
  @Test
  public void TestSet() {
    Jedis jedis = new Jedis("127.0.0.1", 6379);
    System.out.println(jedis.ping());
  }
}
```

运行：

```shell
PONG

Process finished with exit code 0
```

PONG，连接成功。

记录一下今天碰到的问题，如果你和我一样用WSL2 + 原生Docker + Redis镜像启动，你将会发现除了在WSL内，其他终端无法连接到Redis。

这是由于WSL2对原生Docker的守护线程支持还不完善(虽然已经比WSL1好了很多)。

如果要在WSL中使用Docker，可以使用Docker for Windows装载WSL支持。

## 使用

Jedis的使用非常简单，其方法名和参数都与命令行的指令几乎相同，例：

```java
  @Test
  public void TestSet() {
    Jedis jedis = new Jedis("127.0.0.1", 6379);
    // 设置字符串
    jedis.set("str", "hello world");

    // 设置列表
    jedis.rpush("li", "one", "two", "three");

    // 设置集合
    jedis.sadd("set", "hello", "world", "bye");

    // 设置哈希
    jedis.hset("user", "name", "koorye");
    jedis.hset("user", "age", "19");
    jedis.hset("user", "sex", "male");
  }
```

```java
  @Test
  public void TestGet() {
    Jedis jedis = new Jedis("127.0.0.1", 6379);
    // 取得字符串
    System.out.println(jedis.get("str"));

    // 取得列表
    List<String> li = jedis.lrange("li", 0, -1);
    for (String str : li) {
      System.out.println(str);
    }
      
    // 取得集合
    Set<String> set = jedis.smembers("set");
    for (String str : set) {
      System.out.println(str);
    }

    // 取得哈希
    Map<String, String> user = jedis.hgetAll("user");
    for (Map.Entry<String, String> entry : user.entrySet()) {
      System.out.println(entry.getKey() + " " + entry.getValue());
    }
  }
```

运行：

```shell
hello world
one
two
three
world
hello
bye
name koorye
age 19
sex male

Process finished with exit code 0
```



# Spring Boot

Spring Boot的整合同样非常简单。

使用Idea的快速构建导包：

- Web支持
- Spring Data Redis
- Lombok

```xml
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <optional>true</optional>
    </dependency>
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
    <dependency>
      <groupId>io.projectreactor</groupId>
      <artifactId>reactor-test</artifactId>
      <scope>test</scope>
    </dependency>
```

值得一提的是，旧版本的Spring Data Redis的底层基于Jedis实现，Jedis采用直连，多线程操作是不安全的，要想避免不安全就要使用Jedis连接池。

而在Spring Boot 2.x版本之后，Spring Data Redis的底层替换为lettuce，不存在线程不安全的情况。

**因此编写配置文件时不要使用spring.redis.jedis.xxx，这将不会生效。**

接下来编写配置文件，显式指定一下IP和端口，事实上这也是默认配置可以不写：

```properties
spring.application.name=springboot-redis
spring.redis.host=localhost
spring.redis.port=6379
```

接下来只要自动注入`RedisTemplate`对象，就可以使用各种方法。

Spring Boot对方法进行了封装，不同数据类型的CRUD方法封装在`opsForxxx`下：

- opsForValue  字符串类型
- opsForList  列表类型
- opsForSet  集合类型
- opsForHash  哈希类型
- opsForZSet  有序集合类型
- ...

数据库的操作方法则要通过`redisTemplate.getConnectionFactory().getConnection()`返回连接再调用。

同时可以通过`RedisTemplate`获取事务。

`RedisTemplate`实现事务有两种方式：

- 使用`redisTemplate.setEnableTransactionSupport(true)`开启事务支持，然后使用`multi`和`exec`
- 使用`@Transcational`注解

第二种更常用，此处笔者演示一下第一种。

例：

```java
@SpringBootTest
public class TestRedis {
  @Autowired
  private RedisTemplate redisTemplate;

  @Test
  public void testSetHash() {
    RedisConnection connection = redisTemplate.getConnectionFactory().getConnection();
    connection.flushAll();
    redisTemplate.multi();
    redisTemplate.opsForHash().put("user", "name", "koorye");
    redisTemplate.opsForHash().put("user", "age", 19);
    redisTemplate.opsForHash().put("user", "sex", "male");
    redisTemplate.exec();
  }
}
```

我们来看看存进去的key能不能取用：

```java
  @Test
  public void testGetHash(){
    String str = (String)redisTemplate.opsForHash().get("user", "name");
    System.out.println(str);
  }
```

运行：

```shell
koorye

Process finished with exit code 0
```

然而，如果在数据库里查看呢：

```shell
127.0.0.1:6379> hgetall user
(empty list or set)  # 找不到user
127.0.0.1:6379> keys *
1) "\xac\xed\x00\x05t\x00\x04user"
```

**user被转义成了奇怪的字符串。**这是由于数据默认进行了JDK序列化，要解决这个问题，我们需要对不同的数据进行不同的序列化。

## 自定义序列化

我们可以设定键采用字符串序列化，值采用JSON序列化以保证较好的可读性。

要使用JSON序列化，笔者选用fastjson包，引入依赖：

```xml
    <dependency>
      <groupId>com.alibaba</groupId>
      <artifactId>fastjson</artifactId>
      <version>1.2.68</version>
    </dependency>
```

键采用字符串序列化，值采用JSON序列化：

```java
package org.koorye.config;

import com.alibaba.fastjson.support.spring.FastJsonRedisSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;


@Configuration
public class RedisConfig {
  @Bean
  public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
    RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
    redisTemplate.setConnectionFactory(redisConnectionFactory);

    redisTemplate.setKeySerializer(new StringRedisSerializer());
    redisTemplate.setHashKeySerializer(new StringRedisSerializer());
    redisTemplate.setHashValueSerializer(new FastJsonRedisSerializer<>(Object.class));
    redisTemplate.setValueSerializer(new FastJsonRedisSerializer<>(Object.class));

    return redisTemplate;
  }

```

重新运行代码，再次查看数据库：

```shell
127.0.0.1:6379> keys *
1) "user"
127.0.0.1:6379> hgetall user
1) "name"
2) "\"koorye\""
3) "age"
4) "19"
5) "sex"
6) "\"male\""
```

名称显示正常。