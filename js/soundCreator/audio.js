/**
 * audio.js
 *
 * university:  University of Applied Sciences Salzburg
 * studie:      MultiMediaTechnology
 * fhs-nummer:  fhs34784
 * usage:	    Basisquaifikation 1 (QPT1)
 * author:      Thomas Mayrhofer (thomas@mayrhofer.at)
 *
 * base class for handeling audio output
 */

// add dependencies
// json - object-name: file 
var audioDependencies = {
//  "bass": "audioEffects/bass",          // keep for later use
// 	"noise": 	 "dev/audioEffects/noise",  // keep for later use
    "sinusWave": "audioEffects/sinusWave"
};

define(dep(audioDependencies), function () {
    audio = function (baseClass) {
        this.baseClass = baseClass;
        this.ctx = new AudioContext();
        this.analyser = this.ctx.createAnalyser();
        this.compressor = this.ctx.createDynamicsCompressor();
        this.gainMaster = this.ctx.createGain();
        this.gainMaster.gain.value = 0.9;

        this.patterns = []; //pattern[0] = mouse coordinate

        //init all sounds
        this.audioElementsToRender = [];
        this.initElementsAvailable();

        //setup timer
        this.bpm = 190;
        this.timer();
    };

    /**
     * inits all elements from audioEFX.js and adds them to
     * audioElementsToRender - which is looped and printed to canvas
     * creates an object from audioDependencies and pushes it to audioElementsToRender
     */
    audio.prototype.initElementsAvailable = function () {
        for (var key in audioDependencies)
            this.audioElementsToRender.push(new window[key](this.ctx));
    };

    /**
     * connects source node to compressor (to prevent clipping)
     * connect source to analyser (for audio visuals)
     * connect compressor to speakers
     * source node -> gainMaster ->  compressor -> analyser -> speaker
     */
    audio.prototype.play = function (_sampleNr) {
        var sample = this.audioElementsToRender[0].getSample(_sampleNr);

        sample.node.connect(this.gainMaster);
        this.gainMaster.connect(this.compressor);
        this.compressor.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);

	sample.source.start(0);
        
    };

    /**
     * main time sync method
     */
    audio.prototype.timer = function () {
        var that = this,
            timeInterval = 1000 / (this.bpm / 60);

        setInterval(function () {
            //should be changed because loop is running when app is paused
            if(that.baseClass.run) {
                var currStart = (that.baseClass.currentRow+1) * that.baseClass.gridSize,
                    currEnd   = currStart + that.baseClass.gridSize;
                for(var i = currStart; i < currEnd; i++) {
                    if(that.baseClass.currentSamples[i])
                        that.play(i%that.baseClass.gridSize);
                }
                //set currentRow
                (that.baseClass.currentRow > (that.baseClass.gridSize-2)) ? that.baseClass.currentRow = 0 : that.baseClass.currentRow++;
            }
        }, (timeInterval));
    };

    /**
     * called by timer
     * splits timer up to quarter notes and plays pattern
     */
    audio.prototype.timerToPattern = function (_interval) {
        var that = this,
            noteCounter = 0,
            samples = this.baseClass.currentSamples;

        for(var key in samples) {
            var sampleNr    = samples[key].positionY,
                patternNr   = samples[key].positionX,
                pattern     = that.patterns[patternNr];
            if (pattern[noteCounter] == 1) that.play(sampleNr);
        }
    };

    console.log("audio.js - loaded");
});

