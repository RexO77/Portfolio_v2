import { useCallback, useEffect, useRef, useState } from 'react'

export function useCopyText(text: string, successDurationMs = 2000) {
  const [copied, setCopied] = useState(false)
  const resetTimeoutRef = useRef<number | null>(null)

  const resetCopied = useCallback(() => {
    if (resetTimeoutRef.current === null) {
      setCopied(false)
      return
    }

    window.clearTimeout(resetTimeoutRef.current)
    resetTimeoutRef.current = null
    setCopied(false)
  }, [])

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()

      try {
        document.execCommand('copy')
      } catch {
        // Ignore fallback copy failures so the calling UI can stay responsive.
      }

      document.body.removeChild(textArea)
    }

    resetCopied()
    setCopied(true)
    resetTimeoutRef.current = window.setTimeout(() => {
      resetTimeoutRef.current = null
      setCopied(false)
    }, successDurationMs)
  }, [resetCopied, successDurationMs, text])

  useEffect(() => {
    return () => {
      resetCopied()
    }
  }, [resetCopied])

  return {
    copied,
    copy,
    resetCopied,
  }
}
