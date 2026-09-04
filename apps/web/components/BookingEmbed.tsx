'use client'

import Cal, { getCalApi } from '@calcom/embed-react'
import { useEffect } from 'react'

export default function BookingEmbed() {
  useEffect(() => {
    ;(async function () {
      const cal = await getCalApi()
      cal('ui', {
        theme: 'light',
        styles: { branding: { brandColor: '#C9A24C' } },
        hideEventTypeDetails: false,
      })
    })()
  }, [])

  return (
    <Cal
      calLink={process.env.NEXT_PUBLIC_CALCOM_LINK || 'leon-digital-agency/discovery-call'}
      style={{ width: '100%', height: '100%', minHeight: '700px' }}
      config={{ layout: 'month_view' }}
    />
  )
}
