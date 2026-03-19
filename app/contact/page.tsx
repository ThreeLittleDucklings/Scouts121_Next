import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Scouts 121 Oude-God Mortsel',
  description: 'de E-mailadressen en contact info voor scouts 121 Oude-God Mortsel',
}

export default function ContactPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Contacteer ons</h2>
      <div className="textelement">
        <h1>e-mailadressen</h1>
        <h3>groepsleiding</h3>
        <p>groepsleiding@scouts121.be</p>
        <h3>verhuur</h3>
        <p>verhuur@scouts121.be</p>
        <h3>kapoenen</h3>
        <p>kapoenen@scouts121.be</p>
        <h3>welka's</h3>
        <p>welkas@scouts121.be</p>
        <h3>jogi's</h3>
        <p>jogis@scouts121.be</p>
        <h3>givers</h3>
        <p>givers@scouts121.be</p>
        <h3>jins</h3>
        <p>jins@scouts121.be</p>
      </div>
    </div>
  )
}