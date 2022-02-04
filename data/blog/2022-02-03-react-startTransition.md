---
title: 'React startTransition'
date: '2022-02-03'
tags: ['javascript', 'react']
draft: false
summary:
---

# React startTransition

| 해당 내용은 개인적으로 정보 습득을 위한 내용 정리로 오역이 있을 수 있음을 고려해 주시기 바라며 문제 되는 부분 피드백 주시면 감사하겠습니다. (원본 글 하단 Ref)

<br />

브라우저에서 렌더링이 시작되면 이는 중단될 수 없으며 렌더링이 완료되기까지 화면은 block 상태가 된다고 할 수 있다. 이로 인하여 렌더링 도중에 발생하는 텍스트 입력과 마우스 클릭과 같은 액션이 지연되어 버벅거림을 느낀 적이 있을 것이다. `React 18`에서는 화면 렌더링 중에도 사용자 상호작용이 정상적으로 유지되도록 도움을 주는 API들을 제공하여 사용자 상호 작용이 정상적으로 반영되도록 개선이 되었다.

<br /><br />

## What problem does this solve?

화면에서 버튼을 클릭하거나 텍스트를 입력하는 것과 같은 동작으로 화면에 많은 일이 발생 할 수 있으며, 이로 인하여 작업이 완료되기까지 페이지가 정지될 수 있다.

<br />

데이터 목록을 필터링하는 입력 필드에 입력하게 되었을 때, 데이터를 필터링하고 입력 필드 값을 상태에 저장해야 한다.

```jsx
// Update the input value and search results
setSearchQuery(input)
```

<br />

사용자가 텍스트를 입력할 때마다 텍스트 상태 값을 업데이트하고 상태 값을 사용하여 목록을 검색하고 결과를 렌더링한다. 목록 결과를 렌더링하는 동안 페이지는 지연 현상이 발생하여 입력 또는 다른 인터렉션이 느려지고, 응답하지 않는 것처럼 느껴질 수 있다.

<br />

위 상황에서 입력 필드에 대한 업데이트와 목록을 렌더링하는 업데이트 두 가지로 나눌 수 있으며, 여기서 사용자 상호작용에 관한 입력 필드 업데이트를 조금 더 중요한 사항으로 볼 수 있다.

```jsx
// Urgent: Show what was typed
setInputValue(input)

// Not urgent: Show the results
setSearchQuery(input)
```

<br />

사용자는 브라우저에서 입력 필드에 대한 업데이트는 기본적으로 제공되는 즉각적 업데이트로 기대할 것이다. 하지만 렌더링에 대한 사항은 다소 늦어질 것으로 기대할 수 있다. 이러한 이유로 개발자들은 이러한 현상을 해결하기 위하여 디바운싱과 같은 기술로 렌더링 업데이트를 인위적으로 지연시킨다.

<br />

`React 18`까지는 모든 업데이트가 긴급하게 렌더링 되었다. 위의 두 가지 상태는 모두 동시에 렌더링 되고 모든 것이 렌더링 될 때까지 사용자 상호작용을 차단하게 된다. 여기서 필요한 것은 React에게 긴급한 업데이트가 무엇인지 알려주는 방법이다.

<br /><br />

## How does startTransition help?

startTransition API를 사용하여 긴급하지 않은 업데이트를 랩핑할 수 있다. 클릭 혹은 키 이벤트가 발생하는 경우 랩핑 된 업데이트는 지연되고 클릭과 키 이벤트와 같은 긴급한 이벤트가 먼저 처리되도록 한다. 그리고 완료되지 않은 오래된 렌더링을 폐기하고 최신 업데이트로 렌더링한다.

```jsx
import { startTransition } from 'react'

// Urgent: Show what was typed
setInputValue(input)

// Mark any state updates inside as transitions
startTransition(() => {
  // Transition: Show the results
  setSearchQuery(input)
})
```

<br />

해당 `Transitions` API를 사용하면 사용자의 상호작용을 빠르게 유지할 수 있다. 또한 불필요한 렌더링을 줄일 수 있는 효과도 얻을 수 있다.

<br /><br />

## What is a transition?

