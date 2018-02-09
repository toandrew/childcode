//index.js

// 获取应用实例
var Api = require('../../utils/api.js');

// wx request
var wxRequest = require('../../utils/wxRequest.js');

// config
import config from '../../utils/config.js'

var pageCount = config.getPageCount;

var util = require('../../utils/util.js');

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
    var self = this;
    var request = wxRequest.getRequest(Api.getSwiperPosts());
    request.then(response => {
      if (response.data.status == '200' && response.data.posts.length > 0) {
        this.setData({
          postsShowSwiperList: response.data.posts,
          postsShowSwiperList: self.data.postsShowSwiperList.concat(
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
    var self = this;
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
      if (response.statusCode === 200) {
        if (response.data.length < pageCount) {
          self.setData({
            isLastPage: true
          });
        }
        self.setData({
          floatDisplay: 'block',
          postsList: self.data.postsList.concat(response.data.map(function(item) {
            if (item.category_name) {
              item.categoryImage = '../../images/category.png';
            } else {
              item.categoryImage = '';
            }

            if (item.post_thumbnail_image == null || item.post_thumbnail_image == '') {
              item.post_thumbnail_image = '../../images/logo700.png';
            }

            item.date = util.cutstr(item.date, 10, 1);

            return item;
          })),
        });

        setTimeout(function() {
          wx.hideLoading();
        }, 900);
      } else if (response.data.code === 'rest_post_invalid_page_number') {
        self.setData({
          isLastPage: true
        });

        wx.showToast({
          title: '没有更多内容',
          mask: false,
          duration: 1500
        });
      } else {
        wx.showToast({
          title: response.data.message,
          duration: 1500
        })
      }
    }).catch(response => {
      if (data.page === 1) {
        self.setData({
          showerror: 'block',
          floatDisplay: 'none'
        });
      } else {
        wx.showModal({
          title: '加载失败',
          content: '加载数据失败，请重试',
          showCancel: false
        });

        self.setData({
          page: data.page - 1
        });
      }
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
