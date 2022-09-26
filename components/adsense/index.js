import Script from 'next/script'

import siteMetadata from '@/data/siteMetadata'

const AdsScript = () => {
  return (
    <>
      <Script
        async
        strategy="beforeInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteMetadata.adsense.client}`}
        crossorigin="anonymous"
      />
    </>
  )
}

export default AdsScript
