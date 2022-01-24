---
title: 'Introducing React 18'
date: '2022-01-23'
tags: ['javascript', 'react']
draft: false
summary:
---

# Introducing React 18

`React 18 버전`이 수면위로 올라옴에 따라 늦었지만 해당 내용을 정리해 보고자 한다. 팀내에서 아직 beta 버전이지만 `suspense`에 대한 사용하고싶은 니즈(needs)가 있어 베타버전이지만 사용을 간략하게 해보았고 `production` 레벨까지 반영되지는 못했지만 한 가지 문제를 제외하고는 사용하는데 문제는 없었다. 한 가지 있었던 문제에 대해서는 아래에서 정리해보도록 하겠다. <br />

<br />

| 해당 내용은 `on 28 May 2021`에 작성된 [Introducing React 18](https://github.com/reactwg/react-18/discussions/4)를 참고하여 정리한 내용으로 예전내용이라 잘못된 부분이 있을 수 있으며 그런 경우 피드백 부탁드립니다. 자세한 내용은 React 공식 문서를 참고하세요.

<br /><br />

## React 18에서 바뀌는 개선사항

React 18에서의 개선사항은 크게 아래 세가지로 소개되고 있다.

- Automatic batching for fewer renders in React 18
- SSR support for Suspense
- Fixes for Suspense behavior quirks

<br /><br />

### Automatic batching for fewer renders in React 18

`React 18`에서는 일괄처리에 대한 성능 향상이 이루어 졌다고한다. 일괄 처리에 대한 내용을 간단하게 정리해보자면 여러 상태를 가지는 컴포넌트에서 여러 상태가 한 이벤트에서 함께 변경되는 경우 각 상태에 대한 `re-render`가 일어나지 않고 한번의 `re-render`로 처리하게된다. <br />

<br />

아래 코드는 What is batching? 설명글에서 가져온 예시 코드로 위에서 설명한 바와같이 두가지 상태가 한 이벤트에서 변경된 경우 한번만 `re-render`가 일어나는것을 확인 할 수있는 예제이다.

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

하지만 위와 같은 일괄처리는 일관성 없게 동작하는 경우가 있는데, 비동기적으로 데이터 fetch 후 상태를 변경하게 되는 경우 각 상태에 따른 `re-render`가 발생하게된다. 아래 예제의 경우 fetch 이후 두가지 상태를 변경하게 되는경우 `re-render`가 두번 발생하게 된다.

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

위와 같이 Promise 내부 없데이트, setTimeout 등 기타 이벤트 처리에서는 일괄 처리 되지 않는다.

<br />

#### What is automatic batching?

위와 같이 일괄 처리 되지 않는 이벤트에 대한 업데이트는 `createRoot`가 있는 `React 18`부터는 모든 이벤트에 대한 일괄 처리를 수행한다. 이로인해 이벤트마다 불필요하게 `re-render`를 줄여줌으로서 성능 향상을 기대할 수 있다.

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

일괄처리가 기본적으로 성능 및 우리가 기대하는 동작으로 적정하지만 일괄처리를 원하지 않는 경우에는 `ReactDOM.flushSync()`를 사용하여 일괄처리 동작하지 않도록 예외적으로 상태변경도 가능하다고 한다.

<br /><br />

[Ref]:

- [Introducing React 18](https://github.com/reactwg/react-18/discussions/4)

<br /><br /><br />
