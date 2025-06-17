'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tasks, setTasks] = useState<string[]>([]);
  const [result, setResult] = useState('');
  const [rotation, setRotation] = useState(0);

  const drawWheel = (rotationOffset = 0) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx || tasks.length === 0) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = 200;
    const anglePerTask = (2 * Math.PI) / tasks.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotationOffset);

    tasks.forEach((task, i) => {
      const startAngle = i * anglePerTask;
      const endAngle = startAngle + anglePerTask;

      // Slice
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.fillStyle = `hsl(${(360 * i) / tasks.length}, 70%, 60%)`;
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.stroke();

      // Text
      ctx.save();
      ctx.rotate(startAngle + anglePerTask / 2);
      ctx.translate(100, 0);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(task, -ctx.measureText(task).width / 2, 0);
      ctx.restore();
    });

    ctx.restore();

    // Draw arrow at top
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(cx - 10, 10);
    ctx.lineTo(cx + 10, 10);
    ctx.lineTo(cx, 40);
    ctx.fill();
  };

  useEffect(() => {
    drawWheel(rotation);
  }, [tasks, rotation]);

  const spin = () => {
  if (tasks.length === 0) return;
  const spinSound = new Audio('/spin.mp3');
  spinSound.volume = 0.3;
  spinSound.play();

  const anglePerTask = 360 / tasks.length;
  const extraSpins = 5 + Math.floor(Math.random() * 3); // Between 5 to 7 full spins
  const randomOffset = Math.random() * 360;
  const totalRotation = 360 * extraSpins + randomOffset;

  let start: number | null = null;
  const duration = 4100;

  const animate = (timestamp: number) => {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);

    const currentRotation = (totalRotation * easeOut * Math.PI) / 180;
    setRotation(currentRotation);
    drawWheel(currentRotation);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // ✅ CORRECTED LOGIC
      const finalRotationDeg = totalRotation % 360;
      const angleUnderArrow = (360 - ((finalRotationDeg + 90) % 360)) % 360;
      const index = Math.floor(angleUnderArrow / anglePerTask) % tasks.length;
      setResult(`Go do: ${tasks[index]}`);
    }
  };

  requestAnimationFrame(animate);
};
const clearWheel = () => {
  setTasks([]);
  setResult('');
  setRotation(0);
  const canvas = canvasRef.current;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};


return (
  <main
    style={{
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: '600px',
      margin: 'auto',
    }}
  >
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center', color: 'white' }}>
      🎡 Wheel of Decision
    </h1>

    <div style={{ width: '100%', textAlign: 'center' }}>
      <input
        placeholder="Enter task..."
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
            setTasks([...tasks, e.currentTarget.value.trim()]);
            e.currentTarget.value = '';
          }
        }}
        style={{
          width: '60%',
          minWidth: '150px',
          padding: '0.5rem',
          fontSize: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          marginRight: '0.5rem',
        }}
      />
      <button
        onClick={() => {
          const input = document.querySelector('input');
          if (input && (input as HTMLInputElement).value.trim()) {
            setTasks([...tasks, (input as HTMLInputElement).value.trim()]);
            (input as HTMLInputElement).value = '';
          }
        }}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          borderRadius: '8px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
        }}
      >
        Add
      </button>
    </div>

    <div style={{ marginTop: '0.5rem', textAlign: 'center', color: '#ccc' }}>
      {tasks.map((task, idx) => (
        <span key={idx} style={{ margin: '0 0.25rem', fontSize: '0.9rem' }}>
          #{task}
        </span>
      ))}
    </div>

    <div
      style={{
        marginTop: '2rem',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}
    >

      

      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        onClick={spin} // ✅ New: tap to spin
        style={{
          background: 'black',
          borderRadius: '50%',
          maxWidth: '90vw',
          maxHeight: '90vw',
          cursor: 'pointer', // 🎯 show user it's clickable
        }}
      ></canvas>

    </div>

    {/* <button
      onClick={spin}
      style={{
        marginTop: '2rem',
        padding: '1rem 2rem',
        fontSize: '1.2rem',
        borderRadius: '12px',
        backgroundColor: 'green',
        color: 'white',
        border: 'none',
        width: 'fit-content',
      }}
    >
      Spin 🎯
    </button> */}
        <div
  style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'column',
    marginTop: '2rem',
    gap: '1rem',
    flexWrap: 'wrap',

  }}
>
  {/* <button
    onClick={spin}
    style={{
      padding: '1rem 2rem',
      fontSize: '1.2rem',
      borderRadius: '12px',
      backgroundColor: 'green',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
    }}
  >
    Spin 🎯
  </button> */}
  {tasks.length > 0 && (
    <p
  style={{
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    marginTop: '1rem',
    textShadow: '0 0 10px rgba(255,255,255,0.7)',
    textAlign: 'center',
    animation: 'pulse 1.5s infinite',
  }}
>
 🎯 Tap the Wheel to Spin 🎯
</p>

)}
{result && (
      <div
        style={{
          // marginTop: '0.8rem',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#f0f0f0',
          textAlign: 'center',
        }}
      >
        {result}
      </div>
    )}
{tasks.length > 0 && (
  <button
    onClick={clearWheel}
    style={{
      padding: '0.4rem 0.8rem',
      fontSize: '0.9rem',
      borderRadius: '8px',
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
    }}
  >
    Clear 🗑️
  </button>
)}


</div>

    
  </main>
);

}
