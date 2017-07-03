'use strict';

import Promise from '../lib/promise';
import config from './config';

import * as Mock from './mock'

const DEFAULT_REQUEST_OPTIONS = {
    url: '',
    data: {},
    header: {
        'Content-Type': 'application/json'
    },
    method: 'GET',
    dataType: 'json'
};

let util = {
    isDEV: config.isDev,
    /*
     * 封装console.log()
     * @param type
     * @param msg
     */
    log: function () {
        this.isDEV && console.log(...arguments);
    },

    /*
     * 弹窗
     */
    alert: function (title = '提示', content = config.defaultAlertMsg) {
        if ('object' === typeof content){
            content = this.isDEV && JSON.stringify(content) || config.defaultAlertMsg;           
        }
        wx.showModal({
            title: title,
            content: content
        })
    },

    /*
     * getStorage
     * @param key
     * @param cb
     */
    getStorageData: function (key, cb) {
        let self = this;
        wx.getStorage({
            key: key,
            success: function(res) {
                cb && cb(res.data);
            }, 
            fail: function (err) {
                let msg = err.errMsg || '';
                if (/getStorage:fail/.test(msg)) {
                    self.setStorageData(key)
                }
            }
        })
    },

    /*
     * setStorage
     * @param key
     * @param value
     * @param cb
     */
    setStorageData: function (key, value = '', cb) {
        wx.setStorage({
            key: key,
            data: value,
            success: function () {
                cb && cb();
            }
        });
    },

    /*
     * 封装微信请求
     * @param opt
     */
    request: function (opt) {
        let options = Object.assign({}, DEFAULT_REQUEST_OPTIONS, opt);
        let {url, data, header, method, dataType, mock = false} = options;
        let self = this;

        return new Promise((resolve, reject) => {
            if(mock){
                let res = {
                    statusCode: 200,
                    data: Mock[url]
                }
                if (res && res.statusCode == 200 && res.data) {
                    resolve(res.data);
                } else {
                    self.alert('提示', res);
                    reject(res);
                }
            }else{
                wx.request({
                    url: url,
                    data: data,
                    header: header,
                    method: method,
                    dataType: dataType,
                    success: function (res) {
                        if (res && res.statusCode == 200 && res.data) {
                            resolve(res.data);
                        } else {
                            self.alert('提示', res);
                            reject(res);
                        }
                    },
                    fail: function (err) {
                        self.log(err);
                        self.alert('提示', err);
                        reject(err);
                    }
                })   
            }
        })
    }
};

export default util;