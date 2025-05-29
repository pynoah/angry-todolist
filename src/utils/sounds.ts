const soundFiles = {
  add: ['「はい」.mp3', '「はいは～い♪」.mp3', '「はいはいは～い！」.mp3'],
  delete: ['「こら！」.mp3', '「なんだザコかあ」.mp3'],
  complete: ['「頑張ったね」.mp3', '「すごいすごい」.mp3'],
}

export function playRandomSound(type: 'add' | 'delete' | 'complete'): void {
  const list = soundFiles[type]
  if (!list || list.length === 0) {
    console.warn(`No sound files defined for type: ${type}`)
    return
  }

  const chosen = list[Math.floor(Math.random() * list.length)]
  const encodedPath = encodeURIComponent(chosen)
  const audio = new Audio(`/sounds/${type}/${encodedPath}`)

  audio.play().catch((err) => {
    console.warn(`Failed to play sound "${chosen}" for type "${type}"`, err)
  })
}

