import { useState, useEffect } from "react";

const AudioContext = window.AudioContext || window.webkitAudioContext;

const useAudioContext = () => {
  const [audioCtx] = useState(new AudioContext());
  const [gain] = useState(audioCtx.createGain());
  const [oscillator] = useState(audioCtx.createOscillator());
  const [analyser] = useState(audioCtx.createAnalyser());
  const [bufferLength, setBufferLength] = useState();

  useEffect(() => {
    oscillator.type = "triangle";
    //oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz
    oscillator.connect(gain);

    analyser.fftSize = 2048;
    setBufferLength(analyser.frequencyBinCount);

    gain.connect(analyser);
    analyser.connect(audioCtx.destination);
  }, []);

  return { audioCtx, gain, oscillator, analyser, bufferLength };
};

export default useAudioContext;
