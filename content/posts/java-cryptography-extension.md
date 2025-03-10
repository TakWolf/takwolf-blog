---
title:  Java Cryptography Extension (JCE)
description: 如题
date: 2017-02-25T00:00:00+08:00
categories:
- 技术
- Java
tags:
- Java
- JCE
---

需求是需要实现一个邮件发送提醒功能，之前用的都是网易的邮件，最近想切换到腾讯邮箱。启用了SSL，结果报错了：

```
这里本来应该有异常栈信息的，结果我忘记记录了。
```

查了一下，主要跟JCE有关系。

在早期JDK版本中，由于受美国的密码出口条例约束，Java中涉及加解密功能的API被限制出口。
所以Java中安全组件被分成了两部分: 不含加密功能的JCA（Java Cryptography Architecture）和含加密功能的JCE（Java Cryptography Extension）。
在JDK1.1-1.3版本期间，JCE属于扩展包，仅供美国和加拿大的用户下载，JDK1.4+版本后，随JDK核心包一起分发。

简而言之，就是说由于美国的一些法律原因，JDK自带的加密组件，加密安全级别较低。
如果你需要更高安全级别的加密功能，你就需要JCE。

JCE就是一个jar包，你可以理解成他就是一个补丁，下载后替换掉JDK路径中的相关文件就行了，非常简单。

JCE for JDK8 [官方下载地址](http://www.oracle.com/technetwork/java/javase/downloads/jce8-download-2133166.html)

下载后，解压，会有三个文件：

```
local_policy.jar
US_export_policy.jar
README.txt
```

拷贝两个 jar 文件，复制到 `[JRE_HOME]/lib/security/` 文件夹中替换两个文件即可。

需要注意的是，你的电脑上可能有两个JRE，一个是独立的JRE运行时，一个是附带在JDK中的，两个都要替换。
（就是说你运行环境中的内个JRE要确保打了补丁。）

上面的安装方法，来源于 `README.txt`。

打了补丁，连接就可以正常通过了。

欧耶！
