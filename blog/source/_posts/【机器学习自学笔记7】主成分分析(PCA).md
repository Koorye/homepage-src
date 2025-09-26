---
title: 【机器学习自学笔记7】主成分分析(PCA)
date: 2020-11-16 17:07:09
tags: [机器学习, 降维]
categories: 机器学习
description: PCA（Principal Component Analysis） 是一种常见的数据分析方式，常用于高维数据的降维，可用于提取数据的主要特征分量。
---

PCA（Principal Component Analysis） 是一种常见的数据分析方式，常用于高维数据的降维，可用于提取数据的主要特征分量。

<!-- more -->

# 维数灾难

> 维数灾难(Curse of Dimensionality)：通常是指在涉及到向量的计算的问题中，随着维数的增加，计算量呈指数倍增长的一种现象。

在机器学习中，随着数据集维数的增加，数据的计算量将呈几何倍数增加，同时样本间的距离会远远增大，这将导致样本数据失去其意义。

为了减少计算量、增加准确度，我们有必要按照一定的规则去除一些维度 (特征)，这便是降维算法。PCA 算法就是机器学习中的典型降维算法。



# PCA

## 基变换

### 二维坐标系

考虑二维坐标 (3, 2)，它有什么数学意义？

如果仔细思考，二维坐标的两个值实际上是在 x 轴和 y 轴上的投影。

这里的 x 轴单位方向 (1,0) 和 y 轴单位方向 (0,1) 就是所谓的一组基。



### 基变换矩阵

如果把上面的例子通过矩阵表示：
$$
\begin{pmatrix}
1 & 0 \\
0 & 1 \\
\end{pmatrix}
\begin{pmatrix}
3 \\
2 \\
\end{pmatrix}=
\begin{pmatrix}
3 \\
2 \\
\end{pmatrix}
$$
那如果基不是坐标轴呢？

比如一组基为：
$$
(\frac{1}{\sqrt2},\frac{1}{\sqrt2}),(-\frac{1}{\sqrt2},\frac{1}{\sqrt2})
$$
此时通过矩阵运算：
$$
\begin{pmatrix}
\frac{1}{\sqrt2}&\frac{1}{\sqrt2} \\
-\frac{1}{\sqrt2}&\frac{1}{\sqrt2} \\
\end{pmatrix}
\begin{pmatrix}
3 \\
2 \\
\end{pmatrix}=
\begin{pmatrix}
\frac{5}{\sqrt2} \\
-\frac{1}{\sqrt2} \\
\end{pmatrix}
$$
便可以得到该组基下的坐标：
$$
(\frac{5}{\sqrt2},-\frac{1}{\sqrt2})
$$
把上面的矩阵写成一般形式：
$$
\begin{pmatrix}
p_{11}&p_{12}&\dots&p_{1n}\\
p_{21}&p_{22}&\dots&p_{2n}\\
\vdots&\vdots&\ddots&\vdots\\
p_{r1}&p_{r2}&\dots&p_{rn}\\
\end{pmatrix}
\begin{pmatrix}
a_{11}&a_{12}&\dots&a_{1m}\\
a_{21}&a_{22}&\dots&a_{2m}\\
\vdots&\vdots&\ddots&\vdots\\
a_{n1}&a_{n2}&\dots&a_{nm}\\
\end{pmatrix}
$$

$$
=\begin{pmatrix}
P_1\\
P_2\\
\vdots\\
P_R\\
\end{pmatrix}
\begin{pmatrix}
A_1&A_2&\dots&A_M
\end{pmatrix}=
\begin{pmatrix}
P_1A_1&P_1A_2&\dots&P_1A_M\\
P_2A_1&P_2A_2&\dots&P_2A_M\\
\vdots&\vdots&\ddots&\vdots\\
P_RA_1&P_RA_2&\dots&P_RA_M\\
\end{pmatrix}
$$

- $P_i$ 是一组行向量，表示一个基
- $A_i$ 是一组列向量，表示一个坐标 (样本)



## 最大可分性

