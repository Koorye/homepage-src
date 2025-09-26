---
title: 【Redis自学笔记六】Docker搭建Redis集群，主从复制和哨兵模式
date: 2020-07-21 05:35:15
tags: [数据库,Redis,Docker]
categories: 数据库
description: Redis集群可以实现读写分离、主写从读，从而提高读写效率。同时，Redis集群可以在一台服务器宕机时有替代服务器。接下来我们就来搭建集群。
---

在日常生产中，配置Redis集群是基本需求。Redis集群可以实现读写分离、主写从读，从而提高读写效率。同时，Redis集群可以在一台服务器宕机时有替代服务器。接下来我们就来搭建集群。

<!-- more -->

# 主从复制

主从复制模型中，有多个Redis节点。其中，有且仅有一个为主节点Master。从节点Slave可以有多个。由于生产中80%的操作都是读，于是我们可以让主机负责写，从机负责读，从而平均分配任务，大大提高效率。

 ```mermaid
graph LR

Master --同步--> Slave1
Master --同步--> Slave2
Master --同步--> Slave3
 ```

## 配置目录

首先创建三个目录，用于存放主机和从机。

```shell
mkdir redis01 redis02 redis03
```

笔者此处选用Docker搭建集群，每个容器都有自己的独立端口，故即使使用同样的配置文件也不会造成端口冲突。

如果不使用Docker，请复制3份配置文件，并修改端口号和PID文件名。

*注：基于Docker容器的Redis不需要配置守护进程启动*

## 创建容器

创建3个容器，映射不同的端口，卷挂载数据文件到三个目录中，使用相同的配置文件：

```shell
sudo docker run -d \
--name redis01 \
-p 6379:6379 \
-v /home/koorye/docker/redis/redis.conf:/etc/redis/redis.conf \
-v /home/koorye/docker/redis/redis01/data:/data \
redis \
redis-server /etc/redis/redis.conf

sudo docker run -d \
--name redis02 \
-p 6380:6379 \
-v /home/koorye/docker/redis/redis.conf:/etc/redis/redis.conf \
-v /home/koorye/docker/redis/redis02/data:/data \
redis \
redis-server /etc/redis/redis.conf

sudo docker run -d \
--name redis03 \
-p 6381:6379 \
-v /home/koorye/docker/redis/redis.conf:/etc/redis/redis.conf \
-v /home/koorye/docker/redis/redis03/data:/data \
redis \
redis-server /etc/redis/redis.conf
```

## 测试

可以通过`info replication`查看Redis服务器的状态，此时每台服务器都是master主机。

```shell
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:0
master_replid:447743a562da878e9436036b6666b605166cd321
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:0
second_repl_offset:-1
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
```

## 搭建网络

```shell
docker network create redis_net
```

连接网络

```shell
docker network connect redis_net redis01
docker network connect redis_net redis02
docker network connect redis_net redis03
```



## 配置从机

通过`docker inspect redis | grep IPAddress`查看IP：

```shell
docker inspect redis01
				"redis_net": {
                    "IPAMConfig": {},
                    "Links": null,
                    "Aliases": [
                        "627cf11e7ecc"
                    ],
                    "NetworkID": "05274be8507f81af88bdd2276f32e35f1b7a6f1800d881c7e99ec0f11d659f96",
                    "EndpointID": "3d4734806c634b0fa06ee9cab4be9997331319c557543b3fc1558266c1ccec9d",
                    "Gateway": "172.18.0.1",
                    "IPAddress": "172.18.0.2",  # 找到redis_net中的IPAddress
                    ...
                }
```

最终得到：

- redis01 172.18.0.2:6379
- redis02 172.18.0.3:6379
- redis03 172.18.0.4:6379

通过portainer查看更加清楚：

