---
title: 'Storybook Get Started'
date: '2021-10-18'
tags: ['javascript', 'storybook']
draft: false
summary:
---

# Get Started

<br /><br />

## Introduction to Storybook for React

`Storybook`은 UI 개발을 위한 도구이다. 컴포넌트를 분리하여 개발을 더 빠르고 쉽게 만들도록 도와준다. 복잡한 개발 스택을 개발하며 특정 데이터를 데이터베이스에 넣거나 애플리케이션을 탐색할 필요 없이 한번에 하나의 컴포넌트에서 작업 할 수 있다. <br />

<br />₩

`Storybook`을 사용하여 웹 애플리케이션에서 작은 컴포넌트 단위로 복잡한 페이지 구축도 가능하다. <br />

<br />

`Storybook`을 사용하면 재사용할 컴포넌트를 문서화 하고 자동으로 컴포넌트를 시각적으로 테스트하여 버그를 방지 할 수 있다. 반응형 레이아웃을 미세하게 조정하거나 접근성을 확인하는데 도움이 되는 에드온 에코 시스템으로 Storybook 확장도 가능하다. Storybook은 널리 사용되는 Javascript UI 프레임워크와도 통합되며 `Ruby on Rails`와 같은 서버 렌더링 구성 요소 프레임워크를 지원한다. <br />

<br /><br />

## Install Storybook

`Storybook CLI`를 사용해서 기존 프로젝트 루트 디렉터리내에서 설치한다. <br />

<br />

```
# Add Storybook:
npx sb init
```

<br />

`Storybook`은 이미 프레임워크가 설정된 프로젝트에 설치해야하며 빈 프로젝트에는 작동하지 않는다. <br />

<br />

설치과정에서 Storybook은 프로젝트의 종속성을 검사하고 사용가능한 최상의 구성을 제공한다. <br />

<br />

먼저 앱을 빌드한 다음 아래 명령을 실행하여 정상 동작을 확인한다. <br />

```tsx
# Starts Storybook in development mode
npm run storybook
or
yarn storybook
```

<br />

로컬에서 `Storybook`을 시작하고 주소를 출력한다. 시스템 구성에 따라 새 브라우저 탭이 열리며 화면이 표시된다. <br />

<br /><br />

## What's a Story

스토리는 UI 구성 요소의 랜더링된 상태를 캡쳐한다. 개발자는 요소가 지원할 수 있는 모든 상태를 설명하는 여러 스토리를 작성한다. <br />

<br />

`Storybook`으로 구축할 수 있는 요소(버튼, 헤더 및 페이지)를 보여주는 예제를 보도록 하자. <br />

<br />

각 예제에서 요소별로 상태를 보여주는 스토리가 있다. 스토리는 ES6 모듈 기반 `CSF`(Component Story Format)으로 작성되며 **.stories.js** 또는 **.stories.ts**로 끝나는 파일에서 확인 할 수 있다. <br />

<br />

다음은 Button 컴포넌트를 랜더링하고 Primary라는 스토리로 내보내는 방법이다. <br />

```tsx
// Button.stories.ts | Button.stories.tsx

import React from 'react'

import { Meta } from '@storybook/react'

import { Button } from './Button'

export default {
  component: Button,
  title: 'Components/Button',
} as Meta

export const Primary: React.VFC<{}> = () => <Button primary>Button</Button>
```

<br /><br />

`Storybook` "args"를 활용하여 Button에 대한 인수를 설정 할 수 있다. <br />

```tsx
// Button.stories.ts | Button.stories.tsx

import React from 'react'

import { Story, Meta } from '@storybook/react'

import { Button } from './Button'

export default {
  component: Button,
  title: 'Components/Button',
} as Meta

//👇 We create a “template” of how args map to rendering
const Template: Story<ButtonProps> = (args) => <Button {...args} />

export const Primary = Template.bind({})

Primary.args = {
  primary: true,
  label: 'Button',
}
```

