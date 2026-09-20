import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    try {
      await register(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">FixFlow</div>
        <p className="muted">Create your account</p>
        <h1>Register</h1>
        <form onSubmit={handleSubmit} className="form-stack">
          <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label>Password<input type="password" minLength={6} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
          {error && <div className="error">{error}</div>}
          <button type="submit">Create account</button>
        </form>
        <p className="footer-text">Already registered? <Link to="/">Sign in</Link></p>
      </div>
    </div>
  )
}
