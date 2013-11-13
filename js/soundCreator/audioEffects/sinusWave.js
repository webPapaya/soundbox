/**
 * sinusWave.js
 *
 * university:  University of Applied Sciences Salzburg
 * studie:      MultiMediaTechnology
 * fhs-nummer:  fhs34784
 * usage:	    Basisquaifikation 1 (QPT1)
 * author:      Thomas Mayrhofer (thomas@mayrhofer.at)
 *
 * creates an simple sinus sample
 * EFX Linedown:
 * AudioSource -> Delay -> Gain -> Delay -> output
 */

define(function () {
    sinusWave = function (_ctx) {
        this.sampleLength = _ctx.sampleRate / 4; //0.25 sec
        this.sampleRate = _ctx.sampleRate;
        this.audioContext = _ctx;

        //create gain node
        this.gainNode = this.audioContext.createGainNode();
        this.gainNode.gain.value = 0.5;

        //create delay node
        this.delayNode = this.audioContext.createDelayNode();
        this.delayNode.delayTime.value = 0.15;
        this.compressor = this.audioContext.createDynamicsCompressor();
        this.sampleFrequencies = [];

        //setup frequencies
        this.notes = {
            'b5': 987.77,
            'a5': 880.00,
            'g5': 783.99,
            'f5': 698.46,
            'e5': 659.26,
            'd5': 587.33,
            'c5': 523.25,

            'b4': 493.88,
            'a4': 440.00,
            'g4': 392.00,
            'f4': 349.23,
            'e4': 329.63,
            'd4': 293.66,
            'c4': 261.63,

            'b3': 246.94,
            'a3': 220.00,
            'g3': 196.00,
            'f3': 174.61,
            'e3': 164.81,
            'd3': 146.83,
            'c3': 130.81
        };

        var i = 0;
        for(var t = 1; t <= 1; t++)
            for(var note in this.notes) {
                this.sampleFrequencies[i] = {};
                this.sampleFrequencies[i].frequency = this.notes[note] * t;
                this.sampleFrequencies[i].buffer = this.audioContext.createBuffer(1, this.sampleLength, this.sampleRate);
                this.sampleFrequencies[i].bufferData = this.sampleFrequencies[i].buffer.getChannelData(0);
                this.createSample(this.sampleFrequencies[i].frequency, i);
                i++;
            }
    };

    /**
     * creates an audio sample
     * - creates buffer data
     * - adds fade in and out to sample
     */
    sinusWave.prototype.createSample = function (_frequency, _sampleNr) {
        var fadeSpeed = 10; //in procentage 10 means 10% of samples fade in and 10% fade out (max 50)
        var bufferData = this.sampleFrequencies[_sampleNr].bufferData;

        //create oscillator data formel sin(x + 2*x)
        for (var i = 0; i < this.sampleLength; i++) {
            //create coord
            bufferData[i]  = Math.sin((_frequency * 2.0 * Math.PI * i / this.sampleRate));
            bufferData[i] += Math.sin((_frequency * (1/2) * 2.0 * Math.PI * i / this.sampleRate));
            bufferData[i] += Math.sin((_frequency * (1 / 4) * 2.0 * Math.PI * i / this.sampleRate));

            //sounds tend to click if there are big value differences so we just fade them in and out
            if (i <= this.sampleLength * (fadeSpeed / 100))
                bufferData[i] *= i / (this.sampleLength / fadeSpeed);
            else if (i > this.sampleLength * (1 - fadeSpeed / 100))
                bufferData[i] *= (this.sampleLength - i) / (this.sampleLength / fadeSpeed);

            bufferData[i] *= 0.99; //protects clipping

            //special code für hannes =)
            //bufferData[i] *= (i <= this.sampleLength/fadeSpeed) ? (i/(this.sampleLength/fadeSpeed)) : ((this.sampleLength-i)/(this.sampleLength/fadeSpeed));
        }
    };

    /**
     * connects buffer source with source nodes
     * and returns source and buffer which can be played in audio.js
     * @return {node: audioSourceNode; source: audioSource}
     */
    sinusWave.prototype.getSample = function (_sampleNr) {
        var audioSource, gainNode, delayNode, rtnNode, compressor;
        var sampleNr = typeof _sampleNr !== 'undefined' ? _sampleNr : 0;

        //create audio source from oscillator data
        audioSource = this.audioContext.createBufferSource();
        audioSource.buffer = this.sampleFrequencies[sampleNr].buffer;

        audioSource.connect(this.delayNode);
        this.delayNode.connect(this.gainNode);
        this.gainNode.connect(this.delayNode);
        this.delayNode.connect(this.compressor);

        rtnNode = this.compressor;

        return {
            node: rtnNode,
            source: audioSource
        };
    };

    console.log("sinusWave.js - loaded");
});