<br />

- Button의 콜백은 Actions 탭에 기록된다.
- Button의 arguments는 Controls 탭에서 동적으로 편집 할 수 있다.

<br />

- `Template.bind({})`는 함수의 복사본을 만들기위한 것이다. export 된 각 스토리가 고유한 속성을 설정 할 수 있도록 Template를 복사하여 export 한다. <br />

<br /><br />

## Browse Stories

<br /><br />

### Sidebar and Canvas

**\*.stories.js** 파일은 컴포넌트의 모든 스토리를 정의한다. 각 스토리에는 사이드바 항목이 있으며 스토리를 클릭하면 미리보기 **iframe**인 **Canvas**에서 랜더링된다. <br />

<br /><br />

### Toolbar

`Storybook`에는 **Canvas**에서 랜더링 방식을 조정할 수 있는 도구가 포함되어있다. <br />

- 확대 축소 기능으로 컴포넌트의 크기를 시각적으로 지정하여 세부 정보 확인이 가능
- 컴포넌트 뒤에 랜더링된 배경을 변경하여 다양한 시각적 컨텍스트 랜더링 확인 가능
- 뷰포트로 다양한 치수와 방향으로 컴포넌트 랜더링 가능

<br />

**Docs** 탭에서는 컴포넌트에 대한 문서가 생성되어 표시된다. 해당 문서는 재사용 가능한 컴포넌트를 팀과 공유할때 유용하다. <br />

<br />

**toolbar** 사용자 정의로 테마와 언어를 빠르게 전환이 가능하며 `addon` 설치로 고급 기능을 확장 할 수 있다. <br />

<br /><br />

### Addons

`Addons`는 `Storybook` 핵심 기능을 확장하는 플러그인이다. <br />

<br />

- **Controls**: 컴포넌트 요소의 arguments를 동적으로 입력할 수 있다.
- **Actions**: 인터렉션이 콜백을 통해 올바른 출력을 생성하는지 확인하는데 도움을 준다. 예로는 로그아웃 버튼을 클릭하면 onLogout 콜백이 트리거 되는지 확인 할 수 있다.

<br />

`Storybook`은 확장 가능하며 `Addons` 에코시스템을 통해 스토리를 테스트, 문서화 및 최적화 할 수 있다. <br />

<br /><br />

## Setup Storybook

프로젝트에서 Button과 같은 간단한 컴포넌트를 선택하고 함께 사용할 **.stories.js** 또는 **.stories.mdx** 파일을 작성한다. <br />

```tsx
// YourComponent.stories.ts | YourComponent.stories.tsx

import React, { ComponentProps } from 'react'

import { Story, Meta } from '@storybook/react'

import { YourComponent } from './YourComponent'

//👇 This default export determines where your story goes in the story list
export default {
  title: 'YourComponent',
  component: YourComponent,
} as Meta

//👇 We create a “template” of how args map to rendering
const Template: Story<ComponentProps<typeof YourComponent>> = (args) => <YourComponent {...args} />

export const FirstStory = Template.bind({})
FirstStory.args = {
  /*👇 The args you need here will depend on your component */
}
```

<br /><br />

### Configure Storybook for your stack

