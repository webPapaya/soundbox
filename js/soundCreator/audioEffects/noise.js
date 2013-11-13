/**
 * noise.js
 *
 * university:  University of Applied Sciences Salzburg
 * studie:      MultiMediaTechnology
 * fhs-nummer:  fhs34784
 * usage:	    Basisquaifikation 1 (QPT1)
 * author:      Thomas Mayrhofer (thomas@mayrhofer.at)
 *
 * creates some noise
 * EFX Linedown:
 * AudioSource -> Gain -> Output
 */

define(function () {
    noise = function (audio) {
        var that = this;
        this.audio = audio;
        this.buffer = this.createSample();

        this.bufferSource = this.createSample();
    };

    /**
     * creates some audio noise
     *
     * @return - audioBuffer object containing all buffer information
     */
    noise.prototype.createSample = function () {
        var sampleLength = 2 * this.audio.ctx.sampleRate;
        noiseBuffer = this.audio.ctx.createBuffer(1, sampleLength, this.audio.ctx.sampleRate);
        noiseBuffer.loop = true;
        var bufferData = noiseBuffer.getChannelData(0);

        //create some noise
        for (var i = 0; i < sampleLength; i++)
            bufferData[i] = (2 * Math.random() - 1);


        //create audio nodes for our effect
        var gainNode = this.audio.ctx.createGainNode();
        gainNode.gain.value = 0.1;

        var audioSource = this.audio.ctx.createBufferSource();
        audioSource.buffer = noiseBuffer;


        //connect inputs
        audioSource.connect(gainNode);
        gainNode.connect(this.audio.ctx.destination);

        return audioSource.buffer;
    };
});
