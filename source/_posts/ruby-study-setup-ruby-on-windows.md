title: 【Ruby学习笔记】在Windows上搭建Ruby on Rails环境
date: 2014-11-26 22:31:15
categories: Ruby
tags: [Ruby学习笔记,Ruby]
---
## 前言 ##

这篇文章主要记录一些我个人在Windows上搭建Ruby on Rails开发环境时遇到的一些问题以及解决方案。

<!-- more -->

社区中经常有对在Windows环境上开发Ruby有看法，因为大多数Ruby开发者来自于Linux，听他们说，Ruby在Windows上体验极其糟糕。或许是一种社区的通病吧，许多Linux开发者常常对Windows环境不削一顾，而Windows开发者也瞧不上Linux，但是奇怪的是大家都一致认同Mac是最好的开发环境。

本人只有一台电脑，运行着Windows。我在Windows上有着很多重要的环境和工具。我不可能因为仅仅要去学习一门语言而放弃Windows（尽管Ruby十分吸引我）。屌丝一枚，没钱也没有肾取购买Mac。有些时候并不是我想，而是不得不使用Windows。

尽管社区很多人在警告Ruby初学者不要在Windows上尝试Ruby，但是从我实际的体验上来说，Windows上运行Ruby并没有想象的哪么糟糕，环境配置十分简单，虽然遇到一些问题，但是基本上很顺利就解决了。

结论就是不要被社区的某些结论吓到。

## 安装Git ##

