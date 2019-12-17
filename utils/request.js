var app = getApp();
//项目URL相同部分，减轻代码量，同时方便项目迁移
//这里因为我是本地调试，所以host不规范，实际上应该是你备案的域名信息

/**
 * POST请求，
 * URL：接口
 * postData：参数，json类型
 * doSuccess：成功的回调函数
 * doFail：失败的回调函数
 */
function postRequest(urlPath, postData, doSuccess, doFail) {
  var requestUrl = app.globalData.mianServerUrl + urlPath;
  var header = {};
  header["content-type"] =  "json";
  header["meme-app"] = "CCC";
  var cookie = wx.getStorageSync('cookie');
  if(cookie){
    header["cookie"] = cookie;
  }
  wx.request({
    //项目的真正接口，通过字符串拼接方式实现
    url: requestUrl,
    header: header,
    data: postData,
    method: 'POST',
    success: function (res) {
      //参数值为res.data,直接将返回的数据传入
      if (urlPath == '/user/login'){//存cookie
        var cookie = res.header.Cookie;
        if(!cookie){
          cookie = res.header.cookie;
        }
        wx.setStorageSync('cookie', cookie);
        console.log(res.header + '获得的头部s');
      }
      doSuccess(res.data);
    },
    fail: function (res) {
      doFail(res);
    },
    
  })
}

/**
 * GET请求，
 * urlPath：接口
 * paraData
 * doSuccess：成功的回调函数
 * doFail：失败的回调函数
 */

function getRequest(urlPath,paraData, doSuccess, doFail) {
  
  var requestUrl = app.globalData.mianServerUrl + urlPath;
  var header = {};
  header["content-type"] = "json";
  header["meme-app"] = "CCC";
  var cookie = wx.getStorageSync('cookie');
  if (cookie) {
    header["cookie"] = cookie;
  }
  wx.request({
    url: requestUrl,
    data: paraData,
    header: header,
    method: 'GET',
    success: function (res) {
      doSuccess(res.data);
    },
    fail: function (res) {
      console.log(res);
      doFail();
    },
  })
}

/**
 * module.exports用来导出代码
 * js文件中通过var call = require("../util/request.js")  加载
 * 在引入引入文件的时候"  "里面的内容通过../../../这种类型，小程序的编译器会自动提示，因为你可能
 * 项目目录不止一级，不同的js文件对应的工具类的位置不一样
 */

module.exports = {
  postRequest: postRequest,
  getRequest: getRequest
}

// module.exports.request = request;
// module.exports.getData = getData;
