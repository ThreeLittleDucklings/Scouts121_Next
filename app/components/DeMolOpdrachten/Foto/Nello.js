import { useState, useEffect } from "react";

export default function PainterComponent({ painter, location, image }) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  return (
    <div style={{ border: "2px solid white", padding: "20px", marginTop: "20px", textAlign: "center" }}>
      <h2>Foto opdracht</h2>
      
      <p>Beste kandidaten<br /><br />

Jullie opdracht is simpel, leg jezelf te slapen naast het beeld en neem een foto. Iedereen behalve de persoon die de foto neemt moet er op staan.
<br /><br />Er hoeft niet gefilmd te worden.
<br /> Als jullie klaar zijn kunnen jullie de volgende opdracht uitvoeren, hiervoor moeten jullie niet op een specifieke lokatie zijn. Type code "start" om aan jullie opdracht te beginnen.
</p>
<h3 style={{ color: "red", marginTop: "10px" }}>Time Left: {formatTime(timeLeft)}</h3>
    </div>
  );
}