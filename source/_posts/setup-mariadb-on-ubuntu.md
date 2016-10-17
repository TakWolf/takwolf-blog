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

如果你是生产环境，建议全部直接按回车。

## 修改默认端口号 ##

查看 MariaDB 端口号，需要先进入 MariaDB 控制台

```
$ mysql -u root -p
```

我这里 root 用户设置了密码，所以需要输入密码。
之后在 MariaDB 控制台键入如下命令：

```
MariaDB [(none)]> show global variables like 'port';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| port          | 3306  |
+---------------+-------+
1 row in set (0.00 sec)
```

注意，这里的命令其实是 Sql 命令，结尾不要忘记添加分号。
退出 MariaDB 控制台的命令是：

```
MariaDB [(none)]> quit
```

或者

```
MariaDB [(none)]> exit
```

MariadB 的配置文件在`/etc/mysql/my.cnf`
这里有两个关于`port`的配置。

`[client]`节点下面的`port`表示你用 MariaDB 工具去访问远程服务器的时候，连接远端的默认接口
举个例子，你可以这样去访问远端的数据库：

```
$ mysql -u root -p -h 192.168.0.5
$ mysql -u root -p -h 192.168.0.5 -P 3306
```

第一种方式，用的就是`[client]`节点下面的`port`配置作为默认连接端口
第二种方式，则是手动指定端口

`[mysqld]`节点下面也有一个`port`配置，这个是本地的数据库的端口号。
我们修改这里的数据。
修改之后需要重启 MariaDB，这里可能需要 root 权限

```
$ sudo /etc/init.d/mysql restart
```

再次查看，端口就应该修改了。

## 创建一个用户 ##

创建用户的命令如下：

```
MariaDB [(none)]> GRANT ALL PRIVILEGES ON *.* TO 'user'@'localhost' IDENTIFIED BY 'password' WITH GRANT OPTION;
```
其中，`user'@'localhost`表示用户名允许在什么地址下访问，这里是本地。
如果你希望用户可以在任何地址下访问，格式为`user'@'%`，使用通配符。
后面的`password`是用户的密码。
前面的`ALL PRIVILEGES ON *.*`表示授权所有权限在所有数据库上。
权限细分如下：

```
全局管理权限：

FILE:     在服务器上读写文件。
PROCESS:  显示或杀死属于其它用户的服务线程。
RELOAD:   重载访问控制表，刷新日志等。
SHUTDOWN: 关闭MySQL服务。

数据库/数据表/数据列权限：

ALTER:    修改已存在的数据表(例如增加/删除列)和索引。
CREATE:   建立新的数据库或数据表。
DELETE:   删除表的记录。
DROP:     删除数据表或数据库。
INDEX:    建立或删除索引。
INSERT:   增加表的记录。
SELECT:   显示/搜索表的记录。
UPDATE:   修改表中已存在的记录。

特别的权限：

ALL:      允许做任何事(和root一样)。
USAGE:    只允许登录，其它什么也不允许做。
```

完成后，需要执行下面的命令刷新权限表，配置才能立即生效：

```
MariaDB [(none)]> FLUSH PRIVILEGES;
```

可以用下面的命令查询所有的用户信息：

```
MariaDB [(none)]> select host, user from mysql.user;
```
