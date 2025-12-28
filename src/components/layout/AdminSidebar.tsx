import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Briefcase, Mail, Star, Settings, Wrench } from 'lucide-react'

export default function AdminSidebar({ isOpen = false, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Projects', href: '/admin/projects', icon: Briefcase },
    { name: 'Inquiries', href: '/admin/inquiries', icon: Mail },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Services', href: '/admin/services', icon: Wrench },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-charcoal-900 text-white flex flex-col transform transition-transform duration-200 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto lg:transform-none`}>
      <div className="p-6 border-b border-charcoal-800 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-wood-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-display font-bold text-xl">ID</span>
          </div>
          <div>
            <div className="font-display font-semibold text-lg">Admin Panel</div>
            <div className="text-xs text-charcoal-400">Vinayak Interior's</div>
          </div>
        </Link>

        {/* Close button on mobile */}
        <button onClick={() => onClose && onClose()} className="lg:hidden p-2 rounded-md bg-charcoal-800">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${active
                  ? 'bg-wood-700 text-white'
                  : 'text-charcoal-300 hover:bg-charcoal-800 hover:text-white'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-charcoal-800">
        <Link
          to="/"
          className="block text-center py-2 px-4 bg-charcoal-800 hover:bg-charcoal-700 rounded-lg text-sm transition-colors"
        >
          View Website
        </Link>
      </div>
    </div>
  )
}
