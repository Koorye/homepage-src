---
title: 【Elasticsearch 自学笔记二】IK 中文分词器和搜索语法
date: 2020-08-06 01:47:15
tags: [数据库, Elasticsearch]
categories: 数据库
description: ES 作为一个搜索引擎，拥有高效且功能齐全搜索算法，这一期我们来了解一下其细节。
---

ES 作为一个搜索引擎，拥有高效且功能齐全搜索算法，这一期我们来了解一下其细节。

# IK 中文分词器

ES 并不支持中文词语的切割，当使用中文时，我们输入的词汇会被切割成一个个单子，而不能组成我们想要的词语。

幸运的是，ES 人性化的支持各种插件的安装，通过安装 IK 分词器，我们就可以解决这个问题。

在 Docker 中，我们需要先进入容器，不用 Docker 可以跳过这一步：

```shell
docker exec -it elasticsearch bash
```

找到 bin 目录，里面有用于插件安装的程序：

```shell
cd /bin
```

接着下载安装插件，注意版本号一致：

```shell
elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/7.8.1/elasticsearch-analysis-ik-7.8.1.zip
```

重启容器，安装成功：

```shell
exit  # 退出容器
docker restart elasticsearch
```

## 测试

我们依旧使用 Kibana 进行测试。

不使用分词器：

```shell
GET _analyze
{
  "text": "学习？学个屁"
}
```

返回体：

```shell
{
  "tokens" : [
    {
      "token" : "学",
      "start_offset" : 0,
      "end_offset" : 1,
      "type" : "<IDEOGRAPHIC>",
      "position" : 0
    },
    {
      "token" : "习",
      "start_offset" : 1,
      "end_offset" : 2,
      "type" : "<IDEOGRAPHIC>",
      "position" : 1
    },
    {
      "token" : "学",
      "start_offset" : 3,
      "end_offset" : 4,
      "type" : "<IDEOGRAPHIC>",
      "position" : 2
    },
    {
      "token" : "个",
      "start_offset" : 4,
      "end_offset" : 5,
      "type" : "<IDEOGRAPHIC>",
      "position" : 3
    },
    {
      "token" : "屁",
      "start_offset" : 5,
      "end_offset" : 6,
      "type" : "<IDEOGRAPHIC>",
      "position" : 4
    }
  ]
}

```

可以看到字被一个个分开了。

使用分词器：

```shell
GET _analyze
{
  "analyzer": "ik_smart",
  "text": "学习？学个屁"
}
```

返回体：

```shell
{
  "tokens" : [
    {
      "token" : "学习",
      "start_offset" : 0,
      "end_offset" : 2,
      "type" : "CN_WORD",
      "position" : 0
    },
    {
      "token" : "学",
      "start_offset" : 3,
      "end_offset" : 4,
      "type" : "CN_CHAR",
      "position" : 1
    },
    {
      "token" : "个",
      "start_offset" : 4,
      "end_offset" : 5,
      "type" : "CN_CHAR",
      "position" : 2
    },
    {
      "token" : "屁",
      "start_offset" : 5,
      "end_offset" : 6,
      "type" : "CN_CHAR",
      "position" : 3
    }
  ]
}

```

学习被当成一个词汇，而不是单字。

## 自定义词典

学习被当成一个词汇，然而学个屁仍然是单字。如果我们要把学个屁加入词汇怎么办呢？这时候我们就需要自定义词典。

进入容器，如果你已经把 config 目录挂载到卷外就不需要进入了(我忘了)：

```shell
docker exec -it elasticsearch bash
```

ES 的 docker 容器基于 centos 系统，我们先安装 vim：

```shell
yum install vim
```

进入词典目录：

```shell
cd /usr/share/elasticsearch/config/analysis-ik
```

用 vim 生成一个文件 `my_word.dic`，加入我们需要的词汇。

看一下文本内容：

```shell
[root@3fb842497984 analysis-ik]# cat my_word.dic 
学个屁
```

加入配置，打开 IKAnalyzer.cfg.xml，将自定义词典加到 ext_dict 中：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
        <comment>IK Analyzer 扩展配置</comment>
        <!--用户可以在这里配置自己的扩展字典 -->
        <entry key="ext_dict">my_word.dic</entry>
         <!--用户可以在这里配置自己的扩展停止词字典-->
        <entry key="ext_stopwords"></entry>
        <!--用户可以在这里配置远程扩展字典 -->
        <!-- <entry key="remote_ext_dict">words_location</entry> -->
        <!--用户可以在这里配置远程扩展停止词字典-->
        <!-- <entry key="remote_ext_stopwords">words_location</entry> -->
</properties>

