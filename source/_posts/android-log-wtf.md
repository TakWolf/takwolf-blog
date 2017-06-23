---
title: Android - 关于 Log.wtf()
date: 2017-01-05 00:00:00
categories:
- 技术
- Android
tags:
- Android
- Log
---

Android SDK 的日志接口中，有这么一个函数：

```
android.util.Log.wtf();
```

<!-- more -->

我一直认为，这个是 “What the fuck” 的缩写，用于出现了不可能，无法挽救的错误的场景。

我甚至还觉得谷歌的工程师还蛮有意思的，诙谐幽默。

直到我今天偶然点进去了这个方法，看到了文档注释：

```
What a Terrible Failure: Report a condition that should never happen.
The error will always be logged at level ASSERT with the call stack.
Depending on system configuration, a report may be added to the
{@link android.os.DropBoxManager} and/or the process may be terminated
immediately with an error dialog.
```

原来 `wtf` 是 “What a Terrible Failure” 的意思......

![让我笑一会](/img/please_allow_me_to_laugh_for_a_while.jpg)

就这么个事，挺有趣的，水了一篇博客。
