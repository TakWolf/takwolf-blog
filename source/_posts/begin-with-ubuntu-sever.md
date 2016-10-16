---
title: Ubuntu 初始化配置笔记
date: 2016-10-15 01:37:39
categories:
- 技术
- Linux
tags:
- Linux
---
换了个阿里云香港的服务器试试，DigitalOcean 跟 Linode 国内访问太慢。当然不愿意备案，否则也不会这么折腾。
之前在 Linode 服务器有被入侵过的经历，搞得我的账单都爆了。吃一堑长一智。稍微也研究了一些安全方面的配置，做个笔记。

<!-- more -->

服务器为阿里云香港节点，配置当然是最低的（1CUP、1G内存、1M宽带），单买费用一个月大概120软妹币。
系统安装的是 Ubuntu 14.04 64位。

## 1.升级 ##

Ubuntu 安装成功，第一件事就是升级。

```
$ apt-get update
$ apt-get upgrade
```

某些具有依赖关系的包可能不会升级，可以用下面的命令升级

```
$ apt-get dist-upgrade
```

完成后，用下面的命令清理

```
$ apt-get clean
$ apt-get autoclean
$ apt-get autoremove
```

系统提示我有新的发行版`16.04.1 LTS`可以升级，命令是

```
$ do-release-upgrade
```

但是这个我没升级。

## 2.修改 ssh 默认端口号 ##

目的是防止入侵者直接扫描默认端口。
ssh 的配置文件在 `/etc/ssh/sshd_config`
用 vim 打开，找到如下位置，并添加一个新端口，例如：5000

```
Port 22
Port 5000 # 添加的端口
```

重启 ssh 才能生效，命令是

```
$ /etc/init.d/ssh restart
```

注意，添加新的端口之后，先不要删除22端口。万一抽风了配置没好使，搞得你登录不上去就麻烦了。
修改成功之后，你再次登录就需要手动指定端口了

```
$ ssh -p 5000 root@hostname
```

## 3.禁止 root 用户登录 ssh ##

原理跟改端口一样，防止入侵者用 root 用户进行测试，平时使用我们也需要对操作进行降权。
当然你首先要新创建一个用户，使用命令

```
$ adduser myname
```

根据提示填写信息，一般直接回车默认就行。
切换到这个用户，你会发现无法使用 sudo 命令，提示

```
xxx is not in the sudoers file.  This incident will be reported.
```

这是因为用户没有配置权限，配置文件在`/etc/sudoers`
切换到 root 用户做如下操作。

`sudoers`文件默认是没有写权限的，首先添加写权限

```
$ chmod u+w /etc/sudoers
```

然后 vim 打开这个文件

```
$ vi /etc/sudoers
```

找到这行，并在下面添加

```
root    ALL=(ALL:ALL) ALL
xxx     ALL=(ALL:ALL) ALL      # xxx是你的用户名
```

规则是这样的：

```
xxx    ALL=(ALL:ALL) ALL            # 允许用户xxx执行sudo命令，需要密码
%xxx   ALL=(ALL:ALL) ALL            # 允许用户组xxx里面的用户执行sudo命令，需要密码
xxx    ALL=(ALL:ALL) NOPASSWD:ALL   # 允许用户xxx执行sudo命令，不需要密码
%xxx   ALL=(ALL:ALL) NOPASSWD:ALL   # 允许用户组xxx里面的用户执行sudo命令，不需要密码
```

保存修改并退出，之后取消`sudoers`的写权限

```
$ chmod u-w /etc/sudoers
```

如此一来，用户就可以使用 sudo 命令了。

接下来我们禁止 root 用户登录 ssh，还是打开 ssh 配置文件

```
$ vi /etc/ssh/sshd_config
```

修改配置项

```
PermitRootLogin no
```

不要忘记重启 ssh ，否则不会生效

```
$ /etc/init.d/ssh restart
```

这样 root 用户就无法登录 ssh 了。
平时我们使用普通用户，需要的时候用 sudo 命令，或者用 su 命令切换到 root 用户。

这里有一个需要注意的地方就是，一定要确保你的普通用户给了 root 权限之后，再禁用 ssh 的 root 登录。
因为修改权限的操作是需要 root 权限的，如果没给权限就禁用，那么 root 权限就永远丢失了。除非你肉身去阿里云机房登录。

## 4.配置 ssh 使用密钥登录 ##

密码终归是有被暴力破解的风险的，使用密钥对就可以避免这个问题。
当然另外一个好处就是可以免密码登录，当然前提是你的私钥没有设置密码。

第一步在本地电脑上生成密钥

```
$ ssh-keygen -t rsa -C your@email.com
```

提示输入保存路径和密码。
路径默认通常是`~/.ssh/id_rsa`
密码不输入的话就是没密码，有密码的话使用私钥的时候会用到

成功之后，会在`~/.ssh`目录下面生成两个文件，`id_rsa`为私钥，`id_rsa.pub`为公钥

注意，密钥对要妥善保管！！！

然后我们把公钥上传到服务器，执行命令：

```
scp -P 5000 ~/.ssh/id_rsa.pub myname@hostname:~/
```

这句的意思是，我们把`~/.ssh/id_rsa.pub`文件复制到服务器的`~/`目录下面，其中`-P 5000`用来指定端口号，因为上面我们已经关闭了默认的22端口

这个过程，会要求你输入密码。成功后你在服务器就能看到`id_rsa.pub`文件了

然后我们为服务器安装这个公钥，登录你的服务器账户

```
$ cat id_rsa.pub >> .ssh/authorized_keys # 追加你的公钥到authorized_keys文件内容后面
```

为了能够使用密钥，你要确保配置文件`/etc/ssh/sshd_config`中，以下配置是开启的（默认应该是开启的）

```
RSAAuthentication yes
PubkeyAuthentication yes
```

这样，之后你再次输入`ssh -p 5000 myname@hostname`就会直接走密钥了

优化，在你的本机电脑上，打开

```
$ vi ~/.ssh/config
```

按照以下格式配置

```
Host    myserver
    HostName    hostname
    Port        5000
    User        myname
```

这样相当于你给你的服务器创建了一个别名，你可以直接用下面的命令登录

```
ssh myserver
```

更进一步，你还可以将服务器的 ssh 密码登录关闭掉

```
PasswordAuthentication no
```

这里我没关闭，因为怕哪天电脑重装，密钥丢失，还有个补救的机会。这个看个人情况吧。

## 后记 ##

说说阿里云香港的使用体验吧。
我的是最低配置，平时也就是放一些个人网站的，跑的程序主要是 Java、Node 跟 Ruby ，感觉都没啥问题。
性能主要还是在网络带宽上，1M略小，考虑个人站也足够。
国内连接速度不算快，上传速度平均 50kbit/s 左右吧，但是还算稳定，至少 ssh 不会掉线。
