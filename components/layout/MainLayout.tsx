import SiteTail from './SiteTail'
import SiteHeader from './SiteHeader'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteTail />
    </>
  )
}