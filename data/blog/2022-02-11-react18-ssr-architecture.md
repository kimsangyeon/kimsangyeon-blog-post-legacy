---
title: 'New Suspense SSR Architecture in React 18'
date: '2022-02-11'
tags: ['javascript', 'react']
draft: false
summary:
---

# New Suspense SSR Architecture in React 18

`React 18`에 대해 하나씩 공부 중에 `Suspense`에 대해 정리해둔 글을 번역해보며 내용을 익혀보자 한다. 2021년 6월에 작성된 글로 `Suspense` SSR 아키텍처에 대한 내용을 정리한 글이다.

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

`React 18`을 사용하면 `Suspense`를 사용하여 앱을 더 작은 독립된 단위로 나눌 수 있다. 이 단위는 서로 독립적으로 단계를 수행하며 앱의 나머지 부분을 차단하지 않는다. 결과적으로 사용자는 콘텐츠를 더 빠르게 보고 상호 작용 할 수 있다. 이러한 개선 사항은 특별하게 코드를 조정하지 않아도 자동적으로 수행되는 사항이다.

<br />

이 의미는 `React.lazy`가 이제 SSR에서 자동적으로 수행된다는 것을 의미한다. ([Demo](https://codesandbox.io/s/kind-sammet-j56ro?file=/src/App.js)) <br />

<br /><br />

## What is SSR?

사용자가 앱을 로드할 때 가능한 한 빠르게 상호작용이 가능한 페이지를 표시하기를 원할 것이다. 그러나 페이지에 대한 Javascript 코드가 완전히 로드되기 전까지는 페이지에 상호작용 할 수 없다. 로드 시간의 대부분이 애플리케이션의 코드를 다운로드하는데 소비되며 SSR을 사용하지 않는 경우 Javascript가 로드되는 동안 사용자에게 표시되는 것은 빈 페이지 일 것이다. <br />

<br />

위와 같은 이유로 SSR 사용을 권항하며 서버의 React 컴포넌트를 HTML로 렌더링하여 사용자에게 미리 보낼 수 있다. HTML은 Javascript가 로드되는 동안에는 상호작용 할 수 없지만 사용자가 미리 로드되는 페이지를 확인 할 수 있다. <br />

Javacript가 로드되는 동안에는 버튼을 클릭하는 등의 동작이 수행되지는 않지만 콘텐츠가 많은 웹 사이트의 경우 SSR은 Javascript가 로드 되는 동안 사용자가 미리 콘텐츠를 읽거나 볼 수 있도록 제공해 준다. <br />

<br />

React와 애플리케이션 코드가 모드 로드되면 HTML이 상호 작용할 수 있도록 HTML에 이벤트 핸들러를 연결 하도록 하며 이를 `hydration`이라고 한다. 이는 이벤트 핸들러라는 물을 건조한 HTML에 주는 것에 비유한 것이라고 한다. <br />

<br />

HTML과 Javascript 코드가 `hydration` 이후에는 버튼 클릭 등의 동작이 정상적으로 수행된다. <br />

<br />

실제로 앱이 상호 작용하게 되는 순간의 속도가 빨라지지는 않지만 Javscript가 로드되는 동안 사용자는 정적 콘텐츠를 미리 볼 수 있으므로 사용자에게는 성능적으로 향상된 것처럼 느낄 수 있다. <br />

<br /><br />

## What Are the Problems with SSR Today?

위에서 소개된 방식은 좋은 효과를 기대 할 수 있으나 최적의 효과는 아니다. 오늘날 SSR의 한 가지 문제는 API를 사용하면 HTML로 렌더링할 때 서버의 컴포넌트에 대한 모든 데이터가 준비되어 있어야 한다. 즉, HTML를 클라이언트에 보내기 전에 서버의 모든 데이터를 수집해야한다. <br />

<br />

예로 게시물을 렌더링한다고 했을때 게시물의 데이터가 큰 경우 서버에서 생성하는 HTML의 생성이 게시물의 데이터를 받아와 렌더링하여 클라이언트에 전송하기까지 지연 될 수 있다. 이로 인하여 게시물 외의 페이지의 다른 영역의 렌더링 또한 지연되게 된다. <br />

<br />

그리고 Javascript 코드가 로드된 후 HTML을 `hydration`하고 상호작용할 수 있도록 React에 전달한다. React는 컴포넌트를 렌더링 하는 동안 서버에서 생성한 HTML에 이벤트 핸들러를 첨부한다. 이때 React에서 생성된 트리가 서버에서 생성된 트리와 일치해야 정상적인 `hydration`이 이루어 진다. 만약 게시물 Javascript 코드가 큰 경우 게시물 코드가 로드 되지 전까지 다른 영역의 `hydraion` 또한 지연될 것이다. <br />

<br />

오늘날 React는 한번의 `hydration`만 수행하며 이는 전체 트리에 대해서 작업을 완료할때까지 기다려야 한다는 것을 의미한다. <br />

<br />

### How can we solve these problems?

- 데이터 가져오기(서버) -> HTML로 렌더링(서버) -> 코드 로드(클라이언트) -> Hydration(클라이언트)

앱에서는 위의 형태로 단계적으로 동작을 수행 앱 전체에 대해서 수행한다. 위에서 설명하였던 문제를 해결하기 위해 앱 대신 화면의 일부에 대해 위 단계별로 수행 할 수 있도록 작업을 분리하였다. <br />

<br />

이를 위해 2018년에 `Suspense>` 컴포넌트를 도입했고 이때는 클라이언트에서 지연 로드 코드에 대해서만 지원이 되었다. 하지만 목표는 서버 렌더링을 고려하여 위와 같은 문제를 해결 하는 것이였다. <br />

<br /><br />

## React 18: Streaming HTML and Selective Hydration

React 18에서의 `Suspense`는 두가지 주요한 기능이 있다.

- 서버에서 HTML 스트리밍을 위해서는 renderToString -> renderToPipeableStream 메서드로 전환해야한다.
- 클라이언트에서 선택적 `Hydration`을 위해서는 클라이언트에서 createRoot로 전환 후 `<Suspense>`로 앱의 일부를 래핑해야한다.

<br />

### Streaming HTML before all the data is fetched

오늘날 SSR에서는 모든 HTML을 렌더링한다.

```jsx
<main>
  <nav>
    <!--NavBar -->
    <a href="/">Home</a>
   </nav>
  <aside>
    <!-- Sidebar -->
    <a href="/profile">Profile</a>
  </aside>
  <article>
    <!-- Post -->
    <p>Hello world</p>
  </article>
  <section>
    <!-- Comments -->
    <p>First comment</p>
    <p>Second comment</p>
  </section>
</main>
```

그런다음 모든 코드를 로드하고 전체 앱을 `hydration`을 한다. <br />

<br />

그러나 React 18은 페이지 일부를 `<Suspense>`로 래핑하여 해당 부분이 준비가 될때까지 대체 컴포넌트로 표시되어야 한다고 React에 알려준다.

```jsx
<Layout>
  <NavBar />
  <Sidebar />
  <RightPane>
    <Post />
    <Suspense fallback={<Spinner />}>
      <Comments />
    </Suspense>
  </RightPane>
</Layout>
```

<br />

Comments를 `Suspense`로 묶음으로써 React에 페이지의 나머지 부분에 대해 HTML 스트리밍을 기다리지 않아도되며 대신 Comments 자리에는 Spinner를 표시자로 대체한다.

![Suspense fallback](/static/images/posts/react18-ssr-architecture-1.png)

<br />

여기서 Comments 데이터가 서버에서 준비되면 React는 HTML을 동일한 스트림에 보내고 해당 HTML을 올바른 위치에 넣기 위한 최소한의 script 태그를 보낸다.

```jsx
<div hidden id="comments">
  <!-- Comments -->
  <p>First comment</p>
  <p>Second comment</p>
</div>
<script>
  // This implementation is slightly simplified
  document.getElementById('sections-spinner').replaceChildren(
    document.getElementById('comments')
  );
</script>
```

이는 서버에서 HTML을 렌더링하기 위하여 모든 데이터를 가져올 필요가 없도록 도와주며 데이터를 가져오기 위해 지연되던 문제를 해결해준다. <br />

<br />

### Hydrating the page before all the code has loaded

이제 서버에서 모든 데이터가 로드되기전 HTML을 더 일찍 보낼 수 있지만 Javascript 코드가 모두 로드 될때까지 클라이언트에서 `hydration`을 시작 할 수는 없다. 코드 크기가 크면 시간이 오래 걸릴 수 있다. <br />

큰 번들을 피하기위해 일반적으로 `code splitting`을 사용한다. 번들라가 별도의 script 태그로 분할하거나 React.lazy로 코드 분할을 사용하여 기본 번들에서 코드를 분할 할 수 있다. <br />

```jsx
import { lazy } from 'react'

const Comments = lazy(() => import('./Comments.js'))

// ...

;<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

<br />

React 18에서는 `Suspense`를 사용하면 Comments 코드가 로드되기 전에 앱을 `hydration`할 수 있다. 이는 선택적 `hydration`이며 Comments를 `Suspense`로 래핑하여 페이지의 나머지 부분이 스트리밍 되는것을 차단하지 않도록 React에게 알려준다. 이제 모든 코드가 로드되기 전까지 `hydration`을 기다리지 않으며 React는 부분적으로 `hydration`을 수행한다.

<br />

### Interacting with the page before all the components have hydrated

`Suspense`로 부분적으로 `hydration`을 수행하며 미리 렌더링된 요소에 대해서 상호작용을 차단하지 않는다.

![Suspense fallback](/static/images/posts/react18-ssr-architecture-2.png)

React 18에서 브라우저가 이벤트 처리 될 수 있도록 작은 간격으로 동작하며 사용자가 모든 콘텐츠가 로드되기전에 상호작용하여 다른 곳으로 이동 할 수 있다.
<br />

<br />

만약 여러 요소들이 `Suspense`로 래핑되어있는 경우 React는 트리의 앞 부분 부터 시작하여 `hydration`을 시도한다. 하지만 사용자가 미리 렌더링된 HTML에 상호작용을 시도하는 경우 사용자 상호작용에 우선하여 해당 컴포넌트가 우선적으로 `hydration`을 수행하게 된다.

![Suspense fallback](/static/images/posts/react18-ssr-architecture-3.png)

React에서 클릭이 발생했음을 기록하고 기록된 클릭 이벤트를 컴포넌트가 상호 작용에 응답하도록 한다.

![Suspense fallback](/static/images/posts/react18-ssr-architecture-4.png)

<br /><br />

## Demo

새로운 Suspense SSR 아키텍쳐가 어떻게 작동하는지 확인 할 수 있는 데모: [demo you can try](https://codesandbox.io/s/kind-sammet-j56ro?file=/src/App.js)

<br /><br />

## In Conclusion

React 18은 SSR에 대하 두 가지 주요 기능을 제공

- HTML 스트리밍을 사용하면 원하는 만큼 빨리 HTML을 내보내고 적절한 위치에 배치하는 script 태그와 함께 추가 콘텐츠에 대한 HTML을 스트리밍 할 수 있다.
- 선택적 `Hydration`을 사용하면 나머지 HTML 및 Javascript 코드가 모두 다운로드 되기 전에 빠르게 앱의 `hydration`을 시작할 수 있다. 또한 사용자가 상호 작용하는 부분에 우선적인 `hydration`이 수행되도록 제공한다.

이는 React의 SSR에 대한 세 가지 오래된 문제점을 해결하게 도와준다.

- 서버에서 HTML을 내보내기 전에 데이터가 서버에 모두 로드 될때까지 기다릴 필요가 없다.
- `hydration`을 위하여 모든 Javascript가 로드될 때까지 기다릴 필요가 없다.
- 페이지 상호 작용을 위해여 모든 컴포넌트가 `hydration` 될 때까지 기다릴 필요없이 사용자가 상호 작용하는 컴포넌트를 우선적으로 `hydration` 할 수 있다.

<br /><br />

[Ref]:

- [New Suspense SSR Architecture in React 18](https://github.com/reactwg/react-18/discussions/37)

<br /><br /><br />
