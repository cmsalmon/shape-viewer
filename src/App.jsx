import { useState } from 'react'
import './App.scss'
import { Toolbar } from './Toolbar/Toolbar'
import { LeftMenu } from './Left Menu/LeftMenu'
import { ShapeViewport } from './Shape Viewport/ShapeViewport'

function App() {
  const [file, setfile] = useState({name: "Open shape file"});
  
  const uploadFile = (file) => {
    setfile(file);
  }

  return (
    <>
      <Toolbar bText={file.name} onFileUpload={uploadFile}/>
      <div id='container'>
        <LeftMenu bText={file.name} onFileUpload={uploadFile}/>
        <ShapeViewport file={file}/>
      </div>
    </>
  )
}

export default App
