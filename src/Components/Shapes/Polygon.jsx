/**
 * Creates polygon object
 * @param {Number} xIndex - The x-position of the top left corner of the polygon
 * @param {Number} yIndex - The y-position of the top left corner of the polygon
 * @param {Number} zIndex - The z-index of the polygon
 * @param {Number} points - The array of vertices for the polygon
 * @param {string} color - The color of the polygon
 */
export class Polygon {
    constructor(xIndex, yIndex, zIndex, points, color, hitbox) {
        this.shape = "Polygon";
        this.x = xIndex;
        this.y = yIndex;
        this.z = zIndex;
        this.points = points;
        this.color = color;
        this.hitbox = hitbox;
    }
}