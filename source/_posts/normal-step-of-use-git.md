title: Git的一般化使用流程
date: 2014-11-26 03:06:06
categories: git
tags: [git]
---
对于Git，平时我愿意使用SourceTree（本人是Windows环境），命令使用的比较少。这里对Git的一般化使用流程做一个总结，也作为一个快速查找手册。

<!-- more -->

使用Git前，需要进行全局配置。该配置对整个系统有效，只需配置一次。以本人的情况为例：
    
    $ git config --global user.name "TakWolf"
    $ git config --global user.email takwolf@foxmail.com
    $ git config --global push.default matching
    $ git config --global alias.co checkout

我们假设已经创建了一个应用，通过cd命令进入目录：

    $ cd workspace/hello_world_app

首先初始化git：

    $ git init

将所有文件放到仓库暂存区中：

    $ git add -A

提交一个commit:

    $ git commit -m "Initialize repository"

以上两个命令可以合并为：

    $ git commit -a -m "commit all"

或者

    $ git commit -am "commit all"

配置远端地址：

    $ git remote add origin https://github.com/takwolf/hello-world-app.git

推送到远端master分支：

    $ git push origin master

---
命令的一些说明

创建一个分支：

    $ git branch <新分支名字>

切换到新分支:

    $ git checkout <新分支名字>

加入一个新的远程端：

    $ git remote add <远程端名字> <地址>

推送分支：

    $ git push origin <新分支名字>
