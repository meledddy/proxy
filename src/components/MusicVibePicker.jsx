import { useEffect, useState } from 'react'
import { musicVibes } from '../data/musicVibes'
import { playVibe, stopVibe } from '../utils/audio'
import PixelButton from './PixelButton'

function Visualizer({ isPlaying }) {
  return (
    <span
      className={`visualizer ${isPlaying ? 'visualizer--playing' : ''}`.trim()}
      aria-hidden="true"
    >
      {[0, 1, 2, 3].map((bar) => (
        <span key={bar} style={{ '--delay': `${bar * 0.12}s` }} />
      ))}
    </span>
  )
}

function MusicVibePicker({ selectedVibe, onSelect }) {
  const [playingId, setPlayingId] = useState(null)
  const [audioError, setAudioError] = useState('')

  useEffect(() => {
    return () => stopVibe()
  }, [])

  const handlePlay = async (vibeId) => {
    setAudioError('')
    try {
      await playVibe(vibeId)
      setPlayingId(vibeId)
    } catch {
      setAudioError('Sound is unavailable in this browser, but the vibe still counts.')
    }
  }

  const handleStop = () => {
    stopVibe()
    setPlayingId(null)
  }

  return (
    <div className="music-picker">
      {audioError && <p className="panel-note panel-note--warning">{audioError}</p>}
      <div className="picker-grid picker-grid--vibes">
        {musicVibes.map((vibe) => {
          const isSelected = selectedVibe === vibe.id
          const isPlaying = playingId === vibe.id

          return (
            <article className="choice-card" key={vibe.id}>
              <div className="choice-card__header">
                <Visualizer isPlaying={isPlaying} />
                <div>
                  <h3>{vibe.name}</h3>
                  {isSelected && (
                    <span className="selected-badge">currently selected</span>
                  )}
                </div>
              </div>
              <p>{vibe.description}</p>
              <div className="choice-card__actions">
                <PixelButton
                  onClick={() => handlePlay(vibe.id)}
                  variant="ghost"
                  aria-label={`Play ${vibe.name} generated sound`}
                >
                  Play vibe
                </PixelButton>
                <PixelButton
                  onClick={() => onSelect(vibe.id)}
                  variant={isSelected ? 'secondary' : 'primary'}
                >
                  {isSelected ? 'Keep vibe' : 'Select vibe'}
                </PixelButton>
              </div>
            </article>
          )
        })}
      </div>
      {playingId && (
        <div className="sound-strip">
          <span>Generated sound is playing softly.</span>
          <PixelButton onClick={handleStop} variant="secondary">
            Stop sound
          </PixelButton>
        </div>
      )}
    </div>
  )
}

export default MusicVibePicker
