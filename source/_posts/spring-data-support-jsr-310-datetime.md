---
title: 让 Spring Data 兼容 Java 8 的时间 API（java.time 包，JSR310)
date: 2016-06-16 21:59:49
categories:
- 技术
- Spring Boot
tags:
- Java
- Spring Boot
- Spring Data
---
这个内容，在官方博客里面有介绍，地址在：
[https://spring.io/blog/2015/03/26/what-s-new-in-spring-data-fowler#jsr-310-and-threeten-backport-support](https://spring.io/blog/2015/03/26/what-s-new-in-spring-data-fowler#jsr-310-and-threeten-backport-support)

Stackoverflow 上也有一个关于这个问题的讨论，地址在：
[http://stackoverflow.com/questions/29241575/new-spring-data-jdk8-jsr310jpaconverters-not-working-automatically](http://stackoverflow.com/questions/29241575/new-spring-data-jdk8-jsr310jpaconverters-not-working-automatically)

<!-- more -->

环境是 Spring Boot，在你的启动类上添加注解：

```
@EntityScan(
    basePackageClasses = { Application.class, Jsr310JpaConverters.class }
)
@SpringBootApplication
class Application { ...... }
```

注意，`@EntityScan`扫描类必须添加你的启动类`Application.class`。
因为这个注解是覆盖的，你添加了之后，`@SpringBootApplication`本身的扫描就无效了。
这会造成你的项目启动失败，以为你项目本身的包不会被扫描了。

然后你就可以直接使用 Java 8 的时间 API 了，比如，在 JPA 中，可以直接这么写：

```
@Entity
public class User {

    @Id
    private int id;

    private LocalDateTime createTime;   // JSR310

    ......

}
```

在 MySql 中会直接映射为 datetime 类型。
要注意的是，只支持`LocalDateTime`类型，不支持`ZonedDateTime`以及其他类型。
因为，MySql 的 datetime 不支持时区。

打开`Jsr310JpaConverters.java`你会发现这个类实现上就是提供了一批 Converter。
这里还有一个类叫做`ThreeTenBackPortJpaConverters.java`，名字翻译过来也是310，
他的实现跟`Jsr310JpaConverters.java`是相同的，差别在于：
`Jsr310JpaConverters.java`转换的是`java.time`里面的类型，而
`ThreeTenBackPortJpaConverters.java`转换的则是`org.threeten.bp`里面的类型，
这其实是一个 Java 8 时间类型的兼容项目，项目主页在：[http://www.threeten.org](http://www.threeten.org)
当然，如果你本身用的就是 Java 8 的环境，就没必要关心了。
