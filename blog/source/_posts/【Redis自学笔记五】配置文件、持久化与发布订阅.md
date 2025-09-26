---
title: 【Redis自学笔记五】配置文件、持久化与发布订阅
date: 2020-07-21 01:55:31
tags: [数据库,Redis]
categories: 数据库
description: 本期我们来细看Redis的配置文件，通过配置文件了解Redis的持久化等机制。
---

本期我们来细看Redis的配置文件，通过配置文件了解Redis的持久化等机制。

# 基本配置

unit单位对大小写不敏感：

```shell
# 1k => 1000 bytes
# 1kb => 1024 bytes
# 1m => 1000000 bytes
# 1mb => 1024*1024 bytes
# 1g => 1000000000 bytes
# 1gb => 1024*1024*1024 bytes
#
# units are case insensitive so 1GB 1Gb 1gB are all the same.
```

绑定IP，注释或设为0.0.0.0代表所有IP都可以访问：

```shell
bind 127.0.0.1
```

端口号，默认6379：

```shell
port 6379
```

保护模式(没有设置密码则只能从本地访问)，默认打开：

```shell
protected-mode yes
```

以守护进程的方式运行，默认关闭：

```shell
daemonize no
pidfile /var/run/redis_6379.pid  # 如果以守护进程方式运行就需要指定一个pid文件
```

日志级别(debug / verbose / notice / warning)，默认notice：

```shell
loglevel notice
logfile ""  # 日志文件，为空表示标准输出
```

数据库数量，默认16：

```shell
databases 16
```

设置密码，默认空：

```shell
requirepass 你设置的密码
```

最多客户端数量，默认10000：

```shell
maxclients 10000
```

最大内存：

```shell
maxmemory <bytes>
```

内存已满的处理策略，默认`noeviction`：

- `volatile-lru`  只对设置过期时间的key进入lru
- `allkeys-lru`  删除lru算法的key
- `volatile-random`  随机删除即将过期的key
- `allkeys-random`   随机删除
- `volatile-ttl`  删除即将过期的
- `noeviction`  永不过期，报错

```shell
maxmemory-policy noeviction
```



# 持久化介绍

## RDB

RDB(Redis DataBase)，Redis在内存中的数据库记录定时dump到磁盘上的RDB持久化。

RDB其实就是把数据以快照的形式保存到磁盘上，会在指定的时间间隔内将内存的数据写入磁盘。这种持久化是Redis默认的持久化方式。

优势：

- RDB文件紧凑，全量备份，非常适合用于进行备份和灾难恢复。
- 生成RDB文件的时候，redis主进程会fork一个子进程来处理所有保存工作，主进程不需要进行任何磁盘IO操作。
- RDB 在恢复大数据集时的速度比 AOF 的恢复速度要快。

劣势：

- 如果你想保证数据的高可用性，即最大限度的避免数据丢失，那么RDB将不是一个很好的选择。因为系统一旦在定时持久化之前出现宕机现象，此前没有来得及写入磁盘的数据都将丢失。
- 由于RDB是通过fork子进程来协助完成数据持久化工作的，因此，如果当数据集较大时，可能会导致整个服务器停止服务几百毫秒，甚至是1秒钟。

## AOF

AOF(Append Only File)，Redis的操作日志以追加的方式写入文件。

优势：

- 该机制可以带来更高的数据安全性，即数据持久性。Redis中提供了3种同步策略，即每秒同步、每修改同步和不同步。事实上，每秒同步也是异步完成的，其效率也是非常高的，所差的是一旦系统出现宕机现象，那么这一秒钟之内修改的数据将会丢失。而每修改同步，我们可以将其视为同步持久化，即每次发生的数据变化都会被立即记录到磁盘中。

- 由于该机制对日志文件的写入操作采用的是append模式，因此在写入过程中即使出现宕机现象，也不会破坏日志文件中已经存在的内容。然而如果我们本次操作只是写入了一半数据就出现了系统崩溃问题，不用担心，在Redis下一次启动之前，我们可以通过redis-check-aof工具来帮助我们解决数据一致性的问题。

