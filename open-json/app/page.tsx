'use client'

import { useState } from 'react'
import FileExplorer from '@/components/FileExplorer'
import JsonEditor from '@/components/JsonEditor'
import Toolbar from '@/components/Toolbar'
import { FileSystemDirectoryHandle, FileSystemFileHandle } from './types'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<FileSystemFileHandle | null>(null)
  const [fileContent, setFileContent] = useState<string>('')
  const [rootDirectory, setRootDirectory] = useState<FileSystemDirectoryHandle | null>(null)

  const handleFileSelect = async (file: FileSystemFileHandle) => {
    setSelectedFile(file)
    const content = await file.getFile().then(f => f.text())
    setFileContent(content)
  }

  const handleContentChange = (newContent: string) => {
    setFileContent(newContent)
  }

  const handleLoadFolder = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker()
      setRootDirectory(dirHandle)
    } catch (error) {
      console.error('Error loading folder:', error)
    }
  }

  const handleSaveFile = async () => {
    if (selectedFile) {
      try {
        const writable = await selectedFile.createWritable()
        await writable.write(fileContent)
        await writable.close()
        alert('File saved successfully!')
      } catch (error) {
        console.error('Error saving file:', error)
        alert('Error saving file. Please try again.')
      }
    } else {
      alert('No file selected to save.')
    }
  }

  const handleSaveAs = async () => {
    try {
      const handle = await window.showSaveFilePicker({
        types: [
          {
            description: 'JSON File',
            accept: { 'application/json': ['.json'] },
          },
        ],
      })
      const writable = await handle.createWritable()
      await writable.write(fileContent)
      await writable.close()
      setSelectedFile(handle)
      alert('File saved successfully!')
    } catch (error) {
      console.error('Error saving file:', error)
      alert('Error saving file. Please try again.')
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Toolbar
        onLoadFolder={handleLoadFolder}
        onSave={handleSaveFile}
        onSaveAs={handleSaveAs}
        canSave={!!selectedFile}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/4 border-r overflow-auto">
          <FileExplorer rootDirectory={rootDirectory} onFileSelect={handleFileSelect} />
        </div>
        <div className="w-3/4">
          <JsonEditor
            content={fileContent}
            onChange={handleContentChange}
            selectedFile={selectedFile?.name ?? null}
          />
        </div>
      </div>
    </div>
  )
}

