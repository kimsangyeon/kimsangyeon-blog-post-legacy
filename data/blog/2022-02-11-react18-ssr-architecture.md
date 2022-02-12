---
title: 'New Suspense SSR Architecture in React 18'
date: '2022-02-11'
tags: ['javascript', 'react']
draft: false
summary:
---

# New Suspense SSR Architecture in React 18

`React 18`에 대해 하나씩 공부 중에 `suspense`에 대해 정리해둔 글을 번역해보며 내용을 익혀보자 한다. 2021년 6월에 작성된 글로 `suspense` SSR 아키텍처에 대한 내용을 정리한 글이다.

<br />

| 해당 내용은 `React 18`에 대한 개인적인 공부를 위한 번역글로 오역 및 개인적인 의견이 반영된 내용이 있을 수 있으니 참고하여 주시기 바라며 문제가 되는 내용이 있는 경우 메일로 피드백 부탁합니다.

<br /><br />

## tl;dr

`SSR`(Server Side Rendering)을 사용하면 서버의 React 컴포넌트에서 HTML을 생성하여 사용자에게 전달한다. 이는 SSR을 사용하면 Javascript 번들이 로드 및 실행되기 전에 사용자가 페이지 콘텐츠를 보다 빠르게 볼 수 있도록 제공한다. <br />

<br />

React의 SSR은 항상 여러 단계로 수행된다.

- 서버에서 앱에 대한 데이터를 가져온다.
- 서버에서 HTML을 렌더링하고 응답으로 보내고 클라이언트에서 HTML을 렌더링한다.
- 클라이언트에서 Javascript 코드를 로드한다.
- 클라이언트에서 Javascript 로직을 서버에서 생성하여 전달 받은 HTML에 연결한다. (이것을 `hydration`이라고 한다.)

<br />

여기서 중요한점은 다음 단계가 시작되기 전에 각 단계가 전체 앱에 대해 한 번에 완료되어야 한다.

`React 18`을 사용하면 `suspense`를 사용하여 앱을 더 작은 독립된 단위로 나눌 수 있다. 이 단위는 서로 독립적으로 단계를 수행하며 앱의 나머지 부분을 차단하지 않는다. 결과적으로 사용자는 콘텐츠를 더 빠르게 보고 상호 작용 할 수 있다. 이러한 개선 사항은 특별하게 코드를 조정하지 않아도 자동적으로 수행되는 사항이다.

<br />

이 의미는 `React.lazy`가 이제 SSR에서 자동적으로 수행된다는 것을 의미한다. ([Demo](https://codesandbox.io/s/kind-sammet-j56ro?file=/src/App.js))

[Ref]:

- [New Suspense SSR Architecture in React 18](https://github.com/reactwg/react-18/discussions/37)

<br /><br /><br />
