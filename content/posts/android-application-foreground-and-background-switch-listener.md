---
title: Android 应用前后台切换监听
description: 如题
date: 2017-06-29T00:00:00+08:00
categories:
- Android
tags:
- Android
- 技术过时
---

最近工作中遇到了这么一个需求：如何实现 Android 应用前后台切换的监听？

### iOS 的情况

iOS 内边是可以实现的，`UIApplicationDelegate` 给了一个回调监听：

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

### Android 的情况以及思路

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

### 编码实现

有了思路，我们来实现。

Application 提供了一个监听器用于监听整个应用中 Activity 声明周期：Application.ActivityLifecycleCallbacks。
这个监听器要求 API >= 14。对应 API < 14 的情况，可以通过编写一个 BaseActivity，然后让所有的 Activity 都集成这个类来实现整个应用 Activity 声明周期的监听，效果是相同的。

API >= 14，实现如下：

``` java
public class ApplicationListener implements Application.ActivityLifecycleCallbacks {

    private int foregroundCount = 0; // 位于前台的 Activity 的数目

    @Override
    public void onActivityStarted(Activity activity) {
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

``` java
public class MyApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();
        registerActivityLifecycleCallbacks(new ApplicationListener());
    }

}
```

对于 API < 14 的情况，BaseActivity 实现如下：

``` java
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

## 2017-07-12 补充

运行一段时间后，发现还存在一些场景，需要特别考虑和处理。

### Activity Changing Configurations

该场景主要出现于下面两种情况：

1.你的 `Activity` 配置中没有固定方向 `android:screenOrientation="portrait"`，并且没有配置 `android:configChanges="keyboard|keyboardHidden|orientation|screenSize"`，然后屏幕旋转造成 `Activity` 重启；

2.手动调用 `Activity.recreate()` 重启活动。

出现该情况，`Activity` 会完整的走完销毁流程，之后重走创建流程，这时候计数器逻辑会出现问题。

还在系统提供了一个接口来判断这个状态：`Activity.isChangingConfigurations()`。

我们更新上面的代码，添加一个缓冲计数器，来兼容这个情况：

