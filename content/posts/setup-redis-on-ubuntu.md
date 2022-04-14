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
学习笔记。

<!-- more -->

## 安装 ##

```
$ apt-get install redis-server
```

## 查看版本号 ##

```
$ redis-cli -v
redis-cli 2.8.4
$ redis-server -v
Redis server v=2.8.4 sha=00000000:0 malloc=jemalloc-3.4.1 bits=64 build=a44a05d76f06a5d9
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
