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

Activity 的生命周期不在阐述，写过 Android 的都应该知道。

我们假设现在有两个 Activity 分别是 A 和 B，A 是启动页面，那么生命周期回调是这样的：（我们忽略掉一些不关心的回调）

A 被启动或者 A 进入前台

```
A.onStart()
A.onResume()
```

从 A 跳转到 B：

```
A.onPause()
B.onStart()
B.onResume()
A.onStop()
```

从 B 返回 A：

```
B.onPause()
A.onStart()
A.onResume()
B.onStop()
```

A 被关闭或者 A 进入后台

```
A.onPause()
A.onStop()
```

注意上面两个页面回调的启动顺序。

onResume 和 onPause 是一组，两个页面之间是顺序调用。

onStart 和 onStop 是一组，两个页面之间是交叉调用。

也就是说，A 启动到 B，会先调用 B.onStart()，然后再调用 A.onStop()；而 B 返回 A 则是相反的，会先调用 A.onStart()，然后再调用 B.onStop()。

利用这个特性，我们可以做一个全局计数器，来记录前台页面的数量，在所有 Activity.onStart() 中计数器 +1，在所有 Activity.onStop() 中计数器 -1。计数器数目大于0，说明应用在前台；计数器数目等于0，说明应用在后台。计数器从1变成0，说明应用从前台进入后台；计数器从0变成1，说明应用从后台进入前台。

有了思路，我们来实现。

Application 提供了一个监听器用于监听整个应用中 Activity 声明周期：Application.ActivityLifecycleCallbacks。
这个监听器要求 API >= 14。对应 API < 14 的情况，可以通过编写一个 BaseActivity，然后让所有的 Activity 都集成这个类来实现整个应用 Activity 声明周期的监听，效果是相同的。

API >= 14，实现如下：

```
public class ApplicationListener implements Application.ActivityLifecycleCallbacks {

    private int foregroundCount = 0; // 位于前台的 Activity 的数目

    @Override
    public void onActivityStarted(final Activity activity) {
        if (foregroundCount <= 0) {
            // TODO 这里处理从后台恢复到前台的逻辑
        }
        foregroundCount++;
    }

    @Override
    public void onActivityStopped(Activity activity) {
        foregroundCount--;
        if (foregroundCount <= 0) {
            // TODO 这里处理从前台进入到后台的逻辑
        }
    }

    /*
     * 下面回调，我们都不需要
     */

    @Override
    public void onActivityCreated(Activity activity, Bundle savedInstanceState) {}

    @Override
    public void onActivityResumed(Activity activity) {}

    @Override
    public void onActivityPaused(Activity activity) {}

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {}

    @Override
    public void onActivityDestroyed(Activity activity) {}

}
```

我们在 Application 中注册这个监听器来发挥效果：

```
public class MyApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();
        registerActivityLifecycleCallbacks(new ApplicationListener());
    }

}
```

对于 API < 14 的情况，BaseActivity 实现如下：

```
public class BaseActivity extends AppCompatActivity {

    private static int foregroundCount = 0; // 注意是个静态变量

    @Override
    protected void onStart() {
        super.onStart();
        if (foregroundCount <= 0) {
            // TODO 这里处理从后台恢复到前台的逻辑
        }
        foregroundCount++;
    }

    @Override
    protected void onStop() {
        foregroundCount--;
        if (foregroundCount <= 0) {
            // TODO 这里处理从前台进入到后台的逻辑
        }
        super.onStop();
    }

}
```

完。
