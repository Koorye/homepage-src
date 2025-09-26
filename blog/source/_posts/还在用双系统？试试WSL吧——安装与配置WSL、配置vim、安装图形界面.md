---
title: 还在用双系统？试试WSL吧——安装与配置WSL、配置vim、安装图形界面
date: 2020-06-10 11:21:35
tags: [运维,WSL,Vim]
categories: 运维
description: 本文主要介绍Windows Subsystem for Linux（WSL）的安装与配置，以及vim的配置和图形界面的安装。
---

Windows Subsystem for Linux（简称WSL）是一个在Windows 10上能够运行原生Linux二进制可执行文件（ELF格式）的兼容层。它是由微软与Canonical公司合作开发，其目标是使纯正的Ubuntu 14.04 "Trusty Tahr"映像能下载和解压到用户的本地计算机，并且映像内的工具和实用工具能在此子系统上原生运行。

# 安装与配置WSL
## 安装WSL

安装非常简单，在微软商店里搜索ubuntu下载即可。
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/833855aaa1dd66fc12452799bc559b23.png)
安装完之后，在命令行输入`wsl`就可以启动。

第一次启动时会要求输入用户名和密码，用户名首字母不能大写，输入完就可以正常使用了。

## 换源
由于官方服务器在国外，我们需要更换国内源以加快下载速度。

1. 备份官方源
```shell
cd /etc/apt
sudo sources.list sources-backup.list
```

2. 更换国内源
这里推荐用清华同方、网易和阿里的源。
```shell
sudo vim sources.list
```
输入：
```shell
deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
```

之后输入：
```shell
sudo apt update
sudo apt upgrade
```
更新完成。

---

# 配置vim
vim的配置文件有两个：
`/etc/vim/vimrc`: 全局配置
`/usr/share/vim/vimrc`: 用户配置

此处我选择修改全局配置。

## 基础配置

输入：
```shell
cd /etc/vim
sudo vim vimrc
```

加入一下内容：
```shell
" 去掉边框
set go=
" 设置背景色，每种配色有两种方案，一个light、一个dark
set background=dark
" 打开语法高亮
syntax on
" 显示行号 
set number
" 设置缩进有三个取值cindent(c风格)、smartindent(智能模式)、autoindent(简单的与上一行保持一致)
set cindent
" 在windows版本中vim的退格键模式默认与vi兼容，与我们的使用习惯不太符合，下边这条可以改过来
set backspace=indent,eol,start
" 用空格键替换制表符
:set expandtab
" 制表符占2个空格
set tabstop=2
" 默认缩进2个空格大小
set shiftwidth=2
" 增量式搜索
set incsearch
" 高亮搜索
set hlsearch
```
笔者个人不太喜欢配置许多复杂的内容，这些都是比较基础的配置。

个人习惯缩进2个空格，因为这是google的风格规范，如果你不喜欢这样，可以调成4个空格。

## 与windows系统剪贴板通信
vim非常让人头疼的一点，就是vim的复制粘贴是在自己的寄存器，而不在系统剪贴板，这使得复制代码和其他内容十分麻烦。

接下来我们将配置vim与windows系统剪贴板的交互，**此配置只适用于WSL！**

1. 查看vim是否支持剪贴板
输入：
```shell
vim --version | grep clipboard
```
```shell
koorye@LAPTOP-UHN3B0S8:/etc/vim$ vim --version | grep clipboard
+clipboard         +keymap            +printer           +vertsplit
+emacs_tags        +mouse_gpm         -sun_workshop      +xterm_clipboard
```
返回`+clipboard`，说明支持；如果不支持，我们需要安装其他内容。

不支持，解决方案：
```shell
sudo apt install vim-gtk
```

安装完vim-gtk之后，再次检查即会支持。

WSL下使用系统剪贴板的原理，在于配置映射调用Windows系统的clip.exe和paste.exe可执行文件。

Windows系统中自带clip.exe，但没有paste.exe，需要我们另外下载：[paste.exe下载](https://www.c3scripts.com/tutorials/msdos/paste.zip)

下载之后放到`C:/Windows/System32`目录下。

之后在vimrc配置文件中配置映射：
```shell
 83 " 设置剪贴命令
 84 map ;y :!/mnt/c/Windows/System32/clip.exe <cr>u
 85 map ;p :read !/mnt/c/Windows/System32/paste.exe <cr>i<bs><esc>l
 86 map! ;p <esc>:read !/mnt/c/Windows/System32/paste.exe <cr>i<bs><esc>l
```

这样，就可以使用`;y`和`;p`来进行复制粘贴了。

## 配置配色主题
原生的vim配色不太好看，说到配色主题，笔者喜欢用molokai。

先把主题clone下来：
```shell
git clone git@github.com:tomasr/molokai.git
```

之后把配色文件复制到`/etc/vim/colors`中，如果没有colors目录就新建一个：
```shell
cp molokai/colors/molokai.vim /etc/vim/colors/molokai.vim
```

最后在vimrc配置文件中加入：
```shell
colorscheme molokai
```

配色配置到这里就结束了，但由于笔者个人喜欢用自己花哨的背景，需要修改配色文件。

将背景从黑色改为透明，并修改一些深色配色（如注释从灰黑色改为绿色，以便看清）。

打开配色文件：
```shell
sudo vim /etc/vim/colors/molokai.vim
```

在结尾加入：
```shell
hi Delimiter ctermfg=red
hi Comment ctermfg=green
hi LineNr ctermfg=180 ctermbg=none
hi Normal ctermfg=252 ctermbg=none
```
分别是括号等（定界符）、注释、侧边栏（行号显示）、背景的设置。

配置完之后的效果：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/85194be9a0339c49237010cb9647b5dc.png)
你说你的cmd怎么不一样？那就去微软商店下载一个windows terminal吧。

----

# 安装图形界面
传统的命令行界面我们已经配置的差不多了，但笔者个人就喜欢花里胡哨的，非要整个图形界面才满意。

安装xfce4和显卡驱动，输入：
```shell
sudo apt install xfce4-session xfce4 xorg
```

这个地方如果报错，可能是因为当前的镜像没有软件源，此时请更换回官方源下载。

之后配置`~/.bashrc`文件：
```shell
sudo vim ~/.bashrc
```
在开头添加：
```shell
export DISPLAY=localhost:0
```

然后搜索下载XLaunch，启动XLaunch.exe：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/30a1ede4c12f8a1aa2b2b2e0d49468a1.png)
根据自己的喜好选择窗口类型，然后一路点击默认配置，直到启动窗口：
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/13d3bebe070b437bee742488e73b60b2.png)
此时窗口是一片雪花。

在命令行中输入：
```shell
sudo startxfce4
```
桌面就成功启动了！
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/20bfebce20118a2e607ed818276d1979.png)