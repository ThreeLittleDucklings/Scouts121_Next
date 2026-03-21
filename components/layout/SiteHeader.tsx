'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './SiteHeader.module.css'
import { useAuth } from '@/components/AuthContext'
const logoscouts121 = '/img/logo.png'
const logosgv = '/img/sgv.svg'
const Trooper = '/img/trooper.png'

const headerImageUrl =
  'https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?q=80&w=2574&auto=format&fit=crop'

export default function SiteHeader() {
  const { user } = useAuth()
  const [isMenuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLElement>(null)

  const handleLinkClick = () => setMenuOpen(false)

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className={styles.header}>
      <Image
        src={headerImageUrl}
        alt="Header Background"
        fill
        priority
        style={{ objectFit: 'cover', zIndex: 0 }}
      />

      <div className={styles.logo}>
        <Image
           src={logoscouts121}
    alt="Scouts 121 logo"
    width={0}
    height={0}
    sizes="(max-width: 600px) 20vh, (max-width: 400px) 15vh, 35vh"
    style={{ width: 'clamp(100px, 60vw, 35vh)', height: 'auto' }}
        />
      </div>

      <div className={styles.logoSgv}>
  <Image
    src={logosgv}
    alt="SGV logo"
    width={0}
    height={0}
    sizes="(max-width: 800px) 10vw, 17vh"
    style={{ width: 'clamp(40px, 10vw, 17vh)', height: 'auto' }}
  />
</div>

      <nav className={styles.navBar} ref={menuRef}>
        <input
          className={styles.input}
          type="checkbox"
          id="menu-toggle"
          checked={isMenuOpen}
          onChange={() => setMenuOpen(!isMenuOpen)}
        />
        <label htmlFor="menu-toggle" className={styles.menuIcon}>
          &#9776;
        </label>
        <ul className={styles.nav}>
          <li><Link href="/" onClick={handleLinkClick}>home</Link></li>
          <li><Link href="/degroep" onClick={handleLinkClick}>de groep</Link></li>
          <li><Link href="/deknoop" onClick={handleLinkClick}>de knoop</Link></li>
          <li><Link href="/takken" onClick={handleLinkClick}>takken & leiding</Link></li>
          <li><Link href="/Inschrijving_Scouts121" onClick={handleLinkClick}>lid worden</Link></li>
          <li><Link href="/verhuur" onClick={handleLinkClick}>verhuur</Link></li>
          <li><Link href="/contact" onClick={handleLinkClick}>contact</Link></li>
          {user && (
  <li><Link href="/calenderleiding" onClick={handleLinkClick}>kalender</Link></li>
)}
          <li>
            <a href="https://www.trooper.be/nl/trooperverenigingen/scouts121/">
              <Image
                src={Trooper}
                alt="Trooper"
                width={40}
                height={60}
                sizes="100vw"
                style={{ maxHeight: '40px', width: 'auto' }}
              />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}