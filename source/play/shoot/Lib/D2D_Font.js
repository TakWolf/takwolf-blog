//=======================================================
//
// EM-X for HTML5 Canvas - v0.0.2
//
// Powered by TakWolf - takgdx@gmail.com
// http://www.takgdx.com/emx-for-html5-canvas
//
//=======================================================
// -2013.10.3-
//=======================================================
// D2D_字体类
//=======================================================
/**
 * D2D_字体类
 * @param font_family 字体名称
 * @param font_size 字体大小
 * @param isBold 是否粗体
 * @param isItalic 是否斜体
 * @constructor
 */
function D2D_Font(font_family,font_size,isBold,isItalic) {

    /**
     * 字体属性
     */
    //斜体
    if(isItalic == true) {
        this.font_style = "italic";//斜体
    } else {
        this.font_style = "normal";//非斜体
    }
    //变形-小写体的大小字母
    this.font_variant = "normal";//不使用这个属性-但是保留生成值
    //粗体
    if(isBold == true) {
        this.font_weight = "bold";//粗体
    } else {
        this.font_weight = "normal";//非粗体
    }
    //字体大小
    this.font_size = font_size;
    //字体名称
    this.font_family = font_family;
    //行高-未使用
    //this.line_height;

    /**
     * 颜色
     */
    this.color = "#FFFFFF";//默认为白色
    this.lineWidth = 1;//线框宽度

    /**
     * 水平对齐和垂直对齐
     */
    this.horAlign = "start";//textAlign 属性
    this.verAlign = "top";//textBaseline 属性

    //中心点
    this.originX = 0;
    this.originY = 0;

}

/**
 * 显示
 */
D2D_Font.prototype.draw = function(engine,text,x,y,angle,scaleX,scaleY) {
    //取上下文
    var context = engine.getContext();
    //保存状态
    context.save();

    //颜色
    context.fillStyle = this.color;
    //字体属性
    context.font = ""
        + this.font_style + " "
        + this.font_variant + " "
        + this.font_weight + " "
        + this.font_size + " "
        + this.font_family;
    //对齐
    context.textAlign = this.horAlign;
    context.textBaseline = this.verAlign;

    //绘制文字-判断
    /**
     * 零点绘制
     * @param engine 引擎句柄
     * @param 绘制文本
     */
    if (arguments.length == 2) {
        context.fillText(text,0-this.originX,0-this.originY);
    }
    /**
     * 坐标点绘制
     * @param engine 引擎句柄
     * @param 绘制文本
     * @param x 显示位置x
     * @param y 显示位置y
     */
    else if (arguments.length == 4) {
        context.fillText(text,x-this.originX,y-this.originY);
    }
    /**
     * 高级绘制
     * @param engine 引擎句柄
     * @param 绘制文本
     * @param x 显示位置x
     * @param y 显示位置y
     * @param angle 旋转角度
     * @param scaleX 横向比例
     * @param scaleY 纵向比例
     */
    else if (arguments.length == 7) {
        context.translate(x,y);//移动到(x,y)
        context.rotate(angle);//旋转
        context.scale(scaleX,scaleY);//缩放
        context.fillText(text,0-this.originX,0-this.originY);
    }

    //恢复状态
    context.restore();
};

/**
 * 显示填充文字
 */
D2D_Font.prototype.drawFillText = D2D_Font.prototype.draw;

/**
 * 显示线框文字
 */
D2D_Font.prototype.drawStrokeText = function(engine,text,x,y,angle,scaleX,scaleY) {
    //取上下文
    var context = engine.getContext();
    //保存状态
    context.save();

    //颜色
    context.strokeStyle = this.color;
    context.lineWidth = this.lineWidth;
    //字体属性
    context.font = ""
        + this.font_style + " "
        + this.font_variant + " "
        + this.font_weight + " "
        + this.font_size + " "
        + this.font_family;
    //对齐
    context.textAlign = this.horAlign;
    context.textBaseline = this.verAlign;

    //绘制文字-判断
    /**
     * 零点绘制
     * @param engine 引擎句柄
     * @param 绘制文本
     */
    if (arguments.length == 2) {
        context.strokeText(text,0-this.originX,0-this.originY);
    }
    /**
     * 坐标点绘制
     * @param engine 引擎句柄
     * @param 绘制文本
     * @param x 显示位置x
     * @param y 显示位置y
     */
    else if (arguments.length == 4) {
        context.strokeText(text,x-this.originX,y-this.originY);
    }
    /**
     * 高级绘制
     * @param engine 引擎句柄
     * @param 绘制文本
     * @param x 显示位置x
     * @param y 显示位置y
     * @param angle 旋转角度
     * @param scaleX 横向比例
     * @param scaleY 纵向比例
     */
    else if (arguments.length == 7) {
        context.translate(x,y);//移动到(x,y)
        context.rotate(angle);//旋转
        context.scale(scaleX,scaleY);//缩放
        context.strokeText(text,0-this.originX,0-this.originY);
    }

    //恢复状态
    context.restore();
};

