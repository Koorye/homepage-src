---
title: 【Shiro 自学笔记七】 什么是 JWT？Shiro 整合JWT
date: 2020-07-25 18:01:59
tags: [后端,安全,Shiro,JWT]
categories: 后端
description: 本文介绍了什么是 JWT，以及如何使用 JWT。
---

JWT 全称 JSON Web Token，是一种用于通信双方之间传递安全信息的简洁的、URL安全的表述性声明规范，经常用在跨域身份验证。本期内容与 Shiro 无关，不过在下一期我们就会整合 Shiro 和 JWT。

# 什么是 JWT

JWT 是一种可以携带信息的加密串，加密时可以将各种信息，如用户、作者、过期时间等，并设定签名(密钥)。

解密时，只要提供签名(密钥)，token 就可以被解析得到信息，从而实现一种相对安全的前后端交互方式。

## Session 的缺陷

传统的认证采用 Session 的形式，用户登录成功后，就将用户信息以 Session 形式存入服务器内存，并为用户发送 Cookie 保存登录信息。下次用户登录时，通过检验 Cookie 和 Session 信息，判断认证是否有效。

- 浪费资源，Session 保存在服务器内存中，开销很大
- 因为是基于 Cookie 来进行用户识别的,  Cookie 如果被截获，用户就会很容易受到跨站请求伪造的攻击
- 由于 Session 存在内存中，如果是分布式应用，服务器之间共享内存，不利于应用扩展

## JWT  的结构

一个生成的 token 如下：eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJrb29yeWUiLCJzdWIiOiJzaGlyb19kZW1vIiwiYXVkIjoia29vcnllIiwiaWF0IjoxNTk1NjYwNTQxLCJleHAiOjE1OTU2NjQxNDF9.EMq7pVog37X3Un0FVgx2qP8sULpd5haXvdU1qvzKZYo

token 分为3部分，用 `.` 分割：

- 第一部分  头部信息
- 第二部分  载荷信息
- 第三部分  签名信息

JWT 官网提供了清晰的例子，头部包含加密算法等信息，中间包含我们传入的信息，尾部则包含密钥、用于验证：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2a84987ef47658c0130688fa54ee005e.png)


## JWT 的生成和解析

一个标准的 JWT 应该具有的信息：

- iss: jwt 签发者
- sub: jwt 所面向的用户
- aud: 接收 jwt 的一方
- exp: jwt 的过期时间，这个过期时间必须要大于签发时间
- nbf: 定义在什么时间之前，该 jwt 都是不可用的
- iat: jwt 的签发时间
- jti: jwt 的唯一身份标识，主要用来作为一次性 token,从而回避重放攻击

## 导入依赖

导入 jjwt 包：

```xml
    <!-- JWT -->
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt</artifactId>
      <version>0.9.1</version>
    </dependency>
```

## 编写工具类

笔者此处将一些固定的信息，如签发者、主题、签名等以常量形式存储。

生成 token 时，需要调用 Jwts.builder 存入信息，然后使用 compact 得到 token 字符串。

解析token 时，调用 Jwts.parser，传入签名即可。

例：

```java
package org.koorye.util;

import io.jsonwebtoken.*;

import java.util.Date;

public class JwtUtil {
    public static final String ISSUER = "koorye";
    public static final String SUBJECT = "shiro_demo";
    public static final String SIGN = "koorye_love_jwt";

    public static String getToken(String username, int expireTime) {
        Date currentTime = new Date();

        JwtBuilder jwtBuilder = Jwts.builder()
                .setIssuer(ISSUER)
                .setSubject(SUBJECT)
                .setAudience(username)
                .setIssuedAt(currentTime)
                .setExpiration(new Date(System.currentTimeMillis() + expireTime * 1000))
                .signWith(SignatureAlgorithm.HS256, SIGN);

        return jwtBuilder.compact();
    }

    public static Claims parseToken(String token) {
        return Jwts.parser().setSigningKey(SIGN).parseClaimsJws(token).getBody();
    }
}
```

## 测试

第二个参数是过期时间(单位秒)：

```java
    @Test
    public void testToken() {
        String token = JwtUtil.getToken("koorye", 60 * 60);
        System.out.println(token);
        System.out.println("=======================");
        Claims claims = JwtUtil.parseToken(token);
        System.out.println("Audience: " + claims.getAudience());
        System.out.println("Subject: " + claims.getSubject());
    }
```

运行：

```shell
eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJrb29yeWUiLCJzdWIiOiJzaGlyb19kZW1vIiwiYXVkIjoia29vcnllIiwiaWF0IjoxNTk1NjYwNTQxLCJleHAiOjE1OTU2NjQxNDF9.EMq7pVog37X3Un0FVgx2qP8sULpd5haXvdU1qvzKZYo
=======================
Audience: koorye
Subject: shiro_demo

```

# 基于 JWT 的用户认证

## 编写拦截器

使用原生 JWT 完成认证，我们可以自定义拦截器来实现：

- returnJson  用于返回信息
- preHandle  重写，定义拦截规则

在拦截器中，我们检测 Header 中是否包含 access_token 信息，如果不包含，说明未登录。

如果包含：

