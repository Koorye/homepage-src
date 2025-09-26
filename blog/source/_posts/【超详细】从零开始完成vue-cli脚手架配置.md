---
title: 【超详细】从零开始完成vue-cli脚手架配置
date: 2020-05-27 00:44:36
tags: [前端,Vue]
categories: 前端
description: 在前后端分离成为主流的今天，Vue框架是前端的主流框架之一。Vue是一套用于构建用户界面的渐进式框架，Vue的核心库只关注视图层，易于上手，且便于与第三方库或既有项目整合。
---

在前后端分离成为主流的今天，vue框架是前端的主流框架之一，学会使用vue脚手架的配置是前端不可或缺的技术。

# 安装nodejs
直接前往官网下载安装即可：

[nodejs下载](http://nodejs.cn/download/)
## 配置环境变量
如果你是windows系统，需要配置环境变量。

打开：

计算机（右键）$\rightarrow$ 属性 $\rightarrow$ 高级系统设置 $\rightarrow$ 高级 $\rightarrow$ 环境变量

在用户变量（或系统变量，系统变量影响所有用户，容易产生全局污染，因此笔者一般编辑用户变量）中添加`NODE_PATH`，指定nodejs的安装路径:

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/d75306576f44ef0f6e264c93b7a432c6.png)
接着编辑Path变量，添加：

`%NODE_PATH%\node_modules`，指定npm包管理器位置
`%NODE_PATH%\npm_global`，指定npm下载的包位置，这个路径要在后续npm中再行配置
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/3a33ea856755819a4aafbc8d79772dc9.png)
## 测试
输入`node -v`和`npm -v`，返回版本号，则配置成功：

```shell
PS C:\Users\a1311> node -v
v12.16.3
PS C:\Users\a1311> npm -v
6.14.4
```

----

# 配置npm
## 配置仓库路径
输入：
```shell
npm config set prefix "包安装路径"
npm config set cache "包下载缓存路径"
```

这里的路径根据自己的意愿指定即可，命令没有任何回应，则代表配置成功。

## 配置cnpm
之所以配置cnpm，是因为npm的服务器在国外，速度过慢，所以我们平时下载包时一般都通过cnpm淘宝镜像进行。

输入：
```shell
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

等待下载安装即可，cnpm将被安装到之前`set prefix`配置的包安装路径下。
## 测试
输入`npm config list`.

```shell
PS C:\Users\a1311> npm config list
; cli configs
metrics-registry = "https://registry.npm.taobao.org/"
scope = ""
user-agent = "npm/6.14.4 node/v12.16.3 win32 x64"

; userconfig C:\Users\a1311\.npmrc
cache = "D:\\software\\system\\nodejs\\npm_cache"
prefix = "D:\\software\\system\\nodejs\\npm_global"
registry = "https://registry.npm.taobao.org/"

; builtin config undefined

; node bin location = D:\software\system\nodejs\node.exe
; cwd = C:\Users\a1311
; HOME = C:\Users\a1311
; "npm config ls -l" to show all defaults.
```

注意到cache、prefix和metrics-registry已经更改。

输入`cnpm -v`.
```shell
PS C:\Users\a1311> cnpm -v
cnpm@6.1.1 (D:\software\system\nodejs\npm_global\node_modules\cnpm\lib\parse_argv.js)
npm@6.14.5 (D:\software\system\nodejs\npm_global\node_modules\cnpm\node_modules\npm\lib\npm.js)
node@12.16.3 (D:\software\system\nodejs\node.exe)
npminstall@3.27.0 (D:\software\system\nodejs\npm_global\node_modules\cnpm\node_modules\npminstall\lib\index.js)
prefix=D:\software\system\nodejs\npm_global
win32 x64 10.0.18363
registry=https://r.npm.taobao.org
```

显示出关于cnpm的版本和其他详细信息，则配置成功。注意此处的prefix就是之前`set prefix`指定的路径。

----

# 安装与使用vue-cli
## 安装vue-cli

输入`cnpm install @vue/cli`，会自动下载安装最新版vue-cli脚手架工具，输入`vue -V`显示最新版本号，说明安装成功。

```shell
PS C:\Users\a1311> cnpm install -g @vue/cli
Downloading @vue/cli to D:\software\system\nodejs\npm_global\node_modules\@vue\cli_tmp
Copying D:\software\system\nodejs\npm_global\node_modules\@vue\cli_tmp\_@vue_cli@4.3.1@@vue\cli to D:\software\system\nodejs\npm_global\node_modules\@vue\cli
Installing @vue/cli's dependencies to D:\software\system\nodejs\npm_global\node_modules\@vue\cli/node_modules

