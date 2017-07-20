'use strict';

/**
 * 小程序中不支持的特殊标记（中很少很少的一部分）
 * 太多了,遇到一个加一个吧... = =!
 * @type {{string}}
 */
let quatoMap = {
    "&#39;": "\'",
    "&aelig;": "æ",
    "&pound;": "£",
    "&bull;": "•",
    "&eacute;": "é",
    "&euml;": "ë",
    "&ouml;": "ö",
    "&uuml;": "ü",
    "&auml;": "ä",
    "&otilde;": "õ",
    "&ugrave;": "ù",
    "&uacute;": "ú",
    "&aacute;": "á",
    "&#257;": "ā",
    "&agrave;": "à",
    "&egrave;": "è",
    "&#275;": "ē",
    "&#283;": "ě",
    "&iacute;": "í",
    "&igrave;": "ì",
    "&#299;": "ī",
    "&#464;": "ǐ",
    "&ograve;": "ò",
    "&oacute;": "ó",
    "&#466;": "ǒ",
    "&#333;": "ō",
    "&#363;": "ū",
    "&#468;": "ǔ"
};

class HtmlFormater {

    constructor(html = ''){
        this.result = html;
    }

    /**
     * 超链接
     */
    formatA() {
        this.result = this.result.replace(/<a .*?>(.*?)<\/a>/g, "$1");
        return this;
    }

    /**
     * 空（无意义）标签
     */
    formatEmpty() {
        this.result = this.result.replace(/<(\w+)(>| [^>]*?>)(\s|&nbsp;)*?<\/\1>/g, '');
        return this;
    }

    /**
     * 不可用标签 如: script  iframe
     */
    formatDisabledTag() {
        this.result = this.result.replace(/<(iframe|script|style)[^>]*?>[\s\S]*?<\/\1>/g, '');
        return this;
    }

    /**
     * 内联样式
     */
    formatInlineClass() {
        this.result = this.result.replace(/(<[\w]+[^>]*?)style=(['|"])[^\2]*?\2([^>]*?>)/g, '$1$3');
        return this;
    }

    /**
     * 视频
     */
    formatVideo() {
        this.result = this.result.replace(/<em class=['"]video-loading['"] .*?>.*?<\/em>/g, '');
        return this;
    }

    /**
     * 换行符br
     */
    formatBr() {
        this.result = this.result.replace(/<(br)\s*?\/?>\s*(<\1\s*?\/?>)?/g, '<br/>');
        return this;
    }

    formatLink() {
        this.result = this.result.replace(/<link[^>*]*?>/g, '');
        return this;
    }
    
    formatQuota() {
        this.result = this.result.replace(/&#39;|&aelig;|&pound;|&bull;|&eacute;|&euml;|&ouml;|&uuml;|&auml;|&otilde;|&aacute;|&ugrave;|&uacute;|&#257;|&agrave;|&egrave;|&#275;|&#283;|&iacute;|&igrave;|&#299;|&#464;|&ograve;|&oacute;|&#466;|&#333;|&#363;|&#468;/g, function ($1) {
            return quatoMap[$1];
        });
        return this;
    }
}

export default HtmlFormater