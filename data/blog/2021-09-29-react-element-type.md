---
title: 'ReactNode & ReactElement & JSX.Element'
date: '2021-09-29'
tags: ['javascript', 'react', 'typescript']
draft: false
summary:
---

# ReactNode & ReactElement & JSX.Element

타입스크립트 마이그레이션중 리엑트 컴포넌트를 반환 혹은 props로 children으로 받는 경우 타입 정의에 혼란이 왔다. 여러명이서 마이그레이션을 하다보니 누군가는 `ReactNode` 또 다른 사람은 `JSX.Element`를 사용... 하다보니 나 조차도 어떤 곳에는 `ReactElement`로 지정하여 사용하고 있었다. <br />

<br />

각 타입이 어떤 곳에 쓰는 것이 좋은지 정리할 필요성이 있다고 생각하여 위 타입들이 지정하는 바를 정리해본다. <br />

<br />

## ReactNode

`ReactNode`는 가장 넓은 타입을 가지는 타입이라고 할 수 있으며 `ReactElement`와 Javascript 원시타입을 포함한다. `ReactNode`는 클래스 컴포넌트 render() 메소드의 반환 값으로 사용된다. <br />

```jsx
type ReactText = string | number
type ReactChild = ReactElement | ReactText

interface ReactNodeArray extends Array<ReactNode> {}
type ReactFragment = {} | ReactNodeArray
type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined
```

<br /><br />

## ReactElement

`ReactElement`는 type과 props를 가지는 타입으로 제네릭으로 props 및 type의 타입을 지정할 수 있다. `ReactElement`는 함수형 컴포넌트의 반환 값으로 사용된다. <br />

```tsx
interface ReactElement<
  P = any,
  T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>
> {
  type: T
  props: P
  key: Key | null
}
```

<br /><br />

## JSX.Element

`JSX.Element`는 ReactElement 제네릭 타입에 any가 지정된 타입이다. `JSX.Element`는 글로벌 네임스페이스로 정의되어있어 각 라이브러리에서 지정하는 방식으로 설정 될 수 있다. 아래는 React에 지정된 `JSX.Element`이다. <br />

```tsx
declare global {
  namespace JSX {
      interface Element extends React.ReactElement<any, any> { }
```

<br />

현재 진행하고 있는 프로젝트에서는 기본적으로 함수형 컴포넌트를 사용하고있다. 함수형 컴포넌트는 `StatelessComponent`로 지정되지만 함수형 컴포넌트의 타입을 정의 하는 것에 따라 반환되는 타입이 조금 상이 할 수 있다. <br />

<br />

아래는 함수형 컴포넌트의 props를 props 자체에 타입을 지정하는 형태로 해당형태로 함수형 컴포넌트를 사용할 시 반환 값은 `JSX.Element`로 지정된다. <br />

<br />

![react element type](/static/images/posts/react-element-type.png)

<br />

하지만 `React.FC`를 사용하여 함수형 컴포넌트 타입을 지정할 시 `React.FC` 타입으로 지정되어 해당 반환 값은 `ReactElement<any, any> | null`로 지정된다. <br />

```tsx
type StatelessComponent<P = {}> = FunctionComponent<P>

type FC<P = {}> = FunctionComponent<P>

interface FunctionComponent<P = {}> {
  (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null
  propTypes?: WeakValidationMap<P> | undefined
  contextTypes?: ValidationMap<any> | undefined
  defaultProps?: Partial<P> | undefined
  displayName?: string | undefined
}
```

<br /><br />

함수형 컴포넌트에 만약 반환값 **null**이 포함되는 경우에는 `React.FC`를 사용할 경우 반환값 타입에 **null**이 포함되지만 `React.FC`를 사용하지 않은 경우에는 **union** 타입으로 **null**을 지정해 주어야하는 번거로움이 있을 수 있다. <br />

<br />

본인이 지정한 클래스, 함수형 컴포넌트에 따른 타입을 지정하거나 반환 값에 **null** 포함 유무에 따른 반환값 타입을 지정하여 사용하는 것이 정확한 타입 추론이 될 수 있지 않을까 생각한다. <br />

<br />

때로는 아래와 값이 컴포넌트 반환 타입을 지정하여 사용하기도 한다고 한다. <br />

```tsx
type ComponentReturnType =
  | ReactElement
  | Array<ComponentReturnType>
  | string
  | number
  | boolean
  | null // Note: undefined is invalid
```

<br />

<br /><br />

[Ref]:

- [when-to-use-jsx-element-vs-reactnode-vs-reactelement](https://stackoverflow.com/questions/58123398/when-to-use-jsx-element-vs-reactnode-vs-reactelement)

<br /><br /><br />
