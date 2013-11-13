/**
 * loadSave.js
 *
 * university:  University of Applied Sciences Salzburg
 * studie:      MultiMediaTechnology
 * fhs-nummer:  fhs34784
 * usage:	    Basisquaifikation 1 (QPT1)
 * author:      Thomas Mayrhofer (thomas@mayrhofer.at)
 *
 * handles local storage read and write actions
 */


define(function () {
    loadSave = function(soundCreator) {
        function loadSamples() {
            if(!localStorage.soundCreatorStorage) {
                return 0;
            } else {
                return JSON.parse(localStorage.soundCreatorStorage).samples;
            }
        }

        function saveSamples(_name) {

            if(!localStorage.soundCreatorStorage) {
                localStorage.soundCreatorStorage = JSON.stringify({samples: []});
            }

            var storage = JSON.parse(localStorage.soundCreatorStorage);

            storage.samples.push({
                "name":      _name,
                "timestamp": new Date().getTime(),
                "sample":   soundCreator.currentSamples
            });

            localStorage.soundCreatorStorage = JSON.stringify(storage);
        }

        function setSample(_idx) {
            var samples = JSON.parse(localStorage.soundCreatorStorage).samples;
            soundCreator.currentSamples = samples[_idx].sample;
        }

        return {
            loadSamples: loadSamples,
            saveSamples: saveSamples,
            setSample:   setSample
        }
    };
});