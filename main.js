var amplify = 1;
var offset = 0;
var volume = 0;
var vibeThreshold = 95;

navigator.mediaDevices.getUserMedia({
    audio: true
}).then(function (stream) {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);
    scriptProcessor.onaudioprocess = function () {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        const arraySum = array.reduce((a, value) => a + value, 0);
        const average = arraySum / array.length;

        volume = average;
    };
}).catch(function (err) {
    console.error(err);
});

var h = 0;

function moderatedVolume() {
    return (offset * (volume > offset ? 1 : 0)) + ((volume * volume) / 100 * amplify);
}

setInterval(() => {
    let vol = moderatedVolume();
    
    if (vol > vibeThreshold) {
        h += 10;
        vol = 50;
    } else {
        h++;
    }

    document.getElementById("box").style.backgroundColor = `hsl(${h % 360}, 100%, ${vol}%)`;
});
