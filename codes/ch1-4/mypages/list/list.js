let App = getApp()
Page({
  data: {
    arrList: []
  },
  onLoad(){
    console.log( 'list page on launch' )
  },
  onPullDownRefresh(){
    console.log('从顶部向下拉')
  },
  onReachBottom(){
    console.log('到达页面底部')
    this.updateArrList()
  },
  updateArrList(){
    let arr = this.data.arrList
    arr.push( ...this.createData() )
    this.setData({
      arrList: arr
    })
  },
  createData(){
    let length = this.data.arrList.length
    if(length >= 30 ) return [];
    return Array.from({length: 3},(v, i)=>`数据${1+i+length}`)
  }
})