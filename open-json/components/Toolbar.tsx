import { Button } from '@/components/ui/button'

interface ToolbarProps {
  onLoadFolder: () => void
  onSave: () => void
  onSaveAs: () => void
  canSave: boolean
}

const Toolbar: React.FC<ToolbarProps> = ({ onLoadFolder, onSave, onSaveAs, canSave }) => {
  return (
    <div className="bg-[#2c3380] p-2 flex items-center space-x-2">
      <Button className='bg-white hover:bg-white/80 text-[#2c3380]' onClick={onLoadFolder}>Load Folder</Button>
      <Button className='bg-white hover:bg-white/80 text-[#2c3380]' onClick={onSave} disabled={!canSave}>Save</Button>
      <Button className='bg-white hover:bg-white/80 text-[#2c3380]' onClick={onSaveAs}>Save As</Button>
    </div>
  )
}

export default Toolbar

