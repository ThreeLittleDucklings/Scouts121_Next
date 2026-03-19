import { useState, useEffect } from "react";

export default function PainterComponent({ painter, location, image }) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds



  return (
    <div style={{ border: "2px solid white", padding: "20px", marginTop: "20px", textAlign: "center" }}>
      
      
      <p>Beste kandidaten<br /><br />

Jullie bevinden zich nu op de meir. voor jullie eerste opdracht zullen jullie zich eerst noorderlijk moeten verplaatsen.
<br />Naar 1 van de grootste archieven in antwerpen, dit archief bevind zich vlak bij water.
<br />eens jullie op de lokatie denken te zijn kunnen jullie "hetscheldt" ingeven voor jullie eerste opdracht.
</p>
  
    </div>
  );
}