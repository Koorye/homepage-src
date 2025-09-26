---
title: 【RabbitMQ自学笔记三】Spring Boot整合RabbitMQ
date: 2020-07-19 16:33:16
tags: [后端,RabbitMQ,Spring Boot]
categories: 后端
description: 本文将使用Spring Boot完成上一期RabbitMQ5种模型的整合。
---

本文将使用Spring Boot完成上一期RabbitMQ5种模型的整合。

# 配置RabbitMQ

使用Idea快速构建一个Spring Boot项目，选择Web和Spring for RabbitMQ依赖：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/ca8aa2bff42318c1ca01a056f4d3e5f1.png)


接下来配置application.properties，当然你也可以选择application.yml，配置基本的RabbitMQ信息：

```properties
spring.application.name=rabbit-springboot
server.port=8080
spring.rabbitmq.host=localhost
spring.rabbitmq.port=5672
spring.rabbitmq.username=admin
spring.rabbitmq.password=admin
spring.rabbitmq.virtual-host=/demo
```

# 整合5种模型

Spring Boot为我们使用RabbitMQ封装好了RabbitTemplate对象，我们只需要借助这个对象，搭配注解，就可以实现各种操作。

## Hello World模型

### Publisher

Spring Boot整合RabbitMQ非常简单，只需要调用自动注入rabbitTemplate的convertAndSend方法即可。

我们来看一下convertAndSend(转换并发送)的几种重载：

- `convertAndSend(String routingKey, Object object)`  提供路由键和消息体，相当于`basicPublish("",String routingKey, byte[] body)`
- `convertAndSend(String exchange, String routingKey, Object object)`  提供交换机、路由键和消息体，相当于`basicPublish(String exchange, String routingKey, byte[] body)`

这两种重载已经足够我们完成5种模型。

*hello world模型，不提供交换机名字，即使用默认交换机，在使用默认交换机时，路由键即队列名。*

```java
package org.koorye.test;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.koorye.RabbitSpringbootApplication;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@SpringBootTest(classes = RabbitSpringbootApplication.class)
@RunWith(SpringRunner.class)
public class TestRabbit {
  @Autowired
  private RabbitTemplate rabbitTemplate;

  @Test
  public void sendMsg() {
    rabbitTemplate.convertAndSend("hello world", "Hello world!");
  }
}
```

### Consumer

使用`@Component`注解标注组件。

使用`@RabbitListener`注解标注接收者，里面的queuesToDeclare声明队列。

使用`@Queue`声明一个队列。

`@Queue`包含之前声明队列的5个属性：

- value  队列名
- durable  是否持久化，默认true
- exclusive  是否独占，默认false
- autoDelete  是否自动删除，默认false
- arguments  额外参数，默认空

此时我们只声明队列名，其他默认。

除此之外，还有一种注解方法，可以把`@RabbitListener`注解到类上，接收消息的方法体则注解`@RabbitHandler`，可以达到一样的效果。

```java
package org.koorye.component;

import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class TestRabbit {
  @RabbitListener(queuesToDeclare = @Queue(value = "hello world"))
  public void getMsg(String msg) {
    System.out.println("[ INFO ] Get message: " + msg);
  }
}
```

运行：

```shell
...
2020-07-19 15:55:38.729  INFO 13484 --- [           main] org.koorye.test.TestRabbit               : Started TestRabbit in 6.182 seconds (JVM running for 7.474)
[ INFO ] Get message: Hello world!
2020-07-19 15:55:39.166  INFO 13484 --- [extShutdownHook] o.s.a.r.l.SimpleMessageListenerContainer : Waiting for workers to finish.
...

Process finished with exit code 0
```

成功收到消息。

## Work工作模型

基于hello world模型，实现work模型非常简单，只需要再编写一个Listener方法体即可：

```java
@Component
public class TestRabbit {
  @RabbitListener(queuesToDeclare = @Queue(value = "hello world"))
  public void consumer1(String msg) {
    System.out.println("[ INFO ] Consumer1 get message: " + msg);
  }

  @RabbitListener(queuesToDeclare = @Queue(value = "hello world"))
  public void consumer2(String msg) {
    System.out.println("[ INFO ] Consumer2 get message: " + msg);
  }
}
```

这次我们循环发送10条消息：

```java
  @Test
  public void sendMsg() {
    for (int i = 0; i < 10; ++i)
      rabbitTemplate.convertAndSend("hello world", "Hello world!");
  }
```

运行：

```shell
[ INFO ] Consumer1 get message: Hello world!
[ INFO ] Consumer2 get message: Hello world!
[ INFO ] Consumer2 get message: Hello world!
[ INFO ] Consumer1 get message: Hello world!
[ INFO ] Consumer2 get message: Hello world!
[ INFO ] Consumer2 get message: Hello world!
[ INFO ] Consumer1 get message: Hello world!
[ INFO ] Consumer2 get message: Hello world!
[ INFO ] Consumer1 get message: Hello world!
[ INFO ] Consumer1 get message: Hello world!
...

Process finished with exit code 0
```

## 发布 / 订阅模型

### Publisher

使用convertAndSend的第二种重载，不指定路由键：

