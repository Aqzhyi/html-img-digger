import imageSize from 'image-size'
import request from 'request-promise'
import $ from 'cheerio'

function dig(htmlString, opt = {}) {

  // 允許程式將解析出來的 img(src) 遠端下載回來再次解析寬與高..等資訊
  const ALLOW_REMOTE = (opt.remote === true) ? true : false

  if (typeof htmlString !== 'string') {
    return Promise.reject(`First arg of type ${typeof htmlString}, expected string`)
  }

  let images = []
  let $body = $(htmlString)
  let $images = $body.find('img')

  ;[].forEach.call($images, (item) => {

    let image = {}

    image.url = $(item).attr('src')
    image.alt = $(item).attr('alt')

    images.push(image)
  })

  if (ALLOW_REMOTE !== true) {
    return Promise.resolve(images)
  }

  // 遠端下載圖片並解析寬與高..等資訊
  return new Promise((ok) => {

    let sizeProbes = []

    images.forEach((image) => {
      if (image.url) {
        let probed = Promise.defer()
        let chunks = []

        request({method: 'GET', url: image.url})
        .on('data', (chunk) => {
          chunks.push(chunk)
        })
        .on('end', () => {
          let buffer = Buffer.concat(chunks)
          let imgInfo = imageSize(buffer)

          image.width = imgInfo.width
          image.height = imgInfo.height

          probed.resolve()
        })

        sizeProbes.push(probed.promise)
      }
    })

    Promise
    .all(sizeProbes)
    .then(responseImages, responseImages)

    //
    function responseImages() {
      ok(images)
    }
  })
}

export default {
  dig
}
