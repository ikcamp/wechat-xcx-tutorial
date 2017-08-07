## <a>&sect; 小程序时代</a>  
小程序的优势，网上各种文章新闻铺天盖地，这里不再复述。  
除了我们常见的功能外（音频、视频、图片、画布等），小程序可以做到如下但不限于这些事情：  

* 网络：网络请求、上传下载、 `WebSocket`（比如聊天室）
* 数据：数据缓存能力
* 位置：获取位置、查看位置、地图调用
* 设备：系统信息、网络状态、加速度计（重力感应）、罗盘、拨打电话、扫码、蓝牙、iBeacon、屏幕亮度、 `振动` 、手机联系人（你的电话本）
* 界面：可以做到很多与微信一样效果的样式，比如设置导航条、导航、动画、绘图等等
* 开放接口：登录、授权、用户信息、`微信支付` 、微信客服、转发、二维码功能、 `微信运动` 、收货地址、卡券、设置
* 文件操作能力、数据统计分析（pv、uv等）   
<br>  

## <a>&sect; 小程序起手</a>
之前小程序强制要求以公司机构申请 `appID` 方可开发和上线小程序项目，导致小程序遇冷。不过还好，现在小程序基本上放开了这块的限制。  
如果你想自己动手玩下小程序，找找感觉，没有 `appID` 也可以做到。如果想要达到上线的效果，还是需要申请 `appID` 并进行项目的提交审核。  
<br>  

### 这里稍微提下 `appID` 的申请过程  
1. 打开[小程序注册地址](https://mp.weixin.qq.com)，浏览 3 秒后，请点击页面右上角 `立即注册` 进入下一个页面并选择 `小程序`，如下：  

<div align="center">
  <image src="./images/WechatIMG0.jpeg" width="400"/>
</div>  
<div align="center">
  <image src="./images/WechatIMG1.jpeg" width="400"/>
</div>  
<br>  

2. 不用多说了，直接填写信息吧。需要注意的是：*一个邮箱只能注册一个小程序* 。另外，多了解下协议内容，避免因一些小问题造成审核不通过。 

<div align="center">
  <image src="./images/WechatIMG2.jpeg" width="600"/>
</div>  
<br>  

3. 注册成功后，会有个激活链接发送到注册邮箱里面，需要登录邮箱中验证激活。

<div align="center">
  <image src="./images/WechatIMG3.jpeg" width="400"/>
</div>  
<br>  

4. 查收邮件，并点击此处链接验证激活。

<div align="center">
  <image src="./images/WechatIMG4.jpeg" width="400"/>
</div>  
<br>  

5. 点击邮件的链接验证后，正常情况下，会跳转到一个新的页面，如果打开页面后，没有进入到如下页面，可以点击页面 `返回首页`，或直接访问地址 [https://mp.weixin.qq.com](https://mp.weixin.qq.com) 

<div align="center">
  <image src="./images/WechatIMG5.jpeg" width="600"/>
</div>  
<br>  

6. 信息登记的主体类型，请根据自己的情况而定，本教程采用最基本的 `个人` 类型，并填写下面的真实信息，需要注意的是，`身份证` 和 `手机号` 最多能绑定 5 个小程序，也就是说，你想要开发第 6 个小程序，就需要换别人的证件信息了。

<div align="center">
  <image src="./images/WechatIMG6.jpeg" width="600"/>
</div>  
<br>  

7. 信息填写后，点击 `继续` 进行提交，成功后会弹出如下框，直接 `前往小程序` 

<div align="center">
  <image src="./images/WechatIMG7.jpeg" width="400"/>
</div>  
<br>  

8. 进入小程序后，从左侧菜单导航的 `设置` 进入到 `开发设置`，或直接在图中所示位置进入 `开发设置`，就可以看到小程序的 `appID`了。

<div align="center">
  <image src="./images/WechatIMG8.jpeg" width="600"/>
</div>  
<br>  

<div align="center">
  <image src="./images/WechatIMG9.jpeg" width="400"/>
</div>  
