import { OpenFileButton } from "../OpenFileButton/OpenFileButton";
import './Toolbar.scss'

/**
 * Toolbar for Shape Viewer
 * @param {string} bText - Text that should be displayed on OpenFileButton 
 * @param {Function} onFileUpload - Fuction that should be run on file upload
 * @param {Function} setMessages - Sets message object to be displayed in modal
 * @param {Function} setDisplay - Sets display status of modal
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