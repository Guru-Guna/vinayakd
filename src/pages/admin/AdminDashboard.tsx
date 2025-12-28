import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Mail, Star, TrendingUp, Users } from 'lucide-react'
import Card from '../../components/ui/Card'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    totalInquiries: 0,
    newInquiries: 0,
    totalReviews: 0,
    pendingReviews: 0,
    totalInterests: 0,
  })
  const [recentInquiries, setRecentInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      const [
        projectsRes,
        publishedRes,
        inquiriesRes,
        newInquiriesRes,
        reviewsRes,
        pendingReviewsRes,
        interestsRes,
        recentRes
      ] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('inquiries').select('id', { count: 'exact', head: true }),
        supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'New'),
        supabase.from('reviews').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('is_approved', false),
        supabase.from('interest_registrations').select('id', { count: 'exact', head: true }),
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5)
      ])

      setStats({
        totalProjects: projectsRes.count || 0,
        publishedProjects: publishedRes.count || 0,
        totalInquiries: inquiriesRes.count || 0,
        newInquiries: newInquiriesRes.count || 0,
        totalReviews: reviewsRes.count || 0,
        pendingReviews: pendingReviewsRes.count || 0,
        totalInterests: interestsRes.count || 0,
      })

      if (recentRes.data) {
        setRecentInquiries(recentRes.data)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-wood-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-charcoal-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      subtitle: `${stats.publishedProjects} published`,
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/admin/projects'
    },
    {
      title: 'Inquiries',
      value: stats.totalInquiries,
      subtitle: `${stats.newInquiries} new`,
      icon: Mail,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/admin/inquiries',
      badge: stats.newInquiries > 0 ? stats.newInquiries : null
    },
    {
      title: 'Reviews',
      value: stats.totalReviews,
      subtitle: `${stats.pendingReviews} pending approval`,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      link: '/admin/reviews',
      badge: stats.pendingReviews > 0 ? stats.pendingReviews : null
    },
    {
      title: 'Interest Registrations',
      value: stats.totalInterests,
      subtitle: 'Total leads',
      icon: Users,
      color: 'text-wood-700',
      bgColor: 'bg-wood-100',
      link: '/admin/inquiries'
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-display font-semibold text-charcoal-900">Dashboard Overview</h2>
        <p className="text-charcoal-600 mt-1">Welcome back! Here's what's happening with your business.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} to={stat.link}>
              <Card hover className="relative">
                {stat.badge && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {stat.badge}
                    </div>
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-charcoal-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-display font-bold text-charcoal-900 mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-charcoal-500">{stat.subtitle}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Recent Inquiries</h3>
            <Link to="/admin/inquiries" className="text-wood-700 hover:text-wood-800 text-sm font-medium">
              View All
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="text-center py-8 text-charcoal-500">
              No inquiries yet
            </div>
          ) : (
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-start space-x-4 p-4 bg-beige-50 rounded-lg">
                  <div className="w-10 h-10 bg-wood-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-wood-800 font-semibold">
                      {inquiry.customer_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-charcoal-900 truncate">{inquiry.customer_name}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        inquiry.status === 'New' ? 'bg-green-100 text-green-800' :
                        inquiry.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-charcoal-100 text-charcoal-800'
                      }`}>
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="text-sm text-charcoal-600 truncate">{inquiry.service_type}</p>
                    <p className="text-xs text-charcoal-500 mt-1">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Quick Actions</h3>
          </div>

          <div className="space-y-3">
            <Link to="/admin/projects">
              <button className="w-full text-left p-4 bg-wood-50 hover:bg-wood-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-wood-200 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-wood-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-charcoal-900">Add New Project</div>
                    <div className="text-sm text-charcoal-600">Upload portfolio work</div>
                  </div>
                </div>
              </button>
            </Link>

            <Link to="/admin/inquiries">
              <button className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-charcoal-900">Review Inquiries</div>
                    <div className="text-sm text-charcoal-600">Manage customer requests</div>
                  </div>
                </div>
              </button>
            </Link>

            <Link to="/admin/reviews">
              <button className="w-full text-left p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-charcoal-900">Approve Reviews</div>
                      {stats.pendingReviews > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {stats.pendingReviews}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-charcoal-600">Moderate customer feedback</div>
                  </div>
                </div>
              </button>
            </Link>

            <Link to="/admin/settings">
              <button className="w-full text-left p-4 bg-charcoal-50 hover:bg-charcoal-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-charcoal-200 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-charcoal-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-charcoal-900">Website Settings</div>
                    <div className="text-sm text-charcoal-600">Update site content</div>
                  </div>
                </div>
              </button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
