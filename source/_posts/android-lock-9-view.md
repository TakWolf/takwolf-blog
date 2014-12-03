title: Android仿支付宝九宫格锁屏实现-Android Lock9View
date: 2014-12-02 21:32:06
categories: Android
tags: [Android,锁屏]
---

![Screenshot](/img/lock9view.png)

源代码已经托管于Github：[Android-Lock9View](https://github.com/TakWolf/Android-Lock9View)

如果你觉得诶哟不错，star一下作者会很开心的。





## Usage ##

### Layout ###

```xml
<com.takwolf.android.lock9.Lock9View
    android:id="@+id/lock_9_view"
    android:layout_width="match_parent"
    android:layout_height="wrap_content" />
```

### Activity ###

```java
Lock9View lock9View = (Lock9View) findViewById(R.id.lock_9_view);
lock9View.setCallBack(new CallBack() {
    @Override
    public void onFinish(String password) {
        Toast.makeText(MainActivity.this, password, Toast.LENGTH_SHORT).show();
    }
});
```


