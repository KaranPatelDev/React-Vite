import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/*
  Advanced Notes App (single-file)
  - Paste this into src/App.jsx
  - Requires Tailwind CSS for full styling (but will still render without it)
*/

const COLOR_OPTIONS = [
  { id: 'amber', hex: '#fef3c7', label: 'Amber' },
  { id: 'lime', hex: '#ecfccb', label: 'Lime' },
  { id: 'sky', hex: '#e0f2fe', label: 'Sky' },
  { id: 'pink', hex: '#ffe4f0', label: 'Pink' },
  { id: 'violet', hex: '#ede9fe', label: 'Violet' },
  { id: 'rose', hex: '#ffe4e6', label: 'Rose' },
]

const STORAGE_KEY = 'notes_app_v2_tasks'
const THEME_KEY = 'notes_app_v2_theme'

/* Simple small markdown-ish renderer (VERY small subset) */
function simpleMarkup(text = '') {
  // escape HTML
  const esc = (s) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

  let out = esc(text)
  // bold **text**
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // italic *text*
  out = out.replace(/\*(.+?)\*/g, '<em>$1</em>')
  // convert line breaks to <br/>
  out = out.replace(/\n/g, '<br/>')
  return out
}

const useLocalStorage = (key, initial) => {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {}
  }, [key, state])
  return [state, setState]
}

