import util from './utils/index';
let handler = {
  //小程序初始化
  onLaunch() {
    console.log('app init...')
    // 增加初始化缓存数据功能
    util.getStorageData('visited', (data) => {
      this.globalData.visitedArticles = data;
    })
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