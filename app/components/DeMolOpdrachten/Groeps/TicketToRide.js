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

Jullie hebben tien minuten de tijd om uit te zoeken hoeveel een ticket naar amsterdam kost. Jullie mogen geen electronica gebruiken. Jullie mogen wel hulp vragen aananderen maar ook zij mogen dit niet met een gsm opzoeken. Heel deze opdracht moet gefilmd worden.
<br /><br />Als jullie hiermee klaar zijn kunnen jullie door naar de laatse opdracht. lokatie tip: 🦁🐯🐘🦒🦓🦛🐆🦍🐅🐊🐒🦜🦚🦩🦔🐿️🦘🐍🐢🦡🐧🐻🐼🦝🐗🐫🐪🦙🐨🦦🐦🐺. volgende code: "geheugen"
</p>

<h3 style={{ color: "red", marginTop: "10px" }}>Time Left: {formatTime(timeLeft)}</h3>
    </div>
  );
}