import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { supabase } from '../../lib/supabase'

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadServices()
  }, [])

  function formatPrice(val: any) {
    if (val == null) return ''
    if (typeof val === 'number') return `₹${val.toLocaleString()}`
    if (typeof val === 'string') return val.replace(/\$/g, '₹')
    return String(val)
  }

  async function loadServices() {
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('is_enabled', true)
      .order('display_order')

    if (data) {
      setServices(data)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-wood-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-charcoal-600">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-beige-50 to-white py-16 md:py-24">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mb-6">Our Services</h1>
            <p className="text-xl text-charcoal-600 leading-relaxed">
              Comprehensive Vinayak Interior's and custom carpentry solutions tailored to transform your space
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-white">
        <Container>
          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-charcoal-600">No services available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    {service.image_url ? (
                      <img
                        src={service.image_url}
                        alt={service.title}
                        className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-64 md:h-96 bg-beige-200 rounded-2xl shadow-lg flex items-center justify-center">
                        <span className="text-charcoal-400">No image</span>
                      </div>
                    )}
                  </div>

                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="text-sm font-semibold text-wood-700 mb-2 uppercase tracking-wide">
                      {service.category}
                    </div>
                    <h2 className="text-3xl md:text-4xl mb-4">{service.title}</h2>
                    <p className="text-lg text-charcoal-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {service.process_steps && Array.isArray(service.process_steps) && service.process_steps.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-4">Our Process</h3>
                        <ul className="space-y-3">
                          {service.process_steps.map((step: string, idx: number) => (
                            <li key={idx} className="flex items-start space-x-3">
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                              <span className="text-charcoal-700">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {service.starting_price && (
                      <Card className="bg-beige-50 mb-6">
                        <div className="text-sm text-charcoal-600 mb-1">Starting from</div>
                        <div className="text-2xl font-display font-bold text-wood-700">
                          {service.starting_price}
                        </div>
                      </Card>
                    )}

                    <Link to="/get-quote">
                      <Button size="lg">Request This Service</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="py-16 bg-beige-50">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-charcoal-600 mb-8">
              Contact us today for a free consultation and let us help bring your vision to life
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/get-quote">
                <Button size="lg">Get a Free Quote</Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">Contact Us</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
