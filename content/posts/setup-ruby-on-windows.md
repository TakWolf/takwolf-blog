---
title: 在 Windows 上搭建 Ruby on Rails 环境
description: 如题
date: 2014-11-26T00:00:00+08:00
categories:
- 技术
- Ruby
tags:
- Ruby
- Rails
---

一篇在 Windows 上折腾 Ruby on Rails 开发环境的笔记。当然社区的建议是，不要在 Windows 上使用 Ruby !!!

## 安装Git

[http://git-scm.com/download/](http://git-scm.com/download/)

正常安装，注意勾选：添加环境变量到PATH

带有一个 Bash shell，比默认的 CMD 好用一些。

## 安装Ruby

使用 RubyInstaller，地址在：

[http://rubyinstaller.org/downloads/](http://rubyinstaller.org/downloads/)

这是官方推荐的 Ruby 安装工具。
笔者下载的是当前最新的版本[Ruby2.1.5](http://dl.bintray.com/oneclick/rubyinstaller/rubyinstaller-2.1.5.exe?direct)。
笔者是64位电脑，但是选择的不是64位的安装包。我也建议你不要安装64位的，至于原因，后面会有解释。

安装很简单，注意勾选：添加环境变量到PATH

安装之后，打开bash，输入：

```
$ ruby -v
```

提示版本号，表明安装成功

## 安装 RubyRems

gem 是 Ruby 上很重要的一个工具，基本上所有的 Ruby 工具集都通过 gem 来管理。他的功能和 Node 中的 npm 差不多。

RubyGems 下载地址：

[http://rubygems.org/pages/download](http://rubygems.org/pages/download)

下载后解压到一个目录，打开 bash，输入命令

```
$ cd <your gem path>
$ ruby setup.rb
```

等提示成功之后输入命令

```
$ gem -v
```

提示版本号，表明安装成功

## 安装 DevKit

首先解释一下什么是 DevKit。Ruby 的工具集都是通过 gem 管理的，很多都是以源代码发行的，而且涉及和C相关的部分。
DevKit 实际上就是帮助这些源代码在 Windows 上进行编译的工具。如果不安装，在安装某些 Ruby 工具的时候可能会提示类似下面的错误：

```
Please update your PATH to include build tools or download the DevKit from 'http://rubyinstaller.org/downloads' and follow the instructions at 'http://github.com/oneclick/rubyinstaller/wiki/Development-Kit'
```

这是因为没有安装 DevKit 的缘故。

回到刚才的[RubyInstall](http://rubyinstaller.org/downloads/)页面：

[http://rubyinstaller.org/downloads/](http://rubyinstaller.org/downloads/)

在页面底部找到 DevKit 下载，
笔者选择的是[For use with Ruby 2.0 and 2.1 (32bits version only)](http://cdn.rubyinstaller.org/archives/devkits/DevKit-mingw64-32-4.7.2-20130224-1151-sfx.exe)
我这里选择的也是32位版本，和 Ruby 匹配。

下载之后是个自解压文件，运行自解压，然后打开bash，输入命令：

```
$ cd <your devkit path>
$ ruby dk.rb init
```

这时候目录下会生成 config.yml 文件，表示初始化成功，之后输入命令：

```
$ ruby dk.rb install
```

没问题的话，一堆命令之后会提示成功

要注意的是，DevKit 仅支持通过 RubyInstall 安装的 Ruby 环境

## 安装 Rails

打开 Bash 输入命令：

```
$ gem install rails
```

一堆命令之后，输入：

```
$ rails -v
```

提示版本号，表明安装成功

## 一个小问题

你可能发现，我们之前每次输入命令都会有一句提示，例如：

```
$ rails -v
DL is deprecated, please use Fiddle
Rails 4.1.8
```

这里第二行其实是一个警告，产生的原因是 Ruby 和 Windows 环境的兼容的问题。
但是实际上并不影响我们使用，因此解决的方案就是，当做没看见吧。

## HelloWorld

激动的时刻就要来啦，我们找一个目录，作为Ruby项目的存放目录，我这里假如这个目录是`workspace`，输入命令：

```
$ cd ~/workspace
$ rails new hellp_world
```

命令提示首先在`hello_world`目录下创建了一堆文件，然后执行了`bundle install`命令，开始安装并下载组件

等一切完成之后，输入命令：

```
$ cd hello_world
$ rails server
```

会有如下提示：

```
=> Booting WEBrick
=> Rails 4.1.8 application starting in development on http://localhost:3000
=> Run 'rails server -h' for more startup options
=> Ctrl-C to shutdown server
```

我们根据提示，在浏览器访问[http://localhost:3000](http://localhost:3000)，出现如下页面，就说明你成功了。

![](/img/rails-hello-world-page.png)

## 关于刚刚提到的64位的问题

如果你安装的是64位的 Ruby 的话，在创建 Rails 的 Hello World 项目是可能会遇到下面的错误：

```
No timezone data source could be found. To resolve this, either install
TZInfo::Data (e.g. by running `gem install tzinfo-data`) or specify a zoneinfo
directory using `TZInfo::DataSource.set(:zoneinfo, zoneinfo_path)`.
(TZInfo::DataSourceNotFound)
```

这是由于 Rails 的依赖组件 tzinfo-data 默认情况下没有安装64位版本。
解决的办法是，在创建的 Rails 应用目录下找到 gemfile 文件，找到如下代码：

```
gem 'tzinfo-data', platforms: [:mingw, :mswin]
```

改为：

```
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw]
```

然后输入命令：

```
$ bundle update
```

等待下载完成后重启服务器即可。

关于这个问题，在 StackOverFlow 上的相关链接
[http://stackoverflow.com/questions/23022258/tzinfodatasourcenotfound-error-starting-rails-v4-1-0-server-on-windows](http://stackoverflow.com/questions/23022258/tzinfodatasourcenotfound-error-starting-rails-v4-1-0-server-on-windows)

其实如果你直接安装32位版本的 Ruby，就不会存在这个问题。

## 可能会有 Sqlite3 的错误

Rails4 默认使用 Sqlite 作为默认配置的数据库解决方案。
如果在运行 Rails 程序中出现关于 Sqlite 的错误，到这个页面[http://www.sqlite.org/download.html](http://www.sqlite.org/download.html)
找到`Precompiled Binaries for Windows`的部分，
下载[sqlite-dll-win32-x86-3080702.zip](http://www.sqlite.org/2014/sqlite-dll-win32-x86-3080702.zip)
解压后放到Path目录之中就行了。

## 后记

最后推荐一本十分不错的 Ruby on Rails 入门教程《Ruby on Rails 教程》（原书第 3 版）
你可以在[http://railstutorial-china.org/](http://railstutorial-china.org/)找到他的在线阅读版。
在线阅读是免费的。当然你也可以付费买下电子版。

最好，祝你好运 ~ Have fun!