最大可分性是 PCA 算法的原则，即：

- 样本尽可能分散
- 样本之间尽可能不相关

为此，可以考虑两个数学概念：

- 方差，衡量数据的偏离程度。为使样本分散，方差应尽可能大。

$$
Var(a)=\frac1m\sum_{i=1}^m(a_i-\mu)^2
$$

- 协方差，衡量两组数据的相关性。为使样本之间不相关，协方差应尽可能小。

$$
Cov(a,b)=\frac{1}{m}\sum_{i=1}^m(a_i-\mu_a)(b_i-\mu_b)
$$



### 去中心化

为了简化计算，可以事先将均值作为坐标轴的中心。这样一来，均值都为 0，公式可简化为：
$$
Var(a)=\frac1m\sum_{i=1}^ma_i^2
$$

$$
Cov(a,b)=\frac{1}{m}\sum_{i=1}^ma_ib_i
$$



### 协方差矩阵

如果有 a 和 b 两组数据，排列成矩阵：
$$
X=\begin{pmatrix}
a_1&a_2&\dots&a_m\\
b_1&b_2&\dots&b_m\\
\end{pmatrix}
$$
则有
$$
\frac1mXX^T=\begin{pmatrix}
\frac1m\sum_{i=1}^ma_i^2&\sum_{i=1}^ma_ib_i\\
\frac1m\sum_{i=1}^mb_ia_i&\sum_{i=1}^mb_i^2\\
\end{pmatrix}
$$

$$
=\begin{pmatrix}
Var(a)&Cov(a,b)\\
Cov(b,a)&Var(b)\\
\end{pmatrix}
$$



这样两个变量的方差和协方差就被统一在矩阵里。

如果有 n 组数据，同样可以得到一个 n 维的协方差矩阵，这个矩阵可以反映任意一组数据的分散程度和任意两组数据的相关性。

### 矩阵对角化

考虑最大可分性，我们的目标是找到一组基，使得原矩阵经过基变换后的协方差 (非对角线元素) = 0，而方差 (对角线上的元素) 从大到小排列 (左上最大)，因为基变换时如果要降维，越下方的基越不会被考虑到，其权重应尽量小。

设原始数据矩阵 X 对应协方差矩阵为 $C=\frac1mXX^T$.

设 Y = PX，其中 P 是一组基组成的矩阵，则 Y 是 X 在 P 上做基变换得到的矩阵。

设 Y 的协方差矩阵为 $D=\frac1mYY^T$.

要如何得到 P 呢？

可以推导：
$$
D=\frac1mYY^T=\frac1m(PX)(PX)^T=\frac1mPXX^TP^T
$$

$$
=P\frac1mXX^TP^T=PCP^T
$$

原问题就相当于寻找一个矩阵 P，满足 $PCP^T$ 是一个对角矩阵，并且对角元素从大到小排列。

注意到协方差矩阵是实对称对称，而实对称矩阵具有优秀的性质：

- 实对称矩阵不同特征值对应的特征向量必然正交
- 实对称矩阵一定可以相似对角化
- 若实对称矩阵具有 k 重特征值$λ_0$，必有 k 个线性无关的特征向量

因此，一个 $n\times n$ 的实对称矩阵一定有 n 个单位正交的特征向量 $e_1,e_2,\dots,e_n$.

若组成矩阵
$$
E=\begin{pmatrix}
e_1&e_2&\dots&e_n
\end{pmatrix}
$$
则有
$$
E^TCE=\Lambda=\begin{pmatrix}
\lambda_1&&&\\
&\lambda_2&&\\
&&\ddots&\\
&&&\lambda_n\\
\end{pmatrix}
$$
则我们要求的 P，就是 $E^T$

根据特征值从大到小，将特征向量从上到下排列。则 $P=E^T$ 的前 k 行与原始数据矩阵 X 进行基变换，就得到了降维后的矩阵 Y.

## PCA 的步骤

