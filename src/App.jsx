import { useEffect, useState } from 'react'
import './App.scss'
import { Toolbar } from './Components/Toolbar/Toolbar'
import { LeftMenu } from './Components/Left Menu/LeftMenu'
import { ShapeViewport } from './Components/Shape Viewport/ShapeViewport'
import { Modal } from './Components/Modal/Modal'
import { Rectangle } from './Components/Shapes/Rectangle';
import { Triangle } from './Components/Shapes/Triangle';
import { Polygon } from './Components/Shapes/Polygon';

function App() {
  const [file, setfile] = useState({name: "Open shape file"});
  const [messages, setMessages] = useState({});
  const [display, setDisplay] = useState(false);
  const fileContent = file?.content;
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    if (fileContent) {
        parseFile();
    } else {
        setDisplay(true);
        setMessages({title: "Empty file", logs: [{id: 0, line: "", message: "There are no contents in this file. Please select another."}]});
        setShapes([]);
    }
}, [file]); 
  
  const uploadFile = (file) => {
    setfile(file);
  }

  useEffect(() => {
    if (!display) {
      setMessages({});
    }
  }, [display]);

  /**
     * Checks if passed in argument is a valid hex color
     * @param {string} check - The string to be checked 
     * @return {boolean} - The validity of 'check'
     */
  const checkIfValidHexColor = (check) => {
    const HEX_REGEX = /^[0-9A-F]{6}$/i;
    return HEX_REGEX.test(check);
}

/**
 * Checks if passed in argument is a valid number
 * @param {string} check - The string to be checked 
 * @return {boolean} - The validity of 'check'
 */
const checkIfValidNumber = (check) => {
    return !isNaN(parseInt(check, 10));
}

/**
 * Checks if passed in argument is a valid vertices and returns a array
 * @param {Array} dataPoints - The string to be checked 
 * @return {object} - If the data points are invalid, then it will return an empty object.
 *                      Else, it will return an object with a hitbox for the shape and the shape's vertices
 */
const createVertexArray = (dataPoints) => {
    let error = false;
    let vertex = [];
    let distinctVertex = [];
    let xMin;
    let xMax;
    let yMin;
    let yMax;

    //checks if data is valid numbers and creates an object with x, y coordinates if so
    let index = 1;
    while (index < dataPoints.length - 1) {
        if (index < 4 && checkIfValidNumber(dataPoints[index])) {
            index++;
        } else if (index >= 4 && checkIfValidNumber(dataPoints[index]) && checkIfValidNumber(dataPoints[index + 1])) {
            const xVal = parseInt(dataPoints[index]);
            const yVal = parseInt(dataPoints[index + 1]);
            xMin = xMin ? (xMin < xVal ? xMin : xVal) : xVal;
            xMax = xMax ? (xMax > xVal ? xMax : xVal) : xVal;
            yMin = yMin ? (yMin < yVal ? yMin : yVal) : yVal;
            yMax = yMax ? (yMax > yVal ? yMax : yVal) : yVal;
            vertex.push({x: xVal, y: yVal});
            index += 2;
        } else {
            error = true;
            break;
        }          
    }

    // Checks for duplicate points
    if (!error) {
        const duplicateExists = (a) => (b) => Object.keys(a).every(key => a[key] === b[key]);
        distinctVertex = vertex.reduce((distinct, coord) => {
            if (Array.isArray(distinct)) {
                if (distinct.some(duplicateExists(coord))) {
                    error = true;
                    return [];
                } else {
                    return [...distinct, coord];
                }
            }
        }, []);
    }

    // Adjusts for x, y offset
    if (!error) {
        xMin += parseInt(dataPoints[1]);
        xMax += parseInt(dataPoints[1]);
        yMin += parseInt(dataPoints[2]);
        yMax += parseInt(dataPoints[2]);
    }

    return error ? {} : {hitBox: new Rectangle(xMin, yMin, 0, xMax - xMin, yMax - yMin, "") , vertices: distinctVertex};
}

/** 
 * Parses file to create shape objects for validated data.
 * Invalid shape data will not throw an error but will be skipped over
 * with a error message.
 */  
