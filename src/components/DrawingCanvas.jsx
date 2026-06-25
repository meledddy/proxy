import { useEffect, useRef, useState } from 'react'
import PixelButton from './PixelButton'

const swatches = ['#F7C7DB', '#FFD166', '#B8F2E6', '#8A7CF6', '#FAFAFA']

function DrawingCanvas({ initialSketch, onSave }) {
  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)
  const lastPointRef = useRef(null)
  const [brushSize, setBrushSize] = useState(8)
  const [brushColor, setBrushColor] = useState('#FFD166')

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.lineCap = 'round'
    context.lineJoin = 'round'

    if (!initialSketch) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    const image = new Image()
    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
    }
    image.src = initialSketch
  }, [initialSketch])

  const getPoint = (event) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    }
  }

  const startDrawing = (event) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    isDrawingRef.current = true
    lastPointRef.current = getPoint(event)
  }

  const draw = (event) => {
    if (!isDrawingRef.current) {
      return
    }

    event.preventDefault()
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const nextPoint = getPoint(event)
    const previousPoint = lastPointRef.current ?? nextPoint

    context.strokeStyle = brushColor
    context.lineWidth = brushSize
    context.beginPath()
    context.moveTo(previousPoint.x, previousPoint.y)
    context.lineTo(nextPoint.x, nextPoint.y)
    context.stroke()

    lastPointRef.current = nextPoint
  }

  const stopDrawing = (event) => {
    if (event.pointerId && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    isDrawingRef.current = false
    lastPointRef.current = null
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  const saveCanvas = () => {
    const dataUrl = canvasRef.current.toDataURL('image/png')
    onSave(dataUrl)
  }

  return (
    <div className="drawing-tool">
      <p className="panel-note">
        Draw anything: a star, a tiny monster, a weird shape, or absolutely
        nothing serious.
      </p>
      <p className="panel-note panel-note--small">
        Drawing is optional and decorative. Saving the canvas completes this
        fragment.
      </p>

      <div className="canvas-wrap">
        <canvas
          aria-label="Decorative sketch canvas. Drawing is optional."
          className="sketch-canvas"
          height="360"
          onPointerCancel={stopDrawing}
          onPointerDown={startDrawing}
          onPointerLeave={stopDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          ref={canvasRef}
          role="img"
          width="640"
        />
      </div>

      <div className="drawing-controls" aria-label="Sketch controls">
        <label className="control-field">
          <span>Brush size</span>
          <input
            max="22"
            min="2"
            onChange={(event) => setBrushSize(Number(event.target.value))}
            type="range"
            value={brushSize}
          />
        </label>

        <div className="color-palette" aria-label="Brush colors">
          {swatches.map((color) => (
            <button
              aria-label={`Use brush color ${color}`}
              className={brushColor === color ? 'is-selected' : ''}
              key={color}
              onClick={() => setBrushColor(color)}
              style={{ '--swatch': color }}
              type="button"
            />
          ))}
          <label className="custom-color">
            <span>Custom</span>
            <input
              aria-label="Choose custom brush color"
              onChange={(event) => setBrushColor(event.target.value)}
              type="color"
              value={brushColor}
            />
          </label>
        </div>

        <div className="drawing-controls__actions">
          <PixelButton onClick={clearCanvas} variant="secondary">
            Clear
          </PixelButton>
          <PixelButton onClick={saveCanvas}>Save sketch</PixelButton>
        </div>
      </div>
    </div>
  )
}

export default DrawingCanvas
