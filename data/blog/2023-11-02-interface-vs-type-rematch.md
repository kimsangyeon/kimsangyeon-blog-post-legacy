---
title: 'interface vs type alias rematch'
date: '2023-11-02'
tags: ['javascript', 'typescript']
draft: false
summary:
---

# interface vs type alias rematch

최근 함께 일하는 친구들과의 기술 공유에서 `interface`와 `type`의 비교를 공유 받았고 이전에 프로젝트 객체 타입 정의를 `interface`를 사용하자고 결정한 부분을 다시 돌아보게 되는 일이 있었다. <br />

<br />

해당 결정을 언제 하였는지 정확하게는 기억이 나지 않지만, 함께 논의 및 검토 후 `interface`를 사용하는 것으로 결정하였다. 최근 기술 공유에서의 내용으로는 그때의 결정이 잘못된 결정이었고 다음 프로젝트부터는 `type`을 쓰는 것이 좋을 것 같다는 것으로 공유받았다. <br />

<br />

위 일을 돌아보며 이전의 결정과 달라졌던 이유에 대해서 간략하게 정리해 보고자 한다. <br />

<br />

| 해당 내용은 개인적인 공부를 위한 글로 오역 및 개인적인 의견이 반영된 내용이 있을 수 있으니 참고하여 주시기 바라며 문제가 되는 내용이 있는 경우 메일로 피드백 부탁합니다. <br />

<br /><br />

# interface로의 결정

처음 `interface`와 `type`에 대해 논의가 시작되었던 것은 프로젝트 내에서 객체 형태로 관리되는 상태나 API 데이터 모델 타입 정의에서 두 가지 형태가 함께 사용되다 보니, `interface`와 `type`을 너무 혼합 사용하고 있어 하나로 통일하면 어떻겠냐는 의견에서부터 시작하였던 것으로 기억한다. <br />

<br />

`interface`와 `type`에 대한 논의는 예전부터 화두 되었던 주제 중 하나여서 이전에 블로그에도 정리를 한 적이 있었다. <br />

