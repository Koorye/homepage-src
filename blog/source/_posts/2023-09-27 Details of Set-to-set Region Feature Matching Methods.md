---
title: 集合到集合区域特征匹配方法详解
date: 2023-9-27 19:47:00
tags: [深度学习,小样本学习]
categories: 深度学习
description: 本文详细介绍了DeepEMD、DeepEMDv2、PLOT、POUF等集合到集合区域特征匹配方法的原理和实现细节。
---

# 方法
## DeepEMD (CVPR 2020)
**动机** 杂乱的背景和较大的类内外观变化给度量空间造成混乱，全局特征也会丢失有用的局部信息。

**解决方案** 利用EM距离度量结构（即局部特征集合）之间的相似性，该距离可以获得两结构之间具有最小成本的最佳匹配。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/202309270954175.png)

**One-shot** 对于一张query和support图像，通过backbone分别提取得到局部特征结构
$$
U\in\mathbb{R}^{H\times W\times C}, V\in\mathbb{R}^{H\times W\times C},
$$
记$M=H\times W$，则$U,V$分别拥有$M$个$C$维向量。

通过余弦距离计算两两向量之间的距离，即
$$
D=\{d_{ij}\}_{M\times M}, d(u_i, v_j)=1-\frac{u_i^Tv_j}{\Vert u_i\Vert\cdot\Vert v_j\Vert},
$$
基于距离矩阵求得最优运输矩阵$Q=\text{Solver}(D)=\{q_{ij}\}_{M\times M}$，之后就可以利用$C,D$求得整体的相似度，即
$$
s(U,V)=\sum_i^M\sum_j^M (1-d_{ij})q_{ij}.
$$

**扩展到k-shots** 与之前的few-shot方法为每个类别学习一个原型向量类似，该方法为每个类别学习一个原型结构，之后通过计算原型结构与图像结构之间的EM距离进行度量。这段实现上比较麻烦且论文中没有提到：
1. 以fine-tune的形式对模型进行预训练；
2. 将support结构特征的在shots上的均值作为每个类别原型结构的初始值；
3. 通过若干次内循环更新原型结构：
	1. 从support中采样若干样本以及它们的标签；
	2. 计算原型结构与这些样本的EM距离，得到logits；
	3. 计算logits与标签之间的损失，通过梯度进一步更新原型结构的值。
4. 得到每个类别原型结构之后，计算原型结构与query结构的EM距离，得到相似度用于推理。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/202309271037651.png)

**端到端学习** 上述介绍了DeepEMD的运行流程，然而如何求解最优运输矩阵？假设有m个生产者和k个消费者，第i个生产者拥有$s_i$个商品，第j个消费者需要$d_j$个商品，从第i个生产者运输1个商品到第j个消费者的成本为$c_{ij}$，如何构造运输矩阵使得总的运输成本最小？该问题可构造为如下形式：
$$
\min_x\sum_{i=1}^m\sum_{j=1}^kc_{ij}x_{ij},
$$
该问题有两个约束：
![image.png|300](https://raw.githubusercontent.com/Koorye/my-images/master/img/202309271112524.png)![image.png|240](https://raw.githubusercontent.com/Koorye/my-images/master/img/202309271113747.png)

对于该方法来说，$s_i=d_i=1$，可以利用线性代数中的拉格朗日公式求x的唯一解，作者在实现时则是通过直接调用qpath包进行计算的。

**总结** 该方法将最优化传输引入few-shot领域，较为新颖，然而也存在一些问题：
1. 求解最优运输矩阵计算量极大，时间复杂度为$o(n^3)$；
2. 1-shot时模型只需eposide training+testing即可；而k-shots时模型需要先pretrain再测试，且测试时还需要内循环更新原型结构的权重，方法较为复杂，且与其他方法对比不公平。

## DeepEMDv2 (TPAMI Extension 2020)
在DeepEMD基础上，提出了几种局部特征的提取方式：
1. 基于深度卷积网络提取局部特征；
2. 将图像均匀分割为网格之后，每个格子独立送入网络得到特征，组织成局部特征；
3. 在图像上随机裁剪patch，缩放到相同尺寸送入网络得到特征，组织成局部特征。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/202309271145809.png)

最终随机裁剪取得了最好的效果，相比v1又有1~2个点的提升。

## PLOT (ICLR 2023)
**动机** 一张图像往往存在多个有用的内在特征，然而现有的方法鼓励不同空间学习相同特征，导致特征没有得到充分利用。

**解决方案** 引入最优化传输方法，以多重采样的形式计算局部视觉特征与多个文本特征之间的最优匹配。

**方法** 一张图像通过图像编码器得到其局部特征$F=\{f_m|_{m=1}^M\},M=H\times W$；另一方面，第k个类别及其prompt通过文本编码器得到其局部特征$G_k=\{g_n|_{n=1}^{N}\}$。于是每个类别的文本局部特征与视觉局部特征之间可以两两计算距离，构造成本矩阵
$$
C_k=1-F^TG_k,
$$
可以通过sinkhorn算法对成本矩阵求解近似最优分配之后的距离
$$
d_{OT}(k)=\text{sinkhorn}(C_k),
$$
于是可以得到类别k的概率
$$
p_{OT}(y=k|x)=\frac{\exp((1-d_{OT}(k))/\tau)}{\sum_{k'=1}^K\exp((1-d_{OT}(k'))/\tau)}.
$$

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/202309271630798.png)

**Sinkhorn如何工作** sinkhorn是用来近似求解最优运输矩阵的方法，其流程非常简单：
1. 对于成本矩阵$C\in\mathbb{R}^{M\times N}$，初始化行向量$u\in\mathbb{R}^M=\frac1M$，列向量$v\in\mathbb{R}^N=\frac1N$，缩放系数$\lambda$；
2. 进行N次主循环：
	1. $u\leftarrow u/((\exp(-C)/\lambda)v)$；
	2. $v\leftarrow v/((\exp(-C)/\lambda)^Tu)$；
3. $T=\text{diag}(u)\exp(-C/\lambda)\text{diag}(v)$。

之后将T与成本矩阵相乘就得到最优距离矩阵。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/202309271656442.png)

## POUF (ICML 2023)
**动机** prompt tuning微调阶段仍然需要监督。

**解决方案** 通过无监督的约束进行微调：最小化传输距离、最大化互信息。

**方法** 对于K个类别的文本特征和N个图像特征，可以构造成本矩阵$C\in\mathbb{R}^{K\times N}$，之后通过最优化求解运输矩阵$T$。

**最小化传输距离** 该约束的目的是拉近文本特征和图像特征总体的距离，具体的做法是将运输矩阵和成本矩阵相乘，之后让矩阵的迹最小化，事实上该损失就是让文本和图像样本尽可能一对一匹配
$$
\min_T \text{Tr}(T^TC),
$$
这里分别求解图像到文本、文本到图像的成本矩阵和运输矩阵并计算损失。

**最大化互信息**  该约束是一个正则化项，鼓励预测的多样性。首先让预测概率的熵最大化，鼓励预测的不确定性；其次让条件熵最大
$$
\max[H(Y)+H(Y|X)].
$$

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/202309271703742.png)

