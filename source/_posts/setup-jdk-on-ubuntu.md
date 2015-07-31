title: 在Ubuntu上配置Jdk环境
date: 2014-11-30 05:39:59
categories: Java
tags: [Java,Jdk,Ubuntu]
---
最近公司项目需要编译Android本地库，Windows一直不成功，遂安装了Linux环境。记录一下Jdk的环境配置，作为学习笔记。

<!-- more -->

Linux为Ubuntu14。

去[官网](http://www.oracle.com/technetwork/java/javase/downloads/index.html)下载jdk，笔者下载的是jdk-8u25-linux-x64.tar.gz。

解压文件到目录

	$ cd <your download path>
	$ sudo mkdir /usr/lib/jvm
	$ sudo tar zxvf jdk-8u25-linux-x64.tar.gz -C /usr/lib/jvm
	$ cd /usr/lib/jvm
	$ sudo mv jdk1.8.0_25 jdk

配置环境变量

	$ sudo gedit ~/.bashrc

在文件末尾添加如下内容

	export JAVA_HOME=/usr/lib/jvm/jdk
	export JRE_HOME=${JAVA_HOME}/jre 
	export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
	export PATH=${JAVA_HOME}/bin:$PATH

配置JDK默认版本

	$ sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/jdk/bin/java 300
	$ sudo update-alternatives --install /usr/bin/javac javac /usr/lib/jvm/jdk/bin/javac 300
	$ sudo update-alternatives --install /usr/bin/jar jar /usr/lib/jvm/jdk/bin/jar 300
	$ sudo update-alternatives --install /usr/bin/javah javah /usr/lib/jvm/jdk/bin/javah 300
	$ sudo update-alternatives --install /usr/bin/javap javap /usr/lib/jvm/jdk/bin/javap 300
	
	$ sudo update-alternatives --config java

如果是首次安装Jdk，会提示

	There is only one alternative in link group java (providing /usr/bin/java): /usr/lib/jvm/jdk/bin/java
	无需配置。

如果不是首次安装，将有不同版本的Jdk选项（笔者没看到）

测试环境变量，出现版本信息表示成功

	$ java -version
	java version "1.8.0_25"
	Java(TM) SE Runtime Environment (build 1.8.0_25-b17)
	Java HotSpot(TM) 64-Bit Server VM (build 25.25-b02, mixed mode)

完毕，have fun~