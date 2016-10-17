---
title: 在 Ubuntu 上安装配置 MariaDB 笔记
date: 2016-10-17 22:02:08
categories:
- 技术
- MariaDB
tags:
- MariaDB
- Linux
---
数据库我平时愿意用 MariaDB，它是 MySql 的一个分支，与 MySql 完全兼容。
这是一篇在 Ubuntu 上折腾 MariaDB 安装和配置的笔记。

<!-- more -->

Ubuntu 版本是 14.04 64位

## 安装 MariaDB ##

执行命令：

```
$ apt-get install mariadb-server
```

网上说，MariaDB 不在厂库里，需要添加厂库源。但是我没遇到这个问题。
安装的最后一步提示你设置数据库 root 用户的密码，设置成功后完成安装。
安装后查看版本：

```
$ mysql --version
mysql  Ver 15.1 Distrib 5.5.52-MariaDB, for debian-linux-gnu (x86_64) using readline 5.2
```

注意，MariaDB 与 MySql 是完全兼容的，包括命令工具、配置文件，甚至是链接URL。
可以连接到 MySql 的客户端基本都可以连接 MariaDB。

## 安全配置向导 ##

执行命令：

```
$ mysql_secure_installation
```

这个是 MySql 的安全配置向导，根据提示可以做一些配置。
前两个步骤是让你输入密码并询问你是否更改密码。
之后的步骤如下：

```
By default, a MariaDB installation has an anonymous user, allowing anyone
to log into MariaDB without having to have a user account created for
them.  This is intended only for testing, and to make the installation
go a bit smoother.  You should remove them before moving into a
production environment.

Remove anonymous users? [Y/n] // 删除匿名用户？生产环境建议删除
 ... Success!

Normally, root should only be allowed to connect from 'localhost'.  This
ensures that someone cannot guess at the root password from the network.

Disallow root login remotely? [Y/n] // 禁止 root 用户远程登录？生产环境建议禁止
 ... Success!

By default, MariaDB comes with a database named 'test' that anyone can
access.  This is also intended only for testing, and should be removed
before moving into a production environment.

Remove test database and access to it? [Y/n] // 删除测试数据库以及对应的权限？生产环境建议删除
 - Dropping test database...
 ... Success!
 - Removing privileges on test database...
 ... Success!

Reloading the privilege tables will ensure that all changes made so far
will take effect immediately.

Reload privilege tables now? [Y/n] // 重新载入权限表？这里选择 Y，上面的配置才能立即生效
 ... Success!

Cleaning up...

All done!  If you've completed all of the above steps, your MariaDB
installation should now be secure.

Thanks for using MariaDB!
```
