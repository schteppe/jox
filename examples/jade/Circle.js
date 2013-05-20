/**
 * Creates an instance of Circle.
 *
 * @class
 * @this {Circle}
 * @param {number} r The desired radius of the circle.
 */
function Circle(r) {
    /**
     * The radius of the circle.
     * @property
     * @memberof Circle
     * @type {number}
     */
    this.radius = r;

    /**
     * Circumference of the circle.
     * @property
     * @memberof Circle
     * @type {number}
     */
    this.circumference = 2 * Math.PI * r;
}

/**
 * Calculates the circumference of the Circle.
 *
 * @return {number} The circumference of the circle.
 * @method
 * @memberof Circle
 */
Circle.prototype.calculateCircumference = function () {
    return 2 * Math.PI * this.radius;
};