업데이트는 두 가지로 분류할 수 있으며 입력, 클릭 등과 같은 직접적인 상호작용이 있으며, UI 업데이트라고 할 수 있는 `Transition`으로 나눌 수 있다. 일반적으로 리액트에서 대부분 업데이트는 `Transition` 업데이트이다. 여기서 이전 버전과의 호환성을 위해 opt-in이며 `startTransition`으로 랩핑하여 업데이트를 `Transition`으로 표시 할 수 있다.

<br /><br />

## How is it different from setTimeout?

사실 위에서 문제가 되었던 사용자 상호작용이 지연 혹은 차단되어 보이는 문제는 일반적으로 setTimeout 등을 활용한 디바운싱으로 해결 할 수도 있다.

```jsx
// Show what you typed
setInputValue(input)

// Show the results
setTimeout(() => {
  setSearchQuery(input)
}, 0)
```

위처럼 처리하면 첫 번째 업데이트가 렌더링 될 때까지 두 번째 업데이트가 지연된다.

<br />

가장 중요한 차이점은 `startTransition`은 `setTimeout`처럼 비동기적으로 처리되는 것이 아닌 동기적으로 실행되고 내부적으로 `Transition`으로 표시되어 처리된다. 리액트에서는 이 정보를 렌더링할 때 사용하게 되고 이는 비동기로 처리될 때보다 더 일찍 업데이트 렌더링이 시작됨을 의미한다. 빠른 환경인 경우에 `Transition`으로 인한 지연은 거의 없이 렌더링이 진행되며 느린 환경에서는 지연이 발생하지만, 클릭, 키 입력 등 사용자 상호작용은 정상적으로 응답하게 된다.

<br />

그리고 위와 같이 `setTimeout`으로 상태 업데이트를 지연하여 렌더링하게 되는 경우 지연 이후 렌더링이 발생하는 경우 결국에는 페이지 상호작용은 차단될 수 있다. 하지만 `startTransition`을 사용하게 되는 경우 상태 업데이트는 중단이 가능하여 페이지 차단이 일어나지 않는다. 이를 통하여 브라우저는 다른 컴포넌트 등을 렌더링하는 사이의 짧은 간격에서 이벤트를 처리 할 수 있게 된다. 이로 인해 사용자 입력이 변경되는 경우 리액트는 불필요한 상태 업데이트로 인한 렌더링을 방지 할 수 있다.

<br />

물론 클릭, 키 입력 등 이벤트 처리에서 `setTimeout`에 대한 `clearTimeout`을 수행하여 디바운싱하여 불필요한 상태 업데이트 및 렌더링을 방지 할 수 있다. 일반적으로는 아래와 같은 디바운싱을 사용하였었다.

```jsx
this.timeoutId = 0
const onClick = () => {
  clearTimeout(this.TimeoutId)
  this.timeoutId = setTimeout(() => {
    setInputValue(input)
  }, 0)
}
```

<br />

마지막으로는 `setTimeout`은 단순히 업데이트를 지연시키기 때문에 로딩 등의 지연 현상을 표시하기 위해서는 비동기 코드를 별도로 작성해야 한다. 하지만 `Transition`을 사용하면 리액트가 지연상태를 추적하여 전환의 현재 상태를 기반으로 업데이트하고 기다리는 동안 사용자의 로딩 피드백을 표시 할 수 있는 기능을 제공한다.

<br /><br />

## What do I do while the transition is pending?

작업이 진행 중임을 알리는 `isPending` 플래그를 사용할 수 있는 `useTransition` hook이 제공된다.

```jsx
import { useTransition } from 'react'

const [isPending, startTransition] = useTransition()
```

<br />

전환이 보류 중인 동안 `isPending`은 true이므로 기다리는 동안 로딩 혹은 스피너 등을 표시 할 수 있다.

```jsx
{
  isPending && <Spinner />
}
```

<br /><br />

## Why not just write faster code?

`Transition`을 사용하면 불필요한 렌더링을 피하고 성능을 최적화 할 수 있다. 새로운 화면을 표시할 때 사용자 상호작용을 정상적으로 유지할 수 있으며 상태변경으로 인한 불필요한 재 렌더링을 방지하는 것이 가능한 최선의 방법이다.

<br /><br />

[Ref]:

- [New feature: startTransition](https://github.com/reactwg/react-18/discussions/41)

<br /><br /><br />
