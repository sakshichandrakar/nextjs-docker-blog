'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import 'bootstrap/dist/css/bootstrap.min.css'
import toast from 'react-hot-toast'

// Lexical imports
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { ListNode, ListItemNode } from '@lexical/list'
import { $generateHtmlFromNodes } from '@lexical/html'
// import { $getRoot } from 'lexical'

import '../editor.css'

const editorConfig = {
  namespace: 'MyEditor',
  theme: {
    paragraph: 'editor-paragraph',
  },
  onError: (error: any) => {
    console.error('Editor error:', error)
  },
  nodes: [ListNode, ListItemNode],
}

export default function CreateBlogPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    const res = await fetch('/api/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    })

    if (res.ok) {
      toast.success('Blog created successfully!')
      router.push('/admin')
    } else {
      toast.error('Failed to create blog.')
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title mb-4">Create Blog</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Content</label>
                  <LexicalComposer initialConfig={editorConfig}>
                    <div className="editor-container border p-3" style={{ height: '400px', overflowY: 'auto' }}>
                      <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-input" />}
                        placeholder={<div className="editor-placeholder">Write your blog content...</div>}
                        ErrorBoundary={LexicalErrorBoundary}
                      />
                      <HistoryPlugin />
                      <ListPlugin />
                      <OnChangePlugin
                        onChange={(editorState, editor) => {
                          editorState.read(() => {
                            const htmlString = $generateHtmlFromNodes(editor)
                            setContent(htmlString)
                          })
                        }}
                      />
                    </div>
                  </LexicalComposer>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
