---
title: 小样本学习中的元知识学习方法
date: 2023-8-21 19:47:00
tags: [深度学习,小样本学习]
categories: 深度学习
description: 本文调查了小样本学习中提取知识的方法，包括模型结构、微调策略、度量策略等方面的设计，并希望总结出一些规律，在prompt tuning的设计上能够有所启发。
---

# 概述
Few-shot learning旨在利用极少量数据使模型适应一个任务。由于样本量及其稀少，提取有效知识变得困难，模型非常容易过拟合到背景和噪声信息上。本文调查了few-shot learning中提取知识的方法，包括模型结构、微调策略、度量策略等方面的设计，并希望总结出一些规律，在prompt tuning的设计上能够有所启发。

# 方法
## Siamese Learnet (NeurIPS 2016)
采用特定的网络学习部分参数，为了减少参数量，对卷积核进行分解。

![Pasted image 20230417103801](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241023259.png)

## Regression Nets (ECCV 2016)
引入额外数据对。

![Pasted image 20230417113342](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241024003.png)

## Z.Xu et al. (CVPR 2017)
通过外部数据和memory辅助分类。

![Pasted image 20230418145137](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241024933.png)

## MAML (ICML 2017)
采用元学习的方式优化参数，通过在大量子任务（包含训练集和测试集）上训练，模型在测试集上微调，之后就可以在未知任务上泛化。

![Pasted image 20230415164452](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241024289.png)

## Multi-attention Net (CVPR 2017)
通过文本特征提取图像特征的重要部分（通过attention）。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/20230826153520.png)

## Shrinking and Hallucinating (ECCV 2017)
通过人工构造的四元组(z1, z2, x1, x2)训练一个生成器，学习z1和z2之间的变化，并将变化应用于x1来生成x2，之后在few-shot设置时抽取三元组来合成样本。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/20230826221726.png)

## MT-net (ICML 2018)
添加了一个变换矩阵T和掩码矩阵M，T在前向传播时对特征进行变换，M由0或1组成，在反向传播时对梯度进行屏蔽。M和T在外循环时更新，为了使M可学习，采用gumbel-softmax进行处理。

![Pasted image 20230415170637](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241024214.png)

## MM-Net (CVPR 2018)
使用一个可学习的memory模块提取样本中的共有信息。

![Pasted image 20230415110151](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241024451.png)

## TADAM (NeurIPS 2018)
通过一个专门的网络学习task特定信息。

![Pasted image 20230414180430](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241025502.png)

## Cross-Modulation Nets (NeurIPS 2018)
利用显式结构学习查询集和支持集之间的关系。

![Pasted image 20230415105722](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241025132.png)

## GNN (ICLR 2018)
利用显式结构学习查询集和支持集之间的关系。

![Pasted image 20230415152853](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241025704.png)

## Dynamic Nets (CVPR 2018)
利用特定网络从基类分类参数中学习新类分类参数。

![Pasted image 20230417143354](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241026616.png)

## CSNs (ICML 2018)
存储图像特征和元信息（如每一层的损失梯度）到一个memory模块中，预测时通过图像特征查询memory得到每一层的偏移值，加在网络参数上进行微调。

![Pasted image 20230417220026](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241026538.png)

## MetaGAN (NeurIPS 2018)
生成伪样本并让分类器进行区分。

## RelationNet (CVPR 2018)
直接学习图像特征之间的关系并打分。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/20230826164412.png)

## Delta-encoder (NeurIPS 2018)
通过一个encoder-decoder网络显式学习一对样本之间的关系，用于对另一个样本进行变换。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/20230826220721.png)

## DN4 (CVPR 2019)
衡量局部特征的关系代替全局特征的关系。

![Pasted image 20230415151357](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241026528.png)

## EGNN (CVPR 2019)
利用显式结构学习查询集和支持集之间的关系。

![Pasted image 20230415154621](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241026151.png)

## CTM (CVPR 2019)
将不同类别的特征输入一个特定网络以学习跨类别的共享特征，之后通过softmax计算逐通道的掩码并应用到原特征上。

![Pasted image 20230415162342](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241027172.png)

## AM3 (NeurIPS 2019)
融合跨模态（视觉、语言）特征以帮助分类。

![Pasted image 20230415103003](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241027110.png)

## CovaMNet (AAAI 2019)
衡量局部特征的关系代替全局特征的关系。

![Pasted image 20230415143840](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241028773.png)

## LEO (ICLR 2019)
将特征投影到低维空间以提取主要或共有信息。

![Pasted image 20230415172919](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241028723.png)

## S. Gidaris et al. (ICCV 2019)
引入额外的辅助任务。

![Pasted image 20230418111756](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241028048.png)

## LST (NeurIPS 2019)
为外部数据集添加伪标签参与训练。

![Pasted image 20230418112211](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241028406.png)

## TPN (ICLR 2019)
通过图网络学习支持特征和查询特征之间的关系代替简单相似性度量。

![Pasted image 20230418144045](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241028853.png)

## Dense Classification (CVPR 2019)
使用独立的网络对每个局部位置的特征进行分类后加权融合到一起。

![Pasted image 20230418151827](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241028217.png)

## Saliency-guided Hallucination (CVPR 2019)
通过额外的显著性特征辅助分类。

![Pasted image 20230418152812](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241028776.png)

## CADA-VAE (CVPR 2019)
利用多模态（图像和文本）信息预训练一个编码器用于分类。

![Pasted image 20230418204832](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241029826.png)
## TapNet (ICML 2019)
通过无参方法（SVD）构造一个映射矩阵M，使得支持平均向量与可学习原型的误差最小化，将支持向量与原型通过M映射到同一度量空间中。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/20230826163301.png)

