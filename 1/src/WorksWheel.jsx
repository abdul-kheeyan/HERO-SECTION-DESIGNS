import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const CARD_HEIGHT = 0.38
const CARD_MAX_WIDTH = 0.34
const CARD_RATIO = 1.45
const STEP_DEGREES = 40
const DRUM_RADIUS = 2.22
const PERSPECTIVE = 2.7
const RING_RADIUS = 1.14
const BOW_RADIUS = 1.82
const WHEEL_UNITS = 900
const DRAG_UNITS = 420
const SETTLE_DELAY = 140
const EASE = 0.12
const CULL_DISTANCE = 1.6

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const lerp = (start, end, amount) => start + (end - start) * amount
const toRadians = (degrees) => (degrees * Math.PI) / 180
const bowOffset = (degrees, bow) =>
  -bow * (1 - Math.cos(toRadians(degrees)))

function placeCard(ringDegrees, drumDegrees, ringRadius, drumRadius, bow, mix) {
  return (
    `translateX(${mix * bowOffset(drumDegrees, bow)}px)` +
    ` rotateZ(${(1 - mix) * ringDegrees}deg)` +
    ` translateY(${-(1 - mix) * ringRadius}px)` +
    ` rotateX(${mix * drumDegrees}deg)` +
    ` translateZ(${mix * drumRadius}px)`
  )
}

