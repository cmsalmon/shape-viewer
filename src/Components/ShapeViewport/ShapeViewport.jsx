import { useEffect } from 'react';
import './ShapeViewport.scss'

/**
 * Draws shapes from data in passed in file onto the canvas 
 * @param {Array} shapes - Array of shapes to be drawn on canvas
 */
function ShapeViewport({shapes}) {
    let currentShape = null;
    let isDragging = false;
    let startX;
    let startY;
    let yOffset;
    let xOffset;

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
            if (checkShape.width > 0) {
                left = checkShape.x;
                right = checkShape.x + checkShape.width;
            } else {
                left = checkShape.x + checkShape.width;
                right = checkShape.x;
            }
            if (checkShape.height > 0) {
                top = checkShape.y;
                bottom = checkShape.y + checkShape.height;
            } else {
                top = checkShape.y + checkShape.height;checkShape.y;
                bottom = checkShape.y;
            }
        } else {
            if (checkShape.hitbox.width > 0) {
                left = checkShape.hitbox.x;
                right = checkShape.hitbox.x + checkShape.hitbox.width;
            } else {
                left = checkShape.hitbox.x + checkShape.hitbox.width;
                right = checkShape.hitbox.x;
            }
            if (checkShape.hitbox.height > 0) {
                top = checkShape.hitbox.y;
                bottom = checkShape.hitbox.y + checkShape.hitbox.height;
            } else {
                top = checkShape.hitbox.y + checkShape.hitbox.height;
                bottom = checkShape.hitbox.y;
            }
            
            
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

            for (let shape of shapes) {
                if (checkIfClickedInsideShape(startX, startY, shape)) {
                    currentShape = shape;
                    isDragging = true;
                    return;
                }
            }
        }
    }

    /**
     * Sets dragging state to false.
     * @param {object} e - Event
     */
    const mouseUp = (e) => {
        e.preventDefault();
        isDragging = false;
    }

    /**
     * Sets dragging state to false.
     * @param {object} e - Event
     */
    const mouseOut = (e) => {
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