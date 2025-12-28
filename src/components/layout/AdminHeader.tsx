import { LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useState, useEffect } from 'react'

export default function AdminHeader({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const navigate = useNavigate()
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user.email) {
      setUserEmail(session.user.email)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-charcoal-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onToggleSidebar && onToggleSidebar()}
            className="lg:hidden p-2 mr-2 bg-charcoal-100 rounded-md"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6 text-charcoal-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div>
            <h1 className="text-2xl font-display font-semibold text-charcoal-900">
              Admin Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <User className="w-5 h-5 text-charcoal-600" />
            <span className="text-charcoal-700">{userEmail}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-charcoal-100 hover:bg-charcoal-200 rounded-lg text-sm font-medium text-charcoal-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
