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
      <h2>Communicatie opdracht</h2>
      
      <p>Beste kandidaten<br /><br />

Deze opdracht word niet getimed. Een deel van je groep gaat naar het dak van het MAS. Een ander deel blijft beneden. Jullie moeten op voorhand een systeem bedenken om een woord van 5 letters van boven naar beneden te communiceren.
Je mag hiervoor niet je stem of je gsm gebruiken. gebruik lichaamstaal, schrijf in het groot, ... wees creatief. De personen beneden moeten filmen. Als zowel de personen beneden als wij, leg ons jullie systeem achteraf maar uit, het woord kunne raden is de opdracht geslaagt. er mag slechts 1 pogingworden gedaan om te communiceren en te raden.
<br /><br /> Als jullie deze opdracht hebben volbracht volgen jullie de kaai terug richting het centrum tot jullie op jullie volgende lokatie komen. tip: op deze lokatie vind je niet korte wipper maar ...
<br />Als jullie denken dat jullie op de juiste lokatie zijn kunnen jullie "dwayne" ingeven voor jullie volgende opdracht. <br />
      
</p>


    </div>
  );
}