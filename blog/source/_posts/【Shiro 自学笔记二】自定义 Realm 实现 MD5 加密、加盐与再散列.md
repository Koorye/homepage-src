---
title: 【Shiro 自学笔记二】自定义 Realm 实现 MD5 加密、加盐与再散列
date: 2020-07-24 03:30:41
tags: [后端,安全,Shiro]
categories: 后端
description: MD5 是一种常用的加密算法，本文将介绍如何使用 Shiro 实现 MD5 加密、加盐和再散列。
---

上一期我们完成了基本的登录操作，然而，直接通过明文密码登录显然是非常不安全的。因此，我们必须对密码进行加密以加强信息的安全性。

# 什么是MD5

> MD5信息摘要算法（英语：MD5 Message-Digest Algorithm），一种被广泛使用的密码散列函数，可以产生出一个128位（16字节）的散列值（hash value），用于确保信息传输完整一致。MD5由美国密码学家罗纳德·李维斯特（Ronald Linn Rivest）设计，于1992年公开，用以取代MD4算法。这套算法的程序在 RFC 1321 标准中被加以规范。1996年后该算法被证实存在弱点，可以被加以破解，对于需要高度安全性的数据，专家一般建议改用其他算法，如SHA-2。2004年，证实MD5算法无法防止碰撞（collision），因此不适用于安全性认证，如SSL公开密钥认证或是数字签名等用途。
>
> ——  摘自百度百科

MD5 具有以下特点：

- 不可逆  我们无法通过生成的 MD5 逆推得到原来的数据串
- 一致性  固定的数据串经过固定的算法得到的 MD5 也是固定的

根据以上特点，我们就可以使用 MD5 实现密码的加密和安全登录。

## 加盐

> “加盐”即为计算机密码加密中常用的"add salt"，一般用于在原密码后面追加一些无关字符后在进行不可逆加密（例如MD5）以便增强安全性

现在有很多 MD5 在线解密的网站，它们其实是使用穷举算法，根据原字符串生成的 MD5 逐个比对，从而通过MD5 得到原先的数据串。

因此我们有必要在加密前，先对数据串做一些修改。例如，在数据串的结尾增加一串新内容，这便是加盐。

原串："123456"

盐："Koorye_Love_MD5"

加盐后的串："123456Koorye_Love_MD5"

我们对加盐后的串再加密，得到的结果便更难被破解。

## 散列

> Hash，一般翻译做散列、杂凑，或音译为哈希，是把任意长度的输入（又叫做预映射pre-image）通过散列算法变换成固定长度的输出，该输出就是散列值。这种转换是一种压缩映射，也就是，散列值的空间通常远小于输入的空间，不同的输入可能会散列成相同的输出，所以不可能从散列值来确定唯一的输入值。简单的说就是一种将任意长度的消息压缩到某一固定长度的消息摘要的函数。

散列实际上是通过 Hash 函数，将原串的值通过 Hash 函数做一次映射，从而得到一个新串。由于散列很难找到逆向规律，这种算法同样可以增加密文的复杂性。

举例：

现定义一种哈希函数，将字符 'a' 映射到 'b'，'b' 映射到 'd'，'c' 映射到 'f' (第几个字母就向后推几位，如果超出 'z' 就向前推 26 位)...

那么，对原串 'acfbg' 散列，得到的结果是 'bfldn'.

对 'bfldn' 再进行一次散列，得到的结果是 'dlxhb'.

这种算法很难找到逆向规律，例如 'b'  可能由 'a' 得到，也可能由 'n'  得到。

我们在 MD5 加密后进行散列时，通常会进行 1024 次或 2048 次，这使得原串很难被破解。

# Shiro 实现 MD5 加密

## 基本 MD5 加密

Shiro 为我们提供了 MD5 的加密算法，我们只需使用 Md5Hash 类即可实现：

```java
  public static void main(String[] args) {
    Md5Hash md5Hash = new Md5Hash("123456");
    System.out.println(md5Hash.toHex());
  }
```

运行：

```shell
e10adc3949ba59abbe56e057f20f883e

Process finished with exit code 0
```

## 加盐与散列

加盐和散列也非常简单，只需在构造函数中添加即可。

Md5Hash 的构造函数：

- 第一个参数  source  字符串型  表示源
- 第二个参数  salt  字符串型  表示盐，默认加到源尾部
- 第三个参数  hashIterations  整型  表示散列次数 

```java
  public static void main(String[] args) {
    Md5Hash md5Hash = new Md5Hash("123456", "Koorye_Love_MD5", 1024);
    System.out.println(md5Hash.toHex());
  }
```

运行：

```shell
e9261b98c415bee7eaf191f89bee80c9

Process finished with exit code 0
```

注意加盐和散列后得到结果与不加盐不散列的结果是不同的。

# 自定义 Realm 实现登录验证

我们自定义的 Realm 类一般都要继承一个名为 AuthorizingRealm 的类，这个类需要我们重写两个方法：

- `doGetAuthorizationInfo`  认证
- `doGetAuthenticationInfo`  登录验证

我们暂时先不管认证方法。

Shiro 的登录验证分为两步，用户名验证和密码验证。用户名验证需要我们自行判断，而密码验证 Shiro 为我们封装好了一个 SimpleAuthenticationInfo 类帮助我们自动完成。