- 将原始数据按列组成 $n\times m $ 的矩阵 X
- 对 X 去中心化，即去除均值
- 求出协方差矩阵 $C=\frac1mXX^T$
- 求出协方差矩阵的特征值和对应的特征向量 $e_1,e_2,\dots,e_n$
- 将特征向量按对应特征值大小从上到下按行排成矩阵 E
- 取 E 的前 k 行作为矩阵 P
- 进行基变换 $Y=PX$ 实现降维

## 举例

| $X_1$ | $X_2$ | $X_3$ |
| ----- | ----- | ----- |
| 2     | 0     | -1.4  |
| 2.2   | 0.2   | -1.5  |
| 2.4   | 0.1   | -1    |
| 1.9   | 0     | -1.2  |

首先求出三个维度 (特征) 的均值：
$$
Var(X_1)=2.125
$$

$$
Var(X_2)=0.075
$$

$$
Var(X_3)=-1.275
$$

去中心化处理：

| $X_1$  | $X_2$  | $X_3$  |
| ------ | ------ | ------ |
| -0.125 | -0.075 | -0.125 |
| 0.075  | 0.125  | -0.225 |
| 0.275  | 0.025  | 0.275  |
| -0.225 | -0.075 | 0.075  |

此时各维度的均值被化为 0.

得到矩阵：
$$
X=\begin{pmatrix}
-0.125&-0.075&-0.125\\
0.075&0.125&-0.225\\
0.275&0.025&0.275\\
-0.225&-0.075&0.075\\
\end{pmatrix}
$$


计算协方差矩阵：
$$
C=\frac13X^TX
$$

```
C =

 	0.0492    0.0142    0.0192
    0.0142    0.0092   -0.0058
    0.0192   -0.0058    0.0492
```

求出协方差矩阵的特征值和对应的特征向量：

```
V =

   -0.7300   -0.5747    0.3700
   -0.1071   -0.4385   -0.8924
   -0.6750    0.6910   -0.2585


D =

    0.0690         0         0
         0    0.0369         0
         0         0    0.0016
```

特征值从大到小：
$$
\lambda_1=0.0690,\lambda_2=0.0369,\lambda_3=0.0016
$$
分别对应特征向量：
$$
e_1=\begin{pmatrix}
-0.7300\\
-0.1071\\
-0.6750\\
\end{pmatrix},
e_2=\begin{pmatrix}
-0.5747\\
-0.4385\\
 0.6910\\
\end{pmatrix},
e_3=\begin{pmatrix}
 0.3700\\
-0.8924\\
-0.2585\\
\end{pmatrix}
$$
取前 k 个特征向量，假设 $k = 2$，则有基变换矩阵 P：
$$
P=\begin{pmatrix}
e_1^T\\
e_2^T\\
\end{pmatrix}
=\begin{pmatrix}
-0.7300&-0.1071&-0.6750\\
-0.5747&-0.4385&0.6910\\
\end{pmatrix}
$$
进行基变换 $Y^T=PX^T$：
$$
Y=\begin{pmatrix}
0.1837&0.0184\\
-0.2200&0.0576\\
-0.3891&0.0210\\
0.1217&0.2140\\
\end{pmatrix}
$$
降维前后效果 (降维前为蓝色，降维后为红色)：

取前 k 个特征向量，假设 $k = 2$，则有基变换矩阵 P：
$$
P=\begin{pmatrix}
e_1^T\\
e_2^T\\
\end{pmatrix}
=\begin{pmatrix}
-0.7300&-0.1071&-0.6750\\
-0.5747&-0.4385&0.6910\\
\end{pmatrix}
$$
进行基变换 $Y^T=PX^T$：
$$
Y=\begin{pmatrix}
0.1837&0.0184\\
-0.2200&0.0576\\
-0.3891&0.0210\\
0.1217&0.2140\\
\end{pmatrix}
$$
降维前后效果 (降维前为蓝色，降维后为红色)：

![image-20201107191511468](https://i-blog.csdnimg.cn/blog_migrate/83615e7fad17f879f93daa944212a76d.png)