// File: src/utils/messages.ts
export const angryMessages = [
  'ちゃんとやれ！',
  'まだ終わってないぞ！',
  '何回言わせるんだ！',
  'サボるな！',
  'はやく終わらせろ！',
  'また追加かよ！',
]

export function getRandomMessage(): string {
  return angryMessages[Math.floor(Math.random() * angryMessages.length)]
}