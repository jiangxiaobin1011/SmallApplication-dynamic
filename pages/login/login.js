//index.js
//获取应用实例
var app = getApp();
var requestTool = require("../../utils/request.js");


Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {

    console.log("页面显示");
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  userLogin: function() {

    // this.loginAccount("TEST001");

    //先注册用户 然后登陆
    var userInfoData = wx.getStorageSync('userInfoData');
    if (!userInfoData) {
      console.log('用户没有注册登录过');
      this.registerAccount();
    } else {
      console.log('用户注册登录过');
      this.loginAccount(userInfoData.username);

    }



  },



  registerAccount: function() {
    ///user/register username	是	string	用户名 nick_name	否	string	昵称 password
    var that = this;
    var paraData = {
      username: "TEST002",
      nick_name: this.data.userInfo.nickName,
      password: "111111"
    }
    var cookie = wx.getStorageSync('cookie');
    if (cookie) { //保险起见 先移除掉
      wx.removeStorageSync('cookie');
    }
    requestTool.postRequest("/user/register", paraData, that.registerGetSuccess, that.registerGetFailed);
  },

  registerGetSuccess: function(data) {
    console.log("注册成功");
    var userName = data.username;
    this.loginAccount(userName);
  },

  registerGetFailed: function(res) {
    console.log("注册失败" + res);
  },

  loginAccount: function(userName) {
    var that = this;
    var paraData = {
      username: userName,
      password: "111111"
    }

    var cookie = wx.getStorageSync('cookie');
    if (cookie) { //保险起见 先移除掉
      wx.removeStorageSync('cookie');
    }

    requestTool.postRequest("/user/login", paraData, that.loginGetSuccess, that.loginGetFailed);

  },


  loginGetSuccess: function(data) {
    console.log("登录成功" + data);
    //存数据


    var userInfoData = {};

    userInfoData["id"] = data._id;
    userInfoData["username"] = data.username;
    userInfoData["nick_name"] = data.nick_name;
    userInfoData["age"] = data.age;
    userInfoData["sex"] = data.sex;
    userInfoData["avatar"] = this.data.userInfo.avatarUrl;

    wx.setStorageSync('userInfoData', userInfoData);

    //去到下一个页面
    wx.switchTab({
      url: '../home/home',
    })
  },

  loginGetFailed: function(res) {
    console.log("登录失败" + res);
  },


})