import { useEffect, useState } from 'react';
import './ShapeViewport.scss'
import { Rectangle } from '../Shapes/Rectangle';
import { Triangle } from '../Shapes/Triangle';
import { Polygon } from '../Shapes/Polygon';

/**
 * Draws shapes from data in passed in file onto the canvas 
 * @param {object} file - File that will be used to draw shapes
 */
function ShapeViewport({file, setMessages, setDisplay}) {
    const fileContent = file?.content;
    const [shapes, setShapes] = useState([]);
    
    useEffect(() => {
        if (fileContent) {
            parseFile();
        }
    }, [file]); 

    useEffect(() => {
        window.addEventListener('resize', adjustCanvasSize);
        adjustCanvasSize();
        return () => window.removeEventListener('resize', adjustCanvasSize);
    }, [shapes]);
    
    // Adjusts the canvas size to the size of viewport
    const adjustCanvasSize = () => {
        const canvas =  document.getElementById("canvas");
        const viewport =  document.getElementById("viewport").getBoundingClientRect();
        const shape_viewport_width_in_pixels = viewport["width"];
        const shape_viewport_height_in_pixels = viewport["height"]; 
        canvas.height = Math.round(shape_viewport_height_in_pixels);
        canvas.width = Math.round(shape_viewport_width_in_pixels);

        if (canvas.getContext) {
            const ctx = canvas.getContext('2d');
            draw(ctx);
        }
    }

    /**
     * Draws validated shapes from file onto canvas
     * @param {CanvasRenderingContext2D} context - The context of the canvas 
     */
    const draw = (context) => {
        shapes.forEach((shape) => {
            switch(shape.shape) {
                case "Rectangle":
                    context.fillStyle = "#" + shape.color;
                    context.fillRect(shape.x, shape.y, shape.width, shape.height);
                    break;
                case "Triangle":
                    context.fillStyle = "#" + shape.color;
                    context.beginPath();
                    context.moveTo(shape.x + shape.point1.x, shape.y + shape.point1.y);
                    context.lineTo(shape.x + shape.point2.x, shape.y + shape.point2.y);
                    context.lineTo(shape.x + shape.point3.x, shape.y + shape.point3.y);
                    context.fill();
                    break;
                case "Polygon":
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
                default:
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
     * Checks if passed in argument is a valid number greater than or equal to 0
     * @param {string} check - The string to be checked 
     * @return {boolean} - The validity of 'check'
     */
    const checkIfValidNumber = (check) => {
        return !isNaN(parseInt(check, 10)) && parseInt(check, 10) >= 0;
    }

    /**
     * Checks if passed in argument is a valid vertices and returns a array
     * @param {Array} dataPoints - The string to be checked 
     * @return {Array} - Returns an empty array if there was an invalid point 
     *                   and returns an array with valid points if there wasn't 
     */
    const createVertexArray = (dataPoints) => {
        let error = false;
        let vertex = [];
        let distinctVertex = [];

        //checks if data is valid numbers and creates an object with x, y coordinates if so
        let index = 1;
        while (index < dataPoints.length - 1) {
            if (index < 4 && checkIfValidNumber(dataPoints[index])) {
                index++;
            } else if (index >= 4 && checkIfValidNumber(dataPoints[index]) && checkIfValidNumber(dataPoints[index + 1])) {
                const xVal = parseInt(dataPoints[index]);
                const yVal = parseInt(dataPoints[index + 1]);
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

        return error ? [] : distinctVertex;
    }

    /** 
     * Parses file to create shape objects for validated data.
     * Invalid shape data will not throw an error but will be skipped over
     * with a error message.
     */  
    const parseFile = () => {
        const fileArray = fileContent?.split(/\r?\n/);
        let shapeArray = [];
        let errorMessage = "";

        if (!fileArray || fileArray.length === 0) {
            errorMessage = "There are no contents in this file. Please select another."
            setMessages(errorMessage);
            return;
        }
        
        fileArray.forEach(line => {
            const dataPoints = line.split(",").map((data) => data.trim());
            let error = false;
            
            switch (dataPoints[0].toLowerCase()) {
                // Validates rectangle data
                case "rectangle":
                    if (dataPoints.length !== 7) {
                        errorMessage += "The following data has insufficient data points for rectangles: \n" + line + "\n";
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
                        errorMessage += "The following line does not have the correct data format for rectangle and cannot be rendered: \n" + line + "\n";
                    } else {
                        shapeArray.push(new Rectangle(dataPoints[1], dataPoints[2], dataPoints[3], dataPoints[4], dataPoints[5], dataPoints[6]));
                    }

                    break;
                // Validates Triangle data
                case "triangle":

                    if (dataPoints.length !== 11) {
                        errorMessage += "The following data has insufficient data points for triangles: " + line + "\n";
                        break;
                    }

                    const trianglePoints = createVertexArray(dataPoints);

                    if (!checkIfValidHexColor(dataPoints[10])) {
                        error = true;
                    }
                
                    if (error || trianglePoints.length === 0) {
                        errorMessage += "The following line does not have the correct data format for triangle and cannot be rendered: \n" + line + "\n";
                    } else {
                        shapeArray.push(new Triangle(parseInt(dataPoints[1]), parseInt(dataPoints[2]), dataPoints[3], ...trianglePoints, dataPoints[10]));
                    }          
                    break;
                
                // Validates polydon data    
                case "polygon":
                    if (dataPoints.length % 2 !== 1) {
                        errorMessage += "The following data has insufficient data points for triangles: " + line + "\n";
                        break;
                    }

                    const polygonPoints = createVertexArray(dataPoints);

                    if (!checkIfValidHexColor(dataPoints[dataPoints.length - 1])) {
                        error = true;
                    }
                    if (error || polygonPoints.length === 0) {
                        errorMessage += "The following line does not have the correct data format for polygon and cannot be rendered: \n" + line + "\n";
                    } else {
                        shapeArray.push(new Polygon(parseInt(dataPoints[1]), parseInt(dataPoints[2]), dataPoints[3], polygonPoints, dataPoints[dataPoints.length - 1]));
                    }  
                    break;
                default:
                    if (line) {
                        errorMessage += "Not supported shape data: " + line + "<br/>";
                    }
                    break;
            }

            
        });

        if (errorMessage !== "") {
            setMessages(errorMessage);
            setDisplay(true);
        }

        // sort shape array by z-index
        shapeArray.sort((a, b) => { return a.z - b.z });

        setShapes(shapeArray);
    }

    return (
        <div id='viewport'>
            <canvas id="canvas"></canvas>    
        </div>
    );
}


export { ShapeViewport };