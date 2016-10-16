title: Ubuntu初始化配置笔记
date: 2016-10-15 01:37:39
categories: Ubuntu
tags: [Ubuntu,安全配置]
---

之前服务器有被入侵过的经历，吃一堑长一智。稍微也研究了一些安全方面的配置，做个笔记。

<!-- more -->

系统版本为Ubuntu，已开启ssh

## 升级 ##

Ubuntu安装成功，第一件事就是升级，这里当然包括安全更新

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

## 修改ssh默认端口号 ##

目的是防止入侵者直接扫描默认端口

打开ssh配置文件

```
$ vi /etc/ssh/sshd_config
```

找到如下位置，并添加一个新端口，例如：5000

```
Port 22
Port 5000 # 添加的端口
```

先不要删除22端口，万一新端口不好使，登不上去了就麻烦了
vim保存后退出，并重启ssh，执行下面的命令

```
$ /etc/init.d/ssh restart
```

退出当前账户，并重新用5000端口登录

```
$ ssh -p 5000 root@hostname
```

测试成功后，删除配置中的22端口并重启ssh

## 禁止root用户登录ssh ##

首先创建一个新的用户

```
$ adduser myname
```

根据提示填写信息，一般直接回车默认就行

然后你用这个用户登录，你会发现无法使用sudo命令，会提示

```
xxx is not in the sudoers file.  This incident will be reported.
```

根据提示，我们去修改`sudoers`，切换到root用户

`sudoers`文件默认是没有写权限的，首先添加写权限

```
$ chmod u+w /etc/sudoers
```

然后vim打开这个文件

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

如此一来，新建的用户就可以使用sudo命令了，测试无误之后，我们禁止root用户登录ssh，还是打开ssh配置文件

```
$ vi /etc/ssh/sshd_config
```

找到

```
PermitRootLogin yes
```

改为

```
PermitRootLogin no
```

保存退出，重启ssh

```
$ /etc/init.d/ssh restart
```

这样root用户就无法登录ssh了。
普通用户状态下，我们使用sudo，或者用su切换到root用户

## 配置ssh使用密钥登录 ##

密码终归是有被暴力破解的风险的，使用密钥对就可以避免这个问题

第一步在本地电脑上生成密钥

```
$ ssh-keygen -t rsa -C your@email.com
```

提示输入保存路径和密码。
路径默认通常是`~/.ssh/id_rsa`
密码不输入的话就是没密码，有密码的话使用私钥的时候会用到

成功之后，会在`~/.ssh`目录下面生成两个文件，`id_rsa`为私钥，`id_rsa.pub`为公钥

然后我们把公钥上传到服务器，执行命令：

```
scp -P 5000 ~/.ssh/id_rsa.pub myname@hostname:~/
```

这句的意思是，我们把`~/.ssh/id_rsa.pub`文件复制到服务器的`~/`目录下面，其中`-P 5000`用来指定端口号，因为上面我们已经关闭了默认的22端口

这个过程，会要求你输入密码。成功后你在服务器就能看到`id_rsa.pub`文件了

然后我们为服务器安装这个公钥，登录你的服务器账户

```
$ cat id_rsa.pub >> .ssh/authorized_keys # 追加你的公钥到authorized_keys文件
```

打开ssh配置文件

```
$ vi /etc/ssh/sshd_config
```

确保下面的配置是否是开启的（默认应该是开启的）

```
RSAAuthentication yes
PubkeyAuthentication yes
```

这样，如果你再次输入`ssh -p 5000 myname@hostname`就会直接走密钥了

优化，在你的本机电脑上，打开

```
$ vi ~/.ssh/config
```

输入一下格式

```
Host myserver
    HostName     hostname
    Port         5000
    User         myname
```

这样相当于你给你的服务器创建了一个别名，你可以直接用下面的命令登录

```
ssh myserver
```

更进一步，你还可以将服务器的ssh的密码登录关闭掉

```
PasswordAuthentication no
```

-EOF-
