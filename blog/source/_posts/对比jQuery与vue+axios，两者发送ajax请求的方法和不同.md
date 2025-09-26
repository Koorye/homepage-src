---
title: 对比jQuery与vue+axios，两者发送ajax请求的方法和不同
date: 2020-05-07 13:23:01
tags: [前端,Vue]
categories: 前端
description: 本文对比了jQuery和vue+axios发送ajax请求的方法和不同之处，包括发送请求的方式和接收数据的方式。
---

axios和jQuery的ajax本质上都是对原生XHR的封装，不过axios符合最新的ES规范。因此，在用vue编写js时，使用axios而不是jQuery的ajax应该是更好的方案。

axios和jQuery的ajax用法大多相同，不过还是有少数地方不一样，我们来对比一下。由于axios经常与vue结合，这里笔者采用vue+axios实现axios版ajax。

# post请求
## 准备控制器
首先实现一个后台控制器，笔者此处采用spring boot，可以看到，这个控制器需要一个请求参数id，然后会返回一个包含id和msg信息的json：
```java
package com.koorye.hellokotlin.controller;

import com.alibaba.fastjson.JSON;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
public class MsgControllerJava {
  @ResponseBody
  @RequestMapping("/msg")
  public Object getMsg(int id) {
    Map<String, Object> map = new HashMap<>();
    map.put("id", id);
    map.put("msg", "A message from Controller.");
    return JSON.toJSON(map);
  }
}
```

## 准备html

我们来准备两个按钮：
- jQuery给按钮提供click事件需要用选择器，因此这里提供一个id
- vue+axios只需要使用`v-on:click`或者简写`@click`就可以指定事件
```html
  <button class="btn btn-primary" @click="getMsg">Vue + Axios</button>
  <button id="ajaxBtn" class="btn btn-secondary">Vue + JQuery</button>
```

## 实现ajax请求

请关注以下不同：

- 发送参数的方式
- 接收参数的方式

### vue+axios版ajax
此处需要引入Qs来转换数据类型：

```js
new Vue({
  el: '#app',
  methods: {
    getMsg() {
      axios({
        method: 'post',
        url: '/msg',
        data: Qs.stringify{
          id: 111
        },
        responseType: 'json',
      }
      .then(function (resp) {
        alert(resp.data.id + ", " + resp.data.msg);
      })
      .catch(function (error) {
        alert(error);
      })
    }  
  }
});
```

### jQuery版ajax

```js
$(function () {
  $('#ajaxBtn').click(function () {
    $.ajax({
      method: 'post',
      url: '/msg',
      data: {
        'id': 222
      },
      dataType: 'json'
    })
    .done(function (resp) {
      alert(resp.id + ", " + resp.msg);
    })
    .fail(function (error) {
      alert(error);
    })
  })
})
```

### 发送参数的不同

传统的jquery把请求数据封装在data中，data是json的形式，需要用引号表示成员名；

而axios+qs的形式不需要使用引号，再通过`Qs.stringify()`把数据转换成json。

我们来看一下axios不使用`Qs.stringify()`会发生什么：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2f7f46352e4215f8d4d6ea556ed127a0.png)
报了500错误？再来看一下发送的参数：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/515b811255bb0e28f523c37a0a21706f.png)
Request Payload？那么正常的参数是什么呢，下面是jQuery发送的参数：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/22f18ccdd8ebc39d047851facf5bc104.png)
可以看到，正常发送的参数应该是Form Data，这样后台才能接收到一个json；如果是Request Payload，后台还需要额外的解析才能得到其中的json。

所以，**jQuery可以直接在data中编写json来发送post请求；而axios需要把编写的内容通过Qs转换成json字符串才能发送post请求。**

### 接收参数的不同
观察上面的脚本我们发现，jQuery可以直接通过resp.id、resp.msg得到json中的数据，axios的数据却存在resp.data中。

我们来试一下把得到的json转换成字符串，使用`JSON.stringify(resp)`转换再用`alert(JSON.stringify(resp))`输出：

jQuery的ajax返回的json：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/55da432bdb985c6614353c140449aada.png)
axios返回的json:
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/b61f2f2e91e0c58717d8cec22d1571d7.png)
可以看到jQuery返回的json中只有数据；axios却返回了各种信息，如状态码、时间、url、请求方法等，其数据存在data成员中，这就是我们获取数据方法不同的原因。


----

# get请求
既然请求方法只需要指定method，那么，如果我们直接把两个脚本中的method改成get，能否正常使用呢？

jQuery正常运行：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/962a1add536461333e45c7019dffb8ac.png)
axios报500状态码错误：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/6a1c905347cfa28a8e74fd927c395f8d.png)
检查请求头，**我们发现axios没有传入任何信息，甚至在去掉Qs.stringify和给id加上引号之后还是一样**：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/36408f935ac2e39c9e9e569b1ce55b99.png)
这说明axios不能通过data给get请求提供参数。

## get和post的差别
事实上，get请求通过在url后直接跟上参数来发送请求，例如localhost:8080/login/?username=koorye&password=123，就是给后台发送了username为koorye，password为123的参数。

而post则是使用request body传递参数，参数不存入url中，而是以额外的键值对的方式传递。

## jQuery与axios的data在发送get请求时的不同

观察一下上文中jQuery和axios发送get请求时的url：

**jQuery会根据请求类型自动判断把data放到url中还是request body中**，此处jQuery发送的get请求的url就带上了参数：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/03c6cdad4a08449ca4acd432e4612dee.png)
而axios就不行，axios的data只用于给request body提供参数，而不能在url中附加参数：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/ee9caed2563f92ea549eaf8cc8531382.png)
## axios的get请求方式
axios发送get请求时不能使用data，而要使用axios提供的一种新的类型`params`，params其中的参数会被直接加到url后，我们来试一下：
```js
new Vue({
  el: '#app',
  methods: {
    getMsg() {
      axios({
        method: 'get',
        url: '/msg',
        params: {
          'id': 111
        },
        responseType: 'json',
      })
      .then(function (resp) {
        alert(resp.data.id + ", " + resp.data.msg);
      })
      .catch(function (error) {
        alert(error);
      })
    }
  }
});
```
成功发送请求并接收数据：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/0c70dccc8a95945c25148c5a6dae4abb.png)
请求头的url中成功附上参数：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/ad27e5cf760508ec9107f6fb026b43e7.png)

----

# 总结

到这里，我们已经成功使用jQuery和axios的ajax各自完成了get和post请求的参数发送和结果获取，我们来总结一下不同之处：

**关于发送请求:**

- jQuery无论是get还是post，都使用data发送数据，jQuery会自动判断请求类型并匹配
- axios在get请求时使用params；在post请求时使用data，并且要注意把发送的data通过`Qs.stringify()`转换成json

**关于接收数据:**

- jQuery接收的数据直接以json的形式存在返回的response中
- axios接收一个json形式的response，返回的数据存在response的data参数中