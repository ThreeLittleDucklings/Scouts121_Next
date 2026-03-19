'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import styles from './SiteTail.module.css'

export default function SiteTail() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        <div className={styles.section}>
          <Image
            src="/img/logo.png"
            alt="Scouts 121 logo"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100px', height: 'auto' }}
          />
          <p>
            Edegemsestraat 115b 2640 Mortsel
            <br />
            groepsleiding@scouts121.be
          </p>
        </div>

        <div className={styles.section}>
          <a href="https://www.facebook.com/scouts121OudeGod/" target="_blank" rel="noopener noreferrer">
            <button className={styles.socialButton}><FaFacebook size={20} /></button>
          </a>
          <a href="https://www.instagram.com/scouts121" target="_blank" rel="noopener noreferrer">
            <button className={styles.socialButton}><FaInstagram size={20} /></button>
          </a>
        </div>

        <div className={styles.section}>
          <Image src="/img/sgv.svg" alt="SGV logo" width={0} height={0} sizes="100vw" style={{ width: '100px', height: 'auto' }} />
        </div>

        <div className={styles.section}>
          <Image src="/img/hopper.svg" alt="Hopper logo" width={0} height={0} sizes="100vw" style={{ width: '80px', height: 'auto' }} />
          <Image src="/img/Vlaanderen.png" alt="Vlaanderen logo" width={0} height={0} sizes="100vw" style={{ width: '80px', height: 'auto' }} />
        </div>

        <div className={styles.section}>
          <Link href="/login" className={styles.loginButton}>
            Login voor leiding
          </Link>
          <p>ontworpen &amp; ontwikkeld door</p>
          <a href="https://github.com/ThreeLittleDucklings" className={styles.link}>
            <p>@ThreeLittleDucklings</p>
          </a>
        </div>

      </div>
    </footer>
  )
}