---
title: 用html+js实现一个简单的登录窗口
date: 2020-04-20 14:18:26
tags: [前端,HTML,JavaScript]
categories: 前端
description: 本文将介绍如何用html+js实现一个简单的登录窗口，包括登录验证和注册功能。
---

@[toc]
# 绘制UI界面
首先我们绘制出基本的不带功能的`ui`界面，这个界面需要创建一个表单，表单内包含一个`username`文本框，一个`password`文本框，一个登录按钮和一个注册按钮，目前它们都没有实现功能，因为并未引入`js`脚本。

注意登录操作一般使用`post`方法而不是`get`方法，因为后者会把用户提交的信息（如密码）直接显示在`url`内，这样非常不安全。
## 了解text文本框属性
`text`中有如下属性：
1. `placeholder`用于在用户输入值之前显示提示信息；
2. `pattern`用于检测用户输入的内容是否与要求匹配，这里用正则表达式`"\w+"`限定内容，指的是文本框中的内容必须只有字母、数字和下划线；
3. `autofocus`使得用户可以使用tab键在文本框之间跳转，方便用户使用；
4. `tabindex`配合`autofocus`使用，用于给控件排好序号（从1开始），这样用户按tab时就会从tabindex=1的控件逐个往下跳转，超出后便会循环。
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login System</title>
</head>
<body>
<!--使用post方法以保证账户安全-->
<form action="login/login.html" method="post" onsubmit="return SignIn()">
<!--使用table来达成文本框之间的对齐效果-->
  <table class="login-window">
    <tr>
      <td><label for="username">Username:</label></td>
      <td><input id="username" pattern="\w+" type="text"
                 placeholder="Enter your username" tabindex="1" autofocus></td>
    </tr>
    <tr>
      <td><label for="password">Password:</label></td>
      <td><input id="password" pattern="\w+" type="password"
                 placeholder="Enter your password" tabindex="2"></td>
    </tr>
    <tr>
      <!--登录按钮-->
      <td><input id="sign-in-btn" type="submit" value="Sign in" tabindex="3"></td>
      <!--注册按钮-->
      <td><input id="sign-up-btn" type="button" value="Sign up" tabindex="4"></td>
    </tr>
  </table>
</form>
<div id="tst"></div>
</body>
</html>
```
## UI界面效果
效果如下：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/57c97e7fd14a70c398bad2a5a810807f.png)
# 绘制登录后界面
接下来我们要写一个login界面，这样就为登录后提供了一个新的界面。

这里写的很简单，因为重点并不在此，登录后我们显示一个登录成功的信息，插入一张动图，并提供一个返回主页的按钮。
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>login</title>
</head>
<body>
<span>
  <p>Login finished!</p>
  <img src="../image/pic_yuigahama.gif" width="123" height="117" alt="pic_yuigahama">
  <br/>
  <a href="../index.html" tabindex="1">Exit</a>
</span>
</body>
</html>
```
效果如下：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/1ad5a9c8c5f0c1880b143d4d3ae97d07.png)
# 实现登录验证脚本
最后我们要做的，就是判断用户是否登录成功。
事实上，如果要真正制作一个可以使用的登录界面，我们需要建立一个数据库来存储账户信息，此处只为演示登录效果，我们就直接把账户信息存入一个临时数组，这个数组的奇数位是用户名，偶数位是密码。

```js
//声明一个全局数组变量模拟数据库
var datalist = ["YuigahamaYui", "123456"];

//当网页加载完成时，获取注册按钮的句柄，为其添加函数实现功能
  window.onload=function() {
    document.getElementById('sign-up-btn').addEventListener('click', SignUp);
  };

/**
 * @return {boolean}
 */
//submit指定的函数功能，返回true则代表登录成功
function SignIn() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  for (let i = 0; i < datalist.length; i += 2) {
  //逐个检测数组内的用户名和密码是否的输入值匹配，若发现匹配则返回true
    if (username === datalist[i] && password === datalist[i + 1])
      return true;
  }
  //若没有发现一致的用户名和密码则返回false并弹出登录失败提示信息
  alert("Login failed!");
  return false;
}

//实现注册操作
function SignUp() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  //从文本框取得id后插入到数组中
  datalist.push(username);
  datalist.push(password);
  //弹出“注册成功”提示信息
  alert("Register finished!");
}
```
# 运行效果
到了这里，我们就差不多实现了一个登录窗口的完整功能，此时只要在文本框中输入对应的用户名“YuigamahaYui”和密码“123456”，由比滨就可以登录到她的界面了！若是登录失败，则会弹出提示信息。

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/155e7ba3d01096e9def616a59a842395.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/49deb0060d767c0b47cbb89d8bee697b.png)
此时雪乃想登录网页，但她并没有注册，此时便会报错。![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/9871f5fb034bf259476fbc91638c25cd.png)
此时只需要点击注册，雪乃的账户信息就被填入模拟数据库啦！
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/85562aacd71986980d515524b33d245d.png)
再次发起登录，便显示登录成功。
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e0d5c686dd9a6d04c02bb8a79fdfd59f.png)