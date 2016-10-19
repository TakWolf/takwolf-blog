---
title: 在 Ubuntu 上安装配置 nginx 笔记
date: 2016-10-19 19:59:46
categories:
- 技术
- nginx
tags:
- nginx
---
学习笔记。

<!-- more -->

## 安装 ##

```
$ apt-get install nginx
```

安装完成后查看版本

```
$ nginx -v
nginx version: nginx/1.4.6 (Ubuntu)
```

正常情况，nginx 安装成功之后就应该会启动了。
访问80端口应该会出现 nginx 的欢迎页：

![Welcome to nginx!](/img/welcome-to-nginx.jpg)

如果没有启动，直接输入 nginx 就可以启动：

```
$ nginx   // 直接启动
```

停止 nginx 的命令是：

```
$ nginx -s quit
```

也可以通过 init.d 中的命令来启动和停止：

```
$ /etc/init.d/nginx start     // 启动
$ /etc/init.d/nginx stop      // 停止
```

注意，启动和停止可能要求 root 权限。
