import { useEffect, useState } from 'react'
import { Star, CheckCircle } from 'lucide-react'
import Container from '../../components/ui/Container'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import { supabase } from '../../lib/supabase'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: '',
    rating: 5,
    review_text: '',
    project_title: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadReviews()
  }, [])

  async function loadReviews() {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    if (data) {
      setReviews(data)
    }

    setLoading(false)
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

    if (!formData.review_text.trim()) {
      newErrors.review_text = 'Review text is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validate()) {
      return
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .insert([{
          ...formData,
          is_approved: false,
          is_featured: false
        }])

      if (error) throw error

      setSubmitted(true)
      setFormData({
        customer_name: '',
        rating: 5,
        review_text: '',
        project_title: '',
      })
      setShowForm(false)

      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-wood-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-charcoal-600">Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-beige-50 to-white py-16 md:py-24">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mb-6">Customer Reviews</h1>
            <p className="text-xl text-charcoal-600 leading-relaxed mb-8">
              Read what our satisfied customers have to say about our work
            </p>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Hide Form' : 'Write a Review'}
            </Button>
          </div>
        </Container>
      </section>

      {submitted && (
        <section className="py-8 bg-green-50">
          <Container size="md">
            <div className="flex items-center justify-center space-x-3 text-green-800">
              <CheckCircle className="w-6 h-6" />
              <span className="font-medium">
                Thank you! Your review has been submitted and is pending approval.
              </span>
            </div>
          </Container>
        </section>
      )}

      {showForm && (
        <section className="py-12 bg-white border-b border-charcoal-200">
          <Container size="md">
            <Card className="p-8">
              <h3 className="text-2xl font-semibold mb-6">Write Your Review</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Your Name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  error={errors.customer_name}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, rating: i + 1 }))}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 cursor-pointer transition-colors ${
                            i < formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-charcoal-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-4 text-charcoal-600">
                      {formData.rating} {formData.rating === 1 ? 'star' : 'stars'}
                    </span>
                  </div>
                </div>

                <Input
                  label="Project Title (Optional)"
                  name="project_title"
                  value={formData.project_title}
                  onChange={handleChange}
                  helperText="e.g., Kitchen Renovation, Custom Wardrobe"
                />

                <Textarea
                  label="Your Review"
                  name="review_text"
                  value={formData.review_text}
                  onChange={handleChange}
                  error={errors.review_text}
                  helperText="Share your experience with our services"
                  rows={5}
                  required
                />

                <div className="bg-beige-50 p-4 rounded-lg">
                  <p className="text-sm text-charcoal-700">
                    Your review will be reviewed by our team before being published on the website.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" fullWidth>Submit Review</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} fullWidth>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </Container>
        </section>
      )}

      <section className="py-16 bg-white">
        <Container>
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-charcoal-600">No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
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

                  <p className="text-charcoal-700 mb-4 flex-1 italic leading-relaxed">
                    "{review.review_text}"
                  </p>

                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-wood-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-wood-800 font-semibold text-lg">
                        {review.customer_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-charcoal-900">{review.customer_name}</div>
                      {review.project_title && (
                        <div className="text-sm text-charcoal-600">{review.project_title}</div>
                      )}
                      <div className="text-xs text-charcoal-500 mt-1">
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  )
}
