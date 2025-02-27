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
        messages?.logs && createPortal(
            <div id="modal">
                <div id="messageTitle">
                    <h4>{messages.title}</h4>
                    <button id="closeButton" onClick={closeModal}>Close</button>
                </div>
                <div id="errorContainer">
                    {
                        messages?.logs.map(error => {
                            if (error?.line) {
                                return (
                                    <div className='error' key={error.id}>
                                        <p className='errorMessage'>{error.message}</p>
                                        <p className='errorLine'>{error.line}</p>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className='error' key={error.id}>
                                        <p className='errorMessage'>{error.message}</p>
                                    </div>
                                );
                            }
                        })
                    }
                </div>
            </div>,
            document.getElementById("overlay")
        )
    );
}


export { Modal };