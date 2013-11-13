/**
 * bass.js
 *
 * university:  University of Applied Sciences Salzburg
 * studie:      MultiMediaTechnology
 * fhs-nummer:  fhs34784
 * usage:	    Basisquaifikation 1 (QPT1)
 * author:      Thomas Mayrhofer (thomas@mayrhofer.at)
 *
 * creates an bass sample
 * EFX Linedown:
 * AudioSource -> Delay -> Gain -> Delay -> output
 */

define(function () {
    bass = function (_ctx) {
        this.sampleLength = _ctx.sampleRate / 4; //0.25 sec
        this.sampleRate = _ctx.sampleRate;
        this.audioContext = _ctx;
        this.frequency = 110;
        this.buffer = this.audioContext.createBuffer(1, this.sampleLength, this.sampleRate);
        this.bufferData = this.buffer.getChannelData(0);

        //create sample
        this.createSample();

        /**
         * changes frequency of current object
         * @param _frequency - frequency in hertz
         */
        function pubChangeFrequency(_frequency) {
            this.frequency = _frequency;
            this.createSample();
        }
    };

    /**
     * creates an audio sample
     * - creates buffer data
     */
    bass.prototype.createSample = function () {
        //create oscillator data formel sin(x + 2*x)
        for (var i = 0; i < this.sampleLength; i++)
            this.bufferData[i] = Math.sin((this.frequency * 2.0 * Math.PI * i / this.sampleRate) + (this.frequency * 2.0 * Math.PI * i / this.sampleRate) * 2);
    };

    /**
     * connects buffer source with source nodes
     * and returns source and buffer which can be played in audio.js
     * @return {node: audioSourceNode; source: audioSource}
     */
    bass.prototype.getSample = function () {
        var audioSource, gainNode, delayNode, rtnNode;

        //create audio source from oscillator data
        audioSource = this.audioContext.createBufferSource();
        audioSource.buffer = this.buffer;

        //create gain node
        gainNode = this.audioContext.createGainNode();
        gainNode.gain.value = 0.6;

        //create delay node
        delayNode = this.audioContext.createDelayNode();
        delayNode.delayTime.value = 0.06;

        // connect nodes
        audioSource.connect(delayNode);
        delayNode.connect(gainNode);
        gainNode.connect(delayNode);

        rtnNode = delayNode;

//        delayNode.connect(this.audioContext.destination);
//        audioSource.noteOn(0);

        return {
            node: rtnNode,
            source: audioSource
        };
    };

    console.log("sinusWave.js - loaded");
});



