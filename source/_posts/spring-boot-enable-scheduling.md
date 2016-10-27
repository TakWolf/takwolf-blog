---
title: Spring Boot 配置定时任务
date: 2016-10-05 03:47:48
categories:
- 技术
- Spring Boot
tags:
- Java
- Spring Boot
- EnableScheduling
---
在 Spring Boot 中配置定时任务非常简单。默认就支持，不需要添加其他依赖。

<!-- more -->

在你的启动类上添加启用定时任务的注解：

```
@SpringBootApplication
@EnableScheduling // 这里，启用定时任务
class Application { ...... }
```

然后，你就可以创建一个定时任务：

```
@Component
public class ScheduledTasks {

    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

    @Scheduled(fixedDelay = 1000 * 60 * 10)
    public void printHelloWorld() {
        log.info("Hello World!");
    }

}
```

所有被`@Scheduled`注解标注的方法，都会成为一个定时任务，被定期调用。这个方法必须是无参数的。
规则如下：
@Scheduled(fixedDelay = 5000) // 上一个任务执行完成的时间开始，延迟这么长时间，再执行下一次
@Scheduled(fixedRate = 5000)  // 按照固定的频率调用，不管上一个任务的执行时间
两者任务执行的时间计算方式是有差别的，要注意。

这里还支持一个`cron`的参数通过表达式支持更复杂的设置，例如：
@Scheduled(cron = "0 * * * * MON-FRI")
详细的说明可以看这个博客：[http://biaoming.iteye.com/blog/39532](http://biaoming.iteye.com/blog/39532)

此外，还有一个附加参数，用来设定第一次任务的执行时间，例如：
@Scheduled(initialDelay = 10000, fixedRate = 5000) // 程序启动后，10秒后执行第一次任务，之后每5秒执行一次任务。
