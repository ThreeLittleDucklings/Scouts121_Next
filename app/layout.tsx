import '../globals.css'
import ApolloWrapper from '@/components/ApolloWrapper'
import MainLayout from '@/components/layout/MainLayout'
import { AuthProvider } from '@/components/AuthContext'

export const metadata = {
  title: 'Scouts 121',
  description: 'Scouts 121 Oude-God Mortsel',
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