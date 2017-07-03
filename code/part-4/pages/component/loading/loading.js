'use strict';

export default class Loading {
    constructor(isLoad = false, type, page) {
        this.page = page;
        this.isLoaded = isLoad;
        this.loadingType = type;
    }
    
    init() {
        if (this.page) {
            this.page.setData({
                isLoaded: this.isLoaded,
                loadingType: this.loadingType
            })
        }
    }

    hide () {
        if (this.page && !this.page.data.isLoaded) {
            setTimeout(()=>{
                this.page.setData({
                    isLoaded: true
                });
            },400);
        }
    }

    show () {
        if (this.page && this.page.data.isLoaded) {
            this.page.setData({
                isLoaded: false
            });
        }
    }
}