'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, motion } from 'framer-motion'

type Metric = {
  label: string
  value: number
  suffix?: string
  prefix?: string
  context?: string
}

function CountUp({ value, delay = 0 }: { value: number; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1000
    const start = performance.now() + delay
    const step = (now: number) => {
      if (now < start) {
        requestAnimationFrame(step)
        return
      }
      const progress = Math.min((now - start) / duration, 1)
      setDisplay(Math.round(progress * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, value, delay])

  return <span ref={ref}>{display}</span>
}

export default function AnimatedMetricRow({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="border-l border-gold-hairline pl-4"
        >
          <p className="tabular-figure text-3xl text-gold md:text-4xl">
            {metric.prefix}
            <CountUp value={metric.value} delay={i * 80} />
            {metric.suffix}
          </p>
          <p className="mt-1 text-xs text-bone/60">{metric.label}</p>
          {metric.context && <p className="text-xs text-bone/40">{metric.context}</p>}
        </motion.div>
      ))}
    </div>
  )
}
