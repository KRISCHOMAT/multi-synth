import React, { useCallback, useEffect, useRef, useState } from "react";

const Visualizer = ({
  analyser,
  bufferLength,
  start,
  setStart,
  socket,
  roomId,
  room,
  setLoginvalues,
}) => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  const canvasRef = useRef(null);
  const animationIdRef = useRef();
  const [ctx, setCtx] = useState();

  const handleClick = () => {
    setStart(!start);
    setLoginvalues({ name: "", roomId: "" });
    socket.emit("leaving", roomId);
  };

  useEffect(() => {
    setCtx(canvasRef.current.getContext("2d"));
  }, []);

  const handleResize = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const visual = useCallback(() => {
    animationIdRef.current = requestAnimationFrame(visual);

    const visualDataArray = new Float32Array(bufferLength);
    analyser.getFloatTimeDomainData(visualDataArray);
    ctx.canvas.width = windowSize.width;
    ctx.canvas.height = windowSize.height;

    ctx.lineWidth = 100;
    ctx.strokeStyle = "rgb(200,100,100)";

    ctx.beginPath();

    var sliceWidth = (windowSize.width * 1.0) / bufferLength;
    var x = 0;

    for (var i = 0; i < bufferLength; i++) {
      var v = visualDataArray[i] * windowSize.height;
      var y = windowSize.height / 2 + v;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    ctx.lineTo(ctx.width, ctx.height);
    ctx.stroke();
    cancelAnimationFrame(visual);
  }, [analyser, bufferLength, ctx, windowSize]);

  useEffect(() => {
    if (ctx) {
      visual();
    }
    return () => {
      cancelAnimationFrame(animationIdRef.current);
    };
  }, [ctx, visual, windowSize]);

  return (
    <div className="visualizer App">
      <h1>{room}</h1>
      <canvas ref={canvasRef} className="canvas"></canvas>
      <button className="leave" onClick={handleClick}>
        {"<- Leave"}
      </button>
    </div>
  );
};

export default Visualizer;
