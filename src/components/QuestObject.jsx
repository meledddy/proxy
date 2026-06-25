function QuestObject({
  icon,
  name,
  description,
  status,
  statusLabel,
  helperText,
  isLocked = false,
  isSparkly = false,
  onClick,
}) {
  return (
    <button
      className={`quest-object quest-object--${status} ${
        isSparkly ? 'quest-object--sparkly' : ''
      }`.trim()}
      disabled={isLocked}
      onClick={onClick}
      type="button"
      aria-label={`${name}. ${statusLabel}. ${helperText}`}
    >
      <span className="quest-object__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="quest-object__content">
        <span className="quest-object__topline">
          <span className="quest-object__name">{name}</span>
          <span className="status-badge">{statusLabel}</span>
        </span>
        <span className="quest-object__description">{description}</span>
        <span className="quest-object__helper">{helperText}</span>
      </span>
    </button>
  )
}

export default QuestObject
