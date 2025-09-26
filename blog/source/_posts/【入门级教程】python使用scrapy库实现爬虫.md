---
title: 【入门级教程】python使用scrapy库实现爬虫
date: 2020-04-28 00:01:37
tags: [爬虫,Python]
categories: 爬虫
description: 本文是一个入门级教程，会记录下从零开始使用scrapy实现最简单爬虫的全过程。
---

一开始笔者都是使用`requests`+`bs4`实现爬虫，直到后来我发现了有一个功能强大使用简单的爬虫框架——`scrapy`，本文是一个入门级教程，会记录下从零开始使用`scrapy`实现最简单爬虫的全过程：

----
# 搭建scrapy项目
## 安装scrapy
第一步，安装`scrapy`，在命令行中输入：
```python
pip install scrapy
```
当然，如果你使用的是`pycharm`，就可以在`Project:Python` → `Project Interperter` → 点击右侧的+号搜索`scrapy`进行安装。

----
## 构造scrapy框架
第二步，构建`scrapy`框架，在命令行中输入：
```python
scrapy startproject xxx（项目名）
```
此处笔者输入了`scrapy startproject hello_scrapy`，便会在项目目录下生成一个`hello_scrapy`文件夹：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/d824e4e4e37df6f2e39e78a02f45725f.png)
`hello_scrapy`文件夹内有如下结构：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/ee8fdd4ee2e7132ddd5b1e1e61b4adff.png)
第二个`hello_scrapy`目录内有，这里有各种各样的配置文件，作为入门教程，我们只需要了解`settings.py`的部分配置：![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/a738e3c8794845bab585b45fb8df7644.png)
`spiders`目录内有：![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e30c16abc097044d6780f1545091ba34.png)

----

## 构建一个爬虫
接下来，我们在项目中构建第一个爬虫，在命令行中输入：
```python
cd 项目名
scrapy genspider xxx（爬虫名） xxxxxx（域名）
```
`cd`命令用于切换文件夹到项目文件夹内，`scrapy genspider`用于创建一个爬虫，第一个参数是爬虫名，此处爬虫名**切忌与项目名重复!** 第二个参数是域名，如想要爬取的网站如果是百度百科对`Python`的记录：`https://baike.baidu.com/item/Python/407313`，它的域名便是掐头去尾剩下的部分：`baidu.com`

此处笔者想实现一个爬取英为财情`https://cn.investing.com/`网上期货数据的爬虫，便输入了以下命令：
```python
cd hello_scrapy
scrapy genspider futures_spider investing.com
```

输入后便会在`hello_scrapy/hello_scrapy/spiders`中生成一个新文件`futures_spider.py`（期货爬虫）：![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/d76271e1a957442e5f04e339d993e6fb.png)
`futures_spider.py`中的内容：
```python
# -*- coding: utf-8 -*-
import scrapy


class FuturesSpiderSpider(scrapy.Spider):
    name = 'futures_spider'
    allowed_domains = ['investing.com']
    start_urls = ['http://investing.com/']

    def parse(self, response):
        pass
```
此处的`pass`便是我们需要输入的地方。

----

# 分析网页
## 观察网页源代码
我们先来浏览一下英为财情网的期货数据，我们要爬取的网页是：`https://cn.investing.com/commodities/real-time-futures`
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/5ed7e66864687d645c603b66d74fd1d6.png)
通过观察网页的结构和源代码，我们发现网页的期货数据被存储在表格结构中，接下来，我们就要对这个表格中的数据进行爬取：

