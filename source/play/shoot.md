---
title: 【Canvas嵌入测试】打灰机游戏
date: 2014-12-09 22:18:00
---

<!-- create a canvas element and gave it an id -->
<canvas id="EMXCanvas" style="width: 50%">
不能玩的就换Chrome浏览器。
</canvas>

Markdown语法和Html是兼容的，所以博客还可以这样玩。

源代码在[这里](https://github.com/TakWolf/shoot)，你也可以在[这里](http://takwolf.com/game/shoot)玩。

上下左右键移动，就是这样。Have Fun~

<!-- load the core script -->
<script src="shoot/Lib/D2D_Engine.js"></script>
<script src="shoot/Lib/D2D_Engine_cn.js"></script>
<script src="shoot/Lib/D2D_Texture.js"></script>
<script src="shoot/Lib/D2D_Texture_cn.js"></script>
<script src="shoot/Lib/D2D_Sprite.js"></script>
<script src="shoot/Lib/D2D_Sprite_cn.js"></script>
<script src="shoot/Lib/D2D_Animation.js"></script>
<script src="shoot/Lib/D2D_Animation_cn.js"></script>
<script src="shoot/Lib/D2D_Font.js"></script>
<script src="shoot/Lib/D2D_Font_cn.js"></script>
<script src="shoot/Lib/D2D_Audio.js"></script>
<script src="shoot/Lib/D2D_Audio_cn.js"></script>
<script src="shoot/Lib/D2D_RectBox.js"></script>
<script src="shoot/Lib/D2D_RectBox_cn.js"></script>

<!-- load the ex script -->
<script src="shoot/Ext/keyboard.js"></script>

<!-- load the sys script -->
<script src="shoot/Sys/Background.js"></script>
<script src="shoot/Sys/Player.js"></script>
<script src="shoot/Sys/Bullet.js"></script>
<script src="shoot/Sys/Spark.js"></script>
<script src="shoot/Sys/Bomb.js"></script>
<script src="shoot/Sys/Enemy1.js"></script>
<script src="shoot/Sys/Enemy2.js"></script>
<script src="shoot/Sys/Enemy3.js"></script>
<script src="shoot/main.js"></script>
