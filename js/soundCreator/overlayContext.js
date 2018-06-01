/**
 * overlay.js
 *
 * university:  University of Applied Sciences Salzburg
 * studie:      MultiMediaTechnology
 * fhs-nummer:  fhs34784
 * usage:	    Basisquaifikation 1 (QPT1)
 * author:      Thomas Mayrhofer (thomas@mayrhofer.at)
 *
 * json context for overlay
 */


define(["overlay"], function () {
    overlayContext = function(loadSave, soundCreator) {
        var overlayCtx= {
            "about": {
                "header": "About this Project",
                "context": getAbout()
            },
            "load": {
                "header": "Load Sample",
                "context": getSamples()
            },
            "save": {
                "header":  "Save Sample",
                "context": getSaveForm()
            },
            "impressum": {
                "header": "impressum",
                "context": getImpressum()
            }
        };

        overlayContext.__proto__ = overlay(soundCreator);

        /**
         * creates an menu with all the items from overlayCtx object
         */
        overlayContext.createMenu = function() {
            var menu = document.createElement("div"),
                list = document.createElement("ul");

            for(key in overlayCtx) {
                var item = document.createElement("li"),
                    link = document.createElement("a");

                link.setAttribute("href", "#" + key);
                link.innerHTML = key;

                link.onclick = (function(e){
                    e.preventDefault();
                    loadOverlay(e.srcElement.hash);
                });

                item.appendChild(link);
                list.appendChild(item);
            }

            menu.setAttribute("class", "menu");
            menu.appendChild(list);
            document.body.appendChild(menu);
        };

        /**
         * loads inputs from overlayCtx object and inserts them to our overlay
         * @param _hash - pseudo link for detecting which menu item was clicked
         */
        function loadOverlay(_hash) {
            var str  = _hash.substr(1,_hash.length),
                item = overlayCtx[str];
            var ctx = item.context;

            if(item.header == "Load Sample") {
                ctx = getSamples();
            }

            overlayContext.show(item.header, ctx);
        }

        /**
         * theming function for load samples
         * @returns {HTMLElement}
         */
        function getSamples() {
            var samples = loadSave.loadSamples();


            if(!samples) {
                var markup = document.createElement("p");
                markup.innerHTML = "keine Samples gefunden =(";
                return markup;
            } else {
                var list = document.createElement("ul");
                for(var key in samples) {
                    var item = document.createElement("li"),
                        link = document.createElement("a"),
                        name = document.createElement("span"),
                        date = document.createElement("span");

                    name.innerHTML = samples[key].name;
                    date.innerHTML = createDate(samples[key].timestamp);

                    name.setAttribute("class", "title");
                    date.setAttribute("class", "date");

                    link.setAttribute("id", "sample-" + key);
                    link.setAttribute("href", "#");

                    link.appendChild(name);
                    link.appendChild(date);
                    item.appendChild(link);
                    list.appendChild(item);

                    link.addEventListener("click", function(ev) {
                        ev.preventDefault();
                        var id = ev.srcElement.getAttribute("id");
                        id = id.replace(/[A-Za-z$-]/g, "");

                        loadSave.setSample(id);
                        overlayContext.hide();
                    });
                }


                return list;
            }
        }

        /**
         * theming which converts an unix timestamp to a time ago value
         * @param _timestamp - which should be converted
         * @returns {string}
         */
        function createDate(_timestamp) {
            var createdDate = Math.round(_timestamp/1000),
                currentDate = Math.round(new Date().getTime()/1000),
                difference  = currentDate - createdDate,
                periodes    = ["Sekunden", "Minuten", "Stunden", "Tage", "Wochen", "Monaten", "Jahre", "Jahrzehnte"],
                lengths     = ["60","60","24","7","4.35","12","10"];

            var i = 0;
            for(i; difference >= lengths[i]; i++)
                difference /= lengths[i];

            difference = Math.round(difference);

            if(difference == 1)
                periodes[i] = periodes[i].substring(0, periodes[i].length-1);

            return (i != 0) ? "vor " + difference + " " + periodes[i] : "vor wenigen Sekunden";
        }

        /**
         * theming function for out save samples form
         * @returns {HTMLElement}
         */
        function getSaveForm() {
            var form  = document.createElement("form"),
                input = document.createElement("input"),
                label = document.createElement("label");

            input.setAttribute("type", "text");
            input.setAttribute("name", "sample-name");
            input.setAttribute("id",   "sample-name");
            input.setAttribute("placeholder", "Sample Name (e.g. Sample 1)");

            label.setAttribute("for", "sample-name");
            label.innerHTML = "Press enter to save";

            form.setAttribute("id", "form-sample-save");
            form.appendChild(input);
            form.appendChild(label);

            form.addEventListener("submit", function(ev){
                ev.preventDefault();
                loadSave.saveSamples(ev.srcElement.firstChild.value);
                overlayContext.hide();
            });

            return form;
        }

        function getAbout() {
          var wrapper   = document.createElement("div"),
              about     = document.createElement("p"),
              header    = document.createElement("h2"),
              links     = document.createElement("ul");

          about.innerHTML     = "This is an experimental Project by Thomas Mayrhofer which was coded as a qualification project during my second term at the university of applied sciences salzburg." +
                                "Although this project currently works in chrome only it shows the possibilities and power of the webaudioAPI in combination with webGL and localStorage. <br>";

          header.innerHTML    = "Links";

          links.innerHTML     = "<li><a href='https://github.com/webpapaya/soundbox'>Github</a></li>" +
                                "<li><a href='http://fh-salzburg.ac.at'>FH Salzburg</a></li>" +
                                "<li><a href='http://thomas.mayrhofer.at'>Personal Website</a></li>" +
                                "<li><a href='http://twitter.com/webpapaya'>Twitter (webpapaya)</a></li>" +
                                "<li><a href='http://modernizr.com'>modernizr</a></li>" +
                                "<li><a href='http://threejs.org'>three.js</a></li>" +
                                "<li><a href='http://requirejs.org'>require.js</a></li>" +
                                "<li><a href='http://fgnass.github.io/spin.js/'>spin.js</a></li>";


           wrapper.appendChild(about);
           wrapper.appendChild(header);
           wrapper.appendChild(links);

           return wrapper;
        }

        function getImpressum() {
            var wrapper     = document.createElement("div"),
                impressum   = document.createElement("p");

            impressum.innerHTML = "Thomas Mayrhofer <br>" +
                                  "Urstein Süd 3 <br>" +
                                  "A-5412 Puch bei Hallein <br><br>" +
                                  "This Project was created durring my studies at FH Salzburg <br>";

            wrapper.appendChild(impressum);
            return wrapper;
        }

        /**
         * enables overlay closing on esc
         */
        document.onkeydown = function(ev) {
            if(ev.which === 27)
                overlayContext.hide();
        };

        return overlayContext;
    };
});



