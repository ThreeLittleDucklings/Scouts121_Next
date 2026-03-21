'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: number
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (identifier: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => false,
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('strapi_jwt')
    const storedUser = localStorage.getItem('strapi_user')
    const expiry = localStorage.getItem('strapi_jwt_expiry')

    if (expiry && Date.now() > parseInt(expiry)) {
      localStorage.removeItem('strapi_jwt')
      localStorage.removeItem('strapi_user')
      localStorage.removeItem('strapi_jwt_expiry')
      return
    }

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (identifier: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })

      const data = await res.json()
      console.log('Strapi response:', data)

      if (!res.ok) return false

      setToken(data.jwt)
      setUser(data.user)

      localStorage.setItem('strapi_jwt', data.jwt)
      localStorage.setItem('strapi_user', JSON.stringify(data.user))
      localStorage.setItem('strapi_jwt_expiry', String(Date.now() + 60 * 24 * 60 * 60 * 1000))

      return true
    } catch (err) {
      console.log('Login error:', err)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('strapi_jwt')
    localStorage.removeItem('strapi_user')
    localStorage.removeItem('strapi_jwt_expiry')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}