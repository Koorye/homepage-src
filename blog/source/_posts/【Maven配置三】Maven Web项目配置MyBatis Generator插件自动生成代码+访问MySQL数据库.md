---
title: 【Maven配置三】Maven Web项目配置MyBatis Generator插件自动生成代码+访问MySQL数据库
date: 2020-04-30 15:52:40
tags: [后端,MyBatis,Maven]
categories: 后端
description: 本文介绍了如何使用Maven配置MyBatis Generator插件自动生成代码，通过MyBatis访问MySQL数据库。
---

我们知道`MyBatis`的框架为我们操作数据库大大减小了工作量，然而实现类和`mapper`映射仍然需要我们自己编写。

`MyBatis Generator`为我们很好的解决了这个问题，它能自动生成实现类和`mapper`映射，我们要做的只是直接调用它生成的代码访问数据库。

那我们就开始配置`MyBatis Generator`，**以下操作全都基于`MyBatis`框架配置完成的情况！**

----

# 配置xml
## 配置pom.xml
在`pom.xml`的`<plugins>`标签中加入以下内容：

- `verbose`: 指定结果会输出到控制台
- `overwrite`: 新生成的文件会覆盖旧文件，不设置此选项新内容将会追加到原文件尾
```xml
<plugin>
  <groupId>org.mybatis.generator</groupId>
  <artifactId>mybatis-generator-maven-plugin</artifactId>
  <version>1.3.7</version>
  <configuration>
    <verbose>true</verbose>
    <overwrite>true</overwrite>
  </configuration>
</plugin>
```
## 配置GeneratorConfig.xml
在`src/main/resources`中创建`GeneratorConfig.xml`，输入以下内容：

- `jdbcConnection`中的设置我们已经很熟悉，输入驱动、`URL`、用户名和密码
- 在`javaModelGenerator`和`sqlMapGenerator`的`targetPackage`中指定生成的位置
本例中`targerPackage="pojo"`即让实现类生成到`main/java/pojo`包中
- `table`用于指定要生成的数据库中的数据表名，可以有多个`table`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
    PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
    "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">
<generatorConfiguration>
  <!--mysql 连接数据库jar 这里选择自己本地位置-->
  <classPathEntry location="D:\software\system\mysql-8.0.19-winx64\lib\mysql-connector-java-8.0.19.jar"/>
  <!--实例-->
  <context id="MysqlGenerator" targetRuntime="MyBatis3">
    <!--数据库连接-->
    <jdbcConnection driverClass="com.mysql.cj.jdbc.Driver"
                    connectionURL="jdbc:mysql://localhost:3306/hello_mysql?useUnicode=true&amp;characterEncoding=UTF-8&amp;serverTimezone=UTC"
                    userId="root"
                    password="123"/>
    <!--生成POJO类-->
    <javaModelGenerator targetPackage="pojo" targetProject="src/main/java">
      <!-- 是否对model添加 构造函数 -->
      <property name="constructorBased" value="true"/>
      <!-- 是否允许子包 -->
      <property name="enableSubPackages" value="false"/>
      <!-- 建立的Model对象是否不可改变,即生成的Model对象不会有setter方法只有构造方法 -->
      <property name="immutable" value="false"/>
      <!-- 是否对类CHAR类型的列的数据进行trim操作 -->
      <property name="trimStrings" value="true"/>
    </javaModelGenerator>
    <!--Mapper映射文件的生成配置,指定包位置和实际位置-->
    <sqlMapGenerator targetPackage="mapper" targetProject="src/main/java"/>
    <!--Mapper接口生成的配置,指定包位置和实际位置-->
    <javaClientGenerator type="XMLMAPPER" targetPackage="mapper" targetProject="src/main/java"/>
    <table tableName="users"/>
  </context>
</generatorConfiguration>
```

----

# 配置命令行
在`intellij idea`中点击右上角的`Edit Configurations`：![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/850c5cd25ab8a1b9fa57d51dc99ff27c.png)
 点击左侧加号 → 在左侧栏中找到`Maven` → 在`Command line`中输入`mybatis-generator:generate -e`（`-e`指定结果显示到控制台中），并为配置命名：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/b9b4bf076c2366752454fb0f46d6ff89.png)
接下来，我们就可以启动运行项目啦，运行之后，`MyBatis Generator`就为我们指定的`Users`表生成了`mapper`包和`pojo`包：

- `mapper`: 提供了`Mapper`接口，`Mapper.xml`配置文件
- `pojo`: 提供了`Users`实现类，`Example`用于辅助查询的类

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7b19642ba3155ecba53f85217978abd4.png)

----

# 使用生成的代码访问Mysql
在提供`Servlet`之前，我们先来看一下生成的文件，注意到生成的`mapper`并不像之前在`resources`中，而是在`java`中，那么此时要怎么访问映射文件呢？

## 修改mybatis-config.xml
这是我们原来访问映射文件的方法：
```xml
<mappers>
  <mapper resource="xxxmapper.xml"/>
</mappers>
```
我们将其修改为：
```xml
  <mappers>
    <package name="mapper"/>
  </mappers>
