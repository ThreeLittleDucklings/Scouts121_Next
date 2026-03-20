import '../globals.css'
import ApolloWrapper from '@/components/ApolloWrapper'
import MainLayout from '@/components/layout/MainLayout'

export const metadata = {
  title: 'Scouts 121 Oude-God Mortsel',
  description: 'Wat staat er allemaal te gebeuren deze maand?...',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <ApolloWrapper>
          <MainLayout>
            {children}
          </MainLayout>
        </ApolloWrapper>
      </body>
    </html>
  )
}