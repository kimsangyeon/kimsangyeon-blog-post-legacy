---
title: 'Next.js 번들 사이즈 최적화'
date: '2022-03-21'
tags: ['javascript', 'next.js']
draft: false
summary:
---

# Next.js 번들 사이즈 최적화

| 해당 내용은 `Next.js 12`에 대한 개인적인 공부를 위한 글로 오역 및 개인적인 의견이 반영된 내용이 있을 수 있으니 참고하여 주시기 바라며 문제가 되는 내용이 있는 경우 메일로 피드백 부탁합니다.

<br />

프로젝트 내에서 번들 사이즈 최적화를 위해 했던 작업을 짧게나마 정리해보고자 글을 써본다. <br />

<br /><br />

## bundle-analyzer

처음 시작은 Next.js 프로젝트에서 프로덕션 빌드 중에 소스 맵을 생성하는 모듈인 `@zeit/next-source-maps`가 **deprecated**된 것을 확인하고 수정하는 것에서 시작하였다.

![next-source-map](/static/images/posts/next-bundle-script-1.png)

<br />

위 모듈은 Next.js에서 소스맵을 기본적으로 제공하게 되며 **deprecated**되었다. 기존에는 아래 형태로 `withSourceMaps`으로 next.config.js에서 설정을 랩핑하여 사용하였다.

```js
// next.config.js
const withSourceMaps = require('@zeit/next-source-maps')
module.exports = withSourceMaps({
  webpack(config, options) {
    return config
  },
})
```

<br />

`withSourceMaps`를 제거하며 무언가 빌드 적인 부분에서 개선할 것이 없을까 하며 찾던 중에 `bundle-analyzer`를 찾게 되었고 `@next/bundle-analyzer`를 사용하여 빌드 분석 결과를 쉽게 확인할 수 있도록 제공해주는 설정을 추가하였다.

```js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer({
  webpack(config, options) {
    return config
  },
})
```

`withBundleAnalyzer`로 설정을 랩핑한 이후에 빌드 스크립트를 사용하여 환경 변수 ANALYZE를 true로 설정하여 빌드 실행 시 UI적으로 손쉽게 빌드 결과물을 확인할 수 있도록 제공해 준다.

<br />

빌드 결과물은 기본적으로 `client.html`과 `server.html`로 나뉘어 결과를 분석하여 보여준다.

![next-source-map](/static/images/posts/next-bundle-script-2.png)

<br />

번들 사이즈 최적화를 위해서 시작은 빌드 결과물을 분석하여 빌드 결과의 용량을 많이 차지하는 부분을 최소화하는 작업이 필요하다. 처음으로 눈에 띄었던 것은 `exceljs` 모듈이었다. 페이지 내의 데이터 결과를 엑셀로 변환하기 위해 사용하던 모듈로 용량이 상당히 크다. (ref. [exceljs](https://www.npmjs.com/package/exceljs))

<br />

코드를 분석하여 확인해본 결과 해당 `exceljs` 모듈은 레이어 내에서만 사용하는 것을 확인하였고, 레이어가 뜬 상황에서만 해당 모듈이 제공되도록 수정하는 것이 좋을 것으로 보였다. 그런데 확인 중 실제 레이어 코드 또한 버튼 클릭 동작으로 레이어가 호출된 이후에 스크립트를 불러와도 좋겠다는 생각이 들었다.

<br />

수정은 레이어가 호출된 이후에 레이어 코드를 포함한 `exceljs` 모듈을 가져오도록 `next/dynamic`을 사용하여 스크립트가 동적 로딩되도록 수정하였다. 로컬 기준으로 특정 페이지 스크립트 용량이 1MB 이상 줄어든 것을 확인할 수 있었다.

```jsx
// ex
import dynamic from 'next/dynamic';

const Layer = dynamic(() => import('./Layer'));

const Page = () => (
  ...
    {open && <Layer>}
  ...
);

```

<br />

스크립트 용량으로 1MB는 큰 차이라고 생각되며 프로덕션 환경에서는 이보다는 미미하겠지만 스크립트 용량이 줄어듦으로써 초기 페이지 로딩 속도도 개선될 것으로 기대할 수 있다.

<br /><br />

## Import cost

번들 사이즈 최적화를 위해 두 번째로 사용한 방법으로는 vs code에서 제공하는 `Import cost`라는 확장 플러그인을 사용하였다. <br />

<br />

해당 플러그인을 설치 후에 활성화하면 import된 각 모듈의 용량을 시각적으로 확인할 수 있었다.

<br />

예로는 `lodash`와 같은 모듈에서 필요한 util 코드만 개별적으로 import하여 사용하는 방식으로 모듈 사이즈를 최소화하여 사용하는 것을 보여주고 있다.

![import cost](https://file-wkbcnlcvbn.now.sh/import-cost.gif)

<br /><br />

## In Conclusion

이러한 시각적인 정보들을 적절하게 활용하여 조금 더 쉽게 성능 개선 포인트에 접근하여 조금씩이나마 프로젝트를 개선해 나가야겠다. 사실상 현재 크게 성능상에 문제가 되는 부분은 없지만 이러한 성능개선을 해봄으로써 실제 성능개선이 필요한 상황에서 적절하게 대응할 수 있도록 공부해나가야겠다.

<br /><br />

[Ref]:

- [next-source-maps](https://www.npmjs.com/package/@zeit/next-source-maps)
- [next-bundle-analyzer](https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer)
- [import cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)

<br /><br /><br />
