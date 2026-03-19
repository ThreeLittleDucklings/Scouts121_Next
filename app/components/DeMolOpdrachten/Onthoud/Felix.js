import { useState, useEffect } from "react";

const animals = [
  { name: "Hendrik Conscience", latin: "1812" },
  { name: "Willy Vandersteen", latin: "1913" },
  { name: "Wannes Van de Velde", latin: "1937" },
  { name: "Paul Jambers", latin: "1945" },
  { name: "Jacques Vermeire ", latin: "1951" },
  { name: "Patrick Janssens", latin: "1956" },
  { name: "Jan Fabre", latin: "1958" },
  { name: "Herman Verbruggen", latin: "1963" },
  { name: "Matthias Schoenaerts", latin: "1977" },
  { name: "Michael van Peel", latin: "1978" }
];

export default function RememberTaskComponent() {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [shuffledAnimals, setShuffledAnimals] = useState([...animals]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          shuffleList();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const shuffleList = () => {
    setShuffledAnimals((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#222", color: "white", borderRadius: "10px", width: "80%", textAlign: "center" }}>
      <h2>Geheugen Opdracht - bekende Antwerpenaren</h2>
      <p>Beste Kandidaten,
      <br /><br />Kies 1 persoon uit jullie groep. deze persoon krijgt 10 minuten de tijd om deze bekende Antwerpenaren en hun geboortedatum van buiten te leren.
      <br />Wanneer de tien minuten om zijn neemt iemand anders de gsm over en drukt hij of zij op de shuffle knop, in deze volgorde vraag je de persoon dan af. Je mag zelf kiezen of je de persoon afvraagt op basis van de namen of de geboorte data.
      <br />Op het afvragen staat geen tijdslimiet, maar er mag slechts 1 fout gemaakt worden. maak je meer fouten, dan is de opdracht mislukt. <br />het afvragen moet gefilmd worden.
      </p>
      <h3 style={{ color: "red" }}>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {shuffledAnimals.map((animal, index) => (
          <li key={index} style={{ padding: "5px 0" }}>
            {animal.name} - <i>{animal.latin}</i>
          </li>
        ))}
      </ul>
      <button onClick={shuffleList} style={{ padding: "10px", backgroundColor: "red", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
        shuffle
      </button>
      <p>Na het afleggen van deze opdracht begeven jullie zich naar 1 van de hoogste gebouwen in de buurt. Tip, dit museum heeft een publiek toegankelik dakterras.
      <br />Wanneer jullie daar zijn kunnen jullie "vandevelde" ingeven voor jullie volgende opdracht. 
      </p>
    </div>
   
  );
}
