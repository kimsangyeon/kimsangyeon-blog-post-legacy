---
title: 'Moment to dayjs'
date: '2022-03-24'
tags: ['javascript', 'moment', 'dayjs']
draft: false
summary:
---

# Moment to dayjs

| 해당 내용은 `moment`에서 `dayjs`전환 과정에 대한 개인적인 공부를 위한 글로 오역 및 개인적인 의견이 반영된 내용이 있을 수 있으니 참고하여 주시기 바라며 문제가 되는 내용이 있는 경우 메일로 피드백 부탁합니다.

<br />

프로젝트 내에서 번들 사이즈 최적화 작업 중 `moment`의 사이즈가 다른 라이브러리에 비해 크다는 것을 인지하고 최적화를 해야겠다는 것에서부터 시작하였다.

<br /><br />

## Moment locale

어떻게 `moment` 사이즈를 줄여볼까 찾아보던 중 웹 팩에서 tree shaking을 통해 필요한 `locale`만 사용하도록 최적화할 수 있는 방법이 있었다.

<br />

`IgnorePlugin`을 사용하여 모든 `locale` 파일을 무시하게 하는 방법

```js
const webpack = require('webpack')
module.exports = {
  //...
  plugins: [
    // Ignore all locale files of moment.js
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
}
```

<br />

그리고 특정 `locale`만 로드되도록 `ContextReplacementPlugin`을 사용하는 방법이 있었다.

```js
const webpack = require('webpack')
module.exports = {
  //...
  plugins: [
    // load `moment/locale/ja.js` and `moment/locale/it.js`
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ja|it/),
  ],
}
```

<br />

해당 사항들을 적용해보며 자료를 찾던 중에 [Moment.js Documentation Project Status](https://momentjs.com/docs/#/-project-status/recommendations/) 글을 보았고... `moment` 프로젝트는 **legacy** 프로젝트이며 다른 라이브러리를 추천하는 글을 보게 되었다.

<br />

`moment`가 legacy 취급이 되며 프로젝트가 deprecated 되는 이유에 대해서 찾아보니 아래와 같은 이유가 있었다.

- moment.js는 현재 legacy 취급을 받고 있음
- regex를 내부적으로 사용하고 있어 다른 date 라이브러리에 비해 느림
- 용량이 무겁고 locale을 트리 쉐이킹 하더라도 다른 가벼운 date 라이브러리에 비해 무거움 (tree shaking에 대한 최적화도 더 이상 이루어지지 않음)
- mutable 하기 때문에 date 값의 변화로 인한 사이드이팩트 고려가 필요
- ...

<br /><br />

## Day.js

위의 이유로 인하여 `moment`를 tree shaking 하기 보다는 다른 라이브러리로 전환하는 작업을 해야겠다고 생각했고, 여러 라이브러리들 중 `dayjs`를 택하게 되었다.

<br />

이유는 엄청나게 가벼운 용량과 `dayjs`는 `moment`를 최소화 하는 것으로 설계되어 `moment`에서 제공되는 API를 대부분 동일하게 제공되어있어 기존에 `moment`를 사용하는 프로젝트에서 전환이 쉽기 때문에 `dayjs`를 선택하게 되었다.

<br />

![moment dayjs](/static/images/posts/moment-to-dayjs.png)

| import cost로 비교한 moment, dayjs

<br />

`moment`에서 `dayjs`로 전환하며 대부분 API가 지원이 되긴 하지만 plugin을 사용하여 `dayjs` 자체에 설정이 필요한 부분도 있었다. 해서 lib 폴더를 따로 구축하여 `dayjs`에서 사용할 plugin을 확장하고 타입을 공용으로 가져와 사용하도록 구성하였다.

<br />

```js
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
...

dayjs.extend(isSameOrAfter);
...

export type {Dayjs} from 'dayjs';

export default dayjs;
```

<br /><br />

## In Conclusion

이번 작업을 하며 느꼈던 것은 우리는 프로젝트 내에서 엄청나게 많은 라이브러리를 사용하게 되는데 해당 라이브러리가 **legacy**가 되었는지 업데이트가 언제 최신으로 이루어져 있는지는 일일이 찾아보지 않는 것 같다. 이러한 부분들은 향후 문제가 될 수 도 있을 것 같다는 생각도 하며 문제가 터진 이후에 대처하게 되는 일이 발생 할 수 있다고 생각이 되었다. 이번 번들 사이즈 최적화 작업을 하며 `moment`에 대한 최적화도 하지 않았더라면 `moment`가 **legacy** 프로젝트가 되었다는 것도 뒤늦게 알았을 것이다. 많은 라이브러리를 사용하고 있지만 이들 모두를 일일이 항상 업데이트를 확인하며 그에 맞는 대응을 하는 것은 쉽지 않을 것으로 생각이 들지만, 번들 사이즈 최적화 같은 작업을 지속해서 하며 이번과 같이 작은 라이브러리들에 대한 신경도 써야겠다고 생각하였다. <br />
다른 프로젝트 혹은 회사에서는 이러한 것들을 지속해서 관리하며 업데이트하는지, 하고 있다면 어떻게 하고 있는지가 궁금하며 혹시나 이 글을 읽고 이에 대한 본인의 프로젝트 관리를 공유해 주고 싶으신 분은 블로그 아래 메일로 연락 부탁드립니다.

<br /><br />

[Ref]:

- [Moment.js Project Status](https://momentjs.com/docs/#/-project-status/recommendations/)
- [moment - npm](https://www.npmjs.com/package/moment)
- [dayjs - npm](https://www.npmjs.com/package/dayjs)

<br /><br /><br />
