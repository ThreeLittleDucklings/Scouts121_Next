import { useState, useEffect } from "react";

export default function PainterComponent({ painter, location, image }) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds



  return (
    <div style={{ border: "2px solid white", padding: "20px", marginTop: "20px", textAlign: "center" }}>
      
      
      <p>Beste kandidaten<br /><br />

Jullie bevinden zich momenteel aan het Anton van Dyck standbeeld. Maar voor jullie aan jullie eerste opdracht beginnen zullen jullie zich moeten verplaatsen naar de eerste lokatie. tip: Al heeft deze schilder dezelfde naam, is het toch niet de woonplaats van één van jullie leiding...
Als jullie denken op de juiste lokatie te zijn dan kunnen jullie "4ntw3rp3n" ingeven om jullie opdracht te krijgen. maar let op de opdrachten zijn getimed, dus geef de code enkel in als jullie klaar zijn om te beginnen.

</p>
  
    </div>
  );
}