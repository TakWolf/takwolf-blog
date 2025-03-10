---
title: 在 Debian 和 CentOS 上配置 RSA 登录 SSH 不起作用？？？
description: 如题
date: 2016-12-20T00:00:00+08:00
categories:
- 技术
- Linux
tags:
- Linux
- Debian
- CentOS
- SSH
---

最近遇到一个十分奇葩的问题。公司的生产环境用的是 Debian，在配置 RSA 登录 SSH 的时候发现怎么配置都不起作用。

我记得貌似以前折腾 CentOS 的时候也遇到这个问题，当时就没弄明白。

我平时自己的环境用的都是 Ubuntu，一方面它比较简单，我也比较熟悉；另外我虚拟机里面用的也是 Ubuntu，相同的配置环境可以直接拷贝。

遇到这个问题我也是懵逼了。我一直以为我是配置的问题，反复的检查各种配置文件，但是怎么都不成功。

最后搜索各种资料，终于明白了，解决方案是：

> .ssh 目录的权限必须是 700

> .ssh/authorized_keys 文件权限必须是600

坑爹啊！！！
