---
title: npm 修改镜像地址
date: 2016-11-01 22:12:40
categories:
- 技术
- npm
tags:
- npm
---
笔记。

<!-- more -->

官方 npm 镜像下载较慢，淘宝提供了一个 npm 镜像，国内访问较快。

淘宝 npm 镜像主页：[https://npm.taobao.org](https://npm.taobao.org)

## 临时修改 ##

添加`--registry`参数手动指定，例如：

```
npm install express --registry=https://registry.npm.taobao.org
```

本次下载会使用淘宝镜像。

## 全局修改 ##

通过 npm 命令修改：

```
npm config set registry https://registry.npm.taobao.org
```

这句的实际作用是，在`~/.npmrc`文件中，添加了如下内容：

```
registry=https://registry.npm.taobao.org
```

因此，直接修改`~/.npmrc`文件，作用是相同的。
查看镜像地址的命令是：

```
npm config get registry
```
