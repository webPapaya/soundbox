/**
 * audioVisuals.js
 *
 * university:  University of Applied Sciences Salzburg
 * studie:      MultiMediaTechnology
 * fhs-nummer:  fhs34784
 * usage:	    Basisquaifikation 1 (QPT1)
 * author:      Thomas Mayrhofer (thomas@mayrhofer.at)
 *
 * data visualisation for our sounds
 * creates random "starfield" where frequencies are displayed
 */

define(function () {
    audioVisuals = function (canvas, audio) {
        var body = document.getElementsByTagName("body")[0];
        var wrp = document.createElement("div");
        wrp.setAttribute("id", "3dContext");
        wrp.setAttribute("class", "visual");
        body.insertBefore(wrp, body.firstChild);

        this.baseClass = canvas.baseClass;

        //set constants
        this.VIEW_ANGLE = 45;
        this.ASPECT = 1;
        this.NEAR = 100;
        this.FAR = 100000;

        this.PARTICLECOUNT = 10240;
        this.PARTICLEMULTIPLICATOR = 10;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(new THREE.Color(0, 1));
        this.resize(window.innerWidth, window.innerHeight);
        wrp.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(
            this.VIEW_ANGLE,
            this.ASPECT,
            this.NEAR,
            this.FAR
        );

        this.camera.position.z = 3000;
        this.camera.position.y = -(window.innerHeight / 2);

        this.scene = new THREE.Scene();
        this.scene.add(this.camera);

        //audio
        this.audio = audio;
        this.analyser = this.audio.analyser;
        this.analyserData = new Uint8Array(this.analyser.frequencyBinCount);

        this.createParticles();
        this.update();
    };


    audioVisuals.prototype.createParticles = function () {
        this.colors = [];
        this.particles = new THREE.Geometry();


        //setup particle color
        for (var i = 0; i < this.PARTICLECOUNT; i++) {
            var grey = Math.random();
            this.colors[i] = new THREE.Color();
            this.colors[i].setRGB(grey, grey, grey);
        }

        //add randomly generated colors to particles
        this.particles.colors = this.colors;

        this.particleMaterial = new THREE.ParticleBasicMaterial({
            size: 10,
            blending: THREE.NormalBlending,
            transparent: true,
            vertexColors: true
        });
        this.particleMaterial.color.setHSL(1.0, 1.0, 0.6);

        for (var i = 0; i < this.PARTICLECOUNT; i++) {
            var py = Math.random() * window.innerHeight - (window.innerHeight),
                px = Math.random() * window.innerWidth - (window.innerWidth / 2),
                pz = Math.random() * window.innerWidth,
                particle = new THREE.Vector3(px, py, pz);

            particle.sinInt = 0;
            particle.cosInt = 0;
            particle.speed = {
                x: ((Math.random()) / 10),
                y: ((Math.random()) / 10),
                z: ((Math.random()) / 10)
            };

            this.particles.vertices.push(particle);
        }

        this.particleSystem = new THREE.ParticleSystem(this.particles, this.particleMaterial);
        this.scene.add(this.particleSystem);
    };


    audioVisuals.prototype.update = function () {

        //should be changed because animation frame is running when app is paused
        if(this.baseClass.run) {
            var mouseX = this.baseClass.mouseX,
                mouseY = this.baseClass.mouseY;

            this.analyser.getByteFrequencyData(this.analyserData);

            var colorTime = (Date.now() / 10000) % 1,
                mouseXRelPos = mouseX / window.innerWidth,
                mouseYRelPos = mouseY / window.innerHeight,
                mouseSin = (Math.sin(mouseXRelPos * Math.PI)),
                pCount = this.PARTICLECOUNT,
                mousePow3 = Math.pow(mouseYRelPos - 0.5, 3) * -1;

            this.camera.position.z = 2500 + 500 * mouseSin;
            this.camera.rotation.x = mousePow3;

            while (pCount--) {
                var particle = this.particles.vertices[pCount],
                    sinTranslation = Math.sin(particle.sinInt += particle.speed.x),
                    cosTranslation = Math.cos(particle.cosInt += particle.speed.y);

                var currAnalyserData = this.analyserData[pCount % 200]; //calculates current speed multiplicator from analyserData
                currAnalyserData /= 255 * 2 + 0.5;

                particle.x += sinTranslation * currAnalyserData * this.PARTICLEMULTIPLICATOR;
                particle.y += cosTranslation * currAnalyserData * this.PARTICLEMULTIPLICATOR;
                particle.z += cosTranslation * currAnalyserData * this.PARTICLEMULTIPLICATOR;
            }

            this.particleMaterial.color.setHSL(colorTime, 1.0, 0.6);  //change base color of out particle system

            this.particleSystem.geometry.__dirtyVertices = true;
            this.particleSystem.geometry.verticesNeedUpdate = true;
            this.particleSystem.geometry.__dirtyColors = true;

            this.renderer.render(this.scene, this.camera); // render scene
        }
        window.requestAnimationFrame(this.update.bind(this));
    };

    audioVisuals.prototype.resize = function(_width, _height) {
        this.renderer.setSize(_width, _height);
    };

    console.log("audioVisuals.js - loaded");
});
