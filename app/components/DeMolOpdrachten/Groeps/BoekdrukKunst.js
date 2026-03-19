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
      <h2>Boekdrukbkunst</h2>
      
      <p>Beste kandidaten<br /><br />

Jullie hebben jullie mischien al afgevraagd waarom jullie drie aardappelen op zak hebben. Dit is natuurlijk omdat jullie naast deze historische drukkerij zelf iets gaan printen. jullie hebben tien minuten de tijd om een woord van 6 letters te drukken met de hulp van het mes de aardappelen en het penseel. 
Belangrijk, enkel het de aardappel gebruiken om de letters te drukken met de inkt. het penseel dient enkel om de aardappelen in te kleuren. als jullie klaar zijn of de tijd om is sturen jullie het blad naar ons door. als we het kunnen lezen krijgen jullie een punt.
<br /><br />Er hoeft niet gefilmd te worden.
<br /> Als jullie klaar zijn kunnen jullie naar de volgende lokatie gaan tip: In dit museum voelen vegetariërs en vegans zich vrij ongemakkelijk... Als jullie daar zijn tik je de volgende code in "vegetariërs".
</p>

<h3 style={{ color: "red", marginTop: "10px" }}>Time Left: {formatTime(timeLeft)}</h3>
    </div>
  );
}