---
title: 30行代码就可以实现看图识字！python使用tensorflow.keras搭建简单神经网络
date: 2020-04-22 12:13:02
tags: [深度学习,Tensorflow,Keras]
categories: 深度学习
description: Tensorflow2中内置了Keras库，Keras是一个由Python编写的开源人工神经网络库，可以作为Tensorflow、Microsoft-CNTK和Theano的高阶应用程序接口，进行深度学习模型的设计、调试、评估、应用和可视化。用Tensorflow2中自带的Keras库，会使得搭建神经网络变得非常简单友好。
---

大概几个月前，神经网络、人工智能等概念在我心里仍高不可攀，直到自己亲身上手之后，才发现搭建神经网络并不像自己想象的那么难。很幸运，我开始学习神经网络的时候`Tensorflow2.0`已经发布了。

`Tensorflow2`中内置了`Keras`库，`Keras`是一个由`Python`编写的开源人工神经网络库，可以作为`Tensorflow`、`Microsoft-CNTK`和`Theano`的高阶应用程序接口，进行深度学习模型的设计、调试、评估、应用和可视化。用`Tensorflow2`中自带的`Keras`库，会使得搭建神经网络变得非常简单友好。

学习神经网络需要的前置知识有：
- `numpy`（必需）；
- `pandas`；
- `matplotlib`

# 搭建过程
接下来，介绍用`tensorflow.keras`搭建基本神经网络模型的过程：
## 1. 引入必需的库
```python
import tensorflow as tf
import numpy as np
```
## 2. 引入数据集
这里的`mnist`数据集是`tf.keras`自带的手写数据集，里面存有60000张28x28尺寸的黑白手写数字
```python
#引入minst
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
#将读到的每个灰度值除以255进行归一化，因为keras模型的输入值要求在0~1之间
x_train, x_test= x_train / 255.0, x_test / 255.0
```
## 3. 搭建神经网络层
- `Flatten`层用于将二维数组展开，相当于把图片按照每一行铺平；
- `Dense`层就是所谓的全连接神经网络层，第一个参数是神经元的数量，第二个参数是激活函数的类型；
- `relu`函数是一种线性整流函数，在神经网络中有广泛的使用；
- `softmax`是一种逻辑回归函数，常用于多分类问题，可以使输出值符合概率分布，神经元数量为10，代表会输出10个元素的列表，列表的每个元素相加为1，列表中的每个元素正好符合对应数字的概率（数字有0~9十种）
```python
model = tf.keras.Sequential([
        #指定输入层为Flatten层
        tf.keras.layers.Flatten(),
        #指定第二层为Dense层，使用relu作为激活函数
        tf.keras.layers.Dense(128, activation='relu'),
        #指定输出层为Dense层，使用softmax作为激活函数，使输出概率分布
        tf.keras.layers.Dense(10, activation='softmax')])
```

