import { useState, useEffect } from "react";

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
    
      
      <p>Beste kandidaten,

      <br /><br />Jullie staan aan de start van een spel dat draait om vertrouwen, strategie en scherpzinnigheid. Samen vormen jullie een team, met één doel: zoveel mogelijk opdrachten volbrengen en punten verdienen voor de pot. Maar binnen jullie groep schuilt een saboteur – de Mol.

<br />Niets is wat het lijkt. Elke fout, elke mislukking, elke onverwachte wending kan het werk van de Mol zijn. Het is aan jullie om niet alleen samen te werken, maar ook voortdurend te observeren, te analyseren en te twijfelen. Wie speelt het spel eerlijk? Wie probeert jullie te misleiden?

<br />Let op de details, wees alert en vertrouw niemand blindelings. Alleen degene die de Mol doorziet, maakt kans om het spel te winnen.

Succes. Het spel is begonnen.</p>
<h3>Het spel en jouw rol</h3>   
<p>
Jij bent een kandidaat. Dat wil zeggen dat jij er in moet slagen opdrachten tot een goed einde te brengen samen met de rest van je team. Jullie zullen op de geheime locatie moeten rondwandelen en opdrachten moeten uitvoeren. Elke odracht is gekoppeld aan een locatie.
<br />Enkel wanneer jullie een opdracht succesvol uitvoeren binnen de tijd en op de juiste locatie krijgen jullie een punt. Lukt het jullie niet dan gaat het punt naar de mol. 
<br />Alle opdrachten zullen voorzien zijn van een timer. Wanneer jullie een opdracht starten zal deze timer beginnen lopen. Als jullie op dat moment nog niet op de juiste locatie zijn hebben jullie nog tijd om jullie te verplaatsen, maar als de timer is afgelopen voor jullie de opdracht hebben afgewerkt gaat het punt naar de mol. Niet proberen valsspelen. De mol zal dit doorgeven en hij/zij krijgt dan het punt voor de opdracht.Ook moeten jullie telkens het uitvoeren van de opdracht filmen tenzij anders aangegeven.
<br />Twee opdrachten waar jullie vanaf nu al mee kunnen beginnen.
<br /><br />1. Ondek jullie geheime locatie voor woensdag 26 maart - als jullie ze dan nog niet gevonden hebben word ze door ons verklapt. Er zijn hints verstopt in de webpagina. Jullie krijgen als groep slechts 1 kans om te gokken in de giverchat, dus wees voorzichtig - als je dit leest als mol, jij mag uiteraard niet de gok doen, maar kan wel andere proberen overtuigen van een fout antwoord.
De gok moet zeer specifiek zijn, seg dus niet "mortsel" maar bijvoorbeeld "edegemsestraat bij de helin". als jullie dit juist hebben krijgen jullie al 1 punt.
<br /><br />2. Jullie kunnen al beginnen zoeken naar wie de mollen zijn. Tijdens het spel krijgen jullie allemaal een logboek mee daarin kunnen jullie jullie gedachten schrijven - een logboek is strikt persoonlijk je mag dit tijdens het spel nooit laten zien wat er in staat. op het einde kunnen jullie een vakje invullen voor jullie finale gok. Als jouw team unaniem op de echte mol stemt krijgen jullie nog 1 punt.
</p>   
    </div>
  );
}