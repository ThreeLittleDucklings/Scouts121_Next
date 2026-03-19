import { useState, useEffect } from "react";

export default function PainterComponent({ painter, raadsel, loop }) {
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
  console.log("PainterComponent props:", { painter, raadsel, loop });


  return (
    <div style={{ border: "2px solid white", padding: "20px", marginTop: "20px", textAlign: "center" }}>
      <h2>Painting Challenge</h2>
      <p>
       Antwerpen heeft onderdak geboden aan veel bekende schilders. Jullie hebben 10 minuten de tijd om een schilderij van <strong>{painter}</strong> na te maken en naar ons door te sturen samen met het orgineel screenshot. als wij kunnen raden welk schilderij het is krijgen jullie een punt. Let op het mag geen zelf portret zijn.
        <br /><br /> het process moet niet worden gefilmd. Als jullie klaar zijn kunnen jullie je verplaatsen naar jullie volgende opdracht. De lokatie kan je vinden met dit raadseltje van Ruby : {raadsel} Als jullie er denken te zijn kunnen jullie "{loop}" ingeven voor jullie volgende opdracht. <br />
      </p>
      
      <h3 style={{ color: "red", marginTop: "10px" }}>Time Left: {formatTime(timeLeft)}</h3>
    </div>
  );
}