```

退出，重启容器：

```shell
exit
docker restart elasticsearch
```

再来试一下效果：

```shell
{
  "tokens" : [
    {
      "token" : "学习",
      "start_offset" : 0,
      "end_offset" : 2,
      "type" : "CN_WORD",
      "position" : 0
    },
    {
      "token" : "学个屁",
      "start_offset" : 3,
      "end_offset" : 6,
      "type" : "CN_WORD",
      "position" : 1
    }
  ]
}

```

测试成功。

# ES 搜索语法

## keyword 和 text 的区别

keyword：关键词，存入数据时不会被分词

text：文本，存入数据时会被分词

再测试之前，还要再介绍一下 ES 的两种查询：

match:  模糊查询，会对搜索关键词分词

term:  精确查询，不会对搜索关键词分词

### 测试

创建索引。

name 为 keyword，desc 为 text：

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

插入三个字段：

```shell
PUT user/_doc/1
{
  "name": "user koorye1",
  "age": 19,
  "desc": "i love python"
}

PUT user/_doc/2
{
  "name": "user koorye2",
  "age": 20,
  "desc": "i love java"
}

PUT user/_doc/3
{
  "name": "user koorye3",
  "age": 21,
  "desc": "i love c"
}
```

接下来我们用两种匹配测试一下：

1. 对 keyword 使用模糊查询

```shell
GET user/_search
{
  "query": {
    "match": {
      "name": "user"
    }
  }
}
```

返回结果为空。为什么？因为 name 是 keyword 类型，被看作一个整体，我们不能使用 keyword 的部分内容进行匹配。

2. 对 keyword 使用精确查询

```shell
GET user/_search
{
  "query": {
    "term": {
      "name": "user koorye1"
    }
  }
}
```

查询关键词是精确的，name 也是关键词类型，都不会分词，故只有完全匹配才能测试成功。这次我们查到一条结果：

```shell
{
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 0.9808291,
    "hits" : [
      {
        "_index" : "user",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 0.9808291,
        "_source" : {
          "name" : "user koorye1",
          "age" : 19,
          "desc" : "i love python"
        }
      }
    ]
  }
}

```

3. 对 text 进行模糊匹配

```shell
GET user/_search
{
  "query": {
    "match": {
      "desc": "i love"
    }
  }
}
```

由于存储的是 text 类型，故已经被分词，相当于库中存储了 i / love / python / java / c 几个单词。我们使用模糊查询，故查询关键词被分词，是 i / love。模糊查询只需有一个关键词对应即可，所以可以成功匹配，返回 3 条结果：

```shell
{
  "took" : 3,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 3,
      "relation" : "eq"
    },
    "max_score" : 0.26706278,
    "hits" : [
      {
        "_index" : "user",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 0.26706278,
        "_source" : {
          "name" : "user koorye1",
          "age" : 19,
          "desc" : "i love python"
        }
      },
      {
        "_index" : "user",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : 0.26706278,
        "_source" : {
          "name" : "user koorye2",
          "age" : 20,
          "desc" : "i love java"
        }
      },
      {
        "_index" : "user",
        "_type" : "_doc",
        "_id" : "3",
        "_score" : 0.26706278,
        "_source" : {
          "name" : "user koorye3",
          "age" : 21,
          "desc" : "i love c"
        }
      }
    ]
  }
}

```

4. 对 text 进行精确匹配

```shell
GET user/_search
{
  "query": {
    "term": {
      "desc": "i love python"
    }
  }
}
```

字段完全相同，返回结果却为空？也许很出乎意料。原因是，由于 desc 属于 text 类型，库的字段已经被一个个拆开了，库中只有单独的 i / love / python 几个单词，却没有完整的 i love python 这个句子。因此，即使完全相同，我们这次也查不到结果。

相反，单个字段匹配反而可以用 term 得到结果：

```shell
GET user/_search
{
  "query": {
    "term": {
      "desc": "python"
    }
  }
}
```

返回体：

```shell
{
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 0.9808291,
    "hits" : [
      {
        "_index" : "user",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 0.9808291,
        "_source" : {
          "name" : "user koorye1",
          "age" : 19,
          "desc" : "i love python"
        }
      }
    ]
  }
}

```

## 过滤搜索结果

使用 _source 即可：

```shell
GET user/_search
{
  "query": {
    "match": {
      "desc": "i love"
    }
  },
  "_source": ["name", "age"]
}
```

返回体：

```shell
{
  "took" : 3,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 3,
      "relation" : "eq"
    },
    "max_score" : 1.497693,
    "hits" : [
      {
        "_index" : "user",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 1.497693,
        "_source" : {
          "name" : "user koorye1",
          "age" : 19
        }
      },
      {
        "_index" : "user",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : 1.497693,
        "_source" : {
          "name" : "user koorye2",
          "age" : 20
        }
      },
      {
        "_index" : "user",
        "_type" : "_doc",
        "_id" : "3",
        "_score" : 1.497693,
        "_source" : {
          "name" : "user koorye3",
          "age" : 21
        }
      }
    ]
  }
}

