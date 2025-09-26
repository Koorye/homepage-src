---
title: 【Redis自学笔记一】什么是NoSQL？Docker启动Redis
date: 2020-07-20 10:36:55
tags: [数据库,Redis,Docker]
categories: 数据库
description: Redis是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API。从2010年3月15日起，Redis的开发工作由VMware主持。从2013年5月开始，Redis的开发由Pivotal赞助。
---

> Redis（Remote Dictionary Server )，即远程字典服务，是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API。从2010年3月15日起，Redis的开发工作由VMware主持。从2013年5月开始，Redis的开发由Pivotal赞助。
>
> ——  摘自百度百科

# 什么是NoSQL

NoSQL，泛指非关系型的数据库。

NoSQL = Not Only SQL，即“不仅仅是SQL”。区别于关系型数据库，这种新型数据库的出现是一场数据库的革命运动。

NoSQL不再用传统的表形式存储数据，数据之间的关系不再那么密切，这使得NoSQL具有非常强的灵活性和可扩展性。

NoSQL具有以下优点：

- **易扩展**  数据之间的无关系在架构层面带来了可扩展的能力
- **高性能**  得益于无关系性，NoSQL数据库都具有非常高的读写性能
- **灵活的数据模式**  NoSQL无须事先进行表设计、建立字段，随时可以存储自定义的数据格式、自由的进行CRUD操作
- **高可用**  NoSQL在不太影响性能的情况下，就可以实现高可用的架构

## NoSQL的类型

---

| 分类   | 举例              | 应用场景           | 数据模型                         | 优点                         | 缺点                                                         |
| ------ | ----------------- | ------------------ | -------------------------------- | ---------------------------- | ------------------------------------------------------------ |
| 键值对 | Redis, Oracle BDB | 缓存、高访问负载   | Key-Value键值对                  | 速度快                       | 数据无结构化                                                 |
| 列存储 | Cassandra, HBase  | 分布式文件系统     | 列簇                             | 速度快，可扩展性强           | 功能相对局限                                                 |
| 文档   | CouchDB, MongoDB  | Web应用            | Key-Value键值对，Value是结构化的 | 数据结构要求不严格，结构可变 | 性能不高，却反统一的查询语法                                 |
| 图形   | Neo4j, InfoGrid   | 社交网络、推荐系统 | 图                               | 可以使用图结构相关算法       | 很多时候需要对整个图做计算才能得出需要的信息，不容易做分布式的集群 |

# Ubuntu安装Redis

Ubuntu的安装非常简单：

```shell
sudo apt install redis  # apt安装redis
sudo service redis-server start  # 启动服务端
redis-cli  # 进入客户端
```

# Docker安装Redis

Docker安装也很简单，不过需要注意一个细节，镜像本身并不会自带配置文件。

因此我们先到官网下载配置文件：[http://download.redis.io/redis-stable/redis.conf](http://download.redis.io/redis-stable/redis.conf)

下载完之后，放到本地的目录里。这里笔者在家目录下创建docker/redis目录：

```shell
cd  # 默认切换到家目录
mkdir docker
cd docker
mkdir redis
```

之后放入配置文件。

创建容器时采用卷挂载的方式，将配置文件同步到容器中(注意此处用户名是笔者个人的用户名)：

```bash
sudo docker run -d \
--name redis \
-p 6379:6379 \
-v /home/koorye/docker/redis/redis.conf:/etc/redis/redis.conf \  # 挂载配置文件
-v /home/koorye/docker/redis/data:/data \  # 挂载数据
redis \
redis-server /etc/redis/redis.conf --appendonly yes  # 启用AOF模式
```