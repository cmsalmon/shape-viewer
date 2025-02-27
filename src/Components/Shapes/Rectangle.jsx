/**
 * Creates rectangle object
 * @param {Number} xIndex - The x-position of the top left corner of the rectagle
 * @param {Number} yIndex - The y-position of the top left corner of the rectagle
 * @param {Number} zIndex - The z-index of the rectangle
 * @param {Number} width - The width of the rectangle
 * @param {Number} height - The height of the rectangle
 * @param {string} color - The color of the rectangle
 */
export class Rectangle {
    constructor(xIndex, yIndex, zIndex, width, height, color) {
        this.shape = "Rectangle";
        this.x = xIndex;
        this.y = yIndex;
        this.z = zIndex;
        this.width = width;
        this.height = height;
        this.color = color;
    }
}