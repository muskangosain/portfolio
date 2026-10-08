import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Particle = {
  hx: number // home position (where it belongs in the face)
  hy: number
  x: number
  y: number
  size: number
  color: string
}

type Props = { src: string; alt: string }

// The canvas extends past the avatar by this fraction on each side, so particles have room to move.
const MARGIN = 0.25

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
      particles.push({
        hx,
        hy,
        x: hx,
        y: hy,
        size: step * (0.5 + luminance * 0.4),
        color: `rgba(${r},${g},${b},${alpha.toFixed(2)})`,
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

    const img = new Image()
    img.src = src
    img.onerror = () => setFailed(true)
    img.onload = () => {
      const box = wrapper.clientWidth
      const area = box * (1 + MARGIN * 2)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.height = area * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Fewer particles on small screens and low-end devices.
      const lowEnd = box < 260 || (navigator.hardwareConcurrency ?? 8) <= 4
      const particles = sampleParticles(img, box, lowEnd ? 64 : 96)

      ctx.clearRect(0, 0, area, area)
      for (const p of particles) {
        ctx.fillStyle = p.color
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
      }
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
        className="absolute"
        style={{ inset: `-${MARGIN * 100}%`, width: `${100 + MARGIN * 200}%`, height: `${100 + MARGIN * 200}%` }}
      />
    </div>
  )
}