``` java
public class ApplicationListener implements Application.ActivityLifecycleCallbacks {

    private int foregroundCount = 0; // 位于前台的 Activity 的数目
    private int bufferCount = 0; // 缓冲计数器，记录 configChanges 的状态

    @Override
    public void onActivityStarted(Activity activity) {
        if (foregroundCount <= 0) {
            // TODO 这里处理从后台恢复到前台的逻辑
        }
        if (bufferCount < 0) {
            bufferCount++;
        } else {
            foregroundCount++;
        }
    }

    @Override
    public void onActivityStopped(Activity activity) {
        if (activity.isChangingConfigurations()) { // 是 configChanges 的情况，操作缓冲计数器
            bufferCount--;
        } else {
            foregroundCount--;
            if (foregroundCount <= 0) {
                // TODO 这里处理从前台进入到后台的逻辑
            }
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

### 接听电话和请求权限

启动一个 `Activity` 之后，接听一个电话，或者动态申请权限，弹窗系统确认对话框。

上面两种情况，`Activity` 只会调用 `onPause()`，并不会调用 `onStop()`，因此这两种情况并不会触发应用进入后台。

首先我们搞清楚为什么 `onStop()` 不会被调用？

#### 对 onStart()、onStop() 和 onResume()、onPause() 两组回调的区别的理解

为什么 Android 要设计两组回调，区别是什么？

我们看看这四个函数的注释怎么写的。

```
这里本应该有注释，但是他们太长了，请大家自己去读，下面只说结论。
```

总结而言：

`onStart()` 和 `onStop()` 是 `Activity` 可见状态切换的回调；

`onResume()` 和 `onPause()` 是 `Activity` 活动状态的回调。

由此看见，两组回调意义是不同的，用处当然也不同。这也解释了为什么他们的调用顺序不一样。

例如，如果你需要操作相机，你应该在 `onResume()` 和 `onPause()` 操作设备，而不是另外两个回调。

因为，`onResume()` 和 `onPause()` 就用来表示活动状态切换，顺序调用。

相反，如果你在 `onStart()` 和 `onStop()` 中调用。在 `B.onStart()` 中，`A.onStop()` 还没调用，相机还没释放的，这就会造成问题。

另外一个例子：

给 Activity B 一个特殊的样式，比如：`@android:style/Theme.Translucent` 或者 `@android:style/Theme.Dialog` 或者其他衍生样式（本质是样式包含 `<item name="windowIsTranslucent">true</item>` 或者 `<item name="windowIsFloating">true</item>`）。

这时 A 启动了 B，B 在表现上处于一个半透明的状态。这时候你会发现，这个过程，A 只调用了 `onPause()`，没有调用 `onStop()`，因为 A 仍然可见。

因此可以理解，为什么请求权限，`onStop()` 不会调用，因为底下的 `Activity` 还是可见的。

接听电话比较特殊，因为界面确实被遮挡了，感觉上应该调用 `onStop()`，但实际确实没有调用。但是这可能是合理的，下面解释。

#### iOS 上面的表现

因为 Android 上面没有定义具体的行为（因此我们才要模拟实现一个），因此我倾向于找一个参照。

例如，iOS 上类似的行为是怎么样的？

上文提到过，iOS 有一个 `UIApplicationDelegate`，定义了 Application 的声明周期。

自己分析，发现其实 Android 和 iOS 行为是相似的：

`applicationWillResignActive`、`applicationDidBecomeActive` 和 `activity.onPause`、`activity.onResume` 对应，表示活动状态的切换。

`applicationDidEnterBackground` 和 `applicationWillEnterForeground` 表示 iOS 应用可见状态的切换。

`activity.onStop` 和 `activity.onStart` 表示 `Activity` 可见状态的切换。

差别在于 iOS 的回调是应用级别的，而 Android 是控制器级别的。

经过测试，接听电话和请求权限，在 iOS 上面，仅调用了 `applicationWillResignActive`，没有调用 `applicationDidEnterBackground`。

这意味着，在 iOS 上面，接听电话和和请求权限仅表示应用暂停，不意味着应用进入后台。

这很棒，这意味着我们不需要对上面的代码做特别处理。

但是如果老板或者产品经理就希望接听电话和和请求权限算应用进入后台，咋办？（总会遇到这样的老板或者产品经理）

幸好，这两个可以单独做监听：

- 接听电话可以被 `BroadcastReceiver` 和 `android.intent.action.PHONE_STATE` 监听

- 请求权限也有个回调 `onRequestPermissionsResult`

你自己弄几个 flag 特别处理一下就可以了。

#### 监听 Android 应用级别的恢复和暂停

对照 iOS 的回调，我发现也许我们也可能有这个需求，监听全局的暂停状态，而不是进入后台。

接听电话和请求权限在这个情形下都会被视为暂停。

不行的是我们没法直接实现这个需求，有一个 Hack 的思路，就是在 `onPause()` 创建一个延时检测任务，如果到时间内没有调用 `onResume()`，就说明应用暂停了。

下面上代码实现：

``` java
public final class ApplicationListener2 implements Application.ActivityLifecycleCallbacks {

    private final Handler handler = new Handler(Looper.getMainLooper());

    private boolean active = false;

    private volatile long checkDelayTime = 100; // 延时检查时间，足够小但是保证 onResume() 可以进入到下一次主循环
    private boolean checking = false;

    private final Runnable checkRunnable = new Runnable() {

        @Override
        public void run() {
            synchronized (checkRunnable) {
                checking = false;
                if (active) {
                    active = false;
                    // TODO 处理应用被暂停的逻辑
                }
            }
        }

    };

    @Override
    public void onActivityResumed(Activity activity) {
        synchronized (checkRunnable) {
            if (checking) {
                handler.removeCallbacks(checkRunnable);
                checking = false;
            }
            if (!active) {
                active = true;
                // TODO 处理应用被恢复的逻辑
            }
        }
    }

    @Override
    public void onActivityPaused(Activity activity) {
        synchronized (checkRunnable) {
            if (active) {
                handler.removeCallbacks(checkRunnable);
                handler.postDelayed(checkRunnable, checkDelayTime);
                checking = true;
            }
        }
    }

    /*
     * 下面回调，我们都不需要
     */

    @Override
    public void onActivityCreated(Activity activity, Bundle savedInstanceState) {}

    @Override
    public void onActivityDestroyed(Activity activity) {}

    @Override
    public void onActivityStarted(Activity activity) {}

    @Override
    public void onActivityStopped(Activity activity) {}

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {}

}
```

## 结尾

上面的都是具体的分析思路，我已经做了两个独立的库可以直接拿来用的，对应上面两种情形。

[Android-Foreback](https://github.com/TakWolf/Android-Foreback) - 监听应用前台后台切换。

[Android-Repause](https://github.com/TakWolf/Android-Repause) - 监听应用级别恢复暂停。

需要请自取。

真完结。
