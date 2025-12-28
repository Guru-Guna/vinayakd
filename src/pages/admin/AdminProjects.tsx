import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Select from '../../components/ui/Select'
import { supabase } from '../../lib/supabase'

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Residential',
    materials_used: '',
    completion_time: '',
    is_published: false,
    featured: false,
    display_order: 0,
  })

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('display_order')

    if (data) setProjects(data)
    setLoading(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
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
          .from('projects')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([formData])

        if (error) throw error
      }

      loadProjects()
      resetForm()
      alert(editingId ? 'Project updated successfully!' : 'Project created successfully!')
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error

      loadProjects()
      alert('Project deleted successfully!')
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    }
  }

  async function togglePublish(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_published: !currentStatus })
        .eq('id', id)

      if (error) throw error

      loadProjects()
    } catch (error) {
      console.error('Error toggling publish status:', error)
    }
  }

  function startEdit(project: any) {
    setEditingId(project.id)
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      materials_used: project.materials_used || '',
      completion_time: project.completion_time || '',
      is_published: project.is_published,
      featured: project.featured,
      display_order: project.display_order,
    })
    setShowForm(true)
  }

  function resetForm() {
    setEditingId(null)
    setFormData({
      title: '',
      description: '',
      category: 'Residential',
      materials_used: '',
      completion_time: '',
      is_published: false,
      featured: false,
      display_order: 0,
    })
    setShowForm(false)
  }

  const categoryOptions = [
    { value: 'Residential', label: 'Residential' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Modular Kitchen', label: 'Modular Kitchen' },
    { value: 'Custom Furniture', label: 'Custom Furniture' },
  ]

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-display font-semibold text-charcoal-900">Projects</h2>
          <p className="text-charcoal-600 mt-1">Manage your portfolio projects</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Project'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Project' : 'New Project'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Project Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={categoryOptions}
              />
            </div>

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Materials Used"
                name="materials_used"
                value={formData.materials_used}
                onChange={handleChange}
              />
              <Input
                label="Completion Time"
                name="completion_time"
                value={formData.completion_time}
                onChange={handleChange}
                helperText="e.g., 3 weeks"
              />
            </div>

            <Input
              label="Display Order"
              type="number"
              name="display_order"
              value={formData.display_order}
              onChange={handleChange}
            />

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                  className="w-5 h-5 rounded"
                />
                <span>Published</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-5 h-5 rounded"
                />
                <span>Featured on Homepage</span>
              </label>
            </div>

            <div className="flex gap-4">
              <Button type="submit">{editingId ? 'Update' : 'Create'} Project</Button>
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} padding="none" className="overflow-hidden">
            <div className="w-full h-48 bg-beige-200 flex items-center justify-center">
              <span className="text-charcoal-400">No image</span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-wood-700 font-medium">{project.category}</span>
                <div className="flex items-center space-x-2">
                  {project.is_published ? (
                    <Eye className="w-4 h-4 text-green-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-charcoal-400" />
                  )}
                  {project.featured && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Featured</span>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
              <p className="text-sm text-charcoal-600 mb-4 line-clamp-2">{project.description}</p>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost" onClick={() => startEdit(project)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => togglePublish(project.id, project.is_published)}
                >
                  {project.is_published ? 'Unpublish' : 'Publish'}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(project.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {projects.length === 0 && !showForm && (
        <Card className="text-center py-12">
          <p className="text-charcoal-600">No projects yet. Add your first project to get started!</p>
        </Card>
      )}
    </div>
  )
}
