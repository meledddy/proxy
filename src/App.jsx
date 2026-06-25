import { useEffect, useMemo, useState } from 'react'
import AchievementToast from './components/AchievementToast'
import ArtifactScreen from './components/ArtifactScreen'
import PixelButton from './components/PixelButton'
import ProgressBar from './components/ProgressBar'
import PythonEasterEggs from './components/PythonEasterEggs'
import QuestRoom from './components/QuestRoom'
import StartScreen from './components/StartScreen'
import { generateArtifact } from './utils/artifactGenerator'
import { stopVibe } from './utils/audio'
import {
  clearQuestState,
  defaultQuestState,
  loadQuestState,
  saveQuestState,
} from './utils/storage'

const questTotal = 4

const isEmptyQuestState = (state) => {
  return (
    !state.hasStarted &&
    !state.selectedClass &&
    !state.selectedVibe &&
    !state.sketchDataUrl &&
    state.completedObjects.length === 0 &&
    state.unlockedAchievements.length === 0 &&
    !state.hasSeenArtifact
  )
}

const createToastId = () => {
  if (crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random()}`
}

function App() {
  const [questState, setQuestState] = useState(loadQuestState)
  const [toasts, setToasts] = useState([])
  const collectedFragments = Math.min(
    questState.completedObjects.length,
    questTotal,
  )

  useEffect(() => {
    if (isEmptyQuestState(questState)) {
      clearQuestState()
      return
    }

    saveQuestState({
      ...questState,
      collectedFragments,
    })
  }, [questState, collectedFragments])

  useEffect(() => {
    return () => stopVibe()
  }, [])

  const artifact = useMemo(() => {
    return generateArtifact({
      selectedClass: questState.selectedClass,
      selectedVibe: questState.selectedVibe,
      sketchDataUrl: questState.sketchDataUrl,
    })
  }, [questState.selectedClass, questState.selectedVibe, questState.sketchDataUrl])

  const showToast = (achievementName) => {
    const id = createToastId()
    setToasts((currentToasts) => [
      ...currentToasts,
      {
        id,
        message: `Achievement unlocked: ${achievementName}`,
      },
    ])

    window.setTimeout(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.id !== id),
      )
    }, 2800)
  }

  const recordAchievement = (achievementName) => {
    showToast(achievementName)
    setQuestState((currentState) => {
      if (currentState.unlockedAchievements.includes(achievementName)) {
        return currentState
      }

      return {
        ...currentState,
        unlockedAchievements: [
          ...currentState.unlockedAchievements,
          achievementName,
        ],
      }
    })
  }

  const completeObject = (objectId, achievementName, patch = {}) => {
    const wasComplete = questState.completedObjects.includes(objectId)
    const nextCompletedObjects = wasComplete
      ? questState.completedObjects
      : [...questState.completedObjects, objectId]
    const nextAchievements = []

    if (!wasComplete && achievementName) {
      nextAchievements.push(achievementName)
    }

    const wasPixelCharged = questState.completedObjects.length >= 3
    const willPixelCharge =
      objectId !== 'glowing-pixel' &&
      !wasPixelCharged &&
      nextCompletedObjects.length >= 3

    if (willPixelCharge) {
      nextAchievements.push('Pixel Charged')
    }

    setQuestState((currentState) => ({
      ...currentState,
      ...patch,
      completedObjects: nextCompletedObjects,
      collectedFragments: nextCompletedObjects.length,
      unlockedAchievements: Array.from(
        new Set([
          ...currentState.unlockedAchievements,
          ...nextAchievements,
        ]),
      ),
    }))

    nextAchievements.forEach((achievement) => showToast(achievement))
  }

  const startQuest = () => {
    setQuestState((currentState) => ({
      ...currentState,
      hasStarted: true,
    }))
  }

  const resetQuest = () => {
    const shouldReset = window.confirm(
      'Reset the quest and clear the tiny sketch?',
    )

    if (!shouldReset) {
      return
    }

    stopVibe()
    clearQuestState()
    setQuestState(defaultQuestState)
    showToast('Quest Reset')
  }

  const selectClass = (classId) => {
    completeObject('game-console', 'Character Selected', {
      selectedClass: classId,
    })
  }

  const selectVibe = (vibeId) => {
    completeObject('headphones', 'Vibe Found', {
      selectedVibe: vibeId,
    })
  }

  const saveSketch = (sketchDataUrl) => {
    completeObject('sketchbook', 'Tiny Sketch Saved', {
      sketchDataUrl,
    })
  }

  const unlockArtifact = () => {
    if (collectedFragments < 3) {
      return
    }

    completeObject('glowing-pixel', 'Designer Artifact Unlocked', {
      hasSeenArtifact: true,
    })
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__brand">
          <span className="brand-mark" aria-hidden="true">
            *
          </span>
          <span>Side Quest</span>
        </div>
        {questState.hasStarted && (
          <div className="app-header__actions">
            <ProgressBar compact value={collectedFragments} />
            <PixelButton onClick={resetQuest} variant="ghost">
              Reset quest
            </PixelButton>
          </div>
        )}
      </header>

      {questState.hasStarted ? (
        questState.hasSeenArtifact ? (
          <ArtifactScreen
            artifact={artifact}
            onReset={resetQuest}
            onToast={recordAchievement}
            sketchDataUrl={questState.sketchDataUrl}
          />
        ) : (
          <QuestRoom
            collectedFragments={collectedFragments}
            completedObjects={questState.completedObjects}
            onSaveSketch={saveSketch}
            onSelectClass={selectClass}
            onSelectVibe={selectVibe}
            onUnlockArtifact={unlockArtifact}
            selectedClass={questState.selectedClass}
            selectedVibe={questState.selectedVibe}
            sketchDataUrl={questState.sketchDataUrl}
          />
        )
      ) : (
        <StartScreen onStart={startQuest} />
      )}

      <footer className="app-footer">
        Made as a tiny creative side quest.
      </footer>
      <PythonEasterEggs onFound={recordAchievement} />
      <AchievementToast toasts={toasts} />
    </div>
  )
}

export default App
