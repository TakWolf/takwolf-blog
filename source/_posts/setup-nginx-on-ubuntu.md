---
title: 在 Ubuntu 上安装配置 nginx 笔记
date: 2016-10-19 19:59:46
categories:
- 技术
- nginx
tags:
- nginx
---
学习笔记。

<!-- more -->

## 安装 ##

```
$ apt-get install nginx
```

安装完成后查看版本

```
$ nginx -v
nginx version: nginx/1.4.6 (Ubuntu)
```

正常情况，nginx 安装成功之后就应该会启动了。
访问80端口应该会出现 nginx 的欢迎页：

![Welcome to nginx!](/img/welcome-to-nginx.jpg)

如果没有启动，直接输入 nginx 就可以启动：

```
$ nginx   // 直接启动
```

停止 nginx 的命令是：

```
$ nginx -s quit
```

也可以通过 init.d 中的命令来启动和停止：

```
$ /etc/init.d/nginx start     // 启动
$ /etc/init.d/nginx stop      // 停止
$ /etc/init.d/nginx restart   // 重启
```

也可以通过 service 来启动和停止 nginx：

```
$ service nginx start
$ service nginx stop
$ service nginx restart
```

注意，启动和停止可能要求 root 权限。

## 配置 ##

nginx 还有一个网站资源目录。我们知道，nginx 启动之后，默认会有一个欢迎页面。
这个目录位于`/usr/share/nginx`，而欢迎页其实就是`/usr/share/nginx/html/index.html`。

```
$ tree /usr/share/nginx
/usr/share/nginx
└── html
    ├── 50x.html
    └── index.html

1 directory, 2 files
```

你可能找不到 nginx 配置文件的位置，其实有一个命令：

```
$ nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

我的情况，配置文件位于`/etc/nginx/nginx.conf`。
`/etc/nginx`目录下面存放的都是公共配置，我的情况结构是这样的：

```
$ tree /etc/nginx
/etc/nginx
├── conf.d
├── fastcgi_params
├── koi-utf
├── koi-win
├── mime.types
├── naxsi_core.rules
├── naxsi.rules
├── naxsi-ui.conf.1.4.1
├── nginx.conf
├── proxy_params
├── scgi_params
├── sites-available
│   └── default
├── sites-enabled
│   └── default -> /etc/nginx/sites-available/default
├── uwsgi_params
└── win-utf

3 directories, 14 files
```

在`/etc/nginx/nginx.conf`这个配置里面，有这么一句：

```
include /etc/nginx/sites-enabled/*;
```

这句的意思是，导入所有`/etc/nginx/sites-enabled`目录下面的配置文件。
我们打开里面的`sites-enabled/default`这个文件，这个文件其实是引用`sites-available/default`，内容是：

```
server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;

        root /usr/share/nginx/html;
        index index.html index.htm;

        server_name localhost;

        location / {
                try_files $uri $uri/ =404;
        }
}
```

上面这个配置的意思就是创建，监听80端口，并指向上面我们说的欢迎页面目录。

这么来看，我们应该在`sites-available`目录下面创建所有可用的站点的配置，
如果我们要启用这个站点，就在`sites-enabled`目录下面创建一个对应配置的符号连接就行了。

下面，需求是这样的：
我们有一个博客程序，跑在端口2000上面，希望绑定域名为`blog.takwolf.com`。
域名商的部分，我们已经添加了A解析，将域名解析到了我们的服务器IP上面。
下面我们在 nginx 上配置这两个站点。

我们在`sites-available`下面创建一个配置文件，文件名为`blog.takwolf.com`。
文件名我直接命名为跟域名相同，这样方便管理。
内容如下：

```
server {
  listen 80;
  server_name blog.takwolf.com;
  location / {
    proxy_pass http://localhost:2000;
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

上面的配置意思是，我监听80端口，如果发现域名是`blog.takwolf.com`，则转发到2000端口上面。
这里有一个要注意的就是，因为我们这里是代理，因此添加了两个头记录客户端的IP。
关于这两个头，可以看下面这个文章，有更详细的说明：
[https://imququ.com/post/x-forwarded-for-header-in-http.html](https://imququ.com/post/x-forwarded-for-header-in-http.html)

然后我们在`sites-enabled`下面创建这个配置文件的符号连接，命令格式是：

```
$ ln -s f1 f2
```

我们例子中的情况就应该是：

```
$ ln -s /etc/nginx/sites-available/blog.takwolf.com /etc/nginx/sites-enabled/blog.takwolf.com
```

然后重启 nginx，配置就会生效了，直接访问域名看看效果吧。
