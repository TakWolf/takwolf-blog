---
title: Android - 应用前后台切换监听
date: 2017-06-29 00:00:00
categories:
- 技术
- Android
tags:
- Android
---
最近工作中遇到了这么一个需求：如何实现 Android 应用前后台切换的监听？

<!-- more -->

iOS 内边是可以实现的，`AppDelegate` 给了一个回调监听：

``` swift
@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

}
```

我保留了系统注释。一个iOS应用周期，大概的流程是这样的。

应用从前台进入到后台：

> applicationWillResignActive() -> applicationDidEnterBackground()

应用从后台恢复到前台：

> applicationWillEnterForeground() -> applicationDidBecomeActive()

Android 中也存在 Application，但是并没有提供前后台切换的监听。

倒不如说，在 Android 中，压根就没有应用前后台的概念。

Android 中基本页面单位是 Activity。

Activity 有自己的生命周期，但是 Application 却没有一个整体的生命周期。

我们可以通过监听 Activity 的生命周期，来模拟实现一个 Application 的生命周期。

我们先复习一下 Activity 的生命周期有哪些：

```

```






















完。
