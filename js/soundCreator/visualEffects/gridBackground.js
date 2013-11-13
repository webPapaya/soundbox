/**
 * gridBackground.js
 *
 * university:  University of Applied Sciences Salzburg
 * studie:      MultiMediaTechnology
 * fhs-nummer:  fhs34784
 * usage:	    Basisquaifikation 1 (QPT1)
 * author:      Thomas Mayrhofer (thomas@mayrhofer.at)
 *
 * creates a grid to visualise which square is currently used
 */

define(function () {
    gridBackground = function (subCanvas) {
        var that = this;
        this.subCanvas = subCanvas;
        this.baseClass = this.subCanvas.baseClass;
    };

    gridBackground.prototype.draw = function () {
        var windowWidth = window.innerWidth,
            windowHeight = window.innerHeight;

        var verticalSpace = windowWidth / this.subCanvas.baseClass.gridSize,
            horizontalSpace = windowHeight / this.subCanvas.baseClass.gridSize;

        this.subCanvas.ctx.strokeStyle = "#444444";
        this.subCanvas.ctx.fillStyle = "rgba(255, 255, 255, 0.1)";

        this.subCanvas.ctx.fillRect(verticalSpace * this.subCanvas.baseClass.currentRow,0, verticalSpace, windowHeight);

        this.subCanvas.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        for (var i = 0; i < this.subCanvas.baseClass.gridSize; i++) {
            this.subCanvas.ctx.beginPath();
            this.subCanvas.ctx.moveTo(verticalSpace * i, 0);
            this.subCanvas.ctx.lineTo(verticalSpace * i, windowHeight);
            this.subCanvas.ctx.stroke();

            this.subCanvas.ctx.beginPath();
            this.subCanvas.ctx.moveTo(0, horizontalSpace * i);
            this.subCanvas.ctx.lineTo(windowWidth, horizontalSpace * i);
            this.subCanvas.ctx.stroke();
        }

        /**
         * draw squares
         */
        var squareList = this.subCanvas.baseClass.currentSamples;
        for(var key in squareList) {
            if(squareList[key]) {
                this.subCanvas.ctx.fillRect(
                    ~~(key/this.baseClass.gridSize) * verticalSpace,
                    (key%this.baseClass.gridSize) * horizontalSpace,
                    verticalSpace,
                    horizontalSpace
                );
            }
        }
    };

    console.log("gridBackground.js - loaded");
    return gridBackground;
});