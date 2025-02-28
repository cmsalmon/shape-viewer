/**
 * Creates triangle object
 * @param {Number} xIndex - The x-position of the top left corner of the triangle
 * @param {Number} yIndex - The y-position of the top left corner of the triangle
 * @param {Number} zIndex - The z-index of the triangle
 * @param {Array} points - Array that holds coordinates for a triangle vertices
 * @param {string} color - The color of the triangle
 * @param {object} hitbox - Rectangle object that serves as the hitbox for the triangle
 */
export class Triangle {
    constructor(xIndex, yIndex, zIndex, points, color, hitbox) {
        this.shape = "Triangle";
        this.x = xIndex;
        this.y = yIndex;
        this.z = zIndex;
        this.points = points;
        this.color = color;
        this.hitbox = hitbox;
    }
}