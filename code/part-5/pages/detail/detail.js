'use strict';

import util from '../../utils/index';
import config from '../../utils/config';
import WxParse from '../../lib/wxParse/wxParse';
import HtmlFormater from '../../lib/htmlFormater';
import Loading from '../component/loading/loading';
var app = getApp();
let loading;
let handler = {
    data: {
        isFromShare:false,
        needSendBi: true,
        scrollTop: 0,
        activetextkey: 0,
        defaultImg: config.defaultImg,
        wxParseData: {},
        detailData: {}
    },

    /* Onload
     * @param option
     */
    onLoad (option) {
        let id = option.contentId || 0;
        this.setData({
            isFromShare: !!option.share
        });
        this.initLoading();
        this.init(id);
    },

    onReady () {
        // Do something when page ready.
    },

    onShow () {
        // Do something when page show.
    },

    onHide () {
        // Do something when page hide.
    },

    onUnload () {
        // Do something when page close.
    },

    /*
     * 支持分享api
     */
    notSupportShare () {
        let device = app.globalData.deviceInfo;
        let sdkVersion = device && device.SDKVersion || '1.0.0';
        return /1\.0\.0|1\.0\.1|1\.1\.0|1\.1\.1/.test(sdkVersion);
    },

    /*
     * 初始化loading
     */
    initLoading() {
        loading = new Loading(false, 'detailLoading', this);
        loading.init();
    },

    /*
     * 返回列表页
     */
    back () {
        if (this.data.isFromShare) {
            wx.navigateTo({
                url: '../index/index'
            });   
        } else {
            wx.navigateBack();    
        }
    },

    /*
     * 下一篇
     */
    next () {
        loading.show();
        this.requestNextContentId()
            .then(data => {
                let contentId = data && data.contentId || 0;
                this.init(contentId);
                loading.hide();
            })
    },
    
    /*
     * 分享按钮   
     */
    share () {
        if (this.notSupportShare()) {
            wx.showModal({
                title: '提示',
                content: '您的微信版本较低，请点击右上角分享'
            })
        }
    },

    /*
     * 回到顶部
     */
    goTop () {
        this.setData({
            scrollTop: 0
        })
    },

    clearArticleData () {
        this.setData({
            detailData: {}
        });
    },

    /*
     * 注册分享
     */
    onShareAppMessage () {
        let title = this.data.detailData && this.data.detailData.title || config.defaultShareText;
        let contentId = this.data.detailData && this.data.detailData.contentId || 0;
        return {
            title: title,
            path: `/pages/detail/detail?share=1&contentId=${contentId}`,
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },

    /*
     * wxparse  convert html -> wxml
     */
    articleRevert () {
        let htmlContent = this.data.detailData && this.data.detailData.content;
        WxParse.wxParse('article', 'html', htmlContent, this, 0);
    },

    /*
     * 初始化页面数据
     * @param contentId
     */
    init (contentId) {
        loading.show();
        if (contentId) {
            this.goTop();
            this.requestDetail(contentId)
                .then(data => {
                    this.configPageData(data);
                })
                //调用wxparse
                .then(()=>{
                    this.articleRevert();
                });
        }
    },

    /*
     * 设置页面数据
     */
    configPageData (data) {
        if (data) {
            this.setData({
                detailData: data
            });
            //设置标题
            let title = this.data.detailData && this.data.detailData.title || config.defaultBarTitle;
            wx.setNavigationBarTitle({
                title: title
            });
            //清除loading
            loading.hide();
        }

    },

    /*
     * 请求文章页数据
     * @param contentId
     * @returns {Promise.<TResult>|*}
     */
    requestDetail (contentId) {
        return util.request({
            url: 'detail',
            mock: true,
            data: {
                source: 1
            }
        })
        .then(res => {
            if (res && res.status === 0 && res.data) {
                util.log(res);
                //格式化文章html
                let formateHtml = this.formateHtml(res.data.content);
                //格式化时间
                let formateUpdateTime = this.formateTime(res.data.lastUpdateTime);
                res.data.content = formateHtml;
                res.data.formateUpdateTime = formateUpdateTime;
                return res.data;
            } else {
                util.alert('提示', res);
                return null;
            }

        });
    },

    /*
     * 请求下一篇文章ID
     */
    requestNextContentId () {
        let pubDate = this.data.detailData && this.data.detailData.lastUpdateTime || '';
        let contentId = this.data.detailData && this.data.detailData.contentId || 0;
        return util.request({
            url: 'detail',
            mock: true,
            data: {
                tag:'微信热门',
                pubDate: pubDate,
                contentId: contentId,
                langs: config.appLang || 'en'
            }
        })
        .then(res => {
            if (res && res.status === 0 && res.data && res.data.contentId) {
                util.log(res);
                return res.data;
            } else {
                util.alert('提示', '没有更多文章了!');
                return null;
            }
        });
    },


    
    formateHtml (html) {
        let formater = new HtmlFormater(html);
        return formater.formatEmpty()
            .formatDisabledTag()
            .formatLink()
            .formatVideo()
            .formatInlineClass()
            .formatA()
            .formatBr()
            .formatQuota().result;
    },

    formateTime (timeStr = '') {
        let year = timeStr.slice(0, 4),
            month = timeStr.slice(5, 7),
            day = timeStr.slice(8, 10);
        return `${year}/${month}/${day}`;
    }
};
Page(handler);