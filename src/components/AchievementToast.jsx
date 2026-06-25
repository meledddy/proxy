function AchievementToast({ toasts }) {
  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div className="achievement-toast" key={toast.id}>
          <span className="achievement-toast__spark" aria-hidden="true">
            *
          </span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  )
}

export default AchievementToast
