---
title: 'Typescript enum 최적화'
date: '2022-03-28'
tags: ['javascript', 'typescript']
draft: false
summary:
---

# Typescript enum 최적화

| 해당 내용은 `typescript`의 `enum` 최적화 과정에 대한 개인적인 공부를 위한 글로 오역 및 개인적인 의견이 반영된 내용이 있을 수 있으니 참고하여 주시기 바라며 문제가 되는 내용이 있는 경우 메일로 피드백 부탁합니다.

<br />

프로젝트 번들 사이즈 최적화를 위해 무엇을 줄여볼까 찾아보던중에 `typescript`에서 열거 타입을 위해 사용하는 `enum`이 tree shaking이 잘 되지 않는다는 글을 보고 최적화를 해야겠다는 생각을 했다.

- [TypeScript enum을 사용하지 않는 게 좋은 이유를 Tree-shaking 관점에서 소개합니다.](https://engineering.linecorp.com/ko/blog/typescript-enum-tree-shaking/)

<br /><br />

## bundle

2020년에 작성되어있는 글이지만 현재 번들러 및 타입스크립트 버전과는 차이가 있어 현재 버전을 기준으로 테스트를 해보았다/

<br />

### webpack

처음 테스트는 웹팩으로 해보았고 테스트에 사용하였던 웹팩, 바벨, 타입스크립트 버전이다.

```json
{
  "@babel/core": "^7.17.8",
  "@babel/preset-env": "^7.16.11",
  "babel-loader": "^8.2.4",
  "ts-loader": "^9.2.8",
  "typescript": "^4.6.3",
  "webpack": "^5.70.0"
}
```

<br />

테스트 시작은 `enum`을 import 후에 사용하지 않더라도 즉시실행함수(IIFE)가 생성되어 tree shaking이 되지 않는지 확인 하는 것 부터 시작하였다.

```ts
// enum.ts

export enum POKEMON_TYPE {
  NORMAL = 'NORMAL',
  FIRE = 'FIRE',
  WATER = 'WATER',
  GRASS = 'GRASS',
  ELECTRIC = 'ELECTRIC',
  ICE = 'ICE',
  FIGHTING = 'FIGHTING',
  POISON = 'POISON',
  GROUND = 'GROUND',
  FLYING = 'FLYING',
  PSYCHIC = 'PSYCHIC',
  BUG = 'BUG',
  ROCK = 'ROCK',
  GHOST = 'GHOST',
  DRAGON = 'DRAGON',
  DARK = 'DARK',
  STEEL = 'STEEL',
  FAIRY = 'FAIRY',
  BIRD = 'BIRD',
  SHADOW = 'SHADOW',
}
```

```ts
// index.ts
import { POKEMON_TYPE } from './enum'

console.log('typescript enum test')
```

<br />

위 코드와 같이 `enum`을 생성 후에 index.ts에 import를 하고 사용하지 않는 경우 빌드를 하여 번들 결과를 확인하였다.

<br />

```js
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__)
console.log('typescript enum test')

/******/
```

하지만 이상하게도 위의 번들러 및 테스트 환경에서는 즉시실행함수(IIFE)가 생성되어 스크립트에서 tree shaking되지 않는 현상은 발생하지 않았다.

<br /><br />

### rollup

위의 참고하였던 글에서는 `rollup` 기준으로 테스트를 진행했던거라 `rollup`을 사용하여 테스트 환경을 구축하여 확인을 해보았다.

<br />

`rollup`은 사용을 해본경험이 많이 없어 빌드 환경 구성에 대한 자료들을 참고하여 구성하였다.

```json
{
  "@babel/core": "7.10.3",
  "@rollup/plugin-commonjs": "^21.0.3",
  "@rollup/plugin-json": "^4.1.0",
  "@rollup/plugin-node-resolve": "^13.1.3",
  "rollup": "^2.70.1",
  "rollup-plugin-peer-deps-external": "^2.2.4",
  "rollup-plugin-typescript2": "^0.31.2",
  "typescript": "^4.6.3"
}
```

<br />

신기하게도 위 버전으로 구성한 `rollup` 환경에서도 정상적으로 모두 tree shaking되어 번들 파일에 즉시실행함수(IIFE)가 남아있는 문제는 발생하지 않았다.

```js
/* bundle */
// cjs.js
'use strict'

console.log('typescript enum rollup test')

// esm.js
console.log('typescript enum rollup test')
```

<br /><br />

## enum

위에서 tree shaking에 대한 테스트를 진행 후에 `enum` 선언을 바꿔가며 빌드 결과를 확인해 보았다.

<br />

일단 `enum`을 그냥 사용한 경우 빌드 결과를 확인해 보기위해 import한 `enum` 코드를 빌드해 보았다.

```ts
// index.ts
import { POKEMON_TYPE } from './enum'

console.log(POKEMON_TYPE.BIRD)

console.log('typescript enum test')
```

<br />

해당 형태로 `enum`에 사용된 string을 꺼내 사용하자 빌드 결과에서 즉시실행함수(IIFE)가 생성되어 빌드 결과에 포함된 것을 볼 수 있었다.

<br />

```js
var POKEMON_TYPE;

(function (POKEMON_TYPE) {
  POKEMON_TYPE["NORMAL"] = "NORMAL";
  POKEMON_TYPE["FIRE"] = "FIRE";
  POKEMON_TYPE["WATER"] = "WATER";
  POKEMON_TYPE["GRASS"] = "GRASS";
  POKEMON_TYPE["ELECTRIC"] = "ELECTRIC";
  POKEMON_TYPE["ICE"] = "ICE";
  POKEMON_TYPE["FIGHTING"] = "FIGHTING";
  POKEMON_TYPE["POISON"] = "POISON";
  POKEMON_TYPE["GROUND"] = "GROUND";
  POKEMON_TYPE["FLYING"] = "FLYING";
  POKEMON_TYPE["PSYCHIC"] = "PSYCHIC";
  POKEMON_TYPE["BUG"] = "BUG";
  POKEMON_TYPE["ROCK"] = "ROCK";
  POKEMON_TYPE["GHOST"] = "GHOST";
  POKEMON_TYPE["DRAGON"] = "DRAGON";
  POKEMON_TYPE["DARK"] = "DARK";
  POKEMON_TYPE["STEEL"] = "STEEL";
  POKEMON_TYPE["FAIRY"] = "FAIRY";
  POKEMON_TYPE["BIRD"] = "BIRD";
  POKEMON_TYPE["SHADOW"] = "SHADOW";
})(POKEMON_TYPE || (POKEMON_TYPE = {}));

/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _enum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enum */ "./src/enum.ts");

console.log(_enum__WEBPACK_IMPORTED_MODULE_0__.POKEMON_TYPE.BIRD);
console.log('typescript enum test');
})();

/******/
```

<br />

### const enum

다음으로는 `const enum`을 사용하는 경우의 빌드 결과를 확인하였다.

```ts
export const enum POKEMON_TYPE {
  NORMAL = 'NORMAL',
  FIRE = 'FIRE',
  WATER = 'WATER',
  GRASS = 'GRASS',
  ELECTRIC = 'ELECTRIC',
  ICE = 'ICE',
  FIGHTING = 'FIGHTING',
  POISON = 'POISON',
  GROUND = 'GROUND',
  FLYING = 'FLYING',
  PSYCHIC = 'PSYCHIC',
  BUG = 'BUG',
  ROCK = 'ROCK',
  GHOST = 'GHOST',
  DRAGON = 'DRAGON',
  DARK = 'DARK',
  STEEL = 'STEEL',
  FAIRY = 'FAIRY',
  BIRD = 'BIRD',
  SHADOW = 'SHADOW',
}
```

```js
// bundle.js
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__)
console.log(
  'BIRD'
  /* BIRD */
)
console.log('typescript enum test')

/******/
```

`const enum`을 사용하자 즉시실행함수(IIFE)가 생성되지 않고 깔끔하게 일반 상수 string으로 치환되어 빌드 되었다. <br />
단순히 `enum` 앞에 const를 붙인 것 뿐인데 결과가 확연하게 차이가 났고 코드량이 줄어들자 bundle.js 파일 사이즈는 4.02KB에서 1KB 정도로 줄어든 것을 확인 할 수 있었다.

<br /><br />

### union type

마지막으로 가장 추천되는 `union type` 형태로 변경하여 사용하는 `enum` 코드를 사용해 보았다.

```ts
export const POKEMON_TYPE = {
  NORMAL: 'NORMAL',
  FIRE: 'FIRE',
  WATER: 'WATER',
  GRASS: 'GRASS',
  ELECTRIC: 'ELECTRIC',
  ICE: 'ICE',
  FIGHTING: 'FIGHTING',
  POISON: 'POISON',
  GROUND: 'GROUND',
  FLYING: 'FLYING',
  PSYCHIC: 'PSYCHIC',
  BUG: 'BUG',
  ROCK: 'ROCK',
  GHOST: 'GHOST',
  DRAGON: 'DRAGON',
  DARK: 'DARK',
  STEEL: 'STEEL',
  FAIRY: 'FAIRY',
  BIRD: 'BIRD',
  SHADOW: 'SHADOW',
} as const

type POKEMON_TYPE = typeof POKEMON_TYPE[keyof typeof POKEMON_TYPE]
```

<br />

사용하게될 `enum`의 상수들을 기존의 const key value 객체 형태로 변경 후에 keyof typeof를 사용하여 `union type`으로 변경하여 사용하는 코드이다.

<br />

```js
var POKEMON_TYPE = {
  NORMAL: 'NORMAL',
  FIRE: 'FIRE',
  WATER: 'WATER',
  GRASS: 'GRASS',
  ELECTRIC: 'ELECTRIC',
  ICE: 'ICE',
  FIGHTING: 'FIGHTING',
  POISON: 'POISON',
  GROUND: 'GROUND',
  FLYING: 'FLYING',
  PSYCHIC: 'PSYCHIC',
  BUG: 'BUG',
  ROCK: 'ROCK',
  GHOST: 'GHOST',
  DRAGON: 'DRAGON',
  DARK: 'DARK',
  STEEL: 'STEEL',
  FAIRY: 'FAIRY',
  BIRD: 'BIRD',
  SHADOW: 'SHADOW'
};

/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _enum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enum */ "./src/enum.ts");

console.log(_enum__WEBPACK_IMPORTED_MODULE_0__.POKEMON_TYPE.BIRD);
console.log('typescript enum test');
})();

/******/
```

const의 단순한 key value 형태의 객체가 유지되며 빌드 결과물이 생성되었고 해당 결과는 `enum`을 사용하였을 경우와 `const enum`을 사용하였을 경우 중간 사이즈인 3.63KB정도의 결과로 빌드 되었다.

<br /><br />

번들 사이즈로 확인해보았을때 `const enum`을 사용하는 것이 좋아보이지만 `const enum` 또한 `enum`과 동일하게 사용을 지양하는 편이였다. <br />

<br />

이유로는 `const enum`을 사용하는 경우 일반 상수로 치환이 된다. 이로 인하여 실제 런타임에 실행되는 코드에서 코드에러를 유발 할 수 있다고 한다. 이를 방지하기위하여 tsconfig compilerOptions에 isolatedModules 설정을 true로 설정하는 경우 `const enum` 또한 `enum`과 동일하게 즉시실행함수(IIFE)가 생성되는 것을 확인 할 수 있었다.

<br /><br />

### interface

현재 프로젝트에서는 `enum`을 API 데이터 모델 타입을 지정하기 위해 사용하는 것이 대부분이였고 `interface` 내부에서 type 지영으로 사용이 되었다.

```ts
interface POKE {
  type: POKEMON_TYPE
  name: string
}
```

<br />

위와 같이 `interface` 내부에 `enum` 타입으로 지정하여 사용하는 경우에는 빌드시 스크립트 코드에 별도의 코드가 포함되지는 않았다.

<br />

단순히 API 모델 타입으로 `enum`을 사용하는 경우에는 추가적인 최적화가 필요해보이지는 않아보였다.

<br /><br />

## In Conclusion

요즘 번들 최적화를 계속해서 진행중인데 작업들을 하며 챙기지 못한 부분들이 많았던것 같다. 그리고 `enum`에 대해서도 최적화 작업을 알아보던중 처음에 `const enum`에 대한 파일 사이즈가 일반 `enum`보다 작은것을 보고 그냥 `const enum`으로 변경하여 코드에 반영하려고 하였는데 이러한 작업을 하면서도 실제로 코드상에 반영 후 수치적으로 개선이 되는지 정확하게 확인을 하는 작업도 놓치지 않아야 한다는것을 새삼 깨닫게 되었다.

<br /><br />

[Ref]:

- [rollup Tree-shaking](https://rollupjs.org/repl)
- [Objects vs Enums](https://www.typescriptlang.org/docs/handbook/enums.html#objects-vs-enums)
- [why-is-const-enum-allowed-with-isolatedmodules](https://stackoverflow.com/questions/56854964/why-is-const-enum-allowed-with-isolatedmodules)

<br /><br /><br />
