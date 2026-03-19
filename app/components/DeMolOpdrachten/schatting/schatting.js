import { useState, useEffect } from "react";

export default function Buildingcomponent({location, code }) {
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
      <h2>Schattings Opdracht</h2>
      <p>
        Beste kandidaten,
        Als alles goed gegaan is staan jullie nu aan <strong>{location}</strong>. Moest dat niet so zijn, loop. van zodra jullie er zijn kunnen jullie aan de opdracht beginnen. Jullie hebben tot het einde van de timer om uit te zoeken hoe oud dit gebouw is. jullie mogen uiteraard geen electronica gebruiken. je mag er maximaal honderd jaar naast zitten. Stuur jullie gok naar ons via whatsapp
        <br /><br /> {code}
      </p>
      <h3 style={{ color: "red", marginTop: "10px" }}>Time Left: {formatTime(timeLeft)}</h3>
    </div>
  );
}
