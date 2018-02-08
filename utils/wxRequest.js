function wxPromisify(fn) {
  return function(obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function(res) {
        resolve(res);
      },
      obj.fail = function(res) {
        resolve(res);
      }

      fn(obj);
    })
  };
}

Promise.prototype.finally = function(callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => {throw reason})
  );
};

function getRequest(url, data) {
  var getRequest = wxPromisify(wx.request);

  return getRequest({
    url: url,
    method: 'GET',
    data: data,
    header: {
      'Content-Type' : 'application/json'
    }
  });
}

function postRequest(url, data) {
  var postRequest = wxPromisify(wx.request);

  return postRequest({
    url: url,
    method: 'POST',
    data: data,
    header: {
      'Content-Type' : 'application/json' 
    }
  });
}

module.exports = {
  getRequest: getRequest,
  postRequest: postRequest
}