`Storybook`은 [default Configuration](https://storybook.js.org/docs/react/configure/overview)을 제공한다. <br />

<br />

컴포넌트를 분리하여 랜더링전 프로젝트에 추가 요구 사항이 있을 수 있다. 이러한 설정을 **customizing configuration** 할 수 있도록 제공한다. <br />

<br /><br />

#### Build configuration like webpack and Babel

**yarn storybook** 명령으로 실행할때 CLI에 오류가 표시되는 경우 빌드 구성을 변경해야 할 수도 있다. <br />

- [Presets](https://storybook.js.org/docs/react/addons/addon-types) 설정은 **Create React App**, **SCSS** 및 **Ant Design**을 위한 설정이 있다.
- `Storybook`에 대한 [Babel](https://storybook.js.org/docs/react/configure/babel/#custom-babel-config) 구성을 지정하고 가능한 경우 자동으로 프로젝트의 구성을 사용하려고 시도한다.
- `Storybook`에서 사용하는 [webpack](https://storybook.js.org/docs/react/configure/webpack/) 구성을 조정한다.

<br /><br />

#### Runtime configuration

`Storybook`이 빌드는 되지만 브라우저상에서 오류가 발생하는 문제가 발생 할 수 있다. Storybook은 최신 브라우저와 IE11을 지원하지만 컴포넌트가 정상적으로 동작하는지 확인하기 위해서는 Babel 및 webpack 설정을 확인해야 한다. <br />

<br /><br />

#### Component context

**Decorator**를 사용하여 필요한 **context provider**로 스리를 "wrap" 하여 사용한다. <br />

<br />

**.storybook/preview.js**를 사용하면 미리보기 **iframe인** **Canvas** 탭에서 컴포넌트가 랜더링되는 방식을 사용자 지정 할 수 있다. <br />

```tsx
// .storybook/preview.js

import React from 'react'

import { ThemeProvider } from 'styled-components'

export const decorators = [
  (Story) => (
    <ThemeProvider theme="default">
      <Story />
    </ThemeProvider>
  ),
]
```

<br /><br />

## Render component styles

`Storybook`은 CSS를 생성하거나 로드하는 방법에 대해 독단적이지 않고 사용자가 제공하는 DOM 요소를 랜더링한다. Storybook 랜더링 환경에 맞게 CSS 도구를 구성해야 할 수도 있다. <br />

<br /><br />

#### CSS-in-JS like styled-components and Emotion

`CSS-in-JS`를 사용하는 경우 스타일이 Javascript로 생성되고 각 컴포넌트와 함께 제공되기 때문에 스타일이 정상 동작 가능하다. <br />

<br />

Theme 사용자는 **.storybook/preview.js**에 데코레이더를 추가해야 할 수도 있다. <br />

<br /><br />

#### @import CSS into components

`Storybook`을 사용하면 컴포넌트에 CSS 파일을 직접 가져 올 수 있다. 이 경우에는 [webpack config](https://storybook.js.org/docs/react/configure/webpack/#extendingstorybooks-webpack-config)를 설정해야 할 수도 있다. <br />

<br /><br />

#### Global imported styles

전역으로 가져온 스타일이 있는 경우 [.storybook/preview.js](https://storybook.js.org/docs/react/configure/overview#configure-story-rendering)에서 스타일을 가져온다. 스타일은 모든 스토리에 대해 `Storybook`에서 자동으로 추가된다. <br />

<br /><br />

#### Add external CSS or webfonts in thes head

CSS 링크 태그를 \<head\>에 직접 삽입하려는 경우 (webfont와 같은 리소스) [.storybook/preview-head.html](https://storybook.js.org/docs/react/configure/story-rendering/#adding-to-&#60head&#62)을 사용하여 임의의 HTML을 추가 할 수 있다. <br />

<br /><br />

#### Load fonts or images from a local directory

로컬에서 폰트 또는 이미지를 참조하는 경우 [정적 파일](https://storybook.js.org/docs/react/configure/images-and-assets)을 제공하도록 Storybook 스크립트를 구성 할 수 있다. <br />

<br /><br />

### Load assets and resources

프로젝트 또는 스토리의 정적파일에 링크하려면 -s 를 사용하여 스토리북을 시작할 때 제공할 정적 폴더를 지정한다. **package.json**에서 스토리북 및 빌드 스토리북 스크립트에 지정하도록 하자.

<br />

<br /><br />

[Ref]:

- [Introduction to Storybook for React](https://storybook.js.org/docs/react/get-started/introduction)

<br /><br /><br />
