---
title: 'Introducing React 18'
date: '2022-01-23'
tags: ['javascript', 'react']
draft: false
summary:
---

# Introducing React 18

`React 18 버전`이 수면위로 올라옴에 따라 늦었지만, 해당 내용을 정리해 보고자 한다. 팀 내에서 아직 beta 버전이지만 `Suspense`에 대한 사용하고 싶은 니즈(needs)가 있어 베타버전이지만 사용을 간략하게 해보았고 `production` 레벨까지 반영되지는 못했다. <br />

<br />

| 해당 내용은 `on 28 May 2021`에 작성된 [Introducing React 18](https://github.com/reactwg/react-18/discussions/4)를 참고하여 정리한 내용으로 예전 내용이라 잘못된 부분이 있을 수 있으며 그런 경우 피드백 부탁드립니다. 자세한 내용은 React 공식 문서를 참고하세요.

<br /><br />

## React 18에서 바뀌는 개선사항

React 18에서의 개선사항은 크게 아래 세 가지로 소개되고 있다.

- Automatic batching for fewer renders in React 18
- SSR support for Suspense
- Fixes for Suspense behavior quirks

<br /><br />

### Automatic batching for fewer renders in React 18

`React 18`에서는 일괄처리에 대한 성능 향상이 이루어 졌다고 한다. 일괄 처리에 대한 내용을 간단하게 정리해보자면 여러 상태를 가지는 컴포넌트에서 여러 상태가 한 이벤트에서 함께 변경되는 경우 각 상태에 대한 `re-render`가 일어나지 않고 한 번의 `re-render`로 처리하게 된다. <br />

<br />

아래 코드는 What is batching? 설명글에서 가져온 예시 코드로 위에서 설명한 바처럼 두 가지 상태가 한 이벤트에서 변경된 경우 한 번만 `re-render`가 일어나는 것을 확인할 수 있는 예제이다.

```jsx
function App() {
  const [count, setCount] = useState(0)
  const [flag, setFlag] = useState(false)

  function handleClick() {
    setCount((c) => c + 1) // Does not re-render yet
    setFlag((f) => !f) // Does not re-render yet
    // React will only re-render once at the end (that's batching!)
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? 'blue' : 'black' }}>{count}</h1>
    </div>
  )
}
```

- [Demo: React 17 batches inside event handlers.](https://codesandbox.io/s/spring-water-929i6?file=/src/index.js)(Notice one render per click in the console.)

<br /><br />

하지만 위와 같은 일괄처리는 일관성 없게 동작하는 경우가 있는데, 비동기적으로 데이터 fetch 후 상태를 변경하게 되는 경우 각 상태에 따른 `re-render`가 발생하게 된다. 아래 예제의 경우 fetch 이후 두 가지 상태를 변경하게 되는 경우 `re-render`가 두 번 발생하게 된다.

```jsx
function App() {
  const [count, setCount] = useState(0)
  const [flag, setFlag] = useState(false)

  function handleClick() {
    fetchSomething().then(() => {
      // React 17 and earlier does NOT batch these because
      // they run *after* the event in a callback, not *during* it
      setCount((c) => c + 1) // Causes a re-render
      setFlag((f) => !f) // Causes a re-render
    })
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? 'blue' : 'black' }}>{count}</h1>
    </div>
  )
}
```

- [Demo: React 17 does NOT batch outside event handlers.](https://codesandbox.io/s/trusting-khayyam-cn5ct?file=/src/index.js)(Notice two renders per click in the console.)

<br />

위와 같이 Promise 내부 없데이트, setTimeout 등 기타 이벤트 처리에서는 일괄 처리되지 않는다.

<br />

#### What is automatic batching?

일괄 처리되지 않는 이벤트에 대한 업데이트는 `createRoot`가 있는 `React 18`부터는 모든 이벤트에 대한 일괄 처리를 수행한다. 이로 인해 이벤트마다 불필요하게 `re-render`를 줄여줌으로써 성능 향상을 기대할 수 있다.

```jsx
function App() {
  const [count, setCount] = useState(0)
  const [flag, setFlag] = useState(false)

  function handleClick() {
    fetchSomething().then(() => {
      // React 18 and later DOES batch these:
      setCount((c) => c + 1)
      setFlag((f) => !f)
      // React will only re-render once at the end (that's batching!)
    })
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? 'blue' : 'black' }}>{count}</h1>
    </div>
  )
}
```

- [Demo: React 18 with createRoot batches even outside event handlers!](https://codesandbox.io/s/morning-sun-lgz88?file=/src/index.js) (Notice one render per click in the console!)
- [Demo: React 18 with legacy render keeps the old behavior](https://codesandbox.io/s/jolly-benz-hb1zx?file=/src/index.js) (Notice two renders per click in the console.)

<br />

일괄 처리에 대한 간단한 예제 코드들을 모아서 첨부해둔다.

```jsx
function handleClick() {
  setCount((c) => c + 1)
  setFlag((f) => !f)
  // React will only re-render once at the end (that's batching!)
}

setTimeout(() => {
  setCount((c) => c + 1)
  setFlag((f) => !f)
  // React will only re-render once at the end (that's batching!)
}, 1000)

fetch(/*...*/).then(() => {
  setCount((c) => c + 1)
  setFlag((f) => !f)
  // React will only re-render once at the end (that's batching!)
})

elm.addEventListener('click', () => {
  setCount((c) => c + 1)
  setFlag((f) => !f)
  // React will only re-render once at the end (that's batching!)
})
```

<br />

#### What if I don’t want to batch?

일괄처리가 기본적으로 성능 및 우리가 기대하는 동작으로 적정하지만, 일괄처리를 원하지 않는 경우에는 `ReactDOM.flushSync()`를 사용하여 일괄처리 동작하지 않도록 예외적으로 상태변경도 가능하다고 한다.

<br /><br />

### Upgrading to React 18 on the server

`React 18 버전`부터는 사용하는 API에 따라서 `Suspense` 지원이 달라진다. 기존 React는 Suspense를 전혀 지원하지 않았지만 `renderToString`, `renderToNodeStream`, `renderToPipeableStream` API를 사용하여 지원받을 수 있다.

- `renderToString`: 제한된 Suspense 지원
- `renderToNodeStream`: 전체 Suspense 지원하지만, Deprecated
- `renderToPipeableStream`: 전체 Suspense 지원 및 스트리밍 포함

<br />

기존에 사용되던 `renderToString`는 계속 지원을 하지만 새로운 기능에 대한 개선이 없음으로 `renderToPipeableStream` 권장한다.

<br />

기존 React에서 `Suspense` 사용 시 오류가 발생하였지만 `React 18 버전`부터는 `renderToString`에서 제한된 `Suspense`를 지원한다. `renderToString` 동안 일시중단 후에 Suspense를 대체 HTML로 렌더링을 진행, JS가 로드된 이후 클라이언트에서 렌더링을 시도한다. 이러한 동작을 `hydration`이라고 하며 간단하게 순서대로 설명해 보자면 서버에서 Data fetching 하여 렌더링 된 HTML을 내려보낸다. 브라우저는 HTML을 렌더링하여 노출한 이후 Javascript 코드를 다운로드하여 렌더링 된 HTML과 연결하게 된다.
<br />

`React 18 버전`에서는 `renderToPipeableStream` 사용을 권장하고 있다. Data fetching을 포함한 `Suspense`에 대한 완전한 기능을 지원하고 코드 수플 리팅에 따른 lazy 로드 시 콘텐츠 깜박임 현상도 없앴다고 한다. SSR 렌더링 방식에 있어 서버에서 내려주는 페이지 전체의 HTML을 렌더링하여 `hydration`하는 방식과 다르게 페이지 내의 영역별로 나뉘어 `hydration` 진행이 가능해진다.

<br /><br />

### Behavioral changes to Suspense in React 18

`Suspense`에 대한 지원은 이전 버전에서도 제공하긴 하였지만 `React 18 버전`에서는 조금 다르게 동작할 수 있지만 마이그레이션이 큰 부담은 없을 정도의 변경이라고 한다.

<br />

아래 예로 이전(legacy)과 현재(concurrent) `Suspense`를 비교 설명하는 글이 있는데 이전에 동작은 ComponentThatSuspends에 상관없이 Sibling 컴포넌트는 DOM에 마운트되며 effects/lifecycles이 동작하고 숨김 처리가 된다고 한다. 현재는 Sibling 컴포넌트는 DOM에 마운트 되지 않고 ComponentThatSuspends가 해결 될 때까지 기다린다고 한다.

```jsx
<Suspense fallback={<Loading />}>
  <ComponentThatSuspends />
  <Sibling />
</Suspense>
```

이전 버전의 동작으로 인해 몇몇 라이브러리에서는 [이슈](https://github.com/facebook/react/issues/14536)가 있었다고 한다. 해당 내용을 보니 위와 같은 컴포넌트 구성을 일반적으로 할 수 있다고도 생각된다.

<br /><br />

#### Replacing render with createRoot

변경되는 개선사항 이외에 `React 18 버전`에서는 Root 생성 API에 대한 변화도 있다. 예전 버전에서는 `ReactDOM.render`로 사용되던 API가 `ReactDOM.createRoot`로 변경되었다.

<br />

해당 변경으로 렌더링 시 container를 항상 전달해야 하는 부분이 수정되었고 부분적 `hydration` 지원이 가능하다고 한다.

<br /><br />

## Concurruent features

Concurrent feature에 대한 opt-in 지원도 `React 18 버전`에 릴리즈된다고 한다.

- `startTransition`: 비용이 많이 드는 상태 전환 중에 UI에 대한 응답을 유지 할 수 있도록 해준다.
- `useDeferredValue`: 우선순위가 떨어지는 부분에 대한 업데이트를 연기 할 수 있다.
- `SuspenseList`: 로딩 표시가 나타나는 순서를 조정 할 수 있다.
- 선택적 `hydration`을 통한 SSR: 앱을 더 빠르게 로드하고 상호 작용 할 수 있다.

<br />

위와 같은 사항은 Strict Mode를 활성화하지 않고도 기능을 사용 할 수 있다고 한다.

<br /><br />

추가로 `Suspense`가 기본적인 기능에 포함됨에 따라 Data Fetching에 대한 질문도 많아서인지 What about Suspense for data fetching? 내용도 있었다. 해당 내용에서는 Data Fetching에 대한 솔루션은 포함되지 않을 가능성이 높다고 얘기하고 있으며 해당 부분을 위해서는 서버 구성 요소 및 기본 제공 캐시가 포함되어야 하여 해당 프로젝트는 아직 진행 중이라고 언급되어있다.

<br /><br />

많은 기능이 개선되고 추가됨에 따라 직접 사용해보며 디테일한 기능에 관한 공부를 별도로 해야 할 것 같다. 최근 프로젝트에서 `Suspense` 사용을 위해 `React 18 beta 버전`으로 올리고 사용해보려 했지만 API 연동 중에 프로젝트가 중단되는 상황이 발생하여... 실질적인 `Suspense` 기능은 사용해 보지 못한 상태다. 이후에 `Suspense`를 포함한 `React 18 버전` 기능들을 사용하고 정리해 보아야겠다.

<br /><br />

[Ref]:

- [Introducing React 18](https://github.com/reactwg/react-18/discussions/4)
- [Automatic batching for fewer renders in React 18](https://github.com/reactwg/react-18/discussions/21)
- [Upgrading to React 18 on the server](https://github.com/reactwg/react-18/discussions/22)
- [Behavioral changes to Suspense in React 18](https://github.com/reactwg/react-18/discussions/7)
- [Replacing render with createRoot](https://github.com/reactwg/react-18/discussions/5)

<br /><br /><br />
