import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Star } from 'lucide-react'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { supabase } from '../../lib/supabase'

export default function HomePage() {
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [services, setServices] = useState<any[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  function formatPrice(val: any) {
    if (val == null) return ''
    if (typeof val === 'number') return `₹${val.toLocaleString()}`
    if (typeof val === 'string') return val.replace(/\$/g, '₹')
    return String(val)
  }

  async function loadData() {
    const [settingsRes, servicesRes, projectsRes, reviewsRes] = await Promise.all([
      supabase.from('website_settings').select('key, value'),
      supabase.from('services').select('*').eq('is_enabled', true).order('display_order').limit(3),
      supabase.from('projects').select('*').eq('is_published', true).eq('featured', true).order('display_order').limit(3),
      supabase.from('reviews').select('*').eq('is_approved', true).eq('is_featured', true).order('created_at', { ascending: false }).limit(3)
    ])

    if (settingsRes.data) {
      const settingsMap = settingsRes.data.reduce((acc, item) => {
        acc[item.key] = item.value
        return acc
      }, {} as Record<string, any>)
      setSettings(settingsMap)
    }

    if (servicesRes.data) setServices(servicesRes.data)
    if (projectsRes.data) setFeaturedProjects(projectsRes.data)
    if (reviewsRes.data) setReviews(reviewsRes.data)

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-wood-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-charcoal-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="relative bg-gradient-to-br from-beige-50 to-white py-20 md:py-32">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-balance mb-6">
                {settings.hero_title || "Vinayak Interior's & Custom Carpentry Solutions"}
              </h1>
              <p className="text-xl text-charcoal-600 mb-8 leading-relaxed">
                {settings.hero_subtitle || 'Transform your space with expert craftsmanship and timeless design'}
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link to="/get-quote">
                  <Button size="lg">Get a Quote</Button>
                </Link>
                <Link to="/portfolio">
                  <Button size="lg" variant="outline">View Our Works</Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-wood-700">
                    {settings.years_experience || 15}+
                  </div>
                  <div className="text-sm text-charcoal-600 mt-1">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-wood-700">
                    {settings.completed_projects || 250}+
                  </div>
                  <div className="text-sm text-charcoal-600 mt-1">Projects Done</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-wood-700">
                    {settings.happy_clients || 180}+
                  </div>
                  <div className="text-sm text-charcoal-600 mt-1">Happy Clients</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Vinayak Interior's"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <div className="font-semibold text-charcoal-900">Premium Quality</div>
                    <div className="text-sm text-charcoal-600">Guaranteed Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="mb-4">Our Services</h2>
            <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
              We offer comprehensive Vinayak Interior's and carpentry solutions tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} hover className="flex flex-col">
                {service.image_url && (
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-48 object-cover rounded-t-lg -m-6 mb-4"
                  />
                )}
                <h3 className="text-xl mb-3">{service.title}</h3>
                <p className="text-charcoal-600 mb-4 flex-1">{service.description}</p>
                {service.starting_price && (
                  <div className="text-wood-700 font-semibold mb-4">
                    Starting from {formatPrice(service.starting_price)}
                  </div>
                )}
                <Link to="/services">
                  <Button variant="ghost" className="w-full">
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="outline" size="lg">View All Services</Button>
            </Link>
          </div>
        </Container>
      </section>

      {featuredProjects.length > 0 && (
        <section className="py-20 bg-beige-50">
          <Container>
            <div className="text-center mb-12">
              <h2 className="mb-4">Featured Projects</h2>
              <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
                Explore our latest completed works showcasing exceptional craftsmanship
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => {
                const images = project.images || []
                const firstImage = images[0]

                return (
                  <Card key={project.id} hover padding="none" className="overflow-hidden">
                    {firstImage && (
                      <img
                        src={firstImage}
                        alt={project.title}
                        className="w-full h-64 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="text-sm text-wood-700 font-medium mb-2">
                        {project.category}
                      </div>
                      <h3 className="text-xl mb-2">{project.title}</h3>
                      <p className="text-charcoal-600 text-sm">{project.description}</p>
                    </div>
                  </Card>
                )
              })}
            </div>

            <div className="text-center mt-12">
              <Link to="/portfolio">
                <Button variant="primary" size="lg">View All Projects</Button>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="py-20 bg-white">
          <Container>
            <div className="text-center mb-12">
              <h2 className="mb-4">What Our Clients Say</h2>
              <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
                Real experiences from satisfied customers
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <Card key={review.id} className="flex flex-col">
                  <div className="flex items-center space-x-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-charcoal-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-charcoal-700 mb-4 flex-1 italic">"{review.review_text}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-wood-200 rounded-full flex items-center justify-center">
                      <span className="text-wood-800 font-semibold">
                        {review.customer_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-charcoal-900">{review.customer_name}</div>
                      {review.project_title && (
                        <div className="text-sm text-charcoal-600">{review.project_title}</div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/reviews">
                <Button variant="outline" size="lg">View All Reviews</Button>
              </Link>
            </div>
          </Container>
        </section>
      )}

      <section className="py-20 bg-gradient-to-br from-wood-700 to-wood-900 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="mb-6 text-white">Ready to Transform Your Space?</h2>
            <p className="text-xl text-wood-100 mb-8">
              Get started with a free consultation and quote. Let's bring your vision to life.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/get-quote">
                <Button size="lg" variant="secondary">Get a Free Quote</Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-wood-900">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
