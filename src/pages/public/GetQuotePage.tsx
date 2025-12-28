import { useState, useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Select from '../../components/ui/Select'
import Card from '../../components/ui/Card'
import { supabase } from '../../lib/supabase'

export default function GetQuotePage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    service_type: '',
    budget_range: '',
    location: '',
    preferred_contact: 'Email',
    message: '',
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  function validate() {
    const newErrors: Record<string, string> = {}

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    }

    if (!formData.service_type) {
      newErrors.service_type = 'Please select a service'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
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
        .from('inquiries')
        .insert([{
          ...formData,
          status: 'New'
        }])

      if (error) throw error

      setSubmitted(true)
      setFormData({
        customer_name: '',
        email: '',
        phone: '',
        service_type: '',
        budget_range: '',
        location: '',
        preferred_contact: 'Email',
        message: '',
      })
    } catch (error) {
      console.error('Error submitting inquiry:', error)
      alert('Failed to submit inquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const budgetOptions = [
    { value: '', label: 'Select Budget Range' },
    { value: 'Under ₹5,000', label: 'Under ₹5,000' },
    { value: '₹5,000 - ₹10,000', label: '₹5,000 - ₹10,000' },
    { value: '₹10,000 - ₹25,000', label: '₹10,000 - ₹25,000' },
    { value: '₹25,000 - ₹50,000', label: '₹25,000 - ₹50,000' },
    { value: '₹50,000+', label: '₹50,000+' },
    { value: 'Not Sure', label: 'Not Sure' },
  ]

  const serviceOptions = [
    { value: '', label: 'Select a Service' },
    ...services.map(s => ({ value: s.title, label: s.title }))
  ]

  const contactOptions = [
    { value: 'Email', label: 'Email' },
    { value: 'Phone', label: 'Phone' },
    { value: 'WhatsApp', label: 'WhatsApp' },
  ]

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-beige-50 to-white py-16">
        <Container size="md">
          <Card className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl mb-4">Thank You!</h2>
            <p className="text-lg text-charcoal-600 mb-8">
              Your inquiry has been received. We'll get back to you within 24 hours.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setSubmitted(false)}>Submit Another Inquiry</Button>
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
            <h1 className="mb-6">Get a Free Quote</h1>
            <p className="text-xl text-charcoal-600 leading-relaxed">
              Fill out the form below and we'll get back to you with a detailed quote within 24 hours
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-white">
        <Container size="md">
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  error={errors.customer_name}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  required
                />

                <Select
                  label="Service Type"
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleChange}
                  options={serviceOptions}
                  error={errors.service_type}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Select
                  label="Budget Range"
                  name="budget_range"
                  value={formData.budget_range}
                  onChange={handleChange}
                  options={budgetOptions}
                />

                <Select
                  label="Preferred Contact Method"
                  name="preferred_contact"
                  value={formData.preferred_contact}
                  onChange={handleChange}
                  options={contactOptions}
                />
              </div>

              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
                helperText="City, State or Full Address"
                required
              />

              <Textarea
                label="Project Details"
                name="message"
                value={formData.message}
                onChange={handleChange}
                helperText="Tell us about your project requirements, timeline, and any specific preferences"
                rows={5}
              />

              <div className="bg-beige-50 p-4 rounded-lg">
                <p className="text-sm text-charcoal-700">
                  By submitting this form, you agree to be contacted by our team regarding your inquiry.
                  We respect your privacy and will never share your information with third parties.
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Inquiry'}
              </Button>
            </form>
          </Card>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <div className="text-wood-700 font-display text-2xl font-bold mb-2">24 Hours</div>
              <p className="text-sm text-charcoal-600">Response Time</p>
            </Card>
            <Card className="text-center">
              <div className="text-wood-700 font-display text-2xl font-bold mb-2">Free</div>
              <p className="text-sm text-charcoal-600">No Obligation Quote</p>
            </Card>
            <Card className="text-center">
              <div className="text-wood-700 font-display text-2xl font-bold mb-2">Expert</div>
              <p className="text-sm text-charcoal-600">Consultation</p>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  )
}
