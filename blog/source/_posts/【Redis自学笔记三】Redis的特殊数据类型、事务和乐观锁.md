---
title: 【Redis自学笔记三】Redis的特殊数据类型、事务和乐观锁
date: 2020-07-21 00:16:37
tags: [数据库,Redis]
categories: 数据库
description: Redis的特殊数据类型包括列表、集合、有序集合、哈希、地理、基数、位图。Redis的事务具有一次性、顺序性、排他性，没有隔离级别的概念。乐观锁通过watch key监视数据在事务执行期间是否发生变动。
---

# Geospatial

即地理类型，我们可以通过`geoadd key longtitude latitude member`声明一个地理类型，有效经度从-180到180，有效纬度从-85.05112878到85.05112878，例：

```shell
127.0.0.1:6379> geoadd city 116.40 39.90 Beijing
(integer) 1
```

## 基本命令

`geopos key member`  获取位置，例：

```shell
127.0.0.1:6379> geopos city Beijing
1) 1) "116.39999896287918091"
   2) "39.90000009167092543"
```

`geodist key member1 member2 [m|km|ft|mi]`  获取距离，可选参数指定单位(默认m)，例：

```shell
127.0.0.1:6379> geoadd city 116.40 39.90 Beijing
(integer) 1
127.0.0.1:6379> geoadd city 121.47 31.23 Shanghai
(integer) 1
127.0.0.1:6379> geodist city Beijing Shanghai
"1067378.7564"
```

`georadius key longtitude latitude radius m|km|mt|mi [withcoord] [withdist] [withhash]`  获取半径内的位置，withcoord返回经纬度，withdist返回距离，withhash返回哈希，例：

```shell
127.0.0.1:6379> georadius city 120 30 500 km withcoord
1) 1) "Shanghai"
   2) 1) "121.47000163793563843"
      2) "31.22999903975783553"
127.0.0.1:6379> georadius city 120 30 500 km withdist
1) 1) "Shanghai"
   2) "196.2512"
127.0.0.1:6379> georadius city 120 30 500 km withhash
1) 1) "Shanghai"
   2) (integer) 4054803462927619
```

`georadiusbymember key member radius m|km|mt|mi [withcoord] [withdist] [withhash]`  获得城市半径内的位置，例：

```shell
127.0.0.1:6379> georadiusbymember city Beijing 10000 km
1) "Shanghai"
2) "Beijing"
```

# Hyperloglog

是一种基数统计算法，它占用的内存是固定的，$2^{64}$数量级的不同元素只需要12KB的内存。基数统计有0.81%的错误率。可以通过`pfadd key element [element ...]`声明基数，例：

```shell
127.0.0.1:6379> pfadd mykey a b c d e f g h i j
(integer) 1
```

## 基本命令

`pfcount key`   统计个数，例：

```shell
127.0.0.1:6379> pfcount mykey
(integer) 10
```

`pfmerge destkey sourcekey`  合并基数，例：

```shell
127.0.0.1:6379> pfadd mykey a b c d e f g h i j
(integer) 1
127.0.0.1:6379> pfadd mykey2 h i j k l m
(integer) 1
127.0.0.1:6379> pfmerge mykey mykey2
OK
127.0.0.1:6379> pfcount mykey
(integer) 13
```

# Bitmaps

位图类型，只有0和1两个状态。可以通过`setbit key offset value`声明一个位，例：

```shell
127.0.0.1:6379> setbit sign 0 1
(integer) 0
127.0.0.1:6379> setbit sign 1 0
(integer) 0
127.0.0.1:6379> setbit sign 2 0
(integer) 0
127.0.0.1:6379> setbit sign 3 0
(integer) 0
127.0.0.1:6379> setbit sign 4 1
(integer) 0
```

## 基本命令

`getbit key offset`  获取对应的值，例：

```shell
127.0.0.1:6379> getbit sign 1
(integer) 0
127.0.0.1:6379> getbit sign 4
(integer) 1
```

`bitcount key`  统计元素个数，例：

```shell
127.0.0.1:6379> bitcount sign
(integer) 2
```

# 事务

Redis的单条命令保证原子性，而**事务并不保证原子性**！

Redis的事务具有一次性、顺序性、排他性，没有隔离级别的概念。

`mulit`开启事务，`exec`执行事务，`discard`取消事务，例：

```shell
127.0.0.1:6379> multi
OK
127.0.0.1:6379> set k1 v1
QUEUED
127.0.0.1:6379> set k2 v2
QUEUED
127.0.0.1:6379> set k3 v3
QUEUED
127.0.0.1:6379> exec
1) OK
2) OK
3) OK
```

Redis的事务异常有两种：

- 如果事务中的一条命令本身有问题，所有命令都不会执行
- 如果命令没问题，而在执行中报错，其余命令仍会执行

例：

```shell
# 情况一
127.0.0.1:6379> multi
OK
127.0.0.1:6379> set k1 v1
QUEUED
127.0.0.1:6379> set k2 v2
QUEUED
127.0.0.1:6379> aaa  # 不存在的命令
(error) ERR unknown command `aaa`, with args beginning with:
127.0.0.1:6379> set k3 v3
QUEUED
127.0.0.1:6379> exec
(error) EXECABORT Transaction discarded because of previous errors.

# 情况二
127.0.0.1:6379> set int 1
OK
127.0.0.1:6379> set str hello
OK
127.0.0.1:6379> multi
OK
127.0.0.1:6379> incr int
QUEUED
127.0.0.1:6379> incr str  # 错误，字符串不能自增
QUEUED
127.0.0.1:6379> incr int
QUEUED
127.0.0.1:6379> exec
1) (integer) 2
2) (error) ERR value is not an integer or out of range
3) (integer) 3
```

## 乐观锁

> 乐观锁（ Optimistic Locking ） 相对悲观锁而言，乐观锁机制采取了更加宽松的加锁机制。悲观锁大多数情况下依靠数据库的锁机制实现，以保证操作最大程度的独占性。但随之而来的就是数据库性能的大量开销，特别是对长事务而言，这样的开销往往无法承受。而乐观锁机制在一定程度上解决了这个问题。乐观锁，大多是基于数据版本（ Version ）记录机制实现。何谓数据版本？即为数据增加一个版本标识，在基于数据库表的版本解决方案中，一般是通过为数据库表增加一个 “version” 字段来实现。读取出数据时，将此版本号一同读出，之后更新时，对此版本号加一。此时，将提交数据的版本数据与数据库表对应记录的当前版本信息进行比对，如果提交的数据版本号等于数据库表当前版本号，则予以更新，否则认为是过期数据。
>
> ——  摘自百度百科

使用`watch key`监视数据在事务执行期间是否发生变动，例：

```shell
127.0.0.1:6379> watch money
OK
127.0.0.1:6379> set money 100
OK
127.0.0.1:6379> multi
OK
127.0.0.1:6379> decrby money 20
QUEUED
127.0.0.1:6379> exec
1) (integer) 80
```

如果在事务执行期间另外一个线程修改了数据：

线程1先输入命令，并不执行事务：

```shell
127.0.0.1:6379> watch money
OK
127.0.0.1:6379> set money 100
OK
127.0.0.1:6379> multi
OK
127.0.0.1:6379> decrby money 20
QUEUED
```

紧接着线程2修改了数据：

```shell
127.0.0.1:6379> decrby money 50
(integer) 50
```

此时线程1再执行事务：

```shell
127.0.0.1:6379> exec
(nil)
```

事务提交失败。

使用`unwatch`解除所有监视。**事务提交失败会自动解除监视**。