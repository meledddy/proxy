import { formatArtifactText, formatPaletteText } from '../utils/artifactGenerator'
import PixelButton from './PixelButton'

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

function ArtifactScreen({ artifact, sketchDataUrl, onReset, onToast }) {
  const handleCopyArtifact = async () => {
    await copyText(formatArtifactText(artifact))
    onToast('Artifact Copied')
  }

  const handleCopyPalette = async () => {
    await copyText(formatPaletteText(artifact.palette))
    onToast('Palette Copied')
  }

  const downloadSketch = () => {
    if (!sketchDataUrl) {
      return
    }

    const link = document.createElement('a')
    link.href = sketchDataUrl
    link.download = 'side-quest-sketch.png'
    link.click()
  }

  return (
    <main className="artifact-screen" aria-labelledby="artifact-title">
      <article className="artifact-card">
        <div className="artifact-card__glow" aria-hidden="true" />
        <p className="eyebrow">quest complete</p>
        <h1 id="artifact-title">{artifact.title}</h1>
        <p className="artifact-card__signal">{artifact.moodText}</p>

        <dl className="artifact-fields">
          <div>
            <dt>Class</dt>
            <dd>{artifact.className}</dd>
          </div>
          <div>
            <dt>Vibe</dt>
            <dd>{artifact.vibeName}</dd>
          </div>
          <div className="artifact-fields__wide">
            <dt>Rare Skill</dt>
            <dd>{artifact.rareSkill}</dd>
          </div>
          <div className="artifact-fields__wide">
            <dt>Creative Power</dt>
            <dd>{artifact.creativePower}</dd>
          </div>
        </dl>

        <section className="palette-panel" aria-labelledby="palette-title">
          <h2 id="palette-title">Palette</h2>
          <div className="palette-list">
            {artifact.palette.map((color) => (
              <div className="palette-chip" key={color.hex}>
                <span
                  aria-label={`${color.hex} ${color.name}`}
                  className="palette-chip__swatch"
                  role="img"
                  style={{ '--chip-color': color.hex }}
                />
                <span>
                  <strong>{color.hex}</strong>
                  <small>{color.name}</small>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="tiny-note" aria-labelledby="note-title">
          <h2 id="note-title">Tiny Note</h2>
          <p>{artifact.tinyNote}</p>
        </section>

        {sketchDataUrl && (
          <section className="sketch-preview" aria-labelledby="sketch-title">
            <h2 id="sketch-title">Sketch Preview</h2>
            <img alt="Saved tiny sketch preview" src={sketchDataUrl} />
          </section>
        )}

        <div className="artifact-actions">
          <PixelButton onClick={handleCopyArtifact}>Copy artifact text</PixelButton>
          <PixelButton onClick={handleCopyPalette} variant="secondary">
            Copy palette
          </PixelButton>
          {sketchDataUrl && (
            <PixelButton onClick={downloadSketch} variant="secondary">
              Download sketch
            </PixelButton>
          )}
          <PixelButton onClick={onReset} variant="ghost">
            Start over
          </PixelButton>
        </div>
      </article>
    </main>
  )
}

export default ArtifactScreen
