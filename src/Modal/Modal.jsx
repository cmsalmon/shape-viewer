import { createPortal } from 'react-dom';
import './Modal.scss';

/**
 * Button for uploading files into Shape Siewer
 * @param {string} bText - Text that should be displayed on OpenFileButton 
 * @param {Function} onFileUpload - Fuction that should be run on file upload
 */
function Modal({messages, setDisplay}) {
    
    const closeModal = () => {
        setDisplay(false);
    }
    
    return (
        createPortal(
            <div id="modal">
                {messages}
                {console.log("Modal!!")}
                <button onClick={closeModal}>Close</button>
            </div>,
            document.getElementById("overlay")
        )
    );
}


export { Modal };