---
title: 用Python制作自己想要的词云图吧！
date: 2020-04-20 13:38:56
tags: [Python,词云]
categories: 绘图
description: 词云是一种文本可视化的方式，通过词云图可以直观地看出文本中的热点词汇，词频高的词汇在词云图中会显示的更大，词云图的生成可以通过Python中的wordcloud库来实现，下面我们就来看看如何用Python制作自己想要的词云图吧！
---

我们经常可以见到可视化表示的生动形象的词频图片，这便是词云，比如统计2019年的搜索热词，我们便可以把搜索量前十的词语做成词云图，搜索量越大，图中出现的词频数就越高，如此就可以生成鲜明的可视化词频图了，那么这样的图片如何通过python批量生成呢？

很幸运，python的wordcloud库为我们提供了现成的方法。

****

# 最简单的英文词云生成方法

````python
import matplotlib.pyplot as plt
import wordcloud

#此段用于创建一个存储词汇的字典并导入词汇
dic={}
f=open('source.txt','r')
‘for each in s:
    dic.update({each.strip():x})
    x+=1

#此段用于生成词云
wc=wordcloud.WordCloud()
wc.generate_from_frequencies(dic)

#此段用于显示词云效果并存储
plt.imshow(wc)
plt.axis("off")
plt.show()
wc.to_file('result.jpg')
````

效果如图所示

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2cb9aa05b9e83a9e6f2971c56b045dfb.jpeg)
****

# 关键词重复多次的英文词云生成方法

完成最简单的词云后，我发现每个词语只会出现一次，于是在查阅资料后，我发现了``repeat``函数并作出以下修改。

```python
wc.wordcloud.WordCloud(
    max_words=1000, #词云中的最大词汇量
    repeat=True #开启词汇重复
)
```

效果如图所示：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/0e6a151244ab5040df15d686a9979dfd.jpeg)
****

# 有形状的英文词云生成方法

接下来就是解决词云形状的问题，即把词云变成风车形。此处用到`PIL，munpy`库和`wordcloud`库中的`mask`函数。

修改/添加如下：

```python
mask = np.array(Image.open('logo.jpg'))
wc.wordcloud.WordCloud(
    mask=mask, #生成遮罩层
    background_color='white', #选择背景色
    max_words=1000,
    repeat=True
)
```

`mask`函数使词云中字符的颜色与所提供图片对应位置的颜色相同，从而生成对应的紫、红、绿、蓝字符。为方便演示，此处作出如下修改：

```python
wc.wordcloud.WordCloud(
    ......
    background_color='black', #把背景设为黑色以便于演示
    ......
)
```

效果如图所示：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/a512824f149de9621e9da0a17463c79c.jpeg)

可以看到原logo图的四色风叶位置生成了对应的四色字符，而logo图的白色背景位置也生成了对应的白色字符。

那么，要怎么去掉白色字符呢？答案很简单，只要让词云的背景色设置为白色，这些白色字符就会融入背景，看不出来了。

于是我们恢复之前的修改：

```python
wc.wordcloud.WordCloud(
    ......
    background_color='white', #把背景改回白色
    ......
)
```

# 最终效果
最终效果如图所示：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/8ab78833acaa70bfd3cbf546c850679e.jpeg)

****

还有一些细节部分，如词云图高度宽度的设置、字体的设置，此处就不一一细说，下面是完整的代码：

```python
import wordcloud
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt

dic={}
str=''
x=0
f=open('source.txt')
s=f.readlines()
for each in s:
    dic.update({each.strip():x})
    x+=1


mask = np.array(Image.open('logo.jpg'))
wc = wordcloud.WordCloud(
    height=2000,
    width=2000,
    collocations=False,
    font_path='C:/Windows/Fonts/simhei.ttf',
    mask=mask,
    max_words=1000,
    max_font_size=400,
    background_color='white',
    repeat=True
)

wc.generate_from_frequencies(dic)
image_colors = wordcloud.ImageColorGenerator(mask)
wc.recolor(color_func=image_colors)
plt.imshow(wc)
plt.axis('off')
plt.show()
wc.to_file('result.jpg')
```
