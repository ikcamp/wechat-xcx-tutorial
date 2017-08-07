# 第二章：小程序中级实战教程：封装网络请求及 mock 数据

<br>  

## <a>&sect; 封装网络请求及 mock 数据</a>  
> 开始前请把 `ch2-3` 分支中的 `code/` 目录导入微信开发工具  
  

<br>

上一节中，我们对 index.js 文件中增加了 util 对象，并在对象中封装了很多公用方法
```js
let util = {
  log(){……},
  alert(){……},
  getStorageData(){……},
  setStorageData(){……}
}
```  
<br>

本节中，我们对常用的网络请求方法 [wx.request](https://mp.weixin.qq.com/debug/wxadoc/dev/api/network-request.html) 进行封装  
```js
  let util = {
    // 此处省略部分代码
    request(opt){
      let {url, data, header, method, dataType} = opt
      let self = this
      return new Promise((resolve, reject)=>{
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
      })
    }
  }
```  
<br>

对于请求的参数，我们设置下默认值，方便调用
```js
  const DEFAULT_REQUEST_OPTIONS = {
    url: '',
    data: {},
    header: {
      "Content-Type": "application/json"
    },
    method: 'GET',
    dataType: 'json'
  }

  let util = {
    // 此处省略部分代码
    request (opt){
      let options = Object.assign({}, DEFAULT_REQUEST_OPTIONS, opt)
      let {url, data, header, method, dataType, mock = false} = options
      let self = this
      // 此处省略部分代码 
    }
  }
```  
<br>

如果是本地开发调试，需要增加我们的 mock 假数据，对 util.request 进行修改
```js
  let util = {
    // 此处省略部分代码
    request (opt){
      let options = Object.assign({}, DEFAULT_REQUEST_OPTIONS, opt)
      let {url, data, header, method, dataType, mock = false} = options
      let self = this
      return new Promise((resolve, reject)=>{
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
  }
```
如果请求接口调用时候，包含有参数 mock = true，会自动调用相应的 mock 数据，如果没有这个参数，就走正常流程去调数据。  

<br>  

调用方法如下：
```js
  util.request({
    url: 'list',
    mock: true,
    data: {
      tag:'微信热门',
      start: 1,
      days: 3,
      pageSize: 5,
      langs: 'en'
    }
  }).then(res => {
    // do something
  })
```
