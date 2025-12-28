import { useState, useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Card from '../../components/ui/Card'
import { supabase } from '../../lib/supabase'

export default function InterestPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interested_service: '',
    preferred_timeline: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadServices()
  }, [])

  async function loadServices() {
    const { data } = await supabase
      .from('services')
      .select('title')
      .eq('is_enabled', true)
      .order('display_order')

    if (data) {
      setServices(data)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  function validate() {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    }

    if (!formData.interested_service) {
      newErrors.interested_service = 'Please select a service'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('interest_registrations')
        .insert([formData])

      if (error) throw error

      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        interested_service: '',
        preferred_timeline: '',
      })
    } catch (error) {
      console.error('Error submitting registration:', error)
      alert('Failed to submit registration. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const serviceOptions = [
    { value: '', label: 'Select a Service' },
    ...services.map(s => ({ value: s.title, label: s.title }))
  ]

  const timelineOptions = [
    { value: '', label: 'Select Timeline' },
    { value: '1-3 months', label: 'Within 1-3 months' },
    { value: '3-6 months', label: 'Within 3-6 months' },
    { value: '6-12 months', label: 'Within 6-12 months' },
    { value: '12+ months', label: 'More than 12 months' },
    { value: 'Not sure', label: 'Not sure yet' },
  ]

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-beige-50 to-white py-16">
        <Container size="md">
          <Card className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl mb-4">Thank You for Your Interest!</h2>
            <p className="text-lg text-charcoal-600 mb-8">
              We've received your registration. We'll keep you updated about our services and special offers.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setSubmitted(false)}>Register Another Interest</Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Back to Home
              </Button>
            </div>
          </Card>
        </Container>
      </div>
    )
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-beige-50 to-white py-16 md:py-24">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mb-6">Register Your Interest</h1>
            <p className="text-xl text-charcoal-600 leading-relaxed">
              Planning a future project? Register your interest and we'll keep you informed about our services, offers, and availability
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-white">
        <Container size="md">
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Select
                  label="Interested Service"
                  name="interested_service"
                  value={formData.interested_service}
                  onChange={handleChange}
                  options={serviceOptions}
                  error={errors.interested_service}
                  required
                />

                <Select
                  label="Preferred Timeline"
                  name="preferred_timeline"
                  value={formData.preferred_timeline}
                  onChange={handleChange}
                  options={timelineOptions}
                />
              </div>

              <div className="bg-beige-50 p-4 rounded-lg">
                <p className="text-sm text-charcoal-700">
                  By registering your interest, you'll receive updates about our services, special offers,
                  and availability. We respect your privacy and you can unsubscribe at any time.
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Register Interest'}
              </Button>
            </form>
          </Card>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <div className="text-wood-700 font-display text-2xl font-bold mb-2">Priority</div>
              <p className="text-sm text-charcoal-600">Early Access to Services</p>
            </Card>
            <Card className="text-center">
              <div className="text-wood-700 font-display text-2xl font-bold mb-2">Exclusive</div>
              <p className="text-sm text-charcoal-600">Special Offers & Discounts</p>
            </Card>
            <Card className="text-center">
              <div className="text-wood-700 font-display text-2xl font-bold mb-2">Updates</div>
              <p className="text-sm text-charcoal-600">Latest News & Portfolio</p>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  )
}
