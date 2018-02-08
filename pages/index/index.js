//index.js
// 获取应用实例
var Api = require('../../utils/api.js');

var wxRequest = require('../../utils/wxRequest.js');

const app = getApp()

Page({
  data: {
    postsList: [],
    postsShowSwiperList: [],
    isLastPage: false,
    page: 1,
    search: '',
    categories: 0,
    showerror: 'none',
    showCategoryName: '',
    categoryName: '',
    showallDisplay: 'block',
    displayHeader: 'none',
    displaySwiper: 'none',
    floatDisplay: 'none',
    displayfirstSwiper: 'none',
    topNav: []
  },

  onLoad: function (options) {
    this.fetchTopFivePosts();

  },

  onShow: function (options) {
  },

  // 分享
  onShareAppMessage: function () {
  },

  // 下拉刷新
  onPullDownRefresh: function () {
  },

  // 搜索
  formSubmit: function(e) {
  },

  // 到底部
  onReachBottom: function() {
  },

  // 事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  fetchTopFivePosts: function() {
    var request = wxRequest.getRequest(Api.getSwiperPosts());
    request.then(response => {
      if (response.data.status == '200' && response.data.posts.length > 0) {
        this.setData({
          postsShowSwiperList: response.data.posts,
          postsShowSwiperList: self.data.postShowSwiperList.concat(
            response.data.posts.map(function(item) {
              if (item.post_medium_image_300 == null
                || item.post_medium_image_300 == '') {
                if (item.content_first_image != null
                  && item.content_first_image != '') {
                  item.post_medium_image_300 = item.content_first_image;
                } else {
                  item.post_medium_image_300 = '../../images/logo700.png';
                }
              }

              return item;
            })),
            showallDisplay: 'block',
            displaySwiper: 'block',
        });
      } else {
        this.setData({
          displaySwiper: 'none',
          displayHeader: 'block',
          showallDisplay: 'block',
        });
      }
    }).then(response => {
      this.fetchPostsData(this.data)
    }).catch(response => {
      console.log(response);
      this.setData({
        showerror: 'block',
        floatDisplay: 'none',
      });
    }).finally(() => {
      console.log("OK!");
    });
  },

  // 获取文章列表数据
  fetchPostsData: function(data) {
    if (!data) {
      data = {};
    }

    if (!data.page) {
      data.page = 1;
    }

    if (!data.categories) {
      data.categories = 0;
    }

    if (!data.search) {
      data.search = '';
    }

    if (data.page == 1) {
      this.setData({
        postsList: []
      });
    }

    wx.showLoading({
      title: '正在加载',
      mask: true
    });

    var request = wxRequest.getRequest(Api.getPosts(data));
    request.then(response => {

    }).catch(response => {

    }).finally(response => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
    });
  },

  // 加载更多
  loadMore: function(e) {

  },

  // 跳转至查看详情页
  redirectToDetail: function(e) {

  },

  // 首页图标跳转
  onNavRedirect: function(e) {

  },

  // 跳转至app详情
  redirectToAppDetail: function(e) {

  },

  // 返回首页
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
