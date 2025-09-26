---
title: 利用GitHub+Hexo搭建博客
date: 2020-07-11 15:08:56
tags: [运维,Hexo]
categories: 运维
description: 利用Hexo搭建博客，部署到GitHub上，使用Next主题，安装插件。
---

前置准备：配置好Node.js和Git，并注册一个GitHub账号。

# 创建本地文件

使用npm包管理器全局安装Hexo：

```shell
npm install hexo -g
```

找到一个合适的目录，创建一个空文件夹，接着在这个文件夹内创建博客文件：

```shell
cd D:\Koorye.github.io
hexo init
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/4ef232b1f1f73a6e63b428b541afeaae.png)

接下来，将markdown文件放在source/_posts目录中，就会显示到博客上。

# 部署到GitHub

## 新建仓库

新建一个公共仓库，名称必须为xxx.github.io，这将是你博客的域名。

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/9aaac492b5a56e7669ae5a41d920b2c8.png)

## 配置本地文件

接下来对本地博客文件的`_config.yml`进行配置，将仓库路径写到repository上：

```yml
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  repository: git@github.com:Koorye/Koorye.github.io.git
  branch: master
```

## 配置Git

### 创建账号

```shell
git config --global user.name "username"  // username替换成你的用户名
git config --global user.email "email"  // email替换成你的邮箱
```

### 创建SSH密钥

检查`C:\Users\你的用户名`文件夹中是否有.ssh文件夹，没有则用如下命令新建一个密钥：

```shell
ssh-keygen -t rsa -C "你的邮箱地址"
```

之后会生成如下文件：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/0febcd54e6393a286bb58d29507ccea8.png)

### 连接到GitHub

点击GitHub右上角的个人头像，找到Settings，然后点击左侧栏的SSH and GPG keys.

点击New SSH key，将生成的id_rsa.pub中内容复制到Key中，Title随意：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/edbbbc0660312ff0fdbe6ac7be134962.png)

创建好的SSH Key：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/8058bf26b3e4e5e288c1782d8d89ccd0.png)

### 测试连接

```shell
ssh git@github.com
```

返回如下提示即配置成功：

```shell
PS C:\Users\a1311> ssh git@github.com
PTY allocation request failed on channel 0
Hi Koorye! You've successfully authenticated, but GitHub does not provide shell access.
Connection to github.com closed.
```

### hexo上传

首先了解一下hexo的命令行：

```shell
hexo init  // 初始化一个博客
hexo clean  // 清理静态文件
hexo new xxx  // 新建一个文章，也可以直接复制markdown文件到source/_post目录中
hexo new page xxx  // 新建一个分类页面
hexo g  // 或hexo generate 编译生成静态文件
hexo s  // 或hexo server 部署到本地服务器，通过localhost://4000访问
hexo d  // 或hexo deploy 部署到远程服务器，这里我们配置到GitHub仓库
```

了解一下命令后，我们通常使用clean(清理缓存)+generate(生成文件)+deploy(部署)上传博客：

```shell
hexo clean
hexo g
hexo d
```

返回如下，博客就部署完成：
```shell
PS D:\Koorye.github.io> hexo d
INFO  Deploying: git
INFO  Clearing .deploy_git folder...
INFO  Copying files from public folder...
INFO  Copying files from extend dirs...

...

warning: LF will be replaced by CRLF in tags/神经网络/index.html.
The file will have its original line endings in your working directory
On branch master
Everything up-to-date
Branch 'master' set up to track remote branch 'master' from 'git@github.com:Koorye/Koorye.github.io.git'.
```

检查一下github仓库，可以看到文件已经上传：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e610eaa46b2ab3fac21324d488f4aac0.png)

此时，我们便可以通过访问[https://Koorye.github.io](https://Koorye.github.io)看到自己的博客啦，部署略有延迟，请等待几分钟再查看。

# 使用Next主题

## 下载主题

原版的主题比较简单，而且缺少很多功能，相比之下，next主题是很好的选择。

使用git clone下载主题：

```shell
git clone https://github.com/iissnan/hexo-theme-next themes/next
```

下载之后，博客文件themes目录中就会有next目录。

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/d23647ededd74898eb38b9402a52576b.png)

修改配置文件`_config.yml`的theme为next：

```yml
# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: next
```

之后，重新编译打开网页，next就改变啦：

```shell
hexo clean
hexo g
hexo s
```

访问[http://localhost:4000](http://localhost:4000)，这里笔者已经修改了很多配置才有这样的效果：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/fc32e53f90460f0bf6b2a48ce8646181.png)

关于next主题的各种配置，本文不再赘述。

# 安装插件

这里举例安装live2d插件，其他插件的安装大同小异：

[插件官网，可浏览模型样式](https://huaji8.top/post/live2d-plugin-2.0/)

[插件GitHub地址](https://github.com/EYHN/hexo-helper-live2d)

这里我们安装这只叫hijiki的黑猫：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/c45affea610374594a74d989b713c2f7.png)

按照官网的步骤，先安装插件：

```shell
npm install --save hexo-helper-live2d
```

然后配置`_config.yml`，加入以下内容，自行设定width和height：

```yml
live2d:
  enable: true
  scriptFrom: local
  model:
    use: live2d-widget-model-hijiki
  display:
    position: right
    width: 200
    height: 400
  mobile:
    show: true
```

再次编译打开网页，hijiki就会在屏幕的右下角啦。

# 关于markdown书写格式

hexo的markdown开头需要写明一些配置，例子如下，这样文章才能正确显示标题、日期等信息：

```markdown
---
title: 对比jQuery与Vue+axios的Ajax
date: 2020-5-7 13:23:01
categories: 前端
tags: 
- 前端
- Web
- JavaScript
- jQuery
- Vue
---
iki就会在屏幕的右下角啦。

# 关于markdown书写格式

hexo的markdown开头需要写明一些配置，例子如下，这样文章才能正确显示标题、日期等信息：

```markdown
---
title: 对比jQuery与Vue+axios的Ajax
date: 2020-5-7 13:23:01
categories: 前端
tags: 
- 前端
- Web
- JavaScript
- jQuery
- Vue
---
```