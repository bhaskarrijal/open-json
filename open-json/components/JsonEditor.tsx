'use client'

import { useEffect, useState } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'
import { editor } from 'monaco-editor'

interface JsonEditorProps {
  content: string
  onChange: (newContent: string) => void
  selectedFile: string | null
}

const JsonEditor: React.FC<JsonEditorProps> = ({ content, onChange, selectedFile }) => {
  const [editorContent, setEditorContent] = useState(content)

  useEffect(() => {
    setEditorContent(content)
  }, [content])

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorContent(value)
      onChange(value)
    }
  }

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    monaco.editor.defineTheme('myCustomTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
      },
    })
    monaco.editor.setTheme('myCustomTheme')
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-800 text-white p-2">
        {selectedFile ? selectedFile : 'No file selected'}
      </div>
      <div className="flex-grow">
        <Editor
          height="100%"
          language="json"
          value={editorContent}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
    </div>
  )
}

export default JsonEditor