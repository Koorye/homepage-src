---
title: 【Elasticsearch 自学笔记一】什么是 ES？ ES 的基本安装和使用
date: 2020-08-06 01:46:40
tags: [数据库, Elasticsearch]
categories: 数据库
description: Elasticsearch 是一个基于 Lucene 的搜索服务器。它提供了一个分布式多用户能力的全文搜索引擎，基于 RESTful web 接口。Elasticsearch 是用 Java 语言开发的，并作为 Apache 许可条款下的开放源码发布，是一种流行的企业级搜索引擎。Elasticsearch 用于云计算中，能够达到实时搜索，稳定，可靠，快速，安装使用方便。
---

> Elasticsearch是一个基于Lucene的搜索服务器。它提供了一个分布式多用户能力的全文搜索引擎，基于RESTful web接口。
>
> Elasticsearch是用Java语言开发的，并作为Apache许可条款下的开放源码发布，是一种流行的企业级搜索引擎。Elasticsearch用于云计算中，能够达到实时搜索，稳定，可靠，快速，安装使用方便。
>
> 官方客户端在Java、.NET（C#）、PHP、Python、Apache Groovy、Ruby和许多其他语言中都是可用的。根据DB-Engines的排名显示，Elasticsearch是最受欢迎的企业搜索引擎。
>
> ——  摘自百度百科

# 什么是 ES？

Elasticsearch，以下简称 ES，是一个分布式的全文搜索引擎。我们传统的开发中，在使用搜索功能时，我们可能会使用 MySQL 进行模糊查询。然而这样的做法效率极低，又很难自定义匹配规则，得到最好的结果。

ES 解决了这一问题，它的高效搜索算法具有接近实时的搜索能力，同时，它还具有优秀的匹配、排名算法，以及高亮等功能。

在学习的初期，我们可以把 ES 当作一种关系型数据库。MySQL 中的表即 ES 中的索引。

# Docker 安装 ES

为了方便我依然使用 Docker 进行安装，正常安装的效果相同。

拉取最新版本镜像：

```shell
docker pull elasticsearch:7.8.1
```

创建容器：

- 映射 9200 端口
- 挂载数据和插件

```shell
docker run -d \
-p 9200:9200 \
--name elasticsearch \
-v /mydata/elasticsearch/data:/usr/share/elasticsearch/data \
-v /mydata/elasticsearch/plugins:/usr/share/elasticsearch/plugins \
-e "discovery.type=single-node" \
elasticsearch:7.8.1
```

# Docker 安装 Kibana

Kibana 是一个针对 ES 开发的分析和可视化平台，不过我们用不到这些高级的功能，我们只是要用 Kibana 提供的 REST 控制台访问 ES.

事实上，使用 Postman 等软件也可以达到相同的效果，Kibana 的好处只是有提示而已。

拉取镜像，注意版本号相同：

```shell
docker pull kibana:7.8.1
```

创建容器：

- 映射到 5601 端口

```shell
docker run -d \
-p 5601:5601 \
--name kibana \
kibana:7.8.1
```

## 配置 Docker 网络

这样就可以用了？先不着急，我们需要给 Kibana 配置虚拟网络和 ES 连接，才可以正常访问。

```shell
docker network create es
docker network connect es elasticsearch
docker network connect es kibana
```

访问 5601 端口：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/f2377aa40a6e0aa5b4a5a63637ac1f12.png)
访问成功！

# 基本使用

进入 Kibana 的控制台界面，在这里，我们可以指定 HTTP 请求类型、URL和请求体。

ES 的请求 URL 遵循以下格式：

索引名/类型名/ID

## 索引操作

索引，即数据库的表，我们来创建一个名为 user 的索引。

在 mappings 中，我们可以指定每个字段和类型：

```shell
PUT user
{
  "mappings": {
    "properties": {
      "name": {
        "type": "keyword"
      },
      "age": {
        "type": "integer"
      },
      "desc": {
        "type": "text"
      }
    }
  }
}
```

text 和 keyword 是字符串的两种类型，其不同点我们之后再讲解。

获取索引，使用 GET：

```shell
GET user
```

来看一下返回结果：

```shell
{
  "user" : {
    "aliases" : { },
    "mappings" : {
      "properties" : {
        "age" : {
          "type" : "integer"
        },
        "desc" : {
          "type" : "text"
        },
        "name" : {
          "type" : "keyword"
        }
      }
    },
    "settings" : {
      "index" : {
        "creation_date" : "1596632527236",
        "number_of_shards" : "1",
        "number_of_replicas" : "1",
        "uuid" : "qhrMOBBbSgW7rVTtgsqQoA",
        "version" : {
          "created" : "7080199"
        },
        "provided_name" : "user"
      }
    }
  }
}

```

注意到 mappings 的 properties 中已经根据我们的设定添加了字段和类型。

ES 的基本数据类型有：

- 字符串类型： text, keyword
- 数字类型：`long`, `integer`, `short`, `byte`, `double`, `float`, `half_float`, `scaled_float`
- 日期：date
- 日期 纳秒：date_nanos
- 布尔型：boolean
- Binary：binary
- Range: `integer_range`, `float_range`, `long_range`, `double_range`, `date_range`

删除索引很简单，使用 DELETE 请求即可：

```shell
DELETE user
```

## 字段操作

注意 ES 的请求 URL 格式是：

索引名/类型名/ID

类型名默认是 _doc，表示文本，我们可不写，也可以显式表明。

添加字段：

```shell
PUT user/_doc/1
{
  "name": "koorye1",
  "age": 19
}
```

获取字段：

```shell
GET user/_doc/1
```

修改字段：

- 方法 1,使用 PUT，这种方法会使得未填写的字段置为空。

```shell
PUT user/_doc/1
{
  "name": "new_koorye_1",
  "age": 20
}
```

- 方法2,使用 POST + _update，这种方法只会修改填写的字段，其余字段不变。

```shell
POST user/_update/1
{
  "doc": {
    "age": 32
  }
}
```

删除字段：

```shell
DELETE user/_doc/1
```
