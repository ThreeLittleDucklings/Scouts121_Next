import '../globals.css'
import ApolloWrapper from '@/components/ApolloWrapper'
import MainLayout from '@/components/layout/MainLayout'
import { AuthProvider } from '@/components/AuthContext'

export const metadata = {
  title: {
    default: 'Scouts 121 Oude-God Mortsel',
    template: '%s | Scouts 121 Oude-God Mortsel',
  },
  description: 'Scouts 121 Oude-God Mortsel — Kapoenen, Welkas, Jogis, Givers, Jins',
  keywords: 'scouts, scouts121, Mortsel, Oude-God, kapoenen, welkas, jogis, givers, jins',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <AuthProvider>
          <ApolloWrapper>
            <MainLayout>
              {children}
            </MainLayout>
          </ApolloWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}