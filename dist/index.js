(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'image-size', 'request-promise', 'cheerio'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('image-size'), require('request-promise'), require('cheerio'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.imageSize, global.request, global.$);
    global.index = mod.exports;
  }
})(this, function (exports, module, _imageSize, _requestPromise, _cheerio) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _imageSize2 = _interopRequireDefault(_imageSize);

  var _request = _interopRequireDefault(_requestPromise);

  var _$ = _interopRequireDefault(_cheerio);

  function dig(htmlString) {
    var opt = arguments[1] === undefined ? {} : arguments[1];

    // 允許程式將解析出來的 img(src) 遠端下載回來再次解析寬與高..等資訊
    var ALLOW_REMOTE = opt.remote === true ? true : false;

    if (typeof htmlString !== 'string') {
      return Promise.reject('First arg of type ' + typeof htmlString + ', expected string');
    }

    var images = [];
    var $body = (0, _$['default'])(htmlString);
    var $images = $body.find('img');[].forEach.call($images, function (item) {

      var image = {};

      image.url = (0, _$['default'])(item).attr('src');
      image.alt = (0, _$['default'])(item).attr('alt');

      images.push(image);
    });

    if (ALLOW_REMOTE !== true) {
      return Promise.resolve(images);
    }

    // 遠端下載圖片並解析寬與高..等資訊
    return new Promise(function (ok) {

      var sizeProbes = [];

      images.forEach(function (image) {
        if (image.url) {
          (function () {
            var probed = Promise.defer();
            var chunks = [];

            (0, _request['default'])({ method: 'GET', url: image.url }).on('data', function (chunk) {
              chunks.push(chunk);
            }).on('end', function () {
              var buffer = Buffer.concat(chunks);
              var imgInfo = (0, _imageSize2['default'])(buffer);

              image.width = imgInfo.width;
              image.height = imgInfo.height;

              probed.resolve();
            });

            sizeProbes.push(probed.promise);
          })();
        }
      });

      Promise.all(sizeProbes).then(responseImages, responseImages);

      //
      function responseImages() {
        ok(images);
      }
    });
  }

  module.exports = {
    dig: dig
  };
});