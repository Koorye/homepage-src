---
title: 【jdbc编程】使用c3p0连接池对MySQL数据库进行访问
date: 2020-04-21 15:24:16
tags: [后端, MySQL, 连接池]
categories: 后端
description: 连接池是创建和管理一个连接的缓冲池的技术，这些连接准备好被任何需要它们的线程使用。即如果有大量用户访问数据库，连接池便可以为每个用户提供连接，用户访问完之后收回连接以备再次使用。连接池可以极大的改善用户的 Java 应用程序的性能，同时减少全部资源的使用。
---

# 介绍
连接池是创建和管理一个连接的缓冲池的技术，这些连接准备好被任何需要它们的线程使用。即如果有大量用户访问数据库，连接池便可以为每个用户提供连接，用户访问完之后收回连接以备再次使用。

连接池可以极大的改善用户的 Java 应用程序的性能，同时减少全部资源的使用。
## c3p0连接池下载地址
在这里我选择用c3p0作为连接池。c3p0可以以下链接进行下载：[c3p0下载](https://sourceforge.net/projects/c3p0/)

# 初始化连接池
```java
package hellomysql;

import com.mchange.v2.c3p0.ComboPooledDataSource;

import java.beans.PropertyVetoException;
import java.sql.Connection;
import java.sql.SQLException;

public class DataSource {
  public DataSource(String user, String password) {
    try {
      //初始化连接池
      dataSource = new ComboPooledDataSource();
      dataSource.setDriverClass("com.mysql.cj.jdbc.Driver");
      dataSource.setUser(user);
      dataSource.setPassword(password);
      //指定初始连接数为10
      dataSource.setInitialPoolSize(10);
      //指定最大连接数为50
      dataSource.setMaxPoolSize(50);
    } catch (PropertyVetoException event) {
      event.printStackTrace();
    }
  }

  public void setURL(String URL) {
    dataSource.setJdbcUrl(URL);
  }

  public Connection getConnection() {
    try {
      return dataSource.getConnection();
    } catch (SQLException e) {
      e.printStackTrace();
      return null;
    }
  }

  //使用ComboPooledDataSource类型作为连接池
  private ComboPooledDataSource dataSource;
}

```
通过这个类，我们就可以创建一个连接池，并从中得到一个连接：
```java
package hellomysql;

public class Main {
  public static void main(String[] args) {
    try {
      DataSource dataSource = new DataSource("root","root");
      dataSource.setURL("jdbc:mysql://localhost:3306/hello_mysql");
      Connection connection = dataSource.getConnection();
    } catch (Exception event) {
      event.printStackTrace();
    }
  }
}
```
## 异常：修复时区错误
但我在实际操作时会报异常：java.sql.SQLException: The server time zone value is unrecognized or represents more than one time zone. You must configure either the server or JDBC driver (via the serverTimezone configuration property) to use a more specifc time zone value if you want to utilize time zone support.

为解决此问题，我们要在URL内设置时区为标准世界时间，同时，最好将编码格式设为utf-8以便于中文读取。

我们把链接改为如下样式便可以解决问题：
```java
connector.setURL("jdbc:mysql://localhost:3306/hello_mysql?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC");
```

# 指定数据表
在实现DataSource类后，我们再创建一个Connector类，这样就可以在Connector类中指定对应的数据表并获取表头。

```java
package hellomysql;

import java.sql.*;
import java.util.ArrayList;

public class Connector extends DataSource {
  //设置登录MySQL数据库的用户名和密码
  public Connector(String user, String password) {
    //调用super访问父类的构造函数
    super(user, password);
    System.out.println("Welcome " + user + "!");
  }

  //指定要访问数据库中的哪个数据表
  public void setTable(String table) throws Exception {
    //用String类存储表名
    this.table = table;
    System.out.println("Table set success! The table is: " + table + ".");
    Connection connection = super.getConnection();
    //获取指定数据表的表头
    setHeader(connection);
  }

  public String getTable() {
    return table;
  }

  public ArrayList<String> getHeaders() {
    return headers;
  }

  //获取表头
  private void setHeader(Connection connection) throws Exception {
    String sql = String.format("select * from %s", table);
    PreparedStatement preparedStatement = connection.prepareStatement(sql);
    ResultSet resultSet = preparedStatement.executeQuery();
    headers.clear();
    //遍历表头行的每一个表头，并用ArrayList<String>类存储
    for (int i = 1; i <= resultSet.getMetaData().getColumnCount(); ++i)
      headers.add(resultSet.getMetaData().getColumnName(i));
  }

  private String table;
  private ArrayList<String> headers = new ArrayList<>();
}

```

这样，我们就可以创建一个Connector类，并为其指定用户名、密码、URL、数据表名：

```java
package hellomysql;

import java.util.ArrayList;

public class Main {
  public static void main(String[] args) {
    try {
      Connector connector = new Connector("root", "123");
      connector.setURL("jdbc:mysql://localhost:3306/hello_mysql?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC");
      connector.setTable("people");
    } catch (Exception event) {
      event.printStackTrace();
    }
  }
}
```

# 获取连接
接下来，我们就可以从Connector中返回连接分配给指定用户，用户就可以对数据表进行浏览和增删改查操作，我们再创建一个ConnectionUser用户类：

```java
package hellomysql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ConnectionUser {
  //构造函数，初始化时指定Connector
  public ConnectionUser(Connector connector) {
    connection = connector.getConnection();
    this.connector = connector;
  }
  
  //用于遍历数据表，数据表信息从Connector中获取
  public void viewData() throws Exception {
    String sql = String.format("select * from %s", connector.getTable());
    PreparedStatement preparedStatement = connection.prepareStatement(sql);
    ResultSet resultSet = preparedStatement.executeQuery();

    System.out.println("----------------------------");
    System.out.println(connector.getHeaders());
    //遍历输出每一行
    while (resultSet.next()) {
      for (String each : connector.getHeaders()) {
        System.out.print(resultSet.getString(each) + ", ");
      }
      //删除最后一行的逗号和空格
      System.out.print("\b\b");
      System.out.println();
    }
    System.out.println("----------------------------");
    System.out.println("View success!");
  }

  //重载另一个遍历数据表函数，这个函数可以通过指定表名来获取对应列
  public void viewData(String... dataType) throws Exception {
    String sql = String.format("select * from %s", connector.getTable());
    PreparedStatement preparedStatement = connection.prepareStatement(sql);
    ResultSet resultSet = preparedStatement.executeQuery();

    System.out.println("----------------------------");
    for (String each : dataType) {
      System.out.print(each + " ");
    }
    System.out.println();
    while (resultSet.next()) {
      for (String each : dataType) {
        System.out.print(resultSet.getString(each) + ", ");
      }
      System.out.print("\b\b");
      System.out.println();
    }
    System.out.println("----------------------------");
    System.out.println("View success!");
  }

  //关闭连接
  public void stopConnection() throws Exception {
    if (connection != null)
      connection.close();
  }

  //存储指定的Connector，以获取用户所要访问的URL和数据表信息
  private Connector connector;
  //存储从DataSource内获取的连接
  private Connection connection;
}

```

这样，我们就可以创建很多用户并对数据库进行访问了：
```java
package hellomysql;

import java.util.ArrayList;

public class Main {
  public static void main(String[] args) {
    try {
      Connector connector = new Connector("root", "123");
      connector.setURL("jdbc:mysql://localhost:3306/hello_mysql?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC");
      connector.setTable("people");

      //创建一个ArrayList类来存储用户
      ArrayList<ConnectionUser> users = new ArrayList<>();
      //创建10个用户
      for (int i = 0; i < 10; ++i) {
        users.add(new ConnectionUser(connector));
      }
      //每个用户都进行查询，以模拟10个用户同时访问数据库的情形
      for (ConnectionUser each : users) {
        each.viewData();
      }

      //关闭每个用户的连接，之所以不在上一个循环体内关闭，
      //是为了模拟多个用户的同时访问，以测试c3p0连接池的使用效果
      for (ConnectionUser each : users) {
        each.stopConnection();
      }
    } catch (Exception event) {
      event.printStackTrace();
    }
  }
}

```

# 运行效果
效果如下：
```java
D:\software\system\IdeaIU-2019.3.3\jdk\jdk-14\bin\java.exe -javaagent:D:\software\system\IdeaIU-2019.3.3\lib\idea_rt.jar=53693:D:\software\system\IdeaIU-2019.3.3\bin -Dfile.encoding=UTF-8 -classpath D:\programme\java\out\production\java;D:\software\system\mysql-8.0.19-winx64\lib\mysql-connector-java-8.0.19.jar;D:\software\system\mysql-8.0.19-winx64\lib\c3p0-0.9.5.5.jar;D:\software\system\mysql-8.0.19-winx64\lib\mchange-commons-java-0.2.19.jar hellomysql.Main
4月 21, 2020 3:01:25 下午 com.mchange.v2.log.MLog 
信息: MLog clients using java 1.4+ standard logging.
4月 21, 2020 3:01:26 下午 com.mchange.v2.c3p0.C3P0Registry 
信息: Initializing c3p0-0.9.5.5 [built 11-December-2019 22:07:46 -0800; debug? true; trace: 10]
Welcome root!
Table set success! The table is: people.
4月 21, 2020 3:01:26 下午 com.mchange.v2.c3p0.impl.AbstractPoolBackedDataSource 
信息: Initializing c3p0 pool... com.mchange.v2.c3p0.ComboPooledDataSource [ acquireIncrement -> 3, acquireRetryAttempts -> 30, acquireRetryDelay -> 1000, autoCommitOnClose -> false, automaticTestTable -> null, breakAfterAcquireFailure -> false, checkoutTimeout -> 0, connectionCustomizerClassName -> null, connectionTesterClassName -> com.mchange.v2.c3p0.impl.DefaultConnectionTester, contextClassLoaderSource -> caller, dataSourceName -> 1hgeby9a9175nsjevsaq70|129a8472, debugUnreturnedConnectionStackTraces -> false, description -> null, driverClass -> com.mysql.cj.jdbc.Driver, extensions -> {}, factoryClassLocation -> null, forceIgnoreUnresolvedTransactions -> false, forceSynchronousCheckins -> false, forceUseNamedDriverClass -> false, identityToken -> 1hgeby9a9175nsjevsaq70|129a8472, idleConnectionTestPeriod -> 0, initialPoolSize -> 10, jdbcUrl -> jdbc:mysql://localhost:3306/hello_mysql?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC, maxAdministrativeTaskTime -> 0, maxConnectionAge -> 0, maxIdleTime -> 0, maxIdleTimeExcessConnections -> 0, maxPoolSize -> 50, maxStatements -> 0, maxStatementsPerConnection -> 0, minPoolSize -> 3, numHelperThreads -> 3, preferredTestQuery -> null, privilegeSpawnedThreads -> false, properties -> {password=******, user=******}, propertyCycle -> 0, statementCacheNumDeferredCloseThreads -> 0, testConnectionOnCheckin -> false, testConnectionOnCheckout -> false, unreturnedConnectionTimeout -> 0, userOverrides -> {}, usesTraditionalReflectiveProxies -> false ]
----------------------------
[id, name, age]
1, Adam, 13
2, Amy, 18
3, Cathy, 15
4, Henry, 21
5, Hans, 17
----------------------------
View success!
----------------------------
[id, name, age]
1, Adam, 13
2, Amy, 18
3, Cathy, 15
4, Henry, 21
5, Hans, 17
----------------------------
View success!

//......实际操作中会生成10次查表信息，此处省略以节省篇幅

----------------------------
[id, name, age]
1, Adam, 13
2, Amy, 18
3, Cathy, 15
4, Henry, 21
5, Hans, 17
----------------------------
View success!

Process finished with exit code 0
```

经测试，本文中的连接池大概支持20个用户的同时访问，在实际使用中，我们可以修改连接池设置以实现数量更大的用户访问。

此例中用户只实现了查询操作，当然增删改查的函数也可以写到ConnectionUser用户类中，我们还可以建立不同的用户类，分为管理员用户、普通用户等，不同用户中提供不同的操作函数，如管理员可以进行增删改查，普通用户可以查看和添加，游客用户只可以查看等，此处不再实现，因为并不是本文重点。

这就是本文的全部内容