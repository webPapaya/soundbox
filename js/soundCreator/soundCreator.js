/**
 * soundCreator.js
 *
 * university:  University of Applied Sciences Salzburg
 * studie:      MultiMediaTechnology
 * fhs-nummer:  fhs34784
 * usage:	    Basisquaifikation 1 (QPT1)
 * author:      Thomas Mayrhofer (thomas@mayrhofer.at)
 *
 */

/**
 * helper: converts object to array (used to load modules)
 * @param dependencies (dependencies)
 * @returns array
 */
var dep = function (dependencies) {
    tmp = new Array();
    for (var key in dependencies)
        tmp.push(dependencies[key]);

    return tmp;
};

requirejs.config({
    baseUrl: "js/soundCreator"
});

define([
    "loadSave",
    "overlayContext",
    "canvas",
    "audio",
    "audioVisuals"
], function () {
    soundCreator = function () {
        var that = this;
        this.debug = true;

        this.mouseX = 0;
        this.mouseY = 0;
        this.gridSize = 21;
        this.currentSamples = [];
        this.currentRow = 0;
        this.run = false;

        this.loadSave = new loadSave(this);

        this.overlayContext = new overlayContext(this.loadSave, this);
        this.overlayContext.createMenu();


        //init grid
        for(var i = 0; i < this.gridSize*this.gridSize; i++)
            this.currentSamples[i] = 0;

        /**
         * create instances of canvas,audio and audiovisuals
         */
        this.canvasInstance = new canvas(this);
        this.audioInstance = new audio(this);
        this.audioVisualInstance = new audioVisuals(this.canvasInstance, this.audioInstance);

        /**
         * changes mouse position
         */
        window.onmousemove = function (event) {
            that.mouseX = Math.round(event.clientX);
            that.mouseY = Math.round(event.clientY);
        };

        /**
         * sets current squares if canvas is clicked
         */
        window.onclick = function(ev) {
            if(ev.srcElement.getAttribute("id") == "context-2d"){
                var cords    = that.getCurrentSquare(),
                    arrayPos = cords.positionX*that.gridSize + cords.positionY;

                if(that.currentSamples[arrayPos])
                    that.currentSamples[arrayPos] = 0;
                else
                    that.currentSamples[arrayPos] = 1;
            }
        };

        /**
         * resets canvas sizes on window resize
         */
        window.onresize = function(ev) {
            that.canvasInstance.resize(window.innerWidth, window.innerHeight);
            that.audioVisualInstance.resize(window.innerWidth, window.innerHeight);
        };
    };

    /**
     * calculates current square position
     * @returns {{positionX: number, positionY: number}}
     */
    soundCreator.prototype.getCurrentSquare = function () {
        var squareWidth = window.innerWidth / this.gridSize,
            squareHeight = window.innerHeight / this.gridSize,
            squareX = Math.floor(this.mouseX / squareWidth),
            squareY = Math.floor(this.mouseY / squareHeight);

        return {
            "positionX": squareX,
            "positionY": squareY
        };
    };

    /**
     * sets run var to true
     */
    soundCreator.prototype.start = function() {
        this.run = true;
    };

    /**
     * stops soundCreator
     */
    soundCreator.prototype.stop = function() {
        this.run = false;
    };

    console.log("soundCreator.js - loaded");
});

