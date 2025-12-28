import { useEffect, useState } from 'react'
import { Mail, Phone, MapPin, Calendar } from 'lucide-react'
import Card from '../../components/ui/Card'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import Button from '../../components/ui/Button'
import { supabase } from '../../lib/supabase'

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<any[]>([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    loadInquiries()
  }, [])

  async function loadInquiries() {
    let query = supabase.from('inquiries').select('*').order('created_at', { ascending: false })

    if (filter !== 'All') {
      query = query.eq('status', filter)
    }

    const { data } = await query
    if (data) setInquiries(data)
    setLoading(false)
  }

  useEffect(() => {
    loadInquiries()
  }, [filter])

  async function updateInquiry(id: string, updates: any) {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      loadInquiries()
      setEditingId(null)
      alert('Inquiry updated successfully!')
    } catch (error) {
      console.error('Error updating inquiry:', error)
      alert('Failed to update inquiry')
    }
  }

  function startEdit(inquiry: any) {
    setEditingId(inquiry.id)
    setStatus(inquiry.status)
    setNotes(inquiry.admin_notes || '')
  }

  const statusOptions = [
    { value: 'New', label: 'New' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
  ]

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-display font-semibold text-charcoal-900">Inquiries</h2>
          <p className="text-charcoal-600 mt-1">Manage customer inquiries and requests</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2">
          {['All', 'New', 'In Progress', 'Completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-wood-700 text-white'
                  : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <Card key={inquiry.id}>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{inquiry.customer_name}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    inquiry.status === 'New' ? 'bg-green-100 text-green-800' :
                    inquiry.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-charcoal-100 text-charcoal-800'
                  }`}>
                    {inquiry.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-charcoal-600">
                    <Mail className="w-4 h-4" />
                    <span>{inquiry.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-charcoal-600">
                    <Phone className="w-4 h-4" />
                    <span>{inquiry.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-charcoal-600">
                    <MapPin className="w-4 h-4" />
                    <span>{inquiry.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-charcoal-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(inquiry.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-charcoal-700 mb-1">Service Type:</p>
                  <p className="text-sm text-charcoal-600">{inquiry.service_type}</p>
                </div>

                {inquiry.budget_range && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-charcoal-700 mb-1">Budget Range:</p>
                    <p className="text-sm text-charcoal-600">{inquiry.budget_range}</p>
                  </div>
                )}

                {inquiry.message && (
                  <div>
                    <p className="text-sm font-medium text-charcoal-700 mb-1">Message:</p>
                    <p className="text-sm text-charcoal-600">{inquiry.message}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {editingId === inquiry.id ? (
                  <>
                    <Select
                      label="Status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      options={statusOptions}
                    />
                    <Textarea
                      label="Admin Notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateInquiry(inquiry.id, { status, admin_notes: notes })}
                        fullWidth
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        fullWidth
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {inquiry.admin_notes && (
                      <div>
                        <p className="text-sm font-medium text-charcoal-700 mb-1">Admin Notes:</p>
                        <p className="text-sm text-charcoal-600">{inquiry.admin_notes}</p>
                      </div>
                    )}
                    <Button size="sm" onClick={() => startEdit(inquiry)} fullWidth>
                      Update Status
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {inquiries.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-charcoal-600">No inquiries found.</p>
        </Card>
      )}
    </div>
  )
}
