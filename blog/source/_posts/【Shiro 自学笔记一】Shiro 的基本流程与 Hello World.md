---
title: 【Shiro 自学笔记一】Shiro 的基本流程与 Hello World
date: 2020-07-24 03:30:03
tags: [后端,安全,Shiro]
categories: 后端
description: Shiro是一个强大且易用的Java安全框架,执行身份验证、授权、密码和会话管理。使用Shiro的易于理解的API,您可以快速、轻松地获得任何应用程序,从最小的移动应用程序到最大的网络和企业应用程序。
---

> Apache Shiro是一个强大且易用的Java安全框架,执行身份验证、授权、密码和会话管理。使用Shiro的易于理解的API,您可以快速、轻松地获得任何应用程序,从最小的移动应用程序到最大的网络和企业应用程序。
>
> ——  摘自百度百科

# 什么是 Shiro

![](https://i-blog.csdnimg.cn/blog_migrate/197653faacf70ee2afa5dcb60dd7597e.png)

Shiro 是 Apache 公司开发的一款安全框架。它支持 Java、C / C++、C#、Python、PHP 等语言，同时支持单机项目使用和网络项目使用。

## Shiro 核心组件

Shiro 有 Subject、SecurityManager、Realms 三大核心组件。

### Subject

代表当前用户的安全操作，比如，我们可以使用 Subject 进行登录和退出登录。

### SecurityManager

它是 Shiro 的核心，管理所有用户的安全操作。

### Realms

充当了 Shiro 与应用安全数据间的“桥梁”或者“连接器”，存储用户和权限信息。Realm 的种类有很多，如 IniRealm 从 ini 配置文件中读取用户信息，JdbcRealm 从数据库中读取用户信息，我们还可以自定义 Realm 来编写登录和认证规则。

# Hello World

## 配置

### pom.xml

导入 Shiro 核心包、Slf4j、Log4j 和 JUnit 单元测试：

```xml
    <!-- Shiro -->
    <dependency>
      <groupId>org.apache.shiro</groupId>
      <artifactId>shiro-core</artifactId>
      <version>1.5.3</version>
    </dependency>

    <!-- Slf4j -->
    <dependency>
      <groupId>org.jboss.forge.addon</groupId>
      <artifactId>slf4j</artifactId>
      <version>1.7.13</version>
    </dependency>

    <!-- Log4j -->
    <dependency>
      <groupId>log4j</groupId>
      <artifactId>log4j</artifactId>
      <version>1.2.17</version>
    </dependency>

    <!-- Junit -->
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.13</version>
      <scope>test</scope>
    </dependency>
```

### Shiro 配置文件

在 resource 文件夹中创建一个名为 shiro.ini 的配置文件，文件名随意。

我们可以在配置文件中写入用户的基本信息，所有用户写在`[users]`标签下，等号左边表示账号、右边表示密码：

```ini
[users]
koorye = 123456
```

## Main 方法

Shiro 的基本流程分为步：

- 新建一个 SecurityManager 安全管理类，这个类是 Shiro 一切操作的核心
- 为 manager 设置 Realm，此处我们使用 IniRealm
- 使用 SecurityUtils 全局工具类，指定安全管理类
- 使用 SecurityUtils 得到一个 Subject
- 设置一个 Token，可以包含用户名、密码等信息
- 使用 Subject 登录

注意登录是会抛出异常：

- UnknownAccountException  用户名不存在
- AuthenticationException  用户名存在，认证失败

```java
package org.koorye;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.mgt.DefaultSecurityManager;
import org.apache.shiro.realm.text.IniRealm;
import org.apache.shiro.subject.Subject;

public class HelloShiro {
  public static void main(String[] args) {
    DefaultSecurityManager manager = new DefaultSecurityManager();
    manager.setRealm(new IniRealm("classpath:shiro.ini"));
    SecurityUtils.setSecurityManager(manager);

    Subject subject = SecurityUtils.getSubject();

    UsernamePasswordToken token = new UsernamePasswordToken("koorye", "123456");
    try {
      subject.login(token);
      System.out.println("登录成功");
    } catch (UnknownAccountException e) {
      e.printStackTrace();
      System.out.println("用户名不存在");
    } catch (AuthenticationException e) {
      e.printStackTrace();
      System.out.println("密码错误");
    } 
  }
}
```

运行：

```shell
登录成功

Process finished with exit code 0
```

如果用户名存在，密码错误：

```java
UsernamePasswordToken token = new UsernamePasswordToken("koorye", "12345678");
```

运行：

```shell
org.apache.shiro.authc.IncorrectCredentialsException: Submitted credentials for token [org.apache.shiro.authc.UsernamePasswordToken - koorye, rememberMe=false] did not match the expected credentials.
	at org.apache.shiro.realm.AuthenticatingRealm.assertCredentialsMatch(AuthenticatingRealm.java:603)
	at org.apache.shiro.realm.AuthenticatingRealm.getAuthenticationInfo(AuthenticatingRealm.java:581)
	at org.apache.shiro.authc.pam.ModularRealmAuthenticator.doSingleRealmAuthentication(ModularRealmAuthenticator.java:180)
	at org.apache.shiro.authc.pam.ModularRealmAuthenticator.doAuthenticate(ModularRealmAuthenticator.java:273)
	at org.apache.shiro.authc.AbstractAuthenticator.authenticate(AbstractAuthenticator.java:198)
	at org.apache.shiro.mgt.AuthenticatingSecurityManager.authenticate(AuthenticatingSecurityManager.java:106)
	at org.apache.shiro.mgt.DefaultSecurityManager.login(DefaultSecurityManager.java:275)
	at org.apache.shiro.subject.support.DelegatingSubject.login(DelegatingSubject.java:260)
	at org.koorye.HelloShiro.main(HelloShiro.java:21)
密码错误

Process finished with exit code 0
```

如果用户名不存在：

```java
UsernamePasswordToken token = new UsernamePasswordToken("kkkoorye", "12345678");
```

运行：

```shell
org.apache.shiro.authc.UnknownAccountException: Realm [org.apache.shiro.realm.text.IniRealm@3b95a09c] was unable to find account data for the submitted AuthenticationToken [org.apache.shiro.authc.UsernamePasswordToken - kkkoorye, rememberMe=false].
	at org.apache.shiro.authc.pam.ModularRealmAuthenticator.doSingleRealmAuthentication(ModularRealmAuthenticator.java:184)
	at org.apache.shiro.authc.pam.ModularRealmAuthenticator.doAuthenticate(ModularRealmAuthenticator.java:273)
	at org.apache.shiro.authc.AbstractAuthenticator.authenticate(AbstractAuthenticator.java:198)
	at org.apache.shiro.mgt.AuthenticatingSecurityManager.authenticate(AuthenticatingSecurityManager.java:106)
	at org.apache.shiro.mgt.DefaultSecurityManager.login(DefaultSecurityManager.java:275)
	at org.apache.shiro.subject.support.DelegatingSubject.login(DelegatingSubject.java:260)
	at org.koorye.HelloShiro.main(HelloShiro.java:21)
用户名不存在

Process finished with exit code 0
```

