// pages/home/addNewDynamic/addNewDynamic.js


var qiniuUploader = require("../../../utils/qiniuUploader.js");


var requestTool = require("../../../utils/request.js");
const onfire = require("../../../utils/onfire.js");


Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedPhoto: "",
    imageURL:"",
    contentText: "",
    height:{},
    width:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
        that.setData({
          width: res.windowWidth,
          height: res.windowHeight,
        })
      }
      });

     
    
  },


  selectPhoto: function() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);
        var url = tempFilePaths[0];
        that.setData({
          selectedPhoto: url
        });


      },
    })
  },

  cancleSelectPhoto: function() {
    this.setData({
      selectedPhoto: ""
    });

  },

  bindTextAreaBlur: function(e) {
    console.log(e.detail.value);

    this.setData({
      contentText: e.detail.value
    })

  },

  bindFormSubmit: function(e) {
    console.log(e.detail.value.textarea);
    this.setData({
      contentText: e.detail.value
    });
    this.submitAllData();
  },




  postNewDynamic:function(){
    this.startReadytAllData();
  },

  startReadytAllData: function () {
    
    if(!this.data.contentText){
      wx.showModal({
        title: '温馨提示',
        content: '请输入文字内容',
        showCancel: false,
      });
      return;
    }
    if (!this.data.selectedPhoto) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择一张照片',
        showCancel: false,
      });
      return;
    }


    //获取图片链接



    this. getQiNiuData();





  },



  getQiNiuData:function(){

    var that = this;
    var pathUrl = "/qiniu/token/upload-img";
    var paraData = {
      type : 1,
    };
    requestTool.getRequest(pathUrl, paraData, that.getQiNiuSuccess, that.getQiNiuFailed);

  },

  getQiNiuSuccess:function(data){
    console.log("请求七牛成功" +  data);
    this.didUploadChooseImage(data);
  },

  getQiNiuFailed:function(){
    console.log("请求失败");
  },






  /**
   * 获取图片链接
   */
  didUploadChooseImage: function (paraDic) {

    var token = paraDic.token;
    var key = paraDic.filekey;
    var domain = paraDic.domain; 


    var that = this;

    var filePath = that.data.selectedPhoto;

    qiniuUploader.upload(filePath, (res) => {
    
      that.setData({
        'imageURL': res.imageURL,
      });
      console.log('file url is: ' + res.fileUrl);


      that.submitAllData();
    }, (error) => {
      console.log('error: ' + error);
    }, {
        region: 'ECN',
        domain: domain, 
        //key: 'customFileName.jpg', // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
        // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
        uptoken: token, // 由其他程序生成七牛 uptoken
        //uptokenURL: 'UpTokenURL.com/uptoken', // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
        //uptokenFunc: function () { return '[yourTokenString]'; }
      }, (res) => {
        console.log('上传进度', res.progress)
        console.log('已经上传的数据长度', res.totalBytesSent)
        console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
      }, () => {
        // 取消上传
      }, () => {
        // `before` 上传前执行的操作
      }, (err) => {
        // `complete` 上传接受后执行的操作(无论成功还是失败都执行)
      });
 

  },




  submitAllData:function(){
    var that = this;
    var pathUrl = "/dynamic/commit";
    var postData = {
      url : that.data.imageURL,
      text : that.data.contentText,
    };
    requestTool.postRequest(pathUrl, postData, that.submitDynamixSuccess, that.submitDynamicFailed);
  },

  submitDynamixSuccess:function(data){
    console.log("发布成功");

    onfire.fire("reloadDynamicFunction");
    wx.navigateBack();
  },
  submitDynamicFailed:function(){
    console.log("发布失败");
  },











})