/**
 * sawWave.js
 * unfinished!!!!!!
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
    sawWave = function (_ctx) {
        this.sampleLength = _ctx.sampleRate / 4; //0.25 sec
        this.sampleRate = _ctx.sampleRate;
        this.audioContext = _ctx;

        this.sampleFrequencies = [];
        this.notes = {
            'a': 110.00,
            'c': 130.81,
            'd': 146.83,
            'e': 164.81,
            'f': 174.61,
            'g': 196.00
        };

        var i = 0;
        for(var t = 1; t <= 3; t++)
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
    sawWave.prototype.createSample = function (_frequency, _sampleNr) {
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

            //clipping protection
            bufferData[i] *= 0.99;

            //für hannes
            //bufferData[i] *= (i <= this.sampleLength/fadeSpeed) ? (i/(this.sampleLength/fadeSpeed)) : ((this.sampleLength-i)/(this.sampleLength/fadeSpeed));
        }
    };

    /**
     * connects buffer source with source nodes
     * and returns source and buffer which can be played in audio.js
     * @return {node: audioSourceNode; source: audioSource}
     */
    sawWave.prototype.getSample = function (_sampleNr) {
        var audioSource, gainNode, delayNode, rtnNode;
        var sampleNr = typeof _sampleNr !== 'undefined' ? _sampleNr : 0;

        //create audio source from oscillator data
        audioSource = this.audioContext.createBufferSource();
        audioSource.buffer = this.sampleFrequencies[sampleNr].buffer;

        //detects clipping (just for debugging)
        for (var i = 0; i < audioSource.buffer.length; i++) {
            var absValue = Math.abs(audioSource.buffer[i]);
            if (absValue >= 1) {
                console.log("clipping");
                break;
            }
        }

        //create gain node
        gainNode = this.audioContext.createGainNode();
        gainNode.gain.value = 0.5;

        //create delay node
        delayNode = this.audioContext.createDelayNode();
        delayNode.delayTime.value = 0.1;

        audioSource.connect(delayNode);
        delayNode.connect(gainNode);
        gainNode.connect(delayNode);

        rtnNode = delayNode;

        return {
            node: rtnNode,
            source: audioSource
        };
    };

    console.log("sinusWave.js - loaded");
});



