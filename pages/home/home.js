// pages/home/home.js


var requestTool = require("../../utils/request.js") ;


var utilTool = require("../../utils/util.js");


const onfire = require("../../utils/onfire.js");


var app = getApp() ;





Page({

  /**
   * 页面的初始数据
   */
  data: {

    dynamicList : {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getDynamicListData();


    //注册事件
    var that = this;
    let reloadDynamicFunction = onfire.on("reloadDynamicFunction", function () {
      console.log("新建动态，需要刷新");
      that.getDynamicListData();
    });


  },

  onUnload:function(){
    onfire.un("reloadDynamicFunction");
  },

  /**
   * 获取动态列表
   */
  getDynamicListData:function(){
    
    var pathUrl = "/dynamic/page";


    var paraData = {
      size: "10"
    }

    var that = this;

    requestTool.getRequest(pathUrl, paraData, that.getSuccess, that.getFailed);


  },


  getSuccess:function(data){
    var datas = data;
    
    var getList = [];

    for(var idx in data.items){

      if(idx > 9){
        break;
      }

      var obj = data.items[idx];

      var dynamicData = obj;


      dynamicData["postDate"] = utilTool.formatTime(obj.timestamp, 'Y/M/D h:m:s');

      // dynamicData["postDate"] = '2019-09-23';



      getList.push(dynamicData);

    }

    this.setData({
      dynamicList: getList
    });



  },

  getFailed:function(){
    console.log("qingqiu 失败");
  },



  dynamicTap:function(res){
    var dynamicId = res.currentTarget.dataset.dynamicid;
    console.log("点击了动态" + dynamicId);
    wx.navigateTo({
      url: '/pages/home/dynamicDeatil/dynamicDeatil?dynamicId=' + dynamicId,
    })


  },
  userAvatarTap:function(res){
    var userId = res.target.dataset.userid;
    console.log("点击了用户头像" + userId);
  },

  moreTap:function(res){
    var that = this;
    var userId = res.target.dataset.userid;
    console.log("点击了用户" + userId);
    wx.showActionSheet({
      itemList: ["拉黑","举报"],
      itemColor:"red",
      success:function(res){
        console.log(res.tapIndex);
        if (res.tapIndex == 0){//举报
          that.reportUser(userId);
        } else if (res.tapIndex == 1){//拉黑
          wx.showActionSheet({
            itemList: ['语言辱骂','发布不良信息','传播色情暴力','设计敏感话题'],
            itemColor: "red",
            success:function(res){
              wx.showModal({
                title: '举报成功',
                content: '平台将在一个工作日内做出相应处理',
                cancelText:'',
                showCancel:false
              });

            }

          })
        }

      }
      

      
    });

  },


  reportUser:function(userId){

    wx.showModal({
      title: '拉黑成功',
      content: '已屏蔽此用户的所有动态信息',
      showCancel: false,
    });


  },


  /**
   * 点赞帖子
   */
  upUserTap:function(res){
    var that = this;
    var data = res.currentTarget.dataset.dynamicidIsuped;
    var paraData = {
      dynamic_id: data.dynamicid
    }
    if (data.isuped){//点过赞的
      requestTool.getRequest('/dynamic/up', paraData, that.upUserSuccess, that.upUserFailed);
    }else{
      requestTool.getRequest('/dynamic/up', paraData, that.upUserSuccess, that.upUserFailed);
    }


  },


  upUserSuccess:function(data){
    console.log("点赞成功");
    this.getDynamicListData();
  },
  upUserFailed: function (data) {
    console.log("点赞失败");
  },


  lookUpPhoto:function(res){

    var photoUrl = res.currentTarget.dataset.photourl;
    wx.previewImage({
      urls: [photoUrl],
    });

  },




  addNewDynamic:function(res){
    console.log("新增动态");
    wx.navigateTo({
      url: 'addNewDynamic/addNewDynamic',
    });
  },


  onScrollToLower:function(res){

    console.log("onScrollToLower");

  },


  onPullDownRefresh:function(event){

    // wx.showNavigationBarLoading();
    // this.getRequest;

  },
})