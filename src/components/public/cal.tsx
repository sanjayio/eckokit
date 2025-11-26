'use client'

import { useEffect } from 'react'

import Cal, { getCalApi } from '@calcom/embed-react'

export default function CalIFrame() {
  useEffect(() => {
    ;(async function () {
      const cal = await getCalApi({ namespace: 'zenvoflow-discovery-call' })
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' })
    })()
  }, [])
  return (
    <Cal
      namespace="zenvoflow-discovery-call"
      calLink="iamsanjay/zenvoflow-discovery-call"
      style={{ width: '100%', height: '100%', overflow: 'scroll' }}
      config={{ layout: 'month_view' }}
    />
  )
}
