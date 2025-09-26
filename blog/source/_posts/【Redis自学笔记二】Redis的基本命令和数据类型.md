---
title: 【Redis自学笔记二】Redis的基本命令和数据类型
date: 2020-07-20 10:38:02
tags: [数据库,Redis]
categories: 数据库
description: 本期我们将学习Redis的基本命令和数据类型，包括String、List、Set、Hash等。
---

上一期我们完成了Redis的安装，本期将开始使用Redis的一些命令和了解数据类型。

# 基本命令

首先说明，Redis的所有命令大小写不敏感，甚至可以大小写混用。

## Get / Del / Type

## 其他

`keys pattern`  正则表达式匹配存在的key，例：`key *`  匹配所有key

`type key`  查看key类型

`del key`  删除key

`FLUSHDB`  清除当前数据库的数据

`FLUSHALL`  清除所有数据

`EXISTS key`  判断key是否存在，存在返回1

`MOVE key DESTINATION_DATABASE`  移动一个key到对应数据库，例：`MOVE name 4`  移动name到第4个数据库

`EXPIRE key time`  设定过期时间，例：`EXPIRE name 10`  name将在10秒后过期

`TTL key`  即time to live，查看key的存活时间(多久之后过期)

# 数据类型

## String

### Set / Get 方法

`set key value`  设置一个键值对

`setex key seconds value`  即set with expire，设定一个键值对并指定过期时间

`setnx key value`  即set if not exist，如果不存在则正常设置，存在则设置失败

`mset k1 v1 k2 v2 k3 v3 ...`  批量设置

`msetnx k1 v1 k2 v2 k3 v3 ...`  批量设置，如果有一个键存在则都失败(原子性)

`mget k1 k2 k3 ...`  批量获取

`getset key value`  先get再set，不存在返回nil并设置值，存在则返回值并设置新值

即字符串类型，Redis中最基本的数据类型。我们可以通过`set key value`来声明一个String，如：

```shell
127.0.0.1:6379> set str hello
OK
127.0.0.1:6379> type str
string
```

### 基本命令

`APPEND key string`  追加字符串(如果不存在则set一个key)，例：

```shell
127.0.0.1:6379> append str world
(integer) 10
127.0.0.1:6379> get str
"helloworld"
```

`STRLEN key`  获取字符串长度，例：

```shell
127.0.0.1:6379> strlen str
(integer) 10
```

`INCR key`  自增(需要字符串是一个数字)，例：

```shell
127.0.0.1:6379> set int 0
OK
127.0.0.1:6379> incr int
(integer) 1
127.0.0.1:6379> get int
"1"
```

`DECR key`  自减(需要字符串是一个数字)。

`INCRBY key increment`  自增相应步长(需要字符串是一个数字)，例：

```shell
127.0.0.1:6379> get int
"1"
127.0.0.1:6379> incrby int 10
(integer) 11
127.0.0.1:6379> get int
"11"
```

`DECRBY int decrement`  自减响应步长(需要字符串是一个数字)。

`GETRANGE key start end`   截取对应范围的字符串(数字同样可以作为字符串被截取)，例：

```shell
127.0.0.1:6379> get name
"koorye"
127.0.0.1:6379> getrange name 1 4
"oory"
127.0.0.1:6379> getrange name 1 -1  # 可以使用负数表示倒数第几
"oorye"
```

`SETRANGE key offset value`  修改从offset开始value长度的字符串，例：

```shell
127.0.0.1:6379> get name
"koorye"
127.0.0.1:6379> setrange name 1 uu
(integer) 6
127.0.0.1:6379> get name
"kuurye"
```

## List

即列表，本质上是一个链表，因此在两边进行CRUD操作效率最高。可以使用`lpush key element`设置一个队列(已存在则会向左添加)，例：

```shell
127.0.0.1:6379> lpush li one
(integer) 1
```

### 基本命令

`lrange key start stop`  返回key队列从start到stop的元素，例：

```shell
127.0.0.1:6379> lrange li 0 -1
1) "one"
```

`lpush key element`  向左添加元素(支持一个或多个)，例：

```shell
127.0.0.1:6379> lrange li 0 -1
1) "one"
127.0.0.1:6379> lpush li two
(integer) 2
127.0.0.1:6379> lrange li 0 -1
1) "two"
2) "one"
```

`rpush key element`  向右添加元素(支持一个或多个)，例：

```shell
127.0.0.1:6379> lrange li 0 -1
1) "two"
2) "one"
127.0.0.1:6379> rpush li three
(integer) 3
127.0.0.1:6379> lrange li 0 -1
1) "two"
2) "one"
3) "three"
```

`lpop key`  移除key左边一个元素，例：

```shell
127.0.0.1:6379> lrange li 0 -1
1) "two"
2) "one"
3) "three"
127.0.0.1:6379> lpop li
"two"
127.0.0.1:6379> lrange li 0 -1
1) "one"
2) "three"
```

