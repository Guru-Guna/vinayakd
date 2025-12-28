import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { supabase } from '../../lib/supabase'

export default function AdminSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    hero_title: '',
    hero_subtitle: '',
    company_phone: '',
    company_email: '',
    company_address: '',
    company_whatsapp: '',
    business_hours: '',
    years_experience: '',
    completed_projects: '',
    happy_clients: '',
    google_maps_url: '',
    facebook_url: '',
    instagram_url: '',
    linkedin_url: '',
  })

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    const { data } = await supabase
      .from('website_settings')
      .select('key, value')

    if (data) {
      const settingsMap = data.reduce((acc, item) => {
        acc[item.key] = typeof item.value === 'string' ? item.value : JSON.stringify(item.value).replace(/^"|"$/g, '')
        return acc
      }, {} as Record<string, string>)

      setSettings(prev => ({ ...prev, ...settingsMap }))
    }

    setLoading(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value: JSON.stringify(value)
      }))

      for (const update of updates) {
        const { error } = await supabase
          .from('website_settings')
          .upsert(update, { onConflict: 'key' })

        if (error) throw error
      }

      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-display font-semibold text-charcoal-900">Website Settings</h2>
        <p className="text-charcoal-600 mt-1">Manage your website content and information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Hero Section</h3>
          <div className="space-y-4">
            <Input
              label="Hero Title"
              name="hero_title"
              value={settings.hero_title}
              onChange={handleChange}
            />
            <Input
              label="Hero Subtitle"
              name="hero_subtitle"
              value={settings.hero_subtitle}
              onChange={handleChange}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              name="company_phone"
              value={settings.company_phone}
              onChange={handleChange}
            />
            <Input
              label="Email Address"
              name="company_email"
              type="email"
              value={settings.company_email}
              onChange={handleChange}
            />
            <Input
              label="WhatsApp Number"
              name="company_whatsapp"
              value={settings.company_whatsapp}
              onChange={handleChange}
            />
            <Input
              label="Business Hours"
              name="business_hours"
              value={settings.business_hours}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <Input
              label="Address"
              name="company_address"
              value={settings.company_address}
              onChange={handleChange}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Statistics</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              label="Years of Experience"
              name="years_experience"
              type="number"
              value={settings.years_experience}
              onChange={handleChange}
            />
            <Input
              label="Completed Projects"
              name="completed_projects"
              type="number"
              value={settings.completed_projects}
              onChange={handleChange}
            />
            <Input
              label="Happy Clients"
              name="happy_clients"
              type="number"
              value={settings.happy_clients}
              onChange={handleChange}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Social Media & Map</h3>
          <div className="space-y-4">
            <Input
              label="Google Maps Embed URL"
              name="google_maps_url"
              value={settings.google_maps_url}
              onChange={handleChange}
              helperText="Copy the embed URL from Google Maps"
            />
            <Input
              label="Facebook URL"
              name="facebook_url"
              value={settings.facebook_url}
              onChange={handleChange}
            />
            <Input
              label="Instagram URL"
              name="instagram_url"
              value={settings.instagram_url}
              onChange={handleChange}
            />
            <Input
              label="LinkedIn URL"
              name="linkedin_url"
              value={settings.linkedin_url}
              onChange={handleChange}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={saving}>
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  )
}