export default function App() {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEY, [])
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].hex)
  const [archived, setArchived] = useLocalStorage(STORAGE_KEY + '_archived', []) // archived notes (ids)
  const [toast, setToast] = useState(null)
  const [theme, setTheme] = useLocalStorage(THEME_KEY, 'dark')
  const detailsLimit = 800

  const titleRef = useRef(null)
  const dragItem = useRef(null)
  const dragOverItem = useRef(null)

  useEffect(() => {
    // focus title on load
    titleRef.current?.focus()
  }, [])

  useEffect(() => {
    // support Tailwind 'dark' class and keep dataset for other CSS hooks
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const showToast = (msg) => setToast(msg)

  const resetForm = () => {
    setTitle('')
    setDetails('')
    setSelectedColor(COLOR_OPTIONS[0].hex)
    setEditingId(null)
    titleRef.current?.focus()
  }

  const submitHandler = useCallback((e) => {
    e?.preventDefault()
    if (!title.trim() && !details.trim()) {
      showToast('Add title or details before saving.')
      return
    }

    if (editingId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? { ...t, title: title.trim(), details: details.trim(), color: selectedColor, updatedAt: new Date().toISOString() }
            : t
        )
      )
      showToast('Note updated')
      resetForm()
      return
    }

    const newNote = {
      id: Date.now(),
      title: title.trim(),
      details: details.trim(),
      color: selectedColor,
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    }
    setTasks((prev) => [newNote, ...prev])
    showToast('Note added')
    resetForm()
  }, [title, details, editingId, selectedColor, setTasks])

  const deleteNote = (id) => {
    if (!confirm('Delete note permanently?')) return
    setTasks((prev) => prev.filter((t) => t.id !== id))
    setArchived((prev) => prev.filter((x) => x !== id))
    showToast('Note deleted')
  }

  const editNote = (note) => {
    setEditingId(note.id)
    setTitle(note.title)
    setDetails(note.details)
    setSelectedColor(note.color || COLOR_OPTIONS[0].hex)
    titleRef.current?.focus()
  }

  const togglePin = (id) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t))
      // bring pinned to front keeping order
      const pinned = updated.filter((t) => t.pinned)
      const others = updated.filter((t) => !t.pinned)
      return [...pinned, ...others]
    })
  }

  const toggleArchive = (id) => {
    if (archived.includes(id)) {
      setArchived((prev) => prev.filter((x) => x !== id))
      showToast('Restored from archive')
    } else {
      setArchived((prev) => [id, ...prev])
      showToast('Moved to archive')
      // when archiving also unpin to avoid confusion
      setTasks(prev => prev.map(t => t.id === id ? { ...t, pinned: false } : t))
    }
  }

  const clearAll = () => {
    if (!confirm('Clear all notes? This cannot be undone.')) return
    setTasks([])
    setArchived([])
    showToast('All notes cleared')
  }

  // export/import
  const exportJSON = () => {
    const data = JSON.stringify({ tasks, archived }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'notes-export.json'
    a.click()
    URL.revokeObjectURL(url)
    showToast('Export downloaded')
  }

  const importJSON = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result)
        if (Array.isArray(parsed.tasks)) {
          setTasks(parsed.tasks)
          setArchived(Array.isArray(parsed.archived) ? parsed.archived : [])
          showToast('Imported notes')
        } else {
          showToast('Invalid import file')
        }
      } catch {
        showToast('Failed to parse file')
      }
    }
    reader.readAsText(file)
  }

  // drag & drop handlers for reordering
  const onDragStart = (e, position) => {
    dragItem.current = position
    e.dataTransfer.effectAllowed = 'move'
    // add a class for style
  }
  const onDragEnter = (e, position) => {
    dragOverItem.current = position
  }
  const onDragEnd = () => {
    const copyListItems = [...tasks]
    const dragItemContent = copyListItems.splice(dragItem.current, 1)[0]
    copyListItems.splice(dragOverItem.current, 0, dragItemContent)
    dragItem.current = null
    dragOverItem.current = null
    setTasks(copyListItems)
    showToast('Notes reordered')
  }

  // keyboard shortcuts: Ctrl+Enter to submit, Esc to clear
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        submitHandler()
      } else if (e.key === 'Escape') {
        resetForm()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [submitHandler])

  const visibleNotes = useMemo(() => {
    const q = search.trim().toLowerCase()
    const base = tasks.filter(t => !archived.includes(t.id))
    if (!q) return base
    return base.filter((t) => t.title.toLowerCase().includes(q) || t.details.toLowerCase().includes(q))
  }, [tasks, search, archived])

  // viewing modal state
  const [viewing, setViewing] = useState(null)
  const [viewerMode, setViewerMode] = useState('preview') // 'preview' | 'raw'

  const viewNote = (note) => {
    setViewerMode('preview')
    setViewing(note)
  }

  const closeViewer = () => setViewing(null)

  // close viewer on Escape key when modal is open
  useEffect(() => {
    if (!viewing) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeViewer()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewing])

  // small util for color button (outline to show selected)
  const isSelectedColor = (hex) => hex === selectedColor

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 to-black text-gray-100' : 'bg-gradient-to-br from-white to-slate-100 text-gray-900'}`}>
      <style>{`
        .modal-overlay { animation: overlayIn .18s ease-out forwards; }
        .modal-content { animation: modalIn .18s ease-out forwards; transform-origin:center; }
        @keyframes overlayIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalIn { from { transform: translateY(8px) scale(.98); opacity:0 } to { transform: translateY(0) scale(1); opacity:1 } }
      `}</style>
      {toast && (
        <div className="fixed right-6 top-6 bg-black/70 backdrop-blur text-white px-4 py-2 rounded shadow z-50">
          {toast}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Notes Studio</h1>
            <p className="text-sm text-gray-400">Rich notes, local, fast — keyboard shortcuts: Ctrl+Enter to save, Esc to clear.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              className="px-3 py-2 bg-white/10 rounded"
            >
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>

            <div className="flex gap-2">
              <button onClick={exportJSON} className="px-3 py-2 bg-emerald-500 rounded text-black">Export</button>

              <label className="px-3 py-2 bg-white/10 rounded cursor-pointer">
                Import
                <input
                  type="file"
                  accept="application/json"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) importJSON(f)
                    e.target.value = ''
                  }}
                  className="hidden"
                />
              </label>

              <button onClick={clearAll} className="px-3 py-2 bg-red-600 rounded">Clear All</button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form column */}
          <div className="lg:col-span-1 bg-white/5 p-6 rounded-xl border border-white/5 shadow-sm">
            <form onSubmit={submitHandler} className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  ref={titleRef}
                  className="flex-1 px-4 py-2 rounded bg-white text-black placeholder-gray-500 outline-none"
                  placeholder="Title (or heading)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 120))}
                />
                <span className="text-sm text-gray-400">{title.length}/120</span>
              </div>

              <div>
                <textarea
                  className="w-full px-4 py-3 rounded bg-white text-black placeholder-gray-500 outline-none h-28 resize-none"
                  placeholder="Write details (supports basic *italic* and **bold**)..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value.slice(0, detailsLimit))}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{details.length}/{detailsLimit} chars</span>
                  <span>Markdown: *italic* / **bold**</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedColor(c.hex)}
                      className={`w-8 h-8 rounded-full ring-2 ${isSelectedColor(c.hex) ? 'ring-white' : 'ring-transparent'}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    />
                  ))}
                </div>

                <div className="ml-auto flex items-center gap-2">
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        resetForm()
                        showToast('Edit cancelled')
                      }}
                      className="px-3 py-2 bg-white/10 rounded"
                    >
                      Cancel
                    </button>
                  )}

                  <button type="submit" className="px-4 py-2 bg-amber-400 text-black rounded font-semibold">
                    {editingId ? 'Update Note' : 'Add Note'}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-4 text-xs text-gray-400 space-y-1">
              <div>Total: <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{tasks.length}</strong></div>
              <div>Pinned: <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{tasks.filter(t=>t.pinned).length}</strong></div>
              <div>Archived: <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{archived.length}</strong></div>
            </div>
          </div>

          {/* Search + controls */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className={`flex-1 px-4 py-2 rounded ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-white text-gray-900'} outline-none`}
              />
              <button onClick={() => setSearch('')} className="px-3 py-2 bg-white/10 rounded">Clear</button>
              <button onClick={() => showToast('Tip: Drag notes to reorder') } className="px-3 py-2 bg-white/10 rounded">Help</button>
            </div>

            {/* Notes grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleNotes.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 py-10">No notes found — add one!</div>
              ) : (
                visibleNotes.map((note, idx) => (
                  <article
                    key={note.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, idx)}
                    onDragEnter={(e) => onDragEnter(e, idx)}
                    onDragEnd={onDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => viewNote(note)}
                    className="relative rounded-lg shadow p-3 cursor-grab select-none"
                    style={{
                      backgroundColor: note.color || '#fff8dc',
                      minHeight: 160,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 break-words break-all">{note.title || <span className="text-gray-600">Untitled</span>}</h3>
                        <div
                          className="text-sm mt-2 text-gray-800 break-words break-all whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: simpleMarkup(note.details) }}
                        />
                      </div>

                      <div className="flex flex-col gap-2 items-end">
                        <button
                          onClick={(e) => { e.stopPropagation(); togglePin(note.id); }}
                          title="Pin"
                          className={`px-2 py-1 rounded text-sm ${note.pinned ? 'bg-yellow-300' : 'bg-white/30'}`}
                        >
                          {note.pinned ? '📌' : '📍'}
                        </button>

                        <button
                          onClick={(e) => { e.stopPropagation(); toggleArchive(note.id); }}
                          title="Archive / Restore"
                          className="px-2 py-1 rounded bg-white/20 text-xs"
                        >
                          {archived.includes(note.id) ? 'Restore' : 'Archive'}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <small className="text-xs text-gray-700">{new Date(note.createdAt).toLocaleString()}</small>
                      {note.updatedAt && <small className="text-xs text-gray-700">· updated</small>}
                      <div className="ml-auto flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); editNote(note); }} className="px-2 py-1 text-xs bg-white/20 rounded">Edit</button>
                        <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }} className="px-2 py-1 text-xs bg-red-500 text-white rounded">Delete</button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            {/* Archived section */}
            <div className="mt-4 bg-white/5 p-3 rounded">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold">Archived</h4>
                <div className="text-xs text-gray-400">{archived.length} items</div>
              </div>
              <div className="flex gap-2 overflow-auto">
                {archived.length === 0 ? (
                  <div className="text-xs text-gray-400">No archived notes</div>
                ) : (
                  archived.map((id) => {
                    const note = tasks.find((t) => t.id === id)
                    if (!note) return null
                    return (
                      <div key={id} onClick={() => viewNote(note)} className="px-3 py-1 bg-white/10 rounded text-xs cursor-pointer">
                        <div className="font-semibold break-words break-all">{note.title || 'Untitled'}</div>
                        <div className="text-gray-300">{new Date(note.createdAt).toLocaleDateString()}</div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Viewer modal */}
            {viewing && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 modal-overlay" onClick={closeViewer}>
                <div className={`${theme === 'dark' ? 'bg-slate-800 text-gray-100' : 'bg-white text-gray-900'} rounded-lg p-6 w-full max-w-2xl modal-content`} onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{viewing.title || 'Untitled'}</h2>
                      <small className="text-xs text-gray-500">{new Date(viewing.createdAt).toLocaleString()}</small>
                    </div>

                    {/* Preview / Raw toggle */}
                    <div className="flex items-center gap-2">
                      <div className="inline-flex rounded bg-white/5">
                        <button
                          onClick={() => setViewerMode('preview')}
                          className={`px-3 py-1 text-sm ${viewerMode === 'preview' ? 'bg-white/20' : 'bg-transparent'}`}
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => setViewerMode('raw')}
                          className={`px-3 py-1 text-sm ${viewerMode === 'raw' ? 'bg-white/20' : 'bg-transparent'}`}
                        >
                          Raw
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => { editNote(viewing); closeViewer() }} className="px-3 py-1 bg-amber-300 rounded">Edit</button>
                      <button onClick={() => { togglePin(viewing.id); closeViewer() }} className="px-3 py-1 bg-white/20 rounded">Pin</button>
                      <button onClick={() => { toggleArchive(viewing.id); closeViewer() }} className="px-3 py-1 bg-white/20 rounded">{archived.includes(viewing.id) ? 'Restore' : 'Archive'}</button>
                      <button onClick={() => { deleteNote(viewing.id); closeViewer() }} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                    </div>
                  </div>

                  <div className="mt-4">
                    {viewerMode === 'preview' ? (
                      <div className={`break-words whitespace-pre-wrap ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`} dangerouslySetInnerHTML={{ __html: simpleMarkup(viewing.details) }} />
                    ) : (
                      <pre className={`whitespace-pre-wrap p-3 rounded text-sm max-h-96 overflow-auto ${theme === 'dark' ? 'bg-white/5 text-gray-200' : 'bg-white/5 text-gray-800'}`}>{viewing.details}</pre>
                    )}
                  </div>
                  <div className="mt-4 text-right">
                    <button onClick={closeViewer} className="px-4 py-2 bg-white/10 rounded">Close</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}