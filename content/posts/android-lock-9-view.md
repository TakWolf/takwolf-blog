---
title: Android 九宫格锁屏布局 - Android Lock9View
description: 如题
date: 2014-12-02T21:32:06+08:00
categories:
- 技术
- Android
tags:
- Android
- 自定义View
---

![Screenshot](images/lock9view.png)

最近项目要实现一个类似支付宝类似需求的锁屏需求，找的一些第三方实现或多或少都有些问题。
这个功能实现起来不是很困难，于是就参看了一些例子，自己做了一个。

源代码已经托管于Github：[Android-Lock9View](https://github.com/TakWolf/Android-Lock9View)

## 思路

创建一个自定义 View 继承自 ViewGroup，用9个子 View 表现节点，在 onDraw 中绘制线段。

## 代码

废话不多说，Lock9View.java

``` Java
/*
 * Copyright 2015-2016 TakWolf
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.takwolf.android.lock9;

import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Paint.Style;
import android.graphics.drawable.Drawable;
import android.util.AttributeSet;
import android.util.Pair;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;

import java.util.ArrayList;
import java.util.List;

public class Lock9View extends ViewGroup {

    /**
     * 节点相关定义
     */
    private List<Pair<NodeView, NodeView>> lineList = new ArrayList<Pair<NodeView,NodeView>>(); // 已经连线的节点链表
    private NodeView currentNode; // 最近一个点亮的节点，null表示还没有点亮任何节点
    private float x; // 当前手指坐标x
    private float y; // 当前手指坐标y

    /**
     * 自定义属性列表
     */
    private Drawable nodeSrc;
    private Drawable nodeOnSrc;
    private int lineColor;
    private float lineWidth;
    private float padding; // 内边距
    private float spacing; // 节点间隔距离

    /**
     * 画线用的画笔
     */
    private Paint paint;

    /**
     * 密码构建器
     */
    private StringBuilder passwordBuilder = new StringBuilder();

    /**
     * 结果回调监听器接口
     */
    private CallBack callBack;

    public interface CallBack {

        public void onFinish(String password);

    }

    public void setCallBack(CallBack callBack) {
        this.callBack = callBack;
    }

    /**
     * 构造函数
     */
    public Lock9View(Context context) {
        this(context, null);
    }

    public Lock9View(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public Lock9View(Context context, AttributeSet attrs, int defStyleAttr) {
        this(context, attrs, defStyleAttr, 0);
    }

    public Lock9View(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr); // TODO 这个构造函数在api21以上版本才可用
        initFromAttributes(attrs, defStyleAttr);
    }

    /**
     * 初始化
     */
    private void initFromAttributes(AttributeSet attrs, int defStyleAttr) {
        // 获取定义的属性
        final TypedArray a = getContext().obtainStyledAttributes(attrs, R.styleable.Lock9View, defStyleAttr, 0);

        nodeSrc = a.getDrawable(R.styleable.Lock9View_lock9_nodeSrc);
        nodeOnSrc = a.getDrawable(R.styleable.Lock9View_lock9_nodeOnSrc);
        lineColor = a.getColor(R.styleable.Lock9View_lock9_lineColor, Color.argb(0, 0, 0, 0));
        lineWidth = a.getDimension(R.styleable.Lock9View_lock9_lineWidth, 0);
        padding = a.getDimension(R.styleable.Lock9View_lock9_padding, 0);
        spacing = a.getDimension(R.styleable.Lock9View_lock9_spacing, 0);

        a.recycle();

        // 初始化画笔
        paint = new Paint(Paint.DITHER_FLAG);
        paint.setStyle(Style.STROKE);
        paint.setStrokeWidth(lineWidth);
        paint.setColor(lineColor);
        paint.setAntiAlias(true); // 抗锯齿

        // 构建node
        for (int n = 0; n < 9; n++) {
            NodeView node = new NodeView(getContext(), n + 1);
            addView(node);
        }

        // 清除FLAG，否则 onDraw() 不会调用，原因是 ViewGroup 默认透明背景不需要调用 onDraw()
        setWillNotDraw(false);
    }

    /**
     * TODO 我们让高度等于宽度 - 这么使用不清楚是否正确
     */
    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        setMeasuredDimension(widthMeasureSpec, widthMeasureSpec);
    }

    /**
     * 在这里进行node的布局
     */
    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        if (changed) {
            int nodeWidth = (int) ((right - left - padding * 2 - spacing * 2) / 3);
            for (int n = 0; n < 9; n++) {
                NodeView node = (NodeView) getChildAt(n);
                // 获取3*3宫格内坐标
                int row = n / 3;
                int col = n % 3;
                // 计算实际的坐标，要包括内边距和分割边距
                int l = (int) (padding + col * (nodeWidth + spacing));
                int t = (int) (padding + row * (nodeWidth + spacing));
                int r = l + nodeWidth;
                int b = t + nodeWidth;
                node.layout(l, t, r, b);
            }
        }
    }

    /**
     * 在这里处理手势
     */
    @Override
    public boolean onTouchEvent(MotionEvent event) {
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
            case MotionEvent.ACTION_MOVE:
                x = event.getX(); // 这里要实时记录手指的坐标
                y = event.getY();
                NodeView nodeAt = getNodeAt(x, y);
                if (currentNode == null) { // 之前没有点
                    if (nodeAt != null) { // 第一个点
                        currentNode = nodeAt;
                        currentNode.setHighLighted(true);
                        passwordBuilder.append(currentNode.getNum());
                        invalidate();  // 通知重绘
                    }
                } else { // 之前有点-所以怎么样都要重绘
                    if (nodeAt != null && !nodeAt.isHighLighted()) { // 当前碰触了新点
                        nodeAt.setHighLighted(true);
                        Pair<NodeView, NodeView> pair = new Pair<NodeView, NodeView>(currentNode, nodeAt);
                        lineList.add(pair);
                        // 赋值当前的node
                        currentNode = nodeAt;
                        passwordBuilder.append(currentNode.getNum());
                    }
                    invalidate(); // 通知重绘
                }
                break;
            case MotionEvent.ACTION_UP:
                if (passwordBuilder.length() > 0) { // 有触摸点
                    // 回调结果
                    if (callBack != null) {
                        callBack.onFinish(passwordBuilder.toString());
                    }
                    // 清空状态
                    lineList.clear();
                    currentNode = null;
                    passwordBuilder.setLength(0);
                    // 清除高亮
                    for (int n = 0; n < getChildCount(); n++) {
                        NodeView node = (NodeView) getChildAt(n);
                        node.setHighLighted(false);
                    }
                    // 通知重绘
                    invalidate();
                }
                break;
        }
        return true;
    }

    /**
     * 系统绘制回调-主要绘制连线
     */
    @Override
    protected void onDraw(Canvas canvas) {
        // 先绘制已有的连线
        for (Pair<NodeView, NodeView> pair : lineList) {
            canvas.drawLine(pair.first.getCenterX(), pair.first.getCenterY(), pair.second.getCenterX(), pair.second.getCenterY(), paint);
        }
        // 如果已经有点亮的点，则在点亮点和手指位置之间绘制连线
        if (currentNode != null) {
            canvas.drawLine(currentNode.getCenterX(), currentNode.getCenterY(), x, y, paint);
        }
    }

    /**
     * 获取给定坐标点的Node，返回null表示当前手指在两个Node之间
     */
    private NodeView getNodeAt(float x, float y) {
        for (int n = 0; n < getChildCount(); n++) {
            NodeView node = (NodeView) getChildAt(n);
            if (!(x >= node.getLeft() && x < node.getRight())) {
                continue;
            }
            if (!(y >= node.getTop() && y < node.getBottom())) {
                continue;
            }
            return node;
        }
        return null;
    }

    /**
     * 结点描述类
     */
    private class NodeView extends View {

        private int num;
        private boolean highLighted = false;

        public NodeView(Context context, int num) {
            super(context);
            this.num = num;
            setBackgroundDrawable(nodeSrc);
        }

        public boolean isHighLighted() {
            return highLighted;
        }

        public void setHighLighted(boolean highLighted) {
            if (this.highLighted != highLighted) {
                this.highLighted = highLighted;
                setBackgroundDrawable(highLighted ? nodeOnSrc : nodeSrc);
            }
        }

        public int getCenterX() {
            return (getLeft() + getRight()) / 2;
        }

        public int getCenterY() {
            return (getTop() + getBottom()) / 2;
        }

        public int getNum() {
            return num;
        }

    }

}
```

需要注意的几点：

- 初始化中调用 setWillNotDraw(false) ，否则 onDraw() 函数是不会被调用的。原因是ViewGroup本身就是容器控件，大多情况下是透明的，因此调用 onDraw() 没有意义，除非你给他设置一个背景色。这种做法可以提高渲染性能。但是这样的话我们就没办法在 onDraw() 中绘制手势了。使用 setWillNotDraw(false) 可以清除这个FLAG

-  onMeasure 和 onLayout 分别用来控制自身控件尺寸和子控件渲染方式。上面的实现中控件高度永远是等于宽度的，因此需要在 onMeasure 中调用 setMeasuredDimension(widthMeasureSpec, widthMeasureSpec) 让宽高相等

-  onDraw 函数并不是每一帧都调用的，在状态改变之后要调用 invalidate() 通知系统更新视图

## 用法

使用十分简单。布局中这样写：

``` XML
<com.takwolf.android.lock9.Lock9View
    android:id="@+id/lock_9_view"
    android:layout_width="match_parent"
    android:layout_height="wrap_content" />
```

Activity中这样写：

``` Java
Lock9View lock9View = (Lock9View) findViewById(R.id.lock_9_view);
lock9View.setCallBack(new CallBack() {
    @Override
		public void onFinish(String password) {
			  Toast.makeText(MainActivity.this, password, Toast.LENGTH_SHORT).show();
		}
});
```

以上。
