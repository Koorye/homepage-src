---
title: 小样本学习中的局部特征学习方法
date: 2023-9-11 19:47:00
tags: [深度学习,小样本学习]
categories: 深度学习
description: 小样本学习中局部特征学习非常重要，因为在有限的样本中，局部特征能够更好地捕捉样本的细节信息，从而提高模型的泛化能力。本文总结了小样本学习中局部特征学习的方法，包括局部特征匹配和局部特征融合两大类方法。
---

# 方法
## 局部特征匹配
### Few-shot Image Classification
#### DeepBDC (CVPR 2022)
采用BDC距离衡量局部特征，具体来说，特征可选择在空间或通道维度进行两两相似度计算，之后作行、列归一化和开方得到BDC矩阵，并计算BDC矩阵的相似度作为度量。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/202309110912192.png)

#### DeepEMD (CVPR 2020)
计算局部特征的最优化传输距离作为度量。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/202309110918322.png)
#### Dense Classification (CVPR 2019)
对特征的每个region单独进行分类后融合分数。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/202309110923071.png)

 ### VLM P re t ra in ing
 #### GLIP (CVPR 2022)
通过衡量图像区域与文本局部单词特征的相似度进行训练，为了加强匹配，还加入fusion模块促进两模态的融合。

 ![Qe32LHjYgJVONfo](https://s2.loli.net/2023/09/12/Qe32LHjYgJVONfo.jpg)

#### RegionCLIP (CVPR 2021)
CLIP首先在图像文本对上训练，之后在图像区域和类别描述对上训练，最后可用于细粒度的视觉任务。

![WmaKnirYEJb49PN](https://s2.loli.net/2023/09/12/WmaKnirYEJb49PN.jpg)

#### FILIP (arXiv 2021)
衡量图像和文本局部特征之间的相似度，之后聚合成全局相似度进行训练。

![ZOjdXBJMTLE7AfW](https://s2.loli.net/2023/09/12/ZOjdXBJMTLE7AfW.jpg)

### VLM Transfer
#### PLOT (ICLR 2023)
计算视觉局部特征与文本特征的最优化分配矩阵，通过加权融合得到每个类别的分数。

![6zG5RmO1e7nCbwv](https://s2.loli.net/2023/09/12/6zG5RmO1e7nCbwv.jpg)

#### TaI-DPT (CVPR 2022)
利用摘要文本对预训练后，图像通过编码得到全局和局部特征，其中全局特征与全局prompt编码的文本特征计算相似度，局部特征则与局部prompt编码的文本特征计算相似度后融合，最后两者加权得到分数。

![4MzwktVx57Q86eA](https://s2.loli.net/2023/09/12/4MzwktVx57Q86eA.jpg)

#### DualCoOp (arXiv 2022)
视觉局部特征与文本特征计算相似度，再通过softmax计算权重，最后加权融合。

![HZVU5Qx6Fti4Bru](https://s2.loli.net/2023/09/12/HZVU5Qx6Fti4Bru.jpg)

### Few-shot Object Detection
#### DETReg (CVPR 2023)
采用启发式方法在图像上挑选区域，并通过自监督模型为每个区域编码信息。训练一个检测器负责预测区域是否存在，位置及编码。

![Sx1h8lIpE5rjmUK](https://s2.loli.net/2023/09/13/Sx1h8lIpE5rjmUK.jpg)

## 局部特征融合
### Few-shot Image Classification
#### IDeMe-Net (CVPR 2019)
对于两张图像，预测每个region的权重，之后加权融合在一起，从而进行数据增强。

![](https://raw.githubusercontent.com/Koorye/my-images/master/img/202309110930005.png)

#### Spot and Learn (CVPR 2019)
利用强化学习预测一张图像上的patch序列，这些patch送入一个rnn进行预测。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/202309110932170.png)

#### FEMN (CVPR 2019)
计算前/背景图像的相似度矩阵，之后拼接query图像与support图像的相似度矩阵并送入head预测分数。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/202309110936755.png)

#### Attention Network (CVPR 2017)
计算词向量与视觉局部特征之间的相似度作为mask。

![i7YrZ28T64akH9g](https://s2.loli.net/2023/09/12/i7YrZ28T64akH9g.jpg)

#### Cross Attention Network (NeurIPS 2017)
计算查询与支持特征局部特征的两两相似度($R=m\times m,m=h\times w$)，之后相似度矩阵R通过自预测参数的卷积进一步融合得到mask，将其应用到原特征上。

![VCxve6X8y3I4gqP](https://s2.loli.net/2023/09/12/VCxve6X8y3I4gqP.jpg)

### VLM Pretraining
#### HICLIP (ICLR 2023)
transformer在各层前向过程中进行自适应的分组和分层。

![lLqcfej2KHTvIwQ](https://s2.loli.net/2023/09/12/lLqcfej2KHTvIwQ.jpg)

### VLM Transfer
#### CALIP (AAAI 2023)
通过一个无需参数的注意力机制进行融合，利用融合后特征进行度量。


![gvhWBym3nRQ9NLT](https://s2.loli.net/2023/09/12/gvhWBym3nRQ9NLT.jpg)

#### SP (CVPR 2023)
通过空间和通过交互对每个patch token进行融合，前者即将文本token与patch token拼接在一起作attention，后者即将文本token与patch token的均值拼接在一起通过MLP进行融合。

![1fltvN5suihwQTa](https://s2.loli.net/2023/09/12/1fltvN5suihwQTa.jpg)

#### DenseCLIP (CVPR 2023)
文本特征与视觉局部特征计算相似度得到分数图，将分数图送入解码器来预测分割图。

![nftURovFOjKWec8](https://s2.loli.net/2023/09/12/nftURovFOjKWec8.jpg)

#### PLEor (CVPR 2023)
图像通过卷积网络再放缩回图像尺寸得到图像prompt，该prompt反映了每个像素包含类别特定特征的比例。于是prompt与原图相乘得到去除无关特征的图像，1-prompt与原图相乘得到只有无关特征的图像，两者进行编码得到特征，前者与对应类别的文本特征相逼近，后者与所有类别特征相远离。

![rax18qOQ4UAmVSf](https://s2.loli.net/2023/09/12/rax18qOQ4UAmVSf.jpg)

### Few-shot Object Detection
#### Attention RPN (CVPR 2020)
将支持集平均特征作为卷积核参数，在查询集局部特征上进行逐元素卷积进行融合。

![bERlLcf2PrM5IYh](https://s2.loli.net/2023/09/13/bERlLcf2PrM5IYh.jpg)

#### DRD (CVPR 2021)
通过co-attention机制进行查询与支持特征的深度融合。

![FSB4ucNlwLM6YIR](https://s2.loli.net/2023/09/13/FSB4ucNlwLM6YIR.jpg)

#### DAnA (TMM 2021)
特征首先通过通道自注意力增强，之后查询与支持特征作attention并于支持特征自身的变换相加，最后注意力图与支持特征相乘得到每个空间位置的支持向量，并在多个shot之间求均值。

![orRwxMdVfIazjuW](https://s2.loli.net/2023/09/13/orRwxMdVfIazjuW.jpg)

#### Meta Faster-RCNN (AAAI 2022)
支持和查询特征首先计算亲和力（即相似度）矩阵，与支持特征相乘以进行特征对齐，之后亲和力矩阵按行求和得到mask，与支持和查询特征相乘以保留前景。

![3YGj6LqMdHuNPIc](https://s2.loli.net/2023/09/13/3YGj6LqMdHuNPIc.jpg)

#### FCT (CVPR 2022)
采用cross transformer结构实现支持和查询特征的深入融合。

![qY3OW1wQ9z64JVa](https://s2.loli.net/2023/09/13/qY3OW1wQ9z64JVa.jpg)

#### PA-BoVW (ECCV 2022)
利用自监督方法训练一个词袋（包含若干原型），之后利用词袋的每个原型与检测器backbone特征与自监督特征计算相似度得到相似度图，对两者的相似度图进行蒸馏。

![adqbSX5xmv8UugT](https://s2.loli.net/2023/09/13/adqbSX5xmv8UugT.jpg)

## 其他方法
### CME (CVPR 2021)
在finetune过程中逐渐屏蔽图像梯度最大的区域进行扰动，从而增强数据。

![IelVBM5vhTpwYUC](https://s2.loli.net/2023/09/13/IelVBM5vhTpwYUC.jpg)

# 总结
局部特征的利用可以分为匹配和融合两大类。前者的目标是设计某种度量方式进行两种样本或模态之间的匹配，从而实现分类；后者的目标是使得两种样本或模态的特征按需求进行融合，更好馈送到之后的任务。

**局部特征匹配** 这类方法往往提出一些人工设计的度量指标（如协方差、BDC距离、EM距离等），代替简单余弦相似度；还有的方法提出可学习的模块用于匹配，例如对每个region单独进行分类后聚合。究其根本，度量方式可以分为：
- region-region 这类方法对每个region单独打分，之后再进行聚合作为总分。
- set-set 这类方法直接将所有region视为一个集合，通过一些度量方式进行集合到集合的直接打分。

**局部特征融合** 这类方法通过一些特定的结构，实现局部特征自身，或是两个样本或模态的局部特征之间的融合。
- 对于局部特征自身的融合来说，一些分层或循环结构被采用，用于提取coarse-to-refine、low-to-high的特征。
- 对于跨样本或模态的局部特征融合来说，最主流的做法是类似attention或transformer的结构，如concat+attention、cross-attention、co-attention、多层cross-attention+ffn等，几乎是attention的各种变体。
