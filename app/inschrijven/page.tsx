export default function InschrijvenPage() {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg)',
      padding: '5rem',
      boxSizing: 'border-box',
    }}>
      <iframe
        src="https://groepsadmin.scoutsengidsenvlaanderen.be/groepsadmin/lidworden?groep=A3121G"
        width="100%"
        height="900px"
        style={{
          border: 'none',
          display: 'block',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
        title="Inschrijven Scouts 121"
      />
    </div>
  )
}