![image-20200721042753521](https://i-blog.csdnimg.cn/blog_migrate/86147cfa028025df301f4abddbaf6c1d.png)

通过`slaveof ip port`指定主机：

6380端口：

```shell
127.0.0.1:6379> slaveof 172.18.0.2 6379
OK
```

6381端口：

```shell
127.0.0.1:6379> slaveof 172.18.0.2 6379
OK
```

此时查看6379端口：

```shell
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:2
slave0:ip=172.18.0.3,port=6379,state=online,offset=910,lag=0  # 从机1
slave1:ip=172.18.0.4,port=6379,state=online,offset=910,lag=0  # 从机2
master_replid:2d2e35dd84c72e879581a175965cb6a0cb1e9046
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:910
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:910
```

出现两台从机。

查看6380和6381端口：

```shell
127.0.0.1:6379> info replication
# Replication
role:slave
master_host:172.18.0.2
master_port:6379
master_link_status:up  # 成功连接
master_last_io_seconds_ago:0
master_sync_in_progress:0
slave_repl_offset:966
slave_priority:100
slave_read_only:1
connected_slaves:0
master_replid:2d2e35dd84c72e879581a175965cb6a0cb1e9046
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:966
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:897
repl_backlog_histlen:70
```

成为从机，且主机正常运行。

*`slaveof no one`  成为主机*

## 配置文件实现主从复制

以上是通过命令行配置的方法，同样我们可以在配置文件中实现：

`replicaof <masterip> <masterport>`

本文不再演示。

## 主从复制的特性

主从复制的情况下，主机可读可写；从机不能写只能读，写则会报错：

```shell
127.0.0.1:6379> set k2 v2
(error) READONLY You can't write against a read only replica.
127.0.0.1:6379> get k1
"v1"
```

如果主机宕机，从机仍然是从机，会等待主机重连，主机重连之后仍然是主机。

命令行配置下，如果从机宕机，会变成主机，需要再次指定才能变成从机。

- 全量复制：从机连接到主机，主机的数据会全部同步到从机
- 增量复制：主机继续将收集的数据同步到从机

# 哨兵模式

哨兵模式是一种特殊的模式，首先Redis提供了哨兵的命令，哨兵是一个独立的进程，作为进程，它会独立运行。其原理是哨兵通过发送命令，等待Redis服务器响应，从而监控运行的多个Redis实例。

要实现哨兵模式，我们首先要配置一个哨兵。

选择之前挂载到三个容器的docker/redis目录，新建一个sentinel.conf文件：

```shell
sentinel monitor master 172.18.0.2 6379 1
```

`sentinel monitor <maseter-name> <ip> <redis-port> <quorum>`
- `<maseter-name>`   主机名
- `<ip>`   主机的IP地址与端口号
- `<quorum>`   当主机挂了以后，从机要获取多少票才能成为主机

两台从机执行`redis-sentinel <哨兵配置文件路径>`，启动哨兵模式：

```shell
root@52a9a03b0281:/data# redis-sentinel /etc/redis/sentinel.conf
414:X 20 Jul 2020 21:04:47.552 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
414:X 20 Jul 2020 21:04:47.552 # Redis version=6.0.5, bits=64, commit=00000000, modified=0, pid=414, just started
414:X 20 Jul 2020 21:04:47.552 # Configuration loaded
                _._
           _.-``__ ''-._
      _.-``    `.  `_.  ''-._           Redis 6.0.5 (00000000/0) 64 bit
  .-`` .-```.  ```\/    _.,_ ''-._
 (    '      ,       .-`  | `,    )     Running in sentinel mode
 |`-._`-...-` __...-.``-._|'` _.-'|     Port: 26379
 |    `-._   `._    /     _.-'    |     PID: 414
  `-._    `-._  `-./  _.-'    _.-'
 |`-._`-._    `-.__.-'    _.-'_.-'|
 |    `-._`-._        _.-'_.-'    |           http://redis.io
  `-._    `-._`-.__.-'_.-'    _.-'
 |`-._`-._    `-.__.-'    _.-'_.-'|
 |    `-._`-._        _.-'_.-'    |
  `-._    `-._`-.__.-'_.-'    _.-'
      `-._    `-.__.-'    _.-'
          `-._        _.-'
              `-.__.-'

414:X 20 Jul 2020 21:04:47.554 # WARNING: The TCP backlog setting of 511 cannot be enforced because /proc/sys/net/core/somaxconn is set to the lower value of 128.
414:X 20 Jul 2020 21:04:47.587 # Sentinel ID is 7536169799ea0a8b8bddcf412cb91418f401a804
414:X 20 Jul 2020 21:04:47.587 # +monitor master master 172.18.0.2 6379 quorum 1
414:X 20 Jul 2020 21:04:47.589 * +slave slave 172.18.0.3:6379 172.18.0.3 6379 @ master 172.18.0.2 6379
414:X 20 Jul 2020 21:04:47.593 * +slave slave 172.18.0.4:6379 172.18.0.4 6379 @ master 172.18.0.2 6379
```

此时，若主机宕机：

```shell
docker stop redis01
redis01
```

等待一段时间(默认等待30秒)，redis02被选为主机：

```shell
414:X 20 Jul 2020 21:08:40.463 # +failover-end master master 172.18.0.2 6379
414:X 20 Jul 2020 21:08:40.463 # +switch-master master 172.18.0.2 6379 172.18.0.3 6379
414:X 20 Jul 2020 21:08:40.464 * +slave slave 172.18.0.4:6379 172.18.0.4 6379 @ master 172.18.0.3 6379
414:X 20 Jul 2020 21:08:40.464 * +slave slave 172.18.0.2:6379 172.18.0.2 6379 @ master 172.18.0.3 6379
414:X 20 Jul 2020 21:09:10.492 # +sdown slave 172.18.0.2:6379 172.18.0.2 6379 @ master 172.18.0.3 6379
```

进入redis02查看信息：

```shell
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:1
slave0:ip=172.18.0.4,port=6379,state=online,offset=33786,lag=0
master_replid:062527c7c3b837ffd8aee8a945a3e54b1d778087
master_replid2:82642d450c88a764d64b29fe733a8e5122f61d64
master_repl_offset:33786
second_repl_offset:26246
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:33786
```

此时redis01重连，已经变成从机：

```shell
127.0.0.1:6379> info replication
# Replication
role:slave
master_host:172.18.0.3
master_port:6379
master_link_status:up
master_last_io_seconds_ago:1
master_sync_in_progress:0
slave_repl_offset:48593
slave_priority:100
slave_read_only:1
connected_slaves:0
master_replid:062527c7c3b837ffd8aee8a945a3e54b1d778087
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:48593
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:47227
repl_backlog_histlen:1367
```

priority:100
slave_read_only:1
connected_slaves:0
master_replid:062527c7c3b837ffd8aee8a945a3e54b1d778087
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:48593
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:47227
repl_backlog_histlen:1367
```