```java
  @Test
  public void sendMsg() {
    for (int i = 0; i < 10; ++i)
      rabbitTemplate.convertAndSend("logs","", "Hello world!");
  }
```

### Consumer

使用`@QueueBingding`绑定队列和交换机。

使用`@Queue`(后不跟内容)来声明一个临时队列，测试完成即删除

使用`@Exchange`声明一个交换机，value指定名字，type指定类型为fanout

```java
  @RabbitListener(bindings = {
      @QueueBinding(
          value = @Queue,
          exchange = @Exchange(value = "logs", type = "fanout")
      )})
  public void consumer1(String msg) {
    System.out.println("[ INFO ] Consumer1 get message: " + msg);
  }

  @RabbitListener(bindings = {
      @QueueBinding(
          value = @Queue,
          exchange = @Exchange(value = "logs", type = "fanout")
      )})
  public void consumer2(String msg) {
    System.out.println("[ INFO ] Consumer2 get message: " + msg);
  }
```

运行：

```shell
[ INFO ] Consumer1 get message: Hello world!
[ INFO ] Consumer2 get message: Hello world!
[ INFO ] Consumer1 get message: Hello world!
[ INFO ] Consumer2 get message: Hello world!
[ INFO ] Consumer1 get message: Hello world!
[ INFO ] Consumer2 get message: Hello world!
[ INFO ] Consumer1 get message: Hello world!
[ INFO ] Consumer2 get message: Hello world!
[ INFO ] Consumer1 get message: Hello world!
[ INFO ] Consumer1 get message: Hello world!
[ INFO ] Consumer2 get message: Hello world!
[ INFO ] Consumer1 get message: Hello world!
[ INFO ] Consumer2 get message: Hello world!
[ INFO ] Consumer1 get message: Hello world!
[ INFO ] Consumer2 get message: Hello world!
[ INFO ] Consumer1 get message: Hello world!
[ INFO ] Consumer2 get message: Hello world!
[ INFO ] Consumer1 get message: Hello world!
[ INFO ] Consumer2 get message: Hello world!
[ INFO ] Consumer2 get message: Hello world!

Process finished with exit code 0
```

测试成功。

## 路由(直连)模型

### Publisher

在发布订阅模型的基础上，发送时指定路由键即可。

```java
  @Test
  public void sendMsg() {
    rabbitTemplate.convertAndSend("logs", "info", "This is an info.");
    rabbitTemplate.convertAndSend("logs", "err", "This is an err.");
  }
```

### Consumer

在`@QueueBinding`的key中指定路由键，以花括号包围字符串。

```java
  @RabbitListener(bindings = {
      @QueueBinding(
          value = @Queue,
          exchange = @Exchange(value = "logs", type = "direct"),
          key = {"info"}
      )})
  public void consumer1(String msg) {
    System.out.println("[ INFO ] Consumer1 get message: " + msg);
  }

  @RabbitListener(bindings = {
      @QueueBinding(
          value = @Queue,
          exchange = @Exchange(value = "logs", type = "direct"),
          key = {"info", "err"}
      )})
  public void consumer2(String msg) {
    System.out.println("[ INFO ] Consumer2 get message: " + msg);
  }
```

运行，**记得先删除之前的交换机**：

```shell
[ INFO ] Consumer2 get message: This is an info.
[ INFO ] Consumer1 get message: This is an info.
[ INFO ] Consumer2 get message: This is an err.
...

Process finished with exit code 0
```

测试成功。

## 主题(通配符)模式

### Publisher

```java
  @Test
  public void sendMsg() {
    rabbitTemplate.convertAndSend("logs", "info", "This is an info.");
    rabbitTemplate.convertAndSend("logs", "err", "This is an err.");
    rabbitTemplate.convertAndSend("logs", "info.err", "This is an info and err.");
  }
```

### Consumer

在直连模式的基础上，修改type和key即可：

```java
  @RabbitListener(bindings = {
      @QueueBinding(
          value = @Queue,
          exchange = @Exchange(value = "logs", type = "topic"),
          key = {"#.info.#"}
      )})
  public void consumer1(String msg) {
    System.out.println("[ INFO ] Consumer1 get message: " + msg);
  }

  @RabbitListener(bindings = {
      @QueueBinding(
          value = @Queue,
          exchange = @Exchange(value = "logs", type = "topic"),
          key = {"#.err.#"}
      )})
  public void consumer2(String msg) {
    System.out.println("[ INFO ] Consumer2 get message: " + msg);
  }

  @RabbitListener(bindings = {
      @QueueBinding(
          value = @Queue,
          exchange = @Exchange(value = "logs", type = "topic"),
          key = {"info.#.err.#"}
      )})
  public void consumer3(String msg) {
    System.out.println("[ INFO ] Consumer3 get message: " + msg);
  }
```

运行：

```shell
[ INFO ] Consumer3 get message: This is an info and err.
[ INFO ] Consumer1 get message: This is an info.
[ INFO ] Consumer2 get message: This is an err.
[ INFO ] Consumer1 get message: This is an info and err.
[ INFO ] Consumer2 get message: This is an info and err.
...

Process finished with exit code 0
```

测试成功。