function WorksWheel({ items, label = 'Nature, up close' }) {
  const stageRef = useRef(null)
  const wheelRef = useRef(null)
  const cardRefs = useRef([])
  const labelRef = useRef(null)
  const titleRef = useRef(null)
  const dragY = useRef(null)
  const settling = useRef(null)
  const turn = useRef(0)
  const target = useRef(0)
  const [active, setActive] = useState(0)
  const [stage, setStage] = useState({ width: 0, height: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)

  const count = items.length
  const last = Math.max(count - 1, 0)

  useEffect(() => {
    const element = stageRef.current
    if (!element) return undefined

    const measure = () =>
      setStage({ width: element.clientWidth, height: element.clientHeight })

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const metrics = useMemo(() => {
    const { width, height } = stage
    const cardWidth = Math.min(
      height * CARD_HEIGHT * CARD_RATIO,
      width * CARD_MAX_WIDTH,
    )
    const cardHeight = cardWidth / CARD_RATIO
    const drumRadius = cardHeight * DRUM_RADIUS
    const ringRadius = cardHeight * RING_RADIUS
    const ringScale = count
      ? clamp(
          (((2 * Math.PI * ringRadius) / count) * 0.82) / (cardWidth || 1),
          0.16,
          1,
        )
      : 1

    return {
      cardWidth,
      cardHeight,
      drumRadius,
      ringRadius,
      ringScale,
      bow: cardHeight * BOW_RADIUS,
      perspective: cardHeight * PERSPECTIVE,
      titleSize: Math.max(22, cardHeight * 0.124),
      indexSize: Math.max(11, cardHeight * 0.04),
    }
  }, [count, stage])

  const goTo = useCallback(
    (next) => {
      target.current = clamp(next, 0, last + 1)
    },
    [last],
  )

  useEffect(() => {
    if (!stage.height) return undefined

    let frame
    const { ringRadius, ringScale, drumRadius, bow } = metrics

    const draw = () => {
      frame = requestAnimationFrame(draw)
      const gap = target.current - turn.current
      if (Math.abs(gap) < 0.0005) turn.current = target.current
      else turn.current += gap * (reducedMotion ? 1 : EASE)

      const progress = turn.current
      const mix = clamp(progress, 0, 1)
      const itemPosition = Math.max(0, progress - 1)

      if (wheelRef.current) {
        wheelRef.current.style.transform = `translateZ(${-mix * drumRadius}px)`
      }

      for (let index = 0; index < count; index += 1) {
        const distance = index - itemPosition
        const card = cardRefs.current[index]
        if (!card) continue

        card.style.transform = placeCard(
          distance * (360 / count),
          distance * STEP_DEGREES,
          ringRadius,
          drumRadius,
          bow,
          mix,
        )
        card.style.opacity =
          mix > 0.5 && Math.abs(distance) > CULL_DISTANCE ? '0' : '1'
        card.style.zIndex = String(Math.round(100 - Math.abs(distance) * 2))

        const face = card.firstElementChild
        if (face) {
          face.style.transform = `scale(${lerp(ringScale, 1, mix)})`
        }
      }

      if (labelRef.current) labelRef.current.style.opacity = String(1 - mix)
      if (titleRef.current) titleRef.current.style.opacity = String(mix)
      const nextActive = clamp(Math.round(itemPosition), 0, last)
      setActive((previous) => (previous === nextActive ? previous : nextActive))
    }

    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [count, last, metrics, reducedMotion, stage.height])

  useEffect(() => {
    const element = stageRef.current
    if (!element) return undefined

    const onWheel = (event) => {
      const next = target.current + event.deltaY / WHEEL_UNITS
      if (next > 0 && next < last + 1) event.preventDefault()
      goTo(next)
      window.clearTimeout(settling.current)
      settling.current = window.setTimeout(
        () => goTo(Math.round(target.current)),
        SETTLE_DELAY,
      )
    }

    element.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      element.removeEventListener('wheel', onWheel)
      window.clearTimeout(settling.current)
    }
  }, [goTo, last])

  return (
    <section className="works-wheel" aria-label={label}>
      <div
        ref={stageRef}
        className="works-wheel__stage"
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`nature-work-${active}`}
        style={{ perspective: `${metrics.perspective}px` }}
        onPointerDown={(event) => {
          dragY.current = event.clientY
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (dragY.current === null) return
          goTo(target.current + (dragY.current - event.clientY) / DRAG_UNITS)
          dragY.current = event.clientY
        }}
        onPointerUp={() => {
          dragY.current = null
          goTo(Math.round(target.current))
        }}
        onPointerCancel={() => {
          dragY.current = null
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
            event.preventDefault()
            goTo(Math.round(target.current) + 1)
          } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
            event.preventDefault()
            goTo(Math.round(target.current) - 1)
          } else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault()
            goTo(event.key === 'Home' ? 0 : last + 1)
          }
        }}
      >
        <div className="works-wheel__grain" aria-hidden="true" />
        <div className="works-wheel__orbit works-wheel__orbit--outer" aria-hidden="true" />
        <div className="works-wheel__orbit works-wheel__orbit--inner" aria-hidden="true" />

        <div ref={wheelRef} className="works-wheel__cards">
          {items.map((item, index) => (
            <div
              key={item.title}
              id={`nature-work-${index}`}
              ref={(node) => {
                cardRefs.current[index] = node
              }}
              className="works-wheel__card"
              role="option"
              aria-selected={index === active}
              style={{
                width: metrics.cardWidth,
                height: metrics.cardHeight,
                marginLeft: -metrics.cardWidth / 2,
                marginTop: -metrics.cardHeight / 2,
              }}
            >
              <span className="works-wheel__image">
                <img src={item.image} alt={item.title} draggable="false" />
                <span className="works-wheel__caption">{item.title}</span>
              </span>
            </div>
          ))}
        </div>

        <div
          ref={labelRef}
          className="works-wheel__center-label"
          style={{ fontSize: metrics.titleSize }}
          aria-hidden="true"
        >
          {label}
        </div>
        <div
          ref={titleRef}
          className="works-wheel__active-title"
          style={{ fontSize: metrics.titleSize }}
          aria-hidden="true"
        >
          {items[active]?.title}
        </div>

        <ol className="works-wheel__index" style={{ fontSize: metrics.indexSize }}>
          {items.map((item, index) => (
            <li key={item.title}>
              <button
                type="button"
                aria-current={index === active ? 'true' : undefined}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => goTo(index + 1)}
              >
                <span className="works-wheel__index-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{item.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <p className="works-wheel__hint" aria-hidden="true">
        Scroll or drag to explore
      </p>
    </section>
  )
}

export default WorksWheel
