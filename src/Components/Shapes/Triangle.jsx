/**
 * Creates triangle object
 * @param {Number} xIndex - The x-position of the top left corner of the triangle
 * @param {Number} yIndex - The y-position of the top left corner of the triangle
 * @param {Number} zIndex - The z-index of the triangle
 * @param {object} point1 - Object that holds coordinate for a triangle point
 * @param {object} point2 - Object that holds coordinate for a triangle point
 * @param {object} point3 - Object that holds coordinate for a triangle point
 * @param {string} color - The color of the triangle
 */
export class Triangle {
    constructor(xIndex, yIndex, zIndex, point1, point2, point3, color, hitbox) {
        this.shape = "Triangle";
        this.x = xIndex;
        this.y = yIndex;
        this.z = zIndex;
        this.point1 = point1;
        this.point2 = point2;
        this.point3 = point3;
        this.color = color;
        this.hitbox = hitbox;
    }
}