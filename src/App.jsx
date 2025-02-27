import { useEffect, useState } from 'react'
import './App.scss'
import { Toolbar } from './Components/Toolbar/Toolbar'
import { LeftMenu } from './Components/Left Menu/LeftMenu'
import { ShapeViewport } from './Components/Shape Viewport/ShapeViewport'
import { Modal } from './Components/Modal/Modal'

function App() {
  const [file, setfile] = useState({name: "Open shape file"});
  const [messages, setMessages] = useState({});
  const [display, setDisplay] = useState(false);
  
  const uploadFile = (file) => {
    setfile(file);
  }

  useEffect(() => {
    if (!display) {
      setMessages({});
    }
  }, [display]);

  return (
    <>
      {display && <Modal messages={messages} setDisplay={setDisplay}/>}
      <Toolbar bText={file.name} onFileUpload={uploadFile} setMessages={setMessages} setDisplay={setDisplay}/>
      <div id='container'>
        <LeftMenu bText={file.name} onFileUpload={uploadFile}/>
        <ShapeViewport file={file} setMessages={setMessages} setDisplay={setDisplay}/>
      </div>
    </>
  )
}

export default App
