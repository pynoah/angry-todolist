// utils/sounds.ts

const soundFiles = {
  add: ['「はい」.mp3', '「はいは～い♪」.mp3', '「はいはいは～い！」.mp3'],
  delete: ['「こら！」.mp3', '「なんだザコかあ」.mp3'],
  complete: ['「頑張ったね」.mp3', '「すごいすごい」.mp3'],
}

export function playRandomSound(type: 'add' | 'delete' | 'complete'): void {
  const list = soundFiles[type]
  const chosen = list[Math.floor(Math.random() * list.length)]
  const audio = new Audio(`/sounds/${type}/${chosen}`)
  audio.play().catch(() => console.warn(`Failed to play sound: ${chosen}`))
}

