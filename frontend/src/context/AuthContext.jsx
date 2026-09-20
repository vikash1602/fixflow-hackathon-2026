import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('fixflow_token')
    if (!token) {
      setLoading(false)
      return
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`
    api.get('/api/auth/me')
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem('fixflow_token')
        delete api.defaults.headers.common.Authorization
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const response = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('fixflow_token', response.data.access_token)
    api.defaults.headers.common.Authorization = `Bearer ${response.data.access_token}`
    const me = await api.get('/api/auth/me')
    setUser(me.data)
  }

  async function register(name, email, password) {
    await api.post('/api/auth/register', { name, email, password })
    await login(email, password)
  }

  function logout() {
    localStorage.removeItem('fixflow_token')
    delete api.defaults.headers.common.Authorization
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
