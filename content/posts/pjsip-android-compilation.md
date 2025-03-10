---
title: PJSIP 编译 Android 平台，报错：cannot locate symbol "rand" referenced by "libpjsua.so"
description: 如题
date: 2014-12-03T00:00:00+08:00
categories:
- 技术
- Android
tags:
- Android
- SIP
---

最近公司要实现一个IP电话的功能，选择了[PJSIP](http://www.pjsip.org/)这个框架。
服务端部分团队大牛已经搞完了，Android 这块还要实现一个 SIP 客户端。
安装官方文档编译Hello World，整个过程就是一个字：坑爹。

最开始是在 Windows 环境上编译，由于编译依赖于 Bash 命令以及 swig，还有坑爹的 Windows 和 Unix 换行符转换的问题，是在解决无力。
更换到 Ubuntu 之后编译通过了，在运行时报错：

```
cannot locate symbol "rand" referenced by "libpjsua.so"
```

但奇怪的是在 Android5.0 上运行却正常。
Google 上说是因为使用了64位 ndk 的原因，遂更换为32为 Ubuntu，问题仍未解决。

最后将 ndk 从 10r 更换到 9r，编译和运行都通过了。
猜测问题出现在 ndk 10r 的兼容性上。

吐槽一下 Android5.0 正式版有太多的兼容性问题。
ndk 10r 是匹配到 Android5.0 而推送的，估计也有兼容性问题。

经验和教训，简而言之就是以下几句话：

- 别用 Windows 编译

- 别用 Ubuntu 64位，使用32位，包括 ndk

- 别用 ndk 版本号高于 r10，使用 r9 以下版本

我编译成功的环境配置：

- Ubuntu-14.04.1-LTS-i386

- PJSIP-2.3

- ndk-r9d-linux-x86

编译后的代码在这里下载：[PJSIP-Android-Compilation](https://github.com/TakWolf/PJSIP-Android-Compilation)

不保证可用性，祝你好运！
