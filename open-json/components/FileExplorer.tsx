'use client'

import { useState, useEffect } from 'react'
import { FaFolder, FaFolderOpen, FaFile } from 'react-icons/fa'
import { FileSystemDirectoryHandle, FileSystemFileHandle } from '@/app/types'

interface FileExplorerProps {
  rootDirectory: FileSystemDirectoryHandle | null
  onFileSelect: (file: FileSystemFileHandle) => void
}

interface FileNode {
  name: string
  handle: FileSystemDirectoryHandle | FileSystemFileHandle
  children?: FileNode[]
}

const FileExplorer: React.FC<FileExplorerProps> = ({ rootDirectory, onFileSelect }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [fileStructure, setFileStructure] = useState<FileNode | null>(null)

  useEffect(() => {
    if (rootDirectory) {
      buildFileStructure(rootDirectory).then(setFileStructure)
    }
  }, [rootDirectory])

  const buildFileStructure = async (dirHandle: FileSystemDirectoryHandle): Promise<FileNode> => {
    const children: FileNode[] = []
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'directory') {
        children.push(await buildFileStructure(entry))
      } else {
        children.push({ name: entry.name, handle: entry })
      }
    }
    return { name: dirHandle.name, handle: dirHandle, children }
  }

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(path)) {
        newSet.delete(path)
      } else {
        newSet.add(path)
      }
      return newSet
    })
  }

  const renderTree = (node: FileNode, path: string = '') => {
    const currentPath = `${path}/${node.name}`
    const isExpanded = expandedFolders.has(currentPath)

    if (node.handle.kind === 'file') {
      return (
        <div
          key={currentPath}
          className="flex items-center py-1 px-2 cursor-pointer hover:bg-white/20"
          onClick={() => onFileSelect(node.handle as FileSystemFileHandle)}
        >
          <FaFile className="mr-2" />
          {node.name}
        </div>
      )
    }

    return (
      <div key={currentPath}>
        <div
          className="flex items-center py-1 px-2 cursor-pointer hover:bg-white/20"
          onClick={() => toggleFolder(currentPath)}
        >
          {isExpanded ? <FaFolderOpen className="mr-2" /> : <FaFolder className="mr-2" />}
          {node.name}
        </div>
        {isExpanded && node.children && (
          <div className="ml-4">
            {node.children.map((child) => renderTree(child, currentPath))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4">
      {fileStructure ? (
        renderTree(fileStructure)
      ) : (
        <div className="text-gray-500">No folder loaded. Use the "Load Folder" button to start.</div>
      )}
    </div>
  )
}

export default FileExplorer

