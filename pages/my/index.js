//index.js
//获取应用实例
const app = getApp();

var util = require('../../utils/util.js');

Page({
  data: {
    topBarItems: [
      { id: '1', name: '浏览', selected: true },
      { id: '2', name: '评论', selected: false },
      { id: '3', name: '点赞', selected: false },
      { id: '4', name: '赞赏', selected: false },
      { id: '5', name: '订阅', selected: false },
    ],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
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
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage: function () {
    return {
      title: 'test',
      path: 'pages/my/index',
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  },

  onTapTag: function (e) {
    var tab = e.currentTarget.id;
    var topBarItems = this.data.topBarItems;
    for (var item of topBarItems) {
      if (tab == item.id) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    }

    this.setData({
      topBarItems: topBarItems
    });

    if (tab !== 0) {
      this.fetchPostsData(tab);
    } else {
      this.fetchPostsData('1');
    }
  },

  fetchPostsData: function (tab) {
    this.setData({
      showerror: 'none',
      shownodata: 'none'
    });

    var count = 0;
    switch (tab) {
      case '1':
        this.setData({
          readLogs: (wx.getStorageSync('readLogs') || []).map(function(log) {
            count++;
            return log;
          })
        });

        this.setData({
          userInfo: app.globalData.userInfo
        });

        if (count == 0) {
          this.setData({
            shownodata: 'block'
          });
        }
        break;
      case '2':
        this.setData({
          readLogs: []
        });

        if (app.globalData.openid) {
          var openid = app.globalData.openid;
          var myCommentsRequest = wxReqest.getRequest(Api.getWeixinComment(openid));
          myCommentsRequest.then(response => {
            if (response.statusCode == 200) {
              this.setData({
                readLogs: this.data.readLogs.concat(response.data.data.map(function(item){
                  count++;
                  item[0] = item.post_id;
                  item[1] = item.post_title;
                  return item;
                }))
              });

              this.setData({
                userInfo: app.globalData.userInfo
              });

              if (count == 0) {
                this.setData({
                  shownodata: 'block'
                });
              }
            } else {
              console.log(response);
              this.setData({
                showerror: 'block'
              });
            }
          });
        } else {
          this.userAuthorization();
        }
        break;
      case '3':
        this.setData({
          readLogs: []
        });

        if (app.globalData.openid) {
          var openid = app.globalData.openid;
          var myLikePostsRequest = wxRequest.getRequest(Api.getMyLike(openid));
          myLikePostsRequest.then(response => {
            if (response.statusCode == 200) {
              this.setData({
                readLogs: this.data.readLogs.concat(response.data.data.map(function(item) {
                  count++;
                  item[0] = item.post_id;
                  item[1] = item.post_title;
                  item[2] = '0';
                  return item;
                }))
              })

              this.setData({
                userInfo: app.globalData.userInfo
              });

              if (count == 0) {
                this.setData({
                  shownodata: 'block'
                })
              }
            } else {
              console.log(response);
              this.setData({
                showerror: 'block'
              });
            }
          });
        } else {
          this.userAuthorization();
        }
        break;
      case '4':
        this.setData({
          readLogs: []
        });

        if (app.globalData.openid) {
          var openid = app.globalData.openid;
          var myPraisePostsRequest = wxRequest.getRequest(Api.getMyPraise(openid));
          myPraisePostsRequest.then(response => {
            if (response.statusCode == 200) {
              this.setData({
                readLogs: this.data.readLogs.concat(response.data.data.map(function(item) {
                  count++;
                  item[0] = item.post_id;
                  item[1] = item.post_title;
                  item[2] = '0';
                  return item;
                }))
              });

              this.setData({
                userInfo: app.globalData.userInfo
              });

              if (count == 0) {
                this.setData({
                  shownodata: 'block'
                });
              }
            }
          });
        } else {
          this.userAuthorization();
        }
        break;
      case '5':
        this.setData({
          readLogs: []
        });

        if (app.globalData.openid) {
          var openid = app.globalData.openid;
          var url = Api.getSubscription() + '?openid=' + openid;
          var mySubPostRequest = wxRequest.getRequest(url);
          mySubPostRequest.then(response => {
            if (response.statusCode == 200) {
              var usermetaList = response.data.usermetaList;
              if (usermetaList) {
                this.setData({
                  readLogs: this.data.readLogs.concat(useremetaList.map(function(item) {
                    count++;
                    item[0] = item.ID;
                    item[1] = item.post_title;
                    item[2] = '0';

                    return item;
                  }))
                });

                this.setData({
                  userInfo: app.globalData.userInfo
                });

                if (count == 0) {
                  this.setData({
                    shownodata: 'block'
                  });
                }
              }
            } else {
              console.log(response);
              this.setData({
                showerror: 'block'
              })
            }
          });
        } else {
          this.userAuthorization();
        }
        break;
    }
  },
  userAuthorization: function() {
    wx.getSetting({
      success: function(res) {
        console.log(res.authSetting);
        var authSetting = res.authSetting;
        if (util.isEmptyObject(authSetting)) {
          console.log("第一次授权");
        } else {
          console.log("不是第一次授权", authSetting);
          if (authSetting['scope.userInfo'] == false) {
            wx.showModal({
              title: '用户未授权',
              content: '如需正常使用评论、点赞、赞赏等功能需授权获取用户信息。是否在授权管理中选中“用户信息”?',
              showCancel: true,
              cancelColor: '#296fd0',
              confirmColor: '#296fd0',
              confirmText: '设置权限',
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定');

                  wx.openSetting({
                    success: function(res) {
                      console.log('打开设置', res.authSetting);
                      var scopeUserInfo = res.authSetting['scope.userInfo'];
                      if (scopeUserInfo) {
                        self.getUserInfo();
                      }
                    }
                  })
                }
              }
            })
          }
        }
      }
    })
  },

  getUserInfo: function() {
    var self = this;
    var wxLogin = wxApi.wxLogin();
    var jscode = '';

    wxLogin.then(response => {
      jscode = response.code;
      var wxGetUserInfo = wxApi.wxGetUserInfo();
      return wxGetUserInfo();
    }).then(response => {
      app.globalData.userInfo = response.userInfo;
      this.setData({
        userInfo: response.userInfo
      });

      var url = Api.getOpenidUrl();
      var data = {
        js_code: jscode,
        encryptedData: response.encryptedData,
        iv: response.iv,
        avataUrl: response.userInfo.avataUrl
      }
      var postOpenidRequest = wxRequest.postRequest(url, data);
      postOpenidRequest.then(response => {
        if (response.data.status == '200') {
          console.log('openid 获取成功');
          app.globalData.openid = response.data.openid;
        } else {
          console.log(response.data.message);
        }
      })
    }).catch(error => {
      console.log('error: ' + error.errMsg);

      this.userAuthorization();
    });
  }
  
})
