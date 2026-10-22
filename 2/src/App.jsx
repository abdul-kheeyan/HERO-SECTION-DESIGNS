import { useEffect, useRef, useState } from 'react'
import './App.css'

const images = [
  {
    src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85',
    title: 'Old-growth forest',
    alt: 'Sunlight filtering through a lush old-growth forest',
  },
  {
    src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=85',
    title: 'Mountain stillness',
    alt: 'Quiet mountain peaks reflected in a clear lake',
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=85',
    title: 'Into the green',
    alt: 'A deep green forest illuminated by soft sunlight',
  },
  {
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85',
    title: 'Open country',
    alt: 'A wide natural landscape beneath a dramatic sky',
  },
  {
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85',
    title: 'The high places',
    alt: 'Snow-dusted mountain peaks rising into the clouds',
  },
  {
    src: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=85',
    title: 'Forest canopy',
    alt: 'Looking up through the layered green canopy of a forest',
  },
  {
    src: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=85',
    title: 'Wild encounters',
    alt: 'A deer standing in a quiet woodland',
  },
  {
    src: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85',
    title: 'Beyond the ridge',
    alt: 'Rolling green hills fading into a distant mountain range',
  },
  {
    src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=85',
    title: 'Blue horizon',
    alt: 'Ocean waves meeting the open horizon',
  },
]

const cards = images.map((item, index) => {
  const angle = (index * 137.5 * Math.PI) / 180

  return {
    ...item,
    index,
    angleCos: Math.cos(angle),
    angleSin: Math.sin(angle),
    radiusX: 0.28 + (index % 3) * 0.08,
    radiusY: 0.26 + (index % 2) * 0.09,
    rotation: (index % 2 === 0 ? 1 : -1) * (3 + (index % 5) * 2),
  }
})

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function getOpacity(progress) {
  const stops = [
    [0, 0],
    [0.18, 1],
    [0.82, 1],
    [0.98, 0],
  ]

  for (let index = 1; index < stops.length; index += 1) {
    const [end, endValue] = stops[index]
    const [start, startValue] = stops[index - 1]

    if (progress <= end) {
      const amount = (progress - start) / (end - start)
      return startValue + (endValue - startValue) * amount
    }
  }

  return 0
}

function App() {
  const sectionRef = useRef(null)
  const targetProgressRef = useRef(0)
  const [progress, setProgress] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    let frame = 0
    let currentProgress = 0
    let lastFrameTime = 0
    const animateProgress = (time) => {
      const elapsed = lastFrameTime ? time - lastFrameTime : 16
      lastFrameTime = time
      const easing = 1 - Math.exp(-elapsed / 180)
      currentProgress += (targetProgressRef.current - currentProgress) * easing

      if (Math.abs(targetProgressRef.current - currentProgress) < 0.0005) {
        currentProgress = targetProgressRef.current
      }

      setProgress(currentProgress)

      if (currentProgress !== targetProgressRef.current) {
        frame = requestAnimationFrame(animateProgress)
      } else {
        frame = 0
        lastFrameTime = 0
      }
    }
    const updateProgress = () => {
      const scrollDistance = section.offsetHeight - window.innerHeight
      targetProgressRef.current =
        scrollDistance > 0
          ? clamp(-section.getBoundingClientRect().top / scrollDistance, 0, 1)
          : 0

      if (!frame) frame = requestAnimationFrame(animateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReduceMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)

    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  return (
    <main>
      <section className="nature-journey" ref={sectionRef} aria-label="Nature journey">
        <div className="hero-stage">
          <header className="site-header">
            <a className="brand" href="#home" aria-label="Terra home">
              <span className="brand-mark" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none">
                  <path
                    d="M25.9 5.8C15.3 6.1 8.9 8 6.8 13.7c-1.4 3.9 1.1 7.2 4.7 7.2 5.9 0 12.4-8.9 14.4-15.1Z"
                    fill="currentColor"
                  />
                  <path d="M5 27c2.7-7.3 7.2-11.9 14-15.3" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
              <span>TERRA</span>
            </a>
            <span className="header-note">A FIELD GUIDE TO THE WILD</span>
            <a className="header-link" href="#home">
              Find your way <span aria-hidden="true">↗</span>
            </a>
          </header>

          <div className="ambient ambient-one" aria-hidden="true" />
          <div className="ambient ambient-two" aria-hidden="true" />
          <div className="depth-ring depth-ring-inner" aria-hidden="true" />
          <div className="depth-ring depth-ring-outer" aria-hidden="true" />

          <div
            className="hero-copy"
            id="home"
            style={{
              opacity: reduceMotion
                ? 1
                : 0.25 + progress * 0.75,
              transform: `scale(${
                reduceMotion
                  ? 1
                  : progress < 0.5
                    ? 0.7 + progress * 0.6
                    : 1 + (progress - 0.5) * 0.7
              })`,
            }}
          >
            <p className="eyebrow">
              <span className="eyebrow-line" />
              A little closer to nature
            </p>
            <h1>
              RETURN TO
              <br />
              <span>THE WILD.</span>
            </h1>
            <p className="hero-description">
              A slow journey through the places that still breathe.
              <br className="desktop-break" />
              Take a moment. Look a little closer.
            </p>
          </div>

          <div className="image-tunnel" role="list" aria-label="Nature photographs">
            {cards.map((card) => {
              const staggerSpan = 0.55
              const start = (card.index / cards.length) * (1 - staggerSpan)
              const localProgress = clamp(
                (progress + 0.16 - start) / staggerSpan,
                0,
                1,
              )
              const z = reduceMotion ? -80 : -1700 + localProgress * 2200
              const opacity = reduceMotion ? 0.78 : getOpacity(localProgress)

              return (
                <div
                  className="tunnel-card"
                  key={card.title}
                  role="listitem"
                  style={{
                    '--card-x': `${card.angleCos * card.radiusX * 100}vw`,
                    '--card-y': `${card.angleSin * card.radiusY * 100}vh`,
                    '--card-z': `${z}px`,
                    '--card-opacity': opacity,
                    '--card-rotation': `${card.rotation}deg`,
                    '--card-order': card.index + 1,
                  }}
                >
                  <div className="photo-frame">
                    <img
                      src={card.src}
                      alt={card.alt}
                      draggable="false"
                      loading="eager"
                      decoding="async"
                    />
                    <span className="photo-caption">{card.title}</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="scroll-cue" aria-hidden="true">
            <span>{reduceMotion ? 'EXPLORE BELOW' : 'SCROLL TO EXPLORE'}</span>
            <span className="scroll-line" />
          </div>

          <div className="stage-index" aria-hidden="true">
            <span>01</span>
            <span className="index-divider" />
            <span>09</span>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
