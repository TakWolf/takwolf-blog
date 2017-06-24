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
在 Spring Boot 中配置定时任务非常简单。
默认就支持，他在 spring-context 里面，不需要添加其他依赖。

<!-- more -->

在你的启动类上添加启用定时任务的注解：

``` Java
@SpringBootApplication
@EnableScheduling // 这里，启用定时任务
class Application { ...... }
```

然后，你就可以创建一个定时任务：

``` Java
@Component
public class ScheduledTasks {

    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

    @Scheduled(fixedDelay = 1000 * 60 * 10)
    public void printHelloWorld() {
        log.info("Hello World!");
    }

}
```

所有被`@Scheduled`注解标注的方法，都会成为一个定时任务，被定期调用。
也就是说你可以标注多个方法为定时任务。
注意这个方法必须是无参数的。

任务规则如下：
@Scheduled(fixedDelay = 5000) // 上一个任务执行完成的时间开始，延迟这么长时间，再执行下一次
@Scheduled(fixedRate = 5000)  // 按照固定的频率调用，不管上一个任务的执行时间
两者任务执行的时间计算方式是有差别的，要注意。

这里还支持一个`cron`的参数通过表达式支持更复杂的设置，例如：
@Scheduled(cron = "0 * * * * MON-FRI")
详细的说明可以看这个博客：[http://biaoming.iteye.com/blog/39532](http://biaoming.iteye.com/blog/39532)

此外，还有一个附加参数，用来设定第一次任务的执行时间，例如：
@Scheduled(initialDelay = 10000, fixedRate = 5000) // 程序启动后，10秒后执行第一次任务，之后每5秒执行一次任务。

**上面的都非常好理解。下面，重点来了！**

1.如果，定时任务中执行的是一个耗时任务，并且执行时间超过了定时任务的频率，会怎么样？
2.当一个任务执行的过程中，其他任务会执行吗？
说白了，其实我们就是想要知道这个任务执行池是不是个单线程。
我写了如下的方法来测试：

``` Java
@Component
public class ScheduledTasks {

    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

    @Scheduled(fixedRate = 1000)
    public void printTask() {
        log.info("Hello World!");
    }

    @Scheduled(fixedRate = 5000)
    public void longTimeTask() {
        log.info("Long time task start.");
        for (int n = 0; n < Integer.MAX_VALUE / 10; n++) {
            Math.sin(n);
        }
        log.info("Long time task finish.");
    }

}
```

printTask 就是打印一个日志，任务的调用频率固定是1秒钟。
longTimeTask 我通过计算模拟了一个耗时任务，在我的电脑上，执行时间会远远超过5秒钟。任务的调用频率固定是5秒钟。

运行之后，日志结果如下：

```
2016-10-05 05:06:37.637  : Hello World!
2016-10-05 05:06:37.637  : Long time task start.
2016-10-05 05:07:55.463  : Long time task finish.
2016-10-05 05:07:55.463  : Hello World!
2016-10-05 05:07:55.463  : Hello World!
2016-10-05 05:07:55.463  : Hello World!
2016-10-05 05:07:55.463  : Hello World!
2016-10-05 05:07:55.463  : Hello World!
2016-10-05 05:07:55.463  : Long time task start.
2016-10-05 05:09:48.793  : Long time task finish.
2016-10-05 05:09:48.793  : Hello World!
2016-10-05 05:09:48.793  : Hello World!
2016-10-05 05:09:48.793  : Hello World!
2016-10-05 05:09:48.793  : Hello World!
2016-10-05 05:09:48.793  : Hello World!
2016-10-05 05:09:48.794  : Long time task start.
2016-10-05 05:11:20.552  : Long time task finish.
2016-10-05 05:11:20.552  : Hello World!
2016-10-05 05:11:20.552  : Hello World!
2016-10-05 05:11:20.552  : Hello World!
2016-10-05 05:11:20.552  : Hello World!
2016-10-05 05:11:20.552  : Hello World!
2016-10-05 05:11:20.552  : Long time task start.
......
```

日志结果可以看出，longTimeTask 这个任务执行时间明显超过1分钟。
并且当他在执行过程中的时候，其他任务是阻塞状态的，并不会执行。
而当 longTimeTask 执行完毕之后，那些晚点的任务一股脑全出来了。

也就是说，Spring 默认给我们提供的这是个单线程任务池，长时间任务会造成阻塞，任务执行时间是累计计算的。

其实这个是有说明的，在`@EnableScheduling`的源码头注释中会看到这样一些信息：

```
By default, will be searching for an associated scheduler definition: either
a unique {@link org.springframework.scheduling.TaskScheduler} bean in the context,
or a {@code TaskScheduler} bean named "taskScheduler" otherwise; the same lookup
will also be performed for a {@link java.util.concurrent.ScheduledExecutorService}
bean. If neither of the two is resolvable, a local single-threaded default
scheduler will be created and used within the registrar.
```

如果我们实际的需求，就遇到了超时任务，我又不希望被阻塞，应该怎么办呢？
你可以创建一个多线程任务池的实现替换掉 Spring 默认提供的 bean，用你自己的多线程策略。
但是我觉得这样可能并不好，因为多线程本身会占用应用资源，即便你使用线程池。

更合理的实现方式是，你有一个消息队列的服务，把长时间任务放到队列中让专门的服务去处理他。
当然，消息队列是另外一个话题了，他有很多可以说的，我们改天再聊。