const parseFile = () => {
    const fileArray = fileContent?.split(/\r?\n/);
    let shapeArray = [];
    let errorMessage = [];
    let errorId = 0;

    try {
        fileArray.forEach(line => {
            const dataPoints = line.split(",").map((data) => data.trim());
            let error = false;
            
            switch (dataPoints[0].toLowerCase()) {
                // Validates rectangle data
                case "rectangle":
                    if (dataPoints.length !== 7) {
                        errorMessage.push({id: errorId, line: line, message: "The following data has insufficient data points for rectangles:"});
                        errorId++;
                        break;
                    }

                    for (let index = 1; index <= 5; index++) {
                        if (!checkIfValidNumber(dataPoints[index])) {
                            error = true;
                        }
                    }
                    
                    if (!checkIfValidHexColor(dataPoints[6])) {
                        error = true;
                    }
                
                    if (error) {
                        errorMessage.push({id: errorId, line: line, message: "The following line does not have the correct data format for rectangle and cannot be rendered:"});
                        errorId++;
                    } else {
                        shapeArray.push(new Rectangle(parseInt(dataPoints[1]), parseInt(dataPoints[2]), parseInt(dataPoints[3]), parseInt(dataPoints[4]), parseInt(dataPoints[5]), dataPoints[6]));
                    }

                    break;
                // Validates Triangle data
                case "triangle":
                    if (dataPoints.length !== 11) {
                        errorMessage.push({id: errorId, line: line, message: "The following data has insufficient data points for triangles: "});
                        errorId++;
                        break;
                    }

                    const trianglePoints = createVertexArray(dataPoints);

                    if (!checkIfValidHexColor(dataPoints[10])) {
                        error = true;
                    }
                
                    if (error || trianglePoints?.vertices?.length === 0) {
                        errorMessage.push({id: errorId, line: line, message: "The following line does not have the correct data format for triangle and cannot be rendered: "});
                        errorId++;
                    } else {
                        shapeArray.push(new Triangle(parseInt(dataPoints[1]), parseInt(dataPoints[2]), dataPoints[3], trianglePoints?.vertices, dataPoints[10], trianglePoints.hitBox));
                    }          
                    break;
                
                // Validates polydon data    
                case "polygon":
                    if (dataPoints.length % 2 !== 1) {
                        errorMessage.push([{id: errorId, line: line, message: "The following data has insufficient data points for triangles: "}]);
                        errorId++;
                        break;
                    }

                    const polygonPoints = createVertexArray(dataPoints);

                    if (!checkIfValidHexColor(dataPoints[dataPoints.length - 1])) {
                        error = true;
                    }
                    if (error || polygonPoints?.vertices?.length === 0) {
                        errorMessage.push({id: errorId, line: line, message: "The following line does not have the correct data format for polygon and cannot be rendered: "});
                        errorId++;
                    } else {
                        shapeArray.push(new Polygon(parseInt(dataPoints[1]), parseInt(dataPoints[2]), dataPoints[3], polygonPoints?.vertices, dataPoints[dataPoints.length - 1], polygonPoints?.hitBox));
                    }  
                    break;
                default:
                    if (line) {
                        errorMessage.push({id: errorId, line: line, message: "Not supported shape data: "});
                        errorId++;
                    }
                    break;
            }

            
        });

        if (errorMessage.length !== 0) {
            setMessages({title: "Shapes were not rendered", logs: errorMessage});
            setDisplay(true);
        }

        // sort shape array by z-index
        shapeArray.sort((a, b) => { return a.z - b.z });
        setShapes(shapeArray);
    } catch (error) {
        console.error(error);
    }
}

  return (
    <>
      {display && <Modal messages={messages} setDisplay={setDisplay}/>}
      <Toolbar bText={file.name} onFileUpload={uploadFile} setMessages={setMessages} setDisplay={setDisplay}/>
      <div id='container'>
        <LeftMenu bText={file.name} onFileUpload={uploadFile} shapes={shapes} setMessages={setMessages} setDisplay={setDisplay}/>
        <ShapeViewport shapes={shapes}/>
      </div>
    </>
  )
}

export default App
