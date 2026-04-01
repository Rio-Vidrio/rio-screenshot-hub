export default function ActionDivider({ label }: { label: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      margin: '10px 0'
    }}>
      <div style={{ flex: 1, height: '0.5px', background: '#E8E4DF' }} />
      <span style={{
        fontSize: '10px', color: '#A39E99', fontFamily: 'var(--font-dm)',
        fontWeight: 400, letterSpacing: '0.06em', whiteSpace: 'nowrap'
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: '0.5px', background: '#E8E4DF' }} />
    </div>
  )
}
