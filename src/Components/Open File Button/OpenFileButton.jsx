import './OpenFileButton.scss'

/**
 * Button for uploading files into Shape Siewer
 * @param {string} bText - Text that should be displayed on OpenFileButton 
 * @param {Function} onFileUpload - Fuction that should be run on file upload
 * @param {Function} setMessages - Sets message object to be displayedd in modal
 * @param {Function} setDisplay - Set display state of modal
 */
function OpenFileButton({bText, onFileUpload, setMessages, setDisplay}) {

    /**
     * Checks if valid file and if so reads in file content
     * @param {object} e - Event
     */
    const handleUpload = (e) => {
        const file = e.target.files[0];
        const fileName = file?.name;
        
        //check if file exists
        if (!file) {
            setDisplay(true);
            setMessages({title: "File error", logs: [{id: 0, line: "", message: "File undefined. Select new file."}]});
            return;
        }

        const fileReader = new FileReader();
         // when file is successfully loaded
        fileReader.onload = () => {
            onFileUpload({name: fileName, content: fileReader.result});
        }

        // when reading the file fails
        fileReader.onerror = () => {
            setDisplay(true);
            setMessages({title: "File error", logs: [{id: 0, line: "", message: "File undefined. Select new file."}]});
        }

        fileReader.readAsText(file);

    }
    
    return (
        
        <label className="uploadFile">
            <input className="shapeFile" type="file" accept='.shapefile' name="shapeFile" onChange={(e) => handleUpload(e)}/>
            {bText}
        </label>
        
    );
}


export { OpenFileButton };