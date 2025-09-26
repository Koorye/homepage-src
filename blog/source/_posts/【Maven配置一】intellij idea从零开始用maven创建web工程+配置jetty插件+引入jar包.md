---
title: 【Maven配置一】intellij idea从零开始用maven创建web工程+配置jetty插件+引入jar包
date: 2020-04-28 16:34:51
tags: [后端,Maven]
categories: 后端
description: Maven是一个项目管理工具软件，它基于项目对象模型（POM），可以通过一小段描述信息来管理项目的构建，报告和文档的项目管理工具软件。通过使用Maven，我们可以便捷的使用一段代码来引入jar包，从而不再为杂乱的引用而烦恼，同时远离jar包各种报错的折磨。
---

`Maven`项目对象模型`(POM)`，可以通过一小段描述信息来管理项目的构建，报告和文档的项目管理工具软件。

通过使用`Maven`，我们可以便捷的使用一段代码来引入`jar`包，从而不再为杂乱的引用而烦恼，同时远离`jar`包各种报错的折磨。

----

# 创建项目
## 新建项目
选择`Maven` → `org.apache.maven.archetypes:maven-archetype-webapp` → `maven-archetype-webapp:RELEASE` → `NEXT`

此处的`webapp`千万不能选错，必须要选择`apache.maven`下的`webapp`，否则会出现严重问题！（我会说我在这里卡了3个小时嘛）
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/14953bf9d7444dae9817fed87e46e5c6.png)

----
## 项目命名
- `Name`: 项目名
- `Location`: 项目路径
- `GroupId`: 第一段为域，第二段为公司名/组名，最后一段一般为项目名；域又分为`org`、`com`、`cn`等等许多，其中`org`为非盈利组织，`com`为商业组织
- `Artifactid`: 不带版本号的项目名，要求使用小写字母，且没有特殊符号
- `Version`: 版本，默认的`SNAPSHOT`代表快照
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/3f3dae84aa506badebcfabd64e474bba.png)

----
## 配置Maven
- `Maven home directory`: `Maven`的安装路径，这里笔者已经下载安装好`Maven`（`idea`其实已经集成好`Maven`，因此也可以使用自带的`Maven`)
- `User setting file`: 配置文件，此处可以使用安装目录下自带的`Maven/conf/settings.xml`，也可以自己编写。
- `Local repository`: 仓库目录，可以自己设定`jar`包的下载位置
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/81f0bae821f5c62f9ca104071a49a13b.png)
这是笔者使用的配置文件，它将仓库设置到自定义的目录下，并使用阿里提供的镜像文件代替官方仓库，以加快下载速度。
```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
    
    <pluginGroups />
    <proxies />
    <servers />
    
    <localRepository>D:/server/maven/repository</localRepository>
    
    <mirrors>
        <mirror>
            <id>alimaven</id>
            <mirrorOf>central</mirrorOf>
            <name>aliyun maven</name>
            <url>http://maven.aliyun.com/nexus/content/repositories/central/</url>
        </mirror>
        <mirror>
            <id>alimaven</id>
            <name>aliyun maven</name>
            <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
            <mirrorOf>central</mirrorOf>
        </mirror>
        <mirror>
            <id>central</id>
            <name>Maven Repository Switchboard</name>
            <url>http://repo1.maven.org/maven2/</url>
            <mirrorOf>central</mirrorOf>
        </mirror>
        <mirror>
            <id>repo2</id>
            <mirrorOf>central</mirrorOf>
            <name>Human Readable Name for this Mirror.</name>
            <url>http://repo2.maven.org/maven2/</url>
        </mirror>
        <mirror>
            <id>ibiblio</id>
            <mirrorOf>central</mirrorOf>
            <name>Human Readable Name for this Mirror.</name>
            <url>http://mirrors.ibiblio.org/pub/mirrors/maven2/</url>
        </mirror>
        <mirror>
            <id>jboss-public-repository-group</id>
            <mirrorOf>central</mirrorOf>
            <name>JBoss Public Repository Group</name>
            <url>http://repository.jboss.org/nexus/content/groups/public</url>
        </mirror>
        <mirror>
            <id>google-maven-central</id>
            <name>Google Maven Central</name>
            <url>https://maven-central.storage.googleapis.com
            </url>
            <mirrorOf>central</mirrorOf>
        </mirror>
        <!-- 中央仓库在中国的镜像 -->
        <mirror>
            <id>maven.net.cn</id>
            <name>oneof the central mirrors in china</name>
            <url>http://maven.net.cn/content/groups/public/</url>
            <mirrorOf>central</mirrorOf>
        </mirror>
    </mirrors>
</settings>
```
稍作等待，项目就生成完成了。
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2152ecdc7a29a1496fd9067c6691f8fc.png)


----
## 配置Tomcat服务器（使用本地文件）
点击右上角的`ADD CONFIGURATION` → 点击左上角的+号 → `Tomcat Server` → `Local`，新建一个Tomcat配置。
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/b1ac9153af48bbd72712c2f7fc976880.png)
点击右下角的`FIX`，选择`xxx_war_exploded`.

`war exploded`模式是将`WEB`工程以当前文件夹的位置关系上传到服务器，即直接把文件夹、`jsp`页面 、`classes`等等移到`Tomcat`部署文件夹里面，进行加载部署。

