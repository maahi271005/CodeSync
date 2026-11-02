import { useEffect, useRef, useState } from "react";

const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789{}<>/=+*#$";
const FONT_SIZE = 16;
const DURATION_MS = 6000;
const FADE_MS = 600;

// Animated "digital rain" drawn over its parent (which must be position: relative).
// Ends after DURATION_MS, or early on click / any key, then calls onDone.
function MatrixRain({ onDone }) {
  const canvasRef = useRef(null);
  const [isFading, setIsFading] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const finishRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas.parentElement.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;

    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);

    const columns = Math.ceil(width / FONT_SIZE);
    // each column starts at a random height above the top so the rain doesn't arrive as one line
    const drops = Array.from({ length: columns }, () => -Math.random() * (height / FONT_SIZE));
    const speeds = Array.from({ length: columns }, () => 0.35 + Math.random() * 0.65);

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, width, height);

    let frame;
    let finished = false;
    let fadeTimer;

    const draw = () => {
      // translucent black over the previous frame leaves the fading trails
      ctx.fillStyle = "rgba(2, 6, 23, 0.12)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${FONT_SIZE}px monospace`;

      drops.forEach((drop, i) => {
        const x = i * FONT_SIZE;
        const y = drop * FONT_SIZE;
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];

        // bright head, green body
        ctx.fillStyle = "#d1fae5";
        ctx.fillText(char, x, y);
        ctx.fillStyle = "#34d399";
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y - FONT_SIZE);

        drops[i] = y > height && Math.random() > 0.975 ? 0 : drop + speeds[i];
      });

      frame = requestAnimationFrame(draw);
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      setIsFading(true);
      fadeTimer = setTimeout(() => onDoneRef.current(), FADE_MS);
    };

    finishRef.current = finish;
    frame = requestAnimationFrame(draw);
    const endTimer = setTimeout(finish, DURATION_MS);
    window.addEventListener("keydown", finish);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(endTimer);
      clearTimeout(fadeTimer);
      window.removeEventListener("keydown", finish);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onClick={() => finishRef.current?.()}
      className={`absolute inset-0 z-20 w-full h-full cursor-pointer transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      title="Click or press any key to exit"
    />
  );
}

export default MatrixRain;
