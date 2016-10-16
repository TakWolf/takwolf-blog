---
title: Android Studio 启动卡在 “fetching Android sdk compoment information”
date: 2015-01-23 18:13:12
categories:
- 技术
- Android
tags:
- Android
---
由于国内墙的原因，无法连接到 Google 的更新服务器。

解决方法：
进入刚安装的 Android Studio 目录下的 bin 目录。
找到 idea.properties 文件，用文本编辑器打开。
在idea.properties文件末尾添加一行：

```
disable.android.first.run=true ，然后保存文件。关闭Android Studio后重新启动。
```
