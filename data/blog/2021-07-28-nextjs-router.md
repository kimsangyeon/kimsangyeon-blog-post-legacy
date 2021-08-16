---
title: 'Nextjs next/router'
date: '2021-07-28'
tags: ['javascript', 'next.js']
draft: false
summary: Next.js next/router useRouter 앱의 함수 구성 요소 내부에 있는 라우터 개체는 `useRouter` Hook을 사용하여 접근 할 수 있다.
---

# Next.js next/router

<br />

## useRouter

앱의 함수 구성 요소 내부에 있는 라우터 개체는 `useRouter` Hook을 사용하여 접근 할 수 있다. <br />

```jsx
import { useRouter } from 'next/router'

function ActiveLink({ children, href }) {
  const router = useRouter()
  const style = {
    marginRight: 10,
    color: router.asPath === href ? 'red' : 'black',
  }

  const handleClick = (e) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <a href={href} onClick={handleClick} style={style}>
      {children}
    </a>
  )
}

export default ActiveLink
```

<br />

`useRouter`는 React Hook으로 클래스 컴포넌트에서는 사용 할 수 없다. 클래스 컴포넌트에서는 `withRouter`를 사용하여 라우터 개체에 접근 할 수 있다. <br />

<br /><br />

## router object

- pathname: 현재 경로를 정보이다. /pages에 있는 페이지 경로
- query: 개체로 구문 분석된 쿼리 문자열이다. 페이지에 fetching 요구사항이 없으면 사전 랜더링 중에 빈 개체가 된다.
- asPath: basePath, locale 없이 브라우저에 표시되는 경로이다.
- isFallback: 현재 페이지가 fallback 모드인지 여부
- basePath: active basePath, 활성화된 경우
- locale: active locale, 활성화된 경우
- locales: 지원되는 모든 locales, 활성화된 경우
- defaultLocale: 현재 기본 locale, 활성화된 경우
- domainLocales: Array domain, defaultLocale, locales, 구성된 모든 도메인 locale
- isReady: router 필드가 클라이언트에서 업데이트되고 사용할 준비가 되었는지 여부. useEffect 메서드 내에서만 사용해야하며 서버에서 조건부로 랜더링해서는 안된다.
- isPreview: 앱이 현재 미리보기 모드인지 여부

<br />

### basePath

앱 내에 설정되는 경로 접두사로 `next.config.js`에서 설정 가능하다. <br />

```jsx
module.exports = {
  basePath: '/docs',
}
```

<br />

위와 같이 설정시 Ljink 혹은 `next/router`에서 사용되는 경로에 접두사 /docs가 붙게된다. <br />

<br />

```jsx
export default function HomePage() {
  return (
    <>
      <Link href="/about">
        <a>About Page</a>
      </Link>
    </>
  )
}
```

<br />

접두사는 빌드시 붙게되며 `/about` 경로는 `/docs/about`으로 설정된다. <br />

<br /><br />

## router.push

`router.push`는 클라이언트에서 전환 처리를 한다. <br />

```jsx
router.push(url, as, options)
```

<br />

params

- url: 탐색될 URL
- as: 브라우저에 표시될 URL의 optional decorator
- options: 옵션

<br />

options

- scroll: 탐색 후 페이지 맨 위로 스크롤 제어 (default: true)
- shallow: getStaticProps, getServerSideProps, getInitialProps를 다시 실행하지 않고 현재 페이지 경로 업데이트 (default: false)
- locale: 새로운 페이지의 locale

<br />

외부 URL로 이동시에는 `router.push`를 사용할 필요가 없다. 오히려 `window.location` 사용이 더 적합하다. <br />

<br />

### Usage

`pages/about.js` 로 이동 <br />

```jsx
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/about')}>
      Click me
    </button>
  )
}
```

<br /><br />

`pages/post/[pid].js` 동적 경로 페이지 이동 <br />

```jsx
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/post/abc')}>
      Click me
    </button>
  )
}
```

<br />

참고: Next.js에서 동일한 페이지로 이동할 때 최상위 React Component가 동일하기 때문에 페이지의 상태가 기본적으로 재설정 되지 않는다. useEffect를 사용하여 상태가 업데이트 되었는지 확인 할 수 있다. <br />

<br />

사용자 인증여부 검사뒤 사용자를 페이지/login.js로 리다이렉션<br />

```jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Here you would fetch and return the user
const useUser = () => ({ user: null, loading: false })

export default function Page() {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!(user || loading)) {
      router.push('/login')
    }
  }, [user, loading])

  return <p>Redirecting...</p>
}
```

<br />

### With URL object

`[next/link](https://nextjs.org/docs/api-reference/next/link#with-url-object)` 에 사용할 수 있는 것과 같은 방슥어로 URL 개체를 사용할 수 있다. <br />

```jsx
import { useRouter } from 'next/router'

export default function ReadMore({ post }) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => {
        router.push({
          pathname: '/post/[pid]',
          query: { pid: post.id },
        })
      }}
    >
      Click here to read more
    </button>
  )
}
```

<br /><br />

## router.replace

`router.replace` 는 새 URL 항목을 history stack에 추가하는 것을 방지한다. <br />

```jsx
router.replace(url, as, options)
```

<br />

`router.push` 에 사용하는 파라미터와 동일하게 사용한다. <br />

<br />

### Usage

```jsx
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.replace('/home')}>
      Click me
    </button>
  )
}
```

<br /><br />

## router.prefetch

빠른 클라이언트 전환을 위해 페이지를 미리 가져온다. `next/link` 의 경우 자동으로 페이지를 미리 가져오기 때문에 `next/link` 가 없는 탐색에서 유용하다. <br />

