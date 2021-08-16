---
title: 'The canvas pattern'
date: '2019-03-19'
tags: ['javascript', 'canvas']
draft: false
summary: 루프를 사용하여 만드는 패턴 외에 createPattern 메소드를 사용하여 패턴을 만들 수 있습니다.
---

#### pattern

루프를 사용하여 만드는 패턴 외에 createPattern 메소드를 사용하여 패턴을 만들 수 있습니다. <br />

<br />

createPattern(image, type)

- image는 CanvasImageSource(즉, HTMLImageElement, 다른 캔버스, video 요소 등등)입니다. type은 이미지 사용 방법을 나타내는 문자열입니다.
- type: repeat, repeat-x, repeat-y, no-repeat

<br />

```javascript
function draw() {
  var ctx = document.getElementById('canvas').getContext('2d')

  // 패턴으로 사용할 이미지 오브젝트를 생성한다
  var img = new Image()
  img.src = 'https://mdn.mozillademos.org/files/222/Canvas_createpattern.png'
  img.onload = function () {
    // 패턴을 생성한다
    var ptrn = ctx.createPattern(img, 'repeat')
    ctx.fillStyle = ptrn
    ctx.fillRect(0, 0, 150, 150)
  }
}
```

![pattern Image](/static/images/posts/canvas_pattern.png)

<br />

<br /><br /><br />