- 如果日志过大，Redis可以自动启用rewrite机制。即Redis以append模式不断的将修改数据写入到老的磁盘文件中，同时Redis还会创建一个新的文件用于记录此期间有哪些修改命令被执行。因此在进行rewrite切换时可以更好的保证数据安全性。

- AOF包含一个格式清晰、易于理解的日志文件用于记录所有的修改操作。事实上，我们也可以通过该文件完成数据的重建。

劣势：

- 对于相同数量的数据集而言，AOF文件通常要大于RDB文件。RDB 在恢复大数据集时的速度比 AOF 的恢复速度要快。
- 根据同步策略的不同，AOF在运行效率上往往会慢于RDB。总之，每秒同步策略的效率是比较高的，同步禁用策略的效率和RDB一样高效。

# 持久化配置

## RDB

`save second number`  表示second秒内若有number条数据更新，就生成快照(事实上flush和退出命令也会生成快照)。下面是默认配置：

```shell
save 900 1  # 900秒内有1条数据更新就生成快照
save 300 10  # 300秒内有10条数据更新就生成快照
save 60 10000  # 60秒内有10000条数据更新就生成快照
```

持久化出错是否停止，默认yes：

```shell
stop-writes-on-bgsave-error yes
```

是否压缩快照(会消耗CPU资源)，默认yes：

```shell
rdbcompression yes
```

是否进行错误校验，默认yes：

```shell
rdbchecksum yes
```

生成快照的名字，默认`dump.rdb`，数据库启动时会读取该文件：

```shell
dbfilename dump.rdb
```

文件保存目录：

```shell
dir ./
```

## AOF

是否开启AOF，默认关闭：

```shell
appendonly no
```

AOF文件名：

```shell
appendfilename "appendonly.aof"
```

AOF同步方法，默认`everysec`：

- `always`   每次更新都同步
- `everysec`  每秒同步一次(可能会在1秒内丢失数据)
- `no`  操作系统自己同步数据

```shell
appendfsync everysec
```

日志是否进行重写，默认no：

```shell
no-appendfsync-on-rewrite no
```

文件最小达到多大就重写：

```shell
auto-aof-rewrite-min-size 64MB
```

每次重写后的增长百分比：

```shell
auto-aof-rewrite-percentage 100
```

### 关于AOF文件

AOF文件实际上就是一个日志，记录了所有更新操作，而加载数据时，就将日志文件从头到尾运行一遍：

```shell
*2
$6
SELECT
$1
0
*3
$3
SET
$22
key:{tag}:__rand_int__
...
VXK
*3
$3
SET
$22
key:{tag}:__rand_int__
$3
VXK
```

#### 重写

Redis服务器可以创建一个新的AOF文件来替代现有的AOF文件，新旧两个文件所保存的数据库状态是相同的，但是新的AOF文件不会包含任何浪费空间的冗余命令，通常体积会较旧AOF文件小很多。

而所谓重写最小大小和重写百分比的意思是，每次重写之后，随着新数据的加入，日志会不断增长，直到比之前更大。我们第一次达到64MB就重写，若将百分比设为200%，则第二次达到128MB就重写，第三次达到256MB就重写，以此类推，保证日志可以容纳数据。

#### 修改

假设日志文件出错，数据库启动时会拒绝加载这个文件。

我们可以通过`redis-check-aof --fix appendonly.aof`修复aof文件。

# 发布订阅

Redis 发布订阅(pub / sub)是一种消息通信模式：发送者(pub)发送消息，订阅者(sub)接收消息。

`subscribe channel [channel ...]`  订阅频道，例：

```shell
127.0.0.1:6379> subscribe koorye
Reading messages... (press Ctrl-C to quit)
1) "subscribe"
2) "koorye"
3) (integer) 1
```

开启后会阻塞接收信息。

再开启一个终端：
`publish channel message`  发布信息，例：

```shell
127.0.0.1:6379> publish koorye "hello world"
(integer) 1
```

此时另一个终端接收到：

```shell
1) "message"
2) "koorye"
3) "hello world"
```