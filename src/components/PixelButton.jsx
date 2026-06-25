function PixelButton({
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}) {
  return (
    <button
      className={`pixel-button pixel-button--${variant} ${className}`.trim()}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}

export default PixelButton
