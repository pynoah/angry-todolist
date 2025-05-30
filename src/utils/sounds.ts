const soundFiles = {
  add: ['hai.mp3', 'haihai.mp3', 'haihaihai.mp3'],
  delete: ['hey.mp3', 'zako.mp3'],
  complete: ['goodjob.mp3', 'goodgood.mp3'],
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

