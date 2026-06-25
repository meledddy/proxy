let audioContext = null
let masterGain = null
let loopTimer = null
let stepIndex = 0

const patterns = {
  'dreamy-arcade': {
    wave: 'triangle',
    tempo: 420,
    notes: [523.25, 659.25, 783.99, 659.25, 587.33],
  },
  'cozy-cyber': {
    wave: 'sine',
    tempo: 520,
    notes: [392, 493.88, 587.33, 493.88, 440],
  },
  'late-night-focus': {
    wave: 'sine',
    tempo: 620,
    notes: [329.63, 392, 493.88, 392],
  },
  'soft-glitch': {
    wave: 'square',
    tempo: 500,
    notes: [349.23, 415.3, 466.16, 392, 311.13],
  },
  'main-character-walk': {
    wave: 'triangle',
    tempo: 380,
    notes: [440, 554.37, 659.25, 739.99, 659.25],
  },
  'tiny-boss-fight': {
    wave: 'sawtooth',
    tempo: 340,
    notes: [220, 261.63, 329.63, 246.94, 293.66],
  },
}

const ensureAudio = async () => {
  if (!audioContext) {
    audioContext = new AudioContext()
    masterGain = audioContext.createGain()
    masterGain.gain.value = 0.045
    masterGain.connect(audioContext.destination)
  }

  if (audioContext.state === 'suspended') {
    await audioContext.resume()
  }
}

const playTone = (frequency, wave) => {
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()
  const now = audioContext.currentTime

  oscillator.type = wave
  oscillator.frequency.setValueAtTime(frequency, now)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.45, now + 0.025)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)

  oscillator.connect(gain)
  gain.connect(masterGain)
  oscillator.start(now)
  oscillator.stop(now + 0.24)
}

export const playVibe = async (vibeId) => {
  await ensureAudio()
  stopVibe(false)

  const pattern = patterns[vibeId] ?? patterns['cozy-cyber']
  stepIndex = 0

  const playStep = () => {
    const note = pattern.notes[stepIndex % pattern.notes.length]
    playTone(note, pattern.wave)
    stepIndex += 1
  }

  playStep()
  loopTimer = window.setInterval(playStep, pattern.tempo)
}

export const stopVibe = (fade = true) => {
  if (loopTimer) {
    window.clearInterval(loopTimer)
    loopTimer = null
  }

  if (fade && masterGain && audioContext) {
    const now = audioContext.currentTime
    masterGain.gain.cancelScheduledValues(now)
    masterGain.gain.setValueAtTime(masterGain.gain.value, now)
    masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.08)
    window.setTimeout(() => {
      if (masterGain) {
        masterGain.gain.value = 0.045
      }
    }, 120)
  }
}
