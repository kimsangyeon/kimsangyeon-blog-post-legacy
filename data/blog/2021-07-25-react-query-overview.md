---
title: 'React Query Overview'
date: '2021-07-25'
tags: ['javascript', 'react', 'react-query']
draft: false
summary: React Query Overview React Query는 React 애플리케이션에서 서버 데이터를 가져와 캐싱하고, 동기화하고, 업데이트하는작업을 쉽게 도와준다.
---

# React Query Overview

React Query는 React 애플리케이션에서 서버 데이터를 가져와 캐싱하고, 동기화하고, 업데이트하는작업을 쉽게 도와준다. <br />

<br />

## Motivation

React에서는 기본적으로 Components에서 범용적으로 데이터를 가져오거나 갱신시켜주는 방법을 제공하지는 않는다. 해서 Redux, Mobx 등 상태 관리 라이브러리를 함께 사용하여 상태 관리를 구축하는 것이 일반 적이다. <br />

<br />

하지만 대부분 상태 관리 라이브러리는 클라이언트 상태 관리에는 적합하지만 비동기 또는 서버의 데이터를 가져오는 비동기 작업에는 적합하지 않다. 이를 해결하기 위해 한 예로는 Redux의 경우에는 redux-thunk 혹은 redux-saga와 같은 추가 미들웨어를 함께 사용한다. <br />

<br />

서버의 상태는 <br />

- 서버상태는 제어할 수 없는 원격 위치에 존재하고있다.
- Data fetching을 위한 비동기 API 필요
- 서버상태는 공유 소유권을 가진 다른사람에 의해 변경 될 수 있다.
- 서버 상태와는 다르게 오래된 상태를 사용하고 있을 수 있다.

<br />

위 사항을 고려하며 서버상태를 사용하며 많은 문제에 직면하게 된다. <br />

- 캐싱...
- 동일한 데이터에 대한 여러 요청을 단일 요청으로
- 백그라운드에서 오래된 데이터 업데이트
- 클라이언트에서 데이터가 오래된 경우 파악
- 가능한 한 빠르게 업데이트된 데이터 반영
- 페이지네이션 혹은 지연 로딩과 같은 성능 최적화
- 서버 상태의 메모리 관리 및 가비지 컬렉션
- 구조적 공유를 통한 쿼리 결과 메모이제이션

<br />

React Query는 서버 상태 관리를 위한 최고의 라이브러리중 하나이다. 기술적인 부분에서 React Query는 다음과 같이 동작 할 것이다. <br />

- 복잡한 여러줄의 코드를 제거하고 React Query 로직을 사용하여 간단하게 구성
- 서버 상태를 애플리케이션에서 쉽게 유지 관리 할 수 있다.
- 애플리케이션의 반응성을 빠르게 만들어 사용성을 높일 수 있다.
- 잠재적으로 대역폭을 절약하고 메모리 성능을 높일 수 있다.

<br /><br />

[Open in CodeSandbox](https://codesandbox.io/s/github/tannerlinsley/react-query/tree/master/examples/simple)

```jsx
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  )
}

function Example() {
  const { isLoading, error, data } = useQuery('repoData', () =>
    fetch('https://api.github.com/repos/tannerlinsley/react-query').then((res) => res.json())
  )

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong> <strong>✨ {data.stargazers_count}</strong>{' '}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  )
}
```

<br /><br />

## Installation

<br />

### NPM

```
$ npm i react-query
# or
$ yarn add react-query
```

<br />

### CDN

```
<script src="[https://unpkg.com/react-query/dist/react-query.production.min.js](https://unpkg.com/react-query/dist/react-query.production.min.js)"></script>
```

<br /><br />

[Ref]:

- [React Query Overview](https://react-query.tanstack.com/overview)

<br /><br /><br />
