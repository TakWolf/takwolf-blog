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
// D2D_动画类
//=======================================================
/**
 * D2D_动画类
 * @param texture 图片实例
 * @param horFrames 水平帧数
 * @param verFrames 垂直帧数
 * @param fps 帧率
 * @param srcX 截取顶点x
 * @param srcY 截取顶点y
 * @param srcWidth 截取宽度
 * @param srcHeight 截取高度
 */
function D2D_Animation(texture,horFrames,verFrames,fps,srcX,srcY,srcWidth,srcHeight) {

    /**
     * 纹理参数
     */
    this.texture = texture;
    this.srcX = srcX;
    this.srcY = srcY;
    this.srcWidth = srcWidth;
    this.srcHeight = srcHeight;

    /**
     * 动画逻辑
     */
    this.horFrames = horFrames;
    this.verFrames = verFrames;

    this.startX = srcX;//矩形偏移量
    this.startY = srcY;

    this.fps = fps;
    this.frameTime = 0;//帧时间积累

    /**
     * 中心点
     */
    this.originX = 0;
    this.originY = 0;
    /**
     * 透明度
     */
    this.alpha = 1;

}

/**
 * 更新
 */
D2D_Animation.prototype.update = function(deltaTime) {
    //帧时间开始积累
    this.frameTime += deltaTime;
    //时间大约帧延时
    if(this.frameTime >= 1/this.fps) {
        this.frameTime = 0;
        //纹理矩形移动逻辑
        this.srcX += this.srcWidth;
        //判断是否横行越界
        if (this.srcX > (this.horFrames-1)*this.srcWidth+this.startX) {
            this.srcX = this.startX;
            this.srcY += this.srcHeight;
            //判断是否纵向越界
            if (this.srcY > (this.verFrames-1)*this.srcHeight + this.startY) {
                this.srcY = this.startY;
            }
        }
    }
};

/**
 * 显示-重载
 */
D2D_Animation.prototype.draw = function(engine) {
    //取上下文
    var context = engine.getContext();
    //保存状态
    context.save();

    //设置透明度
    context.globalAlpha = this.alpha;

    /**
     * 渲染在(0,0)
     * @param engine 引擎句柄
     */
    if (arguments.length == 1) {
        context.drawImage(
            this.texture.getDrawHandle(),
            this.srcX,
            this.srcY,
            this.srcWidth,
            this.srcHeight,
            0-this.originX,
            0-this.originY,
            this.srcWidth,
            this.srcHeight
        );
    }
    /**
     * 渲染在(x,y)
     * @param engine 引擎句柄
     * @param x 显示位置x
     * @param y 显示位置y
     */
    else if (arguments.length == 3) {
        context.drawImage(
            this.texture.getDrawHandle(),
            this.srcX,
            this.srcY,
            this.srcWidth,
            this.srcHeight,
            arguments[1]-this.originX, //坐标X
            arguments[2]-this.originY,  //坐标Y
            this.srcWidth,
            this.srcHeight
        );
    }
    /**
     * 显示_范围缩放
     * @param engine 引擎句柄
     * @param x 显示位置x
     * @param y 显示位置y
     * @param scaleX 横向比例
     * @param scaleY 纵向比例
     */
    else if (arguments.length == 5) {
        //矩阵变换
        context.translate(arguments[1],arguments[2]);
        context.scale(arguments[3],arguments[4]);
        //绘制
        context.drawImage(
            this.texture.getDrawHandle(),
            this.srcX,
            this.srcY,
            this.srcWidth,
            this.srcHeight,
            0-this.originX,
            0-this.originY,
            this.srcWidth,
            this.srcHeight
        );
    }
    /**
     * @param engine 引擎句柄
     * @param x 显示位置x
     * @param y 显示位置y
     * @param angle 旋转角度
     * @param scaleX 横向比例
     * @param scaleY 纵向比例
     */
    else if (arguments.length == 6) {
        //矩阵变换
        context.translate(arguments[1],arguments[2]);
        context.rotate(arguments[3]);
        context.scale(arguments[4],arguments[5]);
        //绘制
        context.drawImage(
            this.texture.getDrawHandle(),
            this.srcX,
            this.srcY,
            this.srcWidth,
            this.srcHeight,
            0-this.originX,
            0-this.originY,
            this.srcWidth,
            this.srcHeight
        );
    }

    //恢复状态
    context.restore();
};