----
## 学习网页结构（了解可以跳过）
作为入门教程，我们先来简单了解一下网页结构：每个网页都分为`head`和`body`，`head`主要用于网页的初始化，例如设置编码格式，设置标题，引入脚本，引入风格样式等；而`body`用于显示网页的内容，如下便是一个基础的网页结构：
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>网页标题</title>
</head>
<body>
Hello html!
</body>
</html>
```
效果如下，非常简单：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/26548088bd8fda4743717a7e7e13fc31.png)

----
## 学习网页表格（了解可以跳过）
接下来，我们来了解一下网页的表格结构：
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>表格示例</title>
</head>
<body>
<table>
  <tr>
    <th>ID</th>
    <th>Name</th>
  </tr>
  <tr>
    <td>NO.001</td>
    <td>Alex</td>
  </tr>
  <tr>
    <td>NO.002</td>
    <td>Amy</td>
  </tr>
  <tr>
    <td>NO.003</td>
    <td>John</td>
  </tr>
    <tr>
    <td>NO.004</td>
    <td>Helen</td>
  </tr>
</table>
</body>
</html>
```
这是一个简单的表格：
- `table`是表格本体
- `table`中包含`tr`，即`table row`，表示表格的一行
- `tr`中有`th`和`td`，`th`即`table head`，意为表头
- `td`即`table data`，意为表中数据，即表身

我们这里的表格创建了`ID`和`Name`两个表头，表中导入了四排数据，效果如下：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/c1f8353e0461c2d5d3c90ea131ea9f02.png)

----

## 学习XPath语法（了解可以跳过）
在简单了解`html`之后，我们来了解一下`xpath`语法：
- `//`表示选择所有，如`//tr`表示选择所有`tr`行
- `./`表示当前目录的下一个目录
- text()表示该目录的中内容

即使不熟悉`xpath`，我们也有另一个办法，通过在想获取的元素上右键检查（笔者使用`chrome`作为浏览器），在元素上右键 → `Copy` → `Copy Xpath`，我们便可以获得该元素的`Xpath`：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/9e7ca1c634d3bc990afbbe8ad4859042.png)
此示例获取的`xpath`：`/html/body/table/tbody/tr[4]/td[2]`，当然我们也可以通过`Copy full Xpath`获取完整的`Xpath`。

我们来观察一下此例中得到的`Xpath`：

`John`位于：
- `<html>` 
- → ` <body>` 
- → `<table>` 
- → `<tbody>`（`tbody`与`thead`对应，表示表身，即使源代码中不写，浏览器编译后也会自动生成）
- → `tr[4]`（即第4个`tr`，此处的`tr`的位置用数组形式表示索引）
- → `td[2]`（即第2个`td`，同样使用索引标记位置）

在了解这些前置知识之后，我们就可以开始实现`parse`函数，我们再次观察要爬取的网页：![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/6bfe826cf70ca157c000ab9e65e28c18.png)

可以发现，表格中`tr`行的第2个数据里的超链接标签`a`对应商品名，第4个对应最新价，第8个对应涨跌幅。

因此，
- 商品名内容的`XPath`路径为`//tr/td[2]/a/text()`(意为所有`tr`标签下的第二个`td`里`a`标签的内容)
- 最新价为`//tr/td[4]/text()`
- 涨跌幅为`//tr/td[8]/text()`

----
# 实现爬虫
## 修改指定的网页名

把`start_urls`指定的网页修改成所要爬取的网页名：
```python
start_urls = ['https://cn.investing.com/commodities/real-time-futures']
```

----
## 编写parse函数
实现`parse`函数（`parse`意为语法分析，顾名思义，用于解读网页结构获取内容）

```python
def parse(self, response):
    #创建一个selector列表，其中包含所有tr行
    selectors = response.xpath('//tr')
    #遍历selector列表
    for selector in selectors:
        #获取商品名,get函数用于得到一个元素
        futures_type = selector.xpath('./td[2]/a/text()').get()
        #获取最新价
        latest_price = selector.xpath('./td[4]/text()').get()
        #获取涨跌幅
        change_rate = selector.xpath('./td[8]/text()').get()
        #如果数据存在（防止遍历到没有数据的tr行）
        if futures_type and latest_price and change_rate:
            #打印数据
            print(futures_type, latest_price, change_rate)
```

----

