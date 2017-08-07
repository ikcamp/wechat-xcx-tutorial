'use strict'
import Promise from '../lib/promise'
import config from './config'
import * as Mock from './mock'

let util = {
  isDEV: config.isDev,
  log(){
    this.isDEV && console.log(...arguments)
  },
  alert(title = '提示', content = config.defaultAlertMsg){
    if('object' === typeof content){
      content = this.isDEV && JSON.stringify(content) || config.defaultAlertMsg
    }
    wx.showModal({
      title,
      content
    })
  },
  getStorageData(key, cb){
    let self = this
    wx.getStorage({
      key,
      success(res){
        cb && cb(res.data)
      },
      fail(err){
        let msg = err.errMsg || ''
        if( /getStorage:fail/.test(msg) ){
          self.setStorageData(key)
        }
      }
    })
  },
  setStorageData(key, value = '', cb){
    wx.setStorage({
      key,
      data: value,
      success(){
        cb && cb()
      }
    })
  }
}
export default util