import { useState } from 'react'

export default function LoadingFrame({ className = '', onLoad, onError, ...iframeProps }) {
  const [loaded, setLoaded] = useState(false)

  const finishLoading = event => {
    setLoaded(true)
    onLoad?.(event)
  }

  const finishOnError = event => {
    setLoaded(true)
    onError?.(event)
  }

  return (
    <div className={`loading-frame${loaded ? ' is-loaded' : ''} ${className}`.trim()} aria-busy={!loaded}>
      <span className="loading-frame-skeleton" aria-hidden="true" />
      <iframe {...iframeProps} onLoad={finishLoading} onError={finishOnError} />
    </div>
  )
}