# 运行爬虫
## 运行命令
接下来我们来运行一下试试，运行爬虫需要在命令行中项目目录下输入如下指令：
```python
scrapy crawl xxx（爬虫名）
```
笔者此处输入：
```python
scrapy crawl futures_spider
```
效果如下，此处为节省篇幅只显示错误提示：
```python
2020-04-27 23:46:28 [scrapy.core.engine] DEBUG: Crawled (403) <GET https://cn.investing.com/commodities/real-time-futures> (referer: None)
2020-04-27 23:46:28 [scrapy.spidermiddlewares.httperror] INFO: Ignoring response <403 https://cn.investing.com/commodities/real-time-futures
>: HTTP status code is not handled or not allowed
```
可以看到，网页报了403错误，意为服务器拒绝处理，这是为什么呢？

----
## 配置settings
### 设置ROBOT君子协议
因为我们没有在`settings.py`中设置一些必要的选项，`settings`中有一条`ROBOTSTXT_OBEY`，意为是否遵守君子协议，若为`True`，你可以爬取的格式、范围、次数等就要受到网站要求的限制，所以为了正常爬取，我们需要修改为`False`（你懂的）：
```python
# Obey robots.txt rules
ROBOTSTXT_OBEY = True
```

### 设置请求头
然而这样设置之后还是不行，因为我们需要指定`User-Agent`请求头，才能把爬虫伪装成一个浏览器，`User-Agent`同样可以在`settings`中设置：
```python
# Crawl responsibly by identifying yourself (and your website) on the user-agent
USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.54 Safari/536.5'
```

设置之后，我们便可以得到数据啦，再次在命令行中输入：
```python
scrapy crawl futures_spider
```