`rpop key`  移除key右边一个元素，例：

```shell
127.0.0.1:6379> lrange li 0 -1
1) "one"
2) "three"
127.0.0.1:6379> rpop li
"three"
127.0.0.1:6379> lrange li 0 -1
1) "one"
```

`lindex key index`  取得对应下标的值，例：

```shell
127.0.0.1:6379> lrange li 0 -1
1) "one"
2) "two"
3) "three"
4) "four"
127.0.0.1:6379> lindex li 2
"three"
```

`llen key`  获取列表长度，例：

```shell
127.0.0.1:6379> lrange li 0 -1
1) "one"
2) "two"
3) "three"
4) "four"
127.0.0.1:6379> llen li
(integer) 4
```

`lrem key count value`  移除列表中count个对应值，例：

```shell
# 测试一
127.0.0.1:6379> lrange li 0 -1
1) "one"
2) "two"
3) "three"
4) "four"
127.0.0.1:6379> lrem li 1 one
(integer) 1
127.0.0.1:6379> lrange li 0 -1
1) "two"
2) "three"
3) "four"

# 测试二
127.0.0.1:6379> lrange li 0 -1
1) "one"
2) "one"
3) "one"
127.0.0.1:6379> lrem li 2 one
(integer) 2
127.0.0.1:6379> lrange li 0 -1
1) "one"
```

`ltrim key start stop`  从start到stop截取列表：

```shell
127.0.0.1:6379> lrange li 0 -1
1) "one"
2) "two"
3) "three"
127.0.0.1:6379> ltrim li 1 2
OK
127.0.0.1:6379> lrange li 0 -1
1) "two"
2) "three"
```

`rpoplpush source destination`  源列表最右边的值移到目标列表最左边，例：

```shell
127.0.0.1:6379> lrange li1 0 -1
1) "one"
2) "two"
3) "three"
127.0.0.1:6379> lrange li2 0 -1
1) "four"
2) "five"
3) "six"
127.0.0.1:6379> rpoplpush li1 li2
"three"
127.0.0.1:6379> lrange li1 0 -1
1) "one"
2) "two"
127.0.0.1:6379> lrange li2 0 -1
1) "three"
2) "four"
3) "five"
4) "six"
```

`lset key index value`  设置对应下标的值(下标不存在则报错)，例：

```shell
127.0.0.1:6379> lrange li 0 -1
1) "two"
2) "three"
127.0.0.1:6379> lset li 0 one
OK
127.0.0.1:6379> lrange li 0 -1
1) "one"
2) "three"
```

`linsert key before|after pivot value`  在对应值的前/后插入新值

```shell
127.0.0.1:6379> lrange li 0 -1
1) "one"
2) "three"
127.0.0.1:6379> linsert li before three two
(integer) 3
127.0.0.1:6379> lrange li 0 -1
1) "one"
2) "two"
3) "three"
```

## Set

即集合，无序且不重复。可以使用`sadd key value`创建一个集合，例：

```shell
127.0.0.1:6379> sadd set hello
(integer) 1
```

### 基本命令

`smembers key`  查看所有元素，例：

```shell
127.0.0.1:6379> smembers set
1) "hello"
```

`sismember key member`  元素是否存在，存在返回1，不存在返回0.

`scard key`  返回元素个数，例：

```shell
127.0.0.1:6379> scard set
(integer) 1
```

`srem key member`  移除元素，例：

```shell
127.0.0.1:6379> smembers set
1) "world"
2) "bye"
3) "hello"
127.0.0.1:6379> srem set bye
(integer) 1
127.0.0.1:6379> smembers set
1) "world"
2) "hello"
```

`srandmember key [count]`  随机返回count个成员，count可不写，代表1个，例：

```shell
127.0.0.1:6379> sadd set one two three four five
(integer) 5
127.0.0.1:6379> srandmember set 3
1) "three"
2) "two"
3) "one"
127.0.0.1:6379> srandmember set 3
1) "three"
2) "four"
3) "one"
127.0.0.1:6379> srandmember set
"one"
```

`spop key [count]`  随机移除count个元素，count可不写，例：

```shell
127.0.0.1:6379> spop set 2
1) "five"
2) "four"
127.0.0.1:6379> smembers set
1) "three"
2) "one"
3) "two"
```

`smove source destination member`  移动源集合指定元素到目标集合，例：

```shell
127.0.0.1:6379> sadd s1 one two three
(integer) 3
127.0.0.1:6379> sadd s2 four five six
(integer) 3
127.0.0.1:6379> smove s1 s2 three
(integer) 1
127.0.0.1:6379> smembers s1
1) "two"
2) "one"
127.0.0.1:6379> smembers s2
1) "five"
2) "six"
3) "three"
4) "four"
```

