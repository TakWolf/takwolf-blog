---
title: Vue.js 中，动态生成的 {{{topic.html}}}，对其中的 img 标签绑定 onclick 事件
date: 2016-05-18 13:47:42
categories:
- 技术
- Vue.js
tags:
- Vue.js
---
该问题在 CNode 的求助帖：[https://cnodejs.org/topic/57389ad640b2969853981358](https://cnodejs.org/topic/57389ad640b2969853981358)
该问题在 segmentfault 的求助帖：[https://segmentfault.com/q/1010000005143113](https://segmentfault.com/q/1010000005143113)

总结笔记。

<!-- more -->

## 问题 ##

需求大概是这样的：

```
  <div id="page">
	  {{{topic.html}}}    
  </div>
```

```
var vm = new Vue({
    el: '#page',
    data: {
        topic: {}
    }
});
```

其中 topic.html 就是 html 字符串，可能会不断更新，每次更新之后，都要对其中的 img 标签绑定 onclick 事件，应该怎么做？

## 使用 jquery 批量绑定事件 ##

想到一个方法是用 jquery 来实现事件绑定：

```
vm.$watch('topic', function () {
	$('#page img').unbind('click').click(function () { // 需要解绑，否则会重复绑定事件
		// some...
	});
});
```

这里有两个问题：需要引入 jquery；必须监听数据变化，每次变化，又要重新解绑和绑定。

## 通过事件代理的方式来实现 ##

在 CNode 跟 segmentfault 发出求助之后，大家普遍推荐使用事件代理。

Vue.js 的事件绑定支持原生的 event 参数，因此可以通过下面代码来实现：

```
<div id="page" v-on:click="openImageProxy($event)">
    {{{topic.html}}}    
</div>

var vm = new Vue({
    el: '#page',
    data: {
        topic: {}
    },
    methods: {
        openImageProxy: function (event) {
            if (event.target.nodeName === 'IMG') {
                // event.target.src 这里做处理
            }
        }
    }
});
```

这其实就是对父节点进行事件监听，然后对符合要求的事件，手动传递到子节点。

这种方式发现一个问题就是，如果点击事件有动画效果的话，父节点的效果会触发，儿子节点不会。

## 后记 ##

其实严格来说，这并不是一个 Vue.js 的问题，而是一个 JavaScript 的事件绑定问题。
