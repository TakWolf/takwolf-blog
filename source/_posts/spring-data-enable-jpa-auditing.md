---
title: 启用 Spring Data JPA 审计 - @EnableJpaAuditing
date: 2016-06-22 02:11:08
categories:
- 技术
- Spring Boot
tags:
- Java
- Spring Boot
- EnableJpaAuditing
---
突然发现 Spring Data JPA 有这么一个功能，英文是 Auditing，翻译过来叫做审计不知道合不合适。

<!-- more -->

在你的配置类上添加这个标签：

```
@SpringBootApplication
@EnableJpaAuditing  // 这里，启用审计
class Application { ...... }
```

然后在你的实体类中就可以这么用了：

```
@Entity
@EntityListeners(AuditingEntityListener.class)  // 这里注意，启用审计的实体中都必须注册这个 Listener，否则是没有效果的
public class SomeEntity {

    @Id
    private long id;

    @CreatedDate // 创建的时间
    private Date createTime;

    @CreatedBy // 创建的用户
    private User createUser;

    @LastModifiedDate // 最后修改的时间
    private Date updateTime;

    @LastModifiedBy // 最后修改的用户
    private User updateUser;

    ......

}
```

这样添加之后，这四个字段就不需要手动填充了，实体被创建或者修改的时候会被自动赋值。
用户内两个我没用过，但是时间这两个很方便。

这里应该也可以注册自己的监听器去处理更复杂的逻辑，等遇到这个需求的时候在展开研究。

弄得时候一直不生效，主要是因为没有添加这句`@EntityListeners(AuditingEntityListener.class)`
每个使用了这个特性的实体都要添加。
Stackoverflow 上有关于这个的讨论，地址在：
[http://stackoverflow.com/questions/29880911/how-to-configure-auditing-via-java-config-in-spring-data-and-spring-data-rest/29881314#29881314](http://stackoverflow.com/questions/29880911/how-to-configure-auditing-via-java-config-in-spring-data-and-spring-data-rest/29881314#29881314)
