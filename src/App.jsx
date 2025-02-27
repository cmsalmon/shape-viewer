import { useEffect, useState } from 'react'
import './App.scss'
import { Toolbar } from './Toolbar/Toolbar'
import { LeftMenu } from './Left Menu/LeftMenu'
import { ShapeViewport } from './Shape Viewport/ShapeViewport'
import { Modal } from './Modal/Modal'

function App() {
  const [file, setfile] = useState({name: "Open shape file"});
  const [messages, setMessages] = useState("");
  const [display, setDisplay] = useState(false);
  
  const uploadFile = (file) => {
    setfile(file);
  }

  useEffect(() => {
    if (!display) {
      setMessages("");
    }
  }, [display]);

  return (
    <>
      {display && <Modal messages={messages} setDisplay={setDisplay}/>}
      <Toolbar bText={file.name} onFileUpload={uploadFile} />
      <div id='container'>
        <LeftMenu bText={file.name} onFileUpload={uploadFile}/>
        <ShapeViewport file={file} setMessages={setMessages} setDisplay={setDisplay}/>
      </div>
    </>
  )
}

export default App
