---
title: 'Next.js에서 API Routes와 Server Express 사용해보기'
date: '2022-02-06'
tags: ['javascript', 'next.js']
draft: false
summary:
---

# Next.js에서 API Routes와 Server Express 사용해보기

`github`, `jenkins` 등 여러 환경의 api 들을 받아 proxy 역할을 하는 프록시 서버를 구축하고 이를 설정할 수 있는 간단한 페이지를 구성하는 사내 스터디를 시작하였다. 이때 `Next.js`를 사용하여 간단한 페이지를 구성하고 해당 노드 서버를 활용하여 proxy 역할을 수행하도록 작업하기로 하였다. 여기서 각자 역할을 맡아 작업하다 보니 `Next.js`의 API Routes를 활용하는 방법과 Server Express에 코드를 작성하게 되는 두 가지 방법으로 작업 되었는데 API Routes 만으로도 Server Express를 구성하지 않고 모두 작업이 가능한지와 두 가지는 어떨 때 나눠서 코드를 구성하면 좋을지 의문이 생겨 여러 자료를 참고하여 자료를 정리해보고자 한다.

<br />

| 여러 자료를 참고하여 내용을 정리 및 번역을 하다 보니 오역 및 개인적인 의견이 반영된 내용이 있을 수 있으니 참고하여 주시기 바라며 문제가 되는 내용이 있는 경우 메일로 피드백 부탁합니다.

<br /><br />

## Next.js API Routes

일단 간단히 `Next.js`에서 제공하는 API Routes를 정리해본다.

<br />

`Next.js` 프로젝트에서 `pages/api` 폴더 내의 파일은 `/api*`로 처리되며 해당 코드는 서버 측 번들로 클라이언트 번들에 포함되지 않는다. 아래는 예로 `pages/api/user.js` 형태로 구성하는 경우 `json` 정보를 리턴하는 코드이다.

```js
// pages/api/user.js

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
```

<br />

API 구성은 동적 경로를 지원하며 페이지에서 사용되던 파일 명명 규칙과 동일하게 사용된다. 아래는 예로 `pages/api/post/[pid].js` 동적 경로로 구성하였을 경우의 코드이다.

```js
// pages/api/post/[pid].js

export default function handler(req, res) {
  const { pid } = req.query
  res.end(`Post: ${pid}`)
}
```

동적 경로 정보는 `req query`에 포함되어있어 코드 상에서 쉽게 사용할 수 있다.

<br />

- 추가적인 API Routes 정보는 Next Docs [API Routes](https://nextjs.org/docs/api-routes/introduction)를 확인

<br /><br />

## Express Server API

`Express Server`는 server 폴더 하위에 express server 구성 및 api 코드를 작성한다.

<br />

아래는 간단하게 예시로 작성한 `server` 폴더 하위 `express server` 구성 및 api 코드이다.

```js
// server/index.js

const express = require('express')
const cors = require('cors')
const webhook = require('./webhook')
const app = express()
const port = process.env.PORT || 8080

app.use(cors())
app.use('/webhook', webhook())

app.listen(port, () => console.log(`Listening on port ${port}`))
```

`server/index.js`에 express 환경을 구성한뒤 webhook.js에서 api 구성을 해보았다.

```js
// server/webhook.js

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

module.exports = function handler () {
  router.use(bodyParser.json());

  router.get('/', function(req, res) {
    res.send('express server');
  });

  router.post('/api', (req, res) => {
    ...
  });

  return router;
}
```

<br /><br />

## Next API routes & Express Server

위에 설명한 두 가지 방법처럼 API를 구성 할 수가 있는데 어떠한 방법으로 코드를 구성하면 좋을지 고민이 되었고 두 가지 구성하는 방법들을 찾아보았다.

<br />

일단 공통 사항으로는 `pages/api/`, `server` 폴더에 코드를 구성하는 경우 두 가지 모두 클라이언트 코드 번들에 포함되지 않기 때문에 해당 사항은 같을 것으로 보인다.

<br />

처음 찾은 질 답글에서는 간단한 처리인 경우에는 `next.js api`로 구성하는 것이 좋을 것이라는 의견이었다. 간단한 데이터 fetching, proxy, server-side cookies, etc ... <br />

해당 내용에는 동의하는 바이며 express를 install하고 환경을 구축하는 것보다는 단순히 `pages/api/`에 구성하는 것이 간단할 것이기 때문이다. 하지만 좀 더 복잡한 서버 처리가 필요한 경우에는 `server`에 express 환경을 구성하여 서버를 구성하는 것이 좋다는 의견이었다. <br />

<br />

또 다른 글에서는 `Next.js`는 SEO, 개발 경험 및 성능 개선을 위한 프로젝트로 `Next.js`에서 제공하는 API 라우팅 시스템을 활용하여 API 구축에 관해 `Express.js`를 대체 할 수 있으며 이는 프로젝트에 포함된 API인 경우에 의미가 있으며, 독립 실행형 API인 경우에는 의미가 없을 것이라는 의견이였다.

<br />

비슷한 내용이지만 다른 의견으로는 serverless 형태로 호스팅하는 경우에 빌드 및 배포시에 백엔드 수정사항에 대해서도 전체 프로젝트가 빌드 및 배포가 진행되기 때문에 프로젝트 크기가 큰 경우에는 별도로 서버를 구성하는 것이 좋을 것이라는 의견이었다.

<br /><br />

## Conclusion

여러 의견과 내 생각을 정리해 보자면 프로젝트에 포함되는 간단한 api 경우에는 `pages/api`에 쉽게 api를 작성할 수 있는 점을 활용하여 코드를 구성하는 것이 좋을 것 같다. 그리고 독립적으로 사용되는 api와 추가적인 서버 작업이 필요한 경우에는 별도의 서버를 구성하는 것이 좋을 것으로 생각된다. 그리고 프로젝트가 큰 경우에도 프론트와 백엔드 코드를 구분 짓는 것이 좋은 빌드 및 배포 환경을 구성하는 방법으로 보인다. <br />
처음 이 생각을 하게 된 프로젝트는 프록시를 설정할 수 있는 페이지와 이러한 설정을 CRUD하는 api가 필요하고 실제로 api를 proxy하는 서버로 나뉘어 구성하는 것이 좋은 방법인 것 같다. <br />

<br />

서버에 대한 코드를 실무에서 만지거나 환경을 구축하는 등의 경험이 없어 해당 내용을 정확하게 이해하였는지 본인도 아리송한 상황이다. 여러 가지 방법중 하나의 방법을 선택하고 어떤 것이 좋은지 비교하는 과정들을 거쳐 가며 서버 쪽에 대한 지식도 쌓도록 노력해야겠다.

<br /><br />

[Ref]:

- [Are all apis created in th apis folder server less?](https://www.reddit.com/r/nextjs/comments/qzewjo/are_all_apis_created_in_th_apis_folder_server_less/)
- [NextJS vs Express [closed]](https://stackoverflow.com/questions/69918766/nextjs-vs-express/70039294)
- [Should I develop a separate express server, or handle all API calls in my next.js app?](https://stackoverflow.com/questions/67358959/should-i-develop-a-separate-express-server-or-handle-all-api-calls-in-my-next-j)

<br /><br /><br />
