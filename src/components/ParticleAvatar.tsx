import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Particle = {
  hx: number // home position (where it belongs in the face)
  hy: number
  sx: number // scattered start position for the fly-in
  sy: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  delay: number
  phase: number
}

type Props = { src: string; alt: string }

// The canvas extends past the avatar by this fraction on each side, so particles have room to move.
const MARGIN = 0.25

const INTRO_DURATION = 1.5 // seconds for the fly-in
const SPRING = 0.06 // pull back toward home
const DAMPING = 0.82 // velocity kept each frame
const REPEL_RADIUS = 60 // px around the cursor
const REPEL_FORCE = 4
const DRIFT = 0.6 // px of idle wobble

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)

// Samples the photo on a grid and turns each pixel into a dot, masked to a soft-edged circle.
function sampleParticles(img: HTMLImageElement, box: number, cols: number): Particle[] {
  const sampler = document.createElement('canvas')
  sampler.width = sampler.height = cols
  const ctx = sampler.getContext('2d', { willReadFrequently: true })
  if (!ctx) return []
  ctx.drawImage(img, 0, 0, cols, cols)
  const { data } = ctx.getImageData(0, 0, cols, cols)

  const step = box / cols
  const offset = box * MARGIN
  const area = box * (1 + MARGIN * 2)
  const particles: Particle[] = []

  for (let row = 0; row < cols; row++) {
    for (let col = 0; col < cols; col++) {
      const dist = Math.hypot((col + 0.5) / cols - 0.5, (row + 0.5) / cols - 0.5)
      if (dist > 0.5) continue

      const i = (row * cols + col) * 4
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]]
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
      if (luminance < 0.08) continue // too dark to see on the background anyway

      const alpha = Math.min(1, (0.5 - dist) / 0.1)
      const hx = offset + (col + 0.5) * step
      const hy = offset + (row + 0.5) * step
      // Start anywhere in a zone twice the canvas size, so some particles fly in from off-canvas.
      const sx = (Math.random() * 2 - 0.5) * area
      const sy = (Math.random() * 2 - 0.5) * area
      particles.push({
        hx,
        hy,
        sx,
        sy,
        x: sx,
        y: sy,
        vx: 0,
        vy: 0,
        size: step * (0.35 + luminance * 0.45),
        color: `rgba(${r},${g},${b},${alpha.toFixed(2)})`,
        delay: Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      })
    }
  }
  return particles
}

export default function ParticleAvatar({ src, alt }: Props) {
  const reduced = useReducedMotion()
  const [failed, setFailed] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (reduced || failed) return
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!wrapper || !canvas || !ctx) {
      setFailed(true)
      return
    }

    let particles: Particle[] = []
    let area = 0
    let introStart = 0
    let introDone = false
    let raf = 0
    let running = false
    let onScreen = true
    const mouse = { x: -9999, y: -9999 }

    const img = new Image()
    img.src = src

    function setup(withIntro: boolean) {
      const box = wrapper!.clientWidth
      area = box * (1 + MARGIN * 2)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = canvas!.height = area * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Fewer particles on small screens and low-end devices.
      const lowEnd = box < 260 || (navigator.hardwareConcurrency ?? 8) <= 4
      particles = sampleParticles(img, box, lowEnd ? 64 : 96)
      introDone = !withIntro
      if (!withIntro) for (const p of particles) [p.x, p.y] = [p.hx, p.hy]
      introStart = -1 // set from the first animation frame, so timing uses one clock
    }

    function update(now: number) {
      if (introStart < 0) introStart = now
      const elapsed = (now - introStart) / 1000
      const t = now / 1000

      if (!introDone) {
        let allHome = true
        for (const p of particles) {
          const k = Math.min(1, Math.max(0, (elapsed - p.delay) / INTRO_DURATION))
          const e = easeOutQuart(k)
          p.x = p.sx + (p.hx - p.sx) * e
          p.y = p.sy + (p.hy - p.sy) * e
          if (k < 1) allHome = false
        }
        introDone = allHome
        return
      }

      for (const p of particles) {
        // Idle drift: the home point wobbles slightly so the face never looks frozen.
        const tx = p.hx + Math.sin(t * 0.8 + p.phase) * DRIFT
        const ty = p.hy + Math.cos(t * 0.7 + p.phase) * DRIFT

        // Cursor repulsion: push away, stronger the closer the cursor is.
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < REPEL_RADIUS * REPEL_RADIUS) {
          const d = Math.sqrt(d2) || 1
          const force = (1 - d / REPEL_RADIUS) * REPEL_FORCE
          p.vx += (dx / d) * force
          p.vy += (dy / d) * force
        }

        // Spring back home.
        p.vx = (p.vx + (tx - p.x) * SPRING) * DAMPING
        p.vy = (p.vy + (ty - p.y) * SPRING) * DAMPING
        p.x += p.vx
        p.y += p.vy
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, area, area)
      for (const p of particles) {
        ctx!.fillStyle = p.color
        ctx!.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
      }
    }

    function frame(now: number) {
      update(now)
      draw()
      raf = requestAnimationFrame(frame)
    }

    // Only animate while the avatar is on screen and the tab is visible.
    function syncLoop() {
      const shouldRun = onScreen && !document.hidden && particles.length > 0
      if (shouldRun && !running) {
        running = true
        raf = requestAnimationFrame(frame)
      } else if (!shouldRun && running) {
        running = false
        cancelAnimationFrame(raf)
      }
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    function onPointerLeave() {
      mouse.x = mouse.y = -9999
    }

    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      syncLoop()
    })
    let lastBox = 0
    const resize = new ResizeObserver(() => {
      const box = wrapper.clientWidth
      if (!img.complete || !lastBox || box === lastBox) return
      lastBox = box
      setup(false)
    })

    img.onerror = () => setFailed(true)
    img.onload = () => {
      setup(true)
      lastBox = wrapper.clientWidth
      visibility.observe(canvas)
      resize.observe(wrapper)
      syncLoop()
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', syncLoop)

    return () => {
      cancelAnimationFrame(raf)
      visibility.disconnect()
      resize.disconnect()
      img.onload = img.onerror = null
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', syncLoop)
    }
  }, [src, reduced, failed])

  if (reduced || failed) {
    return <img src={src} alt={alt} className="size-full rounded-full object-cover" />
  }

  return (
    <div ref={wrapperRef} className="relative size-full">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={alt}
        className="pointer-events-none absolute"
        style={{ inset: `-${MARGIN * 100}%`, width: `${100 + MARGIN * 200}%`, height: `${100 + MARGIN * 200}%` }}
      />
    </div>
  )
}
