---
title: 【Spring Boot自学笔记一】项目搭建+Hello World+主页配置
date: 2020-05-05 00:11:29
tags: [后端,Spring Boot]
categories: 后端
description: 本文介绍了Spring Boot的基本概念和项目创建，以及如何实现一个简单的Hello World和设置默认主页。
---

# 关于Spring Boot
Spring Boot是由Pivotal团队提供的全新框架，其设计目的是用来简化新Spring应用的初始搭建以及开发过程。该框架使用了特定的方式来进行配置，从而使开发人员不再需要定义样板化的配置。

# 创建Spring Boot
比起创建一个SSM框架的项目，Spring Boot项目的创建极其简单，我们不必再配置大量的xml文件，Spring Boot已经使用大量的自动配置类帮我们解决了这个问题。若要修改部分配置信息，我们只需要在properties文件中添加即可。

笔者将演示使用intellij idea创建一个spring boot项目的全过程，**比起一个ssm项目，他将非常简单**：

1. 新建一个项目，选择Spring Initializr：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/fca352a8908955cdfe603d376ac2fa18.png)
2. 为自己的项目命名，并选择项目类型（Maven/Gradle），打包方式（jar/war）和java版本，笔者使用Maven创建项目：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/b34cf3fdfa4273d5e2d107efcdb21c57.png)
3. 根据勾选自己需要的包，笔者这里只选择Spring Web以实现一个简单的Web项目：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2289b302e685e434487cc1d37b1bc32e.png)
4. 指定项目名和路径，**Finish！**
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/35eb0a63d22e3a4b6a8449e8bce8f407.png)
创建完后，删除没用的文件，目录如下所示，项目就创建完成了。什么，你说配置Tomcat？除了不需要写xml，**Spring Boot不需要我们自己配置Tomcat，它已经帮我们内置了！**
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/5ba67c3fd7eb9676caf39189bf5f5b12.png)
# Hello World！
新建一个controller包，在包里创建一个控制器。

再次注意，spring boot鼓励使用**全注解**来代替xml：

- `@RestController`指定这个类是一个控制器，而Rest会把控制器返回的内容转换成json
- `@RequestMapping`指定请求的链接，我们还可以用其中的method参数指定请求类型(post/get/put/delete)，不过有一个更符合规范的方法是使用`@PostMapping`/`@GetMapping`...来指定请求类型
```java
package com.koorye.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
  @RequestMapping("/hello")
  public String index() {
    return "hello world";
  }
}
```
接下来，让我们启动项目：
Spring Boot内置Tomcat的默认端口号是8080：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/f0c1d017b55fc600efdc06595123e6f0.png)
嗯？怎么是404？不要着急，在url后加上/hello：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/ee328cd029a820644d2cc66e178011e1.png)
这样就得到控制器返回的字符串啦！

# 设置默认主页
这种方法可以得到想要的内容，可是开头的404怎么解决呢？

## 方法一 控制器
### 前期准备
在templates中新建一个index.html，内容随意：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/8b435e147d2c38790200d78c8e38eec4.png)

### 引入thymeleaf包
**一定一定要引入thymeleaf（或者其他模板引擎）！** 否则spring boot将不会寻找templates目录中的文件：
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```
### 实现控制器
注意这里与前面不同，**是`@Controller`而不是`@RestController`！** 原因是RestController会把返回数据转换成json，就无法正常解析链接了。

**spring boot会自动给index加上前缀templates/和后缀.html** ，最后完整路径就是templates/index.html.

还有一点需要注意，**spring boot会自动在templates文件夹中寻找名为index.html的文件作为首页** ，所以即使@RequestMapping中设定为任意路径，打开后也会直接跳转到index.html.

```java
package com.koorye.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HelloController {
  //即使设置成@RequestMapping("/aaabbbccc")也可以找到主页
  @RequestMapping("/index")
  public String toIndex() {
    return "index";
  }
}

```
## 方法二 配置类
然而，使用控制器跳转页面十分不灵活，我们在这里有更好的办法——配置类。

我们删去原先的Controller类，新建一个config包，新建一个MVCConfig类，输入以下内容。

如之前所说，spring boot会自动给网页名添加前后缀，这里的index会被修改为templates/index.html.

这样，无论是直接访问localhost:8080还是localhost:8080/index，我们都可以找到主页啦。
```java
package com.koorye.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MVCConfig implements WebMvcConfigurer {
  @Override
  public void addViewControllers(ViewControllerRegistry registry) {
    registry.addViewController("/").setViewName("index");
    registry.addViewController("/index").setViewName("index");
  }
}
```

最后附上完整路径：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/200c17d464cc4d34b14172a1ba3fc311.png)
