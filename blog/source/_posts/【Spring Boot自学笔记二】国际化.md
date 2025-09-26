---
title: 【Spring Boot自学笔记二】国际化
date: 2020-05-05 15:19:26
tags: [后端,Spring Boot]
categories: 后端
description: 本文介绍了Spring Boot的国际化实现，包括配置国际化文件、修改application.properties和修改html文件。
---

所谓国际化，即让页面自动根据不同的国家地区显示对应的语言，好处不必多说。

Spring boot为我们实现国际化提供了非常方便的方法，我们不再需要自行配置xml，这些配置spring boot已经帮我们自动实现。

----

# 前期准备
## 实现登录界面

我们先来绘制一个简单的登录页面：

笔者使用bootstrap4做了一些美化，具体美化方法不是重点，本文不再提。
```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
  <meta charset="UTF-8">
  <title>Hello Spring Boot</title>
  <link th:href="@{/webjars/bootstrap/4.4.1-1/css/bootstrap.css}" rel="stylesheet">
</head>
<body>
<section class="text-center">
  <form action="/login" method="post">
    <h2 class="display-4">Login</h2>
    <label>
      <input class="form-control" name="username" type="text" placeholder="Username" th:placeholder="#{index.username}">
    </label>
    <br>
    <label>
      <input class="form-control" name="password" type="text" placeholder="Password" th:placeholder="#{index.password}">
    </label>
    <br>
    <input class="btn btn-primary" type="submit" value="Sign In">
  </form>
</section>
<hr>
</body>
</html>
```

## 页面美化
### thymeleaf片段创建

接下来我们再绘制一个导航栏和页脚，此处纯粹美观需要，可以略过。

在templates中创建一个common.html，输入以下内容，此处用到thymeleaf的部分标签：

- `th:fragment`: 表示这块内容是一个片段，可以在其它页面中被引用，具体引用方法请往下看
- `@{}`: 引用超链接表达式
- `${}`: 变量表达式
- `#xxx`: 使用一个内置对象

### thymeleaf找到当前访问URL的方法

我们来看一下`th:href="@{${#httpServletRequest.requestURL}(lang='zh')}"`这段话，首先httpServlet是一个内置对象，可以通过requestURL方法得到当前访问URL，之后用${}表示这是一个变量，再用@{}转换成超链接。

在localhost:8080/index下访问`@{${#httpServletRequest.requestURL}(lang='zh')}`相当于访问localhost:8080/index?lang=zh，相当于给网页发送了一个带有参数lang请求，至于请求如何处理我们之后再解决。
```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
  <meta charset=" UTF-8">
  <title>Common</title>
</head>
<body>
<nav class="navbar navbar-expand navbar-light" th:fragment="headNav">
  <div class="container">
    <a href="/index" class="navbar-brand">Koorye's User Management System</a>
    <ul class="navbar-nav">
      <li class="nav-item"><a href="#" class="nav-link">View User</a></li>
      <li class="nav-item"><a href="#" class="nav-link">About Us</a></li>
    </ul>
  </div>
</nav>

<footer class="text-center" th:fragment="languageOption">
  <a th:href="@{${#httpServletRequest.requestURL}(lang='zh')}">中文</a>
  <a th:href="@{${#httpServletRequest.requestURL}(lang='en')}">English</a>
  <br>
  <a class="text-muted" th:href="@{${#httpServletRequest.requestURL}}">Copyright © 2020 Koorye All Right Reserved.</a>
</footer>
</body>
</html>
```
### thymeleaf片段引用

接下来我们要在主页中引入导航栏和页脚，使用`th:replace`就可以把当前标签替换成选用的内容，同时thymeleaf还有`th:insert`和`th:include`方法：

- `th:replace`: 替换当前标签为选用的内容
- `th:insert`: 在当前标签中添加选用的内容
- `th:include`: 保留当前标签，并把标签中的内容替换成选用的标签里的内容

具体使用，我们在主页加入以下内容：

- `~{}`片段表达式: common::headNav表示。templates/common.html中的headNav片段，中间用::连接，spring boot会自动为common拼串加上前后缀，我们之前已经使用`th:fragment`为片段命名
```html
...
<nav th:replace="~{common::headNav}"></nav>
...
<footer th:replace="~{common::languageOption}"></footer>
...
```

效果如下，使用bootstrap4美化之后是不是很漂亮呢？此处的中文/English点击后还没有作用，下文再进行完善：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/061e93d063274e3e7eab5239499f3095.png)

---

# 根据浏览器语言自动实现国际化
## 配置国际化文件
在spring boot中，要实现国际化，唯一需要我们做的就是编写国际化内容的配置文件：

