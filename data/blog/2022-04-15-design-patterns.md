---
title: '모든 개발자가 배워야 할 3가지 디자인 패턴'
date: '2022-04-15'
tags: ['design pattern']
draft: false
summary:
---

# 모든 개발자가 배워야 할 3가지 디자인 패턴

| 해당 내용은 개인적인 공부를 위한 글로 오역 및 개인적인 의견이 반영된 내용이 있을 수 있으니 참고하여 주시기 바라며 문제가 되는 내용이 있는 경우 메일로 피드백 부탁합니다.

`daily dev` 추천 글 중에 모든 개발자가 배워야 할 3가지 디자인 패턴이라는 제목의 글을 보고 관심이 생겨 공부 겸 번역을 해보기로 하였다. 최근까지 실제 업무에서는 `Next.js` 기반의 프로젝트 위에서 개발을 하다 보니 딱히 디자인 패턴에 대해 생각을 하지는 못한 채 주어진 환경에 맞게 페이지 컴포넌트, 그리고 내부에서 사용되는 container 혹은 presenter 형태로 컴포넌트를 나누는 정도의 생각으로 작업했던 것 같다.

<br />

모든 개발자가 알아야 하는 3가지 디자인 패턴이라는 게 무엇일지 번역을 해보며 하나씩 알아보겠다.

<br /><br />

## Translation

디자인패턴은 소프트웨어 엔지니어가 자주 접하는 문제에 대한 높은 수준의 답변이다. 이것은 코드가 아니며 문제에 접근하여 해결책을 찾는 방법을 설명하는 것과 같다.

<br />

컴퓨터공학이나 다른 IT 관련 분야에서 디자인패턴을 배웠지만 충분하게 훈련받지 못한 사람들은 그 패턴을 잊어버리거나 소프트웨어 개발에 쓸모가 없다고 생각하게 된다.

- 해당 번역이 매끄럽진 않지만 어느 정도는 이해가 가는 내용이었다. 나조차도 컴퓨터공학을 전공하며 디자인패턴을 배웠지만 실제로 디자인패턴을 사용해야 한다는 생각을 가지며 처음부터 실무에서 코드를 작성하진 않았다. 사람 그리고 환경마다 다르겠지만 처음 실무에서 이미 작성된 프로젝트의 코드를 유지보수하는 일을 맡았으며 신입사원 시절에는 어떤 코드가 어떤 역할을 수행하는지 파악하는 게 급급했던 것 같다. 지금 생각해보면 해당 프로젝트의 디자인패턴은 어떤 것을 사용하였을까로 접근했다면 조금 더 넓은 시각으로 코드를 파악할 수 있지 않았을까 하는 생각이 든다.

<br />

그런데도 소프트웨어 개발 경력이 진행됨에 따라 패턴을 인식하고 이를 활용하여 마이크로서비스/시스템/솔루션을 구성하는 능력을 갖추어야 한다.

<br /><br />

### 디자인패턴이 당신에게 유익한 몇 가지 이유가 있다.

디자인패턴은 작업을 더 쉽게 하기 위해 사용된다.

<br />

예를 들어, 프로그램을 작성할 때 객체의 기본 규칙은 모든 속성이 비공개여야 하고 다른 클래스에서 접근할 수 없다. 그렇다면 어떻게 코드를 더 유지보수하기 쉽게 만들 수 있을까? 이는 `Creational Design Pattern`을 활용하여 코드를 정리할 수 있다.

<br />

또 다른 예는 디자인패턴이 본인과 동료가 보다 효과적으로 의사소통하는 데 사용할 수 있는 공유 어휘를 설정한다. "싱글톤을 사용하세요"라고 말하는 것과 같이 패턴과 이름을 모두 알고 있다면 문제 해결에 있어 효과적인 의사소통으로 사용될 수 있다.

<br /><br />

### 1. Strategy Design Pattern

`Strategy pattern` 또는 `Policy pattern`은 런타임 중에 알고리즘을 선택할 수 있게 하는 디자인 패턴이다.

- 해당 부분 번역이 쉽지 않아 위키백과의 `Strategy pattern` 내용을 참고하였다.
- 특정한 계열의 알고리즘을 정의하고 각 알고리즘을 캡슐화하며 이 알고리즘들을 해당 계열 안에서 상호 교체가 가능하게 만든다.

<br />

예를 들자면 고객에게 메일로 보낼 수 있는 앱을 만들었다고 가정해보자. 앱의 첫 번째 버전에는 자전거 배달이 포함되어 큰 인기를 얻었다. 회사가 도시 전역으로 확장할 때 자전거 배달은 더 이상 좋은 대안이 아니다. 비즈니스에서 자동차로 배달할 수 있는 기능을 요청하게 되고 이것은 시작에 불과했다. 나중에는 레일이 추가되고 다른 여러 요구사항이 추가되었다. 배달 관련 기능의 크기가 커지고 새로운 알고리즘이 추가됨에 따라 관리가 어려워진다. 해당 기능의 작은 문제가 전체 기능을 위험에 빠뜨릴 수 있고 하나의 문제에도 전체 앱을 다시 테스트해야 할 수 있다.

