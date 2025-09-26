---
title: 【Shiro 自学笔记四】Spring Boot 整合 Shiro
date: 2020-07-24 03:32:43
tags: [后端,安全,Shiro,SpringBoot]
categories: 后端
description: 本文介绍了如何在 Spring Boot 环境下使用 Shiro。
---

这一期我们将使用 Spring Boot 整合 Shiro 并实现登录验证和授权认证功能。

# 导入依赖

使用 Idea 快速构建项目，选择：

- Spring Develop Tools
- Lombok
- Spring Web
- Spring Data JPA  (笔者使用 Spring Data JPA 整合数据库，你也可以使用 MyBatis 等框架)
- MySQL Connector for Java  (MySQL 驱动)
- Druid (笔者选用 Druid 连接池)

最后我们还需要手动导入 Shiro 依赖。

依赖：

```xml
    <!-- Shiro -->
    <dependency>
      <groupId>org.apache.shiro</groupId>
      <artifactId>shiro-spring-boot-starter</artifactId>
      <version>1.5.3</version>
    </dependency>

    <!-- Spring Data JPA -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- Druid -->
    <dependency>
      <groupId>com.alibaba</groupId>
      <artifactId>druid</artifactId>
      <version>1.1.21</version>
    </dependency>

    <!-- MySQL Driver -->
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
    </dependency>
    
    <!-- Spring Boot Web -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Spring Boot Development Tools -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-devtools</artifactId>
      <scope>runtime</scope>
      <optional>true</optional>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <optional>true</optional>
    </dependency>
    
    <!-- Spring Boot Test -->
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

# 自定义 Realm

先简单实现一个返回 null 的 Realm：

```java
package org.koorye.realms;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;

public class UserRealm extends AuthorizingRealm {

  @Override
  protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
    return null;
  }

  @Override
  protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
    return null;
  }
}
```

# 编写基本配置

```properties
server.port=8080
spring.application.name=springboot-shiro
spring.datasource.url=jdbc:mysql://localhost:3306/demo?serverTimezone=UTC
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
```

# 编写配置类

Shiro 为集成 Web 提供了一个类：ShiroFilterFactoryBean，通过这个类我们可以配置过滤和拦截信息。

Spring Boot 整合 Shiro 分为 3 步：

- 建立一个 Realm 的 Bean
- 建立一个 WebSecurityManager 的 Bean，包含 Realm
- 建立一个 ShiroFilterFactoryBean，包含 WebSecurityManager

整合完成之后，我们就可以在 ShiroFilterFactoryBean 中添加过滤器配置，和在 Realm 中编写规则。

```java
package org.koorye.config;

import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.koorye.realms.UserRealm;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ShiroConfig {
  @Bean(name = "userRealm")
  public UserRealm userRealm() {
    return new UserRealm();
  }

  @Bean(name = "webSecurityManager")
  public DefaultWebSecurityManager defaultWebSecurityManager(UserRealm userRealm) {
    DefaultWebSecurityManager defaultWebSecurityManager = new DefaultWebSecurityManager();
    defaultWebSecurityManager.setRealm(userRealm);
    return defaultWebSecurityManager;
  }

  @Bean
  public ShiroFilterFactoryBean shiroFilterFactoryBean(DefaultWebSecurityManager webSecurityManager) {
    ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
    shiroFilterFactoryBean.setSecurityManager(webSecurityManager);
    return shiroFilterFactoryBean;
  }
}
```

# 配置过滤规则

ShiroFilterFactoryBean 可以通过 setFilterChainDefinitionMap 方法设立拦截规则。

这个方法需要传入一个 map，map 的 Key 代表 URL，map 的 Value 代表过滤器权限。

过滤器的种类有：

- anon  表示可以匿名使用

- authc  表示需要认证(登录)才能使用

- roles["admin","guest"]  拥有所有角色才通过，相当于 hasAllRoles() 方法

- perms["user","question"]  拥有所有资源才通过，相当于 isPermitedAll() 方法

- rest[user:method]  其中 method 为 post，get，delete 等

- port[8080]  请求对应端口才通过

- authcBasic  表示 httpBasic 认证

- ssl  表示安全的 URL 请求，协议为 HTTPS

- user  表示必须存在用户，当登入操作时不做检查

我们这里配置两个 URL：

- 所有用户都可以访问 /api/guest
- 登录后的用户才可以访问 /api/admin

```java
  @Bean
  public ShiroFilterFactoryBean shiroFilterFactoryBean(DefaultWebSecurityManager webSecurityManager) {
    ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
    shiroFilterFactoryBean.setSecurityManager(webSecurityManager);

    Map<String, String> map = new HashMap<>();
    map.put("/api/guest","anon");
    map.put("/api/admin","authc");
    shiroFilterFactoryBean.setFilterChainDefinitionMap(map);

    return shiroFilterFactoryBean;
```

我们来写两个控制器测试一下：

```java
package org.koorye.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
  @GetMapping("/api/guest")
  public String guest() {
    return "You are a guest.";
  }

  @GetMapping("/api/admin")
  public String admin() {
    return "You are an admin.";
  }
}
```

访问 /api/guest：

![image-20200724014019018](https://i-blog.csdnimg.cn/blog_migrate/9f84868ab16c2248fa307c2ca953afcf.png)

**访问成功！**

访问 /api/admin:

![image-20200724014049234](https://i-blog.csdnimg.cn/blog_migrate/29fc5ccab70144f3864bb69595b23335.png)

**访问失败！**

为什么访问失败报的是 404 错误？

我们注意到访问失败后，Shiro 自动帮我们重定向到了 login.jsp 页面，我们并没有这个页面，故而返回 404.

# 编写 Realm

```java
  @Override
  protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
    if ("koorye".equals(authenticationToken.getPrincipal())) {
      return new SimpleAuthenticationInfo(
          authenticationToken.getPrincipal(),
          ByteSource.Util.bytes("123456"),
          this.getName());
    } else {
      return null;
    }
  }
```

暂时先用假数据代替，之后再使用数据库：模拟用户名 koorye，模拟密码 123456.

暂时先使用明文。

# 实现登录

要实现登录，我们需要一个控制器：

```java
  @RequestMapping("/api/login")
  public String login(String username, String password) {
    Subject subject = SecurityUtils.getSubject();
    UsernamePasswordToken token = new UsernamePasswordToken(username, password);
    subject.login(token);

    if (subject.isAuthenticated()) {
      return "Login Success!";
    } else {
      return "Login Failed!";
    }
  }
```

由于是前后端分离的架构，而我们并没有前端，无法实现 POST 请求，因此暂时使用 GET 代替。

我们先访问页面：[http://localhost:8080/api/login?username=koorye&password=123456](http://localhost:8080/api/login?username=koorye&password=123456).

从而模拟输入用户名和密码。

登录成功：

![image-20200724015559653](https://i-blog.csdnimg.cn/blog_migrate/40b9343c5bb97a6be350ed4798dd8726.png)

此时我们再访问 /api/admin:

![image-20200724015651766](https://i-blog.csdnimg.cn/blog_migrate/93b1006f4801e1c514bfbe410164ec16.png)

**访问成功！**