## TAFE-Net (CVPR 2019)
通过特定网络学习任务特征，并用其生成图像特征到任务相关特征的映射参数。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/20230826163642.png)

## CAML (ICML 2019)
利用类标签结构（实际上就是每个类的平均向量？）纠正特征，将其投影到同一空间中计算度量。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/20230826164510.png)

## Global Class Representations (ICCV 2019)
基类样本通过均值得到类表征；新类样本通过翻转、裁剪、幻觉、插值等操作进行增强，之后在增强后的特征空间中随机采样一个点并加权得到类表征。另外，全局表征通过各类特征均值初始化，注册模块负责计算各类表征与每个全局表征的相似度，选出最相似的全局表征代替类表征用于分类。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/20230826202434.png)

## Spot and Learn (CVPR 2019)
通过强化学习的RNN提取图像的patch序列，从中提取特征用于分类。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/20230826215546.png)

## IDeMe-Net (CVPR 2019)
将两张图像分别切割为3x3的patch，为每个patch学习权重后进行线性插值得到合成后的图像，和原图一起用于分类器的学习。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/20230826215932.png)

## LaSO (CVPR 2019)
通过特定网络显式学习一对图像的交集、并集和差集特征，具体来说，一对图像提取特征后拼接，通过交集、并集、差集网络学习相应特征，之后交集特征负责预测两张图像共有的标签、并集特征负责预测两张图像所有的标签、差集特征负责预测两张图像各自有的标签。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/20230826220259.png)

## S2M2 (WACV 2020)
引入自监督任务并通过mixup进行增强。

##  FEAT (CVPR 2020)
学习一个set-to-set网络提取任务相关特征。

![Pasted image 20230418101142](https://raw.githubusercontent.com/Koorye/my-images/master/img/202308241029129.png)

## CSPN (ECCV 2020)
计算所有查询特征和支持特征均值的偏差，加在查询特征上以消除跨类偏差；之后利用支持特征的均值得到原型，计算原型与各查询特征的相似度作为权重进行加权得到增强后的原型；最后计算去偏后的查询特征与增强后的原型的相似度。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/20230826185149.png)

## SSL (ECCV 2020)
自监督学习作为辅助任务。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/20230826221222.png)

## NCA (NeurIPS 2021)
学习每对样本之间的关系而不仅是query与support之间的关系。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/20230826184942.png)

## POT (ICLR 2022)
通过可学习的全局原型向量和摘要网络学习原型分布，并通过无监督（最优化传输）学习真实数据分布到原型分布之间的距离。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/20230826153740.png)

## DeepBDC (CVPR 2022)
将BDC距离作为度量，具体来说，特征在通道或宽高维度上池化，之后计算距离矩阵并减去行、列、总体均值得到BDC矩阵，之后计算矩阵的相似度。

![image.png](https://raw.githubusercontent.com/Koorye/my-images/master/img/20230826175844.png)

# 总结
基于上述方法，本文总结了一些few-shot中提取meta知识的方式，大致可以分为。

## 基于额外信息
最直接的一种做法是引入额外信息，这种信息可以是外部数据、增强数据，甚至是额外任务。
- **基于外部数据** 一些方法通过直接引入外部数据来辅助学习知识，如构造一个memory供查询，或利用跨模态数据纠正表征空间。基于外部数据本身蕴含的特征和结构信息，可以帮助模型学习知识。
- **基于数据增强** 一些方法通过数据增强来扩充样本，在few-shot设置中，简单的数据增强往往不能起作用。一些方法采用生成器、幻觉器、线性插值等增强方式，通过数据增强构造更合理的特征空间，帮助模型学习知识。
- **基于辅助任务** 一些方法引入辅助任务（如自监督任务），辅助任务迫使模型学习不同任务所需的特征，从而使模型更为稳健。
- **基于局部信息** 一些方法通过衡量局部特征来代替衡量全局特征，这样做的好处是可以学习特征的空间信息，从而更好学习样本之间的关系知识。

## 基于特定结构
一些方法通过构造特定结构的网络来学习meta知识，其网络结构中就蕴含了一定的正则化和归纳偏置信息。
- **基于权重学习** 一些方法通过特定网络直接预测骨干网络或分类器部分结构的权重来代替基于梯度下降的学习方式。之所以这种方法能够学习meta知识，个人猜测：学习参数比学习特征的方式更为meta，meta-learner参数有限迫使其学习任务相关的概括知识。
- **基于任务特征学习** 一些方法通过特定网络学习任务相关特征，这些方法学习跨类别共享特征，或是直接在任务层面施加约束（例如直接学习整个任务上的样本分布），任务相关信息相对于各类信息就是一种meta知识。
- **基于关系学习** 一些方法通过特定网络（如图网络、transformer等）学习跨类或类内的关系，这种学习过程中隐含了一些跨样本共享知识的学习，而学习任务特征的方法相比，该方法是一种隐式方法。
- **基于原型或记忆学习** 一些方法通过额外的结构来归纳信息，例如自学习的原型或记忆模块，在训练过程中，这种模块往往会吸收一些跨类别或样本的共有知识。该方法仍然是隐式的，这种结构迫使其学习到跨类别或样本的概括性知识。

## 基于元学习
一些方法通过元学习的方法来学习meta知识，元学习以任务为单位进行学习，将数据集分割为若干任务后，模型在任务的训练集上进行内循环，之后在测试集上进行外循环从而更新参数。这种学习方式天生使模型学习任务知识。
