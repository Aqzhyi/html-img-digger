# html-img-digger

## Usage

#### Basic

```js
import digger from 'html-img-digger'

let tpl = '<div><img src="http://placehold.it/350x150"></div>'
let images = digger.dig(tpl)
```

> images

```js
[
  {
    url: 'http://placehold.it/350x150',
    alt: '',
  },
]
```

#### Download remote images (size digs, but slower)

```js
let tpl = '<div><img src="http://placehold.it/350x150"></div>'
let images = digger.dig(tpl, { remote: true })
```

> images

```js
[
  {
    url: 'http://placehold.it/350x150',
    alt: '',
    width: 350,
    height: 150,
  },
]
```

## Development

```sh
npm run dev
```

## Test

```sh
npm test
```

```
dig()
  ✓ 從傳入的 htmlString 中，採集出 img 物件們
  ✓ 允許遠端採集圖片寬與高（using http request） (651ms)
```
