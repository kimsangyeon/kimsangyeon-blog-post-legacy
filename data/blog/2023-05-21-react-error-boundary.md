---
title: 'React Error Boundary'
date: '2023-05-21'
tags: ['react', 'errorboundary', 'errorboundaries', 'react-router-dom']
draft: false
summary:
---

# React Error Boundary

`React` 컴포넌트 내에서 에러가 발생하게 되는 경우 전체적인 에러 플로우를 관리하도록 로직 구성이 필요하였다. <br />

<br />

`React` 컴포넌트 내에서 에러 처리 방법과 `react-router-dom v6` 버전을 사용하며 에러 처리를 어떻게 하게 되었는지 정리 하고자 한다. <br />

<br />

| 해당 내용은 개인적인 공부를 위한 글로 오역 및 개인적인 의견이 반영된 내용이 있을 수 있으니 참고하여 주시기 바라며 문제가 되는 내용이 있는 경우 메일로 피드백 부탁합니다.

<br /><br />

## Error Boundaries

React 16 버전부터 `Error Boundary` 라는 개념이 도입되었다. 에러는 렌더링 도중 생명주기 혹은 하위 트리에서 에러를 잡아낼 수 있도록 두가지 생명주기 메서드를 제공한다. <br />

- [static getDerivedStateFromError()](https://ko.legacy.reactjs.org/docs/react-component.html#static-getderivedstatefromerror)
- [componentDidCatch()](https://ko.legacy.reactjs.org/docs/react-component.html#componentdidcatch)

<br />

React 공식 문서에서는 `static getDerivedStateFromError()` 는 에러 발생 이후 폴백 UI를 렌더링 하는데 사용, `componentDidCatch()` 는 에러 정보를 기록하는데 사용하라고 가이드하고 있다. <br />

<br /><br />

### class

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트 합니다.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // 에러 리포팅 서비스에 에러를 기록할 수도 있습니다.
    logErrorToMyService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // 폴백 UI를 커스텀하여 렌더링할 수 있습니다.
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}
```

위와 같은 형태로 에러 생명주기 메소드를 정의한 `class ErrorBoundary` 컴포넌트를 생성하고 해당 컴포넌트로 프로젝트 `App` 컴포넌트를 랩핑하여 렌더링 도중 발생하는 에러를 잡아내도록 한다. <br />

<br />

```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

`ErrorBoundary` 는 `catch {}` 구문과 유사하게 동작하며 컴포넌트 내의 에러 경계로 사용된다. 하지만 여기서의 에러 포착에서 몇가지 에러 발생은 잡아낼 수 없다. <br />

- 이벤트 핸들러
- 비동기 (setTimeout, requestAnimationFrame, Promise)
- 서버 사이드 렌더링
- ErrorBoundary에서의 에러

<br /><br />

### functional

공식 홈페이지에서는 `class`의 생명주기 메소드에서의 에러 처리방법만 나와있었고 `functional`로 `ErrorBoundary`를 처리 할 수는 없을까라는 생각이 들었다. <br />

<br />

`functional`에 대한 `ErrorBoundary` 컴포넌트가 필요했던 이유는 에러가 발생하는 경우 `ErrorBoundary` 내부에서 필요한 훅을 호출하여 에러에 대한 후처리를 하고 싶은 부분들이 있었다. <br />

<br />

검색을 통해 찾은 방법으로는 `class`로 정의한 `ErrorBoundary` 컴포넌트를 함수형으로 한번 랩핑하여 에러 처리를 하는 방법이 있었다. <br />

```jsx
import React from "react"

type ErrorHandler = (error: Error, info: React.ErrorInfo) => void
type ErrorHandlingComponent<Props> = (props: Props, error?: Error) => React.ReactNode

type ErrorState = { error?: Error }

export default function Catch<Props extends {}>(
  component: ErrorHandlingComponent<Props>,
  errorHandler?: ErrorHandler
): React.ComponentType<Props> {
  function Inner(props: { error?: Error, props: Props }) {
    return <React.Fragment>{component(props, error)}</React.Fragment>
  }

  return class extends React.Component<Props, ErrorState> {
    state: ErrorState = {
      error: undefined
    }

    static getDerivedStateFromError(error: Error) {
      return { error }
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
      if (errorHandler) {
        errorHandler(error, info)
      }
    }

    render() {
      return <Inner error={this.state.error} props={this.props} />
    }
  }
}
```

- **[React - Functional error boundaries](https://gist.github.com/andywer/800f3f25ce3698e8f8b5f1e79fed5c9c?permalink_comment_id=3307608#gistcomment-3307608)**

<br /><br />

### Error Event

또 다른 형태는 `chatgpt`에게 함수형으로 바꾸는걸 요청하였더니 에러이벤트를 활용한 나름(?) 괜찮은 형태로 바꿔주었다. <br />

```jsx
import React, { useState, useEffect } from 'react'

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState(null)
  const [errorInfo, setErrorInfo] = useState(null)

  useEffect(() => {
    const componentDidCatch = (error, errorInfo) => {
      setHasError(true)
      setError(error)
      setErrorInfo(errorInfo)

      // You can also log the error to an error reporting service
      // or perform any other necessary error handling here
    }

    // Register the componentDidCatch method as the error boundary
    window.addEventListener('error', componentDidCatch)

    // Clean up the event listener
    return () => {
      window.removeEventListener('error', componentDidCatch)
    }
  }, [])

  const getDerivedStateFromError = (error) => {
    // Update the state based on the error
    return {
      hasError: true,
      error: error,
    }
  }

  if (hasError) {
    // Fallback UI when an error occurs
    return (
      <div>
        <h1>Something went wrong.</h1>
        <p>{error && error.toString()}</p>
        <p>Component Stack Trace:</p>
        <pre>{errorInfo && errorInfo.componentStack}</pre>
      </div>
    )
  }

  // Render the normal component tree when no error has occurred
  return children
}

ErrorBoundary.getDerivedStateFromError = getDerivedStateFromError

export default ErrorBoundary
```

`componentDidCatch`에 대한 부분은 `error` 이벤트를 등록하여 처리하는 방법과 `getDerivedStateFromError`는 `static` 메소드로 등록하여 처리되도록 구성을 해주었다. <br />

<br />

여기서 추가적으로 비동기(setTimeout, requestAnimationFrame, Promise) 등에 대한 콜백 에러 처리가 필요한 경우 `unhandledrejection` 이벤트에서 에러에 대한 추가 처리를 할 수 있다. <br />

```jsx
const errorHandler = (error: PromiseRejectionEvent) => {
  setHasError(true)
  setError(error)
}

window.addEventListener('unhandledrejection', errorHandler)
```

<br /><br />

## react-router-dom errorElement

이전 프로젝트에서는 이벤트로만 에러 처리하던 부분들을 `react-router-dom` `Route`에 `errorElement` 를 설정하는 형태로 설정해보았다. `Route`에 설정된 `errorElement`는 내부적으로 리액트에서 가이드했던 `ErroryBoundary`를 내부적으로 라우팅에 감싸서 에러 처리를 수행하고 있었다. <br />

- [AwaitErrorBoundary](https://github.com/remix-run/react-router/blob/f397ad756530f879f5406726f830ff4edf2064e0/packages/react-router/lib/components.tsx#L455)
- [RenderErrorBoundary](https://www.notion.so/React-Error-Boundary-408852be99904f08b47ab2389473d0f6)

아쉬웠던 부분은 내부적으로 비동기에 대한 에러는 캐치하지 못해 추가적으로 위에 설명했던 이벤트 처리와 같은 별도 비동기 콜백에 대한 에러처리를 해주어야했다. <br />

<br />

에러 페이지 내부에서는 `errorElement`에 대한 에러 정보를 전달해주는 [useRouteError](https://reactrouter.com/en/main/hooks/use-route-error) 훅으로 에러 정보 처리를 할 수 있었다. <br />

<br />

그리고 `Route`에서 설정할 수 있는 `loader`, `action`에서의 예외처리로 `useRouteError`에서 받을 수 있도록 에러에 대한 정보 설정 처리를 할 수 있었다. <br />

<br />

위의 `Route`에서 설정가능한 `loader`, `action`에서의 예외처리로 API 혹은 비동기 처리에 대한 에러 처리도 가능하며 `react-router-dom`에서의 예시에서도 해당 방법의 에러처리 예제들도 있었다. <br />

<br />

하지만 컴포넌트 내에서 상태, 사용자 인터렉션에 따른 API 호출과 같은 처리를 위해서는 별도의 추가적인 작업들이 필요하였다.

<br />

라우팅에 대한 에러 컴포넌트 설정 및 훅을 제공하는 부분은 좋았지만 비동기 에러 처리 등 특정 상황에 대한 추가적인 에러 처리가 필요한 경우, 에러 처리에 대한 로직이 여러곳에 분산되는 형태가 되어 버려서 한곳에서의 처리로 리팩토링이 필요할 것으로 생각된다. 🤔 <br />

<br /><br />

[Ref]:

- [Rect Error Boundary](https://ko.legacy.reactjs.org/docs/react-component.html#error-boundaries)
- [React Router errorElement](https://reactrouter.com/en/main/route/error-element)
  <br /><br /><br />