- [type alias & interface](https://kimsangyeon-github-io.vercel.app/blog/2021-01-21-typealias-interface)

<br />

그 당시 정리 내용으로는 Typescript 공식 문서에서도 객체에 대한 타입 지정을 가능하다면 `interface`의 사용을 추천하고 union 혹은 tuple과 같이 `interface`로 정의할 수 없는 타입의 경우에 `type`을 사용하는 것을 권장했다. <br />

- [interfaces vs type aliases](https://www.typescriptlang.org/docs/handbook/advanced-types.html#interfaces-vs-type-aliases) (해당 부분은 저의 오역이 있을 수 있으니 예전 원문 확인)
- [interfaces vs type aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces) (글 작성 기준으로 최신 원문의 경우에도 비슷한 형태로 interface 사용으로 가이드)

<br />

위 내용(원문 확인)을 토대로 함께 일하는 친구들에게 설명했고 위와 같이 `interface` 사용을 주로 하되 `interface`로 정의하지 못하는 타입의 한에서 `type`을 사용하도록 결정하였다. <br />

<br />

실제 사용 예로는 상속형태를 띠는 컴포넌트의 Props 정의 등에서 유용하게 사용하였다. <br />

물론 아래 형태는 `type`으로도 타입 정의 및 표현은 가능하다.

```tsx
// Button.tsx
export interface ButtonProps {
  text: string;
}

const Button = ({ text }: ButtonProps) => (
	...
);

// LinkButton.tsx
import { ButtonProps } from './Button.tsx';

interface LinkButtonProps extends ButtonProps {
  link: string;
}

const LinkButton = ({ text, link }: LinkButtonProps) => (
  ...
);

```

<br /><br />

# type을 사용하자

`type`을 사용하는 것이 좋겠다는 기술 공유를 듣고 나서 다시 위 이슈를 찾아보니 쉽게 여러 의견을 찾을 수 있었다. <br />

- [Type vs Interface: Which Should You Use In 2023?](https://www.totaltypescript.com/type-vs-interface-which-should-you-use)
- [Types vs. Interfaces in Typescript: Making the Right Choice](https://dzone.com/articles/types-vs-interfaces-in-typescript-making-the-right?ref=dailydev)
- etc…

<br />

`interface`는 상속을 지원하는 extends와 implements 지원을 통한 class로서의 정의 처리가 가능하다. <br />

```tsx
interface Animal {
  name: string
}

interface Bear extends Animal {
  honey: boolean
}

const bear = getBear()
bear.name
bear.honey
```

하지만 위와 같은 간단한 상속 처리는 `type`의 교차 처리를 사용하여 타입 확장 혹은 결합 처리로 비슷하게 타입 처리를 할 수 있다. <br />

```tsx
type Animal = {
  name: string
}

type Bear = Animal & {
  honey: Boolean
}

const bear = getBear()
bear.name
bear.honey
```

위처럼 간단한 상속이 아닌 `interface`를 활용한 조금 더 깊은 상속 처리가 필요한 경우가 아니라면 `type` 사용으로도 충분히 처리가 가능하다. 물론 `type`으로도 반복적인 교차 연산(&)으로 모든 타입 정의가 가능하다. <br />

<br />

다음으로는 `interface` merge에 대한 문제점이었다. `interface`는 동일한 범위 내에서 동일한 이름으로 정의하는 경우 선언 병합 처리된다. 이는 Typescript 컴파일 과정에서 아무런 문제 없이 병합 처리 되기 때문에 예기치 못한 문제를 발생시킬 가능성이 존재한다는 것이었다. 사실상 같은 이름으로 선언한다는 부분 자체가 문제이지만 `interface` 사용 시 이를 명시적으로 확인할 수 없지만 `type`을 사용하는 경우 명시적으로 에러를 발생시켜 확인 할 수 있다. <br />

<br />

Typescript에서의 위와 같은 처리 시 `interface`의 경우에는 선언된 이름을 통해 캐시 처리되어 컴파일 과정이 `type` 선언보다 성능이 좋다는 얘기도 있었지만, 여러 글에서는 유형에 따라 성능이 다르게 나올 수 있으며 현재는 해당 성능이 크게 차이 나지 않는다고 한다. <br />

<br />

마지막으로 `type`으로는 Typescript에서의 모든 타입 정의가 가능하며 tuple, union 그리고 아래와 같은 객체에서의 키값으로 computed property name 형태의 정의가 가능하다. <br />

![interface-vs-type-rematch1](/static/images/posts/interface-vs-type-rematch1.png)

<br /><br />

# 정리

## interface 사용

내용들을 정리하며 `interface`를 사용하면 안 되는 이유?에서 다시 시작해 보았다. 무조건 사용하면 안 된다! 라는 전제는 아니지만 `interface`의 문제?라고 생각되었던 부분들을 뽑아보았다. <br />

<br />

선언 병합의 경우 같은 공간(파일, 블록) 내에서 선언이 아니라면 발생하지 않는 사항이며 타입정의의 경우 대부분 파일 최상단에 정의하며 혹여나 동일한 `interface` 명칭으로 선언하는 경우에 내부 요소가 옵션 널 처리 되지 않는 요소라면 컴파일 단계에서 해당 `interface`를 사용하는 객체에서 에러가 발생하게 되고 인지할 수 있을 것으로 생각된다. <br />

```tsx
interface Error {
  message: string
  code: number
}

interface Error {
  type: string
}

// Error 발생
// Property 'type' is missing in type '{ message: string; code: number; }'
// but required in type 'Error'.
const e: Error = {
  message: 'Error!',
  code: 400,
}
```

<br />

리액트 컴포넌트의 경우에 Props 타입의 동일한 명칭의 `interface`가 존재하는 경우에 Props에서 두 가지 `interface`의 요소를 선언하여 사용할 수 있지만 보통 컴포넌트 Props의 타입 지정은 컴포넌트 바로 상위에 위치하여 동일한 이름의 `interface` Props가 선언될 일이 있을까라는 생각이 든다. 실제로도 `interface`로의 중복된 선언은 프로젝트 진행 중에 없었던 것으로 기억한다. <br />

```tsx
interface ButtonProps {
	text: string;
	type: string;
}

interface ButtonProps {
	color: string;
}

// Button 컴포넌트 내에서 color를 사용하지 않아도 추가적인 에러는 발생하지 않음
const Button = ({
	text,
	type
}: ButtonProps) => {
  ...
};
```

<br />

마지막으로의 하나는 만약 프로젝트 내에서의 모든 타입 선언을 하나로 통일하고자 한다면 `interface`는 객체의 타입 정의만 가능하므로 사실상 불가능하여 해당 니즈가 있는 경우에는 `type`으로 모두 통일하여야 한다. <br />

<br /><br />

## type 사용

`type`을 사용하여 타입을 지정하는 경우에는 일단 기본적으로 알아본 사항에서는 큰 제약 사항이 없었다. Typescript에서 제공하는 모든 타입의 형태를 `type`으로는 표현할 수 있기 때문이다. <br />

<br />

굳이 하나를 뽑는다면 Typescript에서 객체 형태의 타입 지정은 `interface`로 권장하고 있다. 정도로 생각된다. 그리고 class 정의를 implements를 활용하여 `interface`를 사용하는 것이 더 적절한 상황도 있지만 class 형태의 정의는 현재 프로젝트 내에서 거의 사용하고 있지 않는 상황이다. <br />

<br /><br />

# 결론

사실 개인적으로는 객체에 대한 타입 정의를 객체라는 표기로서의 `interface`를 쓰며 extends를 사용한 객체 상속 확장 형태가 코드 해석 및 가독성 부분에서 더 좋다고 생각되기는 한다. 하지만 `type`을 써도 상관은 없으며 위에서 두 가지를 다시 비교해 보았을 때도 큰 문제는 없다는 생각이 들었다. <br />

<br />

이 부분에 대해서 다시 정리해 보고 생각을 해본 이유는 현재 프로젝트를 리드하고 있는 상황에서 결정 하나하나가 함께 일하는 친구들에게 미칠 영향에 대해서 크게 생각하지 않았던 것 같다. 물론 함께 검토를 진행하고 어떤 방향으로 나아갈지 결정하지만, 당시의 결정이 잘못된 결정이었다고 생각이 들지 않도록 조금 더 상세한 검토와 이유를 고민하고 방향성을 제시할 수 있도록 노력해야겠다는 생각이 들었다. <br />

<br /><br /><br />
