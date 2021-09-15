---
title: 'React Query: Important Defaults'
date: '2021-09-14'
tags: ['javascript', 'react', 'react-query']
draft: false
summary:
---

# React Query: Important Defaults

`useQuery` 또는 `useInfiniteQuery`를 통한 쿼리 인스턴스는 기본적으로 캐시된 데이터를 오래된 데이터로 간주한다.

<br />

해당 동작을 변경하려면 `staleTime` 옵션을 사용하여 전역 혹은 쿼리별로 쿼리 옵션을 설정 할 수 있다. `staleTime`을 지정하는 경우 해당 시간 동안은 쿼리가 데이터를 다시 가져 오지 않는다. <br />

<br / >

아래와 같은 경우에는 쿼리는 백그라운드에서 자동으로 refetch 된다.

- 쿼리에 새로운 인스턴스가 마운트 되었을때
- 창이 다시 포커스 되었을때
- 네트워크가 다시 연결 되었을때
- 선택적으로 refetch interval이 지정 되었을때

<br />

예상하지 못한 refetch가 발생한다면 React Query가 `refetchOnWindowFocus`를 수행하기 때문일 수 있다. 개발중에는 특히 브라우져와 DevTools 사이에 초점을 맞추면 refetch가 발생하기 때문에 작업이 더 자주 트리거 될 수 있으므로 주의해야한다. <br />

<br />

위와 같은 사항에서는 옵션으로 refetchOnMount, refetchOnWindowFocus, refetchOnReconnect 그리고 refetchInterval과 같은 설정으로 변경 할 수 있다. <br />

<br />

`useQuery` 또는 `useInfiniteQuery` 쿼리 관찰자의 'active' 인스턴스가 더 이상 없는 쿼리 결과는 'inactive' 레이블이 지정되고 다시 사영할 경우를 대비하여 캐시에 남아있는다. <br />

- 기본적으로 'inactive' 쿼리는 5분후에 garbage colledcted 된다.
- 이를 변경하려면 쿼리에 대한 기본 cacheTime인 1000 _ 6 _ 5(ms) 가 아닌 다른 값으로 변경해야한다.

<br />

실패한 쿼리는 자동으로 3번 재시도되며, UI에 오류를 캡쳐하고 표시하기 전에 지수 백오프(exponential backoff delay)가 발생한다.

- 재시도 횟수 및 지연시간을 변경하려면 retry와 retryDelay로 변경이 가능하다.

<br />

기본적으로 쿼리 결과는 구조적으로 공듀되어 데이터가 실제로 변경되었는지 감지한다. 변경되지 않은 경우에는 데이터 참조가 변경되지 않은 상태로 유지되어 useMemo 및 useCallback에 대한 안정화에 도움이된다. 대부분의 경우 이 기능을 비활성화 할 필요가 없으며 큰비용을 차지하여 앱의 성능에 영향을 끼치지 않는다고 한다.

- 만약 큰 응답으로 인하여 성능 문제가 발생하는 경우 config.structuralSharing 플래그를 사용하여 기능을 비활성화 할 수 있다.
- JOSN과 호환되지 않는 값을 처리하고 데이터 변경 여부를 감지하려는 경우 config.isDataEqual을 사용하여 데이터 비교 함수를 정의 할 수 있다.

<br />

<br /><br />

[Ref]:

- [React Query: Important Defaults](https://react-query.tanstack.com/guides/important-defaults)

<br /><br /><br />
