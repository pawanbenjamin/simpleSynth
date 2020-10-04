document.addEventListener(`DOMContentLoaded`, function (event) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  let waveform = `sawtooth`;
  let oct = 0.125;

  const activeOscillators = {};

  let keyboardFrequencyMap = {
    90: 261.625565300598634,
    83: 277.182630976872096,
    88: 293.66476791740756,
    68: 311.12698372208091,
    67: 329.627556912869929,
    86: 349.228231433003884,
    71: 369.994422711634398,
    66: 391.995435981749294,
    72: 415.304697579945138,
    78: 440.0,
    74: 466.163761518089916,
    77: 493.883301256124111,
    81: 523.251130601197269,
    50: 554.365261953744192,
    87: 587.32953583481512,
    51: 622.253967444161821,
    69: 659.255113825739859,
    82: 698.456462866007768,
    53: 739.988845423268797,
    84: 783.990871963498588,
    54: 830.609395159890277,
    89: 880.0,
    55: 932.327523036179832,
    85: 987.766602512248223,
    73: 1046.5,
  };

  gain.connect(filter);
  filter.connect(audioCtx.destination);

  const waveformControl = document.getElementById(`waveform`);
  waveformControl.addEventListener(`change`, function (event) {
    waveform = event.target.value;
  });

  const octaveControl = document.getElementById(`octave`);
  octaveControl.addEventListener(`change`, function (event) {
    console.log(oct);
    oct = Number(event.target.value);
    console.log(oct);
  });

  const gainControl = document.getElementById(`gain`);
  gainControl.addEventListener(`change`, function (event) {
    gain.gain.setValueAtTime(event.target.value, audioCtx.currentTime);
  });

  const drumVolume = document.querySelector;

  const filterTypeControl = document.getElementById(`filterType`);
  filterTypeControl.addEventListener(`change`, function (event) {
    filter.type = event.target.value;
  });

  const filterFrequencyControl = document.getElementById(`filterFrequency`);
  filterFrequencyControl.addEventListener(`change`, function (event) {
    filter.frequency.setValueAtTime(event.target.value, audioCtx.currentTime);
  });

  window.addEventListener(`keydown`, keyDown, false);
  window.addEventListener(`keyup`, keyUp, false);

  function keyDown(event) {
    const audio = document.querySelector(`audio[data-key="${event.keyCode}"]`);
    console.log(audio);
    if (audio === null) {
      console.log("inside");
      const pianoKey = document.getElementById(event.key);
      pianoKey.classList.add("grey");
      const key = event.which.toString();
      if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
        console.log(activeOscillators);
        playNote(key);
      }
    }
    const drumPad = document.getElementById(event.key);
    drumPad.classList.add("grey");
    audio.play();
  }

  function keyUp(event) {
    const key = event.which.toString();
    const pianoKey = document.getElementById(event.key);
    pianoKey.classList.remove("grey");
    if (keyboardFrequencyMap[key] && activeOscillators[key]) {
      activeOscillators[key].stop();
      delete activeOscillators[key];
    }
  }

  //HANDLES CREATION & STORING OF OSCILLATORS
  function playNote(key) {
    const osc = audioCtx.createOscillator();
    osc.frequency.setValueAtTime(
      keyboardFrequencyMap[key] * oct,
      audioCtx.currentTime
    );
    osc.type = waveform;
    activeOscillators[key] = osc;
    activeOscillators[key].connect(gain);
    activeOscillators[key].start();
  }
});
