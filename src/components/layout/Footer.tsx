import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin } from 'lucide-react'
import Container from '../ui/Container'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Footer() {
  const [settings, setSettings] = useState<Record<string, any>>({})

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    const { data } = await supabase
      .from('website_settings')
      .select('key, value')

    if (data) {
      const settingsMap = data.reduce((acc, item) => {
        acc[item.key] = item.value
        return acc
      }, {} as Record<string, any>)
      setSettings(settingsMap)
    }
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Get a Quote', href: '/get-quote' },
    { name: 'Register Interest', href: '/register-interest' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <footer className="bg-charcoal-900 text-white">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-wood-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-xl">ID</span>
              </div>
              <div>
                <div className="font-display font-semibold text-lg">
                  Vinayak Interior's
                </div>
                <div className="text-xs text-charcoal-400">
                  & Custom Carpentry
                </div>
              </div>
            </div>
            <p className="text-charcoal-300 text-sm">
              Transform your space with expert craftsmanship and timeless design.
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-charcoal-300 hover:text-white text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              {settings.company_phone && (
                <li className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-wood-500 flex-shrink-0 mt-0.5" />
                  <span className="text-charcoal-300 text-sm">{settings.company_phone}</span>
                </li>
              )}
              {settings.company_email && (
                <li className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-wood-500 flex-shrink-0 mt-0.5" />
                  <span className="text-charcoal-300 text-sm">{settings.company_email}</span>
                </li>
              )}
              {settings.company_address && (
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-wood-500 flex-shrink-0 mt-0.5" />
                  <span className="text-charcoal-300 text-sm">{settings.company_address}</span>
                </li>
              )}
              {settings.business_hours && (
                <li className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-wood-500 flex-shrink-0 mt-0.5" />
                  <span className="text-charcoal-300 text-sm">{settings.business_hours}</span>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-charcoal-800 rounded-lg flex items-center justify-center hover:bg-wood-600 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-charcoal-800 rounded-lg flex items-center justify-center hover:bg-wood-600 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-charcoal-800 rounded-lg flex items-center justify-center hover:bg-wood-600 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-charcoal-800 mt-8 pt-8 text-center">
          <p className="text-charcoal-400 text-sm">
            © {new Date().getFullYear()} Vinayak Interior's & Custom Carpentry. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
