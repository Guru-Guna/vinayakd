import { useEffect, useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Card from '../../components/ui/Card'
import { supabase } from '../../lib/supabase'

export default function ContactPage() {
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
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
          service_type: 'General Inquiry',
          location: 'N/A',
          preferred_contact: 'Email',
          status: 'New'
        }])

      if (error) throw error

      setSubmitted(true)
      setFormData({
        customer_name: '',
        email: '',
        phone: '',
        message: '',
      })

      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      console.error('Error submitting contact form:', error)
      alert('Failed to submit message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-beige-50 to-white py-16 md:py-24">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mb-6">Get in Touch</h1>
            <p className="text-xl text-charcoal-600 leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-white">
        <Container>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-2xl mb-6">Send Us a Message</h2>

                {submitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3 text-green-800">
                    <Send className="w-5 h-5" />
                    <span>Thank you! Your message has been sent successfully.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Your Name"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    error={errors.customer_name}
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

                  <Textarea
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    error={errors.message}
                    helperText="Tell us how we can help you"
                    rows={6}
                    required
                  />

                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-wood-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-wood-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Phone</h3>
                    <p className="text-charcoal-600">
                      {settings.company_phone || '+1234567890'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-wood-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-wood-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-charcoal-600">
                      {settings.company_email || 'info@interiordesign.com'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-wood-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-wood-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Address</h3>
                    <p className="text-charcoal-600">
                      {settings.company_address || 'Vadakkuchathiram, Tenkasi-627757, Tamil Nadu, India'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-wood-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-wood-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Business Hours</h3>
                    <p className="text-charcoal-600">
                      {settings.business_hours || 'Monday - Saturday: 9:00 AM - 6:00 PM'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {settings.google_maps_url && (
        <section className="h-48 md:h-96 bg-charcoal-200">
          <iframe
            src={settings.google_maps_url}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
          />
        </section>
      )}
    </div>
  )
}
