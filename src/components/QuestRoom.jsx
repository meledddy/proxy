import { useEffect, useRef, useState } from 'react'
import CharacterPicker from './CharacterPicker'
import DrawingCanvas from './DrawingCanvas'
import MusicVibePicker from './MusicVibePicker'
import PixelButton from './PixelButton'
import ProgressBar from './ProgressBar'
import QuestObject from './QuestObject'

const questObjects = [
  {
    id: 'game-console',
    icon: '[]',
    name: 'Game Console',
    description: 'Pick the tiny class that matches the current creative build.',
    panel: 'class',
  },
  {
    id: 'headphones',
    icon: '))',
    name: 'Headphones',
    description: 'Choose a generated soundtrack vibe for the room.',
    panel: 'vibe',
  },
  {
    id: 'sketchbook',
    icon: '/_',
    name: 'Sketchbook',
    description: 'Leave a small sketch, shape, line, or visual note.',
    panel: 'sketch',
  },
]

function QuestRoom({
  completedObjects,
  collectedFragments,
  selectedClass,
  selectedVibe,
  sketchDataUrl,
  onSelectClass,
  onSelectVibe,
  onSaveSketch,
  onUnlockArtifact,
}) {
  const [activePanel, setActivePanel] = useState(null)
  const panelRef = useRef(null)
  const isPixelReady = collectedFragments >= 3
  const fragmentCount = Math.min(collectedFragments, 4)

  useEffect(() => {
    if (!activePanel) {
      return undefined
    }

    panelRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActivePanel(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activePanel])

  const getObjectStatus = (objectId) => {
    if (completedObjects.includes(objectId)) {
      return {
        status: 'complete',
        statusLabel: 'complete',
        helperText: 'Fragment collected. You can open this again.',
      }
    }

    return {
      status: 'available',
      statusLabel: 'available',
      helperText: 'Open this object to collect a mood fragment.',
    }
  }

  const renderPanel = () => {
    if (!activePanel) {
      return null
    }

    const panelTitle = {
      class: 'Choose your character class',
      vibe: 'Choose the soundtrack vibe',
      sketch: 'Leave a tiny sketch',
    }[activePanel]

    return (
      <section
        aria-labelledby="quest-panel-title"
        className="quest-panel"
        ref={panelRef}
        role="dialog"
        tabIndex="-1"
      >
        <div className="quest-panel__header">
          <div>
            <p className="eyebrow">room object opened</p>
            <h2 id="quest-panel-title">{panelTitle}</h2>
          </div>
          <PixelButton
            aria-label="Close quest panel"
            onClick={() => setActivePanel(null)}
            variant="ghost"
          >
            Close
          </PixelButton>
        </div>

        {activePanel === 'class' && (
          <CharacterPicker
            onSelect={onSelectClass}
            selectedClass={selectedClass}
          />
        )}
        {activePanel === 'vibe' && (
          <MusicVibePicker onSelect={onSelectVibe} selectedVibe={selectedVibe} />
        )}
        {activePanel === 'sketch' && (
          <DrawingCanvas initialSketch={sketchDataUrl} onSave={onSaveSketch} />
        )}
      </section>
    )
  }

  return (
    <main className="quest-room" aria-labelledby="room-title">
      <section className="room-intro">
        <p className="eyebrow">quest room</p>
        <h1 id="room-title">A tiny cozy room appears.</h1>
        <p>
          Click the objects, collect mood fragments, and charge the glowing
          pixel.
        </p>
        <ProgressBar value={fragmentCount} />
      </section>

      <section className="room-board" aria-label="Clickable quest objects">
        {questObjects.map((object) => {
          const objectStatus = getObjectStatus(object.id)
          return (
            <QuestObject
              {...objectStatus}
              description={object.description}
              icon={object.icon}
              key={object.id}
              name={object.name}
              onClick={() => setActivePanel(object.panel)}
            />
          )
        })}
        <QuestObject
          description="The final tiny pixel waits for enough collected mood."
          helperText={
            isPixelReady
              ? 'The pixel is ready.'
              : 'This pixel is still charging.'
          }
          icon="*"
          isLocked={!isPixelReady}
          isSparkly
          name="Glowing Pixel"
          onClick={onUnlockArtifact}
          status={isPixelReady ? 'available' : 'locked'}
          statusLabel={isPixelReady ? 'ready' : 'locked'}
        />
      </section>

      <div className="fragment-counter">
        Mood fragments collected: <strong>{fragmentCount} / 4</strong>
      </div>

      {renderPanel()}
    </main>
  )
}

export default QuestRoom
