'use client'
import SiteTail from './SiteTail'
import SiteHeader from './SiteHeader'
import { usePathname } from 'next/navigation'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isFullscreen = pathname.startsWith('/jetlag')

  return (
    <>
      {!isFullscreen && <SiteHeader />}
      {children}
      {!isFullscreen && <SiteTail />}
    </>
  )
}