- 해당기능은 production 기능으로 개발시에는 페이지를 미리 가져오지 않는다.

```jsx
router.prefetch(url, as)
```

<br />

- url : prefetch URL
- as : url의 optional decorator, Next.js 9.5.3 이전에는 동적 경로를 미리 가져오는데 사용 ([previous docs](https://nextjs.org/docs/tag/v9.5.2/api-reference/next/link#dynamic-routes))

<br />

### Usage

로그인 페이지가 있고 로그인 후에 사용자를 대시보드로 리다이렉션 한다고했을때, 대시보드를 미리 가져와 빠르게 전환할 수 있다. <br />

```jsx
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const handleSubmit = useCallback((e) => {
    e.preventDefault()

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        /* Form data */
      }),
    }).then((res) => {
      // Do a fast client-side transition to the already prefetched dashboard page
      if (res.ok) router.push('/dashboard')
    })
  }, [])

  useEffect(() => {
    // Prefetch the dashboard page
    router.prefetch('/dashboard')
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Login</button>
    </form>
  )
}
```

<br /><br />

## router.beforePopState

만약 popstate 시점에 맞추어 라우터가 동작하기전에 무언가 작업을 하고 싶을 수 있다. <br />

```jsx
router.beforePopState(cb)
```

<br />

- cb : popstate 이벤트에서 실행할 함수이다.
- callback에서 수신할 정보로는 url, as, options

<br />

만약 cb가 false를 반환하면 Next.js 라우터는 popstate를 처리하지 않게된다. <br />

<br />

### Usage

다음 예제와 같이 beforePopState를 사용하여 요청을 조작하거나 SSR 새로고침을 강제 실행할 수 있다. <br />

```jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.beforePopState(({ url, as, options }) => {
      // I only want to allow these two routes!
      if (as !== '/' && as !== '/other') {
        // Have SSR render bad routes as a 404.
        window.location.href = as
        return false
      }

      return true
    })
  }, [])

  return <p>Welcome to the page</p>
}
```

<br /><br />

## router.back

브라우저에서 뒤로가기 버튼을 클릭하는 것과 같으며 `window.history.back()`을 실행한다. <br />

<br />

### Usage

```jsx
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.back()}>
      Click here to go back
    </button>
  )
}
```

<br /><br />

## router.reload

브라우저의 새로고침 버튼을 클릭하는 것과 같으며 `window.location.reload()`를 실행한다. <br />

<br />

### Usage

```jsx
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.reload()}>
      Click here to reload
    </button>
  )
}
```

<br /><br />

## router.events

- [With a page loading indicator](https://github.com/vercel/next.js/tree/canary/examples/with-loading) <br />

<br />

Next.js. 라우터 내부에서 발생하는 이벤트를 수신할 수 있다. <br />

- `routeChangeStart(url, { shallow })` : 경로가 변경되기 시작할때 발생
- `routeChangeComplete(url, { shallow } )` : 경로가 완전히 변경되면 발생
- `routeChangeError(err, url, { shallow } )` : 경로 변경시 오류가 발생하거나 경로 전환 취소시 발생 (err.cancelled - 탐색이 취소되었는지 여부)
- `beforeHistoryChange(url, { shallow } )` : 브라우저의 history를 변경하기 전에 발생
- `hashChangeStart(url, { shallow })` : 해시는 변경되지만 페이지는 변경되지 않을때 발생
- `hashChangeComplete(url, { shallow })` : 해시가 변경되었지만 페이지는 변경되지 않을때 발생

<br />

### usage

라우터 이벤트 `routeChangeStart`를 수신하려면 다음과 같이 `pages/_app.js`를 열거나 생성하고 이벤트를 구독 <br />

```jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      console.log(`App is changing to ${url} ${shallow ? 'with' : 'without'} shallow routing`)
    }

    router.events.on('routeChangeStart', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  return <Component {...pageProps} />
}
```

<br />

예제에서는 `pages/_app.js` 에서의 예를 사용하였지만 모든 애플리케이션 Component에서 이벤트를 구독할 수 있다. 라우터 이벤트는 Component가 마운트될때 등록되어야한다. <br />

<br />

경로 전환이 취소되면 routeChangeError가 발생한다. 그리고 전달되 오류는 err.cancelled true로 설정된 속성이 포함된다. <br />

```jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChangeError = (err, url) => {
      if (err.cancelled) {
        console.log(`Route to ${url} was cancelled!`)
      }
    }

    router.events.on('routeChangeError', handleRouteChangeError)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeError', handleRouteChangeError)
    }
  }, [])

  return <Component {...pageProps} />
}
```

<br /><br />

## withRouter

useRouter가 사용에 적합하지 않은 경우 withRouter는 Component에 동이랗ㄴ 라우터 개체를 추가 할 수 있다. <br />

<br />

### Usage

```jsx
import { withRouter } from 'next/router'

function Page({ router }) {
  return <p>{router.pathname}</p>
}

export default withRouter(Page)
```

<br /><br />

## Typescript

```jsx
import React from 'react'
import { withRouter, NextRouter } from 'next/router'

interface WithRouterProps {
  router: NextRouter;
}

interface MyComponentProps extends WithRouterProps {}

class MyComponent extends React.Component<MyComponentProps> {
  render() {
    return <p>{this.props.router.pathname}</p>
  }
}

export default withRouter(MyComponent)
```

<br /><br /><br />

[Ref]:

- [next/router](https://nextjs.org/docs/api-reference/next/router)

<br /><br /><br />