如果没有`xxx_war_exploded`选项，在`Settings` → `Build, Execution, Deploy` → `Build Tools` → `Maven` → `Importing` → 勾选`Import Maven projects automatically`
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/f78a1d6123752894dc246a782d2163da.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/13041b1523a776368d4f572728a00742.png)

最后，点击运行，`web`项目就成功打开啦。（项目已经为我们自动生成了一个带有`Hello World!`的`index.jsp`）

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/f5f873f7eced3c76164cb616d5adde7e.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2bac79998cc0aea1fa0a5056176ce741.png)


----
----
# 引入jar包
## 使用jetty插件搭建服务器
### 关于Tomcat和Jetty
使用外部的`Tomcat`程序作为服务器固然可行，然而在使用外部的`Tomcat`时，我们在向`Maven`中引入`jar`的同时，也要在`Tomcat/lib`中加入`jar`，这使得项目的构建变得麻烦，违背了`Maven`便于管理的初衷。

于是，`Maven`给我们提供了更轻量便捷的方式——使用内嵌的服务器插件。`Maven`支持内嵌`Tomcat`，所谓内嵌，即我们不需要额外下载`Tomcat`，只要引入依赖即可使用，故免去了修改外部文件的麻烦。

在本文中，笔者使用`Jetty`插件作为演示，`Maven`同样可以内嵌`Jetty`，`Jetty`与`Tomcat`都可以搭建服务器，但是`Jetty`更加轻量化和灵活，适合小型项目。

### 添加plugin项
找到`pom.xml`，`pom.xml`主要描述了项目的`maven`坐标，依赖关系，开发者需要遵循的规则，缺陷管理系统，组织和`licenses`，以及其他所有的项目相关因素，是项目级别的配置文件。

在`pom.xml`内`<build>` →`pluginManagement` → `<plugins>`中加入以下内容：

- `groupId`: 组名
- `artifactId`: jar名
- `version`: 版本
- `scanIntervalSeconds`: 扫描时间，即多久扫描一次文件是否变动，若有变动就会修改项目
- `port`: 端口号（可以自定义，不过为了不与`Tomcat`冲突，一般不设为8080）
- `contextPath`: 根目录，设为`/`即没有额外的目录，该配置的根目录为`http://localhost:8080/`

```xml
<plugin>  
  <groupId>org.eclipse.jetty</groupId>
  <artifactId>jetty-maven-plugin</artifactId>
  <version>9.4.5.v20170502</version>
  <configuration>
    <scanIntervalSeconds>10</scanIntervalSeconds>
    <httpConnector>
    <port>8888</port>
    </httpConnector> 
    <webApp>
      <contextPath>/</contextPath>
    </webApp>
  </configuration>
</plugin>
```

配置好之后`Maven`就会自动下载`jar`，并更新到项目中。

其实关于公司名、`jar`名、版本号，我们并不需要自己书写，我们可以通过查询：[https://mvnrepository.com/](https://mvnrepository.com/)获取对应的信息。

例如搜索`jetty`，选择对应的版本号，就可以得到：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e39253158476bfdac92edffba4fa8d01.png)
### 配置命令行
接下来我们来配置启动`jetty`插件的命令行，同样点击右上角 → 选择`Edit Configurations` → 在左边栏找到`Maven` → 在`Command line`中输入`clean jetty:run`，并将配置命名。

这样做之后，每次运行该配置，就相当于在命令行中输入：
```cmd
mvn clean
mvn jetty:run
```
从而启动`Jetty`服务器。
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/750208abd907afd301d58cbc84577599.png)
运行效果：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/111c9c534ce2db4ef0143c4246c838e4.png)

----
## 案例：引入jstl包
我们再来演示一下在`Maven`中使用`jstl`的方法，以体现其便捷。

### 添加dependency项

同样，在`pom.xml`内`<dependencies>`标签内引入，**这次不是plugin** ，`dependencies`代表依赖，`plugin`则是插件：
```xml
<dependency>
  <groupId>javax.servlet</groupId>
  <artifactId>javax.servlet-api</artifactId> 
  <version>3.0.1</version>
  <scope>provided</scope>
</dependency>
<dependency>
  <groupId>javax.servlet.jsp</groupId>
  <artifactId>jsp-api</artifactId>
  <version>2.1</version>
  <scope>provided</scope>
</dependency>
<dependency>
  <groupId>javax.servlet</groupId>
  <artifactId>jstl</artifactId>
  <version>1.2</version>
</dependency>
```

等待`jar`下载配置完成，我们就可以直接使用`jstl`了，是不是很方便呢？我们来试一下。

首先引入标签库，设置前缀，然后尝试一下`forEach`循环语句：
```js
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<body>
<h2>Hello World!</h2>
<c:forEach var="i" begin="1" end="10">
  ${i}<br>
</c:forEach>
</body>
</html>
```
运行效果：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/3f08b18d9e278743dddc214b184e9628.png)
我们本想得到从1到10的循环，此处显示的却是10个`el`表达式，难道`jstl`的引入有问题？显然不是，如果`jstl`有问题，我们连循环语句都无法使用。

### 启用el表达式
显然，这里的问题不是`jstl`，而是`el`表达式，在`Maven`环境下，`el`表达式默认是不启用的，浏览器会将`el`表达式作为普通的字符串处理。

为了启用`el`表达式，我们需要在`jsp`的开头添加：
```js
<%@ page isELIgnored="false" %>
```
即不忽略`el`表达式，这样就可以正常运行啦：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/c720c0bcd6c7b987d3353e93ceb3f8e6.png)


