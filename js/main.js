/***
 * file:        main.js
 *
 * university:  University of Applied Sciences Salzburg
 * studie:      MultiMediaTechnology
 * fhs-nummer:  fhs34784
 * usage:	    Basisquaifikation 1 (QPT1)
 * author:      Thomas Mayrhofer (thomas@mayrhofer.at)
 *
 * Starting file for sound creator app
 * - add loader
 * - asks for browser support
 * - loads all files
 * - starts app
 */

var opts = {
    lines: 15, // The number of lines to draw
    length: 18, // The length of each line
    width: 2, // The line thickness
    radius: 27, // The radius of the inner circle
    corners: 0, // Corner roundness (0..1)
    rotate: 10, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#fff', // #rgb or #rrggbb
    speed: 2.2, // Rounds per second
    trail: 74, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
};

var loaderWrp = document.createElement("div");
    loaderWrp.id = "loader";
    document.body.appendChild(loaderWrp);
var spinner = new Spinner(opts).spin(loaderWrp);


requirejs(["lib/modernizr", "lib/three.min"], function () {
    console.log("---------------------------------");

    if(!Modernizr.canvas ||
       !Modernizr.audio ||
       !Modernizr.webgl ||
       !Modernizr.webaudio ||
       !Modernizr.audiodata) {

        spinner.stop();
        document.getElementById("error").setAttribute("style", "display: block;");
        console.log("Your Brower doesn't support this application");
    } else {
        requirejs([
            "soundCreator/soundCreator"
        ], function () {
            var app = new soundCreator();

            spinner.stop();
            app.start();
            app.stop();
            app.start();
        });
    }
});