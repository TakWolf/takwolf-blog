---
title: Android 的 support-v4 扩展库的 minSdkVersion=9 ！是笔误还是故意为之？
description: 如题
date: 2016-09-14T00:00:00+08:00
categories:
- 技术
- Android
tags:
- Android
---

今天更新了 Android Support Repository，相应的 android-support-v4 也升级到了 24.2.1
但是我的项目却报了如下的错误：

```
Error:Execution failed for task ':fragmentswitcher:processDebugAndroidTestManifest'.
> Manifest merger failed : uses-sdk:minSdkVersion 4 cannot be smaller than version 9 declared in library [com.android.support:support-v4:24.2.1] ~\Android-FragmentSwitcher\fragmentswitcher\build\intermediates\exploded-aar\com.android.support\support-v4\24.2.1\AndroidManifest.xml
Suggestion: use tools:overrideLibrary="android.support.v4" to force usage
```

这个错误的意思是，你的项目的 minSdkVersion=4，而 android-support-v4 要求他至少为9

看到这个错误，我其实是一脸懵逼的。

Android Support Repository 包含了很多库，很多都是按照 vX 结尾的，这个其实表示这个库的 API 兼容到的最低版本。
举个例子：
cardview-v7，兼容到 API7
support-v13，兼容到 API13
也就是说，support v4 的意思就是，把一些兼容性组件，兼容到 API4 的级别上。

那么，你把 minSdkVersion 设置为9，那还叫啥 v4 啊？

心塞。。。

Android Support Repository 是安装到本地的
位置在：%ANDROID_SDK_HOME%/sdk/extras/android/m2repository/com/android/support

我们找到：support-v4/24.2.1/support-v4-24.2.1.arr
解包后打开里面的 AndroidManifest.xml，内容是这样的：

``` XML
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="android.support.v4" >

    <uses-sdk
        android:minSdkVersion="9"
        tools:overrideLibrary="android.support.v4" />

    <application />

</manifest>
```

minSdkVersion 确实被设置为9了。不清楚是笔误还是故意为之。
当然，解决方案错误提示中也给出了，要么把你的项目的 minSdkVersion 设置大于9，
要把使用 `tools:overrideLibrary="android.support.v4"` 让编译器忽略。

2016-10-22日补充：

android-support-v4 已经升级到25了，这个问题依旧存在。