返回结果：
```python
2020-04-27 23:56:01 [scrapy.utils.log] INFO: Scrapy 2.0.1 started (bot: hello_scrapy)
2020-04-27 23:56:01 [scrapy.utils.log] INFO: Versions: lxml 4.5.0.0, libxml2 2.9.5, cssselect 1.1.0, parsel 1.5.2, w3lib 1.21.0, Twisted 20.
3.0, Python 3.8.2 (tags/v3.8.2:7b3ab59, Feb 25 2020, 23:03:10) [MSC v.1916 64 bit (AMD64)], pyOpenSSL 19.1.0 (OpenSSL 1.1.1f  31 Mar 2020),
cryptography 2.9, Platform Windows-10-10.0.18362-SP0
2020-04-27 23:56:01 [scrapy.utils.log] DEBUG: Using reactor: twisted.internet.selectreactor.SelectReactor
2020-04-27 23:56:01 [scrapy.crawler] INFO: Overridden settings:
{'BOT_NAME': 'hello_scrapy',
 'NEWSPIDER_MODULE': 'hello_scrapy.spiders',
 'SPIDER_MODULES': ['hello_scrapy.spiders'],
 'USER_AGENT': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) '
               'AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.54 '
               'Safari/536.5'}
2020-04-27 23:56:01 [scrapy.extensions.telnet] INFO: Telnet Password: 8f3e69fc82bdb3cc
2020-04-27 23:56:01 [scrapy.middleware] INFO: Enabled extensions:
['scrapy.extensions.corestats.CoreStats',
 'scrapy.extensions.telnet.TelnetConsole',
 'scrapy.extensions.logstats.LogStats']
2020-04-27 23:56:02 [scrapy.middleware] INFO: Enabled downloader middlewares:
['scrapy.downloadermiddlewares.httpauth.HttpAuthMiddleware',
 'scrapy.downloadermiddlewares.downloadtimeout.DownloadTimeoutMiddleware',
 'scrapy.downloadermiddlewares.defaultheaders.DefaultHeadersMiddleware',
 'scrapy.downloadermiddlewares.useragent.UserAgentMiddleware',
 'scrapy.downloadermiddlewares.retry.RetryMiddleware',
 'scrapy.downloadermiddlewares.redirect.MetaRefreshMiddleware',
 'scrapy.downloadermiddlewares.httpcompression.HttpCompressionMiddleware',
 'scrapy.downloadermiddlewares.redirect.RedirectMiddleware',
 'scrapy.downloadermiddlewares.cookies.CookiesMiddleware',
 'scrapy.downloadermiddlewares.httpproxy.HttpProxyMiddleware',
 'scrapy.downloadermiddlewares.stats.DownloaderStats']
2020-04-27 23:56:02 [scrapy.middleware] INFO: Enabled spider middlewares:
['scrapy.spidermiddlewares.httperror.HttpErrorMiddleware',
 'scrapy.spidermiddlewares.offsite.OffsiteMiddleware',
 'scrapy.spidermiddlewares.referer.RefererMiddleware',
 'scrapy.spidermiddlewares.urllength.UrlLengthMiddleware',
 'scrapy.spidermiddlewares.depth.DepthMiddleware']
2020-04-27 23:56:02 [scrapy.middleware] INFO: Enabled item pipelines:
[]
2020-04-27 23:56:02 [scrapy.core.engine] INFO: Spider opened
2020-04-27 23:56:02 [scrapy.extensions.logstats] INFO: Crawled 0 pages (at 0 pages/min), scraped 0 items (at 0 items/min)
2020-04-27 23:56:02 [scrapy.extensions.telnet] INFO: Telnet console listening on 127.0.0.1:6023
2020-04-27 23:56:03 [scrapy.core.engine] DEBUG: Crawled (200) <GET https://cn.investing.com/commodities/real-time-futures> (referer: None)
黄金 1,723.45 -0.70%
XAU/USD 1,710.37 -1.07%
白银 15.273 +0.07%
铜 2.349 +0.53%
铂 777.75 +0.51%
钯 1,897.30 -4.43%
WTI原油 12.23 -27.80%
伦敦布伦特原油 22.82 -8.02%
天然气 1.837 -3.06%
燃料油 0.7071 -3.51%
RBOB汽油 0.6939 -0.89%
伦敦汽油 192.75 -6.20%
铝 1,507.75 -0.54%
锌 1,910.50 +1.16%
铅 1,638.75 +0.74%
镍 12,240.00 -0.16%
铜 5,199.25 +0.20%
锡 15,450.00 +3.14%
美国小麦 525.88 -0.78%
稻谷 14.655 -0.07%
玉米 314.62 -2.29%
美国大豆 840.62 +0.07%
美国大豆油 24.94 -2.20%
美国豆粕 292.50 -0.03%
美国二号棉花 54.96 -1.20%
美国可可 2,330.50 +0.32%
美国C型咖啡 106.20 -0.52%
伦敦咖啡 1,143.00 0.00%
美国11号糖 9.52 -2.96%
橙汁 112.08 +3.20%
活牛 83.675 +1.27%
瘦肉猪 56.17 +6.94%
饲牛 118.69 +1.21%
木材 312.30 -3.10%
燕麦 281.10 -1.26%
2020-04-27 23:56:03 [scrapy.core.engine] INFO: Closing spider (finished)
2020-04-27 23:56:03 [scrapy.statscollectors] INFO: Dumping Scrapy stats:
{'downloader/request_bytes': 328,
 'downloader/request_count': 1,
 'downloader/request_method_count/GET': 1,
 'downloader/response_bytes': 55344,
 'downloader/response_count': 1,
 'downloader/response_status_count/200': 1,
 'elapsed_time_seconds': 1.551372,
 'finish_reason': 'finished',
 'finish_time': datetime.datetime(2020, 4, 27, 15, 56, 3, 887893),
 'log_count/DEBUG': 1,
 'log_count/INFO': 10,
 'response_received_count': 1,
 'scheduler/dequeued': 1,
 'scheduler/dequeued/memory': 1,
 'scheduler/enqueued': 1,
 'scheduler/enqueued/memory': 1,
 'start_time': datetime.datetime(2020, 4, 27, 15, 56, 2, 336521)}
2020-04-27 23:56:03 [scrapy.core.engine] INFO: Spider closed (finished)

```

这样我们就得到结果啦，接下来可以写一个`writer`存储数据，笔者此处便不再赘述。