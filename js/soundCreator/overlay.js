/**
 * overlay.js
 *
 * university:  University of Applied Sciences Salzburg
 * studie:      MultiMediaTechnology
 * fhs-nummer:  fhs34784
 * usage:	    Basisquaifikation 1 (QPT1)
 * author:      Thomas Mayrhofer (thomas@mayrhofer.at)
 *
 * creates a simple overlay
 */

define(function () {
    overlay = function(soundCreator) {
        var overlayWrp  = document.createElement("div"),
            overlayCtx  = document.createElement("div"),
            overlayInfo = document.createElement("div"),
            overlayText = document.createElement("div");

        overlayInfo.setAttribute("class", "close");
        overlayWrp.setAttribute("class", "overlay");
        overlayCtx.setAttribute("class", "overlay-text");

        overlayInfo.innerHTML = "click esc to close";

        overlayWrp.appendChild(overlayCtx);
        overlayCtx.appendChild(overlayText);
        overlayCtx.appendChild(overlayInfo);
        document.body.appendChild(overlayWrp);

        overlayWrp.addEventListener("click", function(ev){
           if(ev.toElement.getAttribute("class")== "overlay") {
               hide();
           }
        });

        function show(_title, _body) {
            var context = document.createElement("div"),
                header  = document.createElement("h1");
            soundCreator.stop();

            overlayWrp.setAttribute("style", "display: block;");


            header.innerHTML  = _title;
            context.appendChild(_body);

            overlayText.appendChild(header);
            overlayText.appendChild(context);
        }

        function hide() {
            overlayWrp.setAttribute("style", "display: none;");
            while (overlayText.hasChildNodes()) {
                overlayText.removeChild(overlayText.lastChild);
            }
            soundCreator.start();
        }

        return {
            "show": show,
            "hide": hide
        };
    };
});

