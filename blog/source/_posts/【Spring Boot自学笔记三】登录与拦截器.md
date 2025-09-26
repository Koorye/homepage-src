---
title: 【Spring Boot自学笔记三】登录与拦截器
date: 2020-05-06 12:30:43
tags: [后端,Spring Boot]
categories: 后端
description: 本文介绍了Spring Boot的登录功能和拦截器的实现，包括登录控制器的实现、拦截器的实现和拦截器的配置。
---

# 登录
登录很简单，用一个控制器类，匹配传入的参数是否与数据库中的用户信息匹配，如果匹配就跳转到后台，不匹配就返回主页。

这里笔者简单的使用模拟数据来提供一个用户。

spring boot会自动根据控制器方法中提供的参数匹配request传入的数据，若标注`@RequestParam`，传入数据为空则会自动报错。

## 实现登录控制器

```java
package org.koorye.hellospringboot.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.support.SessionStatus;

import javax.servlet.http.HttpSession;
import java.util.Map;

@Controller
public class LoginController {
  @PostMapping("/login")
  public String login(@RequestParam("username") String username,
                      @RequestParam("password") String password) {
    if (username.equals("admin") && password.equals("admin")) {
      return "redirect:/user/list";
    } else {
      return "index";
    }
  }
}
```
## 指定html中的input标签

有了控制器，我们要怎么传递参数呢？spring boot会根据`<input>`标签中的name属性找到参数的来源对象，因此，我们需要给登录界面的text文本框添加name属性，来指定username和password的来源：

```html
  <form action="/login" method="post">
    <h2 class="display-4 mb-4" th:text="#{index.login}">Login</h2>
    <label>
      <input class="form-control mb-2" name="username" type="text" placeholder="Username"
             th:placeholder="#{index.username}">
      <input class="form-control" name="password" type="password" placeholder="Password"
             th:placeholder="#{index.password}">
    </label>
    <br>
    <input class="btn btn-primary" type="submit" value="Sign In" th:value="#{index.signIn}">
  </form>
```

## 登录失败提示
我们可以使用请求转发的方式得到一个报错信息，再利用thymeleaf解析生成。

### 控制器添加参数
我们给login方法添加一个map，通过`map.put()`方法给map指定key和value，就相当于在servlet中给request指定attributeName属性名和attributeValue属性值，最后返回到主页，主页就可以根据request中的参数生成提示：

```java
@PostMapping("/login")
public String login(@RequestParam("username") String username,
                    @RequestParam("password") String password,
                    Map<String, Object> map) {
  if (username.equals("admin") && password.equals("admin")) {
    return "redirect:/user/list";
  } else {
    map.put("loginMsg", "Login Failed! Please check username and password.");
    return "index";
  }
}
```

## 主页接收参数

主页接收提示，使用thymeleaf解析：

- `th:if`: 如果条件满足就显示标签，否则不显示
- `th:text`: 指定标签中的文本内容
- `${}`: 变量表达式，此处用于获取request属性值

```html
  <p style="color: red" th:text="${loginMsg}" th:if="${loginMsg}!=null"></p>
```

登录失败效果（笔者已进行国际化处理，因此是中文）：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/c657e7d3cf2eb59460aad26c62838282.png)

----

# 拦截器

上面的登录还有一个问题：如果用户不登录，直接输入后台的url也可以得到后台页面，这使得登录界面毫无意义。因此，我们可以实现一个拦截器来拦截未登录的用户。

## 通过控制器设置session属性
我们给登录控制器添加一个`HttpSession`参数，并通过`session.setAttribute()`添加user属性：

```java
@PostMapping("/login")
public String login(@RequestParam("username") String username,
                    @RequestParam("password") String password,
                    Map<String, Object> map,
                    HttpSession session) {
  if (username.equals("admin") && password.equals("admin")) {
    session.setAttribute("user", username);
    return "redirect:/user/list";
  } else {
    map.put("loginMsg", "Login Failed! Please check username and password.");
    return "index";
  }
}
```

## 实现拦截器类
之后，我们就可以通过判断session中user属性是否存在来作出操作：

如果user存在，跳转到后台；如果user不存在，返回主页并传递错误信息。

创建一个登录拦截器类，实现HandlerInterceptor拦截器的接口，重载preHandle方法，返回true表示放行，false则表示拦截。

当然，别忘了在主页实现显示错误信息的标签。
```java
package org.koorye.hellospringboot.component;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class LoginHandlerInterceptor implements HandlerInterceptor {
  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    Object user = request.getSession().getAttribute("user");
    if (user == null) {
      request.setAttribute("userMsg", "Please visit the page after login!");
      request.getRequestDispatcher("/index").forward(request, response);
      return false;
    } else {
      return true;
    }
  }

  @Override
  public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

  }

  @Override
  public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

  }
}
```

## 把拦截器加入组件中
单是这样，拦截器并没有启用，我们**必须把拦截器加入组件中**，在MvcConfig类的`webMvcConfig`方法中重载`addInterceptors`方法：

- `addPathPatterns`: 指定需要拦截的路径，`/**`表示根路径下的所有路径
- `excludePathPatterns`: 排除不需要拦截的路径，这里首页`/`、`/index`、登录请求`/login`、webjars和asserts中的css和js`/webjars/**`、`/asserts/**`是不需要拦截的，如果拦截则会导致无法登录、样式无法加载等问题

```java
package org.koorye.hellospringboot.config;

import org.koorye.hellospringboot.component.LoginHandlerInterceptor;
import org.koorye.hellospringboot.component.MyLocaleResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig {
  ...
  @Bean
  public WebMvcConfigurer webMvcConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("index");
        registry.addViewController("/index").setViewName("index");
        ...
      @Override
      public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginHandlerInterceptor()).addPathPatterns("/**")
            .excludePathPatterns("/index", "/", "/login", "/webjars/**,/asserts/**");
      }
    };
  ...
}
```

大功告成，拦截效果：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/3589f8b068fc489976ecabc3a2abe954.png)
登录成功效果：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/46cbd6d5579b0bc83de075371759625e.png)
