// pages/home/dynamicDeatil/dynamicDeatil.js

var requestTool = require("../../../utils/request.js");
var utilTool = require("../../../utils/util.js");
const onfire = require("../../../utils/onfire.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dynamicId:"",
    dynamicDetailData : {},
    commentList:{},
    commentText:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.dynamicId);
    this.setData({
      dynamicId: options.dynamicId
    });

    this.getDynamicDetailData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getDynamicDetailData:function(){
    var that = this;
    var paraData = {
      dynamic_id: that.data.dynamicId
    };
  requestTool.getRequest('/dynamic/info', paraData, that.getDetailDataSuccess, that.getDetailDataFailed);

  },

  getDetailDataSuccess:function(data){
    console.log("请求成功");
    var detailData = {

    };

    detailData["_id"] = data._id;
    detailData["postDate"] = utilTool.formatTime(data.timestamp, 'Y/M/D h:m:s');
    detailData["user_id"] = data.user_id;
    detailData["url"] = data.url;
    detailData["text"] = data.text;
    detailData["up_count"] = data.up_count;
    detailData["comment_count"] = data.comment_count;
    detailData["is_up"] = data.is_up;
    detailData["avatar"] = data.avatar;
    detailData["nick_name"] = data.nick_name;
    detailData["isDetail"] = true;


    var commentListDatas = [];
    for (var idx in data.comment_list){
      var commentData = data.comment_list[idx];
      commentData["postDate"] = utilTool.formatTime(commentData.timestamp, 'Y/M/D h:m:s');
      commentListDatas.push(commentData);
    }


    this.setData({
      dynamicDetailData: detailData,
      commentList: commentListDatas,
    });


  },

  getDetailDataFailed:function(){
      console.log("获取数据失败");
  },

  bindTextAreaBlur: function (e) {
    console.log(e.detail.value);

    this.setData({
      commentText: e.detail.value
    })

  },

  submitComment:function(){
    if (!this.data.commentText){
      wx.showModal({
        title: '温馨提示',
        content: '请输入评论内容',
        showCancel:false,
      });
      return;
    }
    var that = this;
    var paraData = {
      dynamic_id: that.data.dynamicId,
      text: that.data.commentText,
    };
    requestTool.postRequest('/dynamic/comment', paraData, that.commentSuccess, that.commentFailed);



  },

  commentSuccess:function(data){
    console.log("评论成功");
    this.setData({
      commentText : "",
    });
    this.getDynamicDetailData();
    onfire.fire("reloadDynamicFunction");

  },

  commentFailed:function(){
    console.log("评论失败");
  },


})