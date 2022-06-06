/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";

const AudioContext = window.AudioContext || window.webkitAudioContext;

const useAudioContext = () => {
  const [audioCtx] = useState(new AudioContext());
  const [gain] = useState(audioCtx.createGain());
  const [oscillator] = useState(audioCtx.createOscillator());
  const [analyser] = useState(audioCtx.createAnalyser());
  const [bufferLength, setBufferLength] = useState(analyser.frequencyBinCount);

  useEffect(() => {
    oscillator.type = "triangle";

    oscillator.connect(gain);

    analyser.fftSize = 256;
    setBufferLength(analyser.frequencyBinCount);

    gain.connect(analyser);
    analyser.connect(audioCtx.destination);
  }, []);

  return { audioCtx, gain, oscillator, analyser, bufferLength };
};

export default useAudioContext;
