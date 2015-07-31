title: PJSIP编译Android平台的Hello World，报错：cannot locate symbol "rand" referenced by "libpjsua.so"
date: 2014-12-03 12:57:30
categories: Android
tags: [PJSIP,Android]
---
最近公司要实现一个IP电话的功能，选择了[PJSIP](http://www.pjsip.org/)这个框架。服务端部分团队大牛已经搞完了，Android这块还要实现一个SIP客户端。安装官方文档编译Hello World，整个过程就是一个字：坑爹一坨坨。

<!-- more -->

最开始是在Windows环境上编译，由于编译依赖于Bash命令以及swig，还有坑爹的Windows和Unix换行符转换的问题，是在解决无力。更换到Ubuntu之后编译通过了，在运行时报错：

```cannot locate symbol "rand" referenced by "libpjsua.so"```

但奇怪的是在Android5.0上运行却正常。Google上说是因为使用了64位ndk的原因，遂更换为32为Ubuntu，问题仍未解决。

最后将ndk重10r更换到9r，编译和运行都通过了。

猜测问题出现在ndk 10r的兼容性上。吐槽一下Android5.0正式版有太多的兼容性问题。ndk 10r是匹配到Android5.0而推送的，估计也有兼容性问题。

经验和教训，简而言之就是以下几句话：

- 别用Windows编译

- 别用Ubuntu 64位，使用32位，包括ndk

- 别用ndk版本号高于r10，使用r9以下版本

我编译成功的环境配置：

- Ubuntu-14.04.1-LTS-i386

- PJSIP-2.3

- ndk-r9d-linux-x86

编译后的代码在这里下载：[PJSIP-Android-Compilation](https://github.com/TakWolf/PJSIP-Android-Compilation)

以上，祝你好运。