我们先从明文登录开始。

首先通过 `authenticationToken.getPrincipal() ` 拿到 token 的用户名，如果用户名不存在，返回 null。

如果用户名存在，返回 SimpleAuthenticationInfo 以验证密码，这个类需要三个参数：

- 第一个参数  Principal  Object类型  用户名
- 第二个参数  Credentials  字符串类型  证书，此处使用密码
- 第三个参数  RealmName  字符串类型   Realm 的名字，使用 `this.getName()` 即可

```java
package org.koorye.helloshiro;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;

public class UserRealm extends AuthorizingRealm {
  protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
    return null;
  }

  protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
    if ("koorye".equals(authenticationToken.getPrincipal())) {  // 用户存在
      return new SimpleAuthenticationInfo(authenticationToken.getPrincipal(),
          "123456",  // 自动判断密码匹配
          this.getName());
    } else {
      return null;  // 用户不存在
    }
  }
}
```

编写一个测试类：

```java
  @Test
  public void testLogin() {
    DefaultSecurityManager manager = new DefaultSecurityManager();
    manager.setRealm(new UserRealm());
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
```

运行：

```shell
登录成功

Process finished with exit code 0
```

# 自定义 Realm 实现 MD5 加密

首先我们来定义一个 MD5 加密算法，因为，我们必须在验证时用一样的算法，才可以验证成功。

定义的算法：加盐 "Koorye_Love_MD5"，1024 次散列。

编写一个测试类查看结果：

```java
  @Test
  public void showMd5() {
    Md5Hash md5Hash = new Md5Hash("123456", "Koorye_Love_MD5", 1024);
    System.out.println(md5Hash.toHex());
  }
```

运行：

```shell
e9261b98c415bee7eaf191f89bee80c9

Process finished with exit code 0
```

如果要使用数据库，我们在数据库中存储的就是密码经过 MD5 加密后的串。

不过我们这里没有用到数据库，于是我们将加密后的串作为证书：

```java
return new SimpleAuthenticationInfo(authenticationToken.getPrincipal(),
    "e9261b98c415bee7eaf191f89bee80c9",
    this.getName());
```

接下来，我们需要在 Realm 中说明加密算法的过程。

## 声明加密算法

在声明 Realm 时说明加密算法是 MD5：

先声明一个 HashedCredentialsMatcher，然后用 ` matcher.setHashAlgorithmName("md5")` 说明方法是 MD5.

再声明一个 Realm，使用`userRealm.setCredentialsMatcher(matcher)` 设置加密方法。

最后将 Realm 添加到 SecurityManager 中。

修改后的代码：

```java
  @Test
  public void testLogin() {
    DefaultSecurityManager manager = new DefaultSecurityManager();

    HashedCredentialsMatcher matcher = new HashedCredentialsMatcher();
    matcher.setHashAlgorithmName("md5");

    UserRealm userRealm = new UserRealm();
    userRealm.setCredentialsMatcher(matcher);

    manager.setRealm(userRealm);
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
```

## 声明加盐和散列

我们需要使用 SimpleAuthenticationInfo 的另一种构造方法，这个方法的第三个参数使用 ByteSource.Util.bytes() 传入盐：

```java
      return new SimpleAuthenticationInfo(authenticationToken.getPrincipal(),
          "e9261b98c415bee7eaf191f89bee80c9",
          ByteSource.Util.bytes("Koorye_Love_MD5"),
          this.getName());
```

至于散列的声明，则要与加密算法的声明同时进行：

```java
HashedCredentialsMatcher matcher = new HashedCredentialsMatcher();
    matcher.setHashAlgorithmName("md5");
    matcher.setHashIterations(1024);
```

修改后的 Realm：

```java
package org.koorye.helloshiro;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;

public class UserRealm extends AuthorizingRealm {
  protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
    return null;
  }

  protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
    if ("koorye".equals(authenticationToken.getPrincipal())) {  // 用户存在
      return new SimpleAuthenticationInfo(authenticationToken.getPrincipal(),
          "e9261b98c415bee7eaf191f89bee80c9",
          ByteSource.Util.bytes("Koorye_Love_MD5"),
          this.getName());
    } else {
      return null;  // 用户不存在
    }
  }
}
```

修改后的 Test：

```java
package org.koorye.test;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.apache.shiro.mgt.DefaultSecurityManager;
import org.apache.shiro.subject.Subject;
import org.junit.Test;
import org.koorye.helloshiro.UserRealm;

public class TestShiro {
  @Test
  public void showMd5() {
    Md5Hash md5Hash = new Md5Hash("123456", "Koorye_Love_MD5", 1024);
    System.out.println(md5Hash.toHex());
  }

  @Test
  public void testLogin() {
    DefaultSecurityManager manager = new DefaultSecurityManager();

    HashedCredentialsMatcher matcher = new HashedCredentialsMatcher();
    matcher.setHashAlgorithmName("md5");
    matcher.setHashIterations(1024);

    UserRealm userRealm = new UserRealm();
    userRealm.setCredentialsMatcher(matcher);

    manager.setRealm(userRealm);
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

测试成功！