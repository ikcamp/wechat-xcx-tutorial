'use strict';
let handler = {
    onLaunch () {
        this.getDevideInfo();
    },
    alert (title = '提示', content = '好像哪里出了小问题~请再试一次~') {
        wx.showModal({
            title: title,
            content: content
        })
    },
    getDevideInfo () {
        let self = this;
        wx.getSystemInfo({
            success: function (res) {
                self.globalData.deviceInfo = res;
            }
        })
    },
    globalData: {
        user: {
            openId: null
        },
        visitedArticles: '',
        deviceInfo: {}
    }
};

App(handler);