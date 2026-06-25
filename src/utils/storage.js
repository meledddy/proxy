const QUEST_KEYS = [
  'hasStarted',
  'selectedClass',
  'selectedVibe',
  'sketchDataUrl',
  'completedObjects',
  'collectedFragments',
  'unlockedAchievements',
  'hasSeenArtifact',
]

export const defaultQuestState = {
  hasStarted: false,
  selectedClass: null,
  selectedVibe: null,
  sketchDataUrl: null,
  completedObjects: [],
  collectedFragments: 0,
  unlockedAchievements: [],
  hasSeenArtifact: false,
}

const readJson = (key, fallback) => {
  try {
    const rawValue = localStorage.getItem(key)
    return rawValue === null ? fallback : JSON.parse(rawValue)
  } catch {
    return fallback
  }
}

export const loadQuestState = () => {
  if (typeof localStorage === 'undefined') {
    return defaultQuestState
  }

  const completedObjects = readJson('completedObjects', [])

  return {
    ...defaultQuestState,
    hasStarted: readJson('hasStarted', false),
    selectedClass: readJson('selectedClass', null),
    selectedVibe: readJson('selectedVibe', null),
    sketchDataUrl: readJson('sketchDataUrl', null),
    completedObjects,
    collectedFragments: readJson('collectedFragments', completedObjects.length),
    unlockedAchievements: readJson('unlockedAchievements', []),
    hasSeenArtifact: readJson('hasSeenArtifact', false),
  }
}

export const saveQuestState = (state) => {
  if (typeof localStorage === 'undefined') {
    return
  }

  QUEST_KEYS.forEach((key) => {
    localStorage.setItem(key, JSON.stringify(state[key]))
  })
}

export const clearQuestState = () => {
  if (typeof localStorage === 'undefined') {
    return
  }

  QUEST_KEYS.forEach((key) => localStorage.removeItem(key))
}
