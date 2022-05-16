---
title: 'create-react-app 절대 경로 설정'
date: '2022-05-09'
tags: ['javascript', 'react']
draft: false
summary:
---

# create-react-app 절대 경로 설정

| 해당 내용은 개인적인 공부를 위한 글로 오역 및 개인적인 의견이 반영된 내용이 있을 수 있으니 참고하여 주시기 바라며 문제가 되는 내용이 있는 경우 메일로 피드백 부탁합니다.

새로운 프로젝트에 합류하며 프로젝트 환경설정 등 작업에서 절대 경로 설정 작업을 하며 진행한 내용들을 정리해둔다. 최근까지 `Next.js`로 구축된 프로젝트에서 손쉽게 설정을 하다보니 `CRA`(create-react-app) 프로젝트에서 생각치 못했던 문제들에 부딪혔다.

- 해당글은 `typescript`를 사용하는 환경을 가정하여 작성한다.

<br /><br />

### Next.js Absolute Path

`Next.js` 프로젝트에서는 간단하게 `tsconfig` 파일 `compilerOptions`에서 `baseUrl`을 설정한뒤에 paths에 원하는 경로를 설정할 수 있다.

- [Absolute Imports and Module path aliases](https://nextjs.org/docs/advanced-features/module-path-aliases)

<br /><br />

### In Conclusion

<br /><br />

[Ref]:

- []()

<br /><br /><br />
