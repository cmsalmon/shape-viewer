import { OpenFileButton } from '../Open File Button/OpenFileButton';
import './LeftMenu.scss'

/**
 * Left menu for Shape Viewer
 * @param {string} bText - Text that should be displayed on OpenFileButton 
 * @param {Function} onFileUpload - Fuction that should be run on file upload
 */
function LeftMenu({bText, onFileUpload}) {
    return (
        <div id='leftMenu'>
            <OpenFileButton bText={bText} onFileUpload={onFileUpload}/>
        </div>
    );
}


export { LeftMenu };