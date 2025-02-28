import { OpenFileButton } from '../Open File Button/OpenFileButton';
import { SaveButton } from '../Save Button/SaveButton';
import './LeftMenu.scss'

/**
 * Left menu for Shape Viewer
 * @param {string} bText - Text that should be displayed on OpenFileButton 
 * @param {Function} onFileUpload - Fuction that should be run on file upload
 * @param {Array} shapes - Array of shape objects
 * @param {Function} setMessages - Sets messages to display on modal
 * @param {Function} setDisplay - Sets display state of modal
 */
function LeftMenu({bText, onFileUpload, shapes, setMessages, setDisplay}) {
    return (
        <div id='leftMenu'>
            <OpenFileButton id="openFileButton" bText={bText} onFileUpload={onFileUpload} />
            <SaveButton shapes={shapes} setMessages={setMessages} setDisplay={setDisplay}/>
        </div>
    );
}


export { LeftMenu };