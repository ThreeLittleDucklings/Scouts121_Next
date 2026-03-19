import { useState, useEffect } from "react";
import gusImage from "../../../logos/gus.jpg";
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
      <h2>curse of the cairn</h2>
      
      <p>Beste kandidaten<br /><br />

De opdracht simpel, bouw een cairn (stapel stenen) van minstens 9 stenen hoog binnen de 10 minuten. hopelijk kunnen jullie goed balanseren. jullie hebben tien minuten. film deze opdracht. En leg na de opdracht alles terug waar je het hebt gevonden.
als jullie hier mee klaar zijn mogen jullie ons sturen en naar de opera gaan.
</p><h3 style={{ color: "red", marginTop: "10px" }}>Time Left: {formatTime(timeLeft)}</h3>
<img src={"https://images.unsplash.com/photo-1527173805928-31901391a3df?q=80&w=1286&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}  style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }} />

    </div>
  );
}