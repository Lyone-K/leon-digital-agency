'use client'

import { useRef, useState, useCallback } from 'react'
import { GripVertical, ImageOff } from 'lucide-react'

type Props = {
  beforeSrc?: string | null
  afterSrc?: string | null
  label?: string
  caption?: string
}

function Placeholder({ text }: { text: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-emerald-deep text-bone/40">
      <ImageOff className="h-6 w-6" />
      <span className="text-xs uppercase tracking-wide">{text}</span>
    </div>
  )
}

export default function BeforeAfterSlider({ beforeSrc, afterSrc, label, caption }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(50) // percentage, 0 = all "before", 100 = all "after"
  const dragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, pct)))
  }, [])

  return (
    <div>
      {label && <p className="mb-3 text-sm font-medium text-ink">{label}</p>}
      <div
        ref={containerRef}
        className="relative aspect-[16/10] w-full select-none overflow-hidden border border-gold-hairline"
        onMouseMove={(e) => dragging.current && updatePosition(e.clientX)}
        onMouseUp={() => (dragging.current = false)}
        onMouseLeave={() => (dragging.current = false)}
        onTouchMove={(e) => updatePosition(e.touches[0].clientX)}
      >
        {/* After image — full width, base layer */}
        <div className="absolute inset-0">
          {afterSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={afterSrc} alt="After" className="h-full w-full object-cover" />
          ) : (
            <Placeholder text="After" />
          )}
        </div>

        {/* Before image — clipped to the slider position via clip-path, sits on top */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          {beforeSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={beforeSrc} alt="Before" className="h-full w-full object-cover" />
          ) : (
            <Placeholder text="Before" />
          )}
        </div>

        {/* Divider handle */}
        <div
          className="absolute inset-y-0 z-10 flex w-1 -translate-x-1/2 cursor-ew-resize items-center justify-center bg-gold"
          style={{ left: `${position}%` }}
          onMouseDown={() => (dragging.current = true)}
          onTouchStart={() => (dragging.current = true)}
          onTouchEnd={() => (dragging.current = false)}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-ink shadow-md">
            <GripVertical className="h-4 w-4" />
          </div>
        </div>

        <span className="absolute left-3 top-3 bg-ink/70 px-2 py-1 text-xs uppercase tracking-wide text-bone">
          Before
        </span>
        <span className="absolute right-3 top-3 bg-ink/70 px-2 py-1 text-xs uppercase tracking-wide text-bone">
          After
        </span>
      </div>
      {caption && <p className="mt-2 text-xs text-slate-soft">{caption}</p>}
    </div>
  )
}
