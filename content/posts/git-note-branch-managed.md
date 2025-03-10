---
title: Git 分支管理
description: 如题
date: 2014-12-10T00:00:00+08:00
categories:
- 技术
- Git
tags:
- Git
---

笔记

## 创建分支

创建一个新分支：

```
$ git branch <分支名>
```

切换到指定分支：

```
$ git checkout <分支名>
```

创建分支并切换：

```
$ git checkout -b <分支名>
```

## 分支合并

比如，如果要将开发中的分支（develop），合并到稳定分支（master），首先切换的master分支：

```
$ git checkout master
```

然后执行合并操作：

```
$ git merge develop
```

如果有冲突，会提示你，调用

```
$ git status
```

查看冲突文件，解决冲突，然后调用

```
$ git add
```

或

```
$ git rm
```

将解决后的文件暂存。所有冲突解决后，调用

```
$ git commit
```

提交更改。

## 分支衍合

分支衍合和分支合并的差别在于，分支衍合不会保留合并的日志，不留痕迹，而 分支合并则会保留合并的日志。

要将开发中的分支（develop），衍合到稳定分支（master），首先切换的master分支：

```
$ git checkout master
```

然后执行衍和操作：

```
$ git rebase develop
```

如果有冲突，会提示你，调用

```
$ git status
```

查看冲突文件。解决冲突，然后调用

```
$ git add
```

或

```
$ git rm
```

将解决后的文件暂存。所有冲突解决后，调用

```
$ git rebase --continue
```

提交更改。

## 删除分支

```
$ git branch -d <分支名>
```

如果该分支没有合并到主分支会报错，可以用以下命令强制删除：

```
$ git branch -D <分支名>
```

参考链接：
[http://www.cnblogs.com/sk-net/archive/2011/07/11/2103282.html](http://www.cnblogs.com/sk-net/archive/2011/07/11/2103282.html)
