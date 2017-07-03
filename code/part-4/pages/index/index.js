'use strict';

import util from '../../utils/index';
import config from '../../utils/config';
import Loading from '../component/loading/loading';

let app = getApp();
let isDEV = config.isDev;
let loading;

let handler = {
    data: {
        page: 1,
        days: 3,
        pageSize: 4,
        totalSize: 0,
        hasMore: true,
        articleList: [],
        defaultImg: config.defaultImg
    },

    onLoad (options) {
        this.initLoading();
        this.requestArticle();
    },

    /*
     * 分享
     */
    onShareAppMessage () {
        let title = config.defaultShareText || '';
        return {
            title: title,
            path: `/pages/index/index`,
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },

    /*
     * 初始化loading
     */
    initLoading() {
        loading = new Loading(false, 'listLoading', this);
        loading.init();
    },

    /*
     * 跳转详情页
     */
    showDetail (e) {
        let dataset = e.currentTarget.dataset;
        let item = dataset && dataset.item;
        let contentId = item.contentId || 0;

        //记录点击过的文章
        this.markRead(contentId);
        wx.navigateTo({
            url: `../detail/detail?contentId=${contentId}`
        });
    },

    /*
     * 上拉触底事件
     */
    onReachBottom () {
        if (this.data.hasMore) {
            let nextPage = this.data.page + 1;
            this.setData({
                page: nextPage
            });
            this.requestArticle();
        }
    },

    /*
     * 获取文章列表数据
     */
    requestArticle () {
        util.request({
            url: 'list',
            mock: true,
            // url: `${config.apiHost}/v1/article/tag/list`,
            data: {
                tag:'微信热门',
                start: this.data.page || 1,
                days: this.data.days || 3,
                pageSize: this.data.pageSize,
                langs: config.appLang || 'en'
            }
        })
        .then(res => {
            if (res && res.status === 0 && res.data && res.data.length) {
                let articleData = res.data;
                //格式化原始数据
                let formatData = this.formatArticleData(articleData);
                this.renderArticle(formatData);
            } else if (this.data.page === 1 && res.data && res.data.length === 0) {
                util.alert();
                this.setData({
                    hasMore: false
                });
            } else if (this.data.page !== 1 && res.data && res.data.length === 0) {
                this.setData({
                    hasMore: false
                });
            } else {
                util.alert('提示', res);
                this.setData({
                    hasMore: false
                });
                return null;
            }
        });
    },

    /*
     * 判断文章是否访问过
     * @param contentId
     */
    isVisited (contentId) {
        let visitedArticles = app.globalData && app.globalData.visitedArticles || '';
        return visitedArticles.indexOf(`${contentId}`) > -1;
    },

    resetArticles () {
        let old = this.data.articleList;
        let newArticles = this.formatArticleData(old);
        this.setData({
            articleList: newArticles
        });
    },

    markRead (contentId) {
        util.getStorageData('visited', (data)=> {
            let newStorage = data;
            if (data) {
                if (data.indexOf(contentId) === -1) {
                    newStorage = `${data},${contentId}`;
                }
            } else {
                newStorage = `${contentId}`;
            }

            if (data !== newStorage) {
                if (app.globalData) {
                    app.globalData.visitedArticles = newStorage;
                }
                util.setStorageData('visited', newStorage, ()=>{
                    this.resetArticles();
                });
            }
        });
    },

    /*
     * 格式化文章列表数据
     */
    formatArticleData (data) {
        let formatData = undefined;
        if (data && data.length) {
            formatData = data.map((group) => {
                group.formateDate = this.dateConvert(group.date);
                if (group && group.articles) {
                    let formatArticleItems = group.articles.map((item) => {
                        item.hasVisited = this.isVisited(item.contentId);
                        return item;
                    }) || [];
                    group.articles = formatArticleItems;
                }
                return group
            })
        }
        return formatData;
    },

    /*
     * 将原始日期字符串格式化 '2017-06-12'
     * return '今日' / 08-21 / 2017-06-12
     */
    dateConvert (dateStr) {
        if (!dateStr) {
            return '';
        }
        let today = new Date(),
            todayYear = today.getFullYear(),
            todayMonth = ('0' + (today.getMonth() + 1)).slice(-2),
            todayDay = ('0' + today.getDate()).slice(-2);
        let convertStr = '';
        let originYear = +dateStr.slice(0,4);
        let todayFormat = `${todayYear}-${todayMonth}-${todayDay}`;
        if (dateStr === todayFormat) {
            convertStr = '今日';
        } else if (originYear < todayYear) {
            let splitStr = dateStr.split('-');
            convertStr = `${splitStr[0]}年${splitStr[1]}月${splitStr[2]}日`;
        } else {
            convertStr = dateStr.slice(5).replace('-', '月') + '日'
        }
        return convertStr;
    },

    /*
     * 文章标题格式化
     * 超过24个中文长度则截取掉
     */
    titleConvert (targetStr) {

    },

    renderArticle (data) {
        if (data && data.length) {
            let newList = this.data.articleList.concat(data);
            this.setData({
                articleList: newList
            });
            loading.hide();
        }
    }
};

Page(handler);