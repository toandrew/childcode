import config from 'config.js'

var domain = config.getDomain;
var pageCount = config.getPageCount;
var categoriesID = config.getCategoriesID;
var HOST_URI = 'https://' + domain + '/wp-json/wp/v2/';
var HOST_URI_WATCH_LIFE_JSON = 'https://' + domain + '/wp-json/watch-life-net/v1/';

module.exports = {

  // 获取首页轮播图
  getSwiperPosts: function() {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += 'post/swipe';

    return url;
  },

  // 获取文章列表数据
  getPosts: function(obj) {
    var url = HOST_URI + 'posts?per_page=' + pageCount + "&orderby=date&order=desc&page=" + obj.page;

    if (obj.categories != 0) {
      url += '&categories=' + obj.categories;
    } else if (obj.search != '') {
      url += '&search=' + encodeURIComponent(obj.search);
    }

    return url;
  },

  getWeiXinComment: function(openid) {
    return HOST_URI_WATCH_LIFE_JSON + 'comment/get?openid=' + openid;
  },

  getMyLike: function(openid) {
    return HOST_URI_WATCH_LIFE_JSON + 'post/mylike?openid=' + openid;
  }
};