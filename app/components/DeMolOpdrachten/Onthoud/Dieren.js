import { useState, useEffect } from "react";

const animals = [
  { name: "Lion", latin: "Panthera leo" },
  { name: "Tiger", latin: "Panthera tigris" },
  { name: "Elephant", latin: "Loxodonta africana" },
  { name: "Giraffe", latin: "Giraffa camelopardalis" },
  { name: "Zebra", latin: "Equus quagga" },
  { name: "Kangaroo", latin: "Macropus rufus" },
  { name: "Panda", latin: "Ailuropoda melanoleuca" },
  { name: "Wolf", latin: "Canis lupus" },
  { name: "Dolphin", latin: "Delphinus delphis" },
  { name: "Eagle", latin: "Aquila chrysaetos" }
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
       <h2>Geheugen Opdracht - Dieren</h2>
      <p>Beste Kandidaten,
      <br /><br />Kies 1 persoon uit jullie groep. deze persoon krijgt 10 minuten de tijd om deze dieren en hun latijnse naam van buiten te leren.
      <br />Wanneer de tien minuten om zijn neemt iemand anders de gsm over en drukt hij of zij op de shuffle knop, in deze volgorde vraag je de persoon dan af. Je mag zelf kiezen of je afvraagt van het Latijn naar het Nederlands of andersom.
      <br />Op het afvragen staat geen tijdslimiet, maar er mag slechts 1 fout gemaakt worden. maak je meer fouten, dan is de opdracht mislukt. <br />het afvragen moet gefilmd worden.
      <br />Als jullie dit gedaan hebben kunnen jullie ons sms'en en naar de eind lokatie gaan, de Opera.
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
        Randomise
      </button>
    </div>
  );
}
