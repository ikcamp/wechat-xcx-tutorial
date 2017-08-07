## <a>&sect; 视图与数据关联</a>
> 开始前请把 `/codes/ch3-3` 导入微信开发工具  

<br>

### 首先

首先我们要做的是什么呢？直接写模板逻辑吗？不是，给用户以良好的提示是很重要的，所以，我们要做的第一件事就是，加载中...

这里我们采用官方 `loading` 组件，所以现在就可以直接拿来用了。

修改 `index.wxml`，增加 `loading` 组件。很明显，变量 `hiddenLoading` 控制着它的展示与隐藏:
```html
<loading hidden="{{hiddenLoading}}">数据加载中</loading>
``` 

<br>

然后修改 index.js，处理 loading 组件的状态逻辑值 hiddenLoading 
```js
// 刚进入列表页面，就展示loading组件，数据加载完成后隐藏
onLoad (options) {
  this.setData({
    hiddenLoading: false
  })
  this.requestArticle()
},
// 列表渲染完成后，隐藏 loading组件
renderArticle (data) {
  if (data && data.length) {
    let newList = this.data.articleList.concat(data);
    this.setData({
	articleList: newList,
	hiddenLoading: true
    })
  }
}
```

### 分析页面结构

通过分析静态页面可以看出，这个列表是按照 **天** 为单位来分段，在每天的文章里又按照 **文章** 为单位继续细分。所以可以知道这个 `wxml` 的主体结构是循环套循环。所以我们可以初步写出下面的结构：

```html
<loading hidden="{{hiddenLoading}}">数据加载中</loading>
<view class="wrapper">
  <view wx:for="{{ articleList }}" wx:for-item="group" wx:key="{{ group.date }}" class="group">
    <view wx:for="{{ group }}" wx:for-item="item" wx:key="{{ item.contentId }}"></view>
  </view>
</view>
```  
<br>  

这里有一点需要 **注意**：在 `wxml` 做循环嵌套的时候，一定要重新定义 `wx:for-item` 字段。因为 `wxml` 循环中当前项的下标变量名默认为 `index`，当前项的变量名默认为 `item`。如果没有重新定义 `item`，在内层循环里通过 `item` 取到的值其实是外层循环的值。

> [官方 API - 列表渲染](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/list.html)

<br>    

下面我们就详细的分析下具体的结构，首先，每一天都有一个日期做开头，然后下面是一天的 4 篇文章。每篇文章分为左右结构，左边是标题，最多 3 行，超过的文字就用 … 表示。右边是一张文章的封面图，如果没有封面图就用默认的封面图。上面的日期如果是今天就显示今天，否则就直接显示月日，所以可以把 `wxml` 结构丰富成下面的样子：

```html
<loading hidden="{{hiddenLoading}}">数据加载中</loading>
<view class="wrapper">
    <!--repeat-->
    <view wx:for="{{ articleList }}" wx:for-item="group" wx:key="{{ group.date }}" class="group">
        <view class="group-bar">
            <view class="group-title {{ group.formateDate === '今日' ? 'on' : ''}}">{{ group.formateDate }}</view>
        </view>
        <view class="group-content">
            <!--repeat-->
            <view wx:for="{{ group.articles }}" wx:for-item="item" wx:key="{{ item.contentId }}" data-item="{{ item }}" class="group-content-item">
                <view class="group-content-item-desc ellipsis-multi-line ellipsis-line-3">{{ item.title }}</view>
                <image mode="aspectFill" class="group-content-item-img" src="{{ item.cover || defaultImg.coverImg }}" ></image>
            </view>
        </view>
    </view>
</view>
```  
<br>  

这里有一个图片处理的属性可以看看相应的 API 了解下：

> [官方 API - 图片处理](https://mp.weixin.qq.com/debug/wxadoc/dev/component/image.html)


<br>  

页面结构搭建完了吗？并没有，还有一件很重要的事情要做。当我们的所有内容都展示完了，我们要友好的提醒用户，所以需要在最底端加上一个提示，把这些交互考虑进去之后的 `wxml` 就是下面这样的：

```html
<!--index.wxml-->
<loading hidden="{{hiddenLoading}}">数据加载中</loading>
<view class="wrapper">
    <!--repeat-->
    <view wx:for="{{ articleList }}" wx:for-item="group" wx:key="{{ group.date }}" class="group">
        <view class="group-bar">
            <view class="group-title {{ group.formateDate === '今日' ? 'on' : ''}}">{{ group.formateDate }}</view>
        </view>
        <view class="group-content">
            <!--repeat-->
            <view wx:for="{{ group.articles }}" wx:for-item="item" wx:key="{{ item.contentId }}" data-item="{{ item }}" class="group-content-item">
                <view class="group-content-item-desc ellipsis-multi-line ellipsis-line-3">{{ item.title }}</view>
                <image mode="aspectFill" class="group-content-item-img" src="{{ item.cover || defaultImg.coverImg }}" ></image>
            </view>
        </view>
    </view>

    <view hidden="{{ hasMore }}" class="no-more">暂时没有更多内容</view>
</view>
```  
<br>  

到此，列表的页面与大体数据可以说是告一段落了，下一节我们介绍下如何增加阅读标识功能及分享功能、下拉更新功能  


<a href="../readme.md">返回大纲</a>  

<a href="./ch3-2.md">上一篇：列表 - 页面逻辑处理</a>

<a href="./ch3-4.md">下一篇：列表 - 阅读标识</a>
