---
title: 【Shiro 自学笔记八】Spring Boot 环境下 Shiro 整合 JWT
date: 2020-07-25 18:03:46
tags: [后端,安全,Shiro,JWT,SpringBoot]
categories: 后端
description: 本文介绍了如何在 Spring Boot 环境下使用 Shiro 整合 JWT。
---

这一期我们用 Shiro 整合 JWT。

# 自定义 token

我们之前使用 Shiro 提供的 UsernamePasswordToken，这次我们需要自定义一个 token，实现空参构造、全参构造、GetSet：

```java
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class JwtPasswordToken implements AuthenticationToken {
    private String access_token;
    private String password;

    @Override
    public Object getPrincipal() {
        return access_token;
    }

    @Override
    public Object getCredentials() {
        return password;
    }
}
```

# 自定义 Realm

重写 supports 修改 token 类型为自定义 token。

重写登录认证过程，如果 password 存在，就走登录流程；不存在就走 token 验证流程。

由于证书不能为空，所以我们用 DEFAULT_PASSWORD 代替：

```java
@Component
public class UserRealm extends AuthorizingRealm {

  @Autowired
  private UserServiceImpl userService;

  @Override
  public boolean supports(AuthenticationToken token) {
    return token instanceof JwtPasswordToken;
  }

  @Override
  protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
    return null;
  }

  @Override
  protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException, MalformedJwtException, ExpiredJwtException {
    Claims claims = JwtUtil.parseToken((String) authenticationToken.getPrincipal());
    String username = claims.getAudience();
    String password = (String) authenticationToken.getCredentials();

    if ("DEFAULT_PASSWORD".equals(password)) {
      return new SimpleAuthenticationInfo(
          authenticationToken.getPrincipal(),
          Md5Util.getMd5("DEFAULT_PASSWORD"),
          ByteSource.Util.bytes("koorye_love_md5"),
          this.getName()
      );
    } else {
      User user = userService.getUserByUsername(username);
      if (user == null) {
        return null;
      }
      return new SimpleAuthenticationInfo(
          authenticationToken.getPrincipal(),
          userService.getUserByUsername(claims.getAudience()).getPassword(),
          ByteSource.Util.bytes("koorye_love_md5"),
          this.getName()
      );
    }
  }
}
```

# 自定义 Filter

自定义的 Filter 继承 Shiro 提供的 BasicHttpAuthenticationFilter，重写：

- isAccessAllowed  判断是否通过
- isLoginAttempt  判断请求类型，此处检测是否拥有 token
- executeLogin  尝试认证，由于证书不能为空，此处我们传入一个 DEFAULT_PASSWORD

getSubject(request, response).login(token)  用于请求 Realm 认证

```java
public class JwtFilter extends BasicHttpAuthenticationFilter {
  @SneakyThrows
  @Override
  protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) {
    if (isLoginAttempt(request, response)) {
      return executeLogin(request, response);
    } else {
      return false;
    }
  }

  @Override
  protected boolean isLoginAttempt(ServletRequest request, ServletResponse response) {
    HttpServletRequest httpServletRequest = (HttpServletRequest) request;
    String access_token = httpServletRequest.getHeader("access_token");
    return access_token != null;
  }

  @Override
  protected boolean executeLogin(ServletRequest request, ServletResponse response) throws Exception {
    HttpServletRequest httpServletRequest = (HttpServletRequest) request;
    String access_token = httpServletRequest.getHeader("access_token");
    if (access_token == null) {
      throw new UnknownAccountException();
    }

    JwtPasswordToken token = new JwtPasswordToken(access_token, "DEFAULT_PASSWORD");
    getSubject(request, response).login(token);
    return true;
  }
}
```

# 配置网络安全管理器

修改 Shiro 的配置类，关闭 Session 缓存：

```java
  @Bean(name = "webSecurityManager")
  public DefaultWebSecurityManager defaultWebSecurityManager(UserRealm realm) {
    DefaultWebSecurityManager defaultWebSecurityManager = new DefaultWebSecurityManager();
    defaultWebSecurityManager.setRealm(realm);

    DefaultSubjectDAO subjectDAO = new DefaultSubjectDAO();
    DefaultSessionStorageEvaluator defaultSessionStorageEvaluator = new DefaultSessionStorageEvaluator();
    defaultSessionStorageEvaluator.setSessionStorageEnabled(false);
    subjectDAO.setSessionStorageEvaluator(defaultSessionStorageEvaluator);
    defaultWebSecurityManager.setSubjectDAO(subjectDAO);

    return defaultWebSecurityManager;
  }
```