```

返回体中没有 desc.

## 结果分页与排序

通过 sort 指定排序规则，from 指定开始页，size 指定每页的数据量

```shell
GET user/_search
{
  "query": {
    "match": {
      "desc": "i love"
    }
  },
  "sort": [
    {
      "age": {
        "order": "desc"
      }
    }
  ],
  "from": 0,
  "size": 2
}
```

返回体：

```shell
{
  "took" : 22,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 3,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [
      {
        "_index" : "user",
        "_type" : "_doc",
        "_id" : "3",
        "_score" : null,
        "_source" : {
          "name" : "user koorye3",
          "age" : 21,
          "desc" : "i love c"
        },
        "sort" : [
          21
        ]
      },
      {
        "_index" : "user",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : null,
        "_source" : {
          "name" : "user koorye2",
          "age" : 20,
          "desc" : "i love java"
        },
        "sort" : [
          20
        ]
      }
    ]
  }
}

```

## 逻辑查询

ES 提供了几种逻辑类型来进行与或非判断：

- must  与，即都要匹配
- should  或，即有一种匹配
- must_not  非，即相反才匹配

与格式：

```shell
GET user/_search
{
  "query": {
    "bool": {
      "must": [{
          "match": {
            "desc": "love"
          }
        },{
          "match": {
            "age": "19"
          }
        }]
    }
  }
}
```

或格式：

```shell
GET user/_search
{
  "query": {
    "bool": {
      "should": [{
          "match": {
            "desc": "love"
          }
        },{
          "match": {
            "age": "19"
          }
        }]
    }
  }
}
```

非格式：

```shell
GET user/_search
{
  "query": {
    "bool": {
      "must_not": [{
         "match": {
           "age": "19"
         } 
        }]
    }
  }
}
```

## 区间查询

ES 提供了区间查询：

- gt  大于
- lt  小于
- gte  大于等于
- lte  小于等于

例：

```shell
GET user/_search
{
  "query": {
    "bool": {
      "filter": [{
          "range": {
            "age": {
              "gte": 20,
              "lte": 30
            }
          }
        }]
    }
  }
}
```

## 结果高亮

通过 highlight 指定需要高亮的字段：

```shell
GET user/_search
{
  "query": {
    "match": {
      "desc": "love"
    }
  },
  "highlight": {
    "fields": { 
      "desc": {}
    }
  }
}
```

返回体：

```shell
{
  "took" : 115,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 3,
      "relation" : "eq"
    },
    "max_score" : 0.13353139,
    "hits" : [
      {
        "_index" : "user",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 0.13353139,
        "_source" : {
          "name" : "user koorye1",
          "age" : 19,
          "desc" : "i love python"
        },
        "highlight" : {
          "desc" : [
            "i <em>love</em> python"
          ]
        }
      },
      {
        "_index" : "user",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : 0.13353139,
        "_source" : {
          "name" : "user koorye2",
          "age" : 20,
          "desc" : "i love java"
        },
        "highlight" : {
          "desc" : [
            "i <em>love</em> java"
          ]
        }
      },
      {
        "_index" : "user",
        "_type" : "_doc",
        "_id" : "3",
        "_score" : 0.13353139,
        "_source" : {
          "name" : "user koorye3",
          "age" : 21,
          "desc" : "i love c"
        },
        "highlight" : {
          "desc" : [
            "i <em>love</em> c"
          ]
        }
      }
    ]
  }
}

```

我们还可以自定义高亮的前后缀：

```shell
GET user/_search
{
  "query": {
    "match": {
      "desc": "love"
    }
  },
  "highlight": {
    "fields": { 
      "desc": {}
    },
    "pre_tags": "<span class='high'>",
    "post_tags": "</span>"
  }
}
```

返回体：

```shell
{
  "took" : 6,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 3,
      "relation" : "eq"
    },
    "max_score" : 0.13353139,
    "hits" : [
      {
        "_index" : "user",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 0.13353139,
        "_source" : {
          "name" : "user koorye1",
          "age" : 19,
          "desc" : "i love python"
        },
        "highlight" : {
          "desc" : [
            "i <span class='high'>love</span> python"
          ]
        }
      },
      {
        "_index" : "user",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : 0.13353139,
        "_source" : {
          "name" : "user koorye2",
          "age" : 20,
          "desc" : "i love java"
        },
        "highlight" : {
          "desc" : [
            "i <span class='high'>love</span> java"
          ]
        }
      },
      {
        "_index" : "user",
        "_type" : "_doc",
        "_id" : "3",
        "_score" : 0.13353139,
        "_source" : {
          "name" : "user koorye3",
          "age" : 21,
          "desc" : "i love c"
        },
        "highlight" : {
          "desc" : [
            "i <span class='high'>love</span> c"
          ]
        }
      }
    ]
  }
}

```
