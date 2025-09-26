---
title: 【最新】Qt5.13及以上版本如何访问MySQL数据库
date: 2020-06-05 01:45:32
tags: [前端,Qt,MySQL]
categories: [前端]
description: Qt访问数据库的坑还是挺多的。在5.13及以上版本中，QMYSQL驱动被去除了，不能直接使用。在新版本中访问MySQL还是挺麻烦的，故在此记录一下。
---

Qt访问数据库的坑还是挺多的。在5.13及以上版本中，QMYSQL驱动被去除了，不能直接使用。在新版本中访问MySQL还是挺麻烦的，故在此记录一下。

# 安装Qt时的坑
首先前往官网下载Qt：[Qt下载地址](http://download.qt.io/archive/qt/)

这里我选择最新的5.14.2目录下的`qt-opensource-windows-x86-5.14.2.exe`.

下载后双击安装，注意选择组件界面：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7fec66a0cc020c65e5281f870456a652.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/bf61e3e54d6532a991f8dabfedb4940d.png)
此处有两个注意事项：

1. 必须选上Sources，里面有MySQL依赖的dll
2. 要根据MySQL的位数选择对应的编译器，如64位的MySQL必须使用64位的MingW才能正常访问（网传如此，笔者未测试过32位是否使用）

别的组件根据自己的需求添加即可，安装部分就讲到这里。

----
# 配置驱动
此时我们就可以查看一下Qt中有哪些sql驱动了。

新建一个Qt Console Application项目用于测试，选择MingW-64bit作为Debugger.

在.pro文件中加入以下语句，引入sql功能：
```pro
QT += sql
```

main.cpp写法如下：
```cpp
#include <QCoreApplication>
#include <QSqlDatabase>
#include <QDebug>

int main(int argc, char *argv[]) {
  QCoreApplication a(argc, argv);

  QStringList drivers = QSqlDatabase::drivers();
  foreach(QString driver, drivers)
  qDebug() << driver;

  return a.exec();
}

int main(int argc, char *argv[]) {
  QCoreApplication a(argc, argv);

  QStringList drivers = QSqlDatabase::drivers();
  foreach(QString driver, drivers)
  qDebug() << driver;

  return a.exec();
}
```

输出结果：
```shell
"QSQLITE"
"QODBC"
"QODBC3"
"QPSQL"
"QPSQL7"
```

输出结果中并没有我们想要的QMYSQL驱动，我们需要另行配置。

## 添加驱动

打开`\Qt5.14.2\5.14.2\Src\qtbase\src\plugins\sqldrivers\mysql`目录下的mysql.pro文件启动项目，对mysql.pro作出以下修改：
```pro
# QMAKE_USE += mysql # 暂时屏蔽mysql
...
INCLUDEPATH += "D:\software\system\mysql-8.0.19-winx64\include" # MySQL安装路径下的include目录
LIBS += "D:\software\system\mysql-8.0.19-winx64\lib\libmysql.lib" # MySQL安装路径下的库文件
DESTDIR  = ../mysql/lib/ # 输出目录
```

运行之后会报错，不要紧，找到同级目录下的lib目录，所需dll已经生成：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/acd1702f4294ddd01e766b525ec9f766.png)
将生成的dll文件放入对应编译器的`plugins\sqldrivers`目录中，这里存放了所有sql驱动，此处我放到`Qt5.14.2\5.14.2\mingw73_64\plugins\sqldrivers`中：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/d7f083cdf8a68bc249c14c08c76b5a17.png)
再次运行测试程序，输出结果：
```shell
"QSQLITE"
"QMYSQL"
"QMYSQL3"
"QODBC"
"QODBC3"
"QPSQL"
"QPSQL7"
```
我们所需的QMYSQL驱动已经存在。

## 添加依赖
有了驱动之后还不够，我们还需要引入mysql中的dll文件，打开mysql安装路径：`mysql-8.0.19-winx64\lib`，复制其中的`libmysql.dll`和`libmysql.lib`到项目编译后的目录中，本例为与项目目录同级的`build-sql_test-Desktop_Qt_5_14_2_MinGW_64_bit-Debug`，这也意味着最后的打包程序中也需要手动添加这两个依赖。

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/8bdb3299d56385326c6adab73bb61777.png)

----
# 访问操作
我们来试验一个简单的遍历全表：
```cpp
#include <QCoreApplication>
#include <QSqlDatabase>
#include <QSqlQuery>
#include <QDebug>

int main(int argc, char *argv[]) {
  QCoreApplication a(argc, argv);

  QSqlDatabase db = QSqlDatabase::addDatabase("QMYSQL"); // 数据库类型
  db.setHostName("localhost"); // 主机名
  db.setPort(3306);
  db.setDatabaseName("hello_mysql"); // 数据库名称
  db.setUserName("root"); // 用户名
  db.setPassword("123"); // 密码

  if(!db.open()){
    qDebug()<<"Unable to establish a database connection";
  }else{
  QSqlQuery query(db);

  query.exec("select * from user");
  while(query.next())
    qDebug()<<query.value(0).toString() // 访问方式一，通过列数索引
    <<query.value("name").toString(); // 访问方式二，通过列名

  db.close();
  }

  return a.exec();
}
```
输出结果：
```shell
"1" "雪之下雪乃"
"2" "小木曾雪菜"
"4" "友利奈绪"
"5" "晓美焰"
"6" "冬马和纱"
"7" "雪之下阳乃"
```

这就是新版Qt访问MySQL的全过程。