# 配置过滤规则

修改 Shiro 配置类，自定义过滤器和过滤规则：

```java
  @Bean
  public ShiroFilterFactoryBean shiroFilterFactoryBean(DefaultWebSecurityManager webSecurityManager) {
    ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
    shiroFilterFactoryBean.setSecurityManager(webSecurityManager);

    Map<String, Filter> filterMap = new HashMap<>();
    filterMap.put("jwt", new JwtFilter());
    shiroFilterFactoryBean.setFilters(filterMap);

    Map<String, String> filterRuleMap = new HashMap<>();
    filterRuleMap.put("/api/**", "jwt");
    filterRuleMap.put("/api/login", "anon");
    filterRuleMap.put("/api/register", "anon");
    shiroFilterFactoryBean.setFilterChainDefinitionMap(filterRuleMap);

    return shiroFilterFactoryBean;
  }
```

# 登录控制器

登录时将用户传入的用户名生成 token，再调用 login 登录：

```java
  @RequestMapping("/api/login")
  public ResponseEntity<Map<String, String>> login(String username, String password) throws Exception {
    Subject subject = SecurityUtils.getSubject();
    String token = JwtUtil.getToken(username, 1800);
    JwtPasswordToken jwtToken = new JwtPasswordToken(token, password);
    subject.login(jwtToken);

    if (subject.isAuthenticated()) {
      String access_token = JwtUtil.getToken(username, 30 * 60);
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

# 全局异常控制器

实现一个异常控制器类，统一处理所有异常：

```java
@RestController
@ControllerAdvice
public class ExceptionController {
  @ExceptionHandler(UnknownAccountException.class)
  public ResponseEntity<Map<String, String>> unknownAccountException() {
    Map<String, String> map = new HashMap<>();
    map.put("ret_code", "401");
    map.put("err_msg", "User is not EXIST!");
    return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(IncorrectCredentialsException.class)
  public ResponseEntity<Map<String, String>> incorrectCredentialsException() {
    Map<String, String> map = new HashMap<>();
    map.put("ret_code", "402");
    map.put("err_msg", "Password is ERROR!");
    return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<Map<String, String>> authenticationException() {
    Map<String, String> map = new HashMap<>();
    map.put("ret_code", "403");
    map.put("err_msg", "Token is ERROR!");
    return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MalformedJwtException.class)
  public ResponseEntity<Map<String, String>> malformedJwtException() {
    Map<String, String> map = new HashMap<>();
    map.put("ret_code", "403");
    map.put("err_msg", "Token is ERROR!");
    return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(ExpiredJwtException.class)
  public ResponseEntity<Map<String, String>> expiredJwtException() {
    Map<String, String> map = new HashMap<>();
    map.put("ret_code", "404");
    map.put("err_msg", "Token is EXPIRED!");
    return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
  }
}
```

# 测试

使用 postman 模拟登录：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2ce1d24cef58be5d7dc83bbf01b864b3.png)


返回：

```json
{
    "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJrb29yeWUiLCJzdWIiOiJzaGlyb19kZW1vIiwiYXVkIjoia29vcnllIiwiaWF0IjoxNTk1NjcwNzU2LCJleHAiOjE1OTU2NzI1NTZ9.avA3lQBzoxN-rF0qQq-36XQnRMTX-iH-FRRf98Xhykw",
    "ret_code": "201"
}
```

模拟访问：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7fd56d04f5fd3ae6c8a1533608ed5e08.png)


返回：

```json
You are an admin.
```

pc3MiOiJrb29yeWUiLCJzdWIiOiJzaGlyb19kZW1vIiwiYXVkIjoia29vcnllIiwiaWF0IjoxNTk1NjcwNzU2LCJleHAiOjE1OTU2NzI1NTZ9.avA3lQBzoxN-rF0qQq-36XQnRMTX-iH-FRRf98Xhykw",
    "ret_code": "201"
}
```

模拟访问：

[外链图片转存中...(img-QVmX4ugi-1595671362694)]

返回：

```json
You are an admin.
```