<br />

따라서 위의 기능 알고리즘을 `Strategy`라고 하는 독립적인 기능으로 분리하여 개발하도록 한다.

<br />

아래 pseudocode는 메인 클래스가 `Strategy`를 사용하여 다양한 방식으로 배달하는 기능을 사용하는 방법을 보여준다.

```java
interface process PackageStrategy has
  method processPackage(package);

//These strategies implement the algorithm by implementing the interface above.
class SendByRail implements process PackageStrategy has
 method processPackage(package) {
   //process the package that will be sent by Rail and return something
 }
class SendByBike implements process PackageStrategy has
 method processPackage(package) {
  //  process and return something
 }
//strategies used by the context class
class Context {
  private strategy: processPackageStrategy

  method setStrategy(processPackageStrategy Strategy) does
  this.strategy= strategy;

  method executeStrategy(Package package) does
    return strategy.processPackage();
}

// read that strategy from user (UI or Api)
class App {
 create a new context instance;
 get package info;
 read the desired user choice

 if (choice is rail) then
  context.setStrategy(new SendByRail())

 if (choice is bike) then
  context.setStrategy(new SendByBike())

 response = context.executeStrategy(package)
 //do something with response.
```

<br /><br />

### 2. Singleton Design Pattern

인스턴스가 하나만 필요한 경우에 `Singleton pattern`을 사용한다. 클래스의 인스턴스화를 제한하여 데이터베이스, 저장소 및 파일과 같은 공유 리소스에 대한 제어를 유지하는 것이다.

<br />

최초로 인스턴스 생성 이후에는 생성자 호출 시 최초의 생성자가 생성한 인스턴스를 리턴한다.

```js
class Store {
  static instance
  constructor() {
    if (!Store.instance) {
      this._state = []
      Store.instance = this
    }
    return Store.instance
  }
  add(stuff) {
    this._state.push(stuff)
  }
}

const instance = new Store()
Object.freeze(instance)

export default instance

// In other files
const a = new Store()
a.add('phone')

const b = new Store()
console.log(b._state) // outputs ["phone"] - shared state
```

<br /><br />

### 3. Observer Design Pattern

`Observer pattern`은 수많은 객체 간의 일대다 관계인 경우의 기초입니다.

<br />

예로는 `React`를 사용하면 상태관리를 하는 `Redux`에 대해 들어본 적 있을 것이다. `Redux`는 `Observer pattern`의 구현으로 store에서 action에 따른 상태 업데이트에 따라 - Components가 변경 사항을 표현한다.

- Redux는 단방향 데이터 바인딩으로 `flux pattern`으로도 많이 소개되며 [flux](https://facebook.github.io/flux/)는 facebook에서 만든 사용자 인터페이스 구축을 위한 아키텍처이다.

<br />

또한 원격 저장소에 코드가 반영되는 경우 CI 환경에서 변경 사항을 모니터링하고 빌드를 실행하는 것도 `Observing`된다고 할 수 있다.

<br /><br />

### Is using design patterns always a good idea?

디자인패턴은 문제해결에 대한 이점을 제공하는 것으로 알려져 있다. 하지만 과도하게 사용하면 부작용이 있을 수 있다.

<br />

따라서 개발자는 디자인패턴을 사용하는 것이 프로젝트에 효율적이고 적절한지 고려하고 대안적인 솔루션을 찾아 디자인패턴과 비교해야 한다. 디자인패턴을 채택하기 전에 디자인패턴의 고유한 제약 조건과 절충안을 이해하는 것이 중요하다.

<br /><br />

### In Conclusion

예전 편집 프로그램을 만들 때는 `MVC 패턴`과 솔루션 인스턴스가 하나만 생성되게 하기 위해 `Singleton Pattern`을 사용하여 개발을 했었다. 이후에는 `React`를 기반으로 한 개발을 하며 단방향 데이터 바인딩에 따른 `flux`와 같은 개념에 대해서 공부하였지만 실제로 디자인패턴을 기반으로 하여 개발은 잘 하지 않았던 것 같다. 물론 `React`로 개발하며 `Container`와 `Presenter`를 나누어 개발하는 등의 패턴으로는 개발은 하였지만, 이제 너무 많은 라이브러리(모듈)를 사용하는 사용자의 입장으로 개발하는 경우가 많은 것 같다. 위에서 말했든 많은 라이브러리(모듈)를 사용하면서도 디자인패턴에 따른 접근을 하여 어떤 디자인패턴으로 구현하였는지를 알아보며 넓은 시각으로 코드를 파악하도록 해야겠다.

<br /><br />

[Ref]:

- [3 Design Patterns Every Developer Should Learn](https://blog.bitsrc.io/3-design-patterns-every-developer-should-learn-71a51568ac9d)
- [Strategy pattern](https://ko.wikipedia.org/wiki/%EC%A0%84%EB%9E%B5_%ED%8C%A8%ED%84%B4)
- [Singleton pattern](https://ko.wikipedia.org/wiki/%EC%8B%B1%EA%B8%80%ED%84%B4_%ED%8C%A8%ED%84%B4)

<br /><br /><br />
