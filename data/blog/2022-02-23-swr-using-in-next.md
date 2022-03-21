---
title: 'Next.js에서 SWR 사용해보기'
date: '2022-02-23'
tags: ['javascript', 'react', 'next.js', 'swr']
draft: false
summary:
---

# Next.js에서 SWR 사용해보기

`Next.js`로 구성한 프로젝트에 `redux` + `saga`를 사용하여 상태관리를 하던 영역을 `swr`로 전환해보며 있었던 일들과 느낀 점을 정리해보고자 한다.

<br />

| 해당 내용은 `Next`, `swr`에 대한 개인적인 공부를 위한 글로 개인적인 의견이나 오역으로 인한 잘못된 내용이 있을 수 있으니 참고하여 주시기 바라며 문제가 되는 내용이 있는 경우 메일로 피드백 부탁합니다.

<br /><br />

## SWR 도입

일단 `swr`을 사용해보자의 시작은 `redux` + `saga`를 사용하며 코드량을 계속해서 늘리는 action, reducer, saga의 생성과 이를 간편화 하기 위해 generator의 생성... 그리고 데이터의 isLoading, isFetching, fulfilled, rejected 등의 상태를 표시하기 위해 다시 데이터를 한 번 더 랩핑... 너무나도 복잡해진 상태 추적과 불필요하게 전역에 상태를 관리하고 있다는 생각에서 부터 시작되었다.

<br />

### swr vs react-query

이후 다른 프로젝트에서 `swr`을 사용해보는 기회가 생겨 사용해보았고, 간단하게 데이터 fetching하여 상태를 관리할 수 있는 부분에 매료되었다. 이때 기존의 프로젝트에 `swr`을 도입해야겠다고 생각하며 `react-query`는 어떨까 하는 생각도 들어 두 가지를 비교하는 여러 글을 살펴보았다. 물론 두 가지 이외에도 많은 상태관리 라이브러리가 있지만 `Next.js`에서 가장 많이 사용되는 두 가지를 놓고 비교를 하였다.

<br />

