'use client'

import { useState, useEffect } from 'react'
import AuthGuard from '@/components/AuthGuard'
import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'

const STRAPI_URL = 'https://api.scouts121.be'

// --- Typewriter Hook ---
function useTypewriter(texts: string[], speed = 50, pauseDuration = 2000) {
  const [displayedValues, setDisplayedValues] = useState<string[]>(texts.map(() => ''))
  const [currentField, setCurrentField] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [pausing, setPausing] = useState(false)

  useEffect(() => {
    if (pausing) {
      const timer = setTimeout(() => {
        setDisplayedValues(texts.map(() => ''))
        setCurrentField(0)
        setCurrentChar(0)
        setPausing(false)
      }, pauseDuration)
      return () => clearTimeout(timer)
    }

    if (currentField >= texts.length) {
      setPausing(true)
      return
    }

    const currentText = texts[currentField]

    if (currentChar < currentText.length) {
      const timer = setTimeout(() => {
        setDisplayedValues(prev => {
          const next = [...prev]
          next[currentField] = currentText.slice(0, currentChar + 1)
          return next
        })
        setCurrentChar(c => c + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setCurrentField(f => f + 1)
        setCurrentChar(0)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [currentField, currentChar, pausing, texts, speed, pauseDuration])

  return displayedValues
}

// --- Demo Form Wrapper ---
function DemoSection({ title, description, form, result }: {
  title: string
  description: string
  form: React.ReactNode
  result: React.ReactNode
}) {
  return (
    <div className={styles.demoSection}>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className={styles.demoGrid}>
        <div className={styles.demoForm}>
          <h3>Formulier</h3>
          {form}
        </div>
        <div className={styles.demoResult}>
          <h3>Resultaat</h3>
          {result}
        </div>
      </div>
    </div>
  )
}

// --- Knoop Demo ---
function KnoopDemo() {
  const fields = ['2026-04-06', 'Bosspel in het park, daarna knutselen met takken en bladeren']
  const values = useTypewriter(fields, 40, 3000)

  return (
    <DemoSection
      title="De Knoop — vergadering toevoegen"
      description="Ga naar De Knoop, selecteer je tak en klik op +. Vul de datum, uren en activiteit in. Als het een weekend of kamp is, vink je dat aan en vul je ook de einddatum in. De knoop toont automatisch alleen vergaderingen van de afgelopen week tot 30 dagen in de toekomst. Oudere items verdwijnen vanzelf."
      form={
        <div className={styles.form}>
          <div className={styles.formRow}>
            <label>Datum</label>
            <input className={styles.input} value={values[0]} readOnly placeholder="2026-04-06" />
          </div>
          <div className={styles.formRow}>
            <label>Start uur</label>
            <div className={styles.timeRow}>
              <select className={styles.select} value="09" disabled onChange={() => {}}>
                <option>09</option>
              </select>
              <span>:</span>
              <select className={styles.select} value="30" disabled onChange={() => {}}>
                <option>30</option>
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <label>Eind uur</label>
            <div className={styles.timeRow}>
              <select className={styles.select} value="12" disabled onChange={() => {}}>
                <option>12</option>
              </select>
              <span>:</span>
              <select className={styles.select} value="00" disabled onChange={() => {}}>
                <option>00</option>
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <label>Activiteit</label>
            <textarea className={styles.textarea} value={values[1]} readOnly rows={3} />
          </div>
          <button className={styles.button}>Opslaan</button>
        </div>
      }
      result={
        <div className={styles.knoopCard}>
          <h2>{values[0] || '06/04/2026'}</h2>
          <h3>9u30 — 12u00</h3>
          <p>{values[1] || 'Bosspel in het park, daarna knutselen met takken en bladeren'}</p>
        </div>
      }
    />
  )
}

// --- Event Demo ---
function EventDemo() {
  const fields = ['Kerstmarkt Scouts 121', '2026-12-20', 'Kom gezellig langs op onze jaarlijkse kerstmarkt! Glühwein, snacks en veel sfeer. Iedereen welkom vanaf 16u.']
  const values = useTypewriter(fields, 35, 3000)

  return (
    <DemoSection
      title="Evenementen — evenement toevoegen"
      description="Op de homepagina zie je als ingelogde leiding een knop '+ Evenementen beheren'. Hier kan je evenementen toevoegen, bewerken en verwijderen. Elk evenement heeft een titel, datum, beschrijving en optioneel een afbeelding. Evenementen verschijnen automatisch in de slider op de homepagina zolang ze in de toekomst liggen."
      form={
        <div className={styles.form}>
          <div className={styles.formRow}>
            <label>Titel</label>
            <input className={styles.input} value={values[0]} readOnly placeholder="Titel van het evenement" />
          </div>
          <div className={styles.formRow}>
            <label>Datum</label>
            <input className={styles.input} value={values[1]} readOnly placeholder="2026-12-20" />
          </div>
          <div className={styles.formRow}>
            <label>Beschrijving</label>
            <textarea className={styles.textarea} value={values[2]} readOnly rows={4} />
          </div>
          <div className={styles.formRow}>
            <label>Afbeelding</label>
            <div className={styles.fotoPreview}>
              <Image
                src='/img.event-voorbeeld.jpg'
                alt="Voorbeeld afbeelding"
                width={200}
                height={120}
                style={{ objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          </div>
          <button className={styles.button}>Opslaan</button>
        </div>
      }
      result={
        <div className={styles.eventCard}>
          <Image
            src={`${STRAPI_URL}/uploads/thumbnail_488500549_1070509438444725_1660344601915978173_n_515df678ad.jpg`}
            alt="Event preview"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
          />
          <div className={styles.eventCardContent}>
            <h3 className="link">{values[0] || 'Kerstmarkt Scouts 121'}</h3>
            <div className={styles.eventCardInfo}>
              <div>
                <p>Dec</p>
                <h3>20</h3>
              </div>
              <p>{values[2] ? values[2].slice(0, 80) + '...' : 'Kom gezellig langs op onze jaarlijkse kerstmarkt...'}</p>
            </div>
          </div>
        </div>
      }
    />
  )
}

// --- Leiding Demo ---
function LeidingDemo() {
  const fields = ['Cas Meganck', 'Onbaatzuchtige Sneeuwstormvogel', 'ThreeLittleDucklings', '5']
  const values = useTypewriter(fields, 45, 3000)

  return (
    <DemoSection
      title="Leiding — leiding bewerken"
      description="Ga naar Takken & Leiding, klik op je tak en klik op '+ Leiding beheren'. Hier kan je leiding toevoegen, bewerken, verwijderen en aan meerdere takken koppelen."
      form={
        <div className={styles.form}>
          <div className={styles.formRow}>
            <label>Naam</label>
            <input className={styles.input} value={values[0]} readOnly />
          </div>
          <div className={styles.formRow}>
            <label>Totem</label>
            <input className={styles.input} value={values[1]} readOnly />
          </div>
          <div className={styles.formRow}>
            <label>Bijnaam</label>
            <input className={styles.input} value={values[2]} readOnly />
          </div>
          <div className={styles.formRow}>
            <label>Jaar leiding</label>
            <input className={styles.input} value={values[3]} readOnly />
          </div>
          <div className={styles.formRow}>
            <label>Foto</label>
            <div className={styles.fotoPreview}>
              <Image
                src= '/img/cas.jpg'
                alt="Cas Meganck"
                width={80}
                height={100}
                style={{ objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          </div>
          <button className={styles.button}>Opslaan</button>
        </div>
      }
      result={
        <div className={styles.leidingCard}>
          <Image
            src={`${STRAPI_URL}/uploads/Whats_App_Image_2024_10_13_at_10_19_55_22120b85_be1a7ce6c6.jpg`}
            alt="Cas Meganck"
            fill
            style={{ objectFit: 'cover' }}
          />
          <p className={styles.leidingTitle}>{values[0] || 'Cas Meganck'}</p>
          <div className={styles.leidingInfo}>
            <h2>{values[0] || 'Cas Meganck'}</h2>
            <p>Bijnaam: {values[2] || 'ThreeLittleDucklings'}</p>
            <p>Totem: {values[1] || 'Onbaatzuchtige Sneeuwstormvogel'}</p>
            <p>{values[3] || '5'}de jaar leiding</p>
          </div>
        </div>
      }
    />
  )
}

// --- Takinfo Demo ---
function TakinfoDemo() {
  const fields = ['Leeftijd: 14 tot 17 jaar\n\nGivers present! De laatste tak waarin je 3 jaar vertoeft en geniet. Kampdata 2026: 15/07 tot 30/07 in de Ardennen.']
  const values = useTypewriter(fields, 20, 3000)

  return (
    <DemoSection
      title="Takinfo — beschrijving bewerken"
      description="Ga naar Takken & Leiding, klik op je tak en klik op '✏️ Beschrijving bewerken'. Pas de tekst aan en klik op opslaan."
      form={
        <div className={styles.form}>
          <div className={styles.formRow}>
            <label>Beschrijving</label>
            <textarea className={styles.textarea} value={values[0]} readOnly rows={8} />
          </div>
          <button className={styles.button}>Opslaan</button>
        </div>
      }
      result={
        <div className={styles.takinfoCard}>
          {values[0]
            ? values[0].split('\n').filter(l => l.trim()).map((line, i) => <p key={i}>{line}</p>)
            : <p>Leeftijd: 14 tot 17 jaar — Givers present!...</p>
          }
        </div>
      }
    />
  )
}

// --- Page ---
export default function HandleidingPage() {
  return (
    <AuthGuard>
      <div className="textelement">
        <h1>Handleiding website</h1>
        <p>Deze pagina legt uit hoe de website werkt, waar alles te vinden is en hoe je aanpassingen kan maken.</p>

       
        <h2>Inloggen</h2>
        <p>Ga naar <Link href="/login" className="orange">scouts121.be/login</Link> en gebruik de google gebruikersnaam en wachtwoord van je tak. Als je ingelogd bent verschijnen er extra knoppen op de website waarmee je inhoud kan bewerken.</p>

        <div className={styles.demos}>
          <KnoopDemo />
          <EventDemo />
          <LeidingDemo />
          <TakinfoDemo />
        </div>

        <h2>Pagina's bewerken via Strapi</h2>
        <p>De tekst op <Link href="/degroep" className="orange">De Groep</Link> en <Link href="/Inschrijving_Scouts121" className="orange">Lid Worden</Link> wordt beheerd via Strapi. Ga naar <a href="https://api.scouts121.be/admin" target="_blank" rel="noopener noreferrer" className="orange">api.scouts121.be/admin</a> → Content Manager → Pages. Klik op de pagina die je wil bewerken en pas de tekst aan in de rich text editor.</p>

        <h2>Verhuur beheren via Strapi</h2>
        <p>Verhuurcategorieën en items worden beheerd via Strapi. Ga naar <a href="https://api.scouts121.be/admin" target="_blank" rel="noopener noreferrer" className="orange">api.scouts121.be/admin</a> → Content Manager → Verhuur of Verhuurcategory.</p>

        <h2>Kalender</h2>
        <p>De <Link href="/calenderleiding" className="orange">leidingskalender</Link> is een Google Calendar embed. Aanpassingen aan de kalender doe je rechtstreeks in Google Calendar. De website toont automatisch de meest recente versie.</p>

        <h2>Deployment</h2>
        <p>De website draait op Netlify. Code wijzigingen worden via GitHub automatisch gedeployed — elke push naar GitHub triggert automatisch een nieuwe build op Netlify.</p>

        <h2>Technische info</h2>
        <ul>
          <li><strong>Frontend:</strong> Next.js, gehost op Netlify via scouts121.be</li>
          <li><strong>Backend:</strong> Strapi v4, gehost op een VPS via api.scouts121.be</li>
          <li><strong>Code:</strong> <a href="https://github.com/ThreeLittleDucklings/Scouts121_Next" target="_blank" rel="noopener noreferrer" className="orange">GitHub — Scouts121_Next</a></li>
          <li><strong>Deployment:</strong> Elke push naar GitHub triggert automatisch een nieuwe build op Netlify</li>
          <li><strong>Database:</strong> PostgreSQL op de VPS</li>
        </ul>

        <h2>Problemen of vragen?</h2>
        <p>Contacteer de webmaster via Meganckcas1@gmail.com.</p>
      </div>
    </AuthGuard>
  )
}