`sdiff key1 key2 ...`  做差集，例：

```shell
127.0.0.1:6379> smembers s1
1) "two"
2) "one"
3) "three"
4) "four"
127.0.0.1:6379> smembers s2
1) "five"
2) "six"
3) "three"
4) "four"
127.0.0.1:6379> sdiff s2 s1
1) "five"
2) "six"
```

`sinter key1 key2 ...`  做交集，例：

```shell
127.0.0.1:6379> smembers s1
1) "two"
2) "one"
3) "three"
4) "four"
127.0.0.1:6379> smembers s2
1) "five"
2) "six"
3) "three"
4) "four"
127.0.0.1:6379> sinter s1 s2
1) "three"
2) "four"
```

`sunion key1 key2 ...`  做并集，例：

```shell
127.0.0.1:6379> smembers s1
1) "two"
2) "one"
3) "three"
4) "four"
127.0.0.1:6379> smembers s2
1) "five"
2) "six"
3) "three"
4) "four"
127.0.0.1:6379> sunion s1 s2
1) "six"
2) "three"
3) "four"
4) "five"
5) "two"
6) "one"
```

## Hash

即哈希，以键值对的形式表示，适合对象的存储。我们可以使用`hset key field value`声明一个哈希，例：

```shell
127.0.0.1:6379> hset user name koorye
(integer) 1
127.0.0.1:6379> hget user name
"koorye"
```

### 基本命令

`hget key field`  获取一个哈希的值。

`hmset key f1 v1 f2 v2 f3 v3 ...`  批量设置哈希，例：

```shell
127.0.0.1:6379> hset user name koorye age 19 sex male
(integer) 3
```

`hsetnx key field value`  如果不存在则设置。

`hmget key f1 f2 f3 ...`  批量获取哈希，例：

```shell
127.0.0.1:6379> hmget user name age sex
1) "koorye"
2) "19"
3) "male"
```

`hgetall key`  获取所有哈希，会返回键值对，例：

```shell
127.0.0.1:6379> hgetall user
1) "name"
2) "koorye"
3) "age"
4) "19"
5) "sex"
6) "male"
```

`hdel key field`  删除哈希的某个字段，例：

```shell
127.0.0.1:6379> hdel user age
(integer) 1
127.0.0.1:6379> hgetall user
1) "name"
2) "koorye"
3) "sex"
4) "male"
```

`hlen key`  获取哈希有几个键值对，例：

```shell
127.0.0.1:6379> hgetall user
1) "name"
2) "koorye"
3) "sex"
4) "male"
127.0.0.1:6379> hlen user
(integer) 2
```

`hexists key field`  判断哈希中指定字段是否存在，存在返回1，例：

```shell
127.0.0.1:6379> hexists user name
(integer) 1
```

`hkeys key`  只获得所有字段，例：

```shell
127.0.0.1:6379> hkeys user
1) "name"
2) "sex"
```

`hvals key`  只获得所有值，例：

```shell
127.0.0.1:6379> hvals user
1) "koorye"
2) "male"
```

`hincrby key field increment`  自增一个数字类型的字段，例：

```shell
127.0.0.1:6379> hset user age 19
(integer) 1
127.0.0.1:6379> hincrby user age 5
(integer) 24
127.0.0.1:6379> hget user age
"24"
```

## Zset

即有序集合。可以用`zadd key score member`声明一个有序集合，例：

```shell
127.0.0.1:6379> zadd set 1 one
(integer) 1
127.0.0.1:6379> zrange set 0 -1
1) "one"
```

### 基本命令

`zrange key start stop`  获取范围内的元素。

`zrangebyscore key min max [withscores]`  根据范围排序，withscores可选，是否带上值，例：

```shell
127.0.0.1:6379> zadd salary 4000 adam
(integer) 1
127.0.0.1:6379> zadd salary 6000 alex
(integer) 1
127.0.0.1:6379> zadd salary 3500 anna
(integer) 1
127.0.0.1:6379> zrangebyscore salary -inf +inf
1) "anna"
2) "adam"
3) "alex"
127.0.0.1:6379> zrangebyscore salary -inf +inf withscores
1) "anna"
2) "3500"
3) "adam"
4) "4000"
5) "alex"
6) "6000"
```

`zrevrangebyscore key max min [withscores] `  根据范围倒序排序。

`zrem`  移除元素，例：

```shell
127.0.0.1:6379> zrem salary anna
(integer) 1
```

`zcard key`  获取元素个数，例：

```shell
127.0.0.1:6379> zcard salary
(integer) 2
```

`zcount key min max`  统计区间内元素个数，例：

```shell
127.0.0.1:6379> zrange salary 0 -1 withscores
1) "adam"
2) "4000"
3) "alex"
4) "6000"
127.0.0.1:6379> zcount salary 3000 5000
(integer) 1
```