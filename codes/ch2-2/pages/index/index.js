Page({
  data: {
    text: "This is page data."
  },
  onLoad: function (options) {
    console.log('小程序加载了')
    // 生命周期函数--监听页面加载
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
  },
  // 其他一些业务函数
  hello: function () {
    this.setData({
      text: 'hello world'
    })
  }
})