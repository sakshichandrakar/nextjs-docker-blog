'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import {
  LexicalComposer,
  InitialConfigType,
} from '@lexical/react/LexicalComposer'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { ListNode, ListItemNode } from '@lexical/list'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'
import { $getRoot } from 'lexical'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../../editor.css'

export default function EditBlogPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [initialEditorState, setInitialEditorState] = useState<string>('')
  const [content, setContent] = useState('')

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await fetch(`/api/blogs`)
      const data = await res.json()
      const blog = data.find((b: any) => b.id === parseInt(id))
      if (blog) {
        setTitle(blog.title)
        setInitialEditorState(blog.content) // HTML
        setContent(blog.content)
      }
    }

    if (id) fetchBlog()
  }, [id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    const res = await fetch(`/api/blogs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,

      },
      body: JSON.stringify({ title, content }),
    })

    if (res.ok) {
      toast.success('Blog updated successfully!')
      router.push('/admin')
    } else {
      toast.error('Failed to update blog.')
    }
  }

  const editorConfig: InitialConfigType = {
    namespace: 'BlogEditor',
    theme: {
      paragraph: 'editor-paragraph',
    },
    onError: (error) => {
      console.error('Editor Error:', error)
    },
    nodes: [ListNode, ListItemNode],
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4">Edit Blog</h3>
              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Content</label>
                  <LexicalComposer initialConfig={editorConfig}>
                    <div className="editor-container border p-3">
                      <HTMLInitializerPlugin html={initialEditorState} />
                      <RichTextPlugin
                        contentEditable={
                          <ContentEditable className="editor-input" />
                        }
                        placeholder={
                          <div className="editor-placeholder">
                            Edit your blog content…
                          </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                      />
                      <HistoryPlugin />
                      <ListPlugin />
                      <OnChangePlugin
                        onChange={(editorState, editor) => {
                          editorState.read(() => {
                            const html = $generateHtmlFromNodes(editor)
                            setContent(html)
                          })
                        }}
                      />
                    </div>
                  </LexicalComposer>
                </div>

                <button type="submit" className="btn btn-success w-100">
                  Update Blog
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ✅ Plugin to initialize editor with HTML content
function HTMLInitializerPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!html) return

    const parser = new DOMParser()
    const dom = parser.parseFromString(html, 'text/html')

    editor.update(() => {
      const nodes = $generateNodesFromDOM(editor, dom)
      const root = $getRoot()
      root.clear()
      root.append(...nodes)
    })
  }, [html, editor])

  return null
}

