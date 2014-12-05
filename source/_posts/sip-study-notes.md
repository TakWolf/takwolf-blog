title: 【SIP协议学习笔记】早期记录
date: 2014-12-04 12:17:32
categories: sip
tags: [sip]
---
sip注册流程：

客户端请求 - CSeq: 1 REGISTER - 我要注册<br>
服务器返回 - 401 - 你没认证，不允许注册，添加你的认证信息再来<br>
客户度请求 - CSeq: 2 REGISTER - Authorization : Digest xxx<br>
服务器返回 - 200 OK<br>

实际过程中还出现个第三步

客户端请求 - CSeq: 1 SUBSCRIBE - 百度了好像是订阅<br>
服务器返回 - 202 -好像是已接受，但是还没处理<br>