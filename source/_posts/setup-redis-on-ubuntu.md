---
title: 在 Ubuntu 上安装 Redis 笔记
date: 2016-10-18 04:48:57
categories:
- 技术
- Redis
tags:
- Redis
- Linux
---
笔记。

<!-- more -->

## 安装 ##

```
$ apt-get install redis-server
```

## 查看版本号 ##

```
$ redis-cli -v
redis-cli 2.8.4

```

## 测试 ##

```
$ redis-cli
127.0.0.1:6379> set a 123
OK
127.0.0.1:6379> get a
"123"
127.0.0.1:6379> exit
```
