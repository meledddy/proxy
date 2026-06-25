import { characterClasses } from '../data/characterClasses'
import { musicVibes } from '../data/musicVibes'
import { palettes } from '../data/palettes'
import { creativePowers, rareSkills } from '../data/powers'

export const DEFAULT_FINAL_NOTE =
  'This little quest was made to add a small good moment to the day. Nothing serious. Just a tiny creative side quest.'

const hashString = (value) => {
  return value.split('').reduce((hash, char) => {
    return (hash << 5) - hash + char.charCodeAt(0)
  }, 0)
}

const pickByHash = (items, seed) => {
  const index = Math.abs(hashString(seed)) % items.length
  return items[index]
}

export const getCharacterClass = (classId) => {
  return (
    characterClasses.find((characterClass) => characterClass.id === classId) ??
    characterClasses[0]
  )
}

export const getMusicVibe = (vibeId) => {
  return musicVibes.find((musicVibe) => musicVibe.id === vibeId) ?? musicVibes[0]
}

export const generateArtifact = ({
  selectedClass,
  selectedVibe,
  sketchDataUrl,
  finalNote = DEFAULT_FINAL_NOTE,
}) => {
  const characterClass = getCharacterClass(selectedClass)
  const musicVibe = getMusicVibe(selectedVibe)
  const seed = `${characterClass.id}-${musicVibe.id}-${sketchDataUrl?.length ?? 0}`
  const rareSkill = pickByHash(rareSkills, seed)
  const supportPower = pickByHash(creativePowers, `${seed}-support`)

  return {
    title: 'Designer Artifact Unlocked',
    className: characterClass.name,
    vibeName: musicVibe.name,
    rareSkill,
    creativePower: `${characterClass.creativePower} ${supportPower}`,
    moodText: `The artifact feels ${musicVibe.moodText}.`,
    palette: palettes[musicVibe.id],
    tinyNote: finalNote,
  }
}

export const formatPaletteText = (palette) => {
  return palette.map((color) => `${color.hex} — ${color.name}`).join('\n')
}

export const formatArtifactText = (artifact) => {
  return `Designer Artifact Unlocked

Class: ${artifact.className}
Vibe: ${artifact.vibeName}

Rare Skill:
${artifact.rareSkill}

Creative Power:
${artifact.creativePower}

Palette:
${formatPaletteText(artifact.palette)}

Tiny Note:
${artifact.tinyNote}`
}
