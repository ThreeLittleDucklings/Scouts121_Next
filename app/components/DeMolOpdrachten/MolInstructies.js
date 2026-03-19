import { useState, useEffect } from "react";

export default function PainterComponent({ painter, location, image }) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds



  return (
    <div style={{ border: "2px solid white", padding: "20px", marginTop: "20px", textAlign: "center" }}>
      <h2>De Mollen Opdracht</h2>
      
      <p>Beste Mol,<br /><br />

Jouw rol in dit spel is helder, maar cruciaal: jij bent hier om te saboteren. Terwijl de anderen zich inzetten om zoveel mogelijk opdrachten te voltooien, is het jouw taak om precies dat te voorkomen. Maar je kunt niet zomaar fouten maken—je moet onopvallend te werk gaan.<br />

Elke misstap moet geloofwaardig zijn, elk verlies moet toevallig lijken. Soms is subtiliteit de sleutel; een kleine vertraging, een verkeerde suggestie, een fout die logisch oogt binnen de chaos van het spel. Andere keren moet je durven risico’s nemen, zonder jezelf bloot te geven. Vertrouwen winnen en twijfel zaaien gaan hand in hand.<br />

Hoe langer je onopgemerkt blijft, hoe groter je succes. Gebruik strategie, intuïtie en timing om je missie te volbrengen.<br />

Blijf kalm, blijf scherp en blijf verborgen. Het spel is begonnen. Veel succes, Mol</p>
<h3>Het spel en jouw rol</h3>   
<p>Het spel is simpel, de kandidaten en jij zullen doorheen heel Antwerpen gestuurd worden om opdrachten uit te voeren. deze opdrachten zullen telkens binnen een bepaalde tijds limiet moeten worden uitgevoerd en op de juiste locatie. lukt het hen niet, dan verdien jij en de andere mollen 1 punt. Lukt dit hen we dan krijgen zij een punt. Het doel van het spel zoveel mogelijk punten scoren.
<br />Opdrachten saboteren kan je op 2 verschillende manieren doen. 
<br />1. de meeste locaties waar opdrachten moeten worden uitgevoerd worden niet gewoon gezegt maar er zal een kleine mini game of raadsel zijn waarmee je de locatie moet vinden. Als je de kandidaten kan overtuigen naar een ander punt te gaan is de kans groot dat ze niet meer genoeg tijd hebben om een punt te verdienen 
<br />2. Als je team op de juiste locatie is kan je jezelf een cruciale rol proberen geven in het volbrengen van de opdracht. Zo kan je proberen de opdracht te saboteren door ze fout of slecht uit te voeren.
<br /><br />Nog enkele andere instructies
<br /><br />Als mol ben je ons contact persoon met de groepen kandidaten. Dit wil zeggen dat je  je locatie  met ons zal meten delen zodat wij weten waar de kandidaten zich bevinden. Slaag je hier niet in verlies je als mol 1 punt. Ook moet je als mol toezien op valsspelen. Als je groepje wil valsspelen tijdens een opdracht door bijvoorbeeld de timer niet te volgen en te lang door te doen. Als de kandidaten dit doen is de opdracht ongeldig en krijg jij als mol het punt.
<br />Dit kan je doen door stiekem bewijs materiaal te verzamelen van hun valspelerij of als dit onmogelijk is het simpelweg te noteren in je logboek. Kandidaten hebben dit ook en noteren hierin wie zij verdenken en waarom. Als het team het op het einde van het spel unaniem eens is dat jij de mol bent krijgen zij 1 bonus punt anders krijg jij dit.
<br /><br /> En allerlaatste instructie, de foto opdracht moet je als mol NIET saboteren.
</p>   
    </div>
  );
}