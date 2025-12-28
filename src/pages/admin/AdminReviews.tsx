import { useEffect, useState } from 'react'
import { Star, Check, X, Eye, EyeOff } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { supabase } from '../../lib/supabase'

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReviews()
  }, [filter])

  async function loadReviews() {
    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false })

    if (filter === 'Pending') {
      query = query.eq('is_approved', false)
    } else if (filter === 'Approved') {
      query = query.eq('is_approved', true)
    }

    const { data } = await query
    if (data) setReviews(data)
    setLoading(false)
  }

  async function updateReview(id: string, updates: any) {
    try {
      const { error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      loadReviews()
    } catch (error) {
      console.error('Error updating review:', error)
    }
  }

  async function deleteReview(id: string) {
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadReviews()
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-display font-semibold text-charcoal-900">Reviews</h2>
          <p className="text-charcoal-600 mt-1">Manage customer reviews and testimonials</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2">
          {['All', 'Pending', 'Approved'].map((f) => (
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

      <div className="grid md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <Card key={review.id}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-charcoal-300'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center space-x-2">
                {review.is_approved ? (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Approved</span>
                ) : (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
                )}
                {review.is_featured && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Featured</span>
                )}
              </div>
            </div>

            <p className="text-charcoal-700 mb-4 italic">"{review.review_text}"</p>

            <div className="mb-4">
              <p className="font-semibold text-charcoal-900">{review.customer_name}</p>
              {review.project_title && (
                <p className="text-sm text-charcoal-600">{review.project_title}</p>
              )}
              <p className="text-xs text-charcoal-500 mt-1">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {!review.is_approved && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => updateReview(review.id, { is_approved: true })}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
              )}
              {review.is_approved && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => updateReview(review.id, { is_approved: false })}
                >
                  <X className="w-4 h-4 mr-1" />
                  Unapprove
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => updateReview(review.id, { is_featured: !review.is_featured })}
              >
                {review.is_featured ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {review.is_featured ? 'Unfeature' : 'Feature'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteReview(review.id)}
              >
                <X className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-charcoal-600">No reviews found.</p>
        </Card>
      )}
    </div>
  )
}