我们在resources目录中创建i18n目录，并在目录中创建lang.properties、lang_en.properties、lang_zh.properties，分别对应默认、英文和中文。

intellij idea提供了非常方便的国际化编辑视图，我们可以在这个视图内同时编写三个配置文件：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/3cd1ad2e17a9f6c2769804133647cf7d.png)
注意一下登录页面需要什么国际化内容，我们为每个内容都创建对应配置：

- 标题index.title
- 导航栏标签common.headNav.label
- 导航栏链接common.headNav.view/common.headNav.aboutUs
- 登录窗口标题index.login
...
为每个内容都写好默认、英文、中文的内容之后，如果要应用，我们还有两步要做。

## 修改application.properties
在application.properties中加入一句话，指定国际化的默认配置文件，这里不加会乱码哦：
```properties
spring.messages.basename=i18n/lang
```

## 修改html
在html中使用thymeleaf的`th:text`标签（如果是按钮则用`th:value`）替换原来的内容，一个简单的例子：
```html
<title th:text="#{index.title}">Hello Spring Boot</title>
```
`th:text="#{index.title}"`: `#{}`是消息表达式，通常用于声明文本内容，我们在这里声明文本内容是配置文件中的index.tile项。

我们依次修改common.html和index.html中的所有标签，此时thymeleaf就会根据浏览器的语言偏好选项自动匹配内容啦！

效果如下：

语言偏好：中文

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e181b5b3c2d461ba7656c436b02ef53e.png)


语言偏好：英文

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/108f1e131e95a1ea1e9d4fb60121318e.png)

---

# 根据点击语言选项切换
现在网页已经可以自动根据浏览器的语言偏好选择语言了，但是我们提供的语言选项点击后还没有作用。

我们先来看一下之前提到的内容，点击`中文`按钮，网页会跳转到当前URL+/?lang=zh。

在这个例子中，点击`中文`，网页会跳转到localhost:8080/index/?lang=zh；点击'English`，则是http://localhost:8080/?lang=en

我们接下来就要根据请求中的parameter参数实现语言切换。

在java包中新建component包，新建一个`MyLocaleResolver`类，使用`LocaleResolver`接口，并重写`resolveLocale`方法。

我们注意到，`resolveLocale`方法有一个`request`参数，这意味着我们可以通过`getParameter`方法获取请求中的参数lang。

接下来，我们要做一个`if`判断，如果请求中没有lang参数，我们直接返回浏览器请求头中的语言偏好`return request.getLocale()`，如果有内容，我们还需要做以下处理。

考虑到语言偏好有两种格式，一种是语言（如en），一种是语言+国家/地区（如en_US），所以我们这里先对lang作切割。

如果切割后数组长度为1，则意味着没有国家信息，使用`return new Locale(lang)`直接返回请求参数；如果有国家信息，则使用`return new Locale(temp[0],temp[1])`返回语言+国家信息：
```java
package org.koorye.hellospringboot.component;

import org.springframework.web.servlet.LocaleResolver;
import org.thymeleaf.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Locale;

public class MyLocaleResolver implements LocaleResolver {
  @Override
  public Locale resolveLocale(HttpServletRequest request) {
    //获取lang参数中的内容
    String lang = request.getParameter("lang");
    
    if (!StringUtils.isEmpty(lang)) {
      //请求中有lang参数，分割语言和国家
      String[] temp = lang.split("_");
      if (temp.length == 1)
        //没有国家信息，直接返回lang
        return new Locale(lang);
      else
        //有国家信息，组合语言和国家后返回
        return new Locale(temp[0], temp[1]);
    } else {
      //请求中没有lang参数，返回浏览器请求头的语言偏好
      return request.getLocale();
    }
  }

  @Override
  public void setLocale(HttpServletRequest request, HttpServletResponse response, Locale locale) {

  }
}
```

做完这些后还不够，我们必须把解析器加入到spring boot项目中才行。

在config包中的MVCconfig类中加入（这是笔者在*自学笔记一*中创建的类，如果没有也可以自行创建）：

只有使用`@Bean`注解，这个类才会作为对象被加入到项目中：
```java
  @Bean
  public LocaleResolver localeResolver() {
    return new MyLocaleResolver();
  }
```

测试一下，运行成功！

点击`中文`：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/a47b898ef856be23171318d26a222c05.png)
点击`English`:
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/0dd175cb9ef1a18bf53e9310ac412bb9.png)
完整项目路径：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/5d39b895468637abc7b7685ebb20376f.png)
