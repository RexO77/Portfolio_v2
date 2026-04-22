import {
  createContext,
  forwardRef,
  useId,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import {
  Bodies,
  Body,
  Common,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Query,
  Render,
  Runner,
  World,
  type Body as MatterJsBody,
  type IBodyDefinition,
  type IChamferableBodyDefinition,
  type MouseConstraint as MatterMouseConstraint,
  type Render as MatterRender,
  type Runner as MatterRunner,
  type Vector,
} from 'matter-js'
import polyDecomp from 'poly-decomp'
import { cn } from '@/lib/utils'
import { calculatePosition } from '@/utils/calculate-position'
import { parsePathToVertices } from '@/utils/svg-path-to-vertices'

type GravityProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  debug?: boolean
  gravity?: { x: number; y: number }
  resetOnResize?: boolean
  grabCursor?: boolean
  addTopWall?: boolean
  autoStart?: boolean
}

type MatterBodyProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  matterBodyOptions?: IBodyDefinition
  isDraggable?: boolean
  bodyType?: 'rectangle' | 'circle' | 'svg'
  sampleLength?: number
  x?: number | string
  y?: number | string
  angle?: number
}

type RegisteredElement = {
  element: HTMLElement
  props: MatterBodyProps
}

type PhysicsBody = RegisteredElement & {
  body: MatterJsBody
}

type GravityContextValue = {
  registerElement: (
    id: string,
    element: HTMLElement,
    props: MatterBodyProps,
  ) => void
  unregisterElement: (id: string) => void
}

export type GravityRef = {
  start: () => void
  stop: () => void
  reset: () => void
}

const DEFAULT_MATTER_BODY_OPTIONS: IBodyDefinition = {
  friction: 0.1,
  restitution: 0.1,
  density: 0.001,
  isStatic: false,
}

const GravityContext = createContext<GravityContextValue | null>(null)

function buildBodyDefinition(
  options: IBodyDefinition | undefined,
  angle: number,
  debug: boolean,
): IChamferableBodyDefinition {
  const { chamfer, render, ...rest } = options ?? {}

  return {
    ...rest,
    ...(chamfer ? { chamfer } : {}),
    angle,
    render: {
      ...render,
      fillStyle: debug ? '#888888' : '#00000000',
      strokeStyle: debug ? '#333333' : '#00000000',
      lineWidth: debug ? 3 : 0,
    },
  }
}

export const MatterBody = ({
  children,
  className,
  matterBodyOptions = DEFAULT_MATTER_BODY_OPTIONS,
  bodyType = 'rectangle',
  isDraggable = true,
  sampleLength = 15,
  x = 0,
  y = 0,
  angle = 0,
  ...divProps
}: MatterBodyProps) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const bodyId = useId()
  const context = useContext(GravityContext)

  useEffect(() => {
    if (!elementRef.current || !context) {
      return undefined
    }

    context.registerElement(bodyId, elementRef.current, {
      children,
      matterBodyOptions,
      bodyType,
      isDraggable,
      sampleLength,
      x,
      y,
      angle,
    })

    return () => context.unregisterElement(bodyId)
  }, [angle, bodyId, bodyType, children, context, isDraggable, matterBodyOptions, sampleLength, x, y])

  return (
    <div
      ref={elementRef}
      className={cn('absolute', className, isDraggable && 'pointer-events-none')}
      {...divProps}
    >
      {children}
    </div>
  )
}

