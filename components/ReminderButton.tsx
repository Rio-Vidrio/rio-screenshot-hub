'use client'
import { useState } from 'react'
import { buildReminderUrl, isIOS, buildICSContent, triggerICSDownload } from '@/lib/gcal'

interface ReminderButtonProps {
  title: string
  description: string
}

export default function ReminderButton({ title, description }: ReminderButtonProps) {
  const [expanded, setExpanded] = useState(false)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowISO = tomorrow.toLocaleDateString('en-CA', { timeZone: 'America/Phoenix' })
  const [date, setDate] = useState(tomorrowISO)
  const [time, setTime] = useState('12:00')

  const calendarEmail = (() => {
    try {
      const prefs = JSON.parse(localStorage.getItem('calendarPrefs') || '{}')
      return prefs.calendars?.[prefs.defaultIndex ?? 0]?.email || ''
    } catch { return '' }
  })()

  const handleConfirm = () => {
    if (isIOS()) {
      const [hr, mn] = time.split(':').map(Number)
      const endDate = new Date(0, 0, 0, hr, mn + 30)
      const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`
      const ics = buildICSContent({ title, date, startTime: time, endTime, details: description })
      triggerICSDownload(ics, 'reminder.ics')
    } else {
      const url = buildReminderUrl(title, description, calendarEmail, date, time)
      window.open(url, '_blank')
    }
    setExpanded(false)
  }

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', height: '40px', background: '#FFFFFF',
          border: '1px solid #D4CEC8', borderRadius: '6px',
          fontFamily: 'var(--font-dm)', fontWeight: 500, fontSize: '13px',
          color: '#1A1714', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          padding: '0 14px', transition: 'background 0.15s'
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#F5F2EE')}
        onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}
      >
        <span>Remind me tomorrow at 12PM</span>
        <span style={{ color: '#A39E99' }}>→</span>
      </button>

      {expanded && (
        <div style={{
          background: '#F5F2EE', borderRadius: '6px', padding: '12px',
          marginTop: '6px', animation: 'fadeIn 0.15s ease'
        }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: '#A39E99', fontFamily: 'var(--font-dm)' }}>Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{
                  border: '1px solid #D4CEC8', borderRadius: '6px', padding: '7px 10px',
                  fontSize: '13px', fontFamily: 'var(--font-dm)', color: '#1A1714',
                  background: '#FFFFFF', width: '100%'
                }}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: '#A39E99', fontFamily: 'var(--font-dm)' }}>Time</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                style={{
                  border: '1px solid #D4CEC8', borderRadius: '6px', padding: '7px 10px',
                  fontSize: '13px', fontFamily: 'var(--font-dm)', color: '#1A1714',
                  background: '#FFFFFF', width: '100%'
                }}
              />
            </div>
          </div>
          <button
            onClick={handleConfirm}
            style={{
              width: '100%', height: '40px', background: '#1A1714',
              color: '#FAFAF9', border: 'none', borderRadius: '6px',
              fontFamily: 'var(--font-dm)', fontWeight: 500, fontSize: '13px',
              cursor: 'pointer', marginBottom: '8px'
            }}
          >
            Set reminder →
          </button>
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setExpanded(false)}
              style={{
                background: 'none', border: 'none', fontSize: '11px',
                color: '#A39E99', fontFamily: 'var(--font-dm)', cursor: 'pointer'
              }}
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
