---
title: 在 Linux 上配置 Java 环境
date: 2016-10-16 05:39:59
categories:
- 技术
- Java
tags:
- Java
- Gradle
- Maven
- Linux
---
笔记。

<!-- more -->

JDK去官网下载OracleJDK，不要用Ubuntu自带的OpenJDK，有很多问题。
个人目前主要用`Gradle`，`Maven`也顺带装上了。
综合来看，环境变量放到`.bash_profile`里面最好。

```
# Java
export JAVA_HOME=~/cellar/jdk1.8.0_102
export JRE_HOME=$JAVA_HOME/jre
export CLASSPATH=.:$JAVA_HOME/lib:$JRE_HOME/lib:$CLASSPATH
export PATH=$JAVA_HOME/bin:$JRE_HOME/bin:$PATH

# Gradle
export GRADLE_HOME=~/cellar/gradle-3.1
export PATH=$GRADLE_HOME/bin:$PATH

# Maven
export MAVEN_HOME=~/cellar/apache-maven-3.3.9
export PATH=$MAVEN_HOME/bin:$PATH
```