这就是`softmax`函数，可以看到对于任意x，其对应的y值都在-1~1之间，从而实现数据的归一化。
![softmax函数](https://i-blog.csdnimg.cn/blog_migrate/67ec2ad57ea2b1835afd28e6d113652e.png)
## 4. 编译神经网络模型
- 第一个参数指定优化器为`adam`，`adam`结合了自适应梯度算法和均方根传播，是一个非常强大的优化器
- 指定损失函数的计算方法为交叉熵，`from_logits=False`表示数据不是原始输出，即数据满足概率分布，因为我们采用`softmax`作为输出层，因此结果是概率分布的 
-  指定准确率计算方法为多分类准确率
```python
              #指定优化器为adam
model.compile(optimizer='adam',
              #指定损失函数的计算方法为交叉熵            
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=False),
              #指定准确率计算方法为多分类准确率
              metrics=['sparse_categorical_accuracy'])
```
## 5. 训练模型
- 第一个参数表示输入的训练集，第二个参数表示训练集本身对应的结果，神经网络可以通过判断自己得出的结果与原来给定的结果是否相同，来不断优化自己的判断；
- `batch_size`表示每次喂入的数据量，`mnist`数据集中有60000张图片，显然不能一次喂入；
- `epochs`表示训练次数；
- `validation_data`表示验证用的数据集，验证集并不参与训练，因此用验证集判断模型的准确率是客观有效的；
- `validation_freq`表示验证频率，即多少次训练会做一次验证
```python
model.fit(x_train, y_train, batch_size=32, epochs=10,
          validation_data=(x_test, y_test), validation_freq=1)
```

到这里，一个完整的简单神经网络就搭建完成了，我们可以欣赏一下输出结果，这里只截取了第1次和最后2次训练的部分内容，以节省篇幅。

可以看到，每次喂入数据之后，都显示出了训练集的`loss`误差和`accuracy`准确率，而当每次训练完成时会进行一次验证，计算出验证集的误差和准确率。

我们还发现一个现象，第一次训练时，每次喂入数据都使得`loss`误差快速下降，正确率上升，而到最后几次训练时，由于准确率已经很高，想要继续优化模型变得困难，准确率便上下波动，不再持续上升：
```python
Epoch 1/10
   1/1875 [..............................] - ETA: 0s - loss: 2.4223 - sparse_categorical_accuracy: 0.0625
 277/1875 [===>..........................] - ETA: 2s - loss: 0.5614 - sparse_categorical_accuracy: 0.8380
 567/1875 [========>.....................] - ETA: 1s - loss: 0.4153 - sparse_categorical_accuracy: 0.8792
 814/1875 [============>.................] - ETA: 1s - loss: 0.3604 - sparse_categorical_accuracy: 0.8956
1107/1875 [================>.............] - ETA: 1s - loss: 0.3189 - sparse_categorical_accuracy: 0.9070
1367/1875 [====================>.........] - ETA: 0s - loss: 0.2925 - sparse_categorical_accuracy: 0.9150
1592/1875 [========================>.....] - ETA: 0s - loss: 0.2761 - sparse_categorical_accuracy: 0.9197
1875/1875 [==============================] - 3s 2ms/step - loss: 0.2577 - sparse_categorical_accuracy: 0.9250 - val_loss: 0.1379 - val_sparse_categorical_accuracy: 0.9584
Epoch 9/10
   1/1875 [..............................] - ETA: 0s - loss: 0.0043 - sparse_categorical_accuracy: 1.0000
 347/1875 [====>.........................] - ETA: 2s - loss: 0.0174 - sparse_categorical_accuracy: 0.9986
 634/1875 [=========>....................] - ETA: 1s - loss: 0.0173 - sparse_categorical_accuracy: 0.9965
 922/1875 [=============>................] - ETA: 1s - loss: 0.0176 - sparse_categorical_accuracy: 0.9945
 959/1875 [==============>...............] - ETA: 1s - loss: 0.0177 - sparse_categorical_accuracy: 0.9944
1286/1875 [===================>..........] - ETA: 0s - loss: 0.0182 - sparse_categorical_accuracy: 0.9943
1501/1875 [=======================>......] - ETA: 0s - loss: 0.0187 - sparse_categorical_accuracy: 0.9943
1875/1875 [==============================] - 3s 2ms/step - loss: 0.0193 - sparse_categorical_accuracy: 0.9942 - val_loss: 0.0879 - val_sparse_categorical_accuracy: 0.9763
Epoch 10/10
   1/1875 [..............................] - ETA: 0s - loss: 0.0164 - sparse_categorical_accuracy: 0.9995
 322/1875 [====>.........................] - ETA: 2s - loss: 0.0131 - sparse_categorical_accuracy: 0.9986
 610/1875 [========>.....................] - ETA: 1s - loss: 0.0138 - sparse_categorical_accuracy: 0.9976 
 999/1875 [==============>...............] - ETA: 1s - loss: 0.0146 - sparse_categorical_accuracy: 0.9970 
1248/1875 [==================>...........] - ETA: 0s - loss: 0.0147 - sparse_categorical_accuracy: 0.9965
1285/1875 [===================>..........] - ETA: 0s - loss: 0.0148 - sparse_categorical_accuracy: 0.9959
1536/1875 [=======================>......] - ETA: 0s - loss: 0.0153 - sparse_categorical_accuracy: 0.9954
1875/1875 [==============================] - 3s 2ms/step - loss: 0.0157 - sparse_categorical_accuracy: 0.9952 - val_loss: 0.0804 - val_sparse_categorical_accuracy: 0.9789
```

到这里，我们的模型就输入完成了，只需要提供一个输入图片的函数，便可以完成看图识别数字的任务：
```python
import PIL.Image #使用PIL库处理图片

def judge_image(path):
"""输入图片的路径，判断图片中的数字是什么"""
    #打开图片
    img = Image.open(path) 
    #改变尺寸为28x28，因为训练集的图片大小就是28x28
    img = img.resize((28, 28)) 
    #img.convert用于处理图像，L表示转换成灰度图
    #将灰度图的像素信息排列成array存储
    img_array = np.array(img.convert('L'))
    #遍历每一个像素，进行二值化处理，即把灰度图转换成纯黑白图，以便于模型判断
    for row in range(28):
        for col in range(28):
            #如果像素偏白，就转为纯黑色
            if img_array[row][col] < 75:
                img_array[row][col] = 255
            #如果像素偏黑，就转为纯白色
            else:
                img_array[row][col] = 0
    #将输入值归一化，满足模型输入要求
    img_array = img_array / 255.0 
    #由于数据是以batch的形式喂入模型，我们需要给数据集添加一个维度
    #将img_array:(28,28)变为x_predict:(1,28,28)，1代表数据量为1张图
    x_predict = img_array[tf.newaxis]
    result = model.predict(x_predict) #利用模型进行预测
    #返回索引为1的值，result中索引为1刚好是预测结果
    predict = tf.argmax(result, axis=1)
    tf.print(predict)
```
这样，完整的代码就完成了：
```python
import tensorflow as tf
import numpy as np
import PIL

(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
x_train, x_test= x_train / 255.0, x_test / 255.0

model = tf.keras.Sequential([
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dense(10, activation='softmax')])

model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=False),
              metrics=['sparse_categorical_accuracy'])

model.fit(x_train, y_train, batch_size=32, epochs=10,
          validation_data=(x_test, y_test), validation_freq=1)

def judge_image(path):
    img = PIL.Image.open(path)
    img = img.resize((28, 28))
    img_array = np.array(img.convert('L'))
    for row in range(28):
        for col in range(28):
            if img_array[row][col] < 75:
                img_array[row][col] = 255
            else:
                img_array[row][col] = 0
    img_array = img_array / 255
    x_predict = img_array[tf.newaxis]
    result = model.predict(x_predict)
    predict = tf.argmax(result, axis=1)
    tf.print(predict)
    
```

# 效果测试
我们来试一下预测效果，我准备了几张手写数字的图片：
![数字2](https://i-blog.csdnimg.cn/blog_migrate/a574dfa7d4e37a771cd29538927bb825.gif)img_2.gif
![数字5](https://i-blog.csdnimg.cn/blog_migrate/18d09e63578743a5887e5bd3b32c6928.gif)img_5.gif
![数字8](https://i-blog.csdnimg.cn/blog_migrate/f895f031ce024e204f7fba4180f3ecb0.gif)img_8.gif
```python
for i in 2,5,8:
    print("The recognized figure of img_%d.gif: " % i, end='')
    judge_image('images/img_%d.gif' % i)
    time.sleep(1)
```
输出结果为：
```python
The recognized figure of img_2.gif: [2]
The recognized figure of img_5.gif: [5]
The recognized figure of img_8.gif: [8]
```
可以看到，每张图片所对应的数字都被识别出来啦！