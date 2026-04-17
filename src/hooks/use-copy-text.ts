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
    let didCopy = false

    try {
      await navigator.clipboard.writeText(text)
      didCopy = true
    } catch {
      const previouslyFocused = document.activeElement as HTMLElement | null
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.cssText =
        'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        didCopy = document.execCommand('copy')
      } catch {
        // Ignore fallback copy failures so the calling UI can stay responsive.
      }

      document.body.removeChild(textArea)
      previouslyFocused?.focus()
    }

    if (!didCopy) {
      resetCopied()
      return
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
