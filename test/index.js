'use strict'

var expect = require('chai').expect
var digger = require('../dist/index')
var _ = require('lodash')

describe('dig()', function() {

  it('從傳入的 htmlString 中，採集出 img 物件們', function(done) {
    this.timeout(50)

    digger
    .dig('<div><img src="http://placehold.it/350x150"><img src="http://placehold.it/640x360"></div>')
    .then(function(images) {

      expect(images).to.be.an('array')
      expect(images).to.have.length(2)

      _.each(images, function(img) {

        expect(img).to.include.keys('url')
      })
    })
    .then(done, done)
  })

  it('允許遠端採集圖片寬與高（using http request）', function(done) {
    this.timeout(10000)

    digger
    .dig('<div><img src="http://placehold.it/350x150"><img src="http://placehold.it/640x360"></div>', { remote: true })
    .then(function(images) {

      _.each(images, function(img) {

        expect(img.width).to.be.ok
        expect(img.height).to.be.ok
      })
    })
    .then(done, done)
  })
})
