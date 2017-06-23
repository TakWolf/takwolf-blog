//=======================================================
//
// EM-X for HTML5 Canvas - v0.0.3
//
// Powered by TakWolf - takgdx@gmail.com
// http://www.takgdx.com/emx-for-html5-canvas
//
//=======================================================
// -2013.10.17-
//=======================================================
// D2D_矩形盒
//=======================================================
/**
 * D2D_矩形盒
 * @param x 位置x
 * @param y 位置y
 * @param width 宽度
 * @param height 高度
 * @constructor
 */
function D2D_RectBox(x,y,width,height) {

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.originX = 0;
    this.originY = 0;

}

/**
 * 显示
 */
D2D_RectBox.prototype.draw = function(engine,color,lineWidth) {
    //取上下文
    var context = engine.getContext();
    //保存状态
    context.save();

    //如果有颜色选项
    if (color != undefined) {
        context.strokeStyle = color;
    } else {
        context.strokeStyle = "#0000FF";
    }
    //如果有边线宽度选项
    if (lineWidth != undefined) {
        context.lineWidth = lineWidth;
    } else {
        context.lineWidth = 1;
    }
    context.strokeRect(this.x-this.originX,this.y-this.originY,this.width,this.height);

    //恢复状态
    context.restore();
};

/**
 * 销毁
 * 实际不执行销毁，该过程由jsGC管理器执行
 * 为保持接口统一，保留该函数
 */
D2D_RectBox.prototype.dispose = function() {

    this.x = null;
    this.y = null;
    this.width = null;
    this.height = null;
    this.originX = null;
    this.originY = null;

};

/**
 * 置中心点
 */
D2D_RectBox.prototype.setOrigin = function(originX,originY) {
    this.originX = originX;
    this.originY = originY;
};

/**
 * 取中心点X
 */
D2D_RectBox.prototype.getOriginX = function() {
    return this.originX;
};

/**
 * 取中心点Y
 */
D2D_RectBox.prototype.getOriginY = function() {
    return this.originY;
};

/**
 * 取位置x
 */
D2D_RectBox.prototype.getPosX = function() {
    return this.x;
};

/**
 * 取位置y
 */
D2D_RectBox.prototype.getPosY = function() {
    return this.y;
};

/**
 * 取宽度
 */
D2D_RectBox.prototype.getWidth = function() {
    return this.width;
};

/**
 * 取高度
 */
D2D_RectBox.prototype.getHeight = function() {
    return this.height;
};

/**
 * 置位置
 */
D2D_RectBox.prototype.setPosition = function(x,y) {
    this.x = x;
    this.y = y;
};

/**
 * 置尺寸
 */
D2D_RectBox.prototype.setSize = function(width,height) {
    this.width = width;
    this.height = height;
};

/**
 * 检测点
 */
D2D_RectBox.prototype.testPoint = function(x,y) {
    return (
        x>=this.x-this.originX
        && x<=this.x-this.originX+this.width
        && y>=this.y-this.originY
        && y<=this.y-this.originY+this.height
    );
};

/**
 * 检测矩形
 */
D2D_RectBox.prototype.testRect = function(rectBox) {
    return (
        Math.abs((this.x-this.originX+this.width/2)-(rectBox.x-rectBox.originX+rectBox.width/2))
        <=this.width/2+rectBox.width/2
        && Math.abs((this.y-this.originY+this.height/2)-(rectBox.y-rectBox.originY+rectBox.height/2))
        <=this.height/2+rectBox.height/2
    );
};