```

这是利用包名访问映射文件的方法，通过指定包含所有映射文件和接口的包目录，`mybatis`将读取包中的所有接口文件和对应的同名映射文件。

如果要通过这种方式访问映射，我们需要在接口中声明需要的操作方法并在`mapper`中实现方法，这些代码`MyBatis Generator`已经帮我们自动生成了。

## 实现servlet
接下来我们来实现一个`servlet`，在`main/java`中创建`service`包，包中创建`UsersServlet`类，前面创建`factory`和`session`类的过程和之前没有区别：
```java
package service;

import mapper.UsersMapper;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import pojo.Users;
import pojo.UsersExample;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class UsersServlet extends HttpServlet {
  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    System.out.println("UsersServlet: GET");
    InputStream stream = Resources.getResourceAsStream("mybatis-config.xml");
    SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(stream);
    SqlSession session = factory.openSession();
  }

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    this.doGet(req, resp);
  }
}
```
`MyBatis Generator`为我们使用session访问数据库提供了很多种方法，我们先得到一个`mapper`映射
```java
UsersMapper mapper = session.getMapper(UsersMapper.class);
```
而`mapper`有很多方法，首先`mapper`可以实现`select`、`insert`、`update`、`delete`、`count`操作，然后对于每种操作，又提供了不同的条件：

- `ByPrimaryKey`: 根据主键增删改查
- `ByExample`: 根据`example`辅助类删改查（不能增）
- `Selective`: 选择性的增删改（不能查）

我们来写几个例子：
```java
//查找主键为3的数据
Users user = mapper.selectByPrimaryKey(3);

//查找所有id不为空的数据
UsersExample example = new UsersExample();
    example.createCriteria().andIdIsNotNull();
    List<Users> usersList = mapper.selectByExample(example);

//选择性的插入值（只会插入非空值）
Users record = new Users(null, "John", null);
    mapper.insertSelective(record);
```

这里简单说一下`selective`，对于这个例子`record(null,"John",null)`：

- `mapper.insert`相当于：
`insert into users value(null,'John',null)`
- `mapper.insertSelective`则相当于：
`insert into users(name) value('John')`

笔者实现了一个`servlet`类：
```java
package service;

import mapper.UsersMapper;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import pojo.Users;
import pojo.UsersExample;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class UsersServlet extends HttpServlet {
  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    System.out.println("UsersServlet: GET");
    InputStream stream = Resources.getResourceAsStream("mybatis-config.xml");
    SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(stream);
    SqlSession session = factory.openSession();
    UsersMapper mapper = session.getMapper(UsersMapper.class);
    UsersExample example = new UsersExample();
    example.createCriteria().andIdIsNotNull();
    List<Users> usersList = mapper.selectByExample(example);
    Users record = new Users(null, "John", null);
    mapper.insertSelective(record);
    req.setAttribute("usersList", usersList);
    req.getRequestDispatcher(req.getContextPath() + "index.jsp").forward(req, resp);
  }

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    this.doGet(req, resp);
  }
}
```
我们启动服务器试一下效果：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/709d7acbacce29bd3bae847120236633.png)
点击超链接：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/9edd3f7eda81b86a5651ec0fe8a0d952.png)
报错`HTTP ERROR 500`，关键信息：Invalid bound statement (not found): mapper.UsersMapper.selectByExample

服务器并没有找到`UsersMapper`映射，这是为什么呢？

## 解决找不到映射的错误
我们来观察一下生成的`target`文件，发现`mapper`包中只生成了接口，却没有映射：![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/960548b7bbd033e6fb07e5ed9a721e40.png)
要解决此问题，我们需要在`pom.xml`的`<build>`标签中加入：
```xml
 <resources>
      <resource>
        <directory>src/main/java</directory>
        <!-- 此配置不可缺，否则mybatis的Mapper.xml将会丢失 -->
        <includes>
          <include>**/*.xml</include>
        </includes>
      </resource>
      <!--指定资源的位置-->
      <resource>
        <directory>src/main/resources</directory>
      </resource>
    </resources>
```

这样映射文件就会正常生成，项目就可以正常访问啦：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/443ddb959b445afc86b2e9776caa3abb.png)

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/b790fefb58cac50baed0d41ec7f5934a.png)

----

# 附：关于MBG生成代码重复的问题
笔者为取消生成代码的注释文件，在`GeneratorConfig.xml`中加入了以下设置：
```xml
<commentGenerator>
  <!--取消时间戳-->
  <property name="suppressDate" value="true"/>
  <!--取消注释-->
  <property name="suppressAllComments" value="true"/>
</commentGenerator>
```
加入后却导致了意想不到的问题，**`mapper`文件中出现了重复代码！**，这直接导致报错。

笔者查询了网上的方法，如在`<table>`标签中设置用户名等，然而问题并未解决，直到把新版本的`mysql.connector.java-8.0.17`降级到`5.1.6`才正常运行。

因此，笔者推测这里是版本不兼容的问题， **暂时除降级外我还未找到更好的解决方法**。