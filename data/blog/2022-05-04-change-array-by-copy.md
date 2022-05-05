---
title: 'Change Array by Copy (JS)'
date: '2022-05-04'
tags: ['javascript']
draft: false
summary:
---

# Change Array by Copy

| 해당 내용은 개인적인 공부를 위한 글로 오역 및 개인적인 의견이 반영된 내용이 있을 수 있으니 참고하여 주시기 바라며 문제가 되는 내용이 있는 경우 메일로 피드백 부탁합니다.

`ts39` proposal에서 `Stage 3` 내용중에 `Change Array by Copy`라는 제안을 보고 표준에 포함되고나면 많이 사용하게 될 것 같은 내용이라 정리를 해봐야겠다고 생각했다. 단순히 `Change Array by Copy` README.md를 번역하는 내용이니 정확한 내용은 [원문 제안서](https://github.com/tc39/proposal-change-array-by-copy)를 확인하길 바란다. <br />

<br />

`Array.prototype`과 `TypedArray.prototype`에 대한 추가 메소드를 제공하여 변경사항이 적용된 복사된 새로운 배열을 반환 받을 수 있게 한다.

<br /><br />

### Status

해당 제안은 현재 [Stage 3](https://github.com/tc39/proposals#stage-3)이다.

- [해당 제안 텍스트 문서](https://tc39.es/proposal-change-array-by-copy/)

<br /><br />

### Overview

이 제안은 Array.prototype에 아래와 같은 함수 속성을 도입한다.

- Array.prototype.toReversed() -> Array
- Array.prototype.toSorted(compareFn) -> Array
- Array.prototype.toSpliced(start, deleteCount, ...items) -> Array
- Array.prototype.with(index, value) -> Array

<br />

위의 모든 메서드는 대상 배열을 유지하고 변경사항이 반영된 복사본 배열을 반환한다. <br />

<br />

해당사항은 `TypedArray`에도 추가된다.

- TypedArray.prototype.toReversed() -> TypedArray
- TypedArray.prototype.toSorted(compareFn) -> TypedArray
- TypedArray.prototype.toSpliced(start, deleteCount, ...items) -> TypedArray
- TypedArray.prototype.with(index, value) -> TypedArray

<br />

해당 메소드는 `TypedArray`의 하위 클래스에서도 사용 할 수 있다.

- Int8Array
- Uint8Array
- Uint8ClampedArray
- Int16Array
- Uint16Array
- Int32Array
- Uint32Array
- Float32Array
- Float64Array
- BigInt64Array
- BigUint64Array

<br /><br />

### Example

```js
const sequence = [1, 2, 3]
sequence.toReversed() // => [3, 2, 1]
sequence // => [1, 2, 3]

const outOfOrder = new Uint8Array([3, 1, 2])
outOfOrder.toSorted() // => Uint8Array [1, 2, 3]
outOfOrder // => Uint8Array [3, 1, 2]

const correctionNeeded = [1, 1, 3]
correctionNeeded.with(1, 2) // => [1, 2, 3]
correctionNeeded // => [1, 1, 3]
```

<br /><br />

### Motivation

`Tuple.prototype`은 `Record & Tuple`에서 `Tuple`의 불변적인 특성을 처리하는 방법으로 고정 배열을 다루는 사용자에게 유용할 수 있다.

<br />

- [Javascript `Record & Tuple`](https://github.com/tc39/proposal-record-tuple)제안은 현재 `Stage 2` 단계로 `Stage 3`로 올라오면 한번 정리를 해봐야겠다.

<br /><br />

### Implementations

| [core-js](https://github.com/zloirock/core-js):

- [change-array-by-copy](https://github.com/zloirock/core-js#change-array-by-copy)

| [es-shims](https://github.com/es-shims):

- [array.prototype.tosorted](https://www.npmjs.com/package/array.prototype.tosorted)
- [array.prototype.toreversed](https://www.npmjs.com/package/array.prototype.toreversed)
- [array.prototype.tospliced](https://www.npmjs.com/package/array.prototype.tospliced)
- [array.prototype.with](https://www.npmjs.com/package/array.prototype.with)

| [./polyfill.js](https://github.com/tc39/proposal-change-array-by-copy/blob/main/polyfill.js) (minimalist reference implementation)

<br /><br />

### In Conclusion

정말 오랜만에 `tc39/proposals`를 확인해봤다. 정말 엄청나게 많은 라이브러리도 만들어지고 있지만 Javascript도 계속해서 업그레이드 되는것에 관심을 지속적으로 갖고 놓치지 않아야겠다. 이미 표준으로 추가되었지만 놓치고 있는 부분들도 많을 것으로 생각되지만 차근차근 다시 쫓아야겠다.

<br /><br />

[Ref]:

- [Change Array by copy](https://github.com/tc39/proposal-change-array-by-copy)

<br /><br /><br />
