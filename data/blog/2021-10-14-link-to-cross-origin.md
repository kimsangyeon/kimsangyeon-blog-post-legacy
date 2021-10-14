---
title: 'Link to cross-origin destinations are unsafe'
date: '2021-09-29'
tags: ['javascript', 'react', 'typescript']
draft: false
summary:
---

# Link to cross-origin destinations are unsafe

target="\_blank" 속성을 사용하여 다른사이트 페이지를 링크하게되면 성능 및 보안 문제에 노출 될 수 있다. <br />

- 링크되어 열린 페이지는 기존의 페이지와 동일한 프로세스에서 실행 될 수 있으며 새로 열린 페이지에서 메모리 혹은 연산을 많이 사용하게 되는 경우 성능이 저하 될 수 있다.
- 링크되어 열린 페이지는 window.opener 속성을 사용하여 기존 페이지에 엑세스 할 수 있다. 이는 기존 페이지를 악성 URL 등으로 redirect 할 수 있는 위험도 있다.

<br />

위와 같은 문제를 방지하기위해 target="\_blank" 링크에 rel="noopenner" 또는 rel="noreferrer"를 추가하여야 한다. <br />

<br />

- Chromium 버전 88 부터는 target="\_blank" anchor는 자동적으로 noopenner를 기본적으로 사용한다. 하지만 Edge Legacy 및 Internet Explorer를 포함한 레거시 브라우저 사용자를 보호하기위해 명시적으로 rel="noopener" 를 사용하는 것이 좋다. <br />

<br /><br />

### How the Lighthouse cross-origin destination audit fails

Lighthouse를 통하여 cross-origin에 대한 안전하지 않은 링크를 검사 할 수 있다. <br />

- target="\_blank" 속성을 포함하지만 rel="noopenner" 또는 rel="noreferrer" 를 포함하지 않는 모든 \<a\> 태그를 잡아낸다.
- 이후 동일한 호스트 링크를 필터링한다.

<br /><br />

### How to improve your site's performance and prevent security vulnerabilities

Lighthouse에 검사된 각 링크에 rel="noopenner" 또는 rel="noreferrer" 를 추가한다. <br />

- rel="noopenner"는 새 페이지가 window.openner 속성에 엑세스 할 수 없도록 하고 별도 프로세스에서 실행되도록 한다.
- rel="noreferrer"는 "noopenner"과 동일하게 동작하지만 Referer 헤어가 새 페이지로 전송되는 것을 방지한다.

<br />

<br /><br />

[Ref]:

- [Links to cross-origin destinations are unsafe](https://web.dev/external-anchors-use-rel-noopener/)

<br /><br /><br />
