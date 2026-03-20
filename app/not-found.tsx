import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="textelement">
      <h1>404</h1>
      <h2>Pagina niet gevonden</h2>
      <p>Deze pagina bestaat niet of is verplaatst.</p>
      <Link href="/" className="orange">
        Terug naar home
      </Link>
    </div>
  )
}