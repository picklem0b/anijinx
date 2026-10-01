import { useState, type FormEvent } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Textarea } from '@workspace/ui/components/textarea'
import { ago } from '@/lib/format'
import { useLibrary } from '@/lib/store'
import type { Comment } from '@/lib/types'

const EMPTY: Comment[] = []

export function Comments({ id, ep = null }: { id: number; ep?: number | null }) {
  const all = useLibrary((s) => s.comments[id] ?? EMPTY)
  const add = useLibrary((s) => s.addComment)
  const remove = useLibrary((s) => s.removeComment)
  const [text, setText] = useState('')
  const list = ep === null ? all : all.filter((c) => c.ep === ep)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const value = text.trim()
    if (!value) return
    add(id, value, ep)
    setText('')
  }

  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold">Comments · {list.length}</h3>
      <form onSubmit={submit} className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-500/30 text-sm font-semibold text-violet-200">Y</span>
        <div className="flex-1">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            placeholder={ep === null ? 'Add a comment…' : `Comment on episode ${ep}…`}
            className="resize-none border-white/10 bg-white/5 text-white placeholder:text-white/30"
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={!text.trim()} className="rounded-full bg-violet-500 px-5 text-white hover:bg-violet-400">
              Post
            </Button>
          </div>
        </div>
      </form>
      <ul className="mt-4 space-y-4">
        {list.map((c) => (
          <li key={c.id} className="flex gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-sm font-semibold">Y</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs text-white/50">
                <b className="text-sm font-medium text-white">You</b>
                <span>{ago(c.at)}</span>
                {ep === null && c.ep !== null && <span className="rounded bg-white/10 px-1.5 py-0.5">EP {c.ep}</span>}
              </div>
              <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-white/85">{c.text}</p>
            </div>
            <button aria-label="Delete comment" onClick={() => remove(id, c.id)} className="self-start p-1 text-white/30 transition hover:text-rose-400">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