/**
 * 销毁
 * 实际不执行销毁，该过程由jsGC管理器执行
 * 为保持接口统一，保留该函数
 */
D2D_Animation.prototype.dispose = function() {

    this.texture = null;
    this.srcX = null;
    this.srcY = null;
    this.srcWidth = null;
    this.srcHeight = null;

    this.horFrames = null;
    this.verFrames = null;

    this.startX = null;
    this.startY = null;

    this.fps = null;
    this.frameTime = null;

    this.originX = null;
    this.originY = null;

};

/**
 * 置透明度
 * 范围为0-1
 */
D2D_Animation.prototype.setAlpha = function(alpha) {
    this.alpha = alpha;
};

/**
 * 取透明度
 */
D2D_Animation.prototype.getAlpha = function() {
    return this.alpha;
};

/**
 * 置中心点
 */
D2D_Animation.prototype.setOrigin = function(originX,originY) {
    this.originX = originX;
    this.originY = originY;
};

/**
 * 取中心点X
 */
D2D_Animation.prototype.getOriginX = function() {
    return this.originX;
};

/**
 * 取中心点Y
 */
D2D_Animation.prototype.getOriginY = function() {
    return this.originY;
};

/**
 * 取起始x
 */
D2D_Animation.prototype.getStartX = function() {
    return this.startX;
};

/**
 * 取起始y
 */
D2D_Animation.prototype.getStartY = function() {
    return this.startY;
};

/**
 * 取宽度
 */
D2D_Animation.prototype.getWidth = function() {
    return this.srcWidth;
};

/**
 * 取高度
 */
D2D_Animation.prototype.getHeight = function() {
    return this.srcHeight;
};

/**
 * 取纹理
 */
D2D_Animation.prototype.getTexture = function() {
    return this.texture;
};

/**
 * 置纹理
 */
D2D_Animation.prototype.setTexture = function(texture) {
    this.texture = texture;
};

/**
 * 重置动画
 */
D2D_Animation.prototype.reset = function() {
    this.srcX = this.startX;
    this.srcY = this.startY;
    this.frameTime = 0;//帧时间重置
};

/**
 * 取帧率
 */
D2D_Animation.prototype.getFps = function() {
    return this.fps;
};

/**
 * 置帧率
 */
D2D_Animation.prototype.setFps = function(fps) {
    this.fps = fps;
};

/**
 * 设置当前帧
 * 帧数从1开始
 * @param currentX 水平帧数
 * @param currentY 垂直帧数
 */
D2D_Animation.prototype.setCurrentFrame = function(currentX,currentY) {
    this.srcX = (currentX-1)*this.srcWidth+this.startX;
    this.srcY = (currentY-1)*this.srcHeight+this.startY;
    this.frameTime = 0;//帧时间重置
};

/**
 * 获取当前帧X
 */
D2D_Animation.prototype.getCurrentFrameX = function() {
    return ((this.srcX-this.startX)/this.srcWidth)+1;
};

/**
 * 获取当前帧y
 */
D2D_Animation.prototype.getCurrentFrameY = function() {
    return ((this.srcY-this.startY)/this.srcHeight)+1;
};

/**
 * 获取水平总帧数
 */
D2D_Animation.prototype.getHorFrames = function() {
    return this.horFrames;
};

/**
 * 获取垂直总帧数
 */
D2D_Animation.prototype.getVerFrames = function() {
    return this.verFrames;
};
