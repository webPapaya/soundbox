/**
 * particles.js
 *
 * university:  University of Applied Sciences Salzburg
 * studie:      MultiMediaTechnology
 * fhs-nummer:  fhs34784
 * usage:	    Basisquaifikation 1 (QPT1)
 * author:      Thomas Mayrhofer (thomas@mayrhofer.at)
 *
 * creates a simple particle effect using plain image data
 * Reference HTML5 Games Most Wanted - Chapter 6
 */

define(function () {
    particles = function (subCanvas) {
        // convert base properties to shortnames
        this.base = subCanvas.baseClass;
        this.subCanvas = subCanvas;
        this.canvas = this.subCanvas.canvas;

        this.PARTICLEFIELDS = 5; //x, y cord
        this.MAX_PARTICLES = 1000;
        this.PARTICLES_AMOUNT = this.MAX_PARTICLES * this.PARTICLEFIELDS;

        //use typed array for better performance[0]x, [1]y, [2]volocityX, [3]colocityY, [4]age
        this.particles = new Float32Array(this.PARTICLES_AMOUNT);
        this.t0 = new Date();

        this.c = true;
        this.emit();
    };

    particles.prototype.emit = function () {
        for (var i = 0; i < this.PARTICLES_AMOUNT; i += this.PARTICLEFIELDS) {
            this.particles[i + 0] = 500;  // x
            this.particles[i + 1] = 250; 	// y

            var alpha = this.base.rand(Math.PI),
                radius = this.base.rand(100),
                vx = Math.cos(alpha) * radius,
                vy = Math.sin(alpha) * radius,
                age = Math.random();

            this.particles[i + 2] = vx;
            this.particles[i + 3] = vy;
            this.particles[i + 4] = age;
        }
    };

    /**
     * draw function (required)
     */
    particles.prototype.draw = function () {
        var t1 = new Date(),
            timePassed = (t1 - this.t0) / 1000, //get millisec
            MAX_AGE = 5,
            drag = 0.98;
        this.t0 = t1;

        //get image data
        var imageData = this.subCanvas.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
            data = imageData.data;

        for (var i = 0; i < this.PARTICLES_AMOUNT; i += this.PARTICLEFIELDS) {
            //check if particle is hidden
            if ((particles[i + 4] += timePassed) > MAX_AGE) continue;

            var x = ~~(this.particles[i + 0] = this.particles[i + 0] + (this.particles[i + 2] *= drag) * timePassed),
                y = ~~(this.particles[i + 1] = this.particles[i + 1] + (this.particles[i + 3] *= drag) * timePassed);


            if ((x < 0) || (x > this.canvas.width) || (y < 0) || (y > this.canvas.height))
                continue;

            var offset = (x + y * this.canvas.width) * 4;

            //set colors (white @ the moment)
            data[offset + 0] = 255;
            data[offset + 1] = 255;
            data[offset + 2] = 255;
        }

        this.subCanvas.ctx.putImageData(imageData, 0, 0);
    };

    console.log("gridBackground.js - loaded");
});
