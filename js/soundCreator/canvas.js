/**
 * canvasInit.js
 *
 * university:  University of Applied Sciences Salzburg
 * studie:      MultiMediaTechnology
 * fhs-nummer:  fhs34784
 * usage:	    Basisquaifikation 1 (QPT1)
 * author:      Thomas Mayrhofer (thomas@mayrhofer.at)
 *
 * base class for our canvas element
 * - creates canvas element
 * - calls draw functions from objects added to this class
 */


// add dependencies
// json - object-name: file
var canvasDependencies = {
    "gridBackground": "visualEffects/gridBackground"
};

define(dep(canvasDependencies), function () {
    canvas = function (baseClass) {
        //create canvas element
        var that = this,
            body = document.getElementsByTagName("body")[0],
            wrp = document.createElement("div"),
            canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d");

        //member variables
        this.canvas = canvas;
        this.ctx = ctx;
        this.baseClass = baseClass;

        canvas.setAttribute("id", "context-2d");
        this.resize(window.innerWidth, window.innerHeight);

        wrp.setAttribute("id", "2dContext");
        wrp.setAttribute("class", "visual");
        body.appendChild(wrp).appendChild(canvas);

        this.canvasElementsToRender = []; //container for all elements to be rendered
        this.initElementsAvailable();
        this.printToCanvas();
    };

    /**
     * inits all elements from audioEFX.js and adds them to
     * canvasElementsToRender - which is looped and printed to canvas
     */
    canvas.prototype.initElementsAvailable = function () {
        for (var key in canvasDependencies) {
            //creates an object from key->value pushes it to canvasElementsToRender
            this.canvasElementsToRender.push(new window[key](this));
        }
    };

    /**
     * Prints all elements to our canvas
     * @return - void
     */
    canvas.prototype.printToCanvas = function () {
        //should be changed because animation frame is running when app is paused
        if(this.baseClass.run) {
            this.canvas.width = this.canvas.width; //clearing rect
            var elementsLength = this.canvasElementsToRender.length;

            for (var i = 0; i < elementsLength; i++)
                this.canvasElementsToRender[i].draw(); //call objects draw methode
        }
        window.requestAnimationFrame(this.printToCanvas.bind(this));
    };

    /**
     * adds an element to be rendered
     * @return - void
     */
    canvas.prototype.addElement = function (obj) {
        this.canvasElementsToRender.push(obj);
    };

    /**
     * removes an element on position idx
     * @return - void
     */
    canvas.prototype.deleteElement = function (idx) {
        if (idx > this.canvasElementsToRender.length) throw new Error("undefined index");
        this.canvasElementsToRender.splice(idx, 1);
    };

    /**
     * set width and height of canvas
     * @param _width
     * @param _height
     */
    canvas.prototype.resize = function(_width, _height) {
        this.canvas.width = _width;
        this.canvas.height = _height;
    };

    console.log("canvasInit.js - loaded");
    return canvas;
});