- 如果 token 解析失败，说明 token 错误
- 如果 token 解析成功，但是过期异常，说明 token 过期

都通过则说明 token 可用，返回 true：

```java
@Component
public class JwtInterceptor extends HandlerInterceptorAdapter {

    private void returnJson(HttpServletResponse response, String json) throws Exception {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html; charset=utf-8");
        try (PrintWriter writer = response.getWriter()) {
            writer.print(json);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = request.getHeader("access_token");
        if (token == null) {
            System.out.println("[ ERROR ] Token is NULL.");

            Map<String, String> map = new HashMap<>();
            map.put("ret_code", "401");
            map.put("err_msg", "Token is NULL.");
            response.setStatus(401);

            returnJson(response, JSON.toJSONString(map));
            return false;
        } else {
            try {
                Claims claims = JwtUtil.parseToken(token);
            } catch (MalformedJwtException e) {
                System.out.println("[ ERROR ] Token is ERROR.");

                Map<String, String> map = new HashMap<>();
                map.put("ret_code", "402");
                map.put("err_msg", "Token is ERROR.");
                response.setStatus(403);
                returnJson(response, JSON.toJSONString(map));

                return false;
            } catch (ExpiredJwtException e) {
                System.out.println("[ ERROR ] Token is EXPIRED.");

                Map<String, String> map = new HashMap<>();
                map.put("ret_code", "403");
                map.put("err_msg", "Token is EXPIRED.");
                response.setStatus(403);
                returnJson(response, JSON.toJSONString(map));

                return false;
            }
        }
        return true;
    }
}
```

## 配置拦截规则

在 Spring Boot 中，我们可以使用配置类的形式实现。

除了登录和注册，其他请求都需要拦截：

```java
@Configuration
public class InterceptorConfig extends WebMvcConfigurationSupport {
    @Autowired
    private JwtInterceptor jwtInterceptor;

    @Override
    protected void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/login")
                .excludePathPatterns("/api/register");
    }
}
```

## 编写控制器

主要关注认证成功的部分 `isAuthenticated`，认证成功时，生成一个 token 传入返回体：

```java
    @RequestMapping("/api/login")
    public ResponseEntity<Map<String, String>> login(String username, String password) {
        Subject subject = SecurityUtils.getSubject();
        UsernamePasswordToken token = new UsernamePasswordToken(username, password);
        try {
            subject.login(token);
        } catch (UnknownAccountException e) {
            Map<String, String> map = new HashMap<>();
            map.put("ret_code", "401");
            map.put("err_msg", "Username is not EXISTED.");
            return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
        } catch (AuthenticationException e) {
            Map<String, String> map = new HashMap<>();
            map.put("ret_code", "402");
            map.put("err_msg", "Password is ERROR.");
            return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
        }

        if (subject.isAuthenticated()) {
            String access_token = JwtUtil.getToken(username, 30 * 60);  // 设置 30 分钟过期
            Map<String, String> map = new HashMap<>();
            map.put("ret_code", "201");
            map.put("access_token", access_token);
            return new ResponseEntity<>(map, HttpStatus.OK);
        } else {
            Map<String, String> map = new HashMap<>();
            map.put("ret_code", "403");
            map.put("err_msg", "Login failed.");
            return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
        }
    }

```

## 测试

我们使用 postman 测试一下。

模拟登录：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e41c976869e3230b2db54222101ffd39.png)


返回体：

```json
{
    "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJrb29yeWUiLCJzdWIiOiJzaGlyb19kZW1vIiwiYXVkIjoia29vcnllIiwiaWF0IjoxNTk1NjYxNzgyLCJleHAiOjE1OTU2NjM1ODJ9.AqhHVRw7FiOMv3y79XAelkVLgfeQzrmCmqYYPg1ouOY",
    "ret_code": "201"
}
```

模拟访问页面，访问时提供 access_token：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/b6c656321566c2fac808e661faa62995.png)


返回体：

```json
You are an admin.
```

如果 token 被修改：

```json
{"err_msg":"Token is ERROR.","ret_code":"402"}
```

如果 token 过期：

```json
{"err_msg":"Token is EXPIRED.","ret_code":"403"}
```

# 主流的双 token 认证方案

目前的主流方案是使用双 token 认证。

用户登录成功后，服务端给用户传递两个 token：

- access_token  认证用 token，存储主体信息，过期时间较短(如 30 分钟)
- refresh_token  刷新用 token，过期时间较长(如一星期)

用户登录时，首先发送 access_token，如果请求成功，则放行。

如果请求失败，提供 access_token 过期，则发送 refresh_token：

- 如果 refresh_token 没过期，则给用户传递一个新的 access_token 和 refresh_token
``

# 主流的双 token 认证方案

目前的主流方案是使用双 token 认证。

用户登录成功后，服务端给用户传递两个 token：

- access_token  认证用 token，存储主体信息，过期时间较短(如 30 分钟)
- refresh_token  刷新用 token，过期时间较长(如一星期)

用户登录时，首先发送 access_token，如果请求成功，则放行。

如果请求失败，提供 access_token 过期，则发送 refresh_token：

- 如果 refresh_token 没过期，则给用户传递一个新的 access_token 和 refresh_token
- 如果 refresh_token 过期，则不放行