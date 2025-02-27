import { OpenFileButton } from "../Open File Button/OpenFileButton";
import './Toolbar.scss'

/**
 * Toolbar for Shape Viewer
 * @param {string} bText - Text that should be displayed on OpenFileButton 
 * @param {Function} onFileUpload - Fuction that should be run on file upload
 */
function Toolbar({bText, onFileUpload, setMessages, setDisplay}) {
    return (
        <div id='toolbar'>
            <h2 id='siteName'>Shape Viewer</h2>
            <OpenFileButton bText={bText} onFileUpload={onFileUpload} setMessages={setMessages} setDisplay={setDisplay}/>
        </div>
    );
}


export { Toolbar };