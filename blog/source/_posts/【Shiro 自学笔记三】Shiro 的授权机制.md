---
title: 【Shiro 自学笔记三】Shiro 的授权机制
date: 2020-07-24 03:31:16
tags: [后端,安全,Shiro]
categories: 后端
description: 本文介绍了 Shiro 的授权机制。
---

这一期来了解一下 Shiro 的授权。

# 授权的概念

## 主体
主体，即访问应用的用户，在 Shiro 中使用 Subject 代表用户。用户只有授权后才允许访问相应的资源。

## 资源
在应用中用户可以访问的任何东西都称为资源。用户只有授权后才能访问。

## 权限
安全策略中的原子授权单位，通过权限我们可以表示在应用中用户有没有操作某个资源的权利。即权限表示在应用中用户能不能访问某个资源。
Shiro 支持粗颗粒度权限（如用户模块的所有权限）和细颗粒度权限（操作某个用户的权限，即实例级别的）。

## 角色
角色代表了操作集合，可以理解为权限的集合，一般情况下我们会赋予用户角色而不是权限，即这样用户可以拥有一组权限。不同的角色拥有一组不同的权限。

举一个例子，如果我们有两种角色，admin 和 guest。

接着，我们需要给不同的角色不同的权限，例如 admin 可以访问所有页面，guest 只能访问首页。

最后，在用户登录时，我们就可以通过给用户赋予不同的角色，来规定其可以访问的页面。

# 授权的类型

Shiro 的授权类型有两种：基于角色的访问控制、基于资源的访问控制。

## 基于角色的访问控制

通过判断用户是否拥有某种角色，来判断是否拥有权限，如：

```java
if (subject.hasRole("admin"))
  System.out.println("用户是 admin");

if (subject.hasAllRoles(Arrays.asList("admin", "guest")))
  System.out.println("用户是 admin 也是 guest");
      
boolean[] booleans = subject.hasRoles(Arrays.asList("admin", "guest"));
for (boolean aBoolean : booleans) {
  System.out.println(aBoolean);
}
```

## 基于资源的访问控制

Shiro 中使用权限字符串实现基于资源的访问控制，权限字符串的结构是：

- 资源标识符 : 操作 : 资源实例标识符

其中，可以使用 * 通配所有内容。

事实上，上面的结构是一种通用的做法，只要用 `:` 分割的字符串都可以作为权限字符串。

例：

```java
if (subject.isPermitted("user:find:*"))
  System.out.println("用户拥有查找所有用户的权限");

if (subject.isPermitted("user:*:10001"))
  System.out.println("用户拥有对10001用户的所有权限");
```

# 判断是否授权

Shiro 中有三种判断授权的方式：编程式、注解式、标签式。

## 编程式

即上面的例子，使用 `subject.hasrole()` 和 `subject.isPermitted()` 判断。

## 注解式

`@RequiresAuthenthentication`: 表示当前 Subject 已经通过 login 进行身份验证
`@RequiresUser`: 表示当前Subject已经身份验证或者通过记住我登录的
`@RequiresGuest`: 表示当前Subject没有身份验证或者通过记住我登录过，即是游客身份
`@RequiresRoles(value = {"admin","user"},logical = Logical.AND)`: 表示当前 Subject 需要角色 admin 和 user
`@RequiresPermissions(value = {"user:delete","user:b"},logical = Logical.OR)`: 表示当前Subject需要权限 user:delete 或者 user:b

使用 `@RequiresRoles` 注解，如：

```java
@RequiresRoles(value = "admin")
public void hello() {
  System.out.println("hello");
}

@RequiresRoles(value = {"admin", "guest"})
public void hello2() {
  System.out.println("hello");
}
```

*注：该方法似乎只能在 Web 环境生效，笔者不明其原因*

## 标签式

在 JSP 等页面中使用，如：

```html
<shiro:hasRole name="admin">
    <h2> Hello Admin! </h2>
</shiro:hasRole>
```

# 实现授权和判断

注意在上一期中，AuthorizingRealm 要求我们重写两个方法：

- doGetAuthenticationInfo  用户登录验证
- doGetAuthorizationInfo  用户授权

接下来我们就来重写用户授权方法。

首先 doGetAuthorizationInfo 有一个 principalCollection 参数，这个参数有一个 getPrimaryPrincipal 方法，用于获取用户的主身份信息，在本例中其实就是用户名。

然后，与登录的 SimpleAuthenticationInfo 相对应，授权同样有一个 SimpleAuthorizationInfo 类。

这个类可以通过 addRole 方法添加角色权限，也可以通过 addStringPermission 添加权限字符串。

在这个例子中，我们为名为 koorye 的用户添加了 admin 角色权限和 user 资源权限：

```java
package org.koorye.helloshiro;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;

public class UserRealm extends AuthorizingRealm {
  protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
    String principal = (String) principalCollection.getPrimaryPrincipal();
    System.out.println("用户名：" + principal);
    SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
    if ("koorye".equals(principal)) {
      simpleAuthorizationInfo.addRole("admin");
      simpleAuthorizationInfo.addStringPermission("user");  // 等同于 user:*:*
    }
    return simpleAuthorizationInfo;
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

测试方法：

```java
package org.koorye.test;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.authz.annotation.RequiresRoles;
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

      if (subject.isAuthenticated()) {
        if (subject.hasRole("admin"))
          System.out.println("用户是 admin");

        if (subject.isPermitted("user:find:*"))
          System.out.println("用户拥有查找所有用户的权限");
      }
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
用户名：koorye
用户是 admin
用户名：koorye
用户拥有查找所有用户的权限

Process finished with exit code 0
```

注意 `用户名：koorye` 是认证过程中调用的，这也意味着每次认证，都会调用一次授权方法。

我们将授权改为 guest 再次尝试：

```java
if ("koorye".equals(principal)) {
  simpleAuthorizationInfo.addRole("guest");
  simpleAuthorizationInfo.addStringPermission("user");  // 等同于 user:*:*
}
```

运行：

```shell
登录成功
用户名：koorye
用户名：koorye
用户拥有查找所有用户的权限

Process finished with exit code 0

```

注意到 `用户是 admin` 语句不再返回。