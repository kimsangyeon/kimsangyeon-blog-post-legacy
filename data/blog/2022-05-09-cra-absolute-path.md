---
title: 'create-react-app 절대 경로 설정'
date: '2022-05-09'
tags: ['javascript', 'react']
draft: false
summary:
---

# create-react-app 절대 경로 설정

| 해당 내용은 개인적인 공부를 위한 글로 오역 및 개인적인 의견이 반영된 내용이 있을 수 있으니 참고하여 주시기 바라며 문제가 되는 내용이 있는 경우 메일로 피드백 부탁합니다.

새로운 프로젝트에 합류하며 프로젝트 환경설정 등 작업에서 절대 경로 설정 작업을 하며 진행한 내용들을 정리해둔다. 최근까지 `Next.js`로 구축된 프로젝트에서 손쉽게 설정하다 보니 `CRA`(create-react-app) 프로젝트에서 생각지 못했던 문제들에 부딪혔다.

- 해당 글은 `typescript`를 사용하는 환경을 가정하여 작성한다.

<br /><br />

### Next.js Absolute Path

`Next.js` 프로젝트에서는 간단하게 `tsconfig` 파일 `compilerOptions`에서 `baseUrl`을 설정한 뒤에 paths에 원하는 경로를 설정할 수 있다.

- [Absolute Imports and Module path aliases](https://nextjs.org/docs/advanced-features/module-path-aliases)

<br /><br />

### CRA Absolute Path

`React` 환경에서 절대 경로를 설정한다면 `jsconfig` 혹은 `tsconfig`에서의 수정부터 시작할 것이다. 위에 설명하였던 `Next.js`에서의 절대 경로 설정과 크게 다를 바가 없다.

<br />

```json
// tsconfig.json
{
  "compilerOptions": {
    ...
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["components/*"]
    }
  }
}

```

위와 같이 설정 이후에 IDE(vscode)에서 해당 경로를 사용하여 `import` 경로를 설정하였을 때 `error` 표기는 보이지 않을 것이다.

```tsx
import Button from '@/components/Button";
...
```

<br />

이후 브라우저에서 해당 환경을 실행할 경우에 다음과 같은 에러를 만나게 된다.

```
Module not found: Error: Can't resolve '@/components/Button'
```

<br />

이는 `typescript` 컴파일 시에 경로는 `tsconfig`를 활용하여 경로 추적이 가능하지만, 실제 `webpack` 번들에서는 해당 경로가 고려되지 않은 채 빌드되어 번들 파일이 생성되고, 브라우저에서 스크립트 실행 시 해당 경로를 추적하지 못하여 모듈을 찾지 못하여 에러가 발생하는 것이다.

<br />

빌드 시 경로 설정을 위해서는 `webpack.config`에서의 경로 설정 또한 필요하다.

```js
// webpack.config.js
const path = require('path')

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },
}
```

<br />

하지만 `CRA` 프로젝트에서 `webpack` 설정을 위해서는 `eject`를 하여야 하는데 `eject`시 `webpack` 커스터마이징은 가능하지만 많은 패키지들의 의존성 등의 관리를 포함하여 복잡성과 유지보수에 어려움이 생길 수 있다.

<br /><br />

#### craco

미리 얘기하자면 `craco` 사용은 실패하였고 이유는 `craco`는 `CRA` 4버전까지만 지원을 하기 때문이다.

<br />

일단 처음 시도는 검색하였을 때 가장 많이 노출되는 `craco`라는 라이브러리로 작업을 시작하였지만, 위에 말한 이유로 해당 작업은 롤백하였다. 현재 사용하고 있는 프로젝트는 `CRA` 5버전이었고 Support 글을 대충 본 나를 채찍질한다.

<br />

일단 가장 많이 사용되는 환경이어서 그런지 블로그 등 가장 많이 노출되는 `craco`는 이제는 사용하지 않는 것을 추천한다. 어떤 글에서는 해결법으로 `CRA`?버전을 4버전으로 낮췄다는 글도 있었지만 이러한 방법은 개인적으로 좋지 않은 방법이라 판단하였다.

<br /><br />

#### react-app-rewired

두 번째 선택 방법은 `react-app-rewired`라는 모듈을 사용하는 방법이었다. 해당 방법 또한 `craco`처럼 `eject`하지 않고 `CRA`에서 `webpack` 구성을 설정할 수 있게 도와준다.

<br />

혹시나 해서 프로젝트 내에서 `CRA` 버전 및 `webpack` 버전에 대한 이슈 및 작업을 확인해보았는데 정상적으로 모두 처리된 것을 확인하였다.

- [react-app-rewired](https://github.com/timarney/react-app-rewired)

<br />

기본적인 설정은 `cra` 설정에 접근하기 위해 `react-app-rewired`로 `react-scripts`를 변경한다. 그리고 `webpack` 설정을 오버라이드 하기 위해 `customize-cra` 모듈을 사용하여 `config-overrides.js` 파일을 생성하여 `webpack` 설정을 추가하여 커스터마이징 할 수 있다.

```js
// config-overrides.js
const { override, addWebpackAlias } = require('customize-cra')
const path = require('path')

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src/'),
  })
)
```

해당 설정을 통하여 `webpack` 번들시 설정된 경로를 추적할 수 있게 되며 이전에 설정하였던 `tsconfig`에서의 설정도 동일하게 해주어야 한다.

<br /><br />

### In Conclusion

사용할 모듈을 검색하여 찾다 보면 블로그 내에서 사용한 후기들을 참고하는 경우가 많은 것 같다. 이때 사용에 대한 후기 정도만 참고하고 실제 모듈의 프로젝트의 문서를 확인하는 것을 잊지 말아야겠다. 새로운 라이브러리가 많이 생기고 업데이트되는 만큼 많은 라이브러리가 없어지거나 deprecated 되는 것을 잊지 말아야겠다. 또한 모듈 간의 버전 의존성이 존재하기 때문에 모듈을 도입할 때는 항상 이러한 문제점들을 잘 고려하여 도입하도록 해야 하는 것을 잊지 말자.

<br /><br />

[Ref]:

- [react-app-rewired](https://github.com/timarney/react-app-rewired)
- [craco](https://github.com/gsoft-inc/craco)

<br /><br /><br />
