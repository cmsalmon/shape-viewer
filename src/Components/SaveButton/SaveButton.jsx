import './SaveButton.scss'
/**
 * Button for saving shape data into a file
 * @param {Array} shapes - Text that should be displayed on OpenFileButton 
 * @param {Function} setMessages - Sets messages to display on modal
 * @param {Function} setDisplay - Sets display state of modal 
 */
function SaveButton({shapes, setMessages, setDisplay}) {
    let fileName = "";
    let type = 'test/shapefile';
    let content = "";
    const shapesOnScreen = shapes.length !== 0 ? true : false;

    /**
     * Format shape data for saving into file
     */
    const parseShapes = () => {
        shapes.forEach((shape) => {
            switch(shape.shape) {
                case "Rectangle":
                    content += shape.shape + ", " + shape.x + ", " + shape.y + ", " + shape.z 
                    + ", " + shape.width + ", " + shape.height + ", " + shape.color + "\r\n";
                    break;
                default:
                    content += shape.shape + ", " + shape.x + ", " + shape.y + ", " + shape.z 
                    + ", ";
                    for (let point of shape.points) {
                        content += point.x  + ", " + point.y + ", ";
                    }
                    content += shape.color + "\r\n";
                break;

            }
        });
    }
 
    /**
     * Saves shape data into a file
     */
    const handleSave = () => {
        // checks for file name before save
        if (fileName === "") {
            setDisplay(true);
            setMessages({title: "Save error", logs: [{id: 0, line: "Please enter a new file name and try again.", message: "File name is empty:"}]});
            return;
        }

        fileName += ".shapefile"
        parseShapes();

        const file = new Blob([content], { type: type }); 
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(file, fileName);
        } else {
            const a = document.createElement("a");
            const url = URL.createObjectURL(file);
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(a.href)
            a.remove();
        }
        content = "";
    }
    
    /**
     * Saves input as file name
     * @param {object} e - Event
     */
    const fileNameInput = (e) => {
        fileName = e.target.value
    }

    return (
        shapesOnScreen && (
        <form id="form" action={handleSave}>
            <label className="saveField" >Save file as: </label>
                <div className='container'>
                    <input type="text" className="newFileName" name="newFileName" placeholder="Type new file name..." onChange={(e) => fileNameInput(e)}/>
                    <input type="submit" className="saveButton" value="Save"></input>
                </div>
        </form>
        )
        
    );
}


export { SaveButton };