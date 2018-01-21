import config from 'config.js'

var domain = config.getDomain;
var pageCount = config.getPageCount;
var categoriesID = config.getCategoriesID;
var HOST_URI = 'https://' + domain + '/wp-json/wp/v2/';
var HOST_URI_WATCH_LIFE_JSON = 'https://' + domain + '/wp-json/watch-life-net/v1';

module.exports = {

  // 获取首页轮播图
  getSwiperPosts: function() {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += 'post/swipe';

    return url;
  },

};