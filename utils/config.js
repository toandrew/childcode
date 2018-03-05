var DOMAIN = 'www.watch-life.net';
var PAGECOUNT = 10;

var INDEX_NAV = [
  {id: '1', name: '微店', image: '../../images/shop.png', redirectlink: 'pages/shelf/shelf', redirecttype: 'app', appid: ''},
  {id: '2', name: '排行', image: '../../images/ranking.png', redirectlink: '../hot/hot', redirecttype: 'page', appid: ''},
  {id: '3', name: '专题', image: '../../images/topic.png', redirectlink: '../topic/topic', redirecttype: 'page', appid: ''},
]

export default {
  getIndexNav: INDEX_NAV,
  getDomain: DOMAIN,
  getPageCount: PAGECOUNT,
}