export interface CursorDialogPoint {
  x: number
  y: number
}

interface ResolveCursorDialogPointOptions {
  clientX: number
  clientY: number
  rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>
  offsetX?: number
  offsetY?: number
  safeLeft?: number
  safeRight?: number
  safeTop?: number
  safeBottom?: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function resolveCursorDialogPoint({
  clientX,
  clientY,
  rect,
  offsetX = 18,
  offsetY = 20,
  safeLeft = 12,
  safeRight = 180,
  safeTop = 12,
  safeBottom = 64,
}: ResolveCursorDialogPointOptions): CursorDialogPoint {
  const rawX = clientX - rect.left + offsetX
  const rawY = clientY - rect.top + offsetY

  const maxX = Math.max(safeLeft, rect.width - safeRight)
  const maxY = Math.max(safeTop, rect.height - safeBottom)

  return {
    x: clamp(rawX, safeLeft, maxX),
    y: clamp(rawY, safeTop, maxY),
  }
}
