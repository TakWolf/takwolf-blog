---
title: Android 跳转到应用市场详细信息页面
date: 2014-11-26 17:48:29
categories:
- 技术
- Android
tags:
- Android
---
要实现的功能很简单，用户点击“给应用评分”按钮，就会跳转到应用商店的详细信息页面。
或者点击“更多应用”按钮跳转到商店搜索页面搜索开发者的相关应用。

<!-- more -->

原理十分简单，构建一个`ACTION_VIEW`标记的`Intent`，并给一个如下结构的 Uri 即可：

```
"market://details?id=" + getPackageName() //商店中使用包名来唯一标识区分应用
```

在 Android 平台上，正常情况下手机中的应用商店应该是 Google Play
但是由于各种你懂我也懂的原因，国内基本上无法使用 Google Play 服务。
好在广泛的第三方应用市场大多都实现了这个接口。

代码注释很详细：

```
//这里开始执行一个应用市场跳转逻辑，默认this为Context上下文对象
Intent intent = new Intent(Intent.ACTION_VIEW);
intent.setData(Uri.parse("market://details?id=" + getPackageName())); //跳转到应用市场，非Google Play市场一般情况也实现了这个接口
//存在手机里没安装应用市场的情况，跳转会包异常，做一个接收判断
if (intent.resolveActivity(getPackageManager()) != null) { //可以接收
    startActivity(intent);
} else { //没有应用市场，我们通过浏览器跳转到Google Play
    intent.setData(Uri.parse("https://play.google.com/store/apps/details?id=" + getPackageName()));
    //这里存在一个极端情况就是有些用户浏览器也没有，再判断一次
    if (intent.resolveActivity(getPackageManager()) != null) { //有浏览器
        startActivity(intent);
    } else { //天哪，这还是智能手机吗？
        Toast.makeText(this, "天啊，您没安装应用市场，连浏览器也没有，您买个手机干啥？", Toast.LENGTH_SHORT).show();
    }
}
```

需要注意的就是，如果界面跳转失败，会抛出异常，因此能否跳转需要进行判断。

根据以上，同理使用以下Uri进行替换：

```
Uri.parse("market://search?q=pub:Author Name"); //跳转到商店搜索界面，并搜索开发者姓名
Uri.parse("market://search?q=Keyword"); //跳转到商店搜索界面，并搜索关键词
```

参考链接：
[http://stackoverflow.com/questions/4702204/android-market-detailsid-not-working-for-app](http://stackoverflow.com/questions/4702204/android-market-detailsid-not-working-for-app)