const Gravity = forwardRef<GravityRef, GravityProps>(
  (
    {
      children,
      debug = false,
      gravity = { x: 0, y: 1 },
      grabCursor = true,
      resetOnResize = true,
      addTopWall = true,
      autoStart = true,
      className,
      ...divProps
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLDivElement>(null)
    const engineRef = useRef(Engine.create())
    const renderRef = useRef<MatterRender | null>(null)
    const runnerRef = useRef<MatterRunner | null>(null)
    const frameIdRef = useRef<number | null>(null)
    const mouseConstraintRef = useRef<MatterMouseConstraint | null>(null)
    const mouseDownRef = useRef(false)
    const isRunningRef = useRef(false)
    const canvasSizeRef = useRef({ width: 0, height: 0 })
    const registeredElementsRef = useRef(new Map<string, RegisteredElement>())
    const bodiesRef = useRef(new Map<string, PhysicsBody>())
    const interactionCleanupRef = useRef<(() => void) | null>(null)

    const syncElementPositions = useCallback(() => {
      bodiesRef.current.forEach(({ element, body }) => {
        const rotation = (body.angle * 180) / Math.PI
        const left = body.position.x - element.offsetWidth / 2
        const top = body.position.y - element.offsetHeight / 2

        element.style.transform = `translate(${left}px, ${top}px) rotate(${rotation}deg)`
      })
    }, [])

    const startElementLoop = useCallback(() => {
      const tick = () => {
        syncElementPositions()
        frameIdRef.current = window.requestAnimationFrame(tick)
      }

      frameIdRef.current = window.requestAnimationFrame(tick)
    }, [syncElementPositions])

    const removeBody = useCallback((id: string) => {
      const physicsBody = bodiesRef.current.get(id)
      if (!physicsBody) {
        return
      }

      World.remove(engineRef.current.world, physicsBody.body)
      bodiesRef.current.delete(id)
    }, [])

    const createBody = useCallback(
      (id: string, element: HTMLElement, props: MatterBodyProps) => {
        if (!canvasRef.current) {
          return
        }

        removeBody(id)

        const width = element.offsetWidth
        const height = element.offsetHeight
        const canvasRect = canvasRef.current.getBoundingClientRect()
        const angle = (props.angle ?? 0) * (Math.PI / 180)
        const definition = buildBodyDefinition(props.matterBodyOptions, angle, debug)
        const x = calculatePosition(props.x, canvasRect.width, width)
        const y = calculatePosition(props.y, canvasRect.height, height)

        let body: MatterJsBody | null = null

        if (props.bodyType === 'circle') {
          body = Bodies.circle(x, y, Math.max(width, height) / 2, definition)
        } else if (props.bodyType === 'svg') {
          const paths = element.querySelectorAll('path')
          const vertexSets: Vector[][] = []

          paths.forEach((path) => {
            const d = path.getAttribute('d')
            if (!d) {
              return
            }

            const vertices = parsePathToVertices(d, props.sampleLength)
            if (vertices.length > 0) {
              vertexSets.push(vertices)
            }
          })

          body =
            vertexSets.length > 0
              ? Bodies.fromVertices(x, y, vertexSets, definition)
              : Bodies.rectangle(x, y, width, height, definition)
        } else {
          body = Bodies.rectangle(x, y, width, height, definition)
        }

        World.add(engineRef.current.world, body)
        bodiesRef.current.set(id, { element, body, props })
      },
      [debug, removeBody],
    )

    const updateCursor = useCallback(() => {
      const canvas = canvasRef.current
      const mousePosition =
        mouseConstraintRef.current?.mouse.position ?? { x: 0, y: 0 }
      const hasHoveredBody = Query.point(engineRef.current.world.bodies, mousePosition).length > 0

      if (!canvas) {
        return
      }

      if (!mouseDownRef.current && !hasHoveredBody) {
        canvas.style.cursor = 'default'
        return
      }

      canvas.style.cursor = hasHoveredBody
        ? mouseDownRef.current
          ? 'grabbing'
          : 'grab'
        : 'default'
    }, [])

    const stopEngine = useCallback(() => {
      if (!isRunningRef.current) {
        return
      }

      if (runnerRef.current) {
        Runner.stop(runnerRef.current)
      }

      if (renderRef.current) {
        Render.stop(renderRef.current)
      }

      if (frameIdRef.current !== null) {
        window.cancelAnimationFrame(frameIdRef.current)
        frameIdRef.current = null
      }

      isRunningRef.current = false
    }, [])

    const startEngine = useCallback(() => {
      if (isRunningRef.current || !runnerRef.current || !renderRef.current) {
        return
      }

      Runner.run(runnerRef.current, engineRef.current)
      Render.run(renderRef.current)
      startElementLoop()
      isRunningRef.current = true
    }, [startElementLoop])

    const rebuildBodies = useCallback(() => {
      registeredElementsRef.current.forEach(({ element, props }, id) => {
        createBody(id, element, props)
      })
      syncElementPositions()
    }, [createBody, syncElementPositions])

    const clearRenderer = useCallback(() => {
      stopEngine()
      interactionCleanupRef.current?.()
      interactionCleanupRef.current = null

      if (mouseConstraintRef.current) {
        World.remove(engineRef.current.world, mouseConstraintRef.current)
        mouseConstraintRef.current = null
      }

      if (renderRef.current) {
        Mouse.clearSourceEvents(renderRef.current.mouse)
        renderRef.current.canvas.remove()
        renderRef.current.textures = {}
        renderRef.current = null
      }

      World.clear(engineRef.current.world, false)
      Engine.clear(engineRef.current)
      engineRef.current = Engine.create()
      runnerRef.current = null
      bodiesRef.current.clear()
      mouseDownRef.current = false
    }, [stopEngine])

    const initializeRenderer = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) {
        return
      }

      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      canvasSizeRef.current = { width, height }

      Common.setDecomp(polyDecomp as never)
      engineRef.current.gravity.x = gravity.x
      engineRef.current.gravity.y = gravity.y

      const render = Render.create({
        element: canvas,
        engine: engineRef.current,
        options: {
          width,
          height,
          wireframes: false,
          background: '#00000000',
        },
      })

      renderRef.current = render

      const mouse = Mouse.create(render.canvas)
      const mouseConstraint = MouseConstraint.create(engineRef.current, {
        mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: debug,
          },
        },
      })

      mouseConstraintRef.current = mouseConstraint
      render.mouse = mouse

      const walls = [
        Bodies.rectangle(width / 2, height + 10, width, 20, {
          isStatic: true,
          friction: 1,
          render: { visible: debug },
        }),
        Bodies.rectangle(width + 10, height / 2, 20, height, {
          isStatic: true,
          friction: 1,
          render: { visible: debug },
        }),
        Bodies.rectangle(-10, height / 2, 20, height, {
          isStatic: true,
          friction: 1,
          render: { visible: debug },
        }),
      ]

      if (addTopWall) {
        walls.push(
          Bodies.rectangle(width / 2, -10, width, 20, {
            isStatic: true,
            friction: 1,
            render: { visible: debug },
          }),
        )
      }

      World.add(engineRef.current.world, [mouseConstraint, ...walls])
      runnerRef.current = Runner.create()

      if (grabCursor) {
        const handleBeforeUpdate = () => updateCursor()
        const handlePointerDown = () => {
          mouseDownRef.current = true
          updateCursor()
        }
        const handlePointerUp = () => {
          mouseDownRef.current = false
          updateCursor()
        }

        Events.on(engineRef.current, 'beforeUpdate', handleBeforeUpdate)
        canvas.addEventListener('pointerdown', handlePointerDown)
        window.addEventListener('pointerup', handlePointerUp)

        interactionCleanupRef.current = () => {
          Events.off(engineRef.current, 'beforeUpdate', handleBeforeUpdate)
          canvas.removeEventListener('pointerdown', handlePointerDown)
          window.removeEventListener('pointerup', handlePointerUp)
        }
      }

      rebuildBodies()

      if (autoStart) {
        startEngine()
      }
    }, [addTopWall, autoStart, debug, grabCursor, gravity.x, gravity.y, rebuildBodies, startEngine, updateCursor])

    const handleResize = useCallback(() => {
      if (!resetOnResize) {
        return
      }

      clearRenderer()
      initializeRenderer()
    }, [clearRenderer, initializeRenderer, resetOnResize])

    const registerElement = useCallback(
      (id: string, element: HTMLElement, props: MatterBodyProps) => {
        registeredElementsRef.current.set(id, { element, props })

        if (renderRef.current) {
          createBody(id, element, props)
          syncElementPositions()
        }
      },
      [createBody, syncElementPositions],
    )

    const unregisterElement = useCallback(
      (id: string) => {
        registeredElementsRef.current.delete(id)
        removeBody(id)
      },
      [removeBody],
    )

    const reset = useCallback(() => {
      const wasRunning = isRunningRef.current
      stopEngine()

      bodiesRef.current.forEach(({ element, body, props }) => {
        const x = calculatePosition(props.x, canvasSizeRef.current.width, element.offsetWidth)
        const y = calculatePosition(props.y, canvasSizeRef.current.height, element.offsetHeight)
        const nextAngle = (props.angle ?? 0) * (Math.PI / 180)

        Body.setPosition(body, { x, y })
        Body.setAngle(body, nextAngle)
        Body.setVelocity(body, { x: 0, y: 0 })
        Body.setAngularVelocity(body, 0)
      })

      syncElementPositions()

      if (wasRunning) {
        startEngine()
      }
    }, [startEngine, stopEngine, syncElementPositions])

    useImperativeHandle(
      ref,
      () => ({
        start: startEngine,
        stop: stopEngine,
        reset,
      }),
      [reset, startEngine, stopEngine],
    )

    useEffect(() => {
      const registeredElements = registeredElementsRef.current

      initializeRenderer()

      return () => {
        clearRenderer()
        registeredElements.clear()
      }
    }, [clearRenderer, initializeRenderer])

    useEffect(() => {
      if (!resetOnResize) {
        return undefined
      }

      let timeoutId = 0

      const onResize = () => {
        window.clearTimeout(timeoutId)
        timeoutId = window.setTimeout(handleResize, 180)
      }

      window.addEventListener('resize', onResize)

      return () => {
        window.clearTimeout(timeoutId)
        window.removeEventListener('resize', onResize)
      }
    }, [handleResize, resetOnResize])

    return (
      <GravityContext.Provider value={{ registerElement, unregisterElement }}>
        <div
          ref={canvasRef}
          className={cn('absolute left-0 top-0 h-full w-full', className)}
          {...divProps}
        >
          {children}
        </div>
      </GravityContext.Provider>
    )
  },
)

Gravity.displayName = 'Gravity'

export default Gravity
