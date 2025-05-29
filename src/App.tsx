// App.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { playRandomSound} from './utils/sounds'
import DevModeWatcher from './DevModeWatcher'

interface Todo {
  text: string
  done: boolean
}

interface SavedList {
  name: string
  todos: Todo[]
}

const getRandomMessage = () => {
  const messages = [
    'サボるな！',
    '何やってんのよ！',
    'まだ終わってないわよ！',
    'やる気あるの！？',
    'はやくしなさい！'
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

const App: React.FC = () => {
  const [savedLists, setSavedLists] = useState<SavedList[]>(() => {
    const stored = localStorage.getItem('todoLists')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      } catch {}
    }
    return [{ name: 'デフォルトリスト', todos: [] }]
  })
  const [selectedListIndex, setSelectedListIndex] = useState<number>(0)
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [, setAngryText] = useState('')
  const [angryMessage, setAngryMessage] = useState('')
  const [angerLevel, setAngerLevel] = useState<number>(() => {
    const saved = localStorage.getItem('angerLevel')
    return saved ? parseInt(saved) : 0
  })

  useEffect(() => {
    setTodos(savedLists[selectedListIndex]?.todos || [])
  }, [selectedListIndex, savedLists])

  useEffect(() => {
    localStorage.setItem('todoLists', JSON.stringify(savedLists))
  }, [savedLists])

  useEffect(() => {
    localStorage.setItem('angerLevel', angerLevel.toString())
  }, [angerLevel])

  const showAngry = useCallback((msg: string) => {
    setAngryMessage(msg)
    setTimeout(() => setAngryMessage(''), 2000)
  }, [])

  const saveCurrent = (updated: Todo[]) => {
    setSavedLists(lists => {
      const copy = [...lists]
      copy[selectedListIndex] = { ...copy[selectedListIndex], todos: updated }
      return copy
    })
  }

  const handleAdd = useCallback(() => {
    if (!newTodo.trim()) return
    const updated = [...todos, { text: newTodo, done: false }]
    setTodos(updated)
    setNewTodo('')
    setAngerLevel(prev => Math.min(prev + 10, 100))
    showAngry(getRandomMessage())
    playRandomSound('add')
    saveCurrent(updated)
  }, [newTodo, todos, selectedListIndex, showAngry])

  const handleDelete = useCallback((idx: number) => {
    const isDone = todos[idx]?.done
    const updated = todos.filter((_, i) => i !== idx)
    setTodos(updated)
    if (!isDone) {
      setAngerLevel(prev => Math.min(prev + 10, 100))
      showAngry(getRandomMessage())
      playRandomSound('delete')
    }
    saveCurrent(updated)
  }, [todos, selectedListIndex, showAngry])

  const handleToggle = useCallback((idx: number) => {
    const updated = todos.map((t, i) =>
      i === idx ? { ...t, done: !t.done } : t
    )
    setTodos(updated)
    const wasDone = todos[idx]?.done
    setAngerLevel(prev =>
      wasDone ? Math.min(prev + 10, 100) : Math.max(prev - 10, 0)
    )
    showAngry(wasDone ? getRandomMessage() : 'ちょっと見直したわ…')
    setTimeout(() => playRandomSound('complete'), 0)
    saveCurrent(updated)
  }, [todos, selectedListIndex, showAngry])

  const handleEdit = useCallback((idx: number) => {
    const newText = prompt('新しいタスク内容を入力してください:', todos[idx].text)
    if (newText !== null && newText.trim()) {
      const updated = [...todos]
      updated[idx].text = newText
      setTodos(updated)
      showAngry('編集できたのね。ふーん…')
      saveCurrent(updated)
    }
  }, [todos, selectedListIndex, showAngry])

  const createNewList = useCallback(() => {
    const name = prompt('新しいリスト名を入力してください:')
    if (!name) return
    setSavedLists(prev => {
      const copy = [...prev, { name, todos: [] }]
      const newIndex = copy.length - 1
      setSelectedListIndex(newIndex)
      setTodos([])
      showAngry(`新しいリスト「${name}」を作ったわよ！`)
      return copy
    })
  }, [showAngry])

  const editListName = useCallback((i: number) => {
    const name = prompt('リスト名を変更:', savedLists[i].name)
    if (name) {
      setSavedLists(prev => {
        const copy = [...prev]
        copy[i].name = name
        return copy
      })
      showAngry(`リスト名を「${name}」に変更したわよ！`)
    }
  }, [savedLists, showAngry])

  const deleteList = useCallback((i: number) => {
    if (!confirm(`「${savedLists[i].name}」を削除しますか？`)) return
    setSavedLists(prev => {
      const copy = prev.filter((_, idx) => idx !== i)
      setSelectedListIndex(0)
      return copy
    })
    showAngry('リストを削除したわ！')
  }, [savedLists, showAngry])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 flex flex-col overflow-auto h-screen">
        <h2 className="text-lg font-semibold mb-4">Saved Lists</h2>
        <ul className="flex-grow space-y-2">
          {savedLists.map((list, idx) => (
            <li
              key={idx}
              className={`flex justify-between items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer ${selectedListIndex === idx ? 'bg-red-100 font-bold' : ''}`}
            >
              <span onClick={() => setSelectedListIndex(idx)} className="truncate flex-grow">
                {list.name}
              </span>
              <button onClick={() => editListName(idx)} className="text-blue-500 hover:text-blue-700">✏️</button>
              <button onClick={() => deleteList(idx)} className="text-red-500 hover:text-red-700">🗑️</button>
            </li>
          ))}
        </ul>
        <button onClick={createNewList} className="mt-4 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
          新しいリスト作成
        </button>
      </aside>

      {/* Main area */}
      <main className="flex-grow p-8 flex flex-col items-center h-screen overflow-hidden">
        <div className="flex flex-col items-center w-full overflow-hidden">
          <h1 className="text-4xl font-bold mb-6 text-red-700">怒られる ToDo リスト</h1>
          <img src="/character/angry-face2.png" alt="怒ってるキャラ" className="w-24 h-24 mb-6" />

          <div className="w-full max-w-2xl flex gap-3 mb-6">
            <input
              type="text"
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="やることを入力"
              className="flex-grow border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <button onClick={handleAdd} className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition">
              追加
            </button>
          </div>

          <div className="w-full max-w-2xl mb-4">
            <div className="w-full h-4 bg-red-100 rounded overflow-hidden">
              <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${angerLevel}%` }} />
            </div>
          </div>

          <div className="mb-4 h-6 text-center text-red-700 font-semibold">{angryMessage || ' '}</div>

          <div className="w-full max-w-2xl overflow-auto flex-grow">
            <ul className="space-y-3">
              {todos.map((todo, i) => (
                <li key={i} className="flex items-center justify-between gap-4 p-2 bg-white shadow rounded">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={todo.done}
                      onChange={() => handleToggle(i)}
                      className="w-5 h-5"
                    />
                    <span className={todo.done ? 'line-through text-gray-400' : ''}>{todo.text}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(i)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded">編集</button>
                    <button onClick={() => handleDelete(i)} className="bg-red-300 hover:bg-red-400 text-white px-3 py-1 rounded">削除</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <DevModeWatcher
        resetAngerLevel={() => setAngerLevel(0)}
        setAngryText={setAngryText}
        onCheat={() => showAngry('監視者：見てますよ…')}
      />
    </div>
  )
}

export default App
