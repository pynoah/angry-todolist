import { useState } from "react"

interface Props {
  onAdd: (text: string) => void
}

function TodoInput({ onAdd }: Props) {
  const [text, setText] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim() === "") return
    onAdd(text)
    setText("")
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="やることを書いてね"
      />
      <button type="submit">追加</button>
    </form>
  )
}

export default TodoInput
