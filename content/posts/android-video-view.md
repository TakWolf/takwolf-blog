---
title: Android 实现视频播放
description: 如题
date: 2014-10-16T00:00:00+08:00
categories:
- 技术
- Android
tags:
- Android
- 视频播放
---

笔记，实现 Android 视频播放。

提到视频播放，有这么几种方法。

## 1.调用系统播放器

``` Java
Uri uri = Uri.parse(Environment.getExternalStorageDirectory().getPath()+"/video.mp4");  
Intent intent = new Intent(Intent.ACTION_VIEW);
intent.setDataAndType(uri, "video/mp4"); //这句不要忘记，表明资源是视频类型
startActivity(intent);
```

## 2.使用MediaPlayer和SurfaceView

说实话，这种方式太过麻烦，代码就不粘贴了。其实还有更简单的下面的第三种方法。

## 3.使用VideoView

这个本身就是为了播放视频而设计的控件。
通过查看基础树我们发现，其实他就是继承了`SurfaceView`并且实现了`MediaPlayerControl`
实质是第二种方式的一个封装，而使用起来要方便很多，视频在 start 调用之后自动加载，你也不需要去手动释放资源，控件都帮你处理了。

一个非常简单的例子：

``` Java
videoView = (VideoView) findViewById(R.id.video_view);
videoView.setMediaController(new MediaController(this));
Uri uri = Uri.parse(Environment.getExternalStorageDirectory().getPath()+"/video.mp4");
videoView.setVideoURI(uri);
videoView.start();
```

上面代码中的`setMediaController`可以添加一个媒体控制器。
这是一个默认实现的控件，包括进度，暂停神马的，如果没有特殊的要求，功能基本也就够用了。
当然，你也可以自己来实现。
VideoView 本身也提供媒体控制接口和监听器。

Android系统默认支持的视频格式如下：

``` Java
//Video
addFileType("MP4", FILE_TYPE_MP4, "video/mp4");
addFileType("M4V", FILE_TYPE_M4V, "video/mp4");
addFileType("3GP", FILE_TYPE_3GPP, "video/3gpp");
addFileType("3GPP", FILE_TYPE_3GPP, "video/3gpp");
addFileType("3G2", FILE_TYPE_3GPP2, "video/3gpp2");
addFileType("3GPP2", FILE_TYPE_3GPP2, "video/3gpp2");
addFileType("WMV", FILE_TYPE_WMV, "video/x-ms-wmv");
```

这里还有一个问题要特殊说明一下:
VideoView 加载视频需要通过 Uri 或者 Path。
上面的代码是从 SDCard 中加载视频的，Uri 的构筑方式是：

``` Java
Uri uri = Uri.parse(Environment.getExternalStorageDirectory().getPath()+"/video.mp4");
```

当然，有的时候我们可能并不是要制作一个视频播放器，而是仅仅加载一些应用内置视频，做些产品或者功能演示神马的。
我们的第一个思路是将视频文件放到 assets 资源目录下。
实际编码中我们发现 AssetManager 竟然不能够直接获取 Path，也无法直接构筑 Uri。
我们按照以往的经验:

``` Java
WebView webView = new WebView(this);
webView.loadUrl(file:///android_asset/index.html);
```

实测这种方式在VideoView中无效，控件会提示视频无法播放，从调试信息来看，应该是控件无法找到视频路径。

百度和 Google 基本无方案，stackoverflow上有一个解答：

[链接](http://stackoverflow.com/questions/3746361/i-want-to-play-a-video-from-my-assets-or-raw-folder)

最终的方案是这样的：
将视频文件放到 res/raw 文件夹中（注意res资源的命名规则），然后通过包名和 R 中的资源编号构筑 Uri

``` Java
Uri uri = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.video);
```

最终的代码：

``` Java
videoView = (VideoView) findViewById(R.id.video_view);
videoView.setMediaController(new MediaController(this));
Uri uri = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.video);
videoView.setVideoURI(uri);
videoView.start();
```

问题解决。

最后附上一个[链接](http://www.open-open.com/lib/view/open1341754267229.html)

这里有三种比较详细的视频播放例子，主要是有一个MediaPlay的例子。
虽然没有使用，但留个备份。
