let handler = {
  //小程序初始化
  onLaunch() {
    console.log('app init...');
  },
  //小程序全局数据
  globalData: {
    user: {
      name: '',
      avator: ''
    },
    visitedArticles: ''
  }
};
App(handler);