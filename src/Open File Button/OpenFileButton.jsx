import './OpenFileButton.scss'

/**
 * Button for uploading files into Shape Siewer
 * @param {string} bText - Text that should be displayed on OpenFileButton 
 * @param {Function} onFileUpload - Fuction that should be run on file upload
 */
function OpenFileButton({bText, onFileUpload}) {

    const handleUpload = (e) => {
        const file = e.target.files[0];
        const fileName = file?.name;
        
        //check if file exists
        if (!file) {
            alert("File undefined. Select new file.");
            return;
        }

        const fileReader = new FileReader();
         // when file is successfully loaded
        fileReader.onload = () => {
            onFileUpload({name: fileName, content: fileReader.result});
        }

        // when reading the file fails
        fileReader.onerror = () => {
            alert("Failed");
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