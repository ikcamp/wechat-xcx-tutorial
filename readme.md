# 第三章：小程序中级实战教程之列表篇

<br>

## &sect; 列表 - 开发准备

> 开始前请把 `ch3-1` 分支中的 `code/` 目录导入微信开发工具  
> 这一章主要会教大家如何用小程序制作一个可以无限加载的列表。希望大家能通过这个例子掌握制作各种列表的原理。  

<br>  

### 无限列表加载的原理  
其实所谓的无限列表就是将所有的数据分成一页一页的展示给用户看。我们每次只请求一页数据。当我们判断用户阅读完了这一页之后，立马请求下一页的数据，然后渲染出来给用户看，这样在用户看来，就感觉一直有内容可看。

当然，这其中很重要的一点就是，涉及到请求就肯定会有等待，处理好请求时的 **加载状态**，给用户以良好的体验也是非常重要的，否则如果网络状况不佳，而且没有给用户提示程序正在努力加载的话，用户很容易就以为他看完了，或者程序死掉了。

<br>  

### 我们的列表所提供的功能  
1. 静默加载
2. 标记已读
3. 提供分享

<br>  

### 涉及的核心技术和 API  
1. wx:for 的用法
2. onReachBottom 的用法
3. wx.storage 的用法
4. wx.request 的用法
5. Promise
6. onShareAppMessage 的用法

<br>  

我们将正式投入开发中，在这之前，我们修改 `app.json` 文件，并修改如下：  
1. 修改 `pages` 字段，为小程序增加页面配置
2. 修改 `window` 字段，调整小程序的头部样式，也就是 `navigationBar` 

```json
{
  "pages":[
    "pages/index/index",
    "pages/detail/detail"
  ],
  "window":{
    "backgroundTextStyle":"light",
    "navigationBarBackgroundColor": "#4abb3b",
    "navigationBarTitleText": "iKcamp英语学习",
    "backgroundColor": "#f8f8f8",
    "navigationBarTextStyle":"white"
  },
  "netWorkTimeout": {
    "request": 10000,
    "connectSocket": 10000,
    "uploadFile": 10000,
    "downloadFile": 10000
  },
  "debug": true
}
```  
<br>  

现在准备工作已经全部到位，我们开始列表页面的制作过程。  

可以预览下我们的最终制作效果图：  
<div align="center">
  <img src="./images/list.png" width="500"/>
</div>

<br>  

分析下页面，很明显，日期是一个页面结构单位，一个单位里面的每篇文章也是一个小的单位。制作我们的页面如下，过程很简单，就不再复述了，修改 `index.wxml` 文件：  

```html
<view class="wrapper">
    <view class="group">
        <view class="group-bar">
            <view class="group-title on">今日</view>
        </view>
        <view class="group-content">
            <view class="group-content-item">
                <view class="group-content-item-desc ellipsis-multi-line ellipsis-line-3">为什么聪明人总能保持冷静？</view>
                <image class="group-content-item-img" mode="aspectFill" src="https://n1image.hjfile.cn/mh/2017/06/26/9ffa8c56cfd76cf5159011f4017f022e.jpg"/>
            </view>
        </view>
    </view>
    <view class="group">
        <view class="group-bar">
            <view class="group-title">06月27日</view>
        </view>
        <view class="group-content">
            <view class="group-content-item">
                <view class="group-content-item-desc ellipsis-multi-line ellipsis-line-3">为什么聪明人总能保持冷静？</view>
                <image class="group-content-item-img" mode="aspectFill" src="https://n1image.hjfile.cn/mh/2017/06/26/9ffa8c56cfd76cf5159011f4017f022e.jpg"/>
            </view>
        </view>
    </view>
    <view class="no-more" hidden="">暂时没有更多内容</view>
</view>    
```

<br>  

修改 `index.wxss` 文件：

```css
.wrapper .group {
  padding: 0 36rpx 10rpx 36rpx;
  background: #fff;
  margin-bottom: 16rpx
}

.wrapper .group-bar {
  height: 114rpx;
  text-align: center
}

.wrapper .group-title {
  position: relative;
  display: inline-block;
  padding: 0 12rpx;
  height: 40rpx;
  line-height: 40rpx;
  border-radius: 4rpx;
  border: solid 1rpx #e0e0e2;
  font-size: 28rpx;
  color: #ccc;
  margin-top: 38rpx;
  overflow: visible
}

.wrapper .group-title:after,.wrapper .group-title:before {
  content: '';
  top: 18rpx;
  position: absolute;
  width: 32rpx;
  height: 1rpx;
  transform: scaleY(.5);
  border-bottom: solid 1px #efefef
}

.wrapper .group-title:before {
  left: -56rpx
}

.wrapper .group-title:after {
  right: -56rpx
}

.wrapper .group-title.on {
  border: solid 1rpx #ffc60e;
  color: #ffc60e
}

.wrapper .group-title.on:after,.wrapper .group-title.on:before {
  border-bottom: solid 1px #ffc60e
}

.wrapper .group-content-item {
  position: relative;
  width: 100%;
  height: 194rpx;
  margin-bottom: 28rpx
}

.wrapper .group-content-item-desc {
  font-size: 36rpx;
  font-weight: 500;
  height: 156rpx;
  line-height: 52rpx;
  margin-right: 300rpx;
  margin-top: 8rpx;
  overflow: hidden;
  color: #333
}

.wrapper .group-content-item-img {
  position: absolute;
  right: 0;
  top: 0;
  vertical-align: top;
  width: 260rpx;
  height: 194rpx
}

.wrapper .group-content-item.visited .group-content-item-desc {
  color: #999
}

.wrapper .no-more {
  height: 44rpx;
  line-height: 44rpx;
  font-size: 32rpx;
  color: #ccc;
  text-align: center;
  padding: 20rpx 0
}
```

<br>

静态页面已经制作完成，下一篇中，我们将带着大家开发业务流程  
