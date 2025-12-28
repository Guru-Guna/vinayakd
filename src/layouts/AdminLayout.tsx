import { Outlet, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import AdminSidebar from '../components/layout/AdminSidebar'
import AdminHeader from '../components/layout/AdminHeader'

export default function AdminLayout() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    checkAuth()

    // set initial sidebar state based on viewport
    if (typeof window !== 'undefined') {
      setIsSidebarOpen(window.innerWidth >= 1024)
    }

    const onResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(true)
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  async function checkAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      const { data: adminRole } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (adminRole) {
        setIsAuthenticated(true)
        setIsAdmin(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-wood-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-charcoal-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen bg-charcoal-50 flex">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen((s) => !s)} />
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