라이브러리의 [다운로드 수](https://www.npmtrends.com/react-query-vs-swr-vs-@rtk-incubator/rtk-query)를 비교해보았을 때 `react-query`가 2021년 초를 기점으로 점점 차이를 벌리고 있는 것을 볼 수 있다. 실제로 여러 사이트에서 `swr` vs `react-query`라는 글에서 `react-query`를 선호하는 글들이 많았다. 대부분의 이유는 `swr`에서 지원하는 기능이 너무 가볍고 좀 더 다양한 기능을 `react-query`에서 지원하기 때문이라는 이유였다.

<br />

가장 큰 것으로는 `react-query`에서는 mutation hook을 지원하지만 `swr`에서는 fetching에 특화되어 있다는 것이다.
제공되는 mutate는 클라이언트 데이터 업데이트로 `swr` 예제를 보았을 때 먼저 클라이언트 데이터를 업데이트 후 별도의 API 요청을 하여 서버 데이터를 업데이트 후에 정상적으로 데이터가 업데이트되었는지 확인하는 순서로 수행한다.

```tsx
// 로컬 데이터를 즉시 업데이트하지만, 갱신은 비활성화
mutate('/api/user', { ...data, name: newName }, false)

// 소스 업데이트를 위해 API로 요청 전송
await requestUpdateUsername(newName)

// 로컬 데이터가 올바른지 확인하기 위해 갱신(refetch) 트리거
mutate('/api/user')
```

<br />

하지만 `react-query`의 경우 `useMutation` 훅을 사용하여 API 요청과 데이터 갱신을 한 번에 가져갈 수 있다.

```tsx
const mutation = useMutation((newTodo) => {
  return axios.post('/todos', newTodo)
})

return (
  <div>
    {mutation.isLoading ? (
      'Adding todo...'
    ) : (
      <>
        {mutation.isError ? <div>An error occurred: {mutation.error.message}</div> : null}

        {mutation.isSuccess ? <div>Todo added!</div> : null}

        <button
          onClick={() => {
            mutation.mutate({ id: new Date(), title: 'Do Laundry' })
          }}
        >
          Create Todo
        </button>
      </>
    )}
  </div>
)
```

<br />

다른 여러 차이점이 있지만 [Comparison | React Query vs SWR vs Apollo vs RTK Query](https://react-query.tanstack.com/comparison)에서 확인하거나 예제들을 참고하면 좋을 것 같다. 그리고 `swr`과 `react-query` [다운로드 수](https://www.npmtrends.com/react-query-vs-swr-vs-@rtk-incubator/rtk-query)를 비교해보았을 때 `react-query`가 두 배가량 높은 것을 확인 할 수 있었다.

<br />

조사를 하다 보니 `swr`이 아니라 `react-query`를 사용해야 하나? 라는 생각도 들었다. 하지만 `swr`을 선택하였고 이유는 현재 적용해볼 프로젝트의 특성상 fetching하여 데이터를 보여주는 것이 대부분이기 때문에 가볍고! 간단한! fetching에 특화된 `swr`을 도입하는 게 좋다고 판단하였다. 그리고 `swr`은 vercel에서 만든 거니깐... `Next.js`에 조금 더 최적화되지 않았을까? 라는 기대와 실제로 `Next.js` 공식 홈페이지에서 데이터 fetching을 위한 [예제](https://nextjs.org/docs/basic-features/data-fetching/client-side#client-side-data-fetching-with-swr)로 `swr`을 소개하고 있기 때문이다.

<br /><br />

## SWR in Next.js

`Next.js`에서 `swr`을 사용하는 것 자체는 어렵지 않았다. `Next.js`와 `swr` 문서, 예제에서 각 환경을 예로 들어 작성되어있기 때문이였다.

<br />

### redux -> swr

기본적으로 작업은 `swr`에서 `useSWR` 훅을 한 번 더 감싼 훅을 구성한 후에 API와 fetcher를 설정한 후 필요한 페이지에서 사용하였다. 기존에 페이지에서 사용하던 `redux` 상태 값을 가져오기 위한 `useSelector`, 그리고 `dispatch` action을 통해 데이터를 fetch하는 코드들을 제거하였고 action, reducer, saga 코드를 제거하였다. 이렇게 작업을 글로만 설명해도 `swr`의 간편한 구성과 `redux`를 쓰기 위에 많은 코드가 사용되었다는 것을 예상할 수 있을 것이다.

<br />

### swr with getServerSideProps

기존에 `getServerSideProps`에서 API 호출로 미리 데이터를 가져와 props 데이터를 먼저 사용하게 렌더링하도록 처리를 하였었다. 그리고 이후 이벤트 처리로 `redux`에서 `dispatch`를 통해 가져온 데이터를 가져와 렌더링에 사용하였었다.

<br />

`swr`로 전환하며 `gerServerSideProps`에서 가져온 props 데이터를 `fallback` options으로 설정하여 초기 값으로 사용할 수 있도록 설정하여 처리하였다. 이렇게 `fallback` options로 초기 값을 사용함으로써 기존의 데이터에 우선순위를 두어 렌더링하던 로직이 제거되며 코드가 한결 깔끔하게 정리 할 수 있었다.

<br />

아래는 `swr` server-render 예제 코드를 간단하게 수정한 코드이다.

```tsx
export default function Home({ fallbackData }) {
  const { data } = useSWR(URL, fetcher, { fallbackData })

  return <div>{data && data.results ? data.results : 'loading...'}</div>
}

export async function getServerSideProps() {
  const data = await fetcher(URL)
  return { props: { fallbackData: data } }
}
```

<br />

### swr with storybook

마지막으로 페이지 자체를 `storybook`에 구성해둔 부분을 `swr` 전환에 맞춰 수정하였다. `redux` 상태 값을 페이지에 몫 데이터로 설정하여 `storybook`을 작성하기 위하여 `__tests__` 폴더 하위에 `storybook`에서 사용할 별도의 store를 구성하였고 `reducer`에 mock 데이터를 설정하여 `storybook` 페이지에서 mock 데이터로 렌더링 되도록 하였다.

<br />

`storybook` 별도의 store를 구성이 되는 부분도 프로젝트 코드를 많이 증가시킨다고 생각되었고 좀 더 간단하게 mock 데이터를 설정할 방법이 없는지 찾아보게 되었다.

<br />

#### storybook with express proxy

일단 `swr`을 사용함으로 페이지 내에서 API 호출하여 데이터 가져오는 부분의 대응이 필요하였다. API 호출은 `storybook`에서 렌더링 되는 페이지에서 인증처리는 별도로 이루어지고 있지 않기 때문에 인증 오류가 발생하였고 `storybook`에서 렌더링 되는 페이지를 인증 처리하는 것은 불필요하다고 생각했다. 그래서 `.storybook/middleware`에 `express` 환경을 구성한 후 proxy 설정하여 mock 데이터를 내려주는 형태로 수정하였다.

<br />

위 방식은 API 호출이 되고 proxy 로직으로 데이터를 내려받아 정상적으로 `storybook` 페이지를 볼 수 있었다. 하지만 `.storybook` 하위에 별도의 mock 데이터를 구성하여 proxy mock 데이터를 구성해주어야 했고 `__test__`에서 작성된 페이지 스토리에서 args에 mock 데이터가 설정되는 형태라면 `.storybook`과 `__test__`에 동일한 mock 데이터가 불필요하게 중복하여 존재하는 상황이 발생하였다.

<br />

#### storybook with msw

조금 더 쉽게 `storybook`에서 API mock 데이터를 쉽게 설정할 수 없는지 찾아보던 중에 `msw`(Mock Service Worker)를 만나게 되었다.

<br />

`msw`는 네트워크 요청을 가로채서 Mock Response를 보내주는 역할을 한다. `msw`는 Service Worker 레벨에서 HTTP 요청을 가로채서 Mock Response를 보내줄 수 있기 때문에 별도의 Mock 서버를 구축하지 않아도 된다. 그리고 `*.stories.mdx` 내에서 API Mock Response를 설정할 수 있어 mock 데이터를 `__test__` 폴더 한곳에서 관리할 수 있게 수정이 가능하였다.

<br />

`stories` 내에서 스토리로 작성할 컴포넌트 parameters에 `msw` handlers를 설정하여 API에 맞는 mock response를 설정 할 수 있다.

```jsx
import { rest } from 'msw'

export const SuccessBehavior = () => <UserProfile />

SuccessBehavior.parameters = {
  msw: {
    handlers: [
      rest.get('/user', (req, res, ctx) => {
        return res(
          ctx.json({
            firstName: 'Neil',
            lastName: 'Maverick',
          })
        )
      }),
    ],
  },
}
```

<br />

`@storybook/addon-docs`를 사용하여 스토리를 구성하는 경우에는 아래처럼 `<Story>` 태그 parameters에 `msw` handlers를 설정하여 API에 맞는 mock response를 설정 할 수 있다.

```jsx
import { rest } from 'msw'
import { Meta, Story, Canvas } from '@storybook/addon-docs'

export const Template = (args) => <Page {...args} />
;<Canvas>
  <Story
    name="page"
    args={{
      fallbackData: MOCK_DATA,
    }}
    parameters={{
      msw: {
        handlers: [
          rest.get(URL, (req, res, ctx) => {
            return res(ctx.json(MOCK_DATA))
          }),
        ],
      },
    }}
  >
    {Template.bind({})}
  </Story>
</Canvas>
```

<br />

기존에 작성되어있던 `storybook`에서 구성한 `redux` store 코드와 `.storybook/middleware`에 작성한 express proxy, 그리고 mock 데이터를 제거하며 작업을 완료 할 수 있었다.

<br /><br />

## In Conclusion

예전에 상태 관리계를 정복한듯한 `redux`를 걷어내고 `swr`로 전환하며 언젠간 `swr`도 다른 것(ex. `react-query`)으로 대체될 것이고 그리고 `Next.js`도 다른 것(ex. `remix`)으로 대체될 것이라는 게 정해진 미래같이 느껴졌다. 무엇을 사용하든 불편함이 있을 수 있고 그것을 해결하다 보면 새로운 것으로 대체하게 되는 일을 반복하고 있다. 나중에는 나의 불편함을 해결할 대체 라이브러리를 만드는 작업을 하는 것도 시도해보아야겠다는 다짐을 해본다.

<br /><br />

[Ref]:

- [SWR](https://swr.vercel.app/docs/getting-started)
- [vercel/swr](https://github.com/vercel/swr)
- [Mock Service Worker](https://mswjs.io/)
- [Storybook Mock Service Worker](https://storybook.js.org/addons/msw-storybook-addon)

<br /><br /><br />
