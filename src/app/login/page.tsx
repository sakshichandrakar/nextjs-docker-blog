'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      const { token } = await res.json()
      localStorage.setItem('token', token)
      router.push('/admin')
    } else {
      alert('Invalid credentials')
    }
  }

  return (
    <main className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="mb-4 text-center">Admin Login</h2>
              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password + Eye Icon Toggle */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <span className="input-group-text" style={{ cursor: 'pointer' }} onClick={() => setShowPassword(prev => !prev)}>
                      {showPassword ? '👁️‍🗨️' : '👁️'}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
