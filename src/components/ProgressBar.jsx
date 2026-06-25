function ProgressBar({ value, max = 4, compact = false }) {
  const safeValue = Math.min(value, max)
  const percent = (safeValue / max) * 100

  return (
    <div
      className={`progress ${compact ? 'progress--compact' : ''}`.trim()}
      aria-label={`Mood fragments collected: ${safeValue} of ${max}`}
    >
      <div className="progress__label">
        <span>Mood fragments</span>
        <strong>
          {safeValue} / {max}
        </strong>
      </div>
      <div className="progress__track" aria-hidden="true">
        <span className="progress__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export default ProgressBar
