import { useState, useEffect } from "react";
import gusImage from "../../../logos/gus.jpg";
export default function PainterComponent({ painter, location, image }) {
  const [timeLeft, setTimeLeft] = useState(900); // 10 minutes in seconds

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
      <h2>Kunst opdracht</h2>
      
      <p>Beste kandidaten<br /><br />

Jullie opdracht is simpel, jullie hebben 15 minuten de tijd om kunst te maken en dit te proberen verkopen en zo mistens 1 euro te verdienen. De opdracht is geslaagt als jullie binnen de tijd 1 euro hebben verdient. deze hele opdracht moet gefilmd worden inclussief de transactie.  
Als jullie dit gedaan hebben kunnen jullie jullie verplaatsen naar de volgende lokatie, tip: Dit is een prachtig gebouw om aan te komen, al zorgden de stakingen hier deze week voor wat ongemak... en "deNMBSzijnwankers" ingeven voor jullie volgende opdracht. </p>

<h3 style={{ color: "red", marginTop: "10px" }}>Time Left: {formatTime(timeLeft)}</h3>
    </div>
  );
}