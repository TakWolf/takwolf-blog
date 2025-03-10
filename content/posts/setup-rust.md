---
title: 配置 Rust 开发环境
description: 如题
date: 2017-08-10T00:00:00+08:00
categories:
- 技术
- Rust
tags:
- Rust
- rustup
---

适用于 macOS 和 Windows。

笔记。

## 安装 Rust 编译环境

之前在 Windows 上，Rust 有独立的安装工具，macOS 上面可以用 Home Brew 安装 Rust。

但是这样会有些问题，即无法动态切换 Rust 版本，另外源码需要单独配置。

现在官方推荐使用 [rustup](https://rustup.rs/) 来安装 Rust 环境。

### macOS 安装 rustup

运行下面的脚本安装：

``` sh
$ curl https://sh.rustup.rs -sSf | sh
```

注意，不要使用 Home Brew 安装 rustup，会有一些问题。

### Windows 安装 rustup

下载 rustup-init.exe，运行之后按照屏幕提示即可。

注意，在 Windows 上面，Rust 编译需要 Visual C++ Build Tools。请先安装这个之后再安装 rustup。

你非要不安装也行，rustup 会给出警告，工具链会被接换到 Gun C 上面，可能会有一些问题。

关于这一部分，请参考 [https://github.com/rust-lang-nursery/rustup.rs#working-with-rust-on-windows](https://github.com/rust-lang-nursery/rustup.rs#working-with-rust-on-windows)

### 更新与卸载

安装 rustup 之后，会默认安装 Rust stable。

如果你需要安装 nightly，运行：

``` sh
$ rustup install nightly
```

将 nightly 设置为默认 Rust 环境：

``` sh
$ rustup default nightly
```

更新所有 Rust，运行：

``` sh
$ rustup update
```

检查 rustup 自身是否有更新：

``` sh
$ rustup self update
```

但是这一步操作在新版中似乎不需要做了，因为更新 Rust 的时候，貌似也会检查自身是否有更新：

``` sh
$ rustup update
info: syncing channel updates for 'stable-x86_64-apple-darwin'
info: syncing channel updates for 'nightly-x86_64-apple-darwin'
info: checking for self-updates

   stable-x86_64-apple-darwin unchanged - rustc 1.19.0 (0ade33941 2017-07-17)
  nightly-x86_64-apple-darwin unchanged - rustc 1.21.0-nightly (f14249953 2017-08-09)
```

卸载 rustup：

``` sh
$ rustup self uninstall
```

### 添加 Rust 源代码

rustup 可也以安装配套的源代码，这样你就不需要自己配置了，方法：

``` sh
$ rustup component add rust-src
```

Rust 所有工具链都被安装在了 `~/.rustup/toolchains/` 目录下面。如果你需要配置就在这里面找。

## 配置 Rust 编辑环境

目前所有编辑器方案，idea + rust 插件体验是最好的。你自己试一下就知道了。

Rust 插件已经被官方接手了，不知道之后会不会出面向 Rust 的独立 IDE。

如果你买不起正版，又有强迫症无法接受 idea 授权方面的问题，可以试一下 Atom（或者 VSCode）+ 插件的方案，也可以接受。

完。
