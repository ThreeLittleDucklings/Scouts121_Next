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
      <h2>Foto opdracht</h2>
      
      <p>Beste kandidaten<br /><br />

Jullie opdracht is simpel, recreeer deze foto voor iedereen in je team. Liefst met zo veel mogelijk op 1 foto. 
<br /><br />Er hoeft niet gefilmd te worden.
<br />Als jullie denken dat jullie de foto hebben kunnen jullie "groenplaats" ingeven voor jullie volgende opdracht. Let op de volgende opdracht is getimed. je ben niet verplicht om hem uit te voeren op een specifieke lokatie <br />
</p>
<img src={gusImage}  style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }} />

    </div>
  );
}