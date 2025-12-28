import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Container from '../ui/Container'
import Button from '../ui/Button'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Contact', href: '/contact' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <Container>
        <nav className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-wood-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-xl">VI</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-semibold text-xl text-charcoal-900">
                Vinayak Interior's
              </div>
              <div className="text-xs text-charcoal-600">
                & Custom Carpentry
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-wood-700'
                    : 'text-charcoal-600 hover:text-wood-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:block">
            <Link to="/get-quote">
              <Button size="sm">Get a Quote</Button>
            </Link>
          </div>

          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-charcoal-700" />
            ) : (
              <Menu className="h-6 w-6 text-charcoal-700" />
            )}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-charcoal-200">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium ${
                    isActive(item.href)
                      ? 'text-wood-700'
                      : 'text-charcoal-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/get-quote" onClick={() => setMobileMenuOpen(false)}>
                <Button fullWidth>Get a Quote</Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}
