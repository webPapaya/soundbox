#Codesmell

##long an complex function

datei js/soundCreator/audioEffects/sinusWave.js

The function sinusWave.prototype.createSample() creates an audio buffer which is then played in the for loop
this function is quite complex and contains long lines of code

- created function createBufferData
- placed calculation in it and returned value
-


##code duplicity
datei js/soundCreator/audioEffects/sinusWave.js

_frequency * 2.0 * Math.PI * _i / this.sampleRate;

this snippet was called 3 times and has now been cached in a variable