/**
 * 销毁
 * 实际不执行销毁，该过程由jsGC管理器执行
 * 为保持接口统一，保留该函数
 */
D2D_Font.prototype.dispose = function() {

    this.font_style = null;
    this.font_variant = null;
    this.font_weight = null;
    this.font_size = null;
    this.font_family = null;
    this.color = null;
    this.lineWidth = null;
    this.horAlign = null;
    this.verAlign = null;
    this.originX = null;
    this.originY = null;

};

/**
 * 获取字体名称
 */
D2D_Font.prototype.getFontFamily = function() {
    return this.font_family;
};

/**
 * 设置字体名称
 */
D2D_Font.prototype.setFontFamily = function(font_family) {
    this.font_family = font_family;
};

/**
 * 获取字体大小
 */
D2D_Font.prototype.getFontSize = function() {
    return this.font_size;
};

/**
 * 设置字体大小
 */
D2D_Font.prototype.setFontSize = function(font_size) {
    this.font_size = font_size;
};

/**
 * 是否粗体
 */
D2D_Font.prototype.isBold = function() {
    if(this.font_weight == "normal") {
        return false;
    } else {
        return true;
    }
};

/**
 * 设置粗体
 */
D2D_Font.prototype.setBold = function(isBold) {
    if(isBold == true) {
        this.font_weight = "bold";//粗体
    } else {
        this.font_weight = "normal";//非粗体
    }
};

/**
 * 是否斜体
 */
D2D_Font.prototype.isItalic = function() {
    if(this.font_style == "normal") {
        return false;
    } else {
        return true;
    }
};

/**
 * 设置斜体
 */
D2D_Font.prototype.setItalic = function(isItalic) {
    if(isItalic == true) {
        this.font_style = "italic";//斜体
    } else {
        this.font_style = "normal";//非斜体
    }
};

/**
 * 取颜色
 */
D2D_Font.prototype.getColor = function() {
    return this.color;
};

/**
 * 置颜色
 */
D2D_Font.prototype.setColor = function(color) {
    this.color = color;
};

/**
 * 取线框宽
 */
D2D_Font.prototype.getLineWidth = function() {
    return this.lineWidth;
};

/**
 * 置线框高
 */
D2D_Font.prototype.setLineWidth = function(lineWidth) {
    this.lineWidth = lineWidth;
};

/**
 * 置中心点
 */
D2D_Font.prototype.setOrigin = function(originX,originY) {
    this.originX = originX;
    this.originY = originY;
};

/**
 * 取中心点X
 */
D2D_Font.prototype.getOriginX = function() {
    return this.originX;
};

/**
 * 取中心点Y
 */
D2D_Font.prototype.getOriginY = function() {
    return this.originY;
};

/**
 * 取水平对齐方式
 */
D2D_Font.prototype.getHorAlign = function() {
    return this.horAlign;
};

/**
 * 置水平对齐方式
 * start  默认.文本在指定的位置开始。
 * end  文本在指定的位置结束。
 * center  文本的中心被放置在指定的位置。
 * left  文本左对齐。
 * right  文本右对齐。
 */
D2D_Font.prototype.setHorAlign = function(horAlign) {
    this.horAlign = horAlign;
};

/**
 * 取垂直对齐方式
 */
D2D_Font.prototype.getVerAlign = function() {
    return this.verAlign;
};

/**
 * 置垂直对齐方式
 * alphabetic  默认.文本基线是普通的字母基线。
 * top  文本基线是 em 方框的顶端。。
 * hanging  文本基线是悬挂基线。
 * middle  文本基线是 em 方框的正中。
 * ideographic  文本基线是表意基线。
 * bottom  文本基线是 em 方框的底端。
 */
D2D_Font.prototype.setVerAlign = function(verAlign) {
    this.verAlign = verAlign;
};
