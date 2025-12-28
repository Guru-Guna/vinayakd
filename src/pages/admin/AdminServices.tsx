import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import { supabase } from '../../lib/supabase'

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    starting_price: '',
    is_enabled: true,
    display_order: 0,
  })

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
      .order('display_order')

    if (data) setServices(data)
    setLoading(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      if (editingId) {
        const { error } = await supabase
          .from('services')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('services')
          .insert([formData])

        if (error) throw error
      }

      loadServices()
      resetForm()
      alert(editingId ? 'Service updated successfully!' : 'Service created successfully!')
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Failed to save service')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) throw error

      loadServices()
      alert('Service deleted successfully!')
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Failed to delete service')
    }
  }

  async function toggleEnabled(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_enabled: !currentStatus })
        .eq('id', id)

      if (error) throw error
      loadServices()
    } catch (error) {
      console.error('Error toggling service status:', error)
    }
  }

  function startEdit(service: any) {
    setEditingId(service.id)
    setFormData({
      title: service.title,
      description: service.description,
      category: service.category,
      starting_price: service.starting_price || '',
      is_enabled: service.is_enabled,
      display_order: service.display_order,
    })
    setShowForm(true)
  }

  function resetForm() {
    setEditingId(null)
    setFormData({
      title: '',
      description: '',
      category: '',
      starting_price: '',
      is_enabled: true,
      display_order: 0,
    })
    setShowForm(false)
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-display font-semibold text-charcoal-900">Services</h2>
          <p className="text-charcoal-600 mt-1">Manage your service offerings</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Service'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Service' : 'New Service'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Service Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
              <Input
                label="Starting Price"
                name="starting_price"
                value={formData.starting_price}
                onChange={handleChange}
                helperText="e.g., ₹5,000"
              />
            </div>

            <Input
              label="Display Order"
              type="number"
              name="display_order"
              value={formData.display_order}
              onChange={handleChange}
            />

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_enabled"
                checked={formData.is_enabled}
                onChange={handleChange}
                className="w-5 h-5 rounded"
              />
              <span>Enabled (visible on website)</span>
            </label>

            <div className="flex gap-4">
              <Button type="submit">{editingId ? 'Update' : 'Create'} Service</Button>
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <div className="flex items-center space-x-2">
                {service.is_enabled ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-charcoal-400" />
                )}
              </div>
            </div>

            <p className="text-sm text-charcoal-600 mb-4">{service.description}</p>

            <div className="flex items-center justify-between mb-4 text-sm">
              <span className="text-charcoal-500">{service.category}</span>
              {service.starting_price && (
                <span className="text-wood-700 font-semibold">{formatPrice(service.starting_price)}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button size="sm" variant="ghost" onClick={() => startEdit(service)}>
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleEnabled(service.id, service.is_enabled)}
              >
                {service.is_enabled ? 'Disable' : 'Enable'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(service.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {services.length === 0 && !showForm && (
        <Card className="text-center py-12">
          <p className="text-charcoal-600">No services yet. Add your first service to get started!</p>
        </Card>
      )}
    </div>
  )
}