[http://git-scm.com/download/](http://git-scm.com/download/)

下载Windows上的版本git-scm，安装十分简单，不做详细介绍。注意勾选添加环境变量到path。

严格来说，git并非Ruby和Rails开发的必备品，你不必非要使用git。但是Ruby大多使用git来管理项目，通过git来进行云端部署也是Rails常见的做法。Github作为流行的开源社区已经使git成为程序猿的一个必修技能了。我建议你还是要安装git。

除此之外，还有一个更重要的原因是，Ruby的开发严重依赖于命令行。公认Windows的cmd十分的不好用，使用cmd来开发Ruby绝对会让你抓狂。而git一般会附带一个Bash shell（比如上面的git-scm），十分的好用，可以作为cmd的一个完全的替代品。关于这一点，我相信你会在之后的学习中深深理解的。

## 安装Ruby ##

安装Ruby，我们使用RubyInstaller，地址在：

[http://rubyinstaller.org/downloads/](http://rubyinstaller.org/downloads/)

这是官方推荐的Ruby环境安装工具。笔者下载的是当前最新的版本[Ruby2.1.5](http://dl.bintray.com/oneclick/rubyinstaller/rubyinstaller-2.1.5.exe?direct)。笔者是64位电脑，但是选择的不是64位的安装包。我也建议你不要安装64位的，至于原因，后面会有解释。

安装很简单，注意的是勾选添加环境变量到path。

安装之后，打开bash，输入：

	$ ruby -v

提示版本号，表明安装成功

## 安装RubyRems ##

gem是Ruby上很重要的一个工具，基本上所有的Ruby工具集都通过gem来管理。他的功能和NodeJs中的npm差不多。

RubyGems下载地址：

[http://rubygems.org/pages/download](http://rubygems.org/pages/download)

下载后解压到一个目录，打开bash，输入命令

	$ cd <your gem path>
	$ ruby setup.rb

等提示success之后输入命令

	$ gem -v

出现版本号表明安装成功

## 安装DevKit ##

首先解释一下什么是DevKit。Ruby的工具集都是通过gem管理的，很多都是以源代码发行的，而且涉及和C相关的部分。DevKit实际上就是帮助这些源代码在Windows上进行编译的工具。如果不安装，在安装某些Ruby工具的时候可能会提示类似下面的错误：

	Please update your PATH to include build tools or download the DevKit from 'http://rubyinstaller.org/downloads' and follow the instructions at 'http://github.com/oneclick/rubyinstaller/wiki/Development-Kit'

这是因为没有安装DevKit的缘故。

回到刚才的[RubyInstall](http://rubyinstaller.org/downloads/)页面：

[http://rubyinstaller.org/downloads/](http://rubyinstaller.org/downloads/)

在页面底部找到DevKit下载，笔者选择的是[For use with Ruby 2.0 and 2.1 (32bits version only)](http://cdn.rubyinstaller.org/archives/devkits/DevKit-mingw64-32-4.7.2-20130224-1151-sfx.exe)，我这里选择的也是32位版本，和Ruby匹配。

下载之后是个自解压文件，运行自解压，然后打开bash，输入命令：

	$ cd <your devkit path>
	$ ruby dk.rb init

这时候目录下会生成config.yml文件，表示初始化成功，之后输入命令：

	$ ruby dk.rb install

没问题的话，一堆命令之后会提示success

要注意的是，DevKit仅支持通过RubyInstall安装的Ruby环境

## 安装Rails ##

打开Bash输入命令：

	$ gem install rails

一堆命令之后，输入：

	$ rails -v

提示版本号表明安装成功

## 一个小问题 ##

你可能发现，我们之前每次输入命令都会有一句提示，例如：

	$ rails -v
	DL is deprecated, please use Fiddle
	Rails 4.1.8

这里第二行其实是一个警告，产生的原因是Ruby和Windows环境的兼容的问题。但是实际上并不影响我们使用，因此解决的方案就是，当做没看见吧。

## HelloWorld ##

激动的时刻就要来啦，我们找一个目录，作为Ruby项目的存放目录，我这里假如这个目录是workspace，输入命令：

	$ cd ~/workspace
	$ rails new hellp_world

命令提示首先在hello_world目录下创建了一堆文件，然后执行了bundle install命令，开始安装并下载组件

等一切完成之后，输入命令：

	$ cd hello_world
	$ rails server

会有如下提示：

	=> Booting WEBrick
	=> Rails 4.1.8 application starting in development on http://localhost:3000
	=> Run 'rails server -h' for more startup options
	=> Ctrl-C to shutdown server

我们根据提示，在浏览器访问[http://localhost:3000](http://localhost:3000)，出现如下页面，就说明你成功了。

![](/img/rails-hello-world-page.png)

## 关于刚刚提到的64位的问题 ##

如果你安装的是64位的Ruby的话，在创建Rails的Hello World项目是可能会遇到下面的错误：

	No timezone data source could be found. To resolve this, either install 
	TZInfo::Data (e.g. by running `gem install tzinfo-data`) or specify a zoneinfo 
	directory using `TZInfo::DataSource.set(:zoneinfo, zoneinfo_path)`.
	(TZInfo::DataSourceNotFound) 

这是由于rails的依赖组件tzinfo-data默认情况下没有安装64位版本。
解决的办法是，在创建的rails应用目录下找到gemfile文件，找到如下代码：

	gem 'tzinfo-data', platforms: [:mingw, :mswin]

改为：

	gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw]

然后输入命令：

	$ bundle update

等待下载完成后重启服务器即可。

关于这个问题，在StackOverFlow上的相关链接
[http://stackoverflow.com/questions/23022258/tzinfodatasourcenotfound-error-starting-rails-v4-1-0-server-on-windows](http://stackoverflow.com/questions/23022258/tzinfodatasourcenotfound-error-starting-rails-v4-1-0-server-on-windows)

其实如果你直接安装32位版本的Ruby，就不会存在这个问题。

## 可能会有Sqlite3的错误 ##

Rails4默认使用Sqlite作为默认配置的数据库解决方案。如果在运行Rails程序中出现关于sqlite的错误，到这个页面[http://www.sqlite.org/download.html](http://www.sqlite.org/download.html)，找到```Precompiled Binaries for Windows```的部分，下载[sqlite-dll-win32-x86-3080702.zip](http://www.sqlite.org/2014/sqlite-dll-win32-x86-3080702.zip)，解压后放到Path目录之中就行了。

## 总结 ##

整个安装过程还是十分简单容易的，如果你哪一步出了问题，请仔细的从头检查步骤。你也可以尝试给我发邮件进行交流，但是可能我并不一定有时间回复你。

最后推荐一本十分不错的Ruby on Rails入门教程《Ruby on Rails 教程》（原书第 3 版），你可以在[http://railstutorial-china.org/](http://railstutorial-china.org/)找到他的在线阅读版。在线阅读是免费的。当然你也可以付费买下电子版，给予翻译作者的回报。总之，这本书十分不错，如果你刚刚开始学习Rails，我强烈向你推荐。

最好，祝你好运~Have fun!