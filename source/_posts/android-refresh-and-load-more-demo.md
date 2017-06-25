---
title: Android 一种简单和优雅的方式实现下拉刷新和加载更多
date: 2017-06-15 00:00:00
categories:
- 技术
- Android
tags:
- Android
- 下拉刷新
- 加载更多
---
![](/img/android-refresh-and-load-more-demo-01.gif)

老生常谈的问题，但是发现很多人仍然将其视为难题。

很多实现也很复杂，有人甚至做了一个 SuperRefreshLayout 或者 SuperListView 或者 SuperRecyclerView 来实现。

其实不需要 Super，使用很少的简介的代码也可以实现。

最近做了个总结，尝试给出最佳实践。上面是效果图，支持 ListView 和 RecyclerView。

相关代码在这里：[https://github.com/TakWolf/Android-RefreshAndLoadMore-Demo](https://github.com/TakWolf/Android-RefreshAndLoadMore-Demo)

<!-- more -->

这个方案来源于我自己的开发实践，个人认为已接近最佳实践，简单且优雅。

要注意的是，这篇文章介绍的是如何用现有资源快速实现一个下拉刷新和加载更多分页效果，

而不是如何去实现或者自定义一个下拉刷新控件。那是另外一个话题，咱们改天再聊。

## 准备工作 ##

我们的原则是，尽可能使用现成的资源去实现。

即便如此，我们仍然使用了下面的第三方依赖，但是注意，这些依赖都不是必须的：

1.[Material-ish Progress](https://github.com/pnikosis/materialish-progress)

![](https://github.com/pnikosis/materialish-progress/raw/master/spinningwheel.gif)

一个可以兼容低版本的 Material Design 风格进度条样式。我希望可以保证所有版本的 Android 都要良好的 Material Design 体验。

这不是必须的，你可以替换为默认的进度条控件或者你自己的控件，除了样式之外，不会有其他问题。

2.[Android-HeaderAndFooterRecyclerView](https://github.com/TakWolf/Android-HeaderAndFooterRecyclerView)

这是我写的另外一个组件，它可以扩充 RecyclerView，让其支持 HeaderView 和 FooterView。我们在实现加载更多的时候需要这个特性。

这个组件使用非常简单，替换默认的 RecyclerView 就可以了。接口与 ListView 添加头部的方式类似。不需要修改其他任何东西（例如你的业务Adapter）。

仅此而已，非侵入式，没有额外的东西。

这不是必须的，你可以有你自己的方式实现这个功能。这不影响我们整篇文章的思路。但是我很推荐你去试试它，也许你会觉得不错呢。

3.[Butter Knife](https://github.com/JakeWharton/butterknife)

通过注解的方式快速实现控件绑定。

这不是必须的，你可以使用 findViewById()，效果是一样的。不过我推荐你去看看，真的很方便。

## 基本思路 ##

下拉刷新比较容易实现，因为 Android 官方的 support 组件中就实现了一个下拉刷新组件：SwipeRefreshLayout

支持 ListView 和 RecyclerView，符合 Material Design，使用简单，性能良好。

港真，除非你遇到一个变态的产品经理，否则有啥理由不使用这个呢？

下拉刷新的实现，大家的方式分歧比较大，很多人尝试在父布局上面下功夫。

我个人觉得最简单的实现是在列表的最后添加一个 FooterView，用它来显示加载动画。同时监听列表滚动，检测滑动到底部的时候，触发加载动作。

这样的好处是，不在需要复杂的去实现一个自定义控件（包括去实现那些复杂的手势处理），也没有一些特殊情况下的问题（比如首页加载不足一屏，我们下面会讲）。

## 关于 ListView ##

现在 RecyclerView 十分流行，但是有的时候我们可能还是需要用到 ListView 的。其实这无所谓，思路是一样的。

我对 ListView 做了一些小扩展，让他支持 addOnScrollListener 接口。

因为默认只有 setOnScrollListener，这表示我们只能设置一个监听器，我们不确定其他地方会不会也用到滚动监听，如果有的话就会造成冲突。

如果你确保不会造成冲突，你可以忽略这一部分的实现。你直接使用 setOnScrollListener 就好了。

实现非常简单，代码如下：

[ListView.java](https://github.com/TakWolf/Android-RefreshAndLoadMore-Demo/blob/master/app/src/main/java/com/takwolf/android/refreshandloadmore/demo/ui/widget/ListView.java)

``` Java
public class ListView extends android.widget.ListView {

    private final OnScrollListenerProxy onScrollListenerProxy = new OnScrollListenerProxy();

    public ListView(@NonNull Context context) {
        super(context);
        init();
    }

    public ListView(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public ListView(@NonNull Context context, @Nullable AttributeSet attrs, @AttrRes int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    public ListView(@NonNull Context context, @Nullable AttributeSet attrs, @AttrRes int defStyleAttr, @StyleRes int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init();
    }

    private void init() {
        super.setOnScrollListener(onScrollListenerProxy);
    }

    @Override
    @Deprecated
    public void setOnScrollListener(OnScrollListener listener) {
        onScrollListenerProxy.setOnScrollListener(listener);
    }

    public void addOnScrollListener(OnScrollListener listener) {
        onScrollListenerProxy.addOnScrollListener(listener);
    }

    public void removeOnScrollListener(OnScrollListener listener) {
        onScrollListenerProxy.removeOnScrollListener(listener);
    }

    public void clearOnScrollListeners() {
        onScrollListenerProxy.clearOnScrollListeners();
    }

    private static class OnScrollListenerProxy implements OnScrollListener {

        private OnScrollListener onScrollListener;
        private List<OnScrollListener> onScrollListenerList;

        @Override
        public void onScrollStateChanged(AbsListView view, int scrollState) {
            if (onScrollListener != null) {
                onScrollListener.onScrollStateChanged(view, scrollState);
            }
            if (onScrollListenerList != null && onScrollListenerList.size() > 0) {
                for (OnScrollListener onScrollListener : onScrollListenerList) {
                    onScrollListener.onScrollStateChanged(view, scrollState);
                }
            }
        }

        @Override
        public void onScroll(AbsListView view, int firstVisibleItem, int visibleItemCount, int totalItemCount) {
            if (onScrollListener != null) {
                onScrollListener.onScroll(view, firstVisibleItem, visibleItemCount, totalItemCount);
            }
            if (onScrollListenerList != null && onScrollListenerList.size() > 0) {
                for (OnScrollListener onScrollListener : onScrollListenerList) {
                    onScrollListener.onScroll(view, firstVisibleItem, visibleItemCount, totalItemCount);
                }
            }
        }

        void setOnScrollListener(OnScrollListener listener) {
            onScrollListener = listener;
        }

        void addOnScrollListener(OnScrollListener listener) {
            if (onScrollListenerList == null) {
                onScrollListenerList = new ArrayList<>();
            }
            onScrollListenerList.add(listener);
        }

        void removeOnScrollListener(OnScrollListener listener) {
            if (onScrollListenerList != null) {
                onScrollListenerList.remove(listener);
            }
        }

        void clearOnScrollListeners() {
            if (onScrollListenerList != null) {
                onScrollListenerList.clear();
            }
        }

    }

}
```

代理模式，对监听器做了一个代理。没什么复杂的地方。我觉得大家都应该看的懂。

要注意的是，你的布局XML中的控件引用，要引用这个类，而不是默认的 ListView。

## 关于 RecyclerView ##

默认 RecyclerView 并不支持添加 FooterView，因为我们需要一点微小的工作来扩展支持这个特性。

上面提到过，我们使用了 [Android-HeaderAndFooterRecyclerView](https://github.com/TakWolf/Android-HeaderAndFooterRecyclerView) 这个库。

使用方式大概是这样的：

``` Java
HeaderAndFooterRecyclerView recyclerView = (HeaderAndFooterRecyclerView) findViewById(R.id.recycler_view);
recyclerView.setLayoutManager(new LinearLayoutManager(context));
recyclerView.setAdapter(adapter);

View footerView = LayoutInflater.from(context).inflate(R.layout.footer, recyclerView.getFooterContainer(), false);
recyclerView.addFooterView(footerView);
```

非常简单对吗，跟 ListView 的使用方式是一样的。

简单明了不多余，我就喜欢这样的。

## 下拉刷新 SwipeRefreshLayout ##

我们复习一下下拉刷新的使用方法，先给出基本布局，使用 ListView 应该是这样的：

[activity_list_view.xml](https://github.com/TakWolf/Android-RefreshAndLoadMore-Demo/blob/master/app/src/main/res/layout/activity_list_view.xml)

``` XML
<android.support.v4.widget.SwipeRefreshLayout
    android:id="@+id/refresh_layout"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <com.takwolf.android.refreshandloadmore.demo.ui.widget.ListView
        android:id="@+id/list_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:listSelector="@android:color/transparent"
        android:cacheColorHint="@android:color/transparent"
        android:divider="@android:color/transparent" />

</android.support.v4.widget.SwipeRefreshLayout>
```

而 RecyclerView 应该是这样的：

[activity_recycler_view.xml](https://github.com/TakWolf/Android-RefreshAndLoadMore-Demo/blob/master/app/src/main/res/layout/activity_recycler_view.xml)

``` XML
<android.support.v4.widget.SwipeRefreshLayout
    android:id="@+id/refresh_layout"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <com.takwolf.android.hfrecyclerview.HeaderAndFooterRecyclerView
        android:id="@+id/recycler_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</android.support.v4.widget.SwipeRefreshLayout>
```

很简单对吗，将 SwipeRefreshLayout 作为父控件包裹你的列表控件，就可以了。我觉得大家都会用。

在代码中是这样的：

[ListViewDemoActivity.java](https://github.com/TakWolf/Android-RefreshAndLoadMore-Demo/blob/master/app/src/main/java/com/takwolf/android/refreshandloadmore/demo/ui/activity/ListViewDemoActivity.java)

``` Java
public class ListViewDemoActivity extends AppCompatActivity implements SwipeRefreshLayout.OnRefreshListener {

    // 一些其他的代码

    @BindView(R.id.refresh_layout)
    SwipeRefreshLayout refreshLayout;

    // 一些其他的代码

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_list_view);
        ButterKnife.bind(this);

        // 一些其他的代码

        refreshLayout.setColorSchemeResources(R.color.color_accent);
        refreshLayout.setOnRefreshListener(this);
        refreshLayout.setRefreshing(true);
        onRefresh();
    }

    @Override
    public void onRefresh() {
        // 这里用 handler 模拟了一个异步请求
        HandlerUtils.handler.postDelayed(new Runnable() {

              @Override
              public void run() {
                  refreshLayout.setRefreshing(false);
              }

        }, 1000);
    }

}
```

很简单，没啥陌生的东西，大家应该都是这么用的。

有几点注意：

1. 我们用了 Butter Knife 来绑定控件（@BindView、ButterKnife.bind），这不是必须的，你可以手动 findViewById

2. 我们直接在 onCreate 中就设置下拉刷新的状态为加载状态，并手动调用了 onRefresh 函数。之前的版本，如果直接在 onCreate 里面设置状态，动画是会有 BUG 的（进度指示器不显示），但是我目前使用最新版（support 25.3.1），似乎修复了这个问题，就不需要再去做兼容了。

下拉刷新就是这么简单。

## 加载更多 LoadMoreFooter ##

重点来了，大家注意。

加载更多要考虑的东西比较多，主要有这么几个：

### 滚动到底部的监听 ###

我们需要检测列表是否滚动到底部，如果滚动到底部，我们要触发加载更多的动作。

ListView 中我们这样去判断：

``` Java
// addOnScrollListener 这个接口是我们扩展的
listView.addOnScrollListener(new AbsListView.OnScrollListener() {

    @Override
    public void onScrollStateChanged(AbsListView view, int scrollState) {
        if (view.getLastVisiblePosition() == view.getCount() - 1) {
            // 原理：屏幕中最后显示的内个 item 是数据源位置的最后一个
            // 那么就说明已经滑动到底部了
        }
    }

    @Override
    public void onScroll(AbsListView view, int firstVisibleItem, int visibleItemCount, int totalItemCount) {
        if (view.getLastVisiblePosition() == view.getCount() - 1) {
            // 和上面同理
        }
    }

});
```

RecyclerView 中我们这样判断：

``` Java
recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {

    @Override
    public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
        if (!ViewCompat.canScrollVertically(recyclerView, 1)) {
            // ViewCompat 是 support 中提供的一个工具方法
            // ViewCompat.canScrollVertically(View v, int direction) 可以用来检测
            // 某个控件垂直方向上是不是可以继续滚动
            // 第二个参数 direction 如果 > 0，则检测的是向下的方向
            // 如果这个函数返回 false，就说明已经到底部了
        }
    }

    @Override
    public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
        if (!ViewCompat.canScrollVertically(recyclerView, 1)) {
            // 和上面同理
        }
    }

});
```

### 不同的状态 ###

我们仔细来考虑，加载更多其实有这么几种状态，分别为：

1. 不可用状态（STATE_DISABLED）：第一次下拉刷新还没成功的情况下，这时候是不能够加载更多的。

2. 可以触发加载的预备状态（STATE_ENDLESS）：这时如果监听滚动到底部，则触发加载。

3. 加载中（STATE_LOADING）：正在请求数据中，转菊花。

4. 加载失败了（STATE_FAILED）：网络错误或者啥错误，数据请求没成功。这里其实应该给一个类似“加载失败，点击重试”的文案，用户可以通过点击或者重新滚动到底部再次触发加载。

5. 加载完了，没有更多数据啦（STATE_FINISHED）：已经加载到最后一页了，之后没有数据了，也就不在需要触发加载更多了。

总体来说，基本上就上面5中状态，在网络请求结束的时候，我们根据情况，设置不同的状态。

### 代码实现 ###

考虑上面两个问题，给出下面的实现。

首先是布局：

[footer_load_more.xml](https://github.com/TakWolf/Android-RefreshAndLoadMore-Demo/blob/master/app/src/main/res/layout/footer_load_more.xml)

``` XML
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <com.pnikosis.materialishprogress.ProgressWheel
        android:id="@+id/progress_wheel"
        android:layout_width="32dp"
        android:layout_height="32dp"
        android:layout_gravity="center"
        android:layout_margin="16dp"
        android:visibility="invisible"
        app:matProg_barColor="?attr/colorAccent"
        app:matProg_progressIndeterminate="true"
        app:matProg_barWidth="3dp"
        tools:visibility="visible" />

    <TextView
        android:id="@+id/tv_text"
        android:layout_width="match_parent"
        android:layout_height="64dp"
        android:textColor="?android:attr/textColorSecondary"
        android:textSize="14sp"
        android:gravity="center"
        android:background="?attr/selectableItemBackground"
        android:visibility="invisible"
        tools:text="加载状态"
        tools:visibility="visible" />

</FrameLayout>
```

一个文本框，一个进度指示器，用这两个根据不同的状态显示不同的 UI 类型。

Footer 类这样实现：

[LoadMoreFooter.java](https://github.com/TakWolf/Android-RefreshAndLoadMore-Demo/blob/master/app/src/main/java/com/takwolf/android/refreshandloadmore/demo/ui/viewholder/LoadMoreFooter.java)

``` Java
public class LoadMoreFooter {

    public static final int STATE_DISABLED = 0;
    public static final int STATE_LOADING = 1;
    public static final int STATE_FINISHED = 2;
    public static final int STATE_ENDLESS = 3;
    public static final int STATE_FAILED = 4;

    @IntDef({STATE_DISABLED, STATE_LOADING, STATE_FINISHED, STATE_ENDLESS, STATE_FAILED})
    @Retention(RetentionPolicy.SOURCE)
    public @interface State {}

    public interface OnLoadMoreListener {

        void onLoadMore();

    }

    @BindView(R.id.progress_wheel)
    ProgressWheel progressWheel;

    @BindView(R.id.tv_text)
    TextView tvText;

    @State
    private int state = STATE_DISABLED;

    private final OnLoadMoreListener loadMoreListener;

    public LoadMoreFooter(@NonNull Context context, @NonNull HeaderAndFooterRecyclerView recyclerView, @NonNull OnLoadMoreListener loadMoreListener) {
        this.loadMoreListener = loadMoreListener;
        View footerView = LayoutInflater.from(context).inflate(R.layout.footer_load_more, recyclerView.getFooterContainer(), false);
        recyclerView.addFooterView(footerView);
        ButterKnife.bind(this, footerView);
        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {

            @Override
            public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
                if (!ViewCompat.canScrollVertically(recyclerView, 1)) {
                    checkLoadMore();
                }
            }

            @Override
            public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
                if (!ViewCompat.canScrollVertically(recyclerView, 1)) {
                    checkLoadMore();
                }
            }

        });
    }

    public LoadMoreFooter(@NonNull Context context, @NonNull ListView listView, @NonNull OnLoadMoreListener loadMoreListener) {
        this.loadMoreListener = loadMoreListener;
        View footerView = LayoutInflater.from(context).inflate(R.layout.footer_load_more, listView, false);
        listView.addFooterView(footerView, null, false);
        ButterKnife.bind(this, footerView);
        listView.addOnScrollListener(new AbsListView.OnScrollListener() {

            @Override
            public void onScrollStateChanged(AbsListView view, int scrollState) {
                if (view.getLastVisiblePosition() == view.getCount() - 1) {
                    checkLoadMore();
                }
            }

            @Override
            public void onScroll(AbsListView view, int firstVisibleItem, int visibleItemCount, int totalItemCount) {
                if (view.getLastVisiblePosition() == view.getCount() - 1) {
                    checkLoadMore();
                }
            }

        });
    }

    @State
    public int getState() {
        return state;
    }

    public void setState(@State int state) {
        if (this.state != state) {
            this.state = state;
            switch (state) {
                case STATE_DISABLED:
                    progressWheel.setVisibility(View.INVISIBLE);
                    progressWheel.stopSpinning();
                    tvText.setVisibility(View.INVISIBLE);
                    tvText.setText(null);
                    tvText.setClickable(false);
                    break;
                case STATE_LOADING:
                    progressWheel.setVisibility(View.VISIBLE);
                    progressWheel.spin();
                    tvText.setVisibility(View.INVISIBLE);
                    tvText.setText(null);
                    tvText.setClickable(false);
                    break;
                case STATE_FINISHED:
                    progressWheel.setVisibility(View.INVISIBLE);
                    progressWheel.stopSpinning();
                    tvText.setVisibility(View.VISIBLE);
                    tvText.setText(R.string.load_more_finished);
                    tvText.setClickable(false);
                    break;
                case STATE_ENDLESS:
                    progressWheel.setVisibility(View.INVISIBLE);
                    progressWheel.stopSpinning();
                    tvText.setVisibility(View.VISIBLE);
                    tvText.setText(null);
                    tvText.setClickable(true);
                    break;
                case STATE_FAILED:
                    progressWheel.setVisibility(View.INVISIBLE);
                    progressWheel.stopSpinning();
                    tvText.setVisibility(View.VISIBLE);
                    tvText.setText(R.string.load_more_failed);
                    tvText.setClickable(true);
                    break;
                default:
                    throw new AssertionError("Unknow load more state.");
            }
        }
    }

    private void checkLoadMore() {
        if (getState() == STATE_ENDLESS || getState() == STATE_FAILED) {
            setState(STATE_LOADING);
            loadMoreListener.onLoadMore();
        }
    }

    @OnClick(R.id.tv_text)
    void onBtnTextClick() {
        checkLoadMore();
    }

}
```

有了上面的铺垫，这里的代码就很容易看懂了。

有几点注意：

1. 5中状态的声明中，我们没有使用枚举，而是定义了一个 @interface state，这是 Google 推荐的方式，Android 中这种方式比枚举性能更好。这里你使用枚举也是可以的。

2. 我们定义了两个构造函数，分别对应 ListView 和 RecyclerView 两种控件。你可以根据你的情况去调整。

3. 我们在滚动监听中，在 onScroll 和 onScrollStateChanged 回调都做了加载检测，你可以选择只做其中一个监听。我知道你可能会担心性能问题，实际上哪里只是一个判断，而判断是不消耗时间复杂度的。

4. 默认的状态为 STATE_DISABLED，因为通常来说应该是先调用下拉刷新，下拉刷新成功之后，才可以加载更多。

另外，setState(@State int state) 是用来切换布局状态的，你在这里变更你的布局状态。

上面的 UI 样式只是一个示例，你可以根据你的喜好自己调整，思路都是相同的。

### 如何使用 ###

因为要考虑状态切换的不同情况，这里也包含下拉刷新回调的逻辑处理，下面给出完整的代码。

首先是 ListView 的情况：

[ListViewDemoActivity.java](https://github.com/TakWolf/Android-RefreshAndLoadMore-Demo/blob/master/app/src/main/java/com/takwolf/android/refreshandloadmore/demo/ui/activity/ListViewDemoActivity.java)

``` Java
public class ListViewDemoActivity extends AppCompatActivity implements SwipeRefreshLayout.OnRefreshListener, LoadMoreFooter.OnLoadMoreListener {

    private static final int PAGE_SIZE = 20;
    private static final int TOTAL_COUNT = 200;

    @BindView(R.id.refresh_layout)
    SwipeRefreshLayout refreshLayout;

    @BindView(R.id.list_view)
    ListView listView;

    private LoadMoreFooter loadMoreFooter;
    private IllustListAdapter2 adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_list_view);
        ButterKnife.bind(this);

        loadMoreFooter = new LoadMoreFooter(this, listView, this); // 这里初始化加载更多

        adapter = new IllustListAdapter2(this);
        listView.setAdapter(adapter);

        refreshLayout.setColorSchemeResources(R.color.color_accent);
        refreshLayout.setOnRefreshListener(this);
        refreshLayout.setRefreshing(true);
        onRefresh();
    }

    @Override
    public void onRefresh() {
        HandlerUtils.handler.postDelayed(new Runnable() {

            @Override
            public void run() {
                adapter.getIllustList().clear();
                adapter.getIllustList().addAll(IllustClient.buildIllustList(PAGE_SIZE));
                adapter.notifyDataSetChanged();
                refreshLayout.setRefreshing(false);
                loadMoreFooter.setState(LoadMoreFooter.STATE_ENDLESS); // 别忘了启用加载更多
            }

        }, 1000);
    }

    @Override
    public void onLoadMore() {
        HandlerUtils.handler.postDelayed(new Runnable() {

            @Override
            public void run() {
                adapter.getIllustList().addAll(IllustClient.buildIllustList(PAGE_SIZE));
                adapter.notifyDataSetChanged();
                loadMoreFooter.setState(adapter.getCount() >= TOTAL_COUNT ? LoadMoreFooter.STATE_FINISHED : LoadMoreFooter.STATE_ENDLESS);
            }

        }, 1000);
    }

}
```

RecyclerView 的使用方式是相同的：

[RecyclerViewDemoActivity.java](https://github.com/TakWolf/Android-RefreshAndLoadMore-Demo/blob/master/app/src/main/java/com/takwolf/android/refreshandloadmore/demo/ui/activity/RecyclerViewDemoActivity.java)

``` Java
public class RecyclerViewDemoActivity extends AppCompatActivity implements SwipeRefreshLayout.OnRefreshListener, LoadMoreFooter.OnLoadMoreListener {

    private static final int PAGE_SIZE = 20;
    private static final int TOTAL_COUNT = 200;

    @BindView(R.id.refresh_layout)
    SwipeRefreshLayout refreshLayout;

    @BindView(R.id.recycler_view)
    HeaderAndFooterRecyclerView recyclerView;

    private LoadMoreFooter loadMoreFooter;
    private IllustListAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_recycler_view);
        ButterKnife.bind(this);

        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        loadMoreFooter = new LoadMoreFooter(this, recyclerView, this); // 这里初始化加载更多

        adapter = new IllustListAdapter(this);
        recyclerView.setAdapter(adapter);

        refreshLayout.setColorSchemeResources(R.color.color_accent);
        refreshLayout.setOnRefreshListener(this);
        refreshLayout.setRefreshing(true);
        onRefresh();
    }

    @Override
    public void onRefresh() {
        HandlerUtils.handler.postDelayed(new Runnable() {

            @Override
            public void run() {
                adapter.getIllustList().clear();
                adapter.getIllustList().addAll(IllustClient.buildIllustList(PAGE_SIZE));
                adapter.notifyDataSetChanged();
                refreshLayout.setRefreshing(false);
                loadMoreFooter.setState(LoadMoreFooter.STATE_ENDLESS); // 别忘了启用加载更多
            }

        }, 1000);
    }

    @Override
    public void onLoadMore() {
        HandlerUtils.handler.postDelayed(new Runnable() {

            @Override
            public void run() {
                int startPosition = adapter.getItemCount();
                adapter.getIllustList().addAll(IllustClient.buildIllustList(PAGE_SIZE));
                adapter.notifyItemRangeInserted(startPosition, PAGE_SIZE);
                loadMoreFooter.setState(adapter.getItemCount() >= TOTAL_COUNT ? LoadMoreFooter.STATE_FINISHED : LoadMoreFooter.STATE_ENDLESS);
            }

        }, 1000);
    }

}
```

上面的网络请求是模拟的，没有网络错误的情况，因此，我也用知乎日报的真实接口，写了一个例子：（感谢知乎提供接口）

[ZhihuDemoActivity.java](https://github.com/TakWolf/Android-RefreshAndLoadMore-Demo/blob/master/app/src/main/java/com/takwolf/android/refreshandloadmore/demo/ui/activity/ZhihuDemoActivity.java)

``` Java
public class ZhihuDemoActivity extends AppCompatActivity implements SwipeRefreshLayout.OnRefreshListener, LoadMoreFooter.OnLoadMoreListener {

    @BindView(R.id.refresh_layout)
    SwipeRefreshLayout refreshLayout;

    @BindView(R.id.recycler_view)
    HeaderAndFooterRecyclerView recyclerView;

    private LoadMoreFooter loadMoreFooter;
    private StoryListAdapter adapter;

    private String date = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_recycler_view);
        ButterKnife.bind(this);

        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        loadMoreFooter = new LoadMoreFooter(this, recyclerView, this);
        new PaddingHeader(this, recyclerView);
        new PaddingFooter(this, recyclerView);

        adapter = new StoryListAdapter(this);
        recyclerView.setAdapter(adapter);

        refreshLayout.setColorSchemeResources(R.color.color_accent);
        refreshLayout.setOnRefreshListener(this);
        refreshLayout.setRefreshing(true);
        onRefresh();
    }

    @Override
    public void onRefresh() {
        ZhihuClient.service.getLatestStoryList().enqueue(new CallbackWrapper<StoryPage>() {

            @Override
            public void onDataOk(StoryPage data) {
                date = data.getDate();
                adapter.getStoryList().clear();
                adapter.getStoryList().addAll(data.getStoryList());
                adapter.notifyDataSetChanged();
                refreshLayout.setRefreshing(false);
                loadMoreFooter.setState(LoadMoreFooter.STATE_ENDLESS);
            }

            @Override
            public void onKindsOfError(@NonNull String message) {
                ToastUtils.with(ZhihuDemoActivity.this).show(message);
                refreshLayout.setRefreshing(false);
            }

        });
    }

    @Override
    public void onLoadMore() {
        ZhihuClient.service.getStoryListBefore(date).enqueue(new CallbackWrapper<StoryPage>() {

            @Override
            public void onDataOk(StoryPage data) {
                date = data.getDate();
                int startPosition = adapter.getItemCount();
                adapter.getStoryList().addAll(data.getStoryList());
                adapter.notifyItemRangeInserted(startPosition, data.getStoryList().size());
                loadMoreFooter.setState(LoadMoreFooter.STATE_ENDLESS);
            }

            @Override
            public void onKindsOfError(@NonNull String message) {
                ToastUtils.with(ZhihuDemoActivity.this).show(message);
                loadMoreFooter.setState(LoadMoreFooter.STATE_FAILED); // 加载失败了给错误状态
            }

        });
    }

}
```

很简单，对吧，下拉刷新的功能就有了。

开瓶可乐，庆祝一下。

## 一些问题 ##

这里有一些小问题，还好它们都可以解决，但是你还需要注意一下。

### 第一次请求数据填充不足一屏 ###

确实有这种情况，这可能造成问题。我模拟了一个例子，代码在这里：

[RecyclerViewNotFullDemoActivity.java](https://github.com/TakWolf/Android-RefreshAndLoadMore-Demo/blob/master/app/src/main/java/com/takwolf/android/refreshandloadmore/demo/ui/activity/RecyclerViewNotFullDemoActivity.java)

运行起来，效果是这样的：

![](/img/android-refresh-and-load-more-demo-02.gif)

如果数据不足一屏，会自动再次触发加载更多。

原因，ListView 和 RecyclerView，如果 Adapter 数据发送了变化，会自动触发一次 OnScrollListener 监听。

这时，因为数据不足一屏，自然也是列表滚动到底部的情况，自然也会触发下拉刷新。

我觉得这个行为挺好的。这是默认行为，而且看起来也不错。至少我想不出更好的方案。

因此，虽然有这种情况，但其实不需要做特殊处理。

### RecyclerView 边界滚动检测 BUG ###

这是我偶然发现的一个问题，必须是使用 RecyclerView 的情况下才会出现。

具体表现为：

如果列表第一个 Item 存在，但是高度为 0px，下拉刷新（SwipeRefreshLayout）无法触发；

如果列表最后一个 Item 存在，但是高度为 0px，底部滚动检测会失败。

其实就是 ViewCompat.canScrollVertically 这个函数存在问题（SwipeRefreshLayout 底层边界检测实现用的也是这个函数）。

如果边界 Item 高度为 0px，其实已经滚动到边界了，但是 ViewCompat.canScrollVertically 仍然会返回 true（可以滑动），造成逻辑错误。

你可以自己去实验一下。

你可能注意到，上面 LoadMoreFooter 中，我隐藏布局使用的是 View.INVISIBLE 而不是 View.GONE，就是为了避免这个问题。

两者都可以隐藏控件，区别是 View.INVISIBLE 会保留占用空间，View.GONE 不会。

因此使用 View.INVISIBLE 就可以避免高度变成 0px。

总之目前是有这个 BUG，不确定之后 Google 会不会修复他。现阶段你还是要注意一下这个问题。

## 完结 ##

有些时候，其实不需要很复杂的东西。

简简单单，也是一种哲学。
