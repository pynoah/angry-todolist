import React, { useEffect, useState } from 'react'
import { playRandomSound } from './utils/sounds' // ✅ 統合された関数を使用

export const ActionHandlersContext = React.createContext<{
  handleAction: (type: 'add' | 'delete' | 'complete', options?: { revert?: boolean }) => void
}>({
  handleAction: () => {},
})

interface Props {
  onCheat: () => void
  resetAngerLevel: () => void
  setAngryText: (text: string) => void
}

const DevModeWatcher: React.FC<Props> = ({ onCheat, resetAngerLevel, setAngryText }) => {
  const [devMode, setDevMode] = useState(false)
  const [watcherMeter, setWatcherMeter] = useState(0)
  const [showWatcher, setShowWatcher] = useState(false)

  const addMessages = [
    'また増やすの？前の終わってないでしょ！',
    'どんどん溜めてどうすんの！',
  ]
  const deleteMessages = [
    '消したって無かったことにならないから！',
    '逃げるなーッ！',
  ]
  const completeMessages = [
    '1個終わって満足してんじゃないわよ！',
    '次は？次やりなさい！',
  ]

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.shiftKey && e.key.toLowerCase() === 'd') {
      setDevMode((prev) => !prev)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleCheat = () => {
    resetAngerLevel()
    const next = watcherMeter + 1
    setWatcherMeter(next)

    if (next >= 5) {
      setShowWatcher(true)
      setTimeout(() => {
        setShowWatcher(false)
        setWatcherMeter(0)
        onCheat()
      }, 3000)
    }
  }

  const handleAction = (
    type: 'add' | 'delete' | 'complete',
    options?: { revert?: boolean }
  ) => {
    if (type === 'complete' && options?.revert) {
      return // ✅ 完了から未完了への変更時は音声なし
    }

    playRandomSound(type)

    const messages = {
      add: addMessages,
      delete: deleteMessages,
      complete: completeMessages,
    }

    const textList = messages[type]
    const randomText = textList[Math.floor(Math.random() * textList.length)]
    setAngryText(randomText)
  }

  return (
    <ActionHandlersContext.Provider value={{ handleAction }}>
      {devMode && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded shadow-lg z-50">
          <p className="mb-2">開発者モード ON</p>
          <button
            onClick={handleCheat}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          >
            怒りゲージリセット
          </button>
        </div>
      )}

      {showWatcher && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div
            className="relative"
            style={{
              width: '1024px',
              height: '1024px',
            }}
          >
            <img
              src="/character/watchingu.png"
              alt="監視者の目"
              className="absolute top-0 left-0 w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </ActionHandlersContext.Provider>
  )
}

export default DevModeWatcher

