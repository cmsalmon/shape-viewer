import { useEffect, useState } from 'react';
import './ShapeViewport.scss'
import { Rectangle } from '../Shapes/Rectangle';
import { Triangle } from '../Shapes/Triangle';
import { Polygon } from '../Shapes/Polygon';

/**
 * Draws shapes from data in passed in file onto the canvas 
 * @param {object} file - File that will be used to draw shapes
 * @param {Function} setMessages - Sets list an object that contains messages to be displayed in modal
 * @param {Function} setDisplay - Sets the display state of the modal
 */
function ShapeViewport({file, setMessages, setDisplay}) {
    const fileContent = file?.content;
    const [shapes, setShapes] = useState([]);
    let current_shape_Index = null;
    let isDragging = false;
    let startX;
    let startY;
    let yOffset;
    let xOffset;
    
    useEffect(() => {
        if (fileContent) {
            parseFile();
        } else {
            setDisplay(true);
            setMessages({title: "Empty file", logs: [{id: 0, line: "", message: "There are no contents in this file. Please select another."}]});
            setShapes([]);
        }
    }, [file]); 

    useEffect(() => {
        window.addEventListener('resize', adjustCanvasSize);
        adjustCanvasSize();
        return () => window.removeEventListener('resize', adjustCanvasSize);
    }, [shapes]);
    
    // Adjusts the canvas size to the size of viewport and draws uploaded shapes
    const adjustCanvasSize = () => {
        const canvas =  document.getElementById("canvas");
        const viewport =  document.getElementById("viewport").getBoundingClientRect();
        const shape_viewport_width_in_pixels = viewport["width"];
        const shape_viewport_height_in_pixels = viewport["height"]; 
        canvas.height = Math.round(shape_viewport_height_in_pixels);
        canvas.width = Math.round(shape_viewport_width_in_pixels);

        if (canvas.getContext) {
            const context = canvas.getContext('2d');
            draw(context, shape_viewport_width_in_pixels, shape_viewport_height_in_pixels);
        }
    }

    /**
     * Draws validated shapes from file onto canvas
     * @param {CanvasRenderingContext2D} context - The context of the canvas
     * @param {Number} canvasWidth - The width of canvas
     * @param {Number} canvasHeight - The height of canvas
     */
    const draw = (context, canvasWidth, canvasHeight) => {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        shapes.forEach((shape) => {
            switch(shape.shape) {
                case "Rectangle":
                    context.fillStyle = "#" + shape.color;
                    context.fillRect(shape.x, shape.y, shape.width, shape.height);
                    break;
                default:
                    const firstPoint = false;
                    context.fillStyle = "#" + shape.color;
                    context.beginPath();
                    shape.points.forEach((point) => {
                        if (!firstPoint) {
                            context.lineTo(shape.x + point.x, shape.y + point.y);
                        } else {
                            context.moveTo(shape.x + point.x, shape.y + point.y);
                        }
                    });
                    context.fill();
                    break;     
            }
        });

    }
    
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
            // referenced from https://www.reddit.com/r/learnjavascript/comments/sjir7s/how_do_i_check_if_the_array_of_objects_has/
            const duplicateExists = a => b => Object.keys(a).every(key => a[key] === b[key]);
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
 
    /**
     * Checks if mouse click was within the shape or its hitbox
     * @param {Number} x - The x coordinate of mouse click
     * @param {Number} y - The y coordinate of mouse click
     * @param {object} checkShape - The shape to check if it was clicked 
     * @return {boolean} - If the mouse click was within the shape, 
     *                      then it returns true. Else, if returns false.
     */
    const checkIfClickedInsideShape = (x, y, checkShape) => {
        let left;
        let right;
        let top;
        let bottom;
        if (checkShape.shape === "Rectangle") {
            left = checkShape.x;
            right = checkShape.x + checkShape.width;
            top = checkShape.y;
            bottom = checkShape.y + checkShape.height;
        } else {
            left = checkShape.hitbox.x;
            right = checkShape.hitbox.x + checkShape.hitbox.width;
            top = checkShape.hitbox.y;
            bottom = checkShape.hitbox.y + checkShape.hitbox.height;
        }

        if (x > left && x < right && y > top && y < bottom) {
            return true;
        }
        return false;
    }

    /**
     * Determines if a shape is clicked on and if so, stores the shape index.
     * Also sets dragging state to true.
     * @param {object} e - Event
     */
    const mouseDown =(e)=> {
        e.preventDefault();
        // x, y offset
        yOffset = document.getElementById("canvas").getBoundingClientRect()["top"];
        xOffset = document.getElementById("leftMenu").getBoundingClientRect()["width"]; 
        
        if (checkLeftMouseClick(e)) {
            startX = parseInt(e.clientX) - parseInt(xOffset);
            startY = parseInt(e.clientY) - parseInt(yOffset);
            let index = 0;
            for (let shape of shapes) {
                if (checkIfClickedInsideShape(startX, startY, shape)) {
                    current_shape_Index = index;
                    isDragging = true;
                    return;
                }
                index++;
            }
        }
    }

    /**
     * Sets dragging state to false.
     * @param {object} e - Event
     */
    const mouseUp = (e) => {
        if (!isDragging) {
            return;
        }
        e.preventDefault();
        isDragging = false;
    }

    /**
     * Sets dragging state to false.
     * @param {object} e - Event
     */
    const mouseOut = (e) => {
        if (!isDragging) {
            return;
        }
        e.preventDefault();
        isDragging = false;
    }

    /**
     * Translates clicked shape on canvas
     * @param {object} e - Event
     */
    const mouseMove = (e) => {
        if (!isDragging) {
            return;
        } else {
            e.preventDefault();
            let mouseX = parseInt(e.clientX) - parseInt(xOffset);;
            let mouseY = parseInt(e.clientY) - parseInt(yOffset);;
            
            //distance traveled
            let dx = mouseX - parseInt(startX);
            let dy = mouseY - parseInt(startY);

            let currentShape = shapes[current_shape_Index]

            currentShape.x += dx;
            currentShape.y += dy;

            // moves hitbox with shape
            if (currentShape.shape !== "Rectangle") {
                currentShape.hitbox.x += dx;
                currentShape.hitbox.y += dy;
            }

            adjustCanvasSize();

            startX = mouseX;
            startY = mouseY;
        }
    }

    /**
     * Checks if left mouse was clicked.
     * https://stackoverflow.com/a/12737882
     * @param {object} e - Event
     */
    const checkLeftMouseClick = (e) => {
        if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
            return false;
        } else if ('buttons' in e) {
            return e.buttons === 1;
        } else if ('which' in e) {
            return e.which === 1;
        } else {
            return (e.button == 1 || e.type == 'click');
        }
    }

    return (
        <div id='viewport'>
            <canvas id="canvas" onMouseDown={(e) => mouseDown(e)} onMouseOut={(e) => mouseOut(e)} onMouseUp={(e) => mouseUp(e)} onMouseMove={(e) => mouseMove(e)}></canvas>    
        </div>
    );
}


export { ShapeViewport };