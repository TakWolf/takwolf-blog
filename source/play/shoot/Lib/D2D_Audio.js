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
// D2D_音效类
//=======================================================
/**
 * D2D_音效类
 * @param file_url
 * @constructor
 */
function D2D_Audio(file_url) {
    //创建Audio标签
    this.audio = new Audio(file_url);
    this.audio.loop = false;//默认不循环播放
}

/**
 * 播放
 */
D2D_Audio.prototype.play = function() {
    this.audio.play();
};

/**
 * 暂停
 */
D2D_Audio.prototype.pause = function() {
    this.audio.pause();
};

/**
 * 停止
 */
D2D_Audio.prototype.stop = function() {
    //先暂停
    this.audio.pause();
    //线程不安全，需要判断
    if(this.audio.readyState == 4) {
        this.audio.currentTime = 0;//置播放位置为0
    }
};

/**
 * 重新加载音频
 */
D2D_Audio.prototype.reload = function(file_url) {
    this.audio.src = file_url;
    this.audio.load();
};

/**
 * 设置音量
 * 1为原音量，0为静音，不能超过1
 */
D2D_Audio.prototype.setVolume = function(volume) {
    this.audio.volume = volume;
};

/**
 * 获取音量
 */
D2D_Audio.prototype.getVolume = function() {
    return this.audio.volume;
};

/**
 * 是否循环
 */
D2D_Audio.prototype.isLoop = function() {
    return this.audio.loop;
};

/**
 * 设置是否循环
 * @param loop boolean值
 */
D2D_Audio.prototype.setLoop = function(loop) {
    this.audio.loop = loop;
};

/**
 * 取音频长度-时间为单位
 */
D2D_Audio.prototype.getTotalTime = function() {
    return this.audio.duration;
};

/**
 * 取当前播放时间
 */
D2D_Audio.prototype.getCurrentTime = function() {
    return this.audio.currentTime;
};

/**
 * 置当前播放时间-仅在就绪状态下使用
 */
D2D_Audio.prototype.setCurrentTime = function(currentTime) {
    this.audio.currentTime = currentTime;
};

/**
 * 取播放速度
 */
D2D_Audio.prototype.getSpeed = function() {
    return this.audio.playbackRate;
};

/**
 * 置播放速度
 * 1为不变
 */
D2D_Audio.prototype.setSpeed = function(speed) {
    this.audio.playbackRate = speed;
};

/**
 * 音频是否播放中
 */
D2D_Audio.prototype.isPlaying = function() {
    if(this.audio.paused == false) {
        return true;
    } else {
        return false;
    }
};

/**
 * 音频是否就绪
 */
D2D_Audio.prototype.isReady = function() {
    if(this.audio.readyState == 4) {
        return true;
    } else {
        return false;
    }
};

/**
 * 获取音频就绪状态代码
 * 0 = HAVE_NOTHING - 没有关于音频/视频是否就绪的信息
 * 1 = HAVE_METADATA - 关于音频/视频就绪的元数据
 * 2 = HAVE_CURRENT_DATA - 关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧/毫秒
 * 3 = HAVE_FUTURE_DATA - 当前及至少下一帧的数据是可用的
 * 4 = HAVE_ENOUGH_DATA - 可用数据足以开始播放
 */
D2D_Audio.prototype.getReadyStateCode = function() {
    return this.audio.readyState;
};

/**
 * 获取音频就绪状态信息
 */
D2D_Audio.prototype.getReadyState = function() {
    if(this.audio.readyState == 0) {
        return "HAVE_NOTHING";
    }
    else if(this.audio.readyState == 1) {
        return "HAVE_METADATA";
    }
    else if(this.audio.readyState == 2) {
        return "HAVE_CURRENT_DATA";
    }
    else if(this.audio.readyState == 3) {
        return "HAVE_FUTURE_DATA";
    }
    else if(this.audio.readyState == 4) {
        return "HAVE_ENOUGH_DATA";
    }
    else {
        return "READY_STATE_ERROR";
    }
};

/**
 * 销毁
 * 实际不执行销毁，该过程由jsGC管理器执行
 * 为保持接口统一，保留该函数
 */
D2D_Audio.prototype.dispose = function() {
    //标记为空
    this.audio.pause();
    this.audio = null;
};
