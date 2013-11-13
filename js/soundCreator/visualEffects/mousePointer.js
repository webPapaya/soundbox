/**
 * mousePointer.js
 *
 * university:  University of Applied Sciences Salzburg
 * studie:      MultiMediaTechnology
 * fhs-nummer:  fhs34784
 * usage:	    Basisquaifikation 1 (QPT1)
 * author:      Thomas Mayrhofer (thomas@mayrhofer.at)
 *
 * creates an animated circle which is used as mouse pointer
 */

define(function () {
    mousePointer = function (subCanvas) {
        this.subCanvas = subCanvas;

        //define animation constants
        this.rotationSpeed = 1;
        this.dotRadius = 10;
        this.animationRadius = 100;
        this.animationAngle = 1;
        this.circleSpace = 0.05;
        this.children = 10;

        //define middle point (will be overwritten by mouse position)
        this.mouseX = 0;
        this.mouseY = 0;

        //define dots position - will be initialised from this.animate()
        this.circlePosX = 0;
        this.circlePosY = 0;
    };

    /**
     * animates cursor circle
     * @param spacingAngle - space between two dots
     * @return -void
     */
    mousePointer.prototype.animate = function (spacingAngle) {
        this.mouseX = this.subCanvas.baseClass.mouseX;
        this.mouseY = this.subCanvas.baseClass.mouseY;

        this.animationAngle += this.rotationSpeed / 100;
        this.circlePosX = this.mouseX + Math.cos(this.animationAngle + spacingAngle) * this.animationRadius;
        this.circlePosY = this.mouseY + Math.sin(this.animationAngle + spacingAngle) * this.animationRadius;
    };

    /**
     * draws dots to canvas
     * @return - void
     */
    mousePointer.prototype.draw = function () {
        var spacingAngle, radius;
        this.subCanvas.ctx.beginPath();
        this.subCanvas.ctx.fillStyle = "#fff";

        for (i = 0; i < this.children; i++) {
            spacingAngle = i * this.circleSpace;
            radius = this.dotRadius - (this.dotRadius - i);

            this.animate(spacingAngle);
            this.subCanvas.ctx.arc(this.circlePosX, this.circlePosY, radius, 0, Math.PI * 2, false);
        }

        this.subCanvas.ctx.fill();
    };

    console.log("mousePointer.js - loaded");
    return mousePointer;
});