...
All packages installed (1042 packages installed from npm registry, used 28s(network 26s), speed 1.41MB/s, json 907(2.35MB), tarball 34.48MB)
[@vue/cli@4.3.1] link D:\software\system\nodejs\npm_global\vue@ -> D:\software\system\nodejs\npm_global\node_modules\@vue\cli\bin\vue.js

PS C:\Users\a1311> vue -V
@vue/cli 4.3.1
```

此处笔者安装的是最新的4.3.1版本。

如果想安装旧版，可以使用`cnpm install -g vue-cli`安装2.9.6版本。

## 卸载旧版vue-cli的坑
输入`npm remove vue-cli`移除旧版vue-cli，如果执行后输入`vue -V`后仍会显示版本号，则说明vue-cli未被移除。

此错误一般是**环境变量配置错误**导致，请仔细检查npm和cnpm的路径是否已在环境变量中配置。

## 使用脚手架搭建项目
先安装@vue/cli-init工具，输入`cnpm install -g @vue/cli-init`.

```shell
PS C:\Users\a1311> cnpm install -g @vue/cli-init
Downloading @vue/cli-init to D:\software\system\nodejs\npm_global\node_modules\@vue\cli-init_tmp
...
All packages installed (249 packages installed from npm registry, used 11s(network 10s), speed 494.15kB/s, json 234(482.01kB), tarball 4.59MB)
```

在要创建项目的目录中，输入`vue init webpack 你的项目名`（webpack指定打包方式），之后按照提示操作：

- Project name: 项目名，不输入则指定括号里的默认值，下同
- Project description: 项目描述
- Author: 作者
- Vue build: 脱机/联机构建项目 一般选脱机(standalone)
- Install vue-router? 使用vue-router路由？根据需求选择，一般选择yes
- Use ESLint to lint your code? 使用eslint代码规范检测？笔者使用idea开发，故选择no
- Set up unit tests 启用unit测试？
- Setup e2e tests with Nightwatch? 启用e2e自动化测试？
- Should we run `npm install` for you after the project has been created? (recommended) npm 指定包管理工具，推荐npm
```shell
PS D:\> vue init webpack demo

? Project name demo
? Project description A Vue.js project
? Author Koorye
? Vue build standalone
? Install vue-router? Yes
? Use ESLint to lint your code? No
? Set up unit tests No
? Setup e2e tests with Nightwatch? No
? Should we run `npm install` for you after the project has been created? (recommended) npm

   vue-cli · Generated "demo".


# Installing project dependencies ...
# ========================

...

> core-js@2.6.11 postinstall D:\demo\node_modules\core-js
> node -e "try{require('./postinstall')}catch(e){}"

Thank you for using core-js ( https://github.com/zloirock/core-js ) for polyfilling JavaScript standard library!

The project needs your help! Please consider supporting of core-js on Open Collective or Patreon:
> https://opencollective.com/core-js
> https://www.patreon.com/zloirock

Also, the author of core-js ( https://github.com/zloirock ) is looking for a good job -)


> ejs@2.7.4 postinstall D:\demo\node_modules\ejs
> node ./postinstall.js

Thank you for installing EJS: built with the Jake JavaScript build tool (https://jakejs.com/)


> uglifyjs-webpack-plugin@0.4.6 postinstall D:\demo\node_modules\webpack\node_modules\uglifyjs-webpack-plugin
> node lib/post_install.js

...

added 1279 packages from 672 contributors in 62.825s

29 packages are looking for funding
  run `npm fund` for details


# Project initialization finished!
# ========================

To get started:

  cd demo
  npm run dev

Documentation can be found at https://vuejs-templates.github.io/webpack
```

## 启动项目
输入`npm start`即可。

```shell
PS D:\demo> npm start

> demo@1.0.0 start D:\demo
> npm run dev


> demo@1.0.0 dev D:\demo
> webpack-dev-server --inline --progress --config build/webpack.dev.conf.js

 13% building modules 27/31 modules 4 active ...=template&index=0!D:\demo\src\App.vue{ parser: "babylon" } is deprecated; we now treat it as { parser: "babel" }.
 95% emitting

 DONE  Compiled successfully in 6563ms                                                                           0:42:06

 I  Your application is running here: http://localhost:8080
```

可以看到，项目已经运行于本机8080端口，访问就可以看到项目啦。

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/1c6238821af090bf4794b76e658e6498.png)