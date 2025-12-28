import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import { supabase } from '../../lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const { data: adminRole } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (adminRole) {
        navigate('/admin')
      }
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error('Login failed')
      }

      const { data: adminRole } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', authData.user.id)
        .maybeSingle()

      if (!adminRole) {
        await supabase.auth.signOut()
        throw new Error('You do not have admin access')
      }

      navigate('/admin')
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-wood-900 flex items-center justify-center py-12 px-4">
      <Container size="sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-wood-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-display font-bold text-2xl">ID</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Login</h1>
          <p className="text-charcoal-300">Vinayak Interior's & Custom Carpentry</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={loading}
            >
              <LogIn className="w-5 h-5 mr-2" />
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Card>

        <div className="text-center mt-6">
          <a href="/" className="text-charcoal-300 hover:text-white text-sm transition-colors">
            Back to Website
          </a>
        </div>
      </Container>
    </div>
  )
}
