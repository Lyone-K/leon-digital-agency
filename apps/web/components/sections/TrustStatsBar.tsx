'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

type Stat = { label: string; value: number; suffix?: string }

function CountUp({ value }: { value: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 900
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setDisplay(Math.round(progress * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, value])

  return <span ref={ref}>{display}</span>
}

export default function TrustStatsBar({ stats }: { stats: Stat[] }) {
  return (
    <section className="bg-ink text-bone">
      <div className="ledger-rule mx-auto max-w-content px-6">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={`border-gold-hairline py-8 pr-6 ${i > 0 ? 'border-l' : ''}`}
            >
              <p className="tabular-figure text-3xl text-gold md:text-4xl">
                <CountUp value={stat.value} />
                {stat.suffix === 'none' ? '' : stat.suffix}
              </p>
              <p className="mt-2 text-xs text